# backend/api/serializers.py
from rest_framework import serializers
from .models import (
    Player, Team, Report, UserProfile, ReportAttachment,
    PlayerInterest, Offer, PlayerHistoricalData, # Asegúrate que todos los modelos estén importados
    POSITION_CHOICES, USER_ROLE_CHOICES, REPORT_SPECIALIZATION_CHOICES # Importar choices
)
from django.contrib.auth.models import User

# Mapas para obtener el display name de los choices
POSITION_MAP = dict(POSITION_CHOICES)
USER_ROLE_MAP = dict(USER_ROLE_CHOICES)
REPORT_SPECIALIZATION_MAP = dict(REPORT_SPECIALIZATION_CHOICES)


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


class PlayerSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True, allow_null=True)
    team_id = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(), source='team', write_only=True, allow_null=True, required=False
    )
    calculated_age = serializers.IntegerField(read_only=True, allow_null=True) # Permitir null si no hay fecha de nacimiento
    
    position1_display = serializers.SerializerMethodField()
    position2_display = serializers.SerializerMethodField()
    position3_display = serializers.SerializerMethodField()
    
    contract_status_display = serializers.CharField(source='get_contract_status_display', read_only=True, allow_null=True)
    
    loan_origin_team_details = TeamSerializer(source='loan_origin_team', read_only=True, allow_null=True)
    loan_destination_team_details = TeamSerializer(source='loan_destination_team', read_only=True, allow_null=True)

    # Placeholder Key Performance Statistics
    goles_365_dias = serializers.SerializerMethodField(read_only=True)
    asistencias_365_dias = serializers.SerializerMethodField(read_only=True)
    partidos_jugados_365_dias = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Player
        fields = [
            'id', 'name', 'team_name', 'team_id', 
            'position1', 'position2', 'position3',
            'position1_display', 'position2_display', 'position3_display',
            'calculated_age', 'date_of_birth', 'city_of_birth',
            'nationality', 'height', 'weight', 'preferred_foot',
            'market_value', 'market_value_currency', 'contract_until',
            'image_url', 'strengths', 'weaknesses',
            # Atributos
            'control', 'regate', 'pase', 'precision_tiro', 'potencia_tiro',
            'tiros_lejanos', 'tiros_libres', 'penales', 'remate_cabeza',
            'saques_banda', 'velocidad', 'agilidad', 'resistencia', 'fuerza',
            'anticipacion', 'posicionamiento', 'vision_juego', 'trabajo_equipo',
            'liderazgo', 'marcaje', 'entradas', 'talento',
            # Contractual
            'contract_status', 'contract_status_display', 
            'loan_origin_team', 'loan_origin_team_details', # Campo ForeignKey para escribir
            'loan_destination_team', 'loan_destination_team_details', # Campo ForeignKey para escribir
            'agency_representing',
            'goles_365_dias', 'asistencias_365_dias', 'partidos_jugados_365_dias', # Added placeholder stats
            'created_at', 'updated_at'
        ]
        read_only_fields = (
            'calculated_age', 'created_at', 'updated_at',
            'position1_display', 'position2_display', 'position3_display',
            'team_name', 'contract_status_display',
            'loan_origin_team_details', 'loan_destination_team_details',
            'goles_365_dias', 'asistencias_365_dias', 'partidos_jugados_365_dias' # Added placeholder stats
        )
        extra_kwargs = {
            'team': {'read_only': True}, # El objeto completo es solo lectura, se usa team_id para escribir
            'loan_origin_team': {'write_only': True, 'required': False, 'allow_null': True},
            'loan_destination_team': {'write_only': True, 'required': False, 'allow_null': True},
        }

    def get_position1_display(self, obj):
        return POSITION_MAP.get(obj.position1, obj.position1)

    def get_position2_display(self, obj):
        return POSITION_MAP.get(obj.position2, obj.position2) if obj.position2 else None

    def get_position3_display(self, obj):
        return POSITION_MAP.get(obj.position3, obj.position3) if obj.position3 else None

    def get_goles_365_dias(self, obj):
        # Placeholder value
        return 12 

    def get_asistencias_365_dias(self, obj):
        # Placeholder value
        return 8

    def get_partidos_jugados_365_dias(self, obj):
        # Placeholder value
        return 25


class ReportAttachmentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = ReportAttachment
        fields = ['id', 'report', 'file', 'file_url', 'description', 'uploaded_at']
        read_only_fields = ['file_url', 'uploaded_at']
        extra_kwargs = {
            'report': {'write_only': True, 'required': False} # El reporte se asigna en la vista
        }

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url') and request:
            return request.build_absolute_uri(obj.file.url)
        return None


class ReportSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player.name', read_only=True, allow_null=True)
    scout_username = serializers.CharField(source='scout.username', read_only=True, allow_null=True)
    report_specialization_display = serializers.CharField(source='get_report_specialization_display', read_only=True, allow_null=True)
    attachments = ReportAttachmentSerializer(many=True, read_only=True)
    overall_rating_on_5_scale = serializers.SerializerMethodField(read_only=True)

    # Campos para escribir IDs
    player_id = serializers.PrimaryKeyRelatedField(
        queryset=Player.objects.all(), source='player', write_only=True, allow_null=True, required=False
    )
    scout_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='scout', write_only=True, allow_null=True, required=False
    )
    summary_report_parent_id = serializers.PrimaryKeyRelatedField(
        queryset=Report.objects.filter(report_specialization='SUMMARY'), 
        source='summary_report_parent', 
        write_only=True, 
        allow_null=True, 
        required=False
    )

    class Meta:
        model = Report
        fields = [
            'id', 'player_id', 'player_name', 'scout_id', 'scout_username', 'report_date',
            # 'title', # Removed title field as per instruction
            'report_specialization', 'report_specialization_display',
            'summary_report_parent_id', 
            'match_observed', 'overall_rating', 'overall_rating_on_5_scale', 'potential_rating',
            'summary', 'detailed_notes', 'attachments',
            'created_at', 'updated_at'
        ]
        read_only_fields = (
            'player_name', 'scout_username', 'report_specialization_display', 
            'attachments', 'created_at', 'updated_at',
            'overall_rating_on_5_scale' # Added to read_only_fields
        )

    def get_overall_rating_on_5_scale(self, obj):
        if obj.overall_rating is not None:
            # Calculate 0-5 scale value
            rating_on_5 = (obj.overall_rating / 100) * 5
            # Round to one decimal place
            return round(rating_on_5, 1)
        return None


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True) # Añadir email
    team_name = serializers.CharField(source='team.name', read_only=True, allow_null=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True, allow_null=True)

    # Para escribir, se espera el ID del usuario y opcionalmente el ID del equipo
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True, required=False)
    team_id = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='team', write_only=True, allow_null=True, required=False)

    class Meta:
        model = UserProfile
        fields = [
            'id', 'user_id', 'username', 'email', 'role', 'role_display', 
            'team_id', 'team_name', 'phone_number', 'bio', 'profile_image_url'
        ]
        read_only_fields = ('username', 'email', 'team_name', 'role_display')
        extra_kwargs = {
            'user': {'read_only': True}, # El objeto User completo es de solo lectura
        }

class PlayerInterestSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player.name', read_only=True, allow_null=True)
    interested_party_username = serializers.CharField(source='interested_party_user.username', read_only=True, allow_null=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True, allow_null=True)

    player_id = serializers.PrimaryKeyRelatedField(queryset=Player.objects.all(), source='player', write_only=True)
    interested_party_user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='interested_party_user', write_only=True, required=False)


    class Meta:
        model = PlayerInterest
        fields = [
            'id', 'player_id', 'player_name', 'interested_party_user_id', 'interested_party_username',
            'status', 'status_display', 'interest_level', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ('player_name', 'interested_party_username', 'status_display', 'created_at', 'updated_at')


class OfferSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player.name', read_only=True, allow_null=True)
    offering_team_name = serializers.CharField(source='offering_team.name', read_only=True, allow_null=True)
    responsible_user_username = serializers.CharField(source='responsible_user.username', read_only=True, allow_null=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True, allow_null=True)

    player_id = serializers.PrimaryKeyRelatedField(queryset=Player.objects.all(), source='player', write_only=True)
    offering_team_id = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='offering_team', write_only=True)
    responsible_user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='responsible_user', write_only=True, allow_null=True, required=False)
    previous_offer_id = serializers.PrimaryKeyRelatedField(queryset=Offer.objects.all(), source='previous_offer', write_only=True, allow_null=True, required=False)

    class Meta:
        model = Offer
        fields = [
            'id', 'player_id', 'player_name', 'offering_team_id', 'offering_team_name',
            'responsible_user_id', 'responsible_user_username',
            'offer_date', 'valid_until',
            'salary_amount', 'salary_currency', 'contract_duration_years',
            'transfer_fee', 'fee_currency', 'clauses',
            'status', 'status_display',
            'is_counter_offer', 'previous_offer_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = (
            'player_name', 'offering_team_name', 'responsible_user_username', 
            'status_display', 'created_at', 'updated_at'
        )

class PlayerHistoricalDataSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player.name', read_only=True, allow_null=True)
    player_id = serializers.PrimaryKeyRelatedField(queryset=Player.objects.all(), source='player', write_only=True)

    class Meta:
        model = PlayerHistoricalData
        fields = [
            'id', 'player_id', 'player_name', 'date_recorded',
            'velocidad', 'resistencia', # Añade otros campos que historices
            'market_value', 'notes'
        ]
        read_only_fields = ('player_name',)
