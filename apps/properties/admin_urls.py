"""
apps/properties/admin_urls.py
─────────────────────────────────────────────
Admin (JWT-protected) property URLs:
  GET/POST   /api/admin/properties/                              → list/create
  GET/PATCH/DELETE /api/admin/properties/{id}/                   → detail/update/delete
  POST       /api/admin/properties/import/                       → CSV bulk import
  GET        /api/admin/properties/import/sample/                → Download sample CSV
  POST       /api/admin/properties/{id}/images/                  → upload images
  DELETE     /api/admin/properties/{id}/images/{img_id}/         → delete image
  GET/POST   /api/admin/properties/{id}/bhk/                     → list/add BHK config
  PUT/DELETE /api/admin/properties/{id}/bhk/{bhk_id}/            → update/delete BHK config
  GET/POST   /api/admin/properties/{id}/floor-plans/             → list/add floor plan
  DELETE     /api/admin/properties/{id}/floor-plans/{fp_id}/     → delete floor plan
  GET/POST   /api/admin/properties/{id}/videos/                  → list/upload video
  DELETE     /api/admin/properties/{id}/videos/{vid_id}/         → delete video
"""
from django.urls import path
from .views import (
    PropertyAdminListCreateView,
    PropertyAdminDetailView,
    PropertyImageUploadView,
    PropertyImageDeleteView,
    BHKConfigView,
    BHKConfigDetailView,
    FloorPlanView,
    FloorPlanDeleteView,
    PropertyCSVImportView,
)
from .video_views import PropertyVideoView, PropertyVideoDeleteView

urlpatterns = [
    # CSV Bulk Import (must be before <int:pk>/ to avoid URL conflicts)
    path("import/sample/",                       PropertyCSVImportView.as_view(),        name="admin-property-csv-sample"),
    path("import/",                              PropertyCSVImportView.as_view(),        name="admin-property-csv-import"),

    # Properties CRUD
    path("",                                     PropertyAdminListCreateView.as_view(),  name="admin-property-list"),
    path("<int:pk>/",                            PropertyAdminDetailView.as_view(),      name="admin-property-detail"),

    # Images
    path("<int:pk>/images/",                     PropertyImageUploadView.as_view(),      name="admin-property-images"),
    path("<int:pk>/images/<int:img_id>/",        PropertyImageDeleteView.as_view(),      name="admin-property-image-delete"),

    # BHK Configurations
    path("<int:pk>/bhk/",                        BHKConfigView.as_view(),               name="admin-bhk-config"),
    path("<int:pk>/bhk/<int:bhk_id>/",           BHKConfigDetailView.as_view(),         name="admin-bhk-config-detail"),

    # Floor Plans
    path("<int:pk>/floor-plans/",                FloorPlanView.as_view(),               name="admin-floor-plans"),
    path("<int:pk>/floor-plans/<int:fp_id>/",    FloorPlanDeleteView.as_view(),         name="admin-floor-plan-delete"),

    # Videos
    path("<int:pk>/videos/",                     PropertyVideoView.as_view(),            name="admin-property-videos"),
    path("<int:pk>/videos/<int:vid_id>/",        PropertyVideoDeleteView.as_view(),      name="admin-property-video-delete"),
]
