from rest_framework import serializers
from .models import File
from django.contrib.auth import get_user_model

User = get_user_model()

class FileOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]  #  Select the fields you want

class FileSerializer(serializers.ModelSerializer):
    file_owner = FileOwnerSerializer()  #  Nested Serializer

    class Meta:
        model = File
        fields = ["id", "file_name", "file_type", "file_size", "file_path", "uploaded_at", "updated_at", "file_owner"]
