from .views import RequestOTPView, VerifyOTPView
from django.urls import path
from .views import RegisterView, LoginView, ProfileView, OnboardingView
from .views import GoogleLoginView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('onboarding/', OnboardingView.as_view({'get': 'list', 'post': 'create'})),
    path('onboarding/<uuid:pk>/', OnboardingView.as_view({'get': 'retrieve', 'patch': 'partial_update', 'put': 'update'})),
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
    path('request-otp/', RequestOTPView.as_view(), name='request_otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),

]

