from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Player, Team, User
from .serializers import PlayerSerializer

# Create your tests here.

class TeamAPITests(APITestCase):
    def setUp(self):
        self.team_data = {"name": "Test Team", "country": "Testland"}
        self.team = Team.objects.create(name="Existing Team", country="Oldland")

    def test_create_team(self):
        url = reverse('team-list') # Asumiendo que 'team-list' es el nombre generado por el router para TeamViewSet
        response = self.client.post(url, self.team_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Team.objects.count(), 2)
        self.assertEqual(Team.objects.get(id=response.data['id']).name, 'Test Team')

    def test_get_teams_list(self):
        url = reverse('team-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Asumiendo paginación, response.data será un diccionario con 'results'
        self.assertEqual(len(response.data['results']), 1) 
        self.assertEqual(response.data['results'][0]['name'], self.team.name)

class PlayerAPITests(APITestCase):
    def setUp(self):
        # Crear un usuario para autenticación si es necesario para algunas pruebas
        # self.user = User.objects.create_user(username='testuser', password='testpassword')
        # self.client.login(username='testuser', password='testpassword') # Si usas SessionAuthentication
        # O para TokenAuthentication:
        # self.token = Token.objects.create(user=self.user)
        # self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.team = Team.objects.create(name="Real Madrid", country="Spain")
        self.player_data = {
            "name": "Test Player",
            "team_id": self.team.id, # Usar team_id para la creación
            "position1": "ST",
            "nationality": "Testland",
            "date_of_birth": "2000-01-01"
        }
        self.player = Player.objects.create(
            name="Existing Player",
            team=self.team,
            position1="GK",
            nationality="Oldland",
            date_of_birth="1995-05-10"
        )

    def test_create_player(self):
        url = reverse('player-list') 
        response = self.client.post(url, self.player_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(Player.objects.count(), 2)
        self.assertEqual(Player.objects.get(id=response.data['id']).name, 'Test Player')
