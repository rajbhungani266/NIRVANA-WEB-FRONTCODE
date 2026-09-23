"""
apps/leads/models.py
─────────────────────────────────────────────
Lead / Inquiry model.
Captures enquiries from:
  - Homepage contact form
  - Property detail page ("Get a call back")
  - "Book Site Visit" button
  - "Download Brochure" button
"""
from django.db import models
from apps.core.validators import validate_indian_mobile


class InquiryType(models.TextChoices):
    CALL_BACK  = "call_back",   "Call Back"
    SITE_VISIT = "site_visit",  "Book Site Visit"
    BROCHURE   = "brochure",    "Download Brochure"
    GENERAL    = "general",     "General Inquiry"
    SELLER     = "seller",      "Seller Inquiry"


class Lead(models.Model):
    """
    Inquiry / lead submitted by a potential buyer/renter.
    """

    # ── Property (optional — could be general inquiry) ───────────────────────
    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="leads",
        help_text="Which property this inquiry is about (optional)",
    )

    # ── Contact Info ─────────────────────────────────────────────────────────
    name   = models.CharField(max_length=150)
    mobile = models.CharField(
        max_length=15,
        validators=[validate_indian_mobile],
        help_text="Indian mobile number (10 digits, starts with 6-9)",
    )
    email  = models.EmailField(blank=True, null=True)

    # ── Inquiry Details ───────────────────────────────────────────────────────
    inquiry_type = models.CharField(
        max_length=20,
        choices=InquiryType.choices,
        default=InquiryType.CALL_BACK,
    )
    message = models.TextField(blank=True)

    # ── Admin Tracking ────────────────────────────────────────────────────────
    is_contacted = models.BooleanField(
        default=False,
        help_text="Mark True once you've followed up with this lead",
    )
    notes = models.TextField(
        blank=True,
        help_text="Internal notes about this lead (not shown to user)",
    )

    # ── Metadata ──────────────────────────────────────────────────────────────
    source_page = models.CharField(
        max_length=255, blank=True,
        help_text="URL or page where form was submitted",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Lead"
        verbose_name_plural = "Leads"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["is_contacted", "created_at"]),
            models.Index(fields=["mobile"]),
        ]

    def __str__(self):
        prop_title = self.property.title if self.property else "General"
        return f"{self.name} ({self.mobile}) — {prop_title}"
