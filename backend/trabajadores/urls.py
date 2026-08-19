from django.urls import path
from .views import (
    RegistroTrabajadorView,
    ListaTrabajadoresView,
    ListarOdontologosView
)

urlpatterns = [
    path('registro_trabajador/', RegistroTrabajadorView.as_view(), name='api_registro_trabajador'),
    path('trabajadores/', ListaTrabajadoresView.as_view(), name='lista-trabajadores'),
    path('odontologos/', ListarOdontologosView.as_view(), name='lista-odontologos'),
]
