"""
Optional helper for sending Web Push messages from Django.

Requires:
  pip install pywebpush
  VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY / VAPID_ADMIN_EMAIL in environment

This module is intentionally unused until you call it from booking/ticket flows.
It never auto-sends without an explicit server-side call.
"""

from __future__ import annotations

import json
import os

from django.conf import settings

from .models import PushSubscription


def send_push_notification(
    *,
    title: str,
    body: str,
    url: str = '/',
    subscription: PushSubscription | None = None,
    user=None,
):
    """
    Send a notification to one subscription or all subscriptions for a user.
    Returns a summary dict. Safe no-op when VAPID keys are missing.
    """
    public_key = os.getenv('VAPID_PUBLIC_KEY', '').strip()
    private_key = os.getenv('VAPID_PRIVATE_KEY', '').strip()
    admin_email = os.getenv('VAPID_ADMIN_EMAIL', 'mailto:admin@ticketmaster.local')

    if not public_key or not private_key:
        return {'sent': 0, 'detail': 'VAPID keys not configured'}

    try:
        from pywebpush import WebPushException, webpush
    except ImportError:
        return {'sent': 0, 'detail': 'pywebpush is not installed'}

    qs = PushSubscription.objects.all()
    if subscription is not None:
        qs = qs.filter(pk=subscription.pk)
    elif user is not None:
        qs = qs.filter(user=user)

    payload = json.dumps(
        {
            'title': title,
            'body': body,
            'url': url,
        }
    )

    sent = 0
    errors = []
    for sub in qs:
        try:
            webpush(
                subscription_info={
                    'endpoint': sub.endpoint,
                    'keys': {'p256dh': sub.p256dh, 'auth': sub.auth},
                },
                data=payload,
                vapid_private_key=private_key,
                vapid_claims={'sub': admin_email},
            )
            sent += 1
        except WebPushException as exc:
            # Drop gone subscriptions
            status = getattr(getattr(exc, 'response', None), 'status_code', None)
            if status in (404, 410):
                sub.delete()
            errors.append(str(exc))
        except Exception as exc:  # noqa: BLE001
            errors.append(str(exc))

    return {'sent': sent, 'errors': errors[:5], 'debug': settings.DEBUG}
