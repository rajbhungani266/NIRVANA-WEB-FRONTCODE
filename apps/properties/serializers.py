"""
apps/properties/serializers.py
─────────────────────────────────────────────
Serializers:
  - PropertyImageSerializer
  - BHKConfigurationSerializer
  - FloorPlanSerializer
  - PropertyListSerializer    → lightweight for listing pages
  - PropertyDetailSerializer  → full detail for single property page
  - PropertyAdminSerializer   → write serializer for create/update (admin)
"""
from rest_framework import serializers
from .models import Property, PropertyImage, BHKConfiguration, FloorPlan, PropertyVideo
from apps.core.validators import (
    validate_meta_description,
    validate_meta_title,
    validate_positive_price,
    validate_rera_number,
)
from apps.core.utils import slugify_unique


# ─── Image Serializer ─────────────────────────────────────────────────────────

class PropertyImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ["id", "image_url", "alt_text", "order", "is_cover"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


# ─── BHK Configuration Serializer ────────────────────────────────────────────

class BHKConfigurationSerializer(serializers.ModelSerializer):
    bhk_type_display = serializers.CharField(source="get_bhk_type_display", read_only=True)
    status_display   = serializers.CharField(source="get_status_display",   read_only=True)
    area_display     = serializers.SerializerMethodField()

    class Meta:
        model  = BHKConfiguration
        fields = [
            "id", "bhk_type", "bhk_type_display",
            "area_sqft_min", "area_sqft_max", "super_builtup_area", "area_display",
            "price", "status", "status_display",
        ]

    def get_area_display(self, obj):
        if obj.area_sqft_max:
            return f"{obj.area_sqft_min}–{obj.area_sqft_max} Sq.Ft."
        return f"{obj.area_sqft_min} Sq.Ft."


# ─── Floor Plan Serializer ────────────────────────────────────────────────────

class FloorPlanSerializer(serializers.ModelSerializer):
    image_url        = serializers.SerializerMethodField()
    bhk_type_display = serializers.CharField(source="get_bhk_type_display", read_only=True)

    class Meta:
        model  = FloorPlan
        fields = ["id", "bhk_type", "bhk_type_display", "image_url", "alt_text"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


# ─── Property Video Serializer (read) ────────────────────────────────────────

class PropertyVideoSerializer(serializers.ModelSerializer):
    """
    Read serializer — used in public PropertyDetailSerializer and admin list.
    Returns full CDN/media URL for video and thumbnail.
    """
    video_url       = serializers.SerializerMethodField()
    thumbnail_url   = serializers.SerializerMethodField()
    video_type_display = serializers.CharField(
        source="get_video_type_display", read_only=True
    )

    class Meta:
        model  = PropertyVideo
        fields = [
            "id", "title", "video_url", "thumbnail_url",
            "video_type", "video_type_display",
            "duration_sec", "order", "created_at",
        ]

    def get_video_url(self, obj):
        request = self.context.get("request")
        if obj.video:
            return request.build_absolute_uri(obj.video.url) if request else obj.video.url
        return None

    def get_thumbnail_url(self, obj):
        request = self.context.get("request")
        if obj.thumbnail:
            return request.build_absolute_uri(obj.thumbnail.url) if request else obj.thumbnail.url
        return None


# ─── Property Video Upload Serializer (write) ─────────────────────────────────

class PropertyVideoUploadSerializer(serializers.ModelSerializer):
    """
    Write serializer — used in admin video upload endpoint.
    Validates file type/size via model validator.
    """

    class Meta:
        model  = PropertyVideo
        fields = ["id", "video", "title", "video_type", "thumbnail", "duration_sec", "order"]
        extra_kwargs = {
            "title":        {"required": False},
            "video_type":   {"required": False},
            "thumbnail":    {"required": False},
            "duration_sec": {"required": False},
            "order":        {"required": False},
        }

    def validate_video(self, value):
        from apps.core.validators import validate_video_file
        validate_video_file(value)
        return value

    def validate_thumbnail(self, value):
        if value:
            from apps.core.validators import validate_image_file
            validate_image_file(value)
        return value


# ─── Property List Serializer (Public, lightweight) ──────────────────────────

class PropertyListSerializer(serializers.ModelSerializer):
    """
    Used in listing pages & search results.
    Returns just enough info to render a property card.
    """
    thumbnail        = serializers.SerializerMethodField()
    price_display    = serializers.ReadOnlyField()
    listing_type_display  = serializers.CharField(source="get_listing_type_display",  read_only=True)
    property_type_display = serializers.CharField(source="get_property_type_display", read_only=True)
    status_display   = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model  = Property
        fields = [
            "id", "title", "slug",
            "listing_type", "listing_type_display",
            "property_type", "property_type_display",
            "status", "status_display",
            "city", "locality", "address",
            "is_rera_verified", "rera_number",
            "price", "price_display", "price_per_sqft",
            "developer_name",
            "possession_date",
            "roi_potential", "rental_yield",
            "is_featured", "is_gift_city",
            "is_zero_brokerage", "is_exclusive",
            "highlights",
            "thumbnail",
            "total_area_sqft",
            "created_at",
        ]

    def get_thumbnail(self, obj):
        request = self.context.get("request")
        cover = obj.images.filter(is_cover=True).first() or obj.images.first()
        if cover and cover.image:
            return request.build_absolute_uri(cover.image.url) if request else cover.image.url
        return None


# ─── Property Detail Serializer (Public, full) ───────────────────────────────

class PropertyDetailSerializer(serializers.ModelSerializer):
    """
    Full property details for single property page.
    Includes all images, BHK configs, floor plans, and SEO fields.
    """
    images           = PropertyImageSerializer(many=True, read_only=True)
    bhk_configs      = BHKConfigurationSerializer(many=True, read_only=True)
    floor_plans      = FloorPlanSerializer(many=True, read_only=True)
    videos           = PropertyVideoSerializer(many=True, read_only=True)
    price_display    = serializers.ReadOnlyField()
    listing_type_display  = serializers.CharField(source="get_listing_type_display",  read_only=True)
    property_type_display = serializers.CharField(source="get_property_type_display", read_only=True)
    status_display   = serializers.CharField(source="get_status_display", read_only=True)
    brochure_url     = serializers.SerializerMethodField()

    class Meta:
        model  = Property
        fields = [
            "id", "title", "slug",
            "listing_type", "listing_type_display",
            "property_type", "property_type_display",
            "status", "status_display",
            "city", "locality", "address",
            "is_rera_verified", "rera_number",
            "price", "price_display", "price_per_sqft",
            "developer_name",
            "total_area_sqft", "possession_date",
            "roi_potential", "rental_yield",
            "is_featured", "is_gift_city",
            "is_zero_brokerage", "is_exclusive",
            "description", "amenities", "highlights",
            "meta_title", "meta_description", "meta_keywords",
            "brochure_url",
            "images", "bhk_configs", "floor_plans", "videos",
            "created_at", "updated_at",
        ]

    def get_brochure_url(self, obj):
        request = self.context.get("request")
        if obj.brochure:
            return request.build_absolute_uri(obj.brochure.url) if request else obj.brochure.url
        return None


# ─── Admin Write Serializer ───────────────────────────────────────────────────

class PropertyAdminSerializer(serializers.ModelSerializer):
    """
    Used by admin to create/update properties.
    Includes full validation.
    """

    class Meta:
        model  = Property
        fields = [
            "id", "title", "slug",
            "listing_type", "property_type", "status",
            "city", "locality", "address",
            "rera_number", "is_rera_verified",
            "price", "price_per_sqft",
            "developer_name",
            "total_area_sqft", "possession_date",
            "roi_potential", "rental_yield",
            "is_featured", "is_gift_city",
            "is_zero_brokerage", "is_exclusive",
            "description", "amenities", "highlights",
            "meta_title", "meta_description", "meta_keywords",
            "brochure",
        ]
        extra_kwargs = {
            "slug": {"required": False},
        }

    def validate_price(self, value):
        if value is not None:
            validate_positive_price(value)
        return value

    def validate_price_per_sqft(self, value):
        if value is not None:
            validate_positive_price(value)
        return value

    def validate_rera_number(self, value):
        if value:
            validate_rera_number(value)
        return value

    def validate_meta_title(self, value):
        if value:
            validate_meta_title(value)
        return value

    def validate_meta_description(self, value):
        if value:
            validate_meta_description(value)
        return value

    def validate(self, attrs):
        # If is_rera_verified is True, rera_number must be provided
        if attrs.get("is_rera_verified") and not attrs.get("rera_number"):
            raise serializers.ValidationError(
                {"rera_number": "RERA number is required when RERA Verified is checked."}
            )
        return attrs

    def create(self, validated_data):
        # Auto-generate slug from title
        if not validated_data.get("slug"):
            validated_data["slug"] = slugify_unique(validated_data["title"], Property)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Regenerate slug if title changed and no explicit slug provided
        if "title" in validated_data and not validated_data.get("slug"):
            validated_data["slug"] = slugify_unique(
                validated_data["title"], Property, instance.pk
            )
        return super().update(instance, validated_data)


# ─── Image Upload Serializer ──────────────────────────────────────────────────

class PropertyImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model  = PropertyImage
        fields = ["id", "image", "alt_text", "order", "is_cover"]

    def validate_image(self, value):
        from apps.core.validators import validate_image_file
        validate_image_file(value)
        return value


# ─── BHK Configuration Admin Serializer ──────────────────────────────────────

class BHKConfigurationAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model  = BHKConfiguration
        fields = [
            "id", "bhk_type",
            "area_sqft_min", "area_sqft_max", "super_builtup_area",
            "price", "status",
        ]

    def validate(self, attrs):
        min_area = attrs.get("area_sqft_min")
        max_area = attrs.get("area_sqft_max")
        if min_area and max_area and max_area < min_area:
            raise serializers.ValidationError(
                {"area_sqft_max": "Max area must be greater than min area."}
            )
        return attrs


# ─── Floor Plan Admin Serializer ─────────────────────────────────────────────

class FloorPlanAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model  = FloorPlan
        fields = ["id", "bhk_type", "image", "alt_text"]

    def validate_image(self, value):
        from apps.core.validators import validate_image_file
        validate_image_file(value)
        return value
