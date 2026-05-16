import os
import json
import google.generativeai as genai
from django.conf import settings
# Make sure you set GEMINI_API_KEY in your settings or .env file
# genai.configure(api_key=settings.GEMINI_API_KEY)
def calculate_junk_score(calories, protein, carbs, fat, detected_items):
    """
    Calculates a simple junk score from 0 to 100.
    100 = Extremely healthy, 0 = Pure junk.
    This is a basic heuristic; you can adjust the formula.
    """
    if calories == 0:
        return 0
    
    # Calculate percentage of calories from each macro (approximate)
    protein_cals = float(protein) * 4
    fat_cals = float(fat) * 9
    
    protein_pct = protein_cals / float(calories)
    fat_pct = fat_cals / float(calories)
    
    # Base score
    score = 50
    
    # High protein is generally good in fitness apps
    if protein_pct > 0.3:
        score += 20
    
    # Very high fat might indicate junk food (unless Keto)
    if fat_pct > 0.5:
        score -= 20
        
    # Example item-based heuristics
    junk_keywords = ['burger', 'fries', 'pizza', 'soda', 'candy', 'chips', 'fried']
    detected_lower = str(detected_items).lower()
    for word in junk_keywords:
        if word in detected_lower:
            score -= 15
            
    # Ensure score stays between 0 and 100
    return max(0, min(100, int(score)))
def analyze_meal_image_with_gemini(image_file):
    """
    Sends the image to Gemini and returns estimated macros and items.
    """
    try:
        # NOTE: If you are using PIL, you can pass a PIL Image directly to Gemini.
        # Otherwise, you might need to save the file temporarily or read its bytes.
        from PIL import Image
        img = Image.open(image_file)
        
        # Configure Gemini model (gemini-1.5-pro or gemini-1.5-flash)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = """
        Analyze this food image. Provide the output strictly in valid JSON format with no markdown formatting.
        The JSON should have the following keys:
        - "detected_items": A string summarizing what the food is.
        - "calories": An integer representing estimated total calories.
        - "protein_gm": A float representing estimated protein in grams.
        - "carbs_gm": A float representing estimated carbohydrates in grams.
        - "fat_gm": A float representing estimated fat in grams.
        - "ai_insights": A short sentence with a nutritional observation.
        """
        
        response = model.generate_content([prompt, img])
        
        # Clean the response text (sometimes Gemini wraps JSON in ```json ... ```)
        result_text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(result_text)
        
        # Calculate our custom junk score based on the AI's macro estimations
        data['junk_score'] = calculate_junk_score(
            calories=data.get('calories', 0),
            protein=data.get('protein_gm', 0),
            carbs=data.get('carbs_gm', 0),
            fat=data.get('fat_gm', 0),
            detected_items=data.get('detected_items', '')
        )
        
        return data
        
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return {
            "error": "Failed to analyze image with Gemini."
        }