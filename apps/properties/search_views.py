"""
apps/properties/search_views.py
─────────────────────────────────────────────
Dedicated search views with full filtering support.
  - PropertySearchView       → main search with all filters
  - SearchSuggestionsView    → autocomplete suggestions for city/locality

GET /api/search/?q=&city=&locality=&listing_type=&property_type=
                  &bhk=&min_price=&max_price=&possession_before=
                  &is_rera_verified=&is_featured=&is_gift_city=
                  &sort=price_asc|price_desc|newest|oldest
                  &page=&page_size=
"""
from rest_framework.views import APIView
from rest_framework import generics, filters
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend

from .models import Property
from .serializers import PropertyListSerializer
from .filters import PropertyFilter
from apps.core.pagination import StandardResultsPagination


class PropertySearchView(generics.ListAPIView):
    """
    Main search endpoint — mirrors PropertyListView but lives at /api/search/.
    This is the primary endpoint for the search bar on the homepage.

    All filtering, sorting, and pagination supported.
    SEO tip: Always index property slugs from search results for proper canonical URLs.
    """
    permission_classes = [AllowAny]
    serializer_class   = PropertyListSerializer
    pagination_class   = StandardResultsPagination
    filter_backends    = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class    = PropertyFilter
    ordering_fields    = ["price", "created_at", "possession_date"]
    ordering           = ["-created_at"]

    def get_queryset(self):
        queryset = (
            Property.objects
            .filter(status__in=["active", "price_on_request", "sold_out"])
            .prefetch_related("images", "bhk_configs")
        )

        # Custom sort
        sort = self.request.query_params.get("sort")
        sort_map = {
            "price_asc":  "price",
            "price_desc": "-price",
            "newest":     "-created_at",
            "oldest":     "created_at",
        }
        if sort in sort_map:
            queryset = queryset.order_by(sort_map[sort])

        return queryset

    def list(self, request, *args, **kwargs):
        """Add search metadata to response."""
        response = super().list(request, *args, **kwargs)
        # Inject search metadata
        response.data["search_query"] = request.query_params.get("q", "")
        response.data["applied_filters"] = {
            k: v for k, v in request.query_params.items()
            if k not in ["page", "page_size", "sort"]
        }
        return response


class SearchSuggestionsView(APIView):
    """
    GET /api/search/suggestions/?q=Sindhu
    Returns city and locality suggestions for the search autocomplete bar.
    Returns max 10 unique suggestions combining cities and localities.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        q = request.query_params.get("q", "").strip()

        if len(q) < 2:
            return Response(
                {"suggestions": [], "message": "Type at least 2 characters."}
            )

        # Cities matching query
        cities = (
            Property.objects
            .filter(city__icontains=q, status__in=["active", "price_on_request"])
            .values_list("city", flat=True)
            .distinct()[:5]
        )

        # Localities matching query
        localities = (
            Property.objects
            .filter(locality__icontains=q, status__in=["active", "price_on_request"])
            .values_list("locality", "city")
            .distinct()[:5]
        )

        suggestions = []

        for city in cities:
            suggestions.append({
                "type":  "city",
                "label": city,
                "value": city,
            })

        for locality, city in localities:
            suggestions.append({
                "type":  "locality",
                "label": f"{locality}, {city}",
                "value": locality,
                "city":  city,
            })

        # Deduplicate and limit to 10
        seen = set()
        unique = []
        for s in suggestions:
            key = (s["type"], s["value"])
            if key not in seen:
                seen.add(key)
                unique.append(s)

        return Response({"suggestions": unique[:10], "query": q})
