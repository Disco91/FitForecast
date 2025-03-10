from django.shortcuts import render
from django.http import JsonResponse
import random

def home(request):
    return render(request, 'home.html')

def generate_weather():
    temperature = random.randint(-30,50)
    wind = random.randint(0,100)
    uv = random.randint(0,11)
    return {"temperature": temperature, "wind": wind, "uv": uv}

def weather(request):
    weather = generate_weather()
    return JsonResponse(weather) 
