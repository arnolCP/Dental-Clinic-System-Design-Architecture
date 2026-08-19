from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegistroPacienteView,
    current_user,
    LoginView,
    CustomLoginView,
    PacienteListCreateView,
    DashboardStatsView,
    BuscarPacientePorDNI
)

urlpatterns = [
    path('registro/', RegistroPacienteView.as_view(), name='api_registro_paciente'),
    path('login/', CustomLoginView.as_view(), name='token_obtain_pair'),
    path('user/', current_user),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('pacientes/', PacienteListCreateView.as_view(), name='pacientes'),
    path("stats/", DashboardStatsView.as_view()),
    path("pacientes/buscar/<str:dni>/", BuscarPacientePorDNI.as_view()),
]
