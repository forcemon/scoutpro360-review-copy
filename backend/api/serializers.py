# backend/api/serializers.py
from rest_framework import serializers
# Cambiado: Ya no importa Position
from .models import Player, Team, Report, UserProfile, POSITION_CHOICES #, Position
from django.contrib.auth.models import User

# --- MAPA DE POSICIONES (para obtener nombres legibles) ---
POSITION_MAP = {choice[0]: choice[1] for choice in POSITION_CHOICES}
# --- FIN MAPA ---

# --- SERIALIZER POSITION ELIMINADO ---
# class PositionSerializer(serializers.ModelSerializer): ...


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


class PlayerSerializer(serializers.ModelSerializer):
    team = TeamSerializer(read_only=True)
    team_id = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(), source='team', write_only=True, allow_null=True
    )
    calculated_age = serializers.IntegerField(read_only=True)

    # --- Añadido: Campos _display para posiciones ---
    position1_display = serializers.SerializerMethodField()
    position2_display = serializers.SerializerMethodField()
    position3_display = serializers.SerializerMethodField()
    # --- Fin campos _display ---

    class Meta:
        model = Player
        fields = [
            'id', 'name',
            'team',
            'team_id',
            # 'positions', # Eliminado M2M
            'position1', # Clave Posición 1
            'position2', # Clave Posición 2
            'position3', # Clave Posición 3
            'position1_display', # Nombre legible Posición 1
            'position2_display', # Nombre legible Posición 2
            'position3_display', # Nombre legible Posición 3
            'calculated_age',
            'date_of_birth',
            'city_of_birth',
            'nationality', 'height', 'weight', 'preferred_foot',
            'market_value',
            'market_value_currency',
            'contract_until',
            'image_url',
            'strengths', 'weaknesses',
            # Atributos...
            'control', 'regate', 'pase', 'precision_tiro', 'potencia_tiro',
            'tiros_lejanos', 'tiros_libres', 'penales', 'remate_cabeza',
            'saques_banda', 'velocidad', 'agilidad', 'resistencia', 'fuerza',
            'anticipacion', 'posicionamiento', 'vision_juego', 'trabajo_equipo',
            'liderazgo', 'marcaje', 'entradas', 'talento',
            'created_at', 'updated_at'
        ]
        read_only_fields = ('calculated_age', 'created_at', 'updated_at',
                           'position1_display', 'position2_display', 'position3_display') # Campos calculados

    # --- Métodos para obtener nombres legibles de posiciones ---
    def get_position1_display(self, obj):
        return POSITION_MAP.get(obj.position1, obj.position1) # Fallback a la clave

    def get_position2_display(self, obj):
        return POSITION_MAP.get(obj.position2, obj.position2) # Fallback a la clave

    def get_position3_display(self, obj):
        return POSITION_MAP.get(obj.position3, obj.position3) # Fallback a la clave
    # --- Fin métodos _display ---


class ReportSerializer(serializers.ModelSerializer):
    player_id = serializers.PrimaryKeyRelatedField(queryset=Player.objects.all(), source='player', write_only=True)
    player_name = serializers.CharField(source='player.name', read_only=True)
    scout_username = serializers.CharField(source='scout.username', read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'player_id', 'player_name', 'scout_username', 'report_date',
            'match_observed', 'overall_rating', 'potential_rating',
            'summary', 'detailed_notes', 'created_at', 'updated_at'
        ]


class UserProfileSerializer(serializers.ModelSerializer):
    # Hacer 'user' escribible para permitir la asignación al crear/actualizar un UserProfile
    # Si UserProfile se crea automáticamente con User (ej. señales), esto podría ser read_only.
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    username = serializers.ReadOnlyField(source='user.username')
    team_name = serializers.CharField(source='team.name', read_only=True, allow_null=True)
    team_id = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(), source='team', write_only=True, allow_null=True, required=False
    )

    class Meta:
        model = UserProfile
        fields = ['user', 'username', 'role', 'team', 'team_id', 'team_name', 'phone_number', 'bio']
        read_only_fields = ('username', 'team_name')
