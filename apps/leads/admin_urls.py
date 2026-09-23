"""apps/leads/admin_urls.py — Admin lead management"""
from django.urls import path
from .views import LeadAdminListView, LeadAdminDetailView

urlpatterns = [
    path("",        LeadAdminListView.as_view(),   name="admin-lead-list"),
    path("<int:pk>/", LeadAdminDetailView.as_view(), name="admin-lead-detail"),
]
