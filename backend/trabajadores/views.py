from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from main.models import Trabajador, Odontologo, Recepcionista
from main.serializers import UsuarioSerializer, TrabajadorSerializer, RecepcionistaSerializer, OdontologoSerializer

class RegistroTrabajadorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()

        data["username"] = data.get("dni")

        usuario_serializer = UsuarioSerializer(data=data)

        if not usuario_serializer.is_valid():
            return Response(usuario_serializer.errors, status=400)

        usuario = usuario_serializer.save(tipo=data.get("tipo"))

        trabajador = Trabajador.objects.create(
            usuario=usuario,
            fecha_contratacion=data.get("fecha_contratacion"),
            sueldo=data.get("sueldo")
        )

        tipo = data.get("tipo")

        if tipo == "Odontologo":
            if not data.get("especialidad") or not data.get("num_colegiatura"):
                return Response({"error": "Faltan datos del odontólogo"}, status=400)

            Odontologo.objects.create(
                trabajador=trabajador,
                especialidad=data.get("especialidad"),
                num_colegiatura=data.get("num_colegiatura")
            )

        elif tipo == "Recepcionista":
            Recepcionista.objects.create(
                trabajador=trabajador,
                turno=data.get("turno"),
                area_asignada=data.get("area_asignada")
            )

        return Response({"message": "Trabajador registrado correctamente"}, status=201)


class ListaTrabajadoresView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        trabajadores = Trabajador.objects.select_related("usuario").all()

        data = []

        for t in trabajadores:
            usuario = t.usuario

            extra = {}

            if usuario.tipo == "Odontologo":
                try:
                    odo = Odontologo.objects.get(trabajador=t)
                    extra["especialidad"] = odo.especialidad
                    extra["num_colegiatura"] = odo.num_colegiatura
                except:
                    pass

            if usuario.tipo == "Recepcionista":
                try:
                    rec = Recepcionista.objects.get(trabajador=t)
                    extra["turno"] = rec.turno
                    extra["area_asignada"] = rec.area_asignada
                except:
                    pass

            data.append({
                "id": t.id,
                "tipo": usuario.tipo,
                "first_name": usuario.first_name,
                "last_name": usuario.last_name,
                "dni": usuario.dni,
                "telefono": usuario.telefono,
                "email": usuario.email,
                "direccion": usuario.direccion,
                **extra
            })

        return Response(data)


class ListarOdontologosView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        odontologos = Odontologo.objects.select_related(
            'trabajador__usuario'
        )
        serializer = OdontologoSerializer(odontologos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
