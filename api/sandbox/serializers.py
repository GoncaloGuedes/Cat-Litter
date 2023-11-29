from rest_framework.serializers import ImageField, ModelSerializer, Serializer

from .models import SandChanges


class SandboxPostSerializer(Serializer):
    image = ImageField()


class SandboxGetSerializer(ModelSerializer):
    class Meta:
        model = SandChanges
        exclude = ("id",)
