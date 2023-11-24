from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import TokenObtainSerializer


# Create your views here.
class CustomObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainSerializer
