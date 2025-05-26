# backend/api/views.py
from rest_framework import viewsets, permissions, filters, status, parsers # ASEGÚRATE: 'parsers' está aquí
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Player, Team, Report, UserProfile, ReportAttachment,
    PlayerInterest, Offer
)
from .serializers import (
    PlayerSerializer, TeamSerializer, ReportSerializer, UserProfileSerializer,
    ReportAttachmentSerializer, PlayerInterestSerializer, OfferSerializer
)
from .filters import PlayerFilter

class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all().select_related(
        'team', 'loan_origin_team', 'loan_destination_team'
    ).prefetch_related(
        'reports', 'interests_received', 'offers_received'
    )
    serializer_class = PlayerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = PlayerFilter
    search_fields = ['name', 'nationality', 'team__name', 'agency_representing']
    # CORREGIDO: 'calculated_age' cambiado a 'date_of_birth' para ordenar por edad
    ordering_fields = ['name', 'date_of_birth', 'nationality', 'market_value', 'contract_until']

    @action(detail=True, methods=['get'], url_path='summary-report')
    def summary_report(self, request, pk=None):
        player = self.get_object()
        summary_report_obj = Report.objects.filter(
            player=player, report_specialization='SUMMARY'
        ).order_by('-report_date').first()
        
        if not summary_report_obj:
            return Response({"detail": "No summary report found for this player."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ReportSerializer(summary_report_obj, context={'request': request})
        return Response(serializer.data)


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'country', 'league']
    ordering_fields = ['name', 'country']


class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all().select_related(
        'player', 'scout', 'summary_report_parent'
    ).prefetch_related('attachments')
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] 

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['player', 'scout', 'report_specialization', 'summary_report_parent']
    search_fields = ['player__name', 'scout__username', 'summary', 'match_observed']
    ordering_fields = ['report_date', 'overall_rating', 'player__name']

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(scout=self.request.user) 
        else:
            serializer.save() 
            
    @action(detail=True, methods=['post'], parser_classes=[permissions.IsAuthenticated, parsers.MultiPartParser]) # USA 'parsers.MultiPartParser'
    def upload_attachment(self, request, pk=None):
        report = self.get_object()
        # TODO: Implementar permisos
            
        file_serializer = ReportAttachmentSerializer(data=request.data, context={'request': request})
        if file_serializer.is_valid():
            file_serializer.save(report=report)
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all().select_related('user', 'team')
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated] 

    @action(detail=False, methods=['get'], url_path='me', permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User profile not found.'}, status=status.HTTP_404_NOT_FOUND)
        except AttributeError: 
            return Response({'error': 'User profile not accessible or does not exist.'}, status=status.HTTP_404_NOT_FOUND)


class PlayerInterestViewSet(viewsets.ModelViewSet):
    queryset = PlayerInterest.objects.all().select_related('player', 'interested_party_user__profile__team')
    serializer_class = PlayerInterestSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] 
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['player', 'interested_party_user', 'status'] 
    search_fields = ['player__name', 'interested_party_user__username', 'notes']
    ordering_fields = ['created_at', 'interest_level']

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(interested_party_user=self.request.user)
        else:
            serializer.save()


class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all().select_related('player', 'offering_team', 'responsible_user', 'previous_offer')
    serializer_class = OfferSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['player', 'offering_team', 'status', 'is_counter_offer']
    search_fields = ['player__name', 'offering_team__name', 'clauses']
    ordering_fields = ['offer_date', 'salary_amount', 'transfer_fee']

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(responsible_user=self.request.user)
        else:
            serializer.save()