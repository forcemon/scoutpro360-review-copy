# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PlayerViewSet, ReportViewSet, TeamViewSet, UserProfileViewSet,
    PlayerInterestViewSet, OfferViewSet, PlayerHistoricalDataViewSet # Asegúrate de importar todos los ViewSets
)

router = DefaultRouter()
router.register(r'players', PlayerViewSet, basename='player')
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'reports', ReportViewSet, basename='report')
router.register(r'userprofiles', UserProfileViewSet, basename='userprofile')
router.register(r'player-interests', PlayerInterestViewSet, basename='playerinterest')
router.register(r'offers', OfferViewSet, basename='offer')
router.register(r'player-historical-data', PlayerHistoricalDataViewSet, basename='playerhistoricaldata')


urlpatterns = [
    path('', include(router.urls)),
]
