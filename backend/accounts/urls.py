from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import AdminLoginView, AdminMeView

urlpatterns = [
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('admin/me/', AdminMeView.as_view(), name='admin-me'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
