"""Send Ticketmaster-style transfer-ready emails via Gmail SMTP."""

from __future__ import annotations

import mimetypes
import smtplib
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen

from django.conf import settings
from django.template.loader import render_to_string

REPO_ROOT = Path(settings.BASE_DIR).resolve().parent
PUBLIC_DIR = REPO_ROOT / 'public'


def _q(value: str) -> str:
    """URL-encode query values — including `/` (e.g. 'w/ Devon')."""
    return quote(str(value or ''), safe='')


def _absolute_public_url(path_or_url: str) -> str:
    raw = (path_or_url or '').strip()
    if not raw:
        return ''
    if raw.startswith('http://') or raw.startswith('https://'):
        return raw
    base = (getattr(settings, 'FRONTEND_PUBLIC_URL', '') or '').rstrip('/')
    if not base:
        return raw
    if raw.startswith('/'):
        return f'{base}{raw}'
    return f'{base}/{raw}'


def _guess_subtype(name: str, content_type: str | None = None) -> str:
    if content_type and '/' in content_type:
        return content_type.split('/', 1)[1].split(';', 1)[0].strip() or 'jpeg'
    guessed, _ = mimetypes.guess_type(name)
    if guessed and '/' in guessed:
        return guessed.split('/', 1)[1]
    return 'jpeg'


def _load_image_bytes(image: str) -> tuple[bytes, str] | None:
    """Load ticket art for inline CID embedding."""
    raw = (image or '').strip()
    if not raw or raw.startswith('data:'):
        return None

    # Local public/ file first (works even if shipstatic DNS flakes)
    if raw.startswith('/'):
        local = PUBLIC_DIR / raw.lstrip('/')
        if local.is_file():
            return local.read_bytes(), _guess_subtype(local.name)

    # Relative path without leading slash
    if not raw.startswith('http://') and not raw.startswith('https://'):
        local = PUBLIC_DIR / raw
        if local.is_file():
            return local.read_bytes(), _guess_subtype(local.name)
        local = PUBLIC_DIR / 'images' / Path(raw).name
        if local.is_file():
            return local.read_bytes(), _guess_subtype(local.name)

    url = _absolute_public_url(raw)
    if url.startswith('http://') or url.startswith('https://'):
        try:
            req = Request(url, headers={'User-Agent': 'TicketMasterMailer/1.0'})
            with urlopen(req, timeout=20) as resp:
                data = resp.read()
                if data:
                    return data, _guess_subtype(url, resp.headers.get('Content-Type'))
        except Exception:
            pass

    # Last resort: known seed art
    fallback = PUBLIC_DIR / 'images' / 'olivia-rodrigo.jpg'
    if fallback.is_file():
        return fallback.read_bytes(), 'jpeg'
    return None


def format_seat_label(seats) -> str:
    seats = list(seats or [])
    if not seats:
        return 'General Admission'
    if len(seats) == 1:
        s = seats[0]
        return (
            f"Section {s.get('section')}, Row {s.get('row')}, "
            f"Seat {s.get('seat')}"
        )

    first = seats[0]
    same_block = all(
        s.get('section') == first.get('section')
        and s.get('row') == first.get('row')
        for s in seats
    )
    if same_block:
        nums = [str(s.get('seat')) for s in seats]
        return (
            f"Section {first.get('section')}, Row {first.get('row')}, "
            f"Seats {', '.join(nums)}"
        )

    parts = [
        f"Sec {s.get('section')} Row {s.get('row')} Seat {s.get('seat')}"
        for s in seats
    ]
    return '; '.join(parts)


def build_transfer_email_context(payload: dict, *, image_url: str) -> dict:
    seats = payload.get('seats') or []
    event_title = (
        payload.get('displayTitle')
        or payload.get('title')
        or 'Your Event'
    )
    date_label = payload.get('dateLabel') or payload.get('date_label') or ''
    venue = (
        payload.get('venue')
        or payload.get('venueShort')
        or payload.get('venue_short')
        or ''
    )
    slug = payload.get('slug') or ''
    frontend = (getattr(settings, 'FRONTEND_PUBLIC_URL', '') or '').rstrip('/')

    if payload.get('acceptUrl'):
        accept_url = payload['acceptUrl']
    elif frontend:
        # Keep the accept URL simple — no event title in the query (titles like
        # "w/ Devon" break links in Gmail). Slug is enough for the error page.
        qs = f'?slug={_q(slug)}' if slug else ''
        accept_url = f'{frontend}/accept.html{qs}'
    else:
        accept_url = '/accept.html'

    from_name = (
        payload.get('fromName') or payload.get('transferFromName') or ''
    ).strip()

    return {
        'from_name': from_name,
        'event_title': event_title,
        'date_label': date_label,
        'venue': venue,
        'seat_label': format_seat_label(seats),
        'image_url': image_url,
        'has_image': bool(image_url),
        'accept_url': accept_url,
        'ticket_count': max(1, len(seats) or int(payload.get('quantity') or 1)),
    }


def send_transfer_ready_email(
    *,
    to_email: str,
    ticket_payload: dict,
    from_name: str = '',
) -> dict:
    to_email = (to_email or '').strip()
    if not to_email or '@' not in to_email:
        raise ValueError('A valid recipient email is required.')

    password = getattr(settings, 'EMAIL_HOST_PASSWORD', '')
    if not password:
        raise RuntimeError(
            'EMAIL_HOST_PASSWORD is not set. Add a Gmail App Password to backend/.env'
        )

    payload = {
        **ticket_payload,
        'fromName': from_name or ticket_payload.get('fromName'),
    }

    image_raw = payload.get('image') or ''
    embedded = _load_image_bytes(image_raw)

    if embedded:
        image_url = 'cid:ticket-hero'
    else:
        image_url = _absolute_public_url(image_raw)

    context = build_transfer_email_context(payload, image_url=image_url)
    html = render_to_string('tickets/transfer_ready_email.html', context)

    subject = (
        f"Your Ticket Transfer From"
        f"{(' ' + context['from_name']) if context['from_name'] else ' -'}"
        f" Is Ready To Be Accepted!"
    )

    text = (
        f"{subject}\n\n"
        f"{context['event_title']}\n"
        f"{context['date_label']}\n"
        f"{context['venue']}\n"
        f"{context['seat_label']}\n\n"
        f"Accept tickets: {context['accept_url']}\n\n"
        f"Transfer Status: Pending\n"
        f"You got {context['ticket_count']} ticket(s)! "
        f"You're one step closer to seeing {context['event_title']}.\n"
    )

    sender = formataddr(
        (
            getattr(settings, 'EMAIL_FROM_NAME', 'Ticketmaster'),
            settings.DEFAULT_FROM_EMAIL,
        )
    )

    # multipart/related keeps the photo inline above ACCEPT TICKETS (not as a
    # trailing Gmail attachment).
    root = MIMEMultipart('related')
    root['Subject'] = subject
    root['From'] = sender
    root['To'] = to_email
    root['Reply-To'] = settings.DEFAULT_FROM_EMAIL

    alt = MIMEMultipart('alternative')
    root.attach(alt)
    alt.attach(MIMEText(text, 'plain', 'utf-8'))
    alt.attach(MIMEText(html, 'html', 'utf-8'))

    if embedded:
        data, subtype = embedded
        img = MIMEImage(data, _subtype=subtype)
        img.add_header('Content-ID', '<ticket-hero>')
        img.add_header('Content-Disposition', 'inline', filename=f'ticket.{subtype}')
        root.attach(img)

    host = getattr(settings, 'EMAIL_HOST', 'smtp.gmail.com')
    port = int(getattr(settings, 'EMAIL_PORT', 465))
    user = settings.EMAIL_HOST_USER

    if getattr(settings, 'EMAIL_USE_SSL', True):
        with smtplib.SMTP_SSL(host, port, timeout=60) as smtp:
            smtp.login(user, password)
            smtp.sendmail(settings.DEFAULT_FROM_EMAIL, [to_email], root.as_string())
    else:
        with smtplib.SMTP(host, port, timeout=60) as smtp:
            if getattr(settings, 'EMAIL_USE_TLS', False):
                smtp.starttls()
            smtp.login(user, password)
            smtp.sendmail(settings.DEFAULT_FROM_EMAIL, [to_email], root.as_string())

    return {
        'ok': True,
        'sent': 1,
        'to': to_email,
        'subject': subject,
        'acceptUrl': context['accept_url'],
        'imageEmbedded': bool(embedded),
        'imageUrl': context.get('image_url') or '',
    }
