from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Cita
from .serializers import CitaSerializer


class CrearCitaView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CitaSerializer(data=request.data, context={"request": request})

        if serializer.is_valid():
            cita = serializer.save()
            return Response(CitaSerializer(cita).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListarTodasCitasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        citas = Cita.objects.select_related(
            "paciente",
            "doctor",
            "tratamiento"
        ).order_by("-created_at")

        serializer = CitaSerializer(
            citas,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data)

