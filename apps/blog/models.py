"""
apps/blog/models.py
─────────────────────────────────────────────
Blog post model optimized for SEO.
  - Slugified URLs
  - Meta title/description/keywords
  - Auto read time calculation
  - Tags support
  - Published/Draft state
"""
from django.db import models
from apps.core.validators import (
    validate_image_file,
    validate_meta_description,
    validate_meta_title,
)
from apps.core.utils import calculate_read_time


class BlogPost(models.Model):
    """
    Blog article for SEO content marketing.
    Examples: 'Best areas to invest in Ahmedabad 2025',
              'RERA Act explained for homebuyers',
              'Gift City — complete investment guide'
    """

    # ── Content ───────────────────────────────────────────────────────────────
    title           = models.CharField(max_length=300)
    slug            = models.SlugField(max_length=350, unique=True, blank=True)
    excerpt         = models.TextField(
        max_length=500, blank=True,
        help_text="Short summary shown on listing cards (max 500 chars)"
    )
    content         = models.TextField(
        help_text="Full article content (HTML or Markdown)"
    )
    featured_image  = models.ImageField(
        upload_to="blog/images/",
        null=True, blank=True,
        validators=[validate_image_file],
    )
    featured_image_alt = models.CharField(
        max_length=200, blank=True,
        help_text="SEO alt text for featured image"
    )

    # ── Publishing ────────────────────────────────────────────────────────────
    is_published  = models.BooleanField(default=False, db_index=True)
    published_at  = models.DateTimeField(null=True, blank=True, db_index=True)
    read_time     = models.PositiveSmallIntegerField(
        default=1, help_text="Estimated read time in minutes (auto-calculated)"
    )

    # ── Tags (comma-separated for simplicity) ────────────────────────────────
    tags = models.CharField(
        max_length=500, blank=True,
        help_text="Comma-separated tags: Ahmedabad, Investment, RERA, Gift City"
    )

    # ── SEO Fields ────────────────────────────────────────────────────────────
    meta_title       = models.CharField(
        max_length=70, blank=True,
        validators=[validate_meta_title],
        help_text="SEO title (max 70 chars). Defaults to post title if blank."
    )
    meta_description = models.CharField(
        max_length=160, blank=True,
        validators=[validate_meta_description],
        help_text="SEO meta description (max 160 chars)"
    )
    meta_keywords    = models.CharField(
        max_length=300, blank=True,
        help_text="Comma-separated keywords for SEO"
    )

    # ── Timestamps ────────────────────────────────────────────────────────────
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Blog Post"
        verbose_name_plural = "Blog Posts"
        ordering = ["-published_at", "-created_at"]
        indexes = [
            models.Index(fields=["is_published", "published_at"]),
            models.Index(fields=["slug"]),
        ]

    def __str__(self):
        status = "✓ Published" if self.is_published else "✗ Draft"
        return f"[{status}] {self.title}"

    def save(self, *args, **kwargs):
        """Auto-generate slug and calculate read time."""
        if not self.slug:
            from apps.core.utils import slugify_unique
            self.slug = slugify_unique(self.title, BlogPost, self.pk)

        # Auto-calculate read time from content
        if self.content:
            self.read_time = calculate_read_time(self.content)

        # Default meta_title to post title
        if not self.meta_title:
            self.meta_title = self.title[:70]

        super().save(*args, **kwargs)

    @property
    def tag_list(self):
        """Return tags as a Python list."""
        return [t.strip() for t in self.tags.split(",") if t.strip()]
