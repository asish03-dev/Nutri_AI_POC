import random
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from google.oauth2 import id_token
import requests as standard_requests
from google.auth.transport import requests as google_requests
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta


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
        serializer = RegisterSerializer(data=data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            otp_code = str(random.randint(100000, 999999))
            user.otp = otp_code
            user.otp_created_at = timezone.now()
            user.save()
            
            subject = "Your NutriAI Verification Code"
            message = f"Hello!\n\nYour 6-digit verification code is: {otp_code}\n\nThis code will expire in 10 minutes.\n\nWelcome to NutriAI!"

            try:
                send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email])
                return Response({
                    "message": "Account created! Please verify your email.", 
                    "requires_otp": True, 
                    "email": user.email
                }, status=status.HTTP_201_CREATED)
            
            except Exception as e:
                return Response({"message": "Failed to send OTP email."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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
            # 6 digit otp generation
            otp = str(random.randint(100000, 999999))
            user.otp = otp
            user.otp_created_at = timezone.now()
            user.save()
            # Send OTP email
            subject = "Your NutriAI Login OTP"
            message = f"Hello!\n\nYour 6-digit OTP for login is: {otp}\n\nThis OTP will expire in 10 minutes.\n\nWelcome back to NutriAI!"

            try:
                send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email])
                return Response({"message": "Password correct! Please verify your OTP.", "requires_otp": True, "email": user.email}, status=status.HTTP_200_OK)
            
            except Exception as e:
                return Response({"message": "Failed to send OTP email."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"message":"Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


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
        


class RequestOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({"message": "Please provide an email address."}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Find the user, or create a new one if they don't exist yet
        user, created = User.objects.get_or_create(email=email, defaults={'username': email})

        # 2. Generate a random 6-digit OTP
        otp_code = str(random.randint(100000, 999999))

        # 3. Save the OTP and the exact time it was created
        user.otp = otp_code
        user.otp_created_at = timezone.now()
        user.save()

        # 4. Send the Email!
        subject = "Your NutriAI Login Code"
        message = f"Hello!\n\nYour 6-digit verification code is: {otp_code}\n\nThis code will expire in 10 minutes.\n\nWelcome to NutriAI!"
        
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.EMAIL_HOST_USER, # Uses the email from your settings
                recipient_list=[email],
                fail_silently=False,
            )
            return Response({"message": "OTP sent successfully!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": f"Failed to send email. Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp_code = request.data.get('otp')

        if not email or not otp_code:
            return Response({"message": "Please provide both email and OTP."}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Find the user
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # 2. Check if the OTP matches the one in the database
        if user.otp != str(otp_code):
            return Response({"message": "Invalid OTP code."}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Check if the OTP is expired (older than 10 minutes)
        if user.otp_created_at:
            expiration_time = user.otp_created_at + timedelta(minutes=10)
            if timezone.now() > expiration_time:
                return Response({"message": "OTP has expired. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)

        # 4. Success! Mark as verified and clear the OTP so it can't be used again by hackers
        user.is_verified = True
        user.otp = None 
        user.otp_created_at = None
        user.save()

        # 5. Log the user in by generating their JWT tokens!
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Verification successful!",
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "user": {
                "id": str(user.id),
                "username": user.username,
                "email": user.email
            }
        }, status=status.HTTP_200_OK)
