from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid
from django.db import models

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, null=True, blank=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)

    # Custom Role ENUM
    ROLE_CHOICES = (
        ('user', 'User'),
        ('admin', 'Admin')
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    
    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.username

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='profile')
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    day_of_birth = models.IntegerFieldField(null=True, blank=True)
    month_of_birth = models.IntegerField(null=True, blank=True)
    year_of_birth = models.IntegerField(null=True, blank=True)
    height_cm = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    current_weight_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    targeted_weight_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    gender = models.CharField(max_length=50, null=True, blank=True)
    activity_level = models.CharField(max_length=50, null=True, blank=True)
    primary_goal = models.CharField(max_length=50, null=True, blank=True)
    daily_calorie_target = models.IntegerField(null=True, blank=True)
    
    health_issues = models.TextField(null=True, blank=True)
    allergies = models.TextField(null=True, blank=True)
    dietary_preference = models.CharField(max_length=50, null=True, blank=True)
    
    meal_intake_per_day = models.IntegerField(null=True, blank=True)
    water_intake_litres = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    sleep_schedule = models.CharField(max_length=100, null=True, blank=True)
    regional_culture = models.CharField(max_length=100, null=True, blank=True)
    available_cooking_time = models.CharField(max_length=100, null=True, blank=True)
    preferred_cooking_oil = models.CharField(max_length=100, null=True, blank=True)
    grocery_budget = models.CharField(max_length=50, null=True, blank=True)
    preferred_meal_location = models.CharField(max_length=100, null=True, blank=True)
    main_carbs_source = models.CharField(max_length=100, null=True, blank=True)
    occupation = models.CharField(max_length=100, null=True, blank=True)
    
    profile_photo_url = models.TextField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    bmi = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    liked_foods = models.TextField(null=True, blank=True)
    disliked_foods = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    active_subscription = models.OneToOneField(Subscription, on_delete=models.SET_NULL, null=True, blank=True, related_name='active_for_profile')

    def __str__(self):
        return f"{self.user.username}'s Profile"
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

class Subscription(models.Model):
    subscription_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    plan_type = models.CharField(max_length=100) # 'free', 'Student', 'Working Professional', 'gym'
    price_paid = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50, null=True, blank=True)
    payment_id = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class daily_tracking(models.Model):
    tracking_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_tracking')
    total_calories_consumed = models.IntegerField(null=True, blank=True)
    total_carbs = models.DecimalField(max_digit=5, decimal_places=2, null=True, blank=True)
    total_fat = models.DecimalField(max_digit=5, decimal_places=2, null=True,blank=True)
    water_intake_liters = models.DecimalField(max_digit=5, decimal_places=2, null=True,blank=True)
    junk_score_avg = models.DecimalField(max_digit=5, decimal_places=2, null=True,blank=True)
    surplus_or_deficit = models.DecimalField(max_digit=5, decimal_places=2, null=True,blank=True)
    behaviour_summary = models.CharField(max_length=100)
    meal_count = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class meal_logs(models.Model):
    meal_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meal_logs')
    tracking_id = models.ForeignKey(daily_tracking, on_delete=models.CASCADE, related_name='meal_logs')
    meal_type = models.CharField(max_length=50, null=True, blank=True)
    meal_location = models.CharField(max_length=100, null=True, blank=True)
    meal_timedate = models.DateTimeField(auto_now_add=True)
    detected_items = models.CharField(max_length=100, null=True, blank=True)
    calories = models.IntegerField(null=True, blank=True)
    protein_gm = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    carbs_gm = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    fat_gm = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    junk_score = models.IntegerField(null=True, blank=True)
    ai_insights = models.CharField(max_length=100, null=True, blank=True)
    meal_photo_url = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now=True)
