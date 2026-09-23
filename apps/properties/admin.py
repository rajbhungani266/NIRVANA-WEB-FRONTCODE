"""
apps/properties/admin.py
─────────────────────────────────────────────
Django admin configuration for Property management.
"""
from django.contrib import admin
from .models import Property, PropertyImage, BHKConfiguration, FloorPlan, PropertyVideo


class PropertyImageInline(admin.TabularInline):
    model  = PropertyImage
    extra  = 1
    fields = ["image", "alt_text", "order", "is_cover"]


class BHKConfigInline(admin.TabularInline):
    model  = BHKConfiguration
    extra  = 1
    fields = ["bhk_type", "area_sqft_min", "area_sqft_max", "price", "status"]


class FloorPlanInline(admin.TabularInline):
    model  = FloorPlan
    extra  = 1
    fields = ["bhk_type", "image", "alt_text"]


class PropertyVideoInline(admin.TabularInline):
    model       = PropertyVideo
    extra       = 1
    fields      = ["video", "title", "video_type", "thumbnail", "duration_sec", "order"]
    show_change_link = True


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display   = [
        "title", "city", "locality", "listing_type", "property_type",
        "status", "is_featured", "is_rera_verified", "price_display", "created_at"
    ]
    list_filter    = [
        "listing_type", "property_type", "status",
        "is_featured", "is_rera_verified", "is_gift_city", "city"
    ]
    search_fields  = ["title", "city", "locality", "developer_name", "rera_number"]
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ["created_at", "updated_at", "price_display"]
    inlines        = [PropertyImageInline, BHKConfigInline, FloorPlanInline, PropertyVideoInline]
    fieldsets = (
        ("Basic Info", {
            "fields": ("title", "slug", "listing_type", "property_type", "status")
        }),
        ("Location", {
            "fields": ("city", "locality", "address")
        }),
        ("RERA", {
            "fields": ("rera_number", "is_rera_verified")
        }),
        ("Pricing", {
            "fields": ("price", "price_per_sqft", "total_area_sqft", "possession_date")
        }),
        ("Developer", {
            "fields": ("developer_name",)
        }),
        ("Investment", {
            "fields": ("roi_potential", "rental_yield")
        }),
        ("Flags & Badges", {
            "fields": ("is_featured", "is_gift_city", "is_zero_brokerage", "is_exclusive")
        }),
        ("Content", {
            "fields": ("description", "amenities", "highlights", "brochure")
        }),
        ("SEO", {
            "fields": ("meta_title", "meta_description", "meta_keywords"),
            "classes": ("collapse",)
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )
