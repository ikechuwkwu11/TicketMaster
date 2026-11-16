from django.contrib import admin

from .models import Seat, TicketOrder


class SeatInline(admin.TabularInline):
    model = Seat
    extra = 0


@admin.register(TicketOrder)
class TicketOrderAdmin(admin.ModelAdmin):
    list_display = (
        'display_title',
        'bucket',
        'order_number',
        'venue',
        'date_label',
    )
    list_filter = ('bucket',)
    search_fields = ('title', 'display_title', 'slug', 'order_number', 'public_id')
    prepopulated_fields = {'slug': ('display_title',)}
    inlines = [SeatInline]


@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ('order', 'section', 'row', 'seat', 'admission_type')
    search_fields = ('section', 'row', 'seat', 'public_id')
