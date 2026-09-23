"""
apps/properties/views.py
─────────────────────────────────────────────
Public Views (no auth required):
  - PropertyListView       GET  /api/properties/
  - PropertyDetailView     GET  /api/properties/{slug}/
  - FeaturedPropertyView   GET  /api/properties/featured/
  - RelatedPropertiesView  GET  /api/properties/{slug}/related/

Admin Views (JWT required):
  - PropertyAdminListCreateView  GET/POST  /api/admin/properties/
  - PropertyAdminDetailView      GET/PATCH/DELETE  /api/admin/properties/{id}/
  - PropertyImageUploadView      POST  /api/admin/properties/{id}/images/
  - PropertyImageDeleteView      DELETE /api/admin/properties/{id}/images/{img_id}/
  - BHKConfigView                POST/PUT/DELETE  /api/admin/properties/{id}/bhk/
  - FloorPlanView                POST/DELETE  /api/admin/properties/{id}/floor-plans/
"""
import logging

from rest_framework import generics, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.db import DatabaseError, IntegrityError
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend

from .models import Property, PropertyImage, BHKConfiguration, FloorPlan
from .serializers import (
    PropertyListSerializer,
    PropertyDetailSerializer,
    PropertyAdminSerializer,
    PropertyImageUploadSerializer,
    BHKConfigurationSerializer,
    BHKConfigurationAdminSerializer,
    FloorPlanSerializer,
    FloorPlanAdminSerializer,
)
from .filters import PropertyFilter
from apps.core.pagination import StandardResultsPagination

logger = logging.getLogger(__name__)


# ═══════════════════════════════════════════════════════════════
# PUBLIC VIEWS
# ═══════════════════════════════════════════════════════════════

class PropertyListView(generics.ListAPIView):
    """
    GET /api/properties/
    List all active properties with filtering, search, ordering & pagination.

    Query params:
      ?q=               Full-text search
      ?listing_type=    buy | rent | investment | plots
      ?property_type=   residential | commercial | new_launch | plot
      ?city=            Ahmedabad
      ?locality=        Sindhubhavan Road
      ?bhk=             2bhk,3bhk  (comma-separated)
      ?min_price=       5000000
      ?max_price=       20000000
      ?possession_before=  2025-12-31
      ?is_rera_verified=   true
      ?is_featured=        true
      ?is_gift_city=       true
      ?sort=            price_asc | price_desc | newest | oldest
      ?page=            1
      ?page_size=       12  (max 50)
    """
    permission_classes  = [AllowAny]
    serializer_class    = PropertyListSerializer
    pagination_class    = StandardResultsPagination
    filter_backends     = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class     = PropertyFilter
    ordering_fields     = ["price", "created_at", "possession_date"]
    ordering            = ["-created_at"]

    def get_queryset(self):
        try:
            queryset = (
                Property.objects
                .filter(status__in=["active", "price_on_request", "sold_out"])
                .prefetch_related("images", "bhk_configs")
            )

            # Custom sort param
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

        except DatabaseError as e:
            logger.error("PropertyListView - Database error: %s", e)
            raise


class ResidentialPropertyListView(PropertyListView):
    """GET /api/properties/residential/ — List residential properties"""
    def get_queryset(self):
        return super().get_queryset().filter(property_type="residential")


class CommercialPropertyListView(PropertyListView):
    """GET /api/properties/commercial/ — List commercial properties"""
    def get_queryset(self):
        return super().get_queryset().filter(property_type="commercial")


class PlotWeekendVillaPropertyListView(PropertyListView):
    """GET /api/properties/plot-weekend-villa/ — List plots & weekend homes"""
    def get_queryset(self):
        return super().get_queryset().filter(
            Q(listing_type="plots") | Q(property_type="plot") | Q(property_type="new_launch")
        )


class InvestmentPropertyListView(PropertyListView):
    """GET /api/properties/investment/ — List investment properties"""
    def get_queryset(self):
        return super().get_queryset().filter(
            Q(listing_type="investment") | Q(roi_potential__isnull=False) | Q(rental_yield__isnull=False)
        )


class GiftCityPropertyListView(PropertyListView):
    """GET /api/properties/gift-city/ — List GIFT City properties"""
    def get_queryset(self):
        return super().get_queryset().filter(is_gift_city=True)


class RentPropertyListView(PropertyListView):
    """GET /api/properties/rent/ — List rental properties"""
    def get_queryset(self):
        return super().get_queryset().filter(listing_type="rent")


class SubmittedPropertyView(APIView):
    """
    POST /api/properties/submitted-properties/
    Handles property submission from frontend 'Post Property' form.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        from apps.leads.models import Lead
        data = request.data
        name = data.get("name", "").strip() or "Owner/Seller"
        phone = data.get("phone", "").strip() or data.get("mobile", "").strip()
        email = data.get("email", "").strip()
        
        details = [
            f"User Type: {data.get('user_type', 'owner')}",
            f"Category: {data.get('property_category', 'residential')}",
            f"Deal Type: {data.get('deal_type', 'sale')}",
            f"City: {data.get('city', '')}, Area: {data.get('area', '')}",
            f"Address: {data.get('address', '')}",
            f"Expected Price: {data.get('expected_price', '')}",
            f"Area (sqft): {data.get('area_sqft', '')}",
            f"BHK: {data.get('bedrooms', '')}, Baths: {data.get('bathrooms', '')}",
            f"Description: {data.get('description', '')}",
        ]

        lead = Lead.objects.create(
            name=name,
            mobile=phone or "Not Provided",
            email=email,
            inquiry_type="seller",
            message="\n".join(details),
            source_page="/post-property"
        )
        return Response(
            {"success": True, "message": "Property submitted successfully! Our team will verify and list it.", "id": lead.id},
            status=status.HTTP_201_CREATED
        )


class PropertyDetailView(generics.RetrieveAPIView):
    """
    GET /api/properties/{slug}/
    Full property detail including images, BHK configs, floor plans.
    """
    permission_classes = [AllowAny]
    serializer_class   = PropertyDetailSerializer
    lookup_field       = "slug"

    def get_queryset(self):
        try:
            return (
                Property.objects
                .prefetch_related("images", "bhk_configs", "floor_plans")
            )
        except DatabaseError as e:
            logger.error("PropertyDetailView - Database error: %s", e)
            raise


class FeaturedPropertyView(generics.ListAPIView):
    """
    GET /api/properties/featured/
    Return featured properties for homepage 'Featured Opportunities' section.
    """
    permission_classes = [AllowAny]
    serializer_class   = PropertyListSerializer
    pagination_class   = StandardResultsPagination

    def get_queryset(self):
        try:
            return (
                Property.objects
                .filter(is_featured=True, status="active")
                .prefetch_related("images", "bhk_configs")
                .order_by("-created_at")
            )
        except DatabaseError as e:
            logger.error("FeaturedPropertyView - Database error: %s", e)
            raise


class RelatedPropertiesView(generics.ListAPIView):
    """
    GET /api/properties/{slug}/related/
    Returns similar properties (same city + listing_type, excluding current).
    """
    permission_classes = [AllowAny]
    serializer_class   = PropertyListSerializer
    pagination_class   = None  # No pagination for related (return top 4)

    def get_queryset(self):
        try:
            slug = self.kwargs["slug"]
            prop = get_object_or_404(Property, slug=slug)
            return (
                Property.objects
                .filter(
                    city=prop.city,
                    listing_type=prop.listing_type,
                    status="active",
                )
                .exclude(pk=prop.pk)
                .prefetch_related("images")
                .order_by("-is_featured", "-created_at")[:4]
            )
        except DatabaseError as e:
            logger.error("RelatedPropertiesView - Database error for slug '%s': %s", self.kwargs.get("slug"), e)
            raise


# ═══════════════════════════════════════════════════════════════
# ADMIN VIEWS (JWT protected)
# ═══════════════════════════════════════════════════════════════

class PropertyAdminListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/admin/properties/   → List all properties (with filters)
    POST /api/admin/properties/   → Create new property
    """
    permission_classes = [IsAuthenticated]
    serializer_class   = PropertyAdminSerializer
    filter_backends    = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class    = PropertyFilter
    search_fields      = ["title", "city", "locality", "developer_name"]
    ordering_fields    = ["created_at", "price", "city"]
    ordering           = ["-created_at"]
    pagination_class   = StandardResultsPagination

    def get_queryset(self):
        try:
            return Property.objects.prefetch_related("images", "bhk_configs", "floor_plans")
        except DatabaseError as e:
            logger.error("PropertyAdminListCreateView - Database error: %s", e)
            raise


class PropertyAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/admin/properties/{id}/   → Get property
    PATCH  /api/admin/properties/{id}/   → Update property
    DELETE /api/admin/properties/{id}/   → Delete property
    """
    permission_classes = [IsAuthenticated]
    serializer_class   = PropertyAdminSerializer
    queryset           = Property.objects.all()


# ─── Image Upload ─────────────────────────────────────────────────────────────

class PropertyImageUploadView(APIView):
    """
    POST /api/admin/properties/{id}/images/
    Upload one or multiple images for a property.
    Accepts multipart/form-data.
    """
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request, pk):
        try:
            prop = get_object_or_404(Property, pk=pk)
            images = request.FILES.getlist("images")

            if not images:
                return Response(
                    {"error": "No images provided. Send files under 'images' key."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            created = []
            errors  = []
            for idx, img_file in enumerate(images):
                try:
                    serializer = PropertyImageUploadSerializer(
                        data={
                            "image":    img_file,
                            "alt_text": request.data.get("alt_text", prop.title),
                            "order":    request.data.get("order", idx + 1),
                            "is_cover": request.data.get("is_cover", False),
                        }
                    )
                    if serializer.is_valid():
                        serializer.save(property=prop)
                        created.append(serializer.data)
                    else:
                        errors.append({"file": img_file.name, "errors": serializer.errors})

                except (OSError, IOError) as file_err:
                    logger.warning("Image upload - File error for '%s': %s", img_file.name, file_err)
                    errors.append({"file": img_file.name, "errors": "File could not be saved."})

                except DatabaseError as db_err:
                    logger.error("Image upload - DB error for '%s': %s", img_file.name, db_err)
                    errors.append({"file": img_file.name, "errors": "Database error while saving image."})

            return Response(
                {
                    "uploaded": created,
                    "failed":   errors,
                    "message":  f"{len(created)} image(s) uploaded successfully.",
                },
                status=status.HTTP_201_CREATED if created else status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            logger.exception("PropertyImageUploadView - Unexpected error for property pk=%s", pk)
            return Response(
                {"error": "An unexpected error occurred while uploading images."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PropertyImageDeleteView(APIView):
    """
    DELETE /api/admin/properties/{id}/images/{img_id}/
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk, img_id):
        try:
            img = get_object_or_404(PropertyImage, pk=img_id, property__pk=pk)

            try:
                img.image.delete(save=False)  # Remove file from disk
            except (OSError, IOError) as file_err:
                logger.warning(
                    "PropertyImageDeleteView - Could not delete file for image pk=%s: %s",
                    img_id, file_err
                )

            img.delete()
            return Response(
                {"message": "Image deleted successfully."},
                status=status.HTTP_200_OK,
            )

        except DatabaseError as e:
            logger.error("PropertyImageDeleteView - DB error for img pk=%s: %s", img_id, e)
            return Response(
                {"error": "Database error occurred while deleting the image."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            logger.exception("PropertyImageDeleteView - Unexpected error for img pk=%s", img_id)
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ─── BHK Configuration ────────────────────────────────────────────────────────

class BHKConfigView(APIView):
    """
    POST   /api/admin/properties/{id}/bhk/      → Add BHK config
    GET    /api/admin/properties/{id}/bhk/      → List BHK configs
    PUT    /api/admin/properties/{id}/bhk/{bhk_id}/ → Update
    DELETE /api/admin/properties/{id}/bhk/{bhk_id}/ → Delete
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            prop = get_object_or_404(Property, pk=pk)
            configs = prop.bhk_configs.all()
            serializer = BHKConfigurationSerializer(configs, many=True)
            return Response(serializer.data)

        except DatabaseError as e:
            logger.error("BHKConfigView.get - DB error for property pk=%s: %s", pk, e)
            return Response(
                {"error": "Database error while fetching BHK configurations."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            logger.exception("BHKConfigView.get - Unexpected error for property pk=%s", pk)
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request, pk):
        try:
            prop = get_object_or_404(Property, pk=pk)
            serializer = BHKConfigurationAdminSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(property=prop)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except IntegrityError as e:
            logger.error("BHKConfigView.post - Integrity error for property pk=%s: %s", pk, e)
            return Response(
                {"error": "BHK configuration already exists or violates a constraint."},
                status=status.HTTP_409_CONFLICT,
            )
        except DatabaseError as e:
            logger.error("BHKConfigView.post - DB error for property pk=%s: %s", pk, e)
            return Response(
                {"error": "Database error while creating BHK configuration."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            logger.exception("BHKConfigView.post - Unexpected error for property pk=%s", pk)
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class BHKConfigDetailView(APIView):
    """PUT / DELETE for single BHK config."""
    permission_classes = [IsAuthenticated]

    def put(self, request, pk, bhk_id):
        try:
            config = get_object_or_404(BHKConfiguration, pk=bhk_id, property__pk=pk)
            serializer = BHKConfigurationAdminSerializer(
                config, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as e:
            logger.error("BHKConfigDetailView.put - DB error for bhk pk=%s: %s", bhk_id, e)
            return Response(
                {"error": "Database error while updating BHK configuration."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            logger.exception("BHKConfigDetailView.put - Unexpected error for bhk pk=%s", bhk_id)
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request, pk, bhk_id):
        try:
            config = get_object_or_404(BHKConfiguration, pk=bhk_id, property__pk=pk)
            config.delete()
            return Response({"message": "BHK configuration deleted."}, status=status.HTTP_200_OK)

        except DatabaseError as e:
            logger.error("BHKConfigDetailView.delete - DB error for bhk pk=%s: %s", bhk_id, e)
            return Response(
                {"error": "Database error while deleting BHK configuration."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            logger.exception("BHKConfigDetailView.delete - Unexpected error for bhk pk=%s", bhk_id)
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ─── Floor Plans ──────────────────────────────────────────────────────────────

class FloorPlanView(APIView):
    """
    POST   /api/admin/properties/{id}/floor-plans/      → Add floor plan
    GET    /api/admin/properties/{id}/floor-plans/      → List floor plans
    DELETE /api/admin/properties/{id}/floor-plans/{fp_id}/ → Delete
    """
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def get(self, request, pk):
        try:
            prop = get_object_or_404(Property, pk=pk)
            plans = prop.floor_plans.all()
            serializer = FloorPlanSerializer(plans, many=True, context={"request": request})
            return Response(serializer.data)

        except DatabaseError as e:
            logger.error("FloorPlanView.get - DB error for property pk=%s: %s", pk, e)
            return Response(
                {"error": "Database error while fetching floor plans."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            logger.exception("FloorPlanView.get - Unexpected error for property pk=%s", pk)
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request, pk):
        try:
            prop = get_object_or_404(Property, pk=pk)
            serializer = FloorPlanAdminSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(property=prop)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except (OSError, IOError) as file_err:
            logger.warning("FloorPlanView.post - File error for property pk=%s: %s", pk, file_err)
            return Response(
                {"error": "Floor plan image could not be saved to disk."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except DatabaseError as e:
            logger.error("FloorPlanView.post - DB error for property pk=%s: %s", pk, e)
            return Response(
                {"error": "Database error while saving floor plan."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            logger.exception("FloorPlanView.post - Unexpected error for property pk=%s", pk)
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class FloorPlanDeleteView(APIView):
    """DELETE /api/admin/properties/{id}/floor-plans/{fp_id}/"""
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk, fp_id):
        try:
            plan = get_object_or_404(FloorPlan, pk=fp_id, property__pk=pk)

            try:
                plan.image.delete(save=False)
            except (OSError, IOError) as file_err:
                logger.warning(
                    "FloorPlanDeleteView - Could not delete image file for plan pk=%s: %s",
                    fp_id, file_err
                )

            plan.delete()
            return Response({"message": "Floor plan deleted."}, status=status.HTTP_200_OK)

        except DatabaseError as e:
            logger.error("FloorPlanDeleteView - DB error for plan pk=%s: %s", fp_id, e)
            return Response(
                {"error": "Database error while deleting floor plan."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            logger.exception("FloorPlanDeleteView - Unexpected error for plan pk=%s", fp_id)
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ─── CSV Bulk Import ───────────────────────────────────────────────────────────

class PropertyCSVImportView(APIView):
    """
    GET  /api/admin/properties/import/sample/  → Download sample CSV template
    POST /api/admin/properties/import/         → Bulk import properties from CSV

    POST accepts multipart/form-data with a single 'file' field (CSV file).

    CSV Rules:
      - Header row required with exact column names (see sample endpoint)
      - Required columns: title, city, locality, listing_type, property_type
      - Encoding: UTF-8
      - amenities / highlights columns must be valid JSON arrays e.g. ["Gym","Pool"]
      - possession_date format: YYYY-MM-DD
      - Boolean columns accept: true/false, 1/0, yes/no (case-insensitive)
      - Slug is auto-generated from title if left blank

    Response:
      {
        "message":  "Import complete.",
        "imported": 95,
        "failed":   5,
        "total":    100,
        "errors":   [ { "row": 3, "data": {...}, "errors": {...} }, ... ]
      }
    """
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    # ── Column definitions ────────────────────────────────────────────────────
    SAMPLE_HEADERS = [
        "title", "city", "locality", "listing_type", "property_type",
        "slug", "status", "price", "price_per_sqft", "developer_name",
        "total_area_sqft", "possession_date", "address", "rera_number",
        "is_rera_verified", "is_featured", "is_gift_city", "is_zero_brokerage",
        "is_exclusive", "roi_potential", "rental_yield", "description",
        "meta_title", "meta_description", "meta_keywords",
        "amenities", "highlights",
    ]

    SAMPLE_ROW = [
        "Sky Residences", "Ahmedabad", "Prahlad Nagar", "buy", "residential",
        "", "active", "5000000", "8500", "ABC Builders",
        "25000", "2026-06-30", "S.G. Highway, Ahmedabad", "PR/GJ/ABCD/12345",
        "true", "true", "false", "false",
        "false", "14.5", "5.6", "Premium 3BHK residences near SG Highway.",
        "Sky Residences - Buy 3BHK Ahmedabad", "Premium 3BHK project near SG Highway.", "3bhk,buy,ahmedabad",
        '["Gym","Pool","Clubhouse"]', '["RERA Verified","Zero Brokerage"]',
    ]

    BOOLEAN_FIELDS = {
        "is_rera_verified", "is_featured", "is_gift_city",
        "is_zero_brokerage", "is_exclusive",
    }
    JSON_FIELDS = {"amenities", "highlights"}

    # Fields that are truly nullable in the DB (DecimalField/IntegerField/DateField null=True)
    # Empty CSV value for these → None (not empty string)
    NULLABLE_FIELDS = {
        "price", "price_per_sqft", "total_area_sqft",
        "possession_date", "roi_potential", "rental_yield",
    }

    # ── GET — Download sample CSV ─────────────────────────────────────────────
    def get(self, request):
        """Return a pre-filled sample CSV file for download."""
        import csv
        import io
        from django.http import HttpResponse

        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow(self.SAMPLE_HEADERS)
        writer.writerow(self.SAMPLE_ROW)
        buffer.seek(0)

        response = HttpResponse(buffer, content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="properties_sample.csv"'
        return response

    # ── POST — Upload & import CSV ────────────────────────────────────────────
    def post(self, request):
        """Parse uploaded CSV, validate each row, bulk-create valid properties."""
        import csv
        import io
        import json as json_lib

        # ── 1. Validate file presence ─────────────────────────────────────────
        csv_file = request.FILES.get("file")
        if not csv_file:
            return Response(
                {"error": "No file provided. Send CSV under the 'file' key."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not csv_file.name.endswith(".csv"):
            return Response(
                {"error": "Invalid file type. Only .csv files are accepted."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ── 2. Read & decode CSV ──────────────────────────────────────────────
        try:
            decoded = csv_file.read().decode("utf-8-sig")   # utf-8-sig removes BOM if present
            reader  = csv.DictReader(io.StringIO(decoded))
        except UnicodeDecodeError:
            return Response(
                {"error": "File encoding error. Please save the CSV as UTF-8."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            logger.error("PropertyCSVImportView - CSV read error: %s", e)
            return Response(
                {"error": "Could not read CSV file. Ensure it is a valid CSV."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ── 3. Parse rows ─────────────────────────────────────────────────────
        imported_count = 0
        failed_rows    = []
        row_number     = 1   # 1 = first data row (after header)
        total_rows     = 0

        for row in reader:
            total_rows += 1
            row_number += 1
            cleaned = self._clean_row(row, self.NULLABLE_FIELDS)

            # Parse booleans
            for field in self.BOOLEAN_FIELDS:
                if field in cleaned:
                    cleaned[field] = self._parse_boolean(cleaned[field])

            # Parse JSON fields (amenities, highlights)
            json_error = False
            for field in self.JSON_FIELDS:
                if field in cleaned and cleaned[field]:
                    parsed, err = self._parse_json(cleaned[field], field)
                    if err:
                        failed_rows.append({
                            "row":    row_number,
                            "data":   dict(row),
                            "errors": {field: [err]},
                        })
                        json_error = True
                        break   # stop processing further JSON fields for this row
                    cleaned[field] = parsed
                else:
                    cleaned[field] = []

            if json_error:
                continue   # skip serializer validation for this row

            # Validate via existing serializer
            serializer = PropertyAdminSerializer(data=cleaned)
            if serializer.is_valid():
                try:
                    serializer.save()
                    imported_count += 1
                except IntegrityError as e:
                    failed_rows.append({
                        "row":    row_number,
                        "data":   dict(row),
                        "errors": {"slug": ["A property with this slug already exists."]},
                    })
                except DatabaseError as e:
                    logger.error("PropertyCSVImportView - DB error at row %s: %s", row_number, e)
                    failed_rows.append({
                        "row":    row_number,
                        "data":   dict(row),
                        "errors": {"db": ["Database error while saving this row."]},
                    })
            else:
                failed_rows.append({
                    "row":    row_number,
                    "data":   dict(row),
                    "errors": serializer.errors,
                })

        if total_rows == 0:
            return Response(
                {"error": "CSV file is empty. Please add at least one data row."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        total = imported_count + len(failed_rows)
        logger.info(
            "PropertyCSVImportView - Import complete: %s imported, %s failed out of %s total",
            imported_count, len(failed_rows), total,
        )

        return Response(
            {
                "message":  "Import complete.",
                "imported": imported_count,
                "failed":   len(failed_rows),
                "total":    total,
                "errors":   failed_rows,
            },
            status=status.HTTP_207_MULTI_STATUS if failed_rows else status.HTTP_201_CREATED,
        )

    # ── Helpers ───────────────────────────────────────────────────────────────

    @staticmethod
    def _clean_row(row: dict, nullable_fields: set = None) -> dict:
        """
        Strip whitespace from all values.
        - Fields in nullable_fields (numeric/date): empty string → None
        - All other fields (CharField): empty string stays as "" so serializer
          can accept blank=True fields without null constraint violations.
        """
        if nullable_fields is None:
            nullable_fields = set()
        cleaned = {}
        for key, value in row.items():
            if key is None:
                continue
            key   = key.strip()
            value = value.strip() if isinstance(value, str) else value
            if value == "" and key in nullable_fields:
                cleaned[key] = None     # e.g. price, possession_date → None is valid
            else:
                cleaned[key] = value    # CharField: keep empty string (blank=True)
        return cleaned

    @staticmethod
    def _parse_boolean(value) -> bool:
        """Convert common truthy strings to Python bool."""
        if isinstance(value, bool):
            return value
        if value is None:
            return False
        return str(value).strip().lower() in ("true", "1", "yes")

    @staticmethod
    def _parse_json(value: str, field_name: str):
        """
        Try to parse a JSON string into a Python list.
        Returns (parsed_value, error_message).
        """
        import json as json_lib
        try:
            parsed = json_lib.loads(value)
            if not isinstance(parsed, list):
                return None, f"'{field_name}' must be a JSON array, e.g. [\"item1\",\"item2\"]"
            return parsed, None
        except (ValueError, TypeError):
            return None, f"Invalid JSON in '{field_name}'. Use format: [\"item1\",\"item2\"]"
