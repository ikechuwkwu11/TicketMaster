import json
import os

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PushSubscription


class VapidPublicKeyView(APIView):
    """Expose only the public VAPID key to the frontend."""

    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        public_key = os.getenv('VAPID_PUBLIC_KEY', '').strip()
        return Response(
            {
                'publicKey': public_key,
                'configured': bool(public_key),
            }
        )


class PushSubscriptionView(APIView):
    """
    Register / remove browser push subscriptions.
    AllowAny so guests can opt in; associate user when authenticated.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data if isinstance(request.data, dict) else {}
        endpoint = data.get('endpoint')
        keys = data.get('keys') or {}
        p256dh = keys.get('p256dh')
        auth = keys.get('auth')

        if not endpoint or not p256dh or not auth:
            return Response(
                {'detail': 'endpoint and keys.p256dh / keys.auth are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user if request.user and request.user.is_authenticated else None
        sub, _created = PushSubscription.objects.update_or_create(
            endpoint=endpoint,
            defaults={
                'user': user,
                'p256dh': p256dh,
                'auth': auth,
                'user_agent': request.META.get('HTTP_USER_AGENT', '')[:512],
            },
        )
        return Response(
            {'id': sub.id, 'endpoint': sub.endpoint},
            status=status.HTTP_201_CREATED,
        )

    def delete(self, request):
        raw = request.body.decode('utf-8') if request.body else '{}'
        try:
            data = json.loads(raw) if raw else {}
        except json.JSONDecodeError:
            data = {}
        if isinstance(request.data, dict) and request.data:
            data = request.data

        endpoint = data.get('endpoint')
        if not endpoint:
            return Response(
                {'detail': 'endpoint is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        PushSubscription.objects.filter(endpoint=endpoint).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
