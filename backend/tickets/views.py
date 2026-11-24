from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from catalog.permissions import IsAdminOrReadOnly

from .mailer import send_transfer_ready_email
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

    def _ticket_payload_from_order(self, order):
        data = TicketOrderSerializer(order, context={'request': self.request}).data
        return data

    def _send_from_payload(self, body):
        to_email = (
            body.get('to')
            or body.get('recipientEmail')
            or body.get('email')
            or ''
        )
        from_name = (
            body.get('fromName')
            or body.get('transferFromName')
            or ''
        )
        ticket = body.get('ticket') or body
        return send_transfer_ready_email(
            to_email=to_email,
            ticket_payload=ticket,
            from_name=from_name,
        )

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

    @action(
        detail=False,
        methods=['post'],
        url_path='send-transfer-email',
        permission_classes=[AllowAny],
    )
    def send_transfer_email(self, request):
        """
        Send the Ticketmaster-style transfer email using ticket fields from the app.

        Body can include the full ticket payload (title, dateLabel, venue, seats,
        image, slug) plus `to` / `recipientEmail` and optional `fromName`.
        """
        try:
            result = self._send_from_payload(request.data)
            return Response(result, status=status.HTTP_200_OK)
        except ValueError as err:
            return Response({'detail': str(err)}, status=status.HTTP_400_BAD_REQUEST)
        except RuntimeError as err:
            return Response({'detail': str(err)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as err:
            return Response(
                {'detail': str(err) or 'Failed to send email.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(
        detail=True,
        methods=['post'],
        url_path='send-transfer-email',
        permission_classes=[IsAdminUser],
    )
    def send_transfer_email_for_ticket(self, request, slug=None):
        """Send transfer email for a saved ticket order (admin)."""
        order = self.get_object()
        body = {
            'to': request.data.get('to') or order.recipient_email,
            'fromName': (
                request.data.get('fromName')
                or order.transfer_from_name
            ),
            'ticket': {
                **self._ticket_payload_from_order(order),
                **{
                    k: v
                    for k, v in (request.data.get('ticket') or {}).items()
                    if v is not None
                },
            },
        }
        if request.data.get('recipientName'):
            order.recipient_name = request.data['recipientName']
        if request.data.get('to') or request.data.get('recipientEmail'):
            order.recipient_email = (
                request.data.get('to') or request.data.get('recipientEmail')
            )
        if request.data.get('fromName'):
            order.transfer_from_name = request.data['fromName']
        order.save(
            update_fields=[
                'recipient_name',
                'recipient_email',
                'transfer_from_name',
                'updated_at',
            ]
        )
        try:
            result = self._send_from_payload(body)
            return Response(result, status=status.HTTP_200_OK)
        except ValueError as err:
            return Response({'detail': str(err)}, status=status.HTTP_400_BAD_REQUEST)
        except RuntimeError as err:
            return Response({'detail': str(err)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as err:
            return Response(
                {'detail': str(err) or 'Failed to send email.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
