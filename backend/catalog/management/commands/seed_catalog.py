"""Seed homepage sections, events, and ticket orders from the original sample data."""

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from catalog.models import Event, HomepageSection
from tickets.models import Seat, TicketOrder

SECTIONS = [
    {'key': 'forYou', 'label': 'For You', 'path': 'for-you', 'card_type': 'forYou', 'sort_order': 1},
    {'key': 'lastMinute', 'label': 'Last Minute', 'path': 'last-minute', 'card_type': 'event', 'sort_order': 2},
    {'key': 'popularWeekend', 'label': 'Popular This Weekend', 'path': 'popular-weekend', 'card_type': 'event', 'sort_order': 3},
    {'key': 'justAnnounced', 'label': 'Just Announced', 'path': 'just-announced', 'card_type': 'justAnnounced', 'sort_order': 4},
    {'key': 'concerts', 'label': 'Concerts', 'path': 'concerts', 'card_type': 'category', 'sort_order': 5},
    {'key': 'sports', 'label': 'Sports', 'path': 'sports', 'card_type': 'category', 'sort_order': 6},
    {'key': 'arts', 'label': 'Arts, Theater & Comedy', 'path': 'arts', 'card_type': 'category', 'sort_order': 7},
    {'key': 'family', 'label': 'Family', 'path': 'family', 'card_type': 'category', 'sort_order': 8},
    {'key': 'festivals', 'label': 'Festivals', 'path': 'festivals', 'card_type': 'category', 'sort_order': 9},
]

EVENTS = {
    'forYou': [
        {'public_id': 'fy-1', 'slug': 'hans-zimmer-live-2027', 'title': 'HANS ZIMMER', 'image': '/images/hans-zimmer.jpg', 'month': 'APR', 'day': '01', 'weekday': 'Thursday', 'time': '7:30PM', 'year': '2027', 'location': 'Los Angeles, US - Crypto.com Arena', 'accent': 'blue', 'category': 'concerts'},
        {'public_id': 'fy-2', 'slug': 'dancing-with-the-stars', 'title': 'DANCING WITH THE STARS', 'image': '/images/dancing.jpg', 'month': 'APR', 'day': '02', 'weekday': 'Friday', 'time': '8:00PM', 'year': '2027', 'location': 'Los Angeles, US - Hollywood Bowl', 'accent': 'orange', 'category': 'arts'},
        {'public_id': 'fy-3', 'slug': 'billie-eilish-hit-me-hard', 'title': 'BILLIE EILISH', 'image': '/images/billie.jpg', 'month': 'MAY', 'day': '14', 'weekday': 'Saturday', 'time': '8:00PM', 'year': '2027', 'location': 'Inglewood, US - SoFi Stadium', 'accent': 'blue', 'category': 'concerts'},
    ],
    'lastMinute': [
        {'public_id': 'lm-1', 'slug': 'static-dress-regent', 'title': 'STATIC DRESS', 'image': '/images/static-dress.jpg', 'date_label': 'Tue 17 Nov', 'time': '7:00 PM', 'venue': 'The Regent Theater', 'location': 'Los Angeles, CA', 'category': 'concerts'},
        {'public_id': 'lm-2', 'slug': 'troy-kingi-lodge-room', 'title': 'TROY KINGI', 'image': '/images/troy-kingi.jpg', 'date_label': 'Tue 17 Nov', 'time': '8:00 PM', 'venue': 'Lodge Room', 'location': 'Los Angeles, CA', 'category': 'concerts'},
        {'public_id': 'lm-3', 'slug': 'local-natives-wiltern', 'title': 'LOCAL NATIVES', 'image': '/images/local-natives.jpg', 'date_label': 'Wed 18 Nov', 'time': '8:00 PM', 'venue': 'The Wiltern', 'location': 'Los Angeles, CA', 'category': 'concerts'},
    ],
    'popularWeekend': [
        {'public_id': 'pw-1', 'slug': 'late-night-thoughts', 'title': 'LATE NIGHT THOUGHTS', 'image': '/images/late-night.jpg', 'date_label': 'Fri 20 Nov', 'time': '9:30 PM', 'venue': 'The Moroccan Lounge', 'location': 'Los Angeles, CA', 'category': 'concerts'},
        {'public_id': 'pw-2', 'slug': 'apashe', 'title': 'APASHE', 'image': '/images/apashe.jpg', 'date_label': 'Sat 21 Nov', 'time': '9:00 PM', 'venue': 'Academy LA', 'location': 'Los Angeles, CA', 'category': 'concerts'},
        {'public_id': 'pw-3', 'slug': 'glass-animals', 'title': 'GLASS ANIMALS', 'image': '/images/glass-animals.jpg', 'date_label': 'Sun 22 Nov', 'time': '8:00 PM', 'venue': 'The Forum', 'location': 'Inglewood, CA', 'category': 'concerts'},
    ],
    'justAnnounced': [
        {'public_id': 'ja-1', 'slug': 'dynamicduo-2027-us-tour', 'title': 'DYNAMICDUO 2027 US TOUR', 'image': '/images/dynamicduo.jpg', 'date_label': 'Sun 31 Jan', 'time': '7:30 PM', 'venue': 'Los Angeles, CA', 'location': 'Los Angeles, CA', 'has_presale': True, 'category': 'concerts'},
        {'public_id': 'ja-2', 'slug': 'coldplay-music-of-spheres', 'title': 'COLDPLAY - MUSIC OF THE SPHERES', 'image': '/images/coldplay.jpg', 'date_label': 'Sat 12 Jun', 'time': '7:00 PM', 'venue': 'Rose Bowl', 'location': 'Pasadena, CA', 'has_presale': True, 'category': 'concerts'},
        {'public_id': 'ja-3', 'slug': 'taylor-swift-eras', 'title': 'TAYLOR SWIFT | THE ERAS TOUR', 'image': '/images/taylor.jpg', 'date_label': 'Fri 20 Aug', 'time': '6:30 PM', 'venue': 'SoFi Stadium', 'location': 'Inglewood, CA', 'has_presale': True, 'category': 'concerts'},
    ],
    'concerts': [
        {'public_id': 'c-1', 'slug': 'system-of-a-down', 'title': 'SYSTEM OF A DOWN', 'image': '/images/soad.jpg', 'event_count': 4, 'category': 'concerts'},
        {'public_id': 'c-2', 'slug': 'twenty-one-pilots', 'title': 'TWENTY ONE PILOTS', 'image': '/images/top.jpg', 'event_count': 1, 'category': 'concerts'},
        {'public_id': 'c-3', 'slug': 'metallica', 'title': 'METALLICA', 'image': '/images/metallica.jpg', 'event_count': 3, 'category': 'concerts'},
    ],
    'sports': [
        {'public_id': 's-1', 'slug': 'los-angeles-dodgers', 'title': 'LOS ANGELES DODGERS', 'image': '/images/dodgers.jpg', 'event_count': 81, 'category': 'sports'},
        {'public_id': 's-2', 'slug': 'pbr-team-series', 'title': 'PBR: TEAM SERIES', 'image': '/images/pbr.jpg', 'event_count': 1, 'category': 'sports'},
        {'public_id': 's-3', 'slug': 'la-lakers', 'title': 'LOS ANGELES LAKERS', 'image': '/images/lakers.jpg', 'event_count': 41, 'category': 'sports'},
    ],
    'arts': [
        {'public_id': 'atc-1', 'slug': 'mojo-brookzz', 'title': 'MOJO BROOKZZ', 'image': '/images/mojo.jpg', 'event_count': 2, 'category': 'arts'},
        {'public_id': 'atc-2', 'slug': 'jo-koy', 'title': 'JO KOY', 'image': '/images/jokoy.jpg', 'event_count': 1, 'category': 'arts'},
        {'public_id': 'atc-3', 'slug': 'dave-chappelle', 'title': 'DAVE CHAPPELLE', 'image': '/images/chappelle.jpg', 'event_count': 3, 'category': 'arts'},
    ],
    'family': [
        {'public_id': 'f-1', 'slug': 'disney-on-ice', 'title': 'DISNEY ON ICE PRESENT...', 'image': '/images/disney.jpg', 'event_count': 10, 'category': 'family'},
        {'public_id': 'f-2', 'slug': 'harlem-globetrotters', 'title': 'HARLEM GLOBETROTTERS', 'image': '/images/globetrotters.jpg', 'event_count': 2, 'category': 'family'},
        {'public_id': 'f-3', 'slug': 'sesame-street-live', 'title': 'SESAME STREET LIVE', 'image': '/images/sesame.jpg', 'event_count': 5, 'category': 'family'},
    ],
    'festivals': [
        {'public_id': 'fest-1', 'slug': 'dreamstate', 'title': 'DREAMSTATE', 'image': '/images/dreamstate.jpg', 'event_count': 2, 'category': 'festivals'},
        {'public_id': 'fest-2', 'slug': 'time-warp-la', 'title': 'TIME WARP LA', 'image': '/images/timewarp.jpg', 'event_count': 2, 'category': 'festivals'},
        {'public_id': 'fest-3', 'slug': 'coachella', 'title': 'COACHELLA', 'image': '/images/coachella.jpg', 'event_count': 1, 'category': 'festivals'},
    ],
}


def make_seats(section, row, start_seat, count):
    return [
        {
            'public_id': f'seat-{section}-{row}-{start_seat + i}',
            'admission_type': 'Custom Admission',
            'section': str(section),
            'row': str(row),
            'seat': str(start_seat + i),
            'sort_order': i,
        }
        for i in range(count)
    ]


TICKETS = [
    {
        'public_id': 't-1',
        'slug': 'noah-kahan-last-of-the-bugs',
        'title': 'NOAH KAHAN: THE LAST OF THE BUGS WORLD TOUR',
        'display_title': 'Noah Kahan: The Last of the Bugs World Tour',
        'image': '/images/noah-kahan.jpg',
        'date_label': 'SAT • JUN 12, 2027 • 6:30 PM',
        'venue': 'Highmark Stadium - Orchard Park, NY',
        'venue_short': 'Highmark Stadium Orchard Park',
        'order_number': '12-44102/HMS',
        'map_query': 'Highmark Stadium Orchard Park NY',
        'map_embed': 'https://www.openstreetmap.org/export/embed.html?bbox=-78.880%2C42.768%2C-78.850%2C42.788&layer=mapnik&marker=42.778%2C-78.865',
        'bucket': 'upcoming',
        'seats': make_seats(112, 'F', 8, 4),
    },
    {
        'public_id': 't-2',
        'slug': 'olivia-rodrigo-unraveled-tour',
        'title': 'OLIVIA RODRIGO: THE UNRAVELED TOUR',
        'display_title': 'Olivia Rodrigo: The Unraveled Tour',
        'image': '/images/olivia-rodrigo.jpg',
        'date_label': 'SAT • DEC 19, 2026 • 7:00 PM',
        'venue': 'TMobile Arena Las Vegas',
        'venue_short': 'TMobile Arena Las Vegas',
        'order_number': '12-68027/TMO',
        'map_query': 'T-Mobile Arena Las Vegas',
        'map_embed': 'https://www.openstreetmap.org/export/embed.html?bbox=-115.195%2C36.092%2C-115.162%2C36.114&layer=mapnik&marker=36.1028%2C-115.1782',
        'bucket': 'upcoming',
        'seats': make_seats(10, 'C', 3, 4),
    },
    {
        'public_id': 't-3',
        'slug': 'the-weeknd-after-hours',
        'title': 'THE WEEKND: AFTER HOURS TIL DAWN TOUR',
        'display_title': 'The Weeknd: After Hours Til Dawn Tour',
        'image': '/images/the-weeknd.jpg',
        'date_label': 'SAT • AUG 15, 2027 • 7:00 PM',
        'venue': 'SoFi Stadium - Inglewood, CA',
        'venue_short': 'SoFi Stadium Inglewood',
        'order_number': '12-90311/SFI',
        'map_query': 'SoFi Stadium Inglewood',
        'map_embed': 'https://www.openstreetmap.org/export/embed.html?bbox=-118.350%2C33.945%2C-118.325%2C33.962&layer=mapnik&marker=33.9535%2C-118.3392',
        'bucket': 'upcoming',
        'seats': make_seats(214, 'A', 1, 3),
    },
    {
        'public_id': 't-4',
        'slug': 'bad-bunny-most-wanted',
        'title': 'BAD BUNNY: MOST WANTED TOUR',
        'display_title': 'Bad Bunny: Most Wanted Tour',
        'image': '/images/bad-bunny.jpg',
        'date_label': 'SUN • SEP 06, 2027 • 8:00 PM',
        'venue': 'Allegiant Stadium - Las Vegas, NV',
        'venue_short': 'Allegiant Stadium Las Vegas',
        'order_number': '12-77140/ALG',
        'map_query': 'Allegiant Stadium Las Vegas',
        'map_embed': 'https://www.openstreetmap.org/export/embed.html?bbox=-115.195%2C36.082%2C-115.170%2C36.098&layer=mapnik&marker=36.0908%2C-115.1833',
        'bucket': 'upcoming',
        'seats': make_seats(18, 'B', 11, 2),
    },
    {
        'public_id': 't-5',
        'slug': 'beyonce-renaissance',
        'title': 'BEYONCÉ: RENAISSANCE WORLD TOUR',
        'display_title': 'Beyoncé: Renaissance World Tour',
        'image': '/images/beyonce.jpg',
        'date_label': 'SAT • MAR 08, 2025 • 7:30 PM',
        'venue': 'MetLife Stadium - East Rutherford, NJ',
        'venue_short': 'MetLife Stadium East Rutherford',
        'order_number': '11-22018/MLF',
        'map_query': 'MetLife Stadium East Rutherford',
        'map_embed': 'https://www.openstreetmap.org/export/embed.html?bbox=-74.085%2C40.805%2C-74.065%2C40.820&layer=mapnik&marker=40.8128%2C-74.0742',
        'bucket': 'past',
        'seats': make_seats(130, 'D', 5, 2),
    },
    {
        'public_id': 't-6',
        'slug': 'drake-its-all-a-blur',
        'title': "DRAKE: IT'S ALL A BLUR TOUR",
        'display_title': "Drake: It's All A Blur Tour",
        'image': '/images/drake.jpg',
        'date_label': 'FRI • NOV 14, 2025 • 8:00 PM',
        'venue': 'Crypto.com Arena - Los Angeles, CA',
        'venue_short': 'Crypto.com Arena Los Angeles',
        'order_number': '11-55890/CCA',
        'map_query': 'Crypto.com Arena Los Angeles',
        'map_embed': 'https://www.openstreetmap.org/export/embed.html?bbox=-118.275%2C34.035%2C-118.255%2C34.050&layer=mapnik&marker=34.0430%2C-118.2673',
        'bucket': 'past',
        'seats': make_seats(101, 'G', 1, 4),
    },
    {
        'public_id': 't-7',
        'slug': 'sza-sos-tour',
        'title': 'SZA: SOS TOUR',
        'display_title': 'SZA: SOS Tour',
        'image': '/images/sza.jpg',
        'date_label': 'THU • JAN 22, 2026 • 8:00 PM',
        'venue': 'The Forum - Inglewood, CA',
        'venue_short': 'The Forum Inglewood',
        'order_number': '11-90112/FRM',
        'map_query': 'The Forum Inglewood',
        'map_embed': 'https://www.openstreetmap.org/export/embed.html?bbox=-118.350%2C33.950%2C-118.330%2C33.965&layer=mapnik&marker=33.9582%2C-118.3419',
        'bucket': 'past',
        'seats': make_seats(8, 'K', 14, 1),
    },
]


class Command(BaseCommand):
    help = 'Seed TicketMaster catalog + create default admin user (admin / admin123)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Clear existing catalog/tickets before seeding',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options['reset']:
            Seat.objects.all().delete()
            TicketOrder.objects.all().delete()
            Event.objects.all().delete()
            HomepageSection.objects.all().delete()
            self.stdout.write(self.style.WARNING('Cleared existing catalog data.'))

        section_map = {}
        for data in SECTIONS:
            section, _ = HomepageSection.objects.update_or_create(
                key=data['key'],
                defaults=data,
            )
            section_map[section.key] = section

        event_count = 0
        for section_key, items in EVENTS.items():
            section = section_map[section_key]
            for index, item in enumerate(items):
                Event.objects.update_or_create(
                    public_id=item['public_id'],
                    defaults={
                        **item,
                        'section': section,
                        'sort_order': index,
                    },
                )
                event_count += 1

        ticket_count = 0
        for raw in TICKETS:
            item = {**raw}
            seats = item.pop('seats')
            order, _ = TicketOrder.objects.update_or_create(
                public_id=item['public_id'],
                defaults=item,
            )
            order.seats.all().delete()
            Seat.objects.bulk_create([Seat(order=order, **seat) for seat in seats])
            ticket_count += 1

        User = get_user_model()
        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@ticketmaster.local',
                'is_staff': True,
                'is_superuser': True,
            },
        )
        if created or not admin.check_password('admin123'):
            admin.set_password('admin123')
            admin.is_staff = True
            admin.is_superuser = True
            admin.save()

        self.stdout.write(
            self.style.SUCCESS(
                f'Seeded {len(section_map)} sections, {event_count} events, '
                f'{ticket_count} ticket orders. Admin user: admin / admin123'
            )
        )
