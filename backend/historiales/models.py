from django.db import models
from main.models import Paciente  # Ajusta según tu estructura

class HistorialClinico(models.Model):

    paciente = models.ForeignKey(
        Paciente, 
        on_delete=models.CASCADE,
        related_name="historiales"
    )

    fecha_creacion = models.DateField(auto_now_add=True)

    antecedentes = models.TextField(blank=True, null=True)
    alergias = models.TextField(blank=True, null=True)
    enfermedades_previas = models.TextField(blank=True, null=True)
    medicamentos_actuales = models.TextField(blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Historial de {self.paciente.nombres} {self.paciente.apellidos}"
