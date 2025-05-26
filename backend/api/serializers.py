# backend/api/serializers.py
from rest_framework import serializers
from .models import (
    Player, Team, Report, UserProfile, ReportAttachment,
    PlayerInterest, Offer, POSITION_CHOICES, USER_ROLE_CHOICES # Importar nuevos modelos y choices
)
from django.contrib.auth.models import User

POSITION_MAP = {choice[0]: choice[1] for choice in POSITION_CHOICES}
USER_ROLE_MAP = {choice[0]: choice[1] for choice in USER_ROLE_CHOICES}


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


class PlayerSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True, allow_null=True) # Añadido para facilidad
    team_id = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(), source='team', write_only=True, allow_null=True, required=False
    )
    calculated_age = serializers.IntegerField(read_only=True)
    position1_display = serializers.SerializerMethodField()
    position2_display = serializers.SerializerMethodField()
    position3_display = serializers.SerializerMethodField()
    
    # NUEVO: SerializerMethodField para contract_status_display
    contract_status_display = serializers.SerializerMethodField()
    loan_origin_team_details = TeamSerializer(source='loan_origin_team', read_only=True)
    loan_destination_team_details = TeamSerializer(source='loan_destination_team', read_only=True)


    class Meta:
        model = Player
        fields = [
            'id', 'name', 'team_name', 'team_id', # team se quita, se usa team_name y team_id
            'position1', 'position2', 'position3',
            'position1_display', 'position2_display', 'position3_display',
            'calculated_age', 'date_of_birth', 'city_of_birth',
            'nationality', 'height', 'weight', 'preferred_foot',
            'market_value', 'market_value_currency', 'contract_until',
            'image_url', 'strengths', 'weaknesses',
            # Atributos...
            'control', 'regate', 'pase', 'precision_tiro', 'potencia_tiro',
            'tiros_lejanos', 'tiros_libres', 'penales', 'remate_cabeza',
            'saques_banda', 'velocidad', 'agilidad', 'resistencia', 'fuerza',
            'anticipacion', 'posicionamiento', 'vision_juego', 'trabajo_equipo',
            'liderazgo', 'marcaje', 'entradas', 'talento',
            # Nuevos campos contractuales
            'contract_status', 'contract_status_display', 
            'loan_origin_team', 'loan_origin_team_details',
            'loan_destination_team', 'loan_destination_team_details', 
            'agency_representing',
            'created_at', 'updated_at'
        ]
        read_only_fields = (
            'calculated_age', 'created_at', 'updated_at',
            'position1_display', 'position2_display', 'position3_display',
            'team_name', 'contract_status_display',
            'loan_origin_team_details', 'loan_destination_team_details'
        )
        # Para que team_id no sea requerido en GET pero sí opcional en POST/PUT
        extra_kwargs = {
            'team': {'read_only': True}, # El objeto completo es solo lectura
            'loan_origin_team': {'write_only': True, 'required': False},
            'loan_destination_team': {'write_only': True, 'required': False},
        }


    def get_position1_display(self, obj):
        return POSITION_MAP.get(obj.position1, obj.position1)

    def get_position2_display(self, obj):
        return POSITION_MAP.get(obj.position2, obj.position2)

    def get_position3_display(self, obj):
        return POSITION_MAP.get(obj.position3, obj.position3)

    # NUEVO: Método para contract_status_display
    def get_contract_status_display(self, obj):
        return dict(Player.CONTRACT_STATUS_CHOICES).get(obj.contract_status, obj.contract_status)


class ReportAttachmentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = ReportAttachment
        fields = ['id', 'report', 'file', 'file_url', 'description', 'uploaded_at']
        read_only_fields = ['file_url', 'uploaded_at']
        extra_kwargs = {'report': {'write_only': True}} # El reporte se asigna al crear

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None


class ReportSerializer(serializers.ModelSerializer):
    player_id = serializers.PrimaryKeyRelatedField(
        queryset=Player.objects.all(), source='player', write_only=True, allow_null=True, required=False
    )
    player_name = serializers.CharField(source='player.name', read_only=True, allow_null=True)
    
    scout_id = serializers.PrimaryKeyRelatedField( # Para escribir
        queryset=User.objects.all(), source='scout', write_only=True, allow_null=True, required=False
    )
    scout_username = serializers.CharField(source='scout.username', read_only=True, allow_null=True)

    report_specialization_display = serializers.CharField(source='get_report_specialization_display', read_only=True)
    attachments = ReportAttachmentSerializer(many=True, read_only=True) # Para listar adjuntos

    # Para crear/actualizar el parent (solo ID)
    summary_report_parent_id = serializers.PrimaryKeyRelatedField(
        queryset=Report.objects.filter(report_specialization='SUMMARY'), 
        source='summary_report_parent', 
        write_only=True, 
        allow_null=True, 
        required=False
    )
    # Para mostrar detalles del padre (opcional)
    # summary_report_parent_details = serializers.SerializerMethodField() 


    class Meta:
        model = Report
        fields = [
            'id', 'player_id', 'player_name', 'scout_id', 'scout_username', 'report_date',
            'report_specialization', 'report_specialization_display',
            'summary_report_parent_id', # 'summary_report_parent_details',
            'match_observed', 'overall_rating', 'potential_rating',
            'summary', 'detailed_notes', 'attachments',
            'created_at', 'updated_at'
        ]
        read_only_fields = ('player_name', 'scout_username', 'report_specialization_display', 'attachments', 'created_at', 'updated_at')

    # def get_summary_report_parent_details(self, obj):
    #     if obj.summary_report_parent:
    #         # Evitar recursión infinita si el serializer se llama a sí mismo directamente
    #         # Podrías usar un serializer más simple para el padre aquí
    #         return {'id': obj.summary_report_parent.id, 'report_date': obj.summary_report_parent.report_date}
    #     return None


class UserProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True) # Para escribir
    username = serializers.CharField(source='user.username', read_only=True) # Para leer
    team_name = serializers.CharField(source='team.name', read_only=True, allow_null=True)
    team_id = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(), source='team', write_only=True, allow_null=True, required=False
    )
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user_id', 'username', 'role', 'role_display', 'team_id', 'team_name', 'phone_number', 'bio']
        read_only_fields = ('username', 'team_name', 'role_display')
        extra_kwargs = { # El objeto User se maneja a través de user_id para escrituras
            'user': {'read_only': True} 
        }


# NUEVOS SERIALIZERS
class PlayerInterestSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player.name', read_only=True)
    interested_party_username = serializers.CharField(source='interested_party.username', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = PlayerInterest
        fields = [
            'id', 'player', 'player_name', 'interested_party', 'interested_party_username',
            'status', 'status_display', 'interest_level', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ('player_name', 'interested_party_username', 'status_display', 'created_at', 'updated_at')


class OfferSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player.name', read_only=True)
    offering_team_name = serializers.CharField(source='offering_team.name', read_only=True)
    responsible_user_username = serializers.CharField(source='responsible_user.username', read_only=True, allow_null=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    # Para mostrar contraofertas de forma anidada (solo lectura, un nivel)
    # counter_offers_details = serializers.SerializerMethodField()

    class Meta:
        model = Offer
        fields = [
            'id', 'player', 'player_name', 'offering_team', 'offering_team_name',
            'responsible_user', 'responsible_user_username',
            'offer_date', 'valid_until',
            'salary_amount', 'salary_currency', 'contract_duration_years',
            'transfer_fee', 'fee_currency', 'clauses',
            'status', 'status_display',
            'is_counter_offer', 'previous_offer', #'counter_offers_details',
            'created_at', 'updated_at'
        ]
        read_only_fields = (
            'player_name', 'offering_team_name', 'responsible_user_username', 
            'status_display', #'counter_offers_details', 
            'created_at', 'updated_at'
        )

    # def get_counter_offers_details(self, obj):
    #     # Para evitar recursión profunda, solo serializamos IDs o un subconjunto simple
    #     return [{'id': counter.id, 'status_display': counter.get_status_display()} for counter in obj.counter_offers.all()]