from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from .models import Usuario, Paciente, Trabajador, Odontologo, Recepcionista
from citas.models import Cita
from historiales.models import HistorialClinico
from .serializers import UsuarioSerializer, PacienteSerializer, TrabajadorSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .token import CustomTokenObtainPairSerializer
from django.utils import timezone



class RegistroPacienteView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PacienteSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Paciente registrado correctamente'},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'tipo': user.tipo
            })
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)

@api_view(['GET'])
def current_user(request):
    user = request.user
    serializer = UsuarioSerializer(user)
    return Response(serializer.data)


class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class PacienteListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pacientes = Paciente.objects.all()
        serializer = PacienteSerializer(pacientes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PacienteSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        hoy = timezone.now().date()

        pacientes = Paciente.objects.count()
        citas_hoy = Cita.objects.filter(fecha=hoy).count()
        odontologos = Odontologo.objects.count()
        historiales = HistorialClinico.objects.count()

        data = {
            "pacientes": pacientes,
            "citas_hoy": citas_hoy,
            "odontologos": odontologos,
            "historiales": historiales
        }

        return Response(data)
    
class BuscarPacientePorDNI(APIView):
    def get(self, request, dni):
        try:
            paciente = Paciente.objects.get(dni=dni)
            serializer = PacienteSerializer(paciente)
            return Response(serializer.data)
        except Paciente.DoesNotExist:
            return Response({"error": "Paciente no encontrado"}, status=404)
