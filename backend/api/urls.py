# api/urls.py
# ADDED: Register ReportViewSet

from django.urls import path, include
from rest_framework.routers import DefaultRouter
# --- MODIFICACIÓN: Importar ambos ViewSets ---
from .views import PlayerViewSet, ReportViewSet

# Create a router
router = DefaultRouter()

# Register PlayerViewSet
router.register(r'players', PlayerViewSet, basename='player')

# --- INICIO: Registrar ReportViewSet ---
# This will create URLs like /api/reports/ and /api/reports/{id}/
router.register(r'reports', ReportViewSet, basename='report')
# --- FIN: Registrar ReportViewSet ---


# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
    # You could add other non-router API URLs here if needed
]
