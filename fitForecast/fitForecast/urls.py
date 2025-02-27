from django.contrib import admin
from django.urls import path
from main import views  # Import the views from your app

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),  # Add this line
]
