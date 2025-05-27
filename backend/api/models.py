# backend/api/models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import date

# --- LISTA FIJA DE POSICIONES ---
POSITION_CHOICES = [
    ('', '---------'),
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

# --- LISTA FIJA DE ROLES DE USUARIO ---
USER_ROLE_CHOICES = [
    ('SCOUT', 'Scout'),
    ('NUTRITIONIST', 'Nutricionista'),
    ('PHYSIOTHERAPIST', 'Fisioterapeuta'),
    ('TRAINING_SPECIALIST', 'Especialista en Entrenamiento'),
    ('SPORTS_MEDIC', 'Médico Deportivo'),
    ('SPORTS_PSYCHOLOGIST', 'Psicólogo Deportivo'),
    ('EDUCATOR', 'Educador/Tutor'),
    ('ADMIN', 'Administrador'),
    ('TEAM_STAFF', 'Staff de Equipo (General)'),
    ('VIEWER', 'Observador'), # Rol por defecto
]

# --- LISTA FIJA DE ESPECIALIZACIONES DE REPORTE ---
REPORT_SPECIALIZATION_CHOICES = [
    ('SCOUT', 'Scouting General'),
    ('NUTRITION', 'Nutrición'),
    ('PHYSIO', 'Fisioterapia'),
    ('TRAINING', 'Entrenamiento Deportivo'),
    ('MEDICAL', 'Medicina del Deporte'),
    ('PSYCHOLOGY', 'Psicología Deportiva'),
    ('EDUCATION', 'Educación'),
    ('SUMMARY', 'Informe Completo de Resumen'), # Para informes consolidados
]


class Team(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Nombre del Equipo")
    country = models.CharField(max_length=100, blank=True, null=True, verbose_name="País")
    league = models.CharField(max_length=100, blank=True, null=True, verbose_name="Liga")
    logo_url = models.URLField(max_length=500, blank=True, null=True, verbose_name="URL del Logo")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name = "Equipo"
        verbose_name_plural = "Equipos"


class Player(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nombre Completo")
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, related_name='players', verbose_name="Equipo Actual")
    
    position1 = models.CharField(max_length=5, choices=POSITION_CHOICES, blank=True, verbose_name="Posición Principal")
    position2 = models.CharField(max_length=5, choices=POSITION_CHOICES, blank=True, verbose_name="Posición Secundaria")
    position3 = models.CharField(max_length=5, choices=POSITION_CHOICES, blank=True, verbose_name="Posición Terciaria")
    
    date_of_birth = models.DateField(null=True, blank=True, verbose_name="Fecha de Nacimiento")
    city_of_birth = models.CharField(max_length=100, blank=True, null=True, verbose_name="Ciudad de Nacimiento")
    nationality = models.CharField(max_length=100, blank=True, null=True, verbose_name="Nacionalidad")
    height = models.PositiveIntegerField(null=True, blank=True, help_text="Altura en cm", verbose_name="Altura (cm)")
    weight = models.PositiveIntegerField(null=True, blank=True, help_text="Peso en kg", verbose_name="Peso (kg)")
    
    PREFERRED_FOOT_CHOICES = [('Right', 'Derecho'), ('Left', 'Izquierdo'), ('Both', 'Ambidiestro')]
    preferred_foot = models.CharField(max_length=10, choices=PREFERRED_FOOT_CHOICES, blank=True, null=True, verbose_name="Pie Preferido")
    
    market_value = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True, help_text="Valor numérico (ej: 50000.00)", verbose_name="Valor de Mercado")
    CURRENCY_CHOICES = [('EUR', 'EUR'), ('USD', 'USD'), ('GBP', 'GBP')]
    market_value_currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='EUR', blank=True, verbose_name="Moneda Valor Mercado")
    
    contract_until = models.DateField(null=True, blank=True, verbose_name="Contrato Válido Hasta")
    image_url = models.URLField(max_length=500, blank=True, null=True, verbose_name="URL de Imagen del Jugador")
    
    strengths = models.TextField(blank=True, null=True, verbose_name="Fortalezas (texto descriptivo)")
    weaknesses = models.TextField(blank=True, null=True, verbose_name="Debilidades (texto descriptivo)")

    # Atributos (0-100)
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
    # salto fue eliminado en migraciones, se puede re-añadir si es necesario.
    
    anticipacion = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Anticipación")
    posicionamiento = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Posicionamiento")
    vision_juego = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Visión Juego")
    trabajo_equipo = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Trabajo Equipo")
    liderazgo = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Liderazgo")
    marcaje = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Marcaje")
    entradas = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Entradas")
    talento = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Talento/Creatividad")

    # --- Atributos Físicos Detallados ---
    salto_horizontal_m = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True, verbose_name="Salto Horizontal (m)")
    velocidad_max_kmh = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True, verbose_name="Velocidad Máxima (km/h)")
    aceleracion_0_20m_secs = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True, verbose_name="Aceleración 0-20m (s)")
    agilidad_t_test_secs = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True, verbose_name="Agilidad T-Test (s)")
    cambio_direccion_5105_secs = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True, verbose_name="Cambio de Dirección 5-10-5 (s)")
    fuerza_relativa_1rm_ratio = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True, verbose_name="Fuerza Relativa 1RM (ratio peso corporal)")
    potencia_pico_w_kg = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True, verbose_name="Potencia Pico (W/kg)")
    vo2_max_ml_kg_min = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True, verbose_name="VO2 Máx (ml/kg/min)")
    yoyo_ir1_level = models.CharField(max_length=10, blank=True, null=True, verbose_name="Yo-Yo IR1 Nivel (ej: 18.5)")
    distancia_media_km_90min = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True, verbose_name="Distancia Media Recorrida (km/90min)")
    evaluacion_equilibrio_estatico = models.CharField(max_length=50, blank=True, null=True, verbose_name="Evaluación Equilibrio Estático (ej: Bueno, Necesita Mejora)")
    evaluacion_equilibrio_dinamico = models.CharField(max_length=50, blank=True, null=True, verbose_name="Evaluación Equilibrio Dinámico (ej: Bueno, Necesita Mejora)")

    # --- Atributos Mentales ---
    compostura = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Compostura")
    concentracion = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Concentración")
    agresividad = models.PositiveIntegerField(default=50, help_text="(0-100)", verbose_name="Agresividad (Deportiva)")

    # --- Estadísticas Clave (Últimos 365 días) ---
    goles_365 = models.PositiveIntegerField(null=True, blank=True, verbose_name="Goles (últimos 365 días)")
    asistencias_365 = models.PositiveIntegerField(null=True, blank=True, verbose_name="Asistencias (últimos 365 días)")
    xg_per_90_365 = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True, verbose_name="xG por 90 min (últimos 365 días)")
    pases_completados_pct_365 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name="% Pases Completados (últimos 365 días)")
    regates_per_90_365 = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True, verbose_name="Regates Exitosos por 90 min (últimos 365 días)")
    partidos_jugados_365 = models.PositiveIntegerField(null=True, blank=True, verbose_name="Partidos Jugados (últimos 365 días)")

    CONTRACT_STATUS_CHOICES = [
        ('ACTIVE', 'Contrato Vigente'),
        ('LOANED_OUT', 'Cedido (Saliendo)'),
        ('LOANED_IN', 'Cedido (Llegando)'),
        ('RENEWAL_PROCESS', 'En Proceso de Renovación'),
        ('EXPIRING_SOON', 'Contrato por Expirar'),
        ('FREE_AGENT', 'Agente Libre'),
        ('ACADEMY', 'Cantera/Formación'),
        ('OTHER', 'Otro'),
    ]
    contract_status = models.CharField(max_length=20, choices=CONTRACT_STATUS_CHOICES, blank=True, null=True, verbose_name="Estado Contractual")
    loan_origin_team = models.ForeignKey(Team, related_name='players_loaned_from_here', on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Equipo Propietario (Si está cedido EN este equipo)")
    loan_destination_team = models.ForeignKey(Team, related_name='players_loaned_to_here', on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Equipo Destino (Si está cedido A este equipo)")
    agency_representing = models.CharField(max_length=150, blank=True, null=True, verbose_name="Agencia Representante")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def calculated_age(self):
        if not self.date_of_birth: return None
        today = date.today()
        return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
    calculated_age.fget.short_description = "Edad (Calculada)"

    def __str__(self):
        pos1_display = dict(POSITION_CHOICES).get(self.position1, self.position1)
        return f"{self.name} ({pos1_display})" if pos1_display else self.name

    class Meta:
        ordering = ['name']
        verbose_name = "Jugador"
        verbose_name_plural = "Jugadores"


class Report(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='reports', null=True, blank=True, verbose_name="Jugador")
    scout = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reports_created', verbose_name="Autor del Informe")
    
    report_specialization = models.CharField(max_length=20, choices=REPORT_SPECIALIZATION_CHOICES, default='SCOUT', verbose_name="Especialización del Informe")
    summary_report_parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='specialized_reports', verbose_name="Informe de Resumen Padre", limit_choices_to={'report_specialization': 'SUMMARY'})

    report_date = models.DateTimeField(default=timezone.now, verbose_name="Fecha del Informe/Evento")
    match_observed = models.CharField(max_length=200, blank=True, null=True, verbose_name="Partido/Evento Observado")
    
    overall_rating = models.PositiveIntegerField(null=True, blank=True, help_text="Valoración general (ej: 1-100)", verbose_name="Valoración General")
    potential_rating = models.PositiveIntegerField(null=True, blank=True, help_text="Valoración de potencial (ej: 1-100)", verbose_name="Valoración Potencial")
    
    summary = models.TextField(verbose_name="Resumen Principal / Observaciones Clave")
    detailed_notes = models.TextField(blank=True, null=True, verbose_name="Notas Detalladas / Contenido Específico")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_report_specialization_display(self):
        return dict(REPORT_SPECIALIZATION_CHOICES).get(self.report_specialization, self.report_specialization)

    def __str__(self):
        player_name = self.player.name if self.player else "N/A"
        scout_name = self.scout.username if self.scout else "N/A"
        return f"Informe ({self.get_report_specialization_display()}) para {player_name} por {scout_name} - {self.report_date.strftime('%Y-%m-%d')}"

    class Meta:
        ordering = ['-report_date']
        verbose_name = "Informe"
        verbose_name_plural = "Informes"


class ReportAttachment(models.Model):
    report = models.ForeignKey(Report, related_name='attachments', on_delete=models.CASCADE, verbose_name="Informe Asociado")
    file = models.FileField(upload_to='report_attachments/', verbose_name="Archivo Adjunto") # Sube a MEDIA_ROOT/report_attachments/
    description = models.CharField(max_length=255, blank=True, verbose_name="Descripción del Adjunto")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Adjunto para Informe ID {self.report.id} - {os.path.basename(self.file.name)}"
    
    class Meta:
        verbose_name = "Adjunto de Informe"
        verbose_name_plural = "Adjuntos de Informes"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=30, choices=USER_ROLE_CHOICES, default='VIEWER', verbose_name="Rol Principal")
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, related_name='staff_profiles', verbose_name="Equipo Afiliado")
    phone_number = models.CharField(max_length=20, blank=True, null=True, verbose_name="Número de Teléfono")
    bio = models.TextField(blank=True, null=True, verbose_name="Biografía Corta")
    profile_image_url = models.URLField(max_length=500, blank=True, null=True, verbose_name="URL de Imagen de Perfil")


    def get_role_display(self):
        return dict(USER_ROLE_CHOICES).get(self.role, self.role)

    def __str__(self):
        return f"Perfil de {self.user.username} ({self.get_role_display()})"
        
    class Meta:
        verbose_name = "Perfil de Usuario"
        verbose_name_plural = "Perfiles de Usuarios"

# Modelos para Intereses y Ofertas (como en la migración 0009)
class PlayerInterest(models.Model):
    INTEREST_STATUS_CHOICES = [
        ('TRACKING', 'Seguimiento Activo'),
        ('CONTACTED_AGENCY', 'Agencia Contactada'),
        ('NEGOTIATING', 'En Negociación'),
        ('RESERVED', 'Reservado (Intención Formal)'),
        ('CLOSED_LOST', 'Interés Perdido/Cerrado'),
    ]
    player = models.ForeignKey(Player, related_name='interests_received', on_delete=models.CASCADE, verbose_name="Jugador")
    interested_party_user = models.ForeignKey(User, related_name='player_interests_made', on_delete=models.CASCADE, verbose_name="Usuario Interesado (Scout)")
    status = models.CharField(max_length=20, choices=INTEREST_STATUS_CHOICES, default='TRACKING', verbose_name="Estado del Interés")
    interest_level = models.PositiveSmallIntegerField(default=1, help_text="Nivel de interés (1-5)", verbose_name="Nivel de Interés", blank=True, null=True)
    notes = models.TextField(blank=True, verbose_name="Notas Adicionales")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('player', 'interested_party_user')
        ordering = ['-created_at']
        verbose_name = "Interés en Jugador"
        verbose_name_plural = "Intereses en Jugadores"

    def __str__(self):
        return f"Interés de {self.interested_party_user.username} en {self.player.name} ({self.get_status_display()})"


class Offer(models.Model):
    OFFER_STATUS_CHOICES = [
        ('DRAFT', 'Borrador'),
        ('SENT', 'Enviada'),
        ('VIEWED', 'Vista'),
        ('NEGOTIATING', 'En Negociación'),
        ('ACCEPTED', 'Aceptada'),
        ('REJECTED', 'Rechazada'),
        ('WITHDRAWN', 'Retirada'),
        ('EXPIRED', 'Expirada'),
    ]
    player = models.ForeignKey(Player, related_name='offers_received', on_delete=models.CASCADE, verbose_name="Jugador Ofertado")
    offering_team = models.ForeignKey(Team, related_name='offers_made', on_delete=models.CASCADE, verbose_name="Equipo Ofertante")
    responsible_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, help_text="Usuario que registra/gestiona la oferta", verbose_name="Usuario Responsable")
    offer_date = models.DateTimeField(default=timezone.now, verbose_name="Fecha de Oferta")
    valid_until = models.DateField(null=True, blank=True, verbose_name="Válida Hasta")
    salary_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, verbose_name="Monto Salario")
    salary_currency = models.CharField(max_length=3, choices=Player.CURRENCY_CHOICES, blank=True, null=True, verbose_name="Moneda Salario")
    contract_duration_years = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name="Duración Contrato (Años)")
    transfer_fee = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, verbose_name="Cláusula/Precio Transferencia")
    fee_currency = models.CharField(max_length=3, choices=Player.CURRENCY_CHOICES, blank=True, null=True, verbose_name="Moneda Cláusula")
    clauses = models.TextField(blank=True, help_text="Cláusulas especiales, bonus, etc.", verbose_name="Cláusulas y Condiciones")
    status = models.CharField(max_length=20, choices=OFFER_STATUS_CHOICES, default='DRAFT', verbose_name="Estado de la Oferta")
    is_counter_offer = models.BooleanField(default=False, verbose_name="Es Contraoferta")
    previous_offer = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='counter_offers', verbose_name="Oferta Anterior (si es contraoferta)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-offer_date']
        verbose_name = "Oferta por Jugador"
        verbose_name_plural = "Ofertas por Jugadores"

    def __str__(self):
        return f"Oferta de {self.offering_team.name} por {self.player.name} ({self.get_status_display()})"


class PlayerHistoricalData(models.Model):
    player = models.ForeignKey(Player, related_name='historical_data', on_delete=models.CASCADE)
    date_recorded = models.DateField(default=date.today, verbose_name="Fecha de Registro")
    height = models.PositiveIntegerField(null=True, blank=True, help_text="Altura en cm")
    weight = models.PositiveIntegerField(null=True, blank=True, help_text="Peso en kg")
    control = models.PositiveIntegerField(null=True, blank=True, help_text="(0-100)")
    pase = models.PositiveIntegerField(null=True, blank=True, help_text="(0-100)")
    precision_tiro = models.PositiveIntegerField(null=True, blank=True, help_text="(0-100)")
    anticipacion = models.PositiveIntegerField(null=True, blank=True, help_text="(0-100)")
    posicionamiento = models.PositiveIntegerField(null=True, blank=True, help_text="(0-100)")
    vision_juego = models.PositiveIntegerField(null=True, blank=True, help_text="(0-100)")
    # Existing historical attributes
    velocidad = models.PositiveIntegerField(null=True, blank=True)
    resistencia = models.PositiveIntegerField(null=True, blank=True)
    # ... otros atributos ...
    market_value = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True, help_text="Notas sobre este snapshot de datos")

    class Meta:
        ordering = ['player', '-date_recorded']
        verbose_name = "Dato Histórico de Jugador"
        verbose_name_plural = "Datos Históricos de Jugadores"
        unique_together = ('player', 'date_recorded')

    def __str__(self):
        return f"Datos de {self.player.name} para {self.date_recorded}"


class PlayerTeamHistory(models.Model):
    player = models.ForeignKey(Player, related_name='team_history', on_delete=models.CASCADE, verbose_name="Jugador")
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Equipo")
    start_date = models.DateField(verbose_name="Fecha de Inicio")
    end_date = models.DateField(null=True, blank=True, verbose_name="Fecha de Fin (si aplica)")
    notes = models.TextField(blank=True, null=True, verbose_name="Notas (ej: tipo de traspaso, cesión)")

    class Meta:
        ordering = ['-start_date', '-end_date']
        verbose_name = "Historial de Equipo del Jugador"
        verbose_name_plural = "Historiales de Equipos de Jugadores"
        unique_together = ('player', 'team', 'start_date') # Prevents duplicate entries for the same player, team, and start date

    def __str__(self):
        team_name = self.team.name if self.team else "Equipo Desconocido"
        end_date_str = self.end_date.strftime('%Y-%m-%d') if self.end_date else "Presente"
        return f"{self.player.name} en {team_name} ({self.start_date.strftime('%Y-%m-%d')} - {end_date_str})"
