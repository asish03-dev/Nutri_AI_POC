from django.urls import path
from .views import RegisterView, LoginView, ProfileView, OnboardingView, AnalyzeMealImageView, MealLogListCreateView, DashboardSummaryView, NiaChatView
from .views import GoogleLoginView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
    path('profile/', ProfileView.as_view()),
    path('onboarding/<uuid:pk>/', OnboardingView.as_view({'get': 'retrieve', 'patch': 'partial_update', 'put': 'update'})),
    path('meal-logs/analyze/', AnalyzeMealImageView.as_view(), name='analyze_meal_image'),
    path('meal-logs/', MealLogListCreateView.as_view(), name='meal_logs_list_create'),
    path('dashboard/', DashboardSummaryView.as_view(), name='dashboard_summary'),
    path('nia/chat/', NiaChatView.as_view(), name='nia_chat'),
]

