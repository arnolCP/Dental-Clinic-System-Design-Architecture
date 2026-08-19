from rest_framework.test import APITestCase
from django.urls import reverse
from main.models import Paciente

class PacienteTest(APITestCase):

    def test_crear_paciente(self):

        url = reverse("api_registro_paciente")

        data = {
            "nombres": "Luis",
            "apellidos": "Quispe Gómez",
            "dni": "87654321",
            "telefono": "999111222",
            "direccion": "Av. Bolívar 123",
            "fecha_nacimiento": "2000-05-10",
            "genero": "M"
        }

        response = self.client.post(url, data, format="json")

        print("Respuesta backend:", response.data)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Paciente.objects.count(), 1)
        self.assertEqual(Paciente.objects.first().dni, "87654321")
