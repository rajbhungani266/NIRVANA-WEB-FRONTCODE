"""
apps/leads/views.py
─────────────────────────────────────────────
Public:
  POST /api/leads/   → Submit inquiry

Admin (JWT):
  GET   /api/admin/leads/         → List all leads (filterable)
  GET   /api/admin/leads/{id}/    → Lead detail
  PATCH /api/admin/leads/{id}/    → Update (mark as contacted, add notes)
  DELETE /api/admin/leads/{id}/   → Delete lead
"""
from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
import django_filters

from .models import Lead
from .serializers import LeadCreateSerializer, LeadAdminSerializer
from apps.core.pagination import StandardResultsPagination


# ─── Lead Filter ──────────────────────────────────────────────────────────────

class LeadFilter(django_filters.FilterSet):
    is_contacted = django_filters.BooleanFilter()
    inquiry_type = django_filters.ChoiceFilter(choices=Lead.inquiry_type.field.choices)
    date_from    = django_filters.DateFilter(field_name="created_at", lookup_expr="gte")
    date_to      = django_filters.DateFilter(field_name="created_at", lookup_expr="lte")

    class Meta:
        model  = Lead
        fields = ["is_contacted", "inquiry_type", "property"]


# ═══════════════════════════════════════════════════════════════
# PUBLIC VIEWS
# ═══════════════════════════════════════════════════════════════

class LeadCreateView(generics.CreateAPIView):
    """
    POST /api/leads/
    Submit an inquiry from any form on the website.

    Body (JSON):
      {
        "name":         "Rajesh Patel",
        "mobile":       "9876543210",
        "email":        "rajesh@email.com",        (optional)
        "property":     1,                          (optional, property ID)
        "inquiry_type": "call_back",               (optional, default: call_back)
        "message":      "Interested in 3BHK...",   (optional)
        "source_page":  "/properties/sky-residences" (optional)
      }
    """
    permission_classes = [AllowAny]
    serializer_class   = LeadCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        lead = serializer.save()

        return Response(
            {
                "success": True,
                "message": "Thank you! We will contact you shortly.",
                "lead_id": lead.id,
            },
            status=status.HTTP_201_CREATED,
        )


# ═══════════════════════════════════════════════════════════════
# ADMIN VIEWS (JWT protected)
# ═══════════════════════════════════════════════════════════════

class LeadAdminListView(generics.ListAPIView):
    """
    GET /api/admin/leads/
    List all leads with filters, search, and pagination.

    Query params:
      ?is_contacted=true|false
      ?inquiry_type=call_back|site_visit|brochure|general
      ?property=<id>
      ?date_from=2024-01-01
      ?date_to=2024-12-31
      ?search=<name or mobile>
      ?page=&page_size=
    """
    permission_classes = [IsAuthenticated]
    serializer_class   = LeadAdminSerializer
    pagination_class   = StandardResultsPagination
    filter_backends    = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class    = LeadFilter
    search_fields      = ["name", "mobile", "email", "property__title"]
    ordering_fields    = ["created_at", "is_contacted"]
    ordering           = ["-created_at"]

    def get_queryset(self):
        return Lead.objects.select_related("property")


class LeadAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/admin/leads/{id}/   → Lead detail
    PATCH  /api/admin/leads/{id}/   → Update (mark contacted, add notes)
    DELETE /api/admin/leads/{id}/   → Delete
    """
    permission_classes = [IsAuthenticated]
    serializer_class   = LeadAdminSerializer
    queryset           = Lead.objects.select_related("property")
    http_method_names  = ["get", "patch", "delete", "head", "options"]
