"""
apps/blog/serializers.py
─────────────────────────────────────────────
  - BlogPostListSerializer   → lightweight for blog listing page
  - BlogPostDetailSerializer → full post for detail page (includes SEO fields)
  - BlogPostAdminSerializer  → write serializer for create/update
"""
from rest_framework import serializers
from .models import BlogPost
from apps.core.validators import validate_meta_description, validate_meta_title
from apps.core.utils import slugify_unique


class BlogPostListSerializer(serializers.ModelSerializer):
    """Lightweight — for blog listing cards."""
    featured_image_url = serializers.SerializerMethodField()
    tag_list = serializers.ReadOnlyField()

    class Meta:
        model = BlogPost
        fields = [
            "id", "title", "slug", "excerpt",
            "featured_image_url", "featured_image_alt",
            "published_at", "read_time",
            "tag_list", "tags",
            "meta_title", "meta_description",
        ]

    def get_featured_image_url(self, obj):
        request = self.context.get("request")
        if obj.featured_image and request:
            return request.build_absolute_uri(obj.featured_image.url)
        return None


class BlogPostDetailSerializer(serializers.ModelSerializer):
    """Full post detail including content and SEO fields."""
    featured_image_url = serializers.SerializerMethodField()
    tag_list = serializers.ReadOnlyField()

    class Meta:
        model = BlogPost
        fields = [
            "id", "title", "slug",
            "excerpt", "content",
            "featured_image_url", "featured_image_alt",
            "is_published", "published_at", "read_time",
            "tags", "tag_list",
            "meta_title", "meta_description", "meta_keywords",
            "created_at", "updated_at",
        ]

    def get_featured_image_url(self, obj):
        request = self.context.get("request")
        if obj.featured_image and request:
            return request.build_absolute_uri(obj.featured_image.url)
        return None


class BlogPostAdminSerializer(serializers.ModelSerializer):
    """Admin write serializer — full control."""
    read_time = serializers.ReadOnlyField()   # auto-calculated on model.save()

    class Meta:
        model = BlogPost
        fields = [
            "id", "title", "slug",
            "excerpt", "content",
            "featured_image", "featured_image_alt",
            "is_published", "published_at",
            "read_time",
            "tags",
            "meta_title", "meta_description", "meta_keywords",
        ]
        extra_kwargs = {
            "slug":          {"required": False},
            "published_at":  {"required": False},
        }

    def validate_meta_title(self, value):
        if value:
            validate_meta_title(value)
        return value

    def validate_meta_description(self, value):
        if value:
            validate_meta_description(value)
        return value

    def validate_excerpt(self, value):
        if value and len(value) > 500:
            raise serializers.ValidationError(
                "Excerpt must be 500 characters or fewer."
            )
        return value

    def validate_content(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Content cannot be empty.")
        return value

    def validate(self, attrs):
        # If publishing, published_at should be set
        if attrs.get("is_published") and not attrs.get("published_at"):
            from django.utils import timezone
            attrs["published_at"] = timezone.now()
        return attrs

    def create(self, validated_data):
        if not validated_data.get("slug"):
            validated_data["slug"] = slugify_unique(validated_data["title"], BlogPost)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "title" in validated_data and not validated_data.get("slug"):
            validated_data["slug"] = slugify_unique(
                validated_data["title"], BlogPost, instance.pk
            )
        return super().update(instance, validated_data)
