from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


class AdminLoginView(APIView):
    """
    Exchange staff credentials for JWT access/refresh tokens.
    Only users with is_staff=True may sign into the React admin.
    """

    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        username = (request.data.get('username') or '').strip()
        password = request.data.get('password') or ''

        user = authenticate(username=username, password=password)
        if user is None or not user.is_active or not user.is_staff:
            return Response(
                {'detail': 'Invalid credentials or not an admin user.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                },
            }
        )


class AdminMeView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        user: User = request.user
        return Response(
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
            }
        )
