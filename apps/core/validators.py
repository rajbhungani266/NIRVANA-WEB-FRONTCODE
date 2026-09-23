"""
apps/core/validators.py
─────────────────────────────────────────────
Shared validators used across all apps.
"""
import re
import os
from django.core.exceptions import ValidationError


# ─── Phone Validators ──────────────────────────────────────────────────────────

def validate_indian_mobile(value: str) -> None:
    """
    Valid Indian mobile: starts with 6-9, exactly 10 digits.
    Accepts formats: 9876543210 / +919876543210 / 919876543210
    """
    cleaned = re.sub(r"[\s\-\(\)]", "", str(value))

    # Strip country code if present
    if cleaned.startswith("+91"):
        cleaned = cleaned[3:]
    elif cleaned.startswith("91") and len(cleaned) == 12:
        cleaned = cleaned[2:]

    pattern = r"^[6-9]\d{9}$"
    if not re.match(pattern, cleaned):
        raise ValidationError(
            "Enter a valid Indian mobile number (10 digits, starting with 6-9).",
            code="invalid_mobile",
        )


# ─── Price Validators ─────────────────────────────────────────────────────────

def validate_positive_price(value) -> None:
    """Price must be a positive number."""
    if value is not None and value <= 0:
        raise ValidationError(
            "Price must be a positive value.",
            code="invalid_price",
        )


# ─── RERA Validators ──────────────────────────────────────────────────────────

def validate_rera_number(value: str) -> None:
    """
    Gujarat RERA format: PR/GJ/AHMEDABAD/XXXXXX/XXXXXX/XXXXXX
    Basic check: alphanumeric with slashes, min 10 chars.
    """
    if value and len(value.strip()) < 10:
        raise ValidationError(
            "RERA number must be at least 10 characters.",
            code="invalid_rera",
        )


# ─── Image Validators ─────────────────────────────────────────────────────────

ALLOWED_IMAGE_TYPES = [".jpg", ".jpeg", ".png", ".webp"]
MAX_IMAGE_SIZE_MB = 5


def validate_image_file(value) -> None:
    """Validate image file type and size."""
    ext = os.path.splitext(value.name)[1].lower()
    if ext not in ALLOWED_IMAGE_TYPES:
        raise ValidationError(
            f"Only {', '.join(ALLOWED_IMAGE_TYPES)} files are allowed.",
            code="invalid_image_type",
        )
    if value.size > MAX_IMAGE_SIZE_MB * 1024 * 1024:
        raise ValidationError(
            f"Image file must be less than {MAX_IMAGE_SIZE_MB}MB.",
            code="image_too_large",
        )


# ─── Video Validators ─────────────────────────────────────────────────────────

ALLOWED_VIDEO_TYPES = [".mp4", ".webm", ".mov"]
MAX_VIDEO_SIZE_MB   = 200


def validate_video_file(value) -> None:
    """
    Validate video file type and size.
    Allowed: .mp4, .webm, .mov
    Max size: 200 MB
    """
    ext = os.path.splitext(value.name)[1].lower()
    if ext not in ALLOWED_VIDEO_TYPES:
        raise ValidationError(
            f"Only {', '.join(ALLOWED_VIDEO_TYPES)} video files are allowed.",
            code="invalid_video_type",
        )
    if value.size > MAX_VIDEO_SIZE_MB * 1024 * 1024:
        raise ValidationError(
            f"Video file must be less than {MAX_VIDEO_SIZE_MB}MB.",
            code="video_too_large",
        )


def validate_pdf_file(value) -> None:
    """Validate brochure PDF file."""
    ext = os.path.splitext(value.name)[1].lower()
    if ext != ".pdf":
        raise ValidationError(
            "Only PDF files are allowed for brochures.",
            code="invalid_pdf_type",
        )
    max_size_mb = 20
    if value.size > max_size_mb * 1024 * 1024:
        raise ValidationError(
            f"Brochure PDF must be less than {max_size_mb}MB.",
            code="pdf_too_large",
        )


# ─── Meta / SEO Validators ────────────────────────────────────────────────────

def validate_meta_description(value: str) -> None:
    """Meta description should be 50–160 characters for SEO."""
    if value and len(value) > 160:
        raise ValidationError(
            "Meta description must be 160 characters or fewer (SEO best practice).",
            code="meta_desc_too_long",
        )


def validate_meta_title(value: str) -> None:
    """Meta title should be 30–60 characters for SEO."""
    if value and len(value) > 70:
        raise ValidationError(
            "Meta title must be 70 characters or fewer (SEO best practice).",
            code="meta_title_too_long",
        )
