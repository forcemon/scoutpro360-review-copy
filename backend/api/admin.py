# backend/api/admin.py
from django.contrib import admin
from .models import (
    Player, Team, Report, UserProfile, ReportAttachment,
    PlayerInterest, Offer, PlayerHistoricalData, PlayerTeamHistory # Asegúrate que todos los modelos estén importados
)
from django.utils.html import format_html
from django.urls import reverse # Importar reverse

class ReportAttachmentInline(admin.TabularInline): # O admin.StackedInline
    model = ReportAttachment
    extra = 1 # Número de formularios vacíos para añadir adjuntos
    fields = ('file', 'description') # Campos a mostrar en el inline

class PlayerHistoricalDataInline(admin.TabularInline):
    model = PlayerHistoricalData
    fields = ('date_recorded', 'market_value', 'height', 'weight', 'control', 'pase', 'precision_tiro', 'anticipacion', 'posicionamiento', 'vision_juego', 'velocidad', 'resistencia', 'notes')
    extra = 1
    ordering = ['-date_recorded']

class PlayerTeamHistoryInline(admin.TabularInline):
    model = PlayerTeamHistory
    fields = ('team', 'start_date', 'end_date', 'notes')
    extra = 1
    autocomplete_fields = ['team']
    ordering = ['-start_date']

class ReportInline(admin.TabularInline):
    model = Report
    fields = ('report_date', 'report_specialization', 'overall_rating', 'match_observed', 'report_link')
    readonly_fields = ('report_link',)
    extra = 0
    max_num = 5 # Limitar el número de informes mostrados

    def report_link(self, obj):
        if obj.pk:
            url = reverse('admin:api_report_change', args=[obj.pk])
            return format_html('<a href="{}">Ver Informe</a>', url)
        return "N/A"
    report_link.short_description = 'Enlace al Informe'

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = (
        'display_image_thumbnail', 'name', 'team', 'position1', 
        'calculated_age', 'nationality', 'market_value_display'
    )
    list_filter = (
        'team', 'position1', 'nationality', 'preferred_foot', 'market_value_currency', 'contract_status'
    )
    search_fields = (
        'name', 'team__name', 'nationality', 'city_of_birth', 
        'position1', 'position2', 'position3', 'agency_representing'
    )
    fieldsets = (
        ('Información Personal', {
            'fields': ('name', 'image_url', 'date_of_birth', 'calculated_age', 'city_of_birth', 'nationality')
        }),
        ('Características Físicas', {
            'fields': ('height', 'weight', 'preferred_foot')
        }),
        ('Posiciones', {
            'fields': ('position1', 'position2', 'position3')
        }),
        ('Información Club/Contrato', {
            'fields': ('team', 'contract_status', 'contract_until', 'market_value', 'market_value_currency', 
                       'loan_origin_team', 'loan_destination_team', 'agency_representing')
        }),
        ('Atributos Técnicos (0-100)', {
            'classes': ('collapse',), # 'collapse' para que aparezca colapsado
            'fields': ('control', 'regate', 'pase', 'precision_tiro', 'potencia_tiro',
                       'tiros_lejanos', 'tiros_libres', 'penales', 'remate_cabeza', 'saques_banda')
        }),
        ('Atributos Físicos (0-100)', {
            'classes': ('collapse',),
            'fields': ('velocidad', 'agilidad', 'resistencia', 'fuerza') # Añadir 'salto' si lo tienes
        }),
        ('Atributos Mentales/Tácticos (0-100)', {
            'classes': ('collapse',),
            'fields': ('anticipacion', 'posicionamiento', 'vision_juego', 'trabajo_equipo',
                       'liderazgo', 'marcaje', 'entradas', 'talento')
        }),
        ('Notas Descriptivas', {
            'classes': ('collapse',),
            'fields': ('strengths', 'weaknesses')
        }),
    )
    readonly_fields = ('calculated_age', 'created_at', 'updated_at')
    list_per_page = 20
    inlines = [PlayerHistoricalDataInline, ReportInline, PlayerTeamHistoryInline] # Añadir los inlines

    def display_image_thumbnail(self, obj):
        if obj.image_url:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 5px;"/>', obj.image_url)
        return "Sin imagen"
    display_image_thumbnail.short_description = 'Imagen'

    def market_value_display(self, obj):
        if obj.market_value is not None:
            return f"{obj.market_value:,.0f} {obj.market_value_currency}".replace(',', '.')
        return "N/A"
    market_value_display.short_description = 'Valor Mercado'
    market_value_display.admin_order_field = 'market_value'


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'league', 'logo_display')
    search_fields = ('name', 'country', 'league')
    list_per_page = 25

    def logo_display(self, obj):
        if obj.logo_url:
            return format_html('<img src="{}" width="30" height="30" style="object-fit: contain;"/>', obj.logo_url)
        return "Sin logo"
    logo_display.short_description = 'Logo'

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('get_player_name', 'get_scout_username', 'report_date', 'report_specialization_display', 'overall_rating', 'match_observed')
    list_filter = ('report_specialization', 'scout', 'report_date', 'overall_rating')
    search_fields = ('player__name', 'scout__username', 'summary', 'match_observed', 'detailed_notes')
    autocomplete_fields = ['player', 'scout', 'summary_report_parent']
    date_hierarchy = 'report_date'
    inlines = [ReportAttachmentInline] # Para añadir adjuntos directamente en el admin del informe
    fieldsets = (
        (None, {'fields': ('player', 'scout', 'report_date', 'match_observed')}),
        ('Tipo y Contenido del Informe', {'fields': ('report_specialization', 'summary_report_parent', 'summary', 'detailed_notes')}),
        ('Valoraciones', {'fields': ('overall_rating', 'potential_rating')}),
    )
    list_per_page = 20

    def get_player_name(self, obj):
        return obj.player.name if obj.player else "N/A"
    get_player_name.short_description = 'Jugador'
    get_player_name.admin_order_field = 'player__name'

    def get_scout_username(self, obj):
      return obj.scout.username if obj.scout else '-'
    get_scout_username.short_description = 'Ojeador/Autor'
    get_scout_username.admin_order_field = 'scout__username'

    def report_specialization_display(self,obj):
        return obj.get_report_specialization_display()
    report_specialization_display.short_description = 'Especialización'
    report_specialization_display.admin_order_field = 'report_specialization'


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user_username', 'role_display', 'team_name', 'phone_number')
    list_filter = ('role', 'team')
    search_fields = ('user__username', 'team__name', 'phone_number')
    autocomplete_fields = ['user', 'team']
    list_select_related = ('user', 'team') # Optimización para reducir queries

    def user_username(self, obj):
        return obj.user.username
    user_username.short_description = 'Usuario'
    user_username.admin_order_field = 'user__username'
    
    def role_display(self, obj):
        return obj.get_role_display()
    role_display.short_description = 'Rol'
    role_display.admin_order_field = 'role'

    def team_name(self, obj):
        return obj.team.name if obj.team else "N/A"
    team_name.short_description = 'Equipo Afiliado'
    team_name.admin_order_field = 'team__name'


@admin.register(ReportAttachment)
class ReportAttachmentAdmin(admin.ModelAdmin):
    list_display = ('report_summary', 'file_name', 'description', 'uploaded_at')
    list_filter = ('uploaded_at',)
    search_fields = ('report__summary', 'file', 'description')
    autocomplete_fields = ['report']

    def report_summary(self, obj):
        return str(obj.report)[:50] + "..." if obj.report else "N/A" # Muestra un resumen del reporte
    report_summary.short_description = 'Informe'

    def file_name(self, obj):
        import os
        return os.path.basename(obj.file.name) if obj.file else "N/A"
    file_name.short_description = 'Nombre Archivo'


@admin.register(PlayerInterest)
class PlayerInterestAdmin(admin.ModelAdmin):
    list_display = ('player_name', 'interested_party_username', 'status_display', 'interest_level', 'created_at')
    list_filter = ('status', 'interest_level', 'created_at')
    search_fields = ('player__name', 'interested_party_user__username', 'notes')
    autocomplete_fields = ['player', 'interested_party_user']

    def player_name(self, obj): return obj.player.name
    player_name.short_description = 'Jugador'
    player_name.admin_order_field = 'player__name'

    def interested_party_username(self, obj): return obj.interested_party_user.username
    interested_party_username.short_description = 'Usuario Interesado'
    interested_party_username.admin_order_field = 'interested_party_user__username'
    
    def status_display(self, obj): return obj.get_status_display()
    status_display.short_description = 'Estado'

@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ('player_name', 'offering_team_name', 'offer_date', 'status_display', 'salary_display', 'transfer_fee_display')
    list_filter = ('status', 'offering_team', 'is_counter_offer', 'offer_date')
    search_fields = ('player__name', 'offering_team__name', 'clauses')
    autocomplete_fields = ['player', 'offering_team', 'responsible_user', 'previous_offer']
    date_hierarchy = 'offer_date'

    def player_name(self, obj): return obj.player.name
    player_name.short_description = 'Jugador'
    
    def offering_team_name(self, obj): return obj.offering_team.name
    offering_team_name.short_description = 'Equipo Ofertante'

    def status_display(self, obj): return obj.get_status_display()
    status_display.short_description = 'Estado'

    def salary_display(self, obj):
        return f"{obj.salary_amount} {obj.salary_currency}" if obj.salary_amount else "N/A"
    salary_display.short_description = 'Salario'

    def transfer_fee_display(self, obj):
        return f"{obj.transfer_fee} {obj.fee_currency}" if obj.transfer_fee else "N/A"
    transfer_fee_display.short_description = 'Cláusula/Transferencia'


@admin.register(PlayerHistoricalData)
class PlayerHistoricalDataAdmin(admin.ModelAdmin):
    list_display = ('player_name', 'date_recorded', 'market_value_display', 'height', 'weight', 'control', 'pase', 'precision_tiro', 'anticipacion', 'posicionamiento', 'vision_juego', 'velocidad', 'resistencia')
    list_filter = ('player__name', 'date_recorded') # Filtrar por nombre de jugador
    search_fields = ('player__name', 'notes', 'height', 'weight', 'control', 'pase', 'precision_tiro', 'anticipacion', 'posicionamiento', 'vision_juego') # Added new fields to search
    autocomplete_fields = ['player']
    date_hierarchy = 'date_recorded'

    def player_name(self, obj): return obj.player.name
    player_name.short_description = 'Jugador'

    def market_value_display(self, obj):
        return f"{obj.market_value}" if obj.market_value is not None else "N/A"
    market_value_display.short_description = 'Valor Mercado Hist.'


@admin.register(PlayerTeamHistory)
class PlayerTeamHistoryAdmin(admin.ModelAdmin):
    list_display = ('player_name', 'team_name', 'start_date', 'end_date', 'notes')
    search_fields = ('player__name', 'team__name', 'notes')
    list_filter = ('team', 'start_date', 'end_date')
    autocomplete_fields = ['player', 'team']
    date_hierarchy = 'start_date'

    def player_name(self, obj):
        return obj.player.name
    player_name.short_description = 'Jugador'
    player_name.admin_order_field = 'player__name'

    def team_name(self, obj):
        return obj.team.name if obj.team else "N/A"
    team_name.short_description = 'Equipo'
    team_name.admin_order_field = 'team__name'

