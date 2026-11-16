import uuid

from rest_framework import serializers

from .models import Event, HomepageSection, MediaImage


class HomepageSectionSerializer(serializers.ModelSerializer):
    cardType = serializers.CharField(source='card_type', required=False)
    sortOrder = serializers.IntegerField(source='sort_order', required=False)
    isActive = serializers.BooleanField(source='is_active', required=False)

    class Meta:
        model = HomepageSection
        fields = [
            'id',
            'key',
            'label',
            'path',
            'cardType',
            'sortOrder',
            'isActive',
        ]


class EventSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='public_id', required=False)
    dateLabel = serializers.CharField(
        source='date_label',
        required=False,
        allow_blank=True,
    )
    eventCount = serializers.IntegerField(
        source='event_count',
        required=False,
        allow_null=True,
    )
    hasPresale = serializers.BooleanField(source='has_presale', required=False)
    sectionKey = serializers.SlugRelatedField(
        source='section',
        slug_field='key',
        queryset=HomepageSection.objects.all(),
    )

    class Meta:
        model = Event
        fields = [
            'id',
            'sectionKey',
            'slug',
            'title',
            'image',
            'category',
            'month',
            'day',
            'weekday',
            'time',
            'year',
            'dateLabel',
            'location',
            'venue',
            'accent',
            'eventCount',
            'hasPresale',
            'sort_order',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        public_id = self.initial_data.get('id') or validated_data.get('public_id')
        validated_data['public_id'] = public_id or f'ev-{uuid.uuid4().hex[:10]}'
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'id' in self.initial_data:
            validated_data['public_id'] = self.initial_data['id']
        return super().update(instance, validated_data)


class MediaImageSerializer(serializers.ModelSerializer):
    resolvedUrl = serializers.SerializerMethodField()

    class Meta:
        model = MediaImage
        fields = ['id', 'name', 'url', 'file', 'resolvedUrl', 'created_at']
        read_only_fields = ['created_at', 'resolvedUrl']

    def get_resolvedUrl(self, obj):
        url = obj.resolved_url
        request = self.context.get('request')
        if url and request and url.startswith('/'):
            return request.build_absolute_uri(url)
        return url

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['url'] = data.get('resolvedUrl') or data.get('url') or ''
        data['id'] = f'img-{instance.pk}'
        return data
