"""
apps/blog/views.py
─────────────────────────────────────────────
Public:
  GET /api/blog/          → List published posts (paginated)
  GET /api/blog/{slug}/   → Post detail

Admin (JWT):
  GET/POST    /api/admin/blog/          → List all (incl. drafts) / Create
  GET/PATCH/DELETE /api/admin/blog/{id}/ → Detail / Update / Delete
"""
from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
import django_filters

from .models import BlogPost
from .serializers import (
    BlogPostListSerializer,
    BlogPostDetailSerializer,
    BlogPostAdminSerializer,
)
from apps.core.pagination import StandardResultsPagination


# ─── Blog Filter ──────────────────────────────────────────────────────────────

class BlogFilter(django_filters.FilterSet):
    tag         = django_filters.CharFilter(field_name="tags", lookup_expr="icontains")
    date_from   = django_filters.DateFilter(field_name="published_at", lookup_expr="gte")
    date_to     = django_filters.DateFilter(field_name="published_at", lookup_expr="lte")

    class Meta:
        model  = BlogPost
        fields = ["is_published", "tag", "date_from", "date_to"]


# ═══════════════════════════════════════════════════════════════
# PUBLIC VIEWS
# ═══════════════════════════════════════════════════════════════

class BlogPostListView(generics.ListAPIView):
    """
    GET /api/blog/
    List all published blog posts with pagination.

    Query params:
      ?tag=     filter by tag (e.g. ?tag=Ahmedabad)
      ?search=  search in title, excerpt
      ?page=    page number
      ?page_size= items per page (default 10, max 50)
    """
    permission_classes = [AllowAny]
    serializer_class   = BlogPostListSerializer
    pagination_class   = StandardResultsPagination
    filter_backends    = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class    = BlogFilter
    search_fields      = ["title", "excerpt", "tags"]
    ordering_fields    = ["published_at", "read_time"]
    ordering           = ["-published_at"]

    def get_queryset(self):
        return BlogPost.objects.filter(is_published=True)


class BlogPostDetailView(generics.RetrieveAPIView):
    """
    GET /api/blog/{slug}/
    Full blog post detail — includes content and SEO fields.
    """
    permission_classes = [AllowAny]
    serializer_class   = BlogPostDetailSerializer
    lookup_field       = "slug"

    def get_queryset(self):
        return BlogPost.objects.filter(is_published=True)


# ═══════════════════════════════════════════════════════════════
# ADMIN VIEWS (JWT protected)
# ═══════════════════════════════════════════════════════════════

class BlogAdminListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/admin/blog/   → List all posts (including drafts)
    POST /api/admin/blog/   → Create new post
    """
    permission_classes = [IsAuthenticated]
    serializer_class   = BlogPostAdminSerializer
    pagination_class   = StandardResultsPagination
    filter_backends    = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class    = BlogFilter
    search_fields      = ["title", "tags"]
    ordering           = ["-created_at"]
    parser_classes     = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return BlogPost.objects.all()  # Admin sees all incl. drafts


class BlogAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/admin/blog/{id}/   → Post detail
    PATCH  /api/admin/blog/{id}/   → Update post
    DELETE /api/admin/blog/{id}/   → Delete post
    """
    permission_classes = [IsAuthenticated]
    serializer_class   = BlogPostAdminSerializer
    queryset           = BlogPost.objects.all()
    http_method_names  = ["get", "patch", "delete", "head", "options"]
    parser_classes     = [MultiPartParser, FormParser, JSONParser]
