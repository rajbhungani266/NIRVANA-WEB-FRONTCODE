"""
apps/properties/models.py
─────────────────────────────────────────────
Models:
  - Property          → main listing model
  - PropertyImage     → multiple images per property
  - BHKConfiguration  → per BHK unit config (area, price, status)
  - FloorPlan         → floor plan images per BHK type
"""
from django.db import models
from apps.core.validators import (
    validate_image_file,
    validate_pdf_file,
    validate_rera_number,
    validate_positive_price,
    validate_meta_description,
    validate_meta_title,
    validate_video_file,
)


# ─── Choice Constants ─────────────────────────────────────────────────────────

class ListingType(models.TextChoices):
    BUY        = "buy",        "Buy"
    RENT       = "rent",       "Rent"
    INVESTMENT = "investment",  "Investment"
    PLOTS      = "plots",      "Plots"


class PropertyType(models.TextChoices):
    RESIDENTIAL  = "residential",  "Residential"
    COMMERCIAL   = "commercial",   "Commercial"
    NEW_LAUNCH   = "new_launch",   "New Launch"
    PLOT         = "plot",         "Plot / Land"


class PropertyStatus(models.TextChoices):
    ACTIVE            = "active",             "Active"
    SOLD_OUT          = "sold_out",           "Sold Out"
    PRICE_ON_REQUEST  = "price_on_request",   "Price on Request"
    COMING_SOON       = "coming_soon",        "Coming Soon"


class BHKType(models.TextChoices):
    STUDIO = "studio", "Studio"
    ONE    = "1bhk",   "1 BHK"
    TWO    = "2bhk",   "2 BHK"
    THREE  = "3bhk",   "3 BHK"
    FOUR   = "4bhk",   "4 BHK"
    FIVE   = "5bhk",   "5 BHK"
    VILLA  = "villa",  "Villa"


class BHKStatus(models.TextChoices):
    AVAILABLE        = "available",         "Available"
    SOLD_OUT         = "sold_out",          "Sold Out"
    PRICE_ON_REQUEST = "price_on_request",  "Price on Request"


# ─── Property Model ───────────────────────────────────────────────────────────

class Property(models.Model):
    """
    Core property listing model.
    Supports: Buy / Rent / Investment / Plots listings.
    """

    # ── Basic Info ──────────────────────────────────────────────────────────
    title          = models.CharField(max_length=255)
    slug           = models.SlugField(max_length=300, unique=True, blank=True)
    listing_type   = models.CharField(
        max_length=20, choices=ListingType.choices, default=ListingType.BUY
    )
    property_type  = models.CharField(
        max_length=20, choices=PropertyType.choices, default=PropertyType.RESIDENTIAL
    )
    status         = models.CharField(
        max_length=20, choices=PropertyStatus.choices, default=PropertyStatus.ACTIVE
    )

    # ── Location ────────────────────────────────────────────────────────────
    city           = models.CharField(max_length=100, db_index=True)
    locality       = models.CharField(max_length=150, db_index=True)
    address        = models.TextField(blank=True)

    # ── RERA ────────────────────────────────────────────────────────────────
    rera_number       = models.CharField(
        max_length=100, blank=True, validators=[validate_rera_number]
    )
    is_rera_verified  = models.BooleanField(default=False, db_index=True)

    # ── Pricing ─────────────────────────────────────────────────────────────
    price          = models.DecimalField(
        max_digits=14, decimal_places=2, null=True, blank=True,
        validators=[validate_positive_price],
        help_text="Leave blank for Price on Request"
    )
    price_per_sqft = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        validators=[validate_positive_price]
    )

    # ── Developer ───────────────────────────────────────────────────────────
    developer_name = models.CharField(max_length=200, blank=True)

    # ── Area & Possession ───────────────────────────────────────────────────
    total_area_sqft = models.PositiveIntegerField(null=True, blank=True)
    possession_date  = models.DateField(null=True, blank=True)

    # ── Investment Metrics ──────────────────────────────────────────────────
    roi_potential  = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True,
        help_text="ROI percentage, e.g. 14.0 for 14%"
    )
    rental_yield   = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True,
        help_text="Rental yield percentage, e.g. 5.6 for 5.6%"
    )

    # ── Badges & Flags ──────────────────────────────────────────────────────
    is_featured    = models.BooleanField(default=False, db_index=True)
    is_gift_city   = models.BooleanField(default=False, db_index=True)
    is_zero_brokerage = models.BooleanField(default=False)
    is_exclusive   = models.BooleanField(default=False)

    # ── Content & SEO ───────────────────────────────────────────────────────
    description    = models.TextField(blank=True)
    amenities      = models.JSONField(default=list, blank=True)
    highlights     = models.JSONField(default=list, blank=True,
                                      help_text='["RERA Verified", "Zero Brokerage"]')

    meta_title       = models.CharField(
        max_length=70, blank=True, validators=[validate_meta_title]
    )
    meta_description = models.CharField(
        max_length=160, blank=True, validators=[validate_meta_description]
    )
    meta_keywords    = models.CharField(max_length=300, blank=True)

    # ── Documents ───────────────────────────────────────────────────────────
    brochure = models.FileField(
        upload_to="brochures/", null=True, blank=True,
        validators=[validate_pdf_file]
    )

    # ── Timestamps ──────────────────────────────────────────────────────────
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Property"
        verbose_name_plural = "Properties"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["listing_type", "property_type"]),
            models.Index(fields=["city", "locality"]),
            models.Index(fields=["is_featured", "status"]),
            models.Index(fields=["price"]),
        ]

    def __str__(self):
        return f"{self.title} ({self.city})"

    def save(self, *args, **kwargs):
        """Auto-generate slug from title if not provided."""
        if not self.slug:
            from apps.core.utils import slugify_unique
            self.slug = slugify_unique(self.title, Property, self.pk)
        super().save(*args, **kwargs)

    @property
    def price_display(self):
        """Return formatted Indian price string."""
        from apps.core.utils import format_price_indian
        return format_price_indian(self.price)

    @property
    def thumbnail(self):
        """Return URL of first image or None."""
        first = self.images.filter(order=1).first() or self.images.first()
        return first.image.url if first else None


# ─── Property Image Model ─────────────────────────────────────────────────────

class PropertyImage(models.Model):
    """Multiple images per property, ordered for gallery display."""

    property  = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="images"
    )
    image     = models.ImageField(
        upload_to="properties/images/",
        validators=[validate_image_file]
    )
    alt_text  = models.CharField(
        max_length=200, blank=True,
        help_text="SEO alt text for the image"
    )
    order     = models.PositiveSmallIntegerField(default=1)
    is_cover  = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Property Image"
        ordering = ["order"]

    def save(self, *args, **kwargs):
        if self.is_cover and self.property_id:
            PropertyImage.objects.filter(property_id=self.property_id, is_cover=True).exclude(pk=self.pk).update(is_cover=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Image {self.order} — {self.property.title}"


# ─── BHK Configuration Model ──────────────────────────────────────────────────

class BHKConfiguration(models.Model):
    """
    Per-BHK unit configuration for a property.
    e.g. 1BHK: 736 sqft, Sold Out | 2BHK: 1304-1484 sqft, Price on Request
    """

    property             = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="bhk_configs"
    )
    bhk_type             = models.CharField(max_length=10, choices=BHKType.choices)
    area_sqft_min        = models.PositiveIntegerField(help_text="Minimum area in sqft")
    area_sqft_max        = models.PositiveIntegerField(
        null=True, blank=True,
        help_text="Max area (for range display like 1304–1484 sqft)"
    )
    super_builtup_area   = models.PositiveIntegerField(null=True, blank=True)
    price                = models.DecimalField(
        max_digits=14, decimal_places=2, null=True, blank=True,
        validators=[validate_positive_price],
        help_text="Leave blank for Price on Request"
    )
    status               = models.CharField(
        max_length=20, choices=BHKStatus.choices, default=BHKStatus.AVAILABLE
    )

    class Meta:
        verbose_name = "BHK Configuration"
        ordering = ["bhk_type"]
        unique_together = ("property", "bhk_type")

    def __str__(self):
        return f"{self.get_bhk_type_display()} — {self.property.title}"


# ─── Floor Plan Model ─────────────────────────────────────────────────────────

class FloorPlan(models.Model):
    """Floor plan image per BHK type."""

    property  = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="floor_plans"
    )
    bhk_type  = models.CharField(max_length=10, choices=BHKType.choices)
    image     = models.ImageField(
        upload_to="properties/floor_plans/",
        validators=[validate_image_file]
    )
    alt_text  = models.CharField(max_length=200, blank=True)

    class Meta:
        verbose_name = "Floor Plan"
        ordering = ["bhk_type"]
        unique_together = ("property", "bhk_type")

    def __str__(self):
        return f"Floor Plan {self.get_bhk_type_display()} — {self.property.title}"


# ─── Property Video Model ─────────────────────────────────────────────────────

class VideoType(models.TextChoices):
    WALKTHROUGH  = "walkthrough",  "Property Walkthrough"
    AERIAL       = "aerial",       "Aerial / Drone View"
    TESTIMONIAL  = "testimonial",  "Client Testimonial"
    CONSTRUCTION = "construction", "Construction Update"
    OTHER        = "other",        "Other"


class PropertyVideo(models.Model):
    """
    Video uploads for a property stored on Cloudflare R2.
    Supports: walkthrough tours, aerial/drone views, testimonials,
    construction updates.

    When USE_R2_STORAGE=True, video field auto-uploads to R2 and
    the DB stores the full CDN URL.
    """

    property     = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="videos"
    )
    video        = models.FileField(
        upload_to="properties/videos/",
        validators=[validate_video_file],
        help_text="Allowed: .mp4, .webm, .mov | Max size: 200MB",
    )
    title        = models.CharField(
        max_length=200, blank=True,
        help_text="Short title for this video clip"
    )
    video_type   = models.CharField(
        max_length=20,
        choices=VideoType.choices,
        default=VideoType.WALKTHROUGH,
        db_index=True,
    )
    thumbnail    = models.ImageField(
        upload_to="properties/video_thumbs/",
        null=True, blank=True,
        validators=[validate_image_file],
        help_text="Optional custom thumbnail (auto-generated if blank)",
    )
    duration_sec = models.PositiveIntegerField(
        null=True, blank=True,
        help_text="Video duration in seconds (optional)"
    )
    order        = models.PositiveSmallIntegerField(
        default=1,
        help_text="Display order — lower number shown first"
    )
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = "Property Video"
        verbose_name_plural = "Property Videos"
        ordering            = ["order", "created_at"]

    def __str__(self):
        return f"{self.get_video_type_display()} — {self.property.title}"
