"""
apps/core/auth_urls.py
─────────────────────────────────────────────
JWT Authentication endpoints.
POST /api/auth/login/   → obtain access + refresh token
POST /api/auth/refresh/ → get new access token
POST /api/auth/verify/  → verify a token is valid
"""
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path("login/",   TokenObtainPairView.as_view(),  name="auth-login"),
    path("refresh/", TokenRefreshView.as_view(),      name="auth-refresh"),
    path("verify/",  TokenVerifyView.as_view(),        name="auth-verify"),
]
