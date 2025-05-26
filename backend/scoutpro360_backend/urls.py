# backend/scoutpro360_backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings # Para servir archivos multimedia en desarrollo
from django.conf.urls.static import static # Para servir archivos multimedia en desarrollo
from rest_framework.authtoken import views as authtoken_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), # Incluye las URLs de tu app 'api'
    path('api/api-token-auth/', authtoken_views.obtain_auth_token, name='api_token_auth'), # Endpoint para obtener token
    # Aquí podrían ir otras URLs de tu proyecto principal
]

# Servir archivos multimedia en modo DEBUG
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
