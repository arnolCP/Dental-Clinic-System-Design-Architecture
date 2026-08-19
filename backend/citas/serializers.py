from rest_framework import serializers
from .models import Cita

class CitaSerializer(serializers.ModelSerializer):

    paciente_nombre = serializers.SerializerMethodField()
    doctor_nombre = serializers.SerializerMethodField()
    tratamiento_nombre = serializers.CharField(source="tratamiento.tipo", read_only=True)

    dni = serializers.CharField(source="paciente.dni", read_only=True)

    class Meta:
        model = Cita
        fields = [
            "id",
            "dni",
            "paciente",
            "paciente_nombre",
            "doctor",
            "doctor_nombre",
            "tratamiento",
            "tratamiento_nombre",
            "motivo",
            "fecha",
            "hora",
            "estado",
            "created_at"
        ]

        read_only_fields = [
            "created_at",
            "paciente_nombre",
            "doctor_nombre",
            "tratamiento_nombre",
            "dni"
        ]

    def get_paciente_nombre(self, obj):
        return f"{obj.paciente.nombres} {obj.paciente.apellidos}"
    

    def get_doctor_nombre(self, obj):
        if obj.doctor:
            return f"{obj.doctor.trabajador.usuario.first_name} {obj.doctor.trabajador.usuario.last_name}"
        return None
    
    def create(self, validated_data):
        return super().create(validated_data)
