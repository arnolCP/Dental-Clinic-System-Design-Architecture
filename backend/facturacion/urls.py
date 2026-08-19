from django.urls import path
from .views import TratamientoAPIView
urlpatterns = [
    path('tratamientos/', TratamientoAPIView.as_view()),
    path('tratamientos/<int:pk>/', TratamientoAPIView.as_view()),
]
