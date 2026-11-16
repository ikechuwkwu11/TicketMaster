from django.db import models


class HomepageSection(models.Model):
    """Homepage carousel / category section (For You, Concerts, etc.)."""

    CARD_FOR_YOU = 'forYou'
    CARD_EVENT = 'event'
    CARD_JUST_ANNOUNCED = 'justAnnounced'
    CARD_CATEGORY = 'category'
    CARD_CHOICES = [
        (CARD_FOR_YOU, 'For You card'),
        (CARD_EVENT, 'Event card'),
        (CARD_JUST_ANNOUNCED, 'Just announced card'),
        (CARD_CATEGORY, 'Category card'),
    ]

    key = models.SlugField(max_length=64, unique=True)
    label = models.CharField(max_length=120)
    path = models.SlugField(max_length=64, unique=True)
    card_type = models.CharField(max_length=32, choices=CARD_CHOICES, default=CARD_EVENT)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['sort_order', 'label']

    def __str__(self):
        return self.label


class Event(models.Model):
    """Catalog event / artist shown on the public app."""

    public_id = models.CharField(max_length=64, unique=True, db_index=True)
    section = models.ForeignKey(
        HomepageSection,
        on_delete=models.CASCADE,
        related_name='events',
    )
    slug = models.SlugField(max_length=160, unique=True)
    title = models.CharField(max_length=255)
    image = models.CharField(max_length=1000)
    category = models.CharField(max_length=64, blank=True)

    month = models.CharField(max_length=16, blank=True)
    day = models.CharField(max_length=8, blank=True)
    weekday = models.CharField(max_length=24, blank=True)
    time = models.CharField(max_length=32, blank=True)
    year = models.CharField(max_length=8, blank=True)
    date_label = models.CharField(max_length=64, blank=True)

    location = models.CharField(max_length=255, blank=True)
    venue = models.CharField(max_length=255, blank=True)
    accent = models.CharField(max_length=32, blank=True, default='blue')
    event_count = models.PositiveIntegerField(null=True, blank=True)
    has_presale = models.BooleanField(default=False)

    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', '-created_at']

    def __str__(self):
        return self.title


class MediaImage(models.Model):
    """Admin image library entry (uploaded file or external URL)."""

    name = models.CharField(max_length=255)
    url = models.CharField(max_length=2000, blank=True)
    file = models.ImageField(upload_to='uploads/%Y/%m/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def resolved_url(self):
        if self.file:
            return self.file.url
        return self.url
