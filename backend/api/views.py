# backend/api/views.py
from rest_framework import viewsets, permissions, filters, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Player, Team, Report, UserProfile, ReportAttachment,
    PlayerInterest, Offer, PlayerHistoricalData # Asegúrate que todos los modelos estén importados
)
from .serializers import (
    PlayerSerializer, TeamSerializer, ReportSerializer, UserProfileSerializer,
    ReportAttachmentSerializer, PlayerInterestSerializer, OfferSerializer,
    PlayerHistoricalDataSerializer # Asegúrate que todos los serializers estén importados
)
from .filters import PlayerFilter # Asumiendo que tienes PlayerFilter en filters.py

class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all().select_related(
        'team', 'loan_origin_team', 'loan_destination_team'
    ).prefetch_related(
        'reports', 'interests_received', 'offers_received', 'historical_data'
    )
    serializer_class = PlayerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = PlayerFilter
    search_fields = ['name', 'nationality', 'team__name', 'agency_representing', 'position1', 'position2', 'position3']
    ordering_fields = ['name', 'date_of_birth', 'nationality', 'market_value', 'contract_until', 'updated_at']

    # Acción personalizada para obtener el informe de resumen más reciente de un jugador
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
    ordering_fields = ['name', 'country', 'league']


class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all().select_related(
        'player', 'scout', 'summary_report_parent'
    ).prefetch_related('attachments')
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] 

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['player', 'scout', 'report_specialization', 'summary_report_parent__id'] # Filtrar por ID del padre
    search_fields = ['player__name', 'scout__username', 'summary', 'match_observed', 'detailed_notes']
    ordering_fields = ['report_date', 'overall_rating', 'player__name', 'updated_at']

    def perform_create(self, serializer):
        # Asigna el scout automáticamente si el usuario está autenticado
        if self.request.user.is_authenticated:
            serializer.save(scout=self.request.user) 
        else:
            # Considera si permitir creación anónima o lanzar un error de permiso
            serializer.save() 
            
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated], parser_classes=[parsers.MultiPartParser, parsers.FormParser])
    def upload_attachment(self, request, pk=None):
        report = self.get_object()
        
        # Verificar si el usuario actual es el scout del informe o tiene permisos de edición
        if report.scout != request.user and not request.user.is_staff: # Ejemplo simple de permiso
             return Response({"detail": "No tienes permiso para añadir adjuntos a este informe."}, status=status.HTTP_403_FORBIDDEN)

        file_serializer = ReportAttachmentSerializer(data=request.data, context={'request': request})
        if file_serializer.is_valid():
            file_serializer.save(report=report) # Asigna el informe al adjunto
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all().select_related('user', 'team')
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated] # Generalmente, los perfiles son privados o solo para admin

    @action(detail=False, methods=['get'], url_path='me', permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        try:
            # Intenta obtener el perfil. Si no existe, podría crearse aquí o manejarse en signals.
            profile, created = UserProfile.objects.get_or_create(user=request.user)
            if created:
                # Puedes establecer valores por defecto si es un perfil nuevo
                profile.role = 'VIEWER' # O un rol por defecto
                profile.save()
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except AttributeError: 
            # Esto puede pasar si request.user es None (no debería si IsAuthenticated está activo)
            return Response({'error': 'Token inválido o usuario no encontrado.'}, status=status.HTTP_401_UNAUTHORIZED)


class PlayerInterestViewSet(viewsets.ModelViewSet):
    queryset = PlayerInterest.objects.all().select_related('player', 'interested_party_user__profile__team')
    serializer_class = PlayerInterestSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] 
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['player__id', 'interested_party_user__id', 'status', 'interest_level'] 
    search_fields = ['player__name', 'interested_party_user__username', 'notes']
    ordering_fields = ['created_at', 'interest_level', 'player__name']

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(interested_party_user=self.request.user)
        else:
            serializer.save() # O manejar error de permiso


class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all().select_related('player', 'offering_team', 'responsible_user', 'previous_offer')
    serializer_class = OfferSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['player__id', 'offering_team__id', 'status', 'is_counter_offer', 'responsible_user__id']
    search_fields = ['player__name', 'offering_team__name', 'clauses']
    ordering_fields = ['offer_date', 'salary_amount', 'transfer_fee', 'updated_at']

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(responsible_user=self.request.user)
        else:
            serializer.save() # O manejar error de permiso

class PlayerHistoricalDataViewSet(viewsets.ModelViewSet):
    queryset = PlayerHistoricalData.objects.all().select_related('player')
    serializer_class = PlayerHistoricalDataSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['player__id', 'date_recorded']
    ordering_fields = ['player__name', '-date_recorded']

    # Aquí podrías añadir lógica para que solo ciertos usuarios puedan crear/editar datos históricos.
