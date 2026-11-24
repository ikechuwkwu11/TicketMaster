import uuid

from rest_framework import serializers

from .models import Seat, TicketOrder


class SeatSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='public_id', required=False)
    type = serializers.CharField(
        source='admission_type',
        required=False,
        default='Custom Admission',
    )

    class Meta:
        model = Seat
        fields = ['id', 'type', 'section', 'row', 'seat', 'sort_order']


class TicketOrderSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='public_id', required=False)
    displayTitle = serializers.CharField(
        source='display_title',
        required=False,
        allow_blank=True,
    )
    dateLabel = serializers.CharField(
        source='date_label',
        required=False,
        allow_blank=True,
    )
    venueShort = serializers.CharField(
        source='venue_short',
        required=False,
        allow_blank=True,
    )
    orderNumber = serializers.CharField(
        source='order_number',
        required=False,
        allow_blank=True,
    )
    mapQuery = serializers.CharField(
        source='map_query',
        required=False,
        allow_blank=True,
    )
    mapEmbed = serializers.CharField(
        source='map_embed',
        required=False,
        allow_blank=True,
    )
    entryInfo = serializers.CharField(
        source='entry_info',
        required=False,
        allow_blank=True,
    )
    ticketInfoNote = serializers.CharField(
        source='ticket_info_note',
        required=False,
        allow_blank=True,
    )
    purchaseDate = serializers.CharField(
        source='purchase_date',
        required=False,
        allow_blank=True,
    )
    faceValue = serializers.CharField(
        source='face_value',
        required=False,
        allow_blank=True,
    )
    grandTotal = serializers.CharField(
        source='grand_total',
        required=False,
        allow_blank=True,
    )
    ticketType = serializers.CharField(
        source='ticket_type',
        required=False,
        allow_blank=True,
    )
    recipientName = serializers.CharField(
        source='recipient_name',
        required=False,
        allow_blank=True,
    )
    recipientEmail = serializers.EmailField(
        source='recipient_email',
        required=False,
        allow_blank=True,
    )
    transferFromName = serializers.CharField(
        source='transfer_from_name',
        required=False,
        allow_blank=True,
    )
    seats = SeatSerializer(many=True, required=False)
    quantity = serializers.IntegerField(read_only=True)

    class Meta:
        model = TicketOrder
        fields = [
            'id',
            'slug',
            'title',
            'displayTitle',
            'image',
            'dateLabel',
            'venue',
            'venueShort',
            'orderNumber',
            'mapQuery',
            'mapEmbed',
            'entryInfo',
            'ticketInfoNote',
            'city',
            'entrance',
            'purchaseDate',
            'faceValue',
            'grandTotal',
            'ticketType',
            'barcode',
            'terms',
            'recipientName',
            'recipientEmail',
            'transferFromName',
            'bucket',
            'quantity',
            'seats',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at', 'quantity']

    def _normalize_seats(self, raw_seats):
        normalized = []
        for index, raw in enumerate(raw_seats or []):
            normalized.append(
                {
                    'public_id': raw.get('id') or raw.get('public_id'),
                    'admission_type': raw.get('type')
                    or raw.get('admission_type')
                    or 'Custom Admission',
                    'section': raw.get('section'),
                    'row': raw.get('row'),
                    'seat': raw.get('seat'),
                    'sort_order': raw.get('sort_order', index),
                }
            )
        return normalized

    def _upsert_seats(self, order, seats_data):
        order.seats.all().delete()
        for index, seat in enumerate(seats_data or []):
            Seat.objects.create(
                order=order,
                public_id=seat.get('public_id')
                or f"seat-{uuid.uuid4().hex[:10]}",
                admission_type=seat.get('admission_type', 'Custom Admission'),
                section=seat['section'],
                row=seat['row'],
                seat=seat['seat'],
                sort_order=seat.get('sort_order', index),
            )

    def create(self, validated_data):
        validated_data.pop('seats', None)
        public_id = self.initial_data.get('id') or validated_data.get('public_id')
        validated_data['public_id'] = public_id or f't-{uuid.uuid4().hex[:10]}'
        order = TicketOrder.objects.create(**validated_data)
        self._upsert_seats(order, self._normalize_seats(self.initial_data.get('seats')))
        return order

    def update(self, instance, validated_data):
        seats_data = validated_data.pop('seats', None)
        if 'id' in self.initial_data:
            validated_data['public_id'] = self.initial_data['id']
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if seats_data is not None or 'seats' in self.initial_data:
            self._upsert_seats(
                instance,
                self._normalize_seats(self.initial_data.get('seats')),
            )
        return instance
