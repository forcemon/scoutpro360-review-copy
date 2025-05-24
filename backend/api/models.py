# backend/api/models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import date

# --- MODELO POSITION ELIMINADO ---
# class Position(models.Model): ...

# --- LISTA FIJA DE POSICIONES (la que proporcionaste) ---
POSITION_CHOICES = [
    ('', '---------'), # Empty Option
    ('GK', 'Goalkeeper (GK)'),
    ('CB', 'Centre Back (CB)'),
    ('LB', 'Left Back (LB)'),
    ('RB', 'Right Back (RB)'),
    ('LWB', 'Left Wing Back (LWB)'),
    ('RWB', 'Right Wing Back (RWB)'),
    ('CDM', 'Defensive Midfielder (CDM)'),
    ('CM', 'Central Midfielder (CM)'),
    ('LM', 'Left Midfielder (LM)'),
    ('RM', 'Right Midfielder (RM)'),
    ('CAM', 'Attacking Midfielder (CAM)'),
    ('LW', 'Left Winger (LW)'),
    ('RW', 'Right Winger (RW)'),
    ('CF', 'Centre Forward (CF)'),
    ('ST', 'Striker (ST)'),
]
# --- FIN LISTA POSICIONES ---


class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    league = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self): return self.name
    class Meta: ordering = ['name']; verbose_name = "Equipo"; verbose_name_plural = "Equipos"


class Player(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True, verbose_name="Nombre")
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, related_name='players', verbose_name="Equipo")

    # --- Cambiado: 3 Campos de Posición Fija ---
    # positions = models.ManyToManyField(...) # Eliminado
    position1 = models.CharField(
        max_length=5, # Suficiente para 'LWB', 'RWB', etc.
        choices=POSITION_CHOICES,
        blank=True, # Permitir vacío
        verbose_name="Posición Principal"
    )
    position2 = models.CharField(
        max_length=5,
        choices=POSITION_CHOICES,
        blank=True, # Secundaria es opcional
        verbose_name="Posición Secundaria"
    )
    position3 = models.CharField(
        max_length=5,
        choices=POSITION_CHOICES,
        blank=True, # Terciaria es opcional
        verbose_name="Posición Terciaria"
    )
    # --- Fin Cambio Posiciones ---

    date_of_birth = models.DateField(null=True, blank=True, verbose_name="Fecha de Nacimiento")
    city_of_birth = models.CharField(max_length=100, blank=True, null=True, verbose_name="Ciudad de Nacimiento")
    nationality = models.CharField(max_length=100, blank=True, null=True, verbose_name="Nacionalidad")
    height = models.PositiveIntegerField(null=True, blank=True, help_text="Altura en cm", verbose_name="Altura (cm)")
    weight = models.PositiveIntegerField(null=True, blank=True, help_text="Peso en kg", verbose_name="Peso (kg)")
    preferred_foot = models.CharField(
        max_length=10,
        choices=[('Right', 'Derecho'), ('Left', 'Izquierdo'), ('Both', 'Ambidiestro')],
        blank=True, null=True, verbose_name="Pie Preferido"
    )
    market_value = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True,
        help_text="Valor numérico completo (ej: 50000, 1500000)",
        verbose_name="Valor de Mercado"
    )
    market_value_currency = models.CharField(
        max_length=3, choices=[('EUR', 'EUR'), ('USD', 'USD'), ('GBP', 'GBP')],
        default='EUR', blank=True, verbose_name="Moneda Valor Mercado"
    )
    contract_until = models.DateField(null=True, blank=True, verbose_name="Contrato Hasta")
    image_url = models.URLField(max_length=500, blank=True, null=True, verbose_name="URL de Imagen")
    strengths = models.TextField(blank=True, null=True, verbose_name="Fortalezas")
    weaknesses = models.TextField(blank=True, null=True, verbose_name="Debilidades")

    # --- Atributos (con verbose_name en español) ---
    control = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Control")
    regate = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Regate")
    pase = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Pase")
    precision_tiro = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Precisión Tiro")
    potencia_tiro = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Potencia Tiro")
    tiros_lejanos = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Tiros Lejanos")
    tiros_libres = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Tiros Libres")
    penales = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Penales")
    remate_cabeza = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Remate Cabeza")
    saques_banda = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Saques Banda")
    velocidad = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Velocidad")
    agilidad = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Agilidad")
    resistencia = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Resistencia")
    fuerza = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Fuerza")
    anticipacion = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Anticipación")
    posicionamiento = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Posicionamiento")
    vision_juego = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Visión Juego")
    trabajo_equipo = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Trabajo Equipo")
    liderazgo = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Liderazgo")
    marcaje = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Marcaje")
    entradas = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Entradas")
    talento = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Talento")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def calculated_age(self):
        if not self.date_of_birth: return None
        today = date.today()
        age = today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
        return age
    calculated_age.fget.short_description = "Edad (Calculada)"

    def __str__(self):
        display_name = self.name if self.name else "Jugador Sin Nombre"
        # Muestra la posición principal si existe
        pos1_display = self.get_position1_display() if self.position1 else ""
        return f"{display_name} ({pos1_display})" if pos1_display else display_name

    class Meta:
        ordering = ['name']
        verbose_name = "Jugador"
        verbose_name_plural = "Jugadores"

# ... (Report y UserProfile models sin cambios respecto a la última versión) ...
class Report(models.Model):
    player = models.ForeignKey(Player,on_delete=models.CASCADE, related_name='reports',null=True,blank=True)
    scout = models.ForeignKey(User,on_delete=models.SET_NULL,null=True,blank=True,related_name='reports_made')
    report_date = models.DateTimeField(default=timezone.now)
    match_observed = models.CharField(max_length=200, blank=True, null=True)
    overall_rating = models.PositiveIntegerField(null=True,blank=True,help_text="Overall rating (1-10 or 1-100)")
    potential_rating = models.PositiveIntegerField(null=True,blank=True,help_text="Potential rating")
    summary = models.TextField()
    detailed_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        player_name = self.player.name if self.player and self.player.name else "Jugador Sin Nombre"
        scout_name = self.scout.username if self.scout else 'Unknown Scout'
        report_date_str = self.report_date.strftime('%Y-%m-%d') if self.report_date else 'No Date'
        return f"Report for {player_name} by {scout_name} on {report_date_str}"
    class Meta: ordering = ['-report_date']; verbose_name = "Reporte"; verbose_name_plural = "Reportes"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=50, choices=[('Scout', 'Scout'), ('Admin', 'Admin'), ('Viewer', 'Viewer')], default='Viewer')
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, related_name='staff')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    def __str__(self): return f"{self.user.username}'s Profile ({self.role})"
    class Meta: verbose_name = "Perfil Usuario"; verbose_name_plural = "Perfiles Usuarios"
