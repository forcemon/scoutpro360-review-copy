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

# --- LISTA FIJA DE ROLES DE USUARIO (Movida a nivel de módulo) ---
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
    ('VIEWER', 'Observador'),
]

# --- LISTA FIJA DE ESPECIALIZACIONES DE REPORTE (Movida a nivel de módulo) ---
REPORT_SPECIALIZATION_CHOICES = [
    ('SCOUT', 'Scouting General'),
    ('NUTRITION', 'Nutrición'),
    ('PHYSIO', 'Fisioterapia'),
    ('TRAINING', 'Entrenamiento Deportivo'),
    ('MEDICAL', 'Medicina del Deporte'),
    ('PSYCHOLOGY', 'Psicología Deportiva'),
    ('EDUCATION', 'Educación'),
    ('SUMMARY', 'Informe Completo de Resumen'),
]


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
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, related_name='players', verbose_name="Equipo Actual")
    position1 = models.CharField(max_length=5, choices=POSITION_CHOICES, blank=True, verbose_name="Posición Principal")
    position2 = models.CharField(max_length=5, choices=POSITION_CHOICES, blank=True, verbose_name="Posición Secundaria")
    position3 = models.CharField(max_length=5, choices=POSITION_CHOICES, blank=True, verbose_name="Posición Terciaria")
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

    # Atributos
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

    CONTRACT_STATUS_CHOICES = [
        ('ACTIVE', 'Contrato Vigente'),
        ('LOANED_OUT', 'Cedido (Saliendo)'), # Jugador pertenece al 'team' pero está cedido a 'loan_destination_team'
        ('LOANED_IN', 'Cedido (Llegando)'),  # Jugador pertenece a 'loan_origin_team' pero juega para 'team'
        ('RENEWAL_PROCESS', 'En Proceso de Renovación'),
        ('EXPIRING_SOON', 'Contrato por Expirar'),
        ('FREE_AGENT', 'Agente Libre'),
        ('ACADEMY', 'Cantera/Formación'),
        ('OTHER', 'Otro'),
    ]
    contract_status = models.CharField(
        max_length=20,
        choices=CONTRACT_STATUS_CHOICES,
        blank=True, null=True,
        verbose_name="Estado Contractual"
    )
    # Si contract_status es LOANED_IN, este es el equipo dueño.
    # Si contract_status es LOANED_OUT, este campo usualmente no se usaría aquí, sino en el equipo destino.
    # Para simplificar, loan_origin_team podría ser el equipo al que pertenece si está cedido A OTRO LADO,
    # y loan_destination_team al que se va si nuestro 'team' lo cede.
    # O más simple: loan_managing_team podría ser el equipo que gestiona la cesión.
    # Vamos a mantenerlo como lo sugerí antes para claridad:
    loan_origin_team = models.ForeignKey(
        Team,
        related_name='players_loaned_from_this_team', 
        on_delete=models.SET_NULL,
        null=True, blank=True,
        verbose_name="Equipo Propietario (Si está cedido EN este equipo)"
    )
    loan_destination_team = models.ForeignKey(
        Team,
        related_name='players_loaned_to_this_team', 
        on_delete=models.SET_NULL,
        null=True, blank=True,
        verbose_name="Equipo Destino (Si está cedido A este equipo)"
    )
    agency_representing = models.CharField(
        max_length=150,
        blank=True, null=True,
        verbose_name="Agencia Representante"
    )

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
        pos1_display = dict(POSITION_CHOICES).get(self.position1, "") if self.position1 else ""
        return f"{display_name} ({pos1_display})" if pos1_display else display_name

    class Meta:
        ordering = ['name']
        verbose_name = "Jugador"
        verbose_name_plural = "Jugadores"


class Report(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='reports', null=True, blank=True, verbose_name="Jugador")
    scout = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reports_made', verbose_name="Autor del Informe")
    
    report_specialization = models.CharField(
        max_length=20,
        choices=REPORT_SPECIALIZATION_CHOICES, # Usando la variable a nivel de módulo
        default='SCOUT',
        verbose_name="Especialización del Informe"
    )
    summary_report_parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='specialized_reports',
        verbose_name="Informe de Resumen Padre",
        limit_choices_to={'report_specialization': 'SUMMARY'}
    )

    report_date = models.DateTimeField(default=timezone.now, verbose_name="Fecha del Informe")
    match_observed = models.CharField(max_length=200, blank=True, null=True, verbose_name="Partido/Evento Observado")
    
    overall_rating = models.PositiveIntegerField(null=True, blank=True, help_text="Valoración general (ej: 1-100)", verbose_name="Valoración General")
    potential_rating = models.PositiveIntegerField(null=True, blank=True, help_text="Valoración de potencial (ej: 1-100)", verbose_name="Valoración Potencial")
    
    summary = models.TextField(verbose_name="Resumen Principal / Observaciones Clave")
    detailed_notes = models.TextField(blank=True, null=True, verbose_name="Notas Detalladas / Contenido Específico")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_report_specialization_display(self): # Método para el serializer
        return dict(REPORT_SPECIALIZATION_CHOICES).get(self.report_specialization)

    def __str__(self):
        player_name = self.player.name if self.player and self.player.name else "Jugador Desconocido"
        scout_name = self.scout.username if self.scout else 'N/A'
        report_date_str = self.report_date.strftime('%Y-%m-%d') if self.report_date else 'Sin Fecha'
        specialization_display = self.get_report_specialization_display()
        return f"Informe ({specialization_display}) para {player_name} por {scout_name} - {report_date_str}"

    class Meta:
        ordering = ['-report_date']
        verbose_name = "Informe"
        verbose_name_plural = "Informes"


class ReportAttachment(models.Model):
    report = models.ForeignKey(Report, related_name='attachments', on_delete=models.CASCADE, verbose_name="Informe Asociado")
    file = models.FileField(upload_to='report_attachments/', verbose_name="Archivo Adjunto")
    description = models.CharField(max_length=255, blank=True, verbose_name="Descripción del Adjunto")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Adjunto para Informe ID {self.report.id} - {self.file.name}"
    
    class Meta:
        verbose_name = "Adjunto de Informe"
        verbose_name_plural = "Adjuntos de Informes"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=30, choices=USER_ROLE_CHOICES, default='VIEWER', verbose_name="Rol Principal") # Usando la variable a nivel de módulo
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, related_name='staff', verbose_name="Equipo Afiliado")
    phone_number = models.CharField(max_length=20, blank=True, null=True, verbose_name="Número de Teléfono")
    bio = models.TextField(blank=True, null=True, verbose_name="Biografía")

    def get_role_display(self): # Método para el serializer
        return dict(USER_ROLE_CHOICES).get(self.role)

    def __str__(self):
        role_display = self.get_role_display()
        return f"Perfil de {self.user.username} ({role_display})"
        
    class Meta:
        verbose_name = "Perfil de Usuario"
        verbose_name_plural = "Perfiles de Usuarios"


class PlayerInterest(models.Model):
    INTEREST_STATUS_CHOICES = [
        ('TRACKING', 'Seguimiento Activo'),
        ('CONTACTED_AGENCY', 'Agencia Contactada'),
        ('NEGOTIATING', 'En Negociación'),
        ('RESERVED', 'Reservado (Intención Formal)'),
        ('CLOSED_LOST', 'Interés Perdido/Cerrado'),
    ]
    player = models.ForeignKey(Player, related_name='interests_received', on_delete=models.CASCADE, verbose_name="Jugador")
    # Puede ser un User (Scout) o un Team. Si es User, el equipo se infiere de UserProfile.
    # Para simplificar, empezamos con User. Si un Team como entidad puede marcar interés, se necesitaría un GenericForeignKey o dos ForeignKeys opcionales.
    interested_party_user = models.ForeignKey(User, related_name='player_interests_made', on_delete=models.CASCADE, verbose_name="Usuario Interesado (Scout)")
    # Opcionalmente, si un equipo directamente marca interés sin un scout específico:
    # interested_team = models.ForeignKey(Team, related_name='direct_player_interests', on_delete=models.CASCADE, null=True, blank=True, verbose_name="Equipo Interesado Directamente")
    
    status = models.CharField(max_length=20, choices=INTEREST_STATUS_CHOICES, default='TRACKING', verbose_name="Estado del Interés")
    interest_level = models.PositiveSmallIntegerField(default=1, help_text="Nivel de interés (1-5)", verbose_name="Nivel de Interés", blank=True, null=True)
    notes = models.TextField(blank=True, verbose_name="Notas Adicionales")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Un scout/usuario solo puede tener un registro de interés activo por un jugador.
        unique_together = ('player', 'interested_party_user')
        ordering = ['-created_at']
        verbose_name = "Interés en Jugador"
        verbose_name_plural = "Intereses en Jugadores"

    def __str__(self):
        return f"Interés de {self.interested_party_user.username} en {self.player.name} ({self.get_status_display()})"


class Offer(models.Model):
    OFFER_STATUS_CHOICES = [
        ('DRAFT', 'Borrador'),
        ('SENT', 'Enviada a Agencia/Jugador'),
        ('VIEWED', 'Vista por Agencia/Jugador'),
        ('NEGOTIATING', 'En Negociación'),
        ('ACCEPTED', 'Aceptada'),
        ('REJECTED', 'Rechazada'),
        ('WITHDRAWN', 'Retirada por Equipo'),
        ('EXPIRED', 'Expirada'),
    ]
    CURRENCY_CHOICES = [('EUR', 'EUR'), ('USD', 'USD'), ('GBP', 'GBP')]

    player = models.ForeignKey(Player, related_name='offers_received', on_delete=models.CASCADE, verbose_name="Jugador Ofertado")
    offering_team = models.ForeignKey(Team, related_name='offers_made_by_team', on_delete=models.CASCADE, verbose_name="Equipo Ofertante") # Renombrado related_name para evitar conflicto
    responsible_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, help_text="Usuario que registra la oferta", verbose_name="Usuario Responsable")
    
    offer_date = models.DateTimeField(default=timezone.now, verbose_name="Fecha de Oferta")
    valid_until = models.DateField(null=True, blank=True, verbose_name="Válida Hasta")
    
    salary_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, verbose_name="Monto Salario")
    salary_currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, blank=True, null=True, verbose_name="Moneda Salario")
    contract_duration_years = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name="Duración Contrato (Años)")
    transfer_fee = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, verbose_name="Cláusula/Precio Transferencia")
    fee_currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, blank=True, null=True, verbose_name="Moneda Cláusula")
    
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

# Modelo para Historial de Atributos/Estadísticas del Jugador (para analíticas de crecimiento)
class PlayerHistoricalData(models.Model):
    player = models.ForeignKey(Player, related_name='historical_data', on_delete=models.CASCADE)
    date_recorded = models.DateField(default=date.today, verbose_name="Fecha de Registro")
    
    # Podrías replicar los campos de atributos de Player aquí
    # o usar un campo JSONField si tu BD lo soporta y quieres más flexibilidad.
    # Ejemplo con algunos atributos:
    velocidad = models.PositiveIntegerField(null=True, blank=True)
    resistencia = models.PositiveIntegerField(null=True, blank=True)
    finalizacion = models.PositiveIntegerField(null=True, blank=True)
    market_value = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    # ... más campos de atributos y estadísticas clave que quieras rastrear ...

    notes = models.TextField(blank=True, help_text="Notas sobre este snapshot de datos")

    class Meta:
        ordering = ['player', '-date_recorded']
        verbose_name = "Dato Histórico de Jugador"
        verbose_name_plural = "Datos Históricos de Jugadores"
        unique_together = ('player', 'date_recorded') # Solo un registro por jugador por día

    def __str__(self):
        return f"Datos de {self.player.name} para {self.date_recorded}"