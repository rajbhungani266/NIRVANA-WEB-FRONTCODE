"""
apps/leads/admin.py
─────────────────────────────────────────────
Django admin for Lead management.
"""
from django.contrib import admin
from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display  = [
        "name", "mobile", "email", "inquiry_type",
        "property", "is_contacted", "created_at"
    ]
    list_filter   = ["inquiry_type", "is_contacted", "created_at"]
    search_fields = ["name", "mobile", "email", "property__title"]
    readonly_fields = ["created_at", "updated_at"]
    list_editable = ["is_contacted"]
    ordering      = ["-created_at"]
    fieldsets = (
        ("Contact Info", {
            "fields": ("name", "mobile", "email")
        }),
        ("Inquiry", {
            "fields": ("property", "inquiry_type", "message", "source_page")
        }),
        ("Admin", {
            "fields": ("is_contacted", "notes")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )
