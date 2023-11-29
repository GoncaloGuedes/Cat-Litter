# authentication/serializers.py
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import UserAccount


class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "profile_image",
        )
        read_only_fields = ["id"]
        


class UserAccountCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserAccount
        fields = ("id", "email", "first_name", "last_name", "password", "profile_image")
        read_only_fields = ("id",)

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = UserAccount.objects.create_user(password=password, **validated_data)
        return user


class UserAccountDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ("id", "email", "first_name", "last_name", "profile_image")
        read_only_fields = ("id", "email")


class UserAccountListSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ("id", "first_name", "last_name", "profile_image")


class TokenObtainSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        response = {
            "tokens": super().validate(attrs),
            "user": UserAccountSerializer(self.user).data,
        }
        return response
