# Django REST Framework: First Principles Guide
## Serializers, Views & JWT Auth Flow

---

## Part 1: Why Does the Browsable API Show Only One "Content" Field?

This is a **very common confusion**. Here is why it happens:

When you use `APIView`, DRF's Browsable API (the web UI you open in a browser) does NOT know the shape of your data. You are manually calling `request.data.get('email')` inside the view, so DRF has no way to auto-generate a form for each field.

Instead, it falls back to showing you **a single raw JSON textarea** called "Content", where you must type JSON manually:

```json
{
    "email": "test@example.com",
    "password": "secret123"
}
```

**To get individual input fields in the browsable API**, you need to use a `Serializer` connected to the view properly (covered below in ViewSets). When you use `ModelViewSet`, DRF reads the serializer's fields and automatically renders individual input boxes for each one.

---

## Part 2: The Three Types of Serializers

Think of a serializer as a **translator** between your Python model and JSON. There are three main styles:

### Style 1: `Serializer` (Manual, Full Control)
Use this when your data **does not map 1:1 to a model** — e.g., a login form.

```python
from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    # No 'model' here. Pure input/output contract.
```
**When to use:** Login, password change, search forms, anything custom.

---

### Style 2: `ModelSerializer` (Auto, Based on Model)
Use this when your data **maps directly to a database model**.
DRF auto-generates fields from your model. You just specify which fields to include.

```python
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'is_email_verified', 'created_at']
        # 'fields = __all__' would include every column
        # Use 'exclude' to hide specific fields:
        # exclude = ['password']
```
**When to use:** Showing user profile, listing products, any CRUD operation on a model.

---

### Style 3: `ModelSerializer` with Custom Fields (Hybrid)
Use this when you need a model serializer but with **extra logic** — like a registration form that takes a password but hashes it before saving.

```python
class RegisterSerializer(serializers.ModelSerializer):
    # Add a field that DOESN'T exist on the model
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'role']

    def create(self, validated_data):
        # Override create() to add custom logic (hashing password)
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user

    def validate_email(self, value):
        # You can add per-field validation with validate_<fieldname>
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already in use.")
        return value
```
**When to use:** Registration, profile updates with custom logic.

---

## Part 3: The Three Types of Views

This is the most important section. Each view style is a different **level of abstraction**.

### Level 1: `@api_view` — Simple Function (Least Abstraction)
Just a plain Python function. You choose exactly what happens.

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello!"})

@api_view(['POST'])
def register_user(request):
    # request.data is already parsed JSON
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Registered!"}, status=201)
    return Response(serializer.errors, status=400)
```
**When to use:** Quick one-off endpoints, simple logic, easy to understand.
**Con:** Gets messy for complex CRUD. No auto-form in browsable API.

---

### Level 2: `APIView` — Class-Based (Medium Abstraction)
A class where each HTTP method (`GET`, `POST`, `PUT`, `DELETE`) is its own method.
This is what you already have in your `views.py`.

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class UserDetailView(APIView):
    def get(self, request, pk):
        # Handle GET /api/user/1/
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        # Handle PUT /api/user/1/
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        # Handle DELETE /api/user/1/
        user = User.objects.get(pk=pk)
        user.delete()
        return Response(status=204)
```
**When to use:** Auth flows (login/register/logout), custom business logic.
**Con:** You manually write `get`, `post`, `put`, `delete` for every view.

---

### Level 3: `ModelViewSet` — Full CRUD Auto (Most Abstraction)
ONE class gives you `GET list`, `GET detail`, `POST`, `PUT`, `PATCH`, `DELETE` **automatically**.
This is the `StudentProfileViewSet` you saw.

```python
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated] # Only logged-in users

    # You can override specific actions if needed:
    def perform_create(self, serializer):
        # Custom logic on create
        serializer.save(created_by=self.request.user)
```

**In `urls.py` (ViewSets need a Router, not a path):**
```python
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = router.urls
# This auto-creates ALL of these URLs:
# GET    /api/users/        → list all users
# POST   /api/users/        → create a user
# GET    /api/users/1/      → get user with id=1
# PUT    /api/users/1/      → update user with id=1
# PATCH  /api/users/1/      → partial update user with id=1
# DELETE /api/users/1/      → delete user with id=1
```
**When to use:** Standard CRUD (Products, Posts, Profiles). This also auto-generates individual input fields in the Browsable API!
**Con:** Can feel like magic; less obvious what's happening for beginners.

---

### When to Use Which View?

| Scenario | Use |
|---|---|
| Login / Logout / Register | `APIView` or `@api_view` |
| Password Reset, Email Verify | `APIView` |
| Simple one-off test endpoint | `@api_view` |
| Full CRUD on a model (Products, Profiles) | `ModelViewSet` |
| Custom list with filters but no create/delete | `ReadOnlyModelViewSet` |
| Complex business logic with some CRUD | `APIView` with manual methods |

---

## Part 4: JWT Authentication Flow — In Depth

> JWT = JSON Web Token. It is a self-contained, signed string that proves who you are.

### What a JWT looks like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   ← Header (algorithm)
.eyJ1c2VyX2lkIjoxLCJleHAiOjE2OTk5OTl9   ← Payload (your data)
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature (tamper-proof)
```
These three parts are joined by `.` and are base64-encoded (NOT encrypted).

---

### The Full JWT Flow Diagram

```
CLIENT (Flutter App)                       SERVER (Django)
─────────────────────────────────────────────────────────
1. POST /api/login/
   { email, password }          ──────────►  Authenticates user in DB
                                             If valid, generates:
                                             • ACCESS TOKEN  (expires in 60 min)
                                             • REFRESH TOKEN (expires in 1 day)
                                ◄──────────  Returns { access, refresh, user }

2. Store both tokens on device (e.g., SharedPreferences in Flutter)

3. GET /api/profile/
   Authorization: Bearer <access_token>  ──►  Decodes the JWT
                                              Checks: Is it expired?
                                              Checks: Is the signature valid?
                                              Gets user_id from the token payload
                                ◄──────────  Returns user data (NO DB lookup needed!)

4. Access Token expires after 60 min...

5. POST /api/token/refresh/
   { refresh: <refresh_token> } ──────────►  Validates the refresh token
                                             Generates a NEW access token
                                ◄──────────  Returns { access: <new_access_token> }

6. If refresh token also expires → Force logout → Redirect to login screen
```

---

### Step-by-Step Code Walkthrough

#### Step 1: User Logs In (Your `LoginView`)

Your current `LoginView` uses the OLD `Token` auth (DRF's default tokens stored in DB). Since your `settings.py` is configured for JWT, it should use `RefreshToken`. Here is the corrected version:

```python
# views.py — CORRECT JWT Login
from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(email=email, password=password)

        if not user:
            return Response({'message': 'Invalid credentials'}, status=401)

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)   # Creates tokens for this user

        return Response({
            'access':  str(refresh.access_token),  # Short-lived, use for API calls
            'refresh': str(refresh),               # Long-lived, use to get new access
            'user': UserSerializer(user).data
        })
```

#### Step 2: What's Inside the JWT Payload?
When `RefreshToken.for_user(user)` runs, it creates a token with this payload baked in:
```json
{
  "token_type": "access",
  "exp": 1746123456,       ← Expiry timestamp
  "iat": 1746119856,       ← Issued at
  "jti": "abc123...",      ← Unique token ID
  "user_id": "uuid-here"   ← Your user's PK
}
```
No password, no email — just the ID and expiry. The server uses `user_id` to fetch the user on every request.

#### Step 3: Flutter Sends a Protected Request
```dart
// Flutter code
final response = await http.get(
  Uri.parse('http://10.20.105.38:8056/api/profile/'),
  headers: {
    'Authorization': 'Bearer $accessToken',  // ← The access token here
    'Content-Type': 'application/json',
  },
);
```

#### Step 4: Django Verifies It Automatically
Because you set this in `settings.py`:
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}
```
Django automatically:
1. Reads the `Authorization: Bearer <token>` header.
2. Decodes the JWT and validates the signature.
3. Checks if it's expired.
4. Fetches the user from DB using the `user_id` in the payload.
5. Makes the user available as `request.user` in your view.

#### Step 5: Protecting a View with JWT
```python
from rest_framework.permissions import IsAuthenticated

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]  # ← This is all you need!

    def get(self, request):
        # If we reach here, request.user is already verified and populated
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
```

#### Step 6: Refreshing the Access Token
This is already wired up in your `urls.py` via:
```python
from rest_framework_simplejwt.views import TokenRefreshView
path('token/refresh/', TokenRefreshView.as_view())
```
Flutter sends `POST /api/token/refresh/` with `{ "refresh": "<token>" }` to get a new access token without making the user log in again.

---

## Part 5: Summary — Your Current Code vs Best Practice

| Thing | Your Current Code | Correct / Better |
|---|---|---|
| `LoginView` token | Uses old `Token` model | Use `RefreshToken.for_user(user)` |
| `RegisterSerializer` | ✅ Correct | ✅ Good |
| `UserSerializer` | ✅ Correct | ✅ Good |
| `APIView` for auth | ✅ Correct choice | ✅ Right tool |
| Browsable API "content" box | Due to `APIView` | Expected — use Postman instead |
| Standard CRUD (if needed) | Not yet written | Use `ModelViewSet` + `Router` |

> [!TIP]
> For testing your API during development, **use Postman** instead of the Browsable API. It gives you individual fields, saves your tokens, and is much more powerful. The browsable API single "content" box is not a bug — it is just how `APIView` works.

> [!IMPORTANT]
> Your `LoginView` on line 87 uses `Token.objects.get_or_create(user=user)` which is the **old DRF Token Auth**, not JWT. You must fix this to use `RefreshToken.for_user(user)` from `rest_framework_simplejwt` to stay consistent with your `settings.py` configuration.
