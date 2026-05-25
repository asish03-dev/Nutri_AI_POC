from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile,meal_logs, chat_logs

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords don't match"})
            
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "User with this email already exists"})
            
        return data
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user

class OnboardingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class MealImageUploadSerializer(serializers.Serializer):
    """
    A simple serializer used just to validate the image upload
    before sending it to Gemini.
    """
    image = serializers.ImageField(required=True)
class MealLogSerializer(serializers.ModelSerializer):
    """
    Serializer for saving and listing the actual meal logs in the database.
    """
    class Meta:
        model = meal_logs
        # You can specify exact fields, or use '__all__'
        fields = '__all__'
        read_only_fields = ['meal_id', 'created_at', 'tracking_id', 'user']


class ChatLogSerializer(serializers.ModelSerializer):
    """
    Serializer for saving and listing the actual chat logs in the database.
    """
    class Meta:
        model = chat_logs
        # You can specify exact fields, or use '__all__'
        fields = '__all__'
        read_only_fields = ['session_id', 'created_at', 'user','ai_response']
        