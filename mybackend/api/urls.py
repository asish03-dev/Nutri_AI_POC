from django.urls import path
from .views import RegisterView, LoginView, ProfileView, OnboardingView,AnalyzeMealImageView, MealLogListCreateView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('onboarding/', OnboardingView.as_view({'get': 'list', 'post': 'create'})),
    path('meal-logs/analyze/', AnalyzeMealImageView.as_view(), name='analyze_meal_image'),
    path('meal-logs/', MealLogListCreateView.as_view(), name='meal_logs_list_create'),
]


