from rest_framework import serializers
from .models import Address, CustomUser


class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'phone_number', 'is_superuser', 'date_joined', 'last_login'] # Include all necessary fields

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username']  # Only include id and username
class AddressSerializer(serializers.ModelSerializer):
    # user = serializers.PrimaryKeyRelatedField(read_only=True)# Assuming you have a user field in Address model
    user = UserSerializer(read_only=True)
    is_primary = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Address
        # fields = '__all__'  #  Include all fields from Address model
        fields = ['id', 'street_address', 'city', 'state', 'postal_code', 'country', 'is_primary', 'user']

 # Add other fields as necessary 