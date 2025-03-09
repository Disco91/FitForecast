from django.contrib import admin
from django.urls import path
from main import views  # Import the views from your app

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),  # Ensure this is the homepage URL
    path('weather/', views.weather, name='weather'), # store random weather data
]
