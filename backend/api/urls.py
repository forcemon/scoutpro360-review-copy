# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PlayerViewSet, ReportViewSet, TeamViewSet, UserProfileViewSet,
    PlayerInterestViewSet, OfferViewSet
)

router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='team') # DEJA SOLO ESTA LÍNEA ACTIVA POR AHORA

# Comenta las demás registraciones temporalmente:
# router.register(r'players', PlayerViewSet, basename='player')
# router.register(r'reports', ReportViewSet, basename='report')
# router.register(r'userprofiles', UserProfileViewSet, basename='userprofile')
# router.register(r'player-interests', PlayerInterestViewSet, basename='playerinterest')
# router.register(r'offers', OfferViewSet, basename='offer')

urlpatterns = [
    path('', include(router.urls)),
]