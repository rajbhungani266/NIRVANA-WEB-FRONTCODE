"""
apps/properties/filters.py
─────────────────────────────────────────────
FilterSet for powerful property search & filtering.
Used by both listing & search endpoints.

Query params supported:
  ?listing_type=buy|rent|investment|plots
  ?property_type=residential|commercial|new_launch|plot
  ?city=Ahmedabad
  ?locality=Sindhubhavan Road
  ?bhk=2bhk,3bhk          (comma-separated BHK types)
  ?min_price=5000000
  ?max_price=20000000
  ?possession_before=2025-12-31
  ?is_rera_verified=true
  ?is_featured=true
  ?is_gift_city=true
  ?status=active|sold_out|price_on_request
  ?q=sky residences        (full-text search across title, locality, developer)
  ?sort=price_asc|price_desc|newest|oldest
"""
import django_filters
from django.db.models import Q
from .models import Property, BHKConfiguration


class PropertyFilter(django_filters.FilterSet):
    # ── Dropdowns ────────────────────────────────────────────────────────────
    listing_type  = django_filters.CharFilter(method="filter_listing_type")
    deal_type     = django_filters.CharFilter(method="filter_listing_type")
    property_type = django_filters.ChoiceFilter(
        choices=Property.property_type.field.choices
    )
    status = django_filters.ChoiceFilter(
        choices=Property.status.field.choices
    )

    # ── Location (case-insensitive) ──────────────────────────────────────────
    city     = django_filters.CharFilter(lookup_expr="icontains")
    locality = django_filters.CharFilter(lookup_expr="icontains")

    # ── Price Range ──────────────────────────────────────────────────────────
    min_price  = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price  = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    price__gte = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    price__lte = django_filters.NumberFilter(field_name="price", lookup_expr="lte")

    # ── BHK / Bedroom Filter ─────────────────────────────────────────────────
    bhk      = django_filters.CharFilter(method="filter_bhk")
    bedrooms = django_filters.CharFilter(method="filter_bedrooms")

    # ── Possession Date ──────────────────────────────────────────────────────
    possession_before = django_filters.DateFilter(
        field_name="possession_date", lookup_expr="lte"
    )
    possession_after = django_filters.DateFilter(
        field_name="possession_date", lookup_expr="gte"
    )
    possession = django_filters.CharFilter(method="filter_possession")

    # ── Boolean Flags ────────────────────────────────────────────────────────
    is_rera_verified  = django_filters.BooleanFilter()
    is_featured       = django_filters.BooleanFilter()
    is_gift_city      = django_filters.BooleanFilter()
    is_zero_brokerage = django_filters.BooleanFilter()

    # ── Full-Text Search (supports both ?q= and ?search=) ────────────────────
    q      = django_filters.CharFilter(method="filter_search")
    search = django_filters.CharFilter(method="filter_search")

    class Meta:
        model  = Property
        fields = [
            "listing_type", "deal_type", "property_type", "status",
            "city", "locality",
            "min_price", "max_price",
            "bhk",
            "possession_before", "possession_after",
            "is_rera_verified", "is_featured", "is_gift_city",
        ]

    def filter_bhk(self, queryset, name, value):
        """
        Filter by BHK types available in BHKConfiguration.
        Accepts comma-separated values: ?bhk=2bhk,3bhk
        """
        bhk_types = [v.strip() for v in value.split(",") if v.strip()]
        if bhk_types:
            return queryset.filter(
                bhk_configs__bhk_type__in=bhk_types
            ).distinct()
        return queryset

    def filter_search(self, queryset, name, value):
        """
        Full-text search across:
          - title
          - locality
          - city
          - developer_name
          - description
          - rera_number
        """
        if value:
            return queryset.filter(
                Q(title__icontains=value)
                | Q(locality__icontains=value)
                | Q(city__icontains=value)
                | Q(developer_name__icontains=value)
                | Q(description__icontains=value)
                | Q(rera_number__icontains=value)
                | Q(address__icontains=value)
            ).distinct()
        return queryset

    def filter_listing_type(self, queryset, name, value):
        if not value:
            return queryset
        val = str(value).strip().lower()
        if val in ["builder", "all", "new"]:
            return queryset
        if val in ["rental", "rent"]:
            return queryset.filter(listing_type="rent")
        if val in ["sale", "buy"]:
            return queryset.filter(listing_type="buy")
        if val == "owner":
            return queryset.filter(is_zero_brokerage=True)
        return queryset.filter(listing_type__iexact=val)

    def filter_bedrooms(self, queryset, name, value):
        if not value:
            return queryset
        bhk_val = f"{value}bhk"
        return queryset.filter(
            Q(bhk_configs__bhk_type=bhk_val)
            | Q(title__icontains=f"{value} BHK")
            | Q(title__icontains=f"{value}BHK")
        ).distinct()

    def filter_possession(self, queryset, name, value):
        import datetime
        today = datetime.date.today()
        val = str(value).lower().strip()
        if val in ["ready", "ready to move"]:
            return queryset.filter(Q(possession_date__lte=today) | Q(status="active"))
        elif val == "2025":
            return queryset.filter(possession_date__year=2025)
        elif val == "2026":
            return queryset.filter(possession_date__year=2026)
        elif val == "2027":
            return queryset.filter(possession_date__year__gte=2027)
        return queryset
