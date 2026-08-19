from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Usuario, Paciente, Trabajador, Odontologo, Recepcionista

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = '__all__'

class TrabajadorSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)

    class Meta:
        model = Trabajador
        fields = '__all__'

class OdontologoSerializer(serializers.ModelSerializer):
    trabajador = TrabajadorSerializer(read_only=True)

    class Meta:
        model = Odontologo
        fields = '__all__'

class RecepcionistaSerializer(serializers.ModelSerializer):
    trabajador = TrabajadorSerializer(read_only=True)

    class Meta:
        model = Recepcionista
        fields = '__all__'
