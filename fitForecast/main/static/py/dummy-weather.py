import random
from django.http import JsonResponse

# Chatgpt was used to understand how to create django Json responses

def generate_weather():
    temperature = random.randint(-30,50)
    wind = random.randint(0,100)
    uv = random.randint(0,11)
    return {"temperature": temperature, "wind": wind, "uv": uv}

def weather(request):
    weather = generate_weather()
    return JsonResponse(weather) 
