# backend/api/filters.py
import django_filters
from .models import Player, POSITION_CHOICES, PlayerHistoricalData, Report # Importar modelos y choices

class PlayerFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains', label='Nombre del Jugador')
    nationality = django_filters.CharFilter(field_name='nationality', lookup_expr='icontains', label='Nacionalidad')
    
    # Filtro por edad (calculada)
    min_age = django_filters.NumberFilter(method='filter_by_min_age', label='Edad Mínima')
    max_age = django_filters.NumberFilter(method='filter_by_max_age', label='Edad Máxima')

    city_of_birth = django_filters.CharFilter(field_name='city_of_birth', lookup_expr='icontains', label='Ciudad de Nacimiento')

    position1 = django_filters.ChoiceFilter(choices=POSITION_CHOICES, field_name='position1', label='Posición Principal')
    # Podrías añadir filtros para position2 y position3 si es necesario
    # position_any = django_filters.ChoiceFilter(method='filter_by_any_position', choices=POSITION_CHOICES, label='Cualquier Posición')


    team_name = django_filters.CharFilter(field_name='team__name', lookup_expr='icontains', label='Nombre del Equipo')
    team_id = django_filters.NumberFilter(field_name='team__id', label='ID del Equipo')
    
    min_market_value = django_filters.NumberFilter(field_name='market_value', lookup_expr='gte', label='Valor de Mercado Mínimo')
    max_market_value = django_filters.NumberFilter(field_name='market_value', lookup_expr='lte', label='Valor de Mercado Máximo')
    market_value_currency = django_filters.ChoiceFilter(choices=Player.CURRENCY_CHOICES, field_name='market_value_currency', label='Moneda del Valor de Mercado')
    
    contract_status = django_filters.ChoiceFilter(choices=Player.CONTRACT_STATUS_CHOICES, field_name='contract_status', label='Estado del Contrato')

    class Meta:
        model = Player
        fields = [
            'name', 'nationality', 'city_of_birth',
            'position1', # 'position_any',
            'team_name', 'team_id', 
            'min_market_value', 'max_market_value', 'market_value_currency', 
            'preferred_foot', 'contract_status',
            # No se puede filtrar directamente por 'calculated_age' aquí, se usan métodos.
        ]

    def filter_by_min_age(self, queryset, name, value):
        # Este método necesitaría filtrar jugadores cuya edad calculada sea >= value.
        # Esto es más complejo porque 'calculated_age' es un @property.
        # Una forma es anotar la edad en el queryset o filtrar después de obtener los IDs.
        # Por simplicidad, si necesitas este filtro urgentemente, considera añadir un campo 'age' actualizable en el modelo
        # o realizar un filtrado más avanzado con subqueries o anotaciones si el rendimiento lo permite.
        # Aquí un ejemplo conceptual (puede no ser óptimo para BD grandes):
        today = date.today()
        ids = [
            player.id for player in queryset 
            if player.date_of_birth and 
               (today.year - player.date_of_birth.year - ((today.month, today.day) < (player.date_of_birth.month, player.date_of_birth.day))) >= value
        ]
        return queryset.filter(id__in=ids)

    def filter_by_max_age(self, queryset, name, value):
        today = date.today()
        ids = [
            player.id for player in queryset
            if player.date_of_birth and
               (today.year - player.date_of_birth.year - ((today.month, today.day) < (player.date_of_birth.month, player.date_of_birth.day))) <= value
        ]
        return queryset.filter(id__in=ids)

    # def filter_by_any_position(self, queryset, name, value):
    #     if value:
    #         return queryset.filter(
    #             models.Q(position1=value) | models.Q(position2=value) | models.Q(position3=value)
    #         ).distinct()
    #     return queryset

# Podrías añadir filtros para otros modelos si es necesario, por ejemplo:
class ReportFilter(django_filters.FilterSet):
    player_name = django_filters.CharFilter(field_name='player__name', lookup_expr='icontains')
    scout_username = django_filters.CharFilter(field_name='scout__username', lookup_expr='icontains')
    report_date_after = django_filters.DateFilter(field_name='report_date', lookup_expr='gte')
    report_date_before = django_filters.DateFilter(field_name='report_date', lookup_expr='lte')

    class Meta:
        model = Report
        fields = ['player', 'scout', 'report_specialization', 'report_date_after', 'report_date_before', 'overall_rating']

