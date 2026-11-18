from django.contrib import admin

from .models import PushSubscription


@admin.register(PushSubscription)
class PushSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('endpoint', 'user', 'created_at', 'updated_at')
    search_fields = ('endpoint', 'user__username')
    readonly_fields = ('created_at', 'updated_at')
