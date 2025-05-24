from django.contrib import admin
from django.urls import path, include # <-- Asegúrate de importar include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), # <-- Añade esta línea para incluir las URLs de tu app 'api'
    # Aquí podrían ir otras URLs de tu proyecto principal
]