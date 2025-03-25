from django.shortcuts import render
from django.http import JsonResponse
import random

def home(request):
    return render(request, 'home.html')

def generate_weather():
    temperature = random.randint(-30,50)
    wind = random.randint(0,100)
    uv = random.randint(0,11)

    conditions = ["sunny", "cloud", "rainy", "partly_cloudy_day", "thunderstorm"]

    condition = random.choice(conditions)
    conditionLater = random.choice(conditions)
    

    return {"temperature": temperature, "wind": wind, "uv": uv, "condition": condition, "conditionLater": conditionLater}

def weather(request):
    weather = generate_weather()
    return JsonResponse(weather) 
