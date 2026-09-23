"""
Root URL configuration — Real Estate Backend
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Django admin
    path("admin/", admin.site.urls),

    # Public APIs
    path("api/properties/", include("apps.properties.urls")),
    path("api/leads/",       include("apps.leads.urls")),
    path("api/blog/",        include("apps.blog.urls")),
    path("api/search/",      include("apps.properties.search_urls")),

    # Auth (JWT)
    path("api/auth/",        include("apps.core.auth_urls")),

    # Admin APIs (JWT protected)
    path("api/admin/properties/", include("apps.properties.admin_urls")),
    path("api/admin/leads/",      include("apps.leads.admin_urls")),
    path("api/admin/blog/",       include("apps.blog.admin_urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
