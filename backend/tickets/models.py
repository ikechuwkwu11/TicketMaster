from django.db import models


class TicketOrder(models.Model):
    """Owned ticket order shown under My Tickets."""

    BUCKET_UPCOMING = 'upcoming'
    BUCKET_PAST = 'past'
    BUCKET_CHOICES = [
        (BUCKET_UPCOMING, 'Upcoming'),
        (BUCKET_PAST, 'Past'),
    ]

    public_id = models.CharField(max_length=64, unique=True, db_index=True)
    slug = models.SlugField(max_length=160, unique=True)
    title = models.CharField(max_length=255)
    display_title = models.CharField(max_length=255, blank=True)
    image = models.CharField(max_length=1000)
    date_label = models.CharField(max_length=120, blank=True)
    venue = models.CharField(max_length=255, blank=True)
    venue_short = models.CharField(max_length=255, blank=True)
    order_number = models.CharField(max_length=64, blank=True)
    map_query = models.CharField(max_length=255, blank=True)
    map_embed = models.CharField(max_length=1000, blank=True)
    entry_info = models.CharField(max_length=120, blank=True, default='Mobile Ticket')
    ticket_info_note = models.CharField(
        max_length=255,
        blank=True,
        default='NO PROF CAMS VID/AUD REC',
    )
    city = models.CharField(max_length=120, blank=True)
    entrance = models.CharField(max_length=120, blank=True)
    purchase_date = models.CharField(max_length=120, blank=True)
    face_value = models.CharField(max_length=32, blank=True, default='200.00')
    grand_total = models.CharField(max_length=32, blank=True, default='216.44')
    ticket_type = models.CharField(
        max_length=120,
        blank=True,
        default='Verified Fan Presale',
    )
    barcode = models.CharField(max_length=64, blank=True)
    terms = models.TextField(blank=True)
    bucket = models.CharField(
        max_length=16,
        choices=BUCKET_CHOICES,
        default=BUCKET_UPCOMING,
        db_index=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.display_title or self.title

    @property
    def quantity(self):
        return self.seats.count()


class Seat(models.Model):
    """Individual seat belonging to a ticket order."""

    order = models.ForeignKey(
        TicketOrder,
        on_delete=models.CASCADE,
        related_name='seats',
    )
    public_id = models.CharField(max_length=64, unique=True, db_index=True)
    admission_type = models.CharField(max_length=64, default='Custom Admission')
    section = models.CharField(max_length=32)
    row = models.CharField(max_length=32)
    seat = models.CharField(max_length=32)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['sort_order', 'section', 'row', 'seat']

    def __str__(self):
        return f'Sec {self.section} Row {self.row} Seat {self.seat}'
