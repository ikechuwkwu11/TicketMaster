from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from catalog.views import (
    CatalogBootstrapView,
    CatalogResetView,
    EventViewSet,
    HomepageSectionViewSet,
    MediaImageViewSet,
)
from tickets.views import TicketOrderViewSet

router = DefaultRouter()
router.register(r'sections', HomepageSectionViewSet, basename='section')
router.register(r'events', EventViewSet, basename='event')
router.register(r'images', MediaImageViewSet, basename='image')
router.register(r'tickets', TicketOrderViewSet, basename='ticket')
router.register(r'bootstrap', CatalogBootstrapView, basename='bootstrap')

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/push/', include('webpush.urls')),
    path('api/catalog/reset/', CatalogResetView.as_view({'post': 'create'})),
    path('api/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
