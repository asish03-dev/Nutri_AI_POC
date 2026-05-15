from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from google.oauth2 import id_token
import requests as standard_requests
from google.auth.transport import requests as google_requests
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()
from .models import UserProfile
from .serializer import RegisterSerializer, OnboardingSerializer
from rest_framework import status,viewsets
from rest_framework import authentication, permissions
from django.db import models

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        serializer = RegisterSerializer(data = data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "user created sucessfully",
                "status": True,
                "data": serializer.data
            }, status = status.HTTP_201_CREATED)


        return Response(serializer.errors, status =status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        data = request.data
        # Robustly get the identifier from 'username' or 'email' key
        login_id = data.get('username') or data.get('email')
        password = data.get('password')
        
        if not login_id:
            return Response({"message": "Please provide a username or email"}, status=status.HTTP_400_BAD_REQUEST)

        # Search for user by either username or email using the identifier provided
        user = User.objects.filter(models.Q(username=login_id) | models.Q(email=login_id)).first()
        
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "user": {
                    "username": user.username,
                    "email": user.email
                }
            })

        return Response({"message":"invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        profile = getattr(request.user, 'profile', None)
        serializer = OnboardingSerializer(profile)
        return Response({
            "message": "user profile",
            "data": serializer.data
        }, status = status.HTTP_200_OK)
        
        
class OnboardingView(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OnboardingSerializer
    def get_queryset(self):
        # This ensures a user only sees their own profile
        return UserProfile.objects.filter(user=self.request.user)
    def create(self, request):
        return super().create(request)
    def list(self, request):
        return super().list(request)
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    


# Replace this with your actual Google Client ID
GOOGLE_CLIENT_ID = "418733621307-ajvgk9mk30meca1cs7k83tcl63mse6b5.apps.googleusercontent.com"
class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        token = request.data.get('token')
        
        if not token:
            return Response({"message": "No token provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            google_response = standard_requests.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {token}"}
            )

            if google_response.status_code != 200:
                return Response({"message": "Invalid Google token"}, status=status.HTTP_401_UNAUTHORIZED)

            idinfo = google_response.json()

            email = idinfo['email']
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')

            user = User.objects.filter(email=email).first()

            if not user:
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    first_name=first_name,
                    last_name=last_name
                )
                user.set_unusable_password()
                user.save()

            refresh = RefreshToken.for_user(user)

            return Response({
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "user": {
                    "username": user.username,
                    "email": user.email
                }
            }, status=status.HTTP_200_OK)

        except ValueError:
            return Response({"message": "Invalid Google token"}, status=status.HTTP_401_UNAUTHORIZED)