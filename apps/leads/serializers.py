"""
apps/leads/serializers.py
─────────────────────────────────────────────
  - LeadCreateSerializer   → public form submission (strict validation)
  - LeadAdminSerializer    → admin view with all fields
"""
import re
from rest_framework import serializers
from .models import Lead
from apps.core.validators import validate_indian_mobile


class LeadCreateSerializer(serializers.ModelSerializer):
    """
    Public serializer — used when a user submits the inquiry form.
    Strict validation on all fields.
    """

    class Meta:
        model  = Lead
        fields = [
            "id",
            "property",
            "name",
            "mobile",
            "email",
            "inquiry_type",
            "message",
            "source_page",
        ]
        extra_kwargs = {
            "property":    {"required": False},
            "email":       {"required": False},
            "message":     {"required": False},
            "source_page": {"required": False},
        }

    def validate_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters.")
        if len(value) > 150:
            raise serializers.ValidationError("Name must be 150 characters or fewer.")
        if not re.match(r"^[a-zA-Z\s\.\-\']+$", value):
            raise serializers.ValidationError(
                "Name can only contain letters, spaces, dots, hyphens, or apostrophes."
            )
        return value

    def validate_mobile(self, value):
        # Clean up the number
        cleaned = re.sub(r"[\s\-\(\)]", "", str(value))
        if cleaned.startswith("+91"):
            cleaned = cleaned[3:]
        elif cleaned.startswith("91") and len(cleaned) == 12:
            cleaned = cleaned[2:]

        if not re.match(r"^[6-9]\d{9}$", cleaned):
            raise serializers.ValidationError(
                "Enter a valid Indian mobile number (10 digits, starting with 6, 7, 8, or 9)."
            )
        return cleaned  # Store cleaned 10-digit number

    def validate_email(self, value):
        if value and len(value) > 254:
            raise serializers.ValidationError("Enter a valid email address.")
        return value

    def validate_message(self, value):
        if value and len(value) > 1000:
            raise serializers.ValidationError("Message must be 1000 characters or fewer.")
        return value


class LeadAdminSerializer(serializers.ModelSerializer):
    """Admin serializer — includes all fields including internal notes."""

    property_title = serializers.SerializerMethodField()
    inquiry_type_display = serializers.CharField(
        source="get_inquiry_type_display", read_only=True
    )

    class Meta:
        model  = Lead
        fields = [
            "id",
            "property", "property_title",
            "name", "mobile", "email",
            "inquiry_type", "inquiry_type_display",
            "message",
            "is_contacted", "notes",
            "source_page",
            "created_at", "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at", "property_title"]

    def get_property_title(self, obj):
        return obj.property.title if obj.property else None
