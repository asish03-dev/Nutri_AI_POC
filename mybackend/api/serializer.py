from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile,meal_logs, chat_logs

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only =True)
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("passwords don't match")
        return data
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
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
        