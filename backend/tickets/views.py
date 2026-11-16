from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from catalog.permissions import IsAdminOrReadOnly

from .models import TicketOrder
from .serializers import TicketOrderSerializer


class TicketOrderViewSet(viewsets.ModelViewSet):
    queryset = TicketOrder.objects.prefetch_related('seats').all()
    serializer_class = TicketOrderSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    search_fields = ['title', 'display_title', 'venue', 'order_number', 'slug']

    def get_queryset(self):
        qs = super().get_queryset()
        bucket = self.request.query_params.get('bucket')
        if bucket in (TicketOrder.BUCKET_UPCOMING, TicketOrder.BUCKET_PAST):
            qs = qs.filter(bucket=bucket)
        return qs

    def get_object(self):
        lookup = self.kwargs.get(self.lookup_field)
        qs = self.filter_queryset(self.get_queryset())
        obj = qs.filter(slug=lookup).first() or qs.filter(public_id=lookup).first()
        if obj is None:
            from rest_framework.exceptions import NotFound

            raise NotFound('Ticket order not found.')
        self.check_object_permissions(self.request, obj)
        return obj

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def catalog(self, request):
        """Return `{ upcoming: [...], past: [...] }` for My Tickets."""
        upcoming = self.get_queryset().filter(bucket=TicketOrder.BUCKET_UPCOMING)
        past = TicketOrder.objects.prefetch_related('seats').filter(
            bucket=TicketOrder.BUCKET_PAST
        )
        return Response(
            {
                'upcoming': TicketOrderSerializer(
                    upcoming, many=True, context={'request': request}
                ).data,
                'past': TicketOrderSerializer(
                    past, many=True, context={'request': request}
                ).data,
            }
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
