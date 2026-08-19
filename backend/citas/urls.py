from django.urls import path
from .views import CrearCitaView, ListarTodasCitasView

urlpatterns = [
    path("citas/crear/", CrearCitaView.as_view(), name="crear_citas"),
    path("citas/", ListarTodasCitasView.as_view(), name="ver_citas"),
]
