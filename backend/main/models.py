from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    TIPO_USUARIO = [
        ('Odontologo', 'Odontologo'),
        ('Recepcionista', 'Recepcionista'),
        ('Administrador', 'Administrador'),
    ]

    tipo = models.CharField(max_length=20, choices=TIPO_USUARIO)
    dni = models.CharField(max_length=8, unique=True, null=True, blank=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    genero = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.get_tipo_display()})"


class Paciente(models.Model):
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    dni = models.CharField(max_length=8, unique=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    genero = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"



class Trabajador(models.Model):
    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        limit_choices_to={'tipo__in': ['Odontologo', 'Recepcionista', 'Administrador']}
    )
    fecha_contratacion = models.DateField(null=True, blank=True)
    sueldo = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return self.usuario.username



class Odontologo(models.Model):
    trabajador = models.OneToOneField(Trabajador, on_delete=models.CASCADE)
    especialidad = models.CharField(max_length=100)
    num_colegiatura = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.trabajador.usuario.get_full_name()}"



class Recepcionista(models.Model):
    trabajador = models.OneToOneField(Trabajador, on_delete=models.CASCADE)
    turno = models.CharField(max_length=20)
    area_asignada = models.CharField(max_length=35)

    def __str__(self):
        return f"{self.trabajador.usuario.get_full_name()}"

