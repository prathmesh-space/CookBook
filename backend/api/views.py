from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import google.generativeai as genai

@api_view(['POST'])
def generate_recipe(request):
    """
    Takes a list of ingredients from the React frontend and calls the Gemini API
    securely from the Django backend.
    """
    ingredients = request.data.get('ingredients', [])
    if not ingredients:
        return Response({'error': 'Please provide a list of ingredients.'}, status=400)
    
    # Configure Gemini using the key from settings (which pulls from env variables)
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = f"Create a creative, delicious recipe using the following ingredients: {', '.join(ingredients)}. Include a title, prep time, and step-by-step instructions."
    
    try:
        response = model.generate_content(prompt)
        return Response({'recipe': response.text})
    except Exception as e:
        return Response({'error': str(e)}, status=500)
