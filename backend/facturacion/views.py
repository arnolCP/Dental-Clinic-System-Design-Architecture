from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Tratamiento
from .serializers import TratamientoSerializer

class TratamientoAPIView(APIView):
    def get(self, request):
        tratamientos = Tratamiento.objects.all()
        serializer = TratamientoSerializer(tratamientos, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TratamientoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Tratamiento creado correctamente", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk=None):
        try:
            tratamiento = Tratamiento.objects.get(id=pk)
        except Tratamiento.DoesNotExist:
            return Response({"error": "Tratamiento no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        serializer = TratamientoSerializer(tratamiento, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Tratamiento actualizado", "data": serializer.data})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            tratamiento = Tratamiento.objects.get(id=pk)
        except Tratamiento.DoesNotExist:
            return Response({"error": "Tratamiento no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        tratamiento.activo = False
        tratamiento.save()
        return Response({"message": "Tratamiento desactivado correctamente"})
    
