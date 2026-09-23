"""
apps/properties/urls.py
─────────────────────────────────────────────
Public property URLs:
  GET  /api/properties/              → list with filters
  GET  /api/properties/featured/     → featured listings
  GET  /api/properties/{slug}/       → property detail
  GET  /api/properties/{slug}/related/ → related properties
"""
from django.urls import path
from apps.leads.views import LeadCreateView
from .views import (
    PropertyListView,
    PropertyDetailView,
    FeaturedPropertyView,
    RelatedPropertiesView,
    ResidentialPropertyListView,
    CommercialPropertyListView,
    PlotWeekendVillaPropertyListView,
    InvestmentPropertyListView,
    GiftCityPropertyListView,
    RentPropertyListView,
    SubmittedPropertyView,
)

urlpatterns = [
    path("",                                    PropertyListView.as_view(),                 name="property-list"),
    path("featured/",                           FeaturedPropertyView.as_view(),             name="property-featured"),
    
    # Category routes matching Next.js frontend
    path("residential/",                        ResidentialPropertyListView.as_view(),      name="property-residential"),
    path("residential/<slug:slug>/",            PropertyDetailView.as_view(),               name="property-residential-detail"),
    path("commercial/",                         CommercialPropertyListView.as_view(),       name="property-commercial"),
    path("commercial/<slug:slug>/",             PropertyDetailView.as_view(),               name="property-commercial-detail"),
    path("plot-weekend-villa/",                 PlotWeekendVillaPropertyListView.as_view(), name="property-plot-weekend-villa"),
    path("plot-weekend-villa/<slug:slug>/",     PropertyDetailView.as_view(),               name="property-plot-weekend-villa-detail"),
    path("investment/",                         InvestmentPropertyListView.as_view(),       name="property-investment"),
    path("investment/<slug:slug>/",             PropertyDetailView.as_view(),               name="property-investment-detail"),
    path("gift-city/",                          GiftCityPropertyListView.as_view(),         name="property-gift-city"),
    path("gift-city/<slug:slug>/",              PropertyDetailView.as_view(),               name="property-gift-city-detail"),
    path("rent/",                               RentPropertyListView.as_view(),             name="property-rent"),
    path("rent/<slug:slug>/",                   PropertyDetailView.as_view(),               name="property-rent-detail"),
    
    # Lead & Property submission routes used by frontend
    path("leads/",                              LeadCreateView.as_view(),                   name="property-lead-create"),
    path("submitted-properties/",               SubmittedPropertyView.as_view(),            name="property-submit"),
    
    # Detail routes
    path("<slug:slug>/",                        PropertyDetailView.as_view(),               name="property-detail"),
    path("<slug:slug>/related/",                RelatedPropertiesView.as_view(),            name="property-related"),
]
