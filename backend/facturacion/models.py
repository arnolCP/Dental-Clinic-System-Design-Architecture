from django.db import models
from main.models import Paciente

class Procedimiento(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} - S/{self.precio}"


class Tratamiento(models.Model):
    tipo = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    procedimientos = models.ManyToManyField(
        Procedimiento,
        related_name="tratamientos",
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    fecha_fin = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.tipo} - S/{self.precio}"
