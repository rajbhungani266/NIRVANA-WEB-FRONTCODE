"""apps/blog/admin_urls.py — Admin blog URLs"""
from django.urls import path
from .views import BlogAdminListCreateView, BlogAdminDetailView

urlpatterns = [
    path("",          BlogAdminListCreateView.as_view(), name="admin-blog-list"),
    path("<int:pk>/", BlogAdminDetailView.as_view(),     name="admin-blog-detail"),
]
