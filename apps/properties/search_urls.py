"""
apps/properties/search_urls.py
─────────────────────────────────────────────
Search endpoint:
  GET /api/search/    → full property search with all filters
  GET /api/search/suggestions/  → city/locality suggestions for autocomplete
"""
from django.urls import path
from .search_views import PropertySearchView, SearchSuggestionsView

urlpatterns = [
    path("",             PropertySearchView.as_view(),      name="property-search"),
    path("suggestions/", SearchSuggestionsView.as_view(),   name="search-suggestions"),
]
