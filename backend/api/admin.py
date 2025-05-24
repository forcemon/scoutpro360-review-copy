# backend/api/admin.py
from django.contrib import admin
# Cambiado: Ya no se importa Position
from .models import Player, Team, Report, UserProfile #, Position
from django.utils.html import format_html

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    """
    Configuración personalizada para el modelo Player en el admin de Django.
    """
    list_display = (
        'display_image_thumbnail',
        'name',
        'team',
        'position1', # Mostrar posición principal
        'calculated_age',
        'nationality',
    )
    list_filter = (
        'position1', # Filtrar por posición principal
        'position2', # Filtrar por posición secundaria
        'position3', # Filtrar por posición terciaria
        'team',
        'nationality',
        'preferred_foot',
        'market_value_currency'
    )
    search_fields = (
        'name',
        'team__name',
        'nationality',
        'city_of_birth',
        'position1', # Buscar por clave de posición
        'position2',
        'position3',
    )
    fieldsets = (
        ('Información Personal', {
            'fields': ('name', 'image_url', 'date_of_birth', 'calculated_age', 'city_of_birth', 'nationality')
        }),
        ('Información Club/Contrato', {
            'fields': ('team', 'contract_until', 'market_value', 'market_value_currency')
        }),
        ('Características Físicas', {
            'fields': ('height', 'weight', 'preferred_foot')
        }),
        ('Posiciones', {
            'fields': ('position1', 'position2', 'position3') # Los 3 campos de posición
        }),
        ('Atributos Técnicos', {
            'classes': ('collapse',),
            'fields': ('control', 'regate', 'pase', 'precision_tiro', 'potencia_tiro',
                       'tiros_lejanos', 'tiros_libres', 'penales', 'remate_cabeza', 'saques_banda')
        }),
        ('Atributos Físicos', {
            'classes': ('collapse',),
            'fields': ('velocidad', 'agilidad', 'resistencia', 'fuerza')
        }),
        ('Atributos Mentales/Tácticos', {
            'classes': ('collapse',),
            'fields': ('anticipacion', 'posicionamiento', 'vision_juego', 'trabajo_equipo',
                       'liderazgo', 'marcaje', 'entradas', 'talento')
        }),
        ('Notas Adicionales', {
            'fields': ('strengths', 'weaknesses')
        }),
    )
    readonly_fields = ('calculated_age',)

    def display_image_thumbnail(self, obj):
        """
        Muestra una miniatura de la imagen en la lista del admin si existe una URL.
        """
        if obj.image_url:
            return format_html('<a href="{0}" target="_blank"><img src="{0}" width="50" height="50" style="object-fit: cover; border-radius: 5px;"/></a>', obj.image_url)
        return "-"
    display_image_thumbnail.short_description = 'Imagen'


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    """
    Configuración para el modelo Team en el admin.
    """
    list_display = ('name', 'country', 'league')
    search_fields = ('name', 'country', 'league')


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    """
    Configuración para el modelo Report en el admin.
    """
    list_display = ('player', 'scout_username', 'report_date', 'overall_rating')
    list_filter = ('scout', 'report_date', 'overall_rating')
    search_fields = ('player__name', 'scout__username')
    autocomplete_fields = ['player', 'scout']

    def scout_username(self, obj):
      """
      Devuelve el nombre de usuario del scout o un guión si no hay scout asignado.
      """
      return obj.scout.username if obj.scout else '-'
    scout_username.short_description = 'Ojeador'


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """
    Configuración para el modelo UserProfile en el admin.
    """
    list_display = ('user', 'role', 'team')
    list_filter = ('role', 'team')
    search_fields = ('user__username', 'team__name')
    autocomplete_fields = ['user', 'team']


# --- REGISTRO DE POSITION ELIMINADO ---
# Como el modelo Position ya no existe en models.py, no podemos registrarlo aquí.
# @admin.register(Position)
# class PositionAdmin(admin.ModelAdmin):
#     """
#     Configuración para el modelo Position en el admin.
#     """
#     list_display = ('code', 'name')
#     search_fields = ('code', 'name')
# --- FIN REGISTRO ELIMINADO ---

