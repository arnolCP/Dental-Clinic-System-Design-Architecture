from rest_framework.test import APITestCase
from django.urls import reverse
from main.models import Usuario, Trabajador, Odontologo, Paciente
from citas.models import Cita

class CitaTest(APITestCase):

    def setUp(self):

        self.user = Usuario.objects.create_user(
            username="odont1",
            password="123456",
            tipo="Odontologo",
            dni="12345678",
            first_name="Carlos",
            last_name="Ramírez",
            telefono="999888777",
            direccion="Av Perú",
            genero="M"
        )

        self.client.force_authenticate(user=self.user)


        self.trabajador = Trabajador.objects.create(
            usuario=self.user,
            fecha_contratacion="2024-01-01",
            sueldo=2500
        )

        self.odontologo = Odontologo.objects.create(
            trabajador=self.trabajador,
            especialidad="Ortodoncia",
            num_colegiatura="OD123456"
        )

        self.paciente = Paciente.objects.create(
            nombres="Juan",
            apellidos="Pérez",
            dni="77777777",
            telefono="999555333",
            direccion="Av Grau",
            genero="M"
        )

    def test_crear_cita(self):

        url = reverse("crear_citas")

        data = {
            "paciente": self.paciente.id,
            "doctor": self.odontologo.id,
            "fecha": "2025-11-27",
            "hora": "11:00",
            "motivo": "Dolor fuerte",
            "estado": "Pendiente"
        }

        response = self.client.post(url, data, format="json")

        print("Respuesta backend:", response.data)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Cita.objects.count(), 1)
