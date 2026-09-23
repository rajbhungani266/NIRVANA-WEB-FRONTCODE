"""
apps/blog/admin.py
─────────────────────────────────────────────
Django admin for Blog management.
"""
from django.contrib import admin
from .models import BlogPost


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display  = [
        "title", "is_published", "published_at", "read_time", "tags", "created_at"
    ]
    list_filter   = ["is_published", "created_at"]
    search_fields = ["title", "excerpt", "tags"]
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ["read_time", "created_at", "updated_at"]
    list_editable = ["is_published"]
    ordering      = ["-created_at"]
    fieldsets = (
        ("Content", {
            "fields": ("title", "slug", "excerpt", "content")
        }),
        ("Media", {
            "fields": ("featured_image", "featured_image_alt")
        }),
        ("Publishing", {
            "fields": ("is_published", "published_at", "read_time", "tags")
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
