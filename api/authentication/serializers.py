# authentication/serializers.py
from rest_framework import serializers
from .models import UserAccount


class UserAccountSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = UserAccount
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "profile_image",
            "profile_image_url",
        )
        read_only_fields = ("id", "profile_image_url")

    def get_profile_image_url(self, user):
        request = self.context.get("request")
        if user.profile_image:
            return request.build_absolute_uri(user.profile_image.url)
        return None


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
