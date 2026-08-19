from django.db import models
from main.models import Paciente, Odontologo
from facturacion.models import Tratamiento

class Cita(models.Model):

    paciente = models.ForeignKey(
        Paciente,
        on_delete=models.CASCADE,
        related_name="citas"
    )

    doctor = models.ForeignKey(
        Odontologo,
        on_delete=models.SET_NULL,
        related_name="citas",
        null=True,
        blank=True
    )

    tratamiento = models.ForeignKey(
        Tratamiento,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    motivo= models.CharField(max_length=20)
    fecha = models.DateField()
    hora = models.TimeField()

    ESTADOS = [
        ("Pendiente", "Pendiente"),
        ("Confirmada", "Confirmada"),
        ("Cancelada", "Cancelada"),
        ("Atendida", "Atendida"),
    ]

    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default="Pendiente"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cita de {self.paciente} con {self.doctor} el {self.fecha} a las {self.hora}"
