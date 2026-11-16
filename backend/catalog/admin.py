from django.contrib import admin

from .models import Event, HomepageSection, MediaImage


@admin.register(HomepageSection)
class HomepageSectionAdmin(admin.ModelAdmin):
    list_display = ('key', 'label', 'path', 'card_type', 'sort_order', 'is_active')
    list_editable = ('sort_order', 'is_active')
    prepopulated_fields = {'path': ('label',)}


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'section', 'slug', 'category', 'date_label', 'venue')
    list_filter = ('section', 'category', 'has_presale')
    search_fields = ('title', 'slug', 'venue', 'location', 'public_id')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(MediaImage)
class MediaImageAdmin(admin.ModelAdmin):
    list_display = ('name', 'url', 'created_at')
    search_fields = ('name', 'url')
