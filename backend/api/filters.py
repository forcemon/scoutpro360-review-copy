# backend/api/filters.py
import django_filters
# Cambiado: Ya no importa Position
from .models import Player #, Position

# Re-importar POSITION_CHOICES para usar en filtros
from .models import POSITION_CHOICES

class PlayerFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains', label='Nombre Jugador')
    nationality = django_filters.CharFilter(lookup_expr='icontains', label='Nacionalidad')
    born_after = django_filters.DateFilter(field_name='date_of_birth', lookup_expr='gte', label='Nacido después de')
    born_before = django_filters.DateFilter(field_name='date_of_birth', lookup_expr='lte', label='Nacido antes de')
    city_of_birth = django_filters.CharFilter(lookup_expr='icontains', label='Ciudad de Nacimiento')

    # --- Filtro M2M eliminado ---
    # positions = django_filters.ModelMultipleChoiceFilter(...)

    # --- Añadido: Filtros para posiciones individuales ---
    position1 = django_filters.ChoiceFilter(choices=POSITION_CHOICES, label='Posición Principal')
    position2 = django_filters.ChoiceFilter(choices=POSITION_CHOICES, label='Posición Secundaria')
    position3 = django_filters.ChoiceFilter(choices=POSITION_CHOICES, label='Posición Terciaria')
    # --- Fin filtros posiciones ---

    team_id = django_filters.NumberFilter(field_name='team__id', label='ID Equipo')
    min_market_value = django_filters.NumberFilter(field_name='market_value', lookup_expr='gte', label='Valor Mercado Mín.')
    max_market_value = django_filters.NumberFilter(field_name='market_value', lookup_expr='lte', label='Valor Mercado Máx.')
    market_value_currency = django_filters.ChoiceFilter(choices=Player.market_value_currency.field.choices, label='Moneda Valor Mercado')

    class Meta:
        model = Player
        # Actualiza los fields para reflejar los cambios
        fields = [
            'name', 'nationality', 'date_of_birth', 'city_of_birth',
            'position1', 'position2', 'position3', # Añadidos filtros de posición
            'team_id', 'market_value', 'market_value_currency', 'preferred_foot'
        ]
