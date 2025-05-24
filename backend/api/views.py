# backend/api/views.py
from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
# Asegúrate que todos los modelos a usar estén definidos en models.py e importados aquí
from .models import Player, Team, Report, UserProfile
# Changed: Importa solo los serializers que SÍ existen en serializers.py
from .serializers import PlayerSerializer, TeamSerializer, ReportSerializer, UserProfileSerializer
# Asegúrate que PlayerFilter exista en filters.py
from .filters import PlayerFilter

class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all().select_related('team') # Optimización
    # Changed: Usa el PlayerSerializer general para todas las acciones
    serializer_class = PlayerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # O la que uses

    # Mantenemos los filtros como estaban (con OrderingFilter comentado si seguía así)
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        # filters.OrderingFilter # <--- Mantenlo comentado si lo hiciste antes
    ]
    filterset_class = PlayerFilter
    search_fields = ['name', 'nationality', 'team__name']
    # Asegúrate que los campos aquí existan en el modelo Player
    ordering_fields = ['name', 'date_of_birth', 'nationality', 'market_value'] # 'age' es una propiedad, ordena por date_of_birth

    # Eliminado/Comentado: Ya no se necesita si usamos un solo serializer_class
    # def get_serializer_class(self):
    #     if self.action == 'list':
    #         # return PlayerListSerializer # No existe
    #         return PlayerSerializer # Usa el general
    #     # return PlayerDetailSerializer # No existe
    #     return PlayerSerializer # Usa el general


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    # filter_backends = [filters.SearchFilter]
    # search_fields = ['name', 'country', 'league']


class ReportViewSet(viewsets.ModelViewSet): # Cambiado de ReadOnly si necesitas CRUD completo
    # queryset = Report.objects.all().order_by('-created_at') # Asegúrate que created_at exista en Report
    # Corregido queryset para usar el orden definido en Meta:
    queryset = Report.objects.all().select_related('player', 'scout')
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    # filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    # filterset_fields = ['player', 'scout']
    # ordering_fields = ['report_date', 'overall_rating']


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all().select_related('user')
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAdminUser] # Ejemplo
