from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from .models import Event, HomepageSection, MediaImage
from .permissions import IsAdminOrReadOnly
from .serializers import (
    EventSerializer,
    HomepageSectionSerializer,
    MediaImageSerializer,
)


class HomepageSectionViewSet(viewsets.ModelViewSet):
    queryset = HomepageSection.objects.all()
    serializer_class = HomepageSectionSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'key'


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.select_related('section').all()
    serializer_class = EventSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    search_fields = ['title', 'venue', 'location', 'category', 'slug']

    def get_queryset(self):
        qs = super().get_queryset()
        section = self.request.query_params.get('section')
        category = self.request.query_params.get('category')
        if section:
            qs = qs.filter(section__key=section)
        if category:
            qs = qs.filter(category=category)
        return qs

    def get_object(self):
        lookup = self.kwargs.get(self.lookup_field)
        qs = self.filter_queryset(self.get_queryset())
        obj = qs.filter(slug=lookup).first() or qs.filter(public_id=lookup).first()
        if obj is None:
            from rest_framework.exceptions import NotFound

            raise NotFound('Event not found.')
        self.check_object_permissions(self.request, obj)
        return obj

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def by_section(self, request):
        payload = {}
        for section in HomepageSection.objects.filter(is_active=True):
            events = Event.objects.filter(section=section).select_related('section')
            payload[section.key] = EventSerializer(
                events,
                many=True,
                context={'request': request},
            ).data
        return Response(payload)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MediaImageViewSet(viewsets.ModelViewSet):
    queryset = MediaImage.objects.all()
    serializer_class = MediaImageSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        return [IsAdminUser()]


class CatalogBootstrapView(viewsets.ViewSet):
    """Single payload for the React app: sections + events + tickets + images."""

    permission_classes = [AllowAny]

    def list(self, request):
        from tickets.models import TicketOrder
        from tickets.serializers import TicketOrderSerializer

        sections = HomepageSectionSerializer(
            HomepageSection.objects.filter(is_active=True),
            many=True,
        ).data

        events_by_section = {}
        for section in HomepageSection.objects.filter(is_active=True):
            events_by_section[section.key] = EventSerializer(
                Event.objects.filter(section=section),
                many=True,
                context={'request': request},
            ).data

        tickets = {
            'upcoming': TicketOrderSerializer(
                TicketOrder.objects.prefetch_related('seats').filter(
                    bucket=TicketOrder.BUCKET_UPCOMING
                ),
                many=True,
                context={'request': request},
            ).data,
            'past': TicketOrderSerializer(
                TicketOrder.objects.prefetch_related('seats').filter(
                    bucket=TicketOrder.BUCKET_PAST
                ),
                many=True,
                context={'request': request},
            ).data,
        }

        images = MediaImageSerializer(
            MediaImage.objects.all(),
            many=True,
            context={'request': request},
        ).data

        category_labels = {
            s['path']: s['label'] for s in sections if s.get('path')
        }

        return Response(
            {
                'sectionsMeta': sections,
                'sections': events_by_section,
                'upcomingTickets': tickets['upcoming'],
                'pastTickets': tickets['past'],
                'images': images,
                'categoryLabels': category_labels,
            }
        )


class CatalogResetView(viewsets.ViewSet):
    permission_classes = [IsAdminUser]

    def create(self, request):
        from django.core.management import call_command

        call_command('seed_catalog', reset=True)
        return Response({'detail': 'Catalog reset and reseeded.'})
