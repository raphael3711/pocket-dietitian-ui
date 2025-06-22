from typing import List, Dict, Any, Optional
import base64
import random
from datetime import datetime, timedelta
import json

class MockAPIService:
    """Mock services to simulate external API calls until real integrations are added"""
    
    @staticmethod
    async def scan_product(image_base64: Optional[str] = None, barcode: Optional[str] = None) -> Dict[str, Any]:
        """Mock product scanning service"""
        # Simulate API delay
        import asyncio
        await asyncio.sleep(1.5)
        
        # Mock product data
        mock_products = [
            {
                "name": "Organic Greek Yogurt",
                "barcode": "1234567890123",
                "calories": 130,
                "protein": 15,
                "carbs": 9,
                "fat": 4,
                "fiber": 0,
                "sugar": 9,
                "freshness": "fresh",
                "expiry_date": (datetime.utcnow() + timedelta(days=7)).isoformat(),
                "image_base64": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f0f0f0'/><text x='50' y='50' text-anchor='middle' dy='.3em' font-family='Arial' font-size='12' fill='%23666'>Yogurt</text></svg>"
            },
            {
                "name": "Fresh Salmon Fillet",
                "barcode": "2345678901234",
                "calories": 208,
                "protein": 22,
                "carbs": 0,
                "fat": 12,
                "fiber": 0,
                "sugar": 0,
                "freshness": "fresh",
                "expiry_date": (datetime.utcnow() + timedelta(days=3)).isoformat(),
                "image_base64": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23ff9999'/><text x='50' y='50' text-anchor='middle' dy='.3em' font-family='Arial' font-size='12' fill='%23333'>Salmon</text></svg>"
            },
            {
                "name": "Organic Spinach",
                "barcode": "3456789012345",
                "calories": 23,
                "protein": 3,
                "carbs": 4,
                "fat": 0,
                "fiber": 2,
                "sugar": 0,
                "freshness": "aging",
                "expiry_date": (datetime.utcnow() + timedelta(days=2)).isoformat(),
                "image_base64": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%2390EE90'/><text x='50' y='50' text-anchor='middle' dy='.3em' font-family='Arial' font-size='10' fill='%23333'>Spinach</text></svg>"
            },
            {
                "name": "Whole Grain Bread",
                "barcode": "4567890123456",
                "calories": 247,
                "protein": 13,
                "carbs": 41,
                "fat": 4,
                "fiber": 7,
                "sugar": 6,
                "freshness": "fresh",
                "expiry_date": (datetime.utcnow() + timedelta(days=5)).isoformat(),
                "image_base64": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23DEB887'/><text x='50' y='50' text-anchor='middle' dy='.3em' font-family='Arial' font-size='12' fill='%23333'>Bread</text></svg>"
            }
        ]
        
        # Return random product
        product = random.choice(mock_products)
        return {"success": True, "product": product}
    
    @staticmethod
    async def generate_recipes(ingredients: List[str], preferences: Dict[str, Any]) -> Dict[str, Any]:
        """Mock recipe generation service"""
        import asyncio
        await asyncio.sleep(2.0)
        
        # Mock recipe data based on ingredients
        all_recipes = [
            {
                "title": "Mediterranean Salmon Bowl",
                "ingredients": ["Salmon Fillet", "Greek Yogurt", "Spinach", "Olive Oil", "Lemon"],
                "instructions": [
                    "Season salmon with salt and pepper",
                    "Pan-fry salmon for 4-5 minutes each side",
                    "Mix Greek yogurt with lemon juice",
                    "Serve over fresh spinach with yogurt sauce"
                ],
                "cook_time": 15,
                "servings": 2,
                "calories": 420,
                "difficulty": "Easy",
                "cuisine_type": "Mediterranean",
                "dietary_tags": ["High-Protein", "Low-Carb"],
                "image_base64": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'><rect width='200' height='150' fill='%23FFE4B5'/><text x='100' y='75' text-anchor='middle' dy='.3em' font-family='Arial' font-size='14' fill='%23333'>🐟 Salmon Bowl</text></svg>"
            },
            {
                "title": "Green Power Smoothie",
                "ingredients": ["Spinach", "Greek Yogurt", "Banana", "Honey", "Almond Milk"],
                "instructions": [
                    "Add all ingredients to blender",
                    "Blend until smooth",
                    "Add ice if desired",
                    "Serve immediately"
                ],
                "cook_time": 5,
                "servings": 1,
                "calories": 180,
                "difficulty": "Very Easy",
                "cuisine_type": "American",
                "dietary_tags": ["Vegetarian", "High-Protein"],
                "image_base64": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'><rect width='200' height='150' fill='%2390EE90'/><text x='100' y='75' text-anchor='middle' dy='.3em' font-family='Arial' font-size='14' fill='%23333'>🥤 Green Smoothie</text></svg>"
            },
            {
                "title": "Spinach and Yogurt Salad",
                "ingredients": ["Spinach", "Greek Yogurt", "Cucumber", "Olive Oil", "Lemon"],
                "instructions": [
                    "Wash and dry spinach leaves",
                    "Slice cucumber thinly",
                    "Mix yogurt with olive oil and lemon",
                    "Toss spinach and cucumber with dressing"
                ],
                "cook_time": 10,
                "servings": 2,
                "calories": 120,
                "difficulty": "Very Easy",
                "cuisine_type": "Mediterranean",
                "dietary_tags": ["Vegetarian", "Low-Calorie"],
                "image_base64": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'><rect width='200' height='150' fill='%2398FB98'/><text x='100' y='75' text-anchor='middle' dy='.3em' font-family='Arial' font-size='14' fill='%23333'>🥗 Fresh Salad</text></svg>"
            },
            {
                "title": "Whole Grain Toast with Yogurt",
                "ingredients": ["Whole Grain Bread", "Greek Yogurt", "Honey", "Berries"],
                "instructions": [
                    "Toast bread until golden brown",
                    "Spread Greek yogurt on toast",
                    "Drizzle with honey",
                    "Top with fresh berries"
                ],
                "cook_time": 5,
                "servings": 1,
                "calories": 280,
                "difficulty": "Very Easy",
                "cuisine_type": "American",
                "dietary_tags": ["Vegetarian", "High-Fiber"],
                "image_base64": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'><rect width='200' height='150' fill='%23F5DEB3'/><text x='100' y='75' text-anchor='middle' dy='.3em' font-family='Arial' font-size='14' fill='%23333'>🍞 Yogurt Toast</text></svg>"
            }
        ]
        
        # Filter recipes based on available ingredients
        matching_recipes = []
        for recipe in all_recipes:
            # Check if any of the user's ingredients match recipe ingredients
            recipe_ingredients_lower = [ing.lower() for ing in recipe["ingredients"]]
            user_ingredients_lower = [ing.lower() for ing in ingredients]
            
            if any(user_ing in recipe_ing for user_ing in user_ingredients_lower 
                   for recipe_ing in recipe_ingredients_lower):
                matching_recipes.append(recipe)
        
        # If no matches, return some recipes anyway
        if not matching_recipes:
            matching_recipes = random.sample(all_recipes, min(2, len(all_recipes)))
        
        return {"success": True, "recipes": matching_recipes}
    
    @staticmethod
    async def scan_receipt(image_base64: str) -> Dict[str, Any]:
        """Mock receipt scanning service"""
        import asyncio
        await asyncio.sleep(2.0)
        
        # Mock receipt items
        mock_items = [
            {"name": "Greek Yogurt", "quantity": 2, "price": 5.99},
            {"name": "Salmon Fillet", "quantity": 1, "price": 12.99},
            {"name": "Organic Spinach", "quantity": 1, "price": 3.49},
            {"name": "Whole Grain Bread", "quantity": 1, "price": 4.99},
            {"name": "Fresh Berries", "quantity": 1, "price": 6.99}
        ]
        
        # Return random subset of items
        selected_items = random.sample(mock_items, random.randint(2, len(mock_items)))
        total = sum(item["price"] for item in selected_items)
        
        return {
            "success": True,
            "items": selected_items,
            "total": round(total, 2)
        }
    
    @staticmethod
    async def get_ai_response(message: str, user_profile: Optional[Dict[str, Any]] = None) -> str:
        """Mock AI nutritionist response"""
        import asyncio
        await asyncio.sleep(1.0)
        
        # Context-aware responses based on keywords
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["breakfast", "morning", "eat"]):
            responses = [
                "For a healthy breakfast, I recommend starting with protein-rich foods like Greek yogurt with berries, or eggs with whole grain toast. This will help keep you full and energized throughout the morning!",
                "A balanced breakfast should include protein, healthy fats, and complex carbs. Try an omelet with vegetables, or oatmeal with nuts and fruit. What's your usual morning routine?",
                "Breakfast is crucial for metabolism! Consider protein smoothies, avocado toast with eggs, or Greek yogurt parfaits. Based on your profile, aim for around 400-500 calories."
            ]
        elif any(word in message_lower for word in ["calories", "calorie", "energy"]):
            responses = [
                "Your daily calorie needs depend on your activity level, age, and goals. Based on your profile, I'd recommend focusing on nutrient-dense foods rather than just counting calories.",
                "Quality matters more than quantity! Focus on whole foods, lean proteins, healthy fats, and complex carbohydrates. Your body will naturally regulate when you eat nutritious foods.",
                "Calorie needs vary daily based on activity. Listen to your hunger cues and focus on balanced meals with protein, vegetables, and healthy carbs."
            ]
        elif any(word in message_lower for word in ["protein", "muscle", "workout"]):
            responses = [
                "Protein is essential for muscle maintenance and recovery! Aim for 1.6-2.2g per kg of body weight. Great sources include lean meats, fish, eggs, Greek yogurt, and legumes.",
                "For muscle building, spread protein throughout the day. Include a protein source at each meal - chicken, fish, tofu, beans, or protein smoothies work great!",
                "Post-workout nutrition is key! Try to have protein within 30 minutes after exercise. Greek yogurt with berries or a protein smoothie are excellent options."
            ]
        elif any(word in message_lower for word in ["weight", "lose", "diet"]):
            responses = [
                "Sustainable weight management is about creating healthy habits, not restrictive diets. Focus on whole foods, regular meals, and staying hydrated. Small changes lead to big results!",
                "For healthy weight loss, aim for a moderate caloric deficit through nutritious foods and regular activity. Avoid extreme restrictions - they're not sustainable long-term.",
                "Weight loss is a journey, not a race! Focus on building healthy relationships with food, eating mindfully, and nourishing your body with quality nutrients."
            ]
        elif any(word in message_lower for word in ["recipe", "cook", "meal"]):
            responses = [
                "I love helping with meal ideas! What ingredients do you have available? I can suggest recipes based on your dietary preferences and cooking skill level.",
                "Cooking at home is one of the best ways to control your nutrition! Try batch cooking on weekends - prepare proteins, grains, and vegetables that you can mix and match during the week.",
                "Simple, nutritious meals are often the best! Focus on one protein, one vegetable, and one complex carb. Season with herbs and spices for flavor without excess calories."
            ]
        else:
            responses = [
                "That's a great question! Nutrition is very individual, and I'm here to help you find what works best for your lifestyle and goals. Could you tell me more about your specific situation?",
                "I'm here to support your health journey! Remember, sustainable changes are better than quick fixes. What specific aspect of nutrition would you like to focus on?",
                "Every small step toward better nutrition counts! Whether it's adding more vegetables, staying hydrated, or planning meals ahead - what feels most achievable for you right now?",
                "Nutrition science is constantly evolving, but the basics remain the same: eat a variety of whole foods, stay hydrated, and listen to your body. What questions do you have?",
                "I believe in making nutrition simple and enjoyable! Food should nourish both your body and soul. How can I help you create a healthier relationship with food?"
            ]
        
        return random.choice(responses)


class NotificationService:
    """Service for handling notifications and alerts"""
    
    @staticmethod
    async def check_expiring_items(user_inventory: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Check for items expiring soon"""
        expiring_items = []
        now = datetime.utcnow()
        
        for item in user_inventory:
            expiry = datetime.fromisoformat(item["expiry"].replace("Z", "+00:00"))
            days_until_expiry = (expiry - now).days
            
            if 0 <= days_until_expiry <= 3:
                expiring_items.append({
                    "item": item,
                    "days_until_expiry": days_until_expiry,
                    "alert_level": "urgent" if days_until_expiry <= 1 else "warning"
                })
        
        return expiring_items
    
    @staticmethod
    async def check_low_stock(user_inventory: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Check for low stock items"""
        low_stock_items = []
        
        for item in user_inventory:
            threshold = item.get("low_stock_threshold", 2)
            if item["quantity"] <= threshold:
                low_stock_items.append({
                    "item": item,
                    "current_quantity": item["quantity"],
                    "threshold": threshold
                })
        
        return low_stock_items


class AnalyticsService:
    """Service for user analytics and insights"""
    
    @staticmethod
    async def calculate_nutrition_summary(user_products: List[Dict[str, Any]], days: int = 7) -> Dict[str, Any]:
        """Calculate nutrition summary for recent scanned products"""
        if not user_products:
            return {"total_calories": 0, "avg_protein": 0, "avg_carbs": 0, "avg_fat": 0}
        
        # Filter products from last X days
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        recent_products = [
            product for product in user_products 
            if datetime.fromisoformat(product["created_at"].replace("Z", "+00:00")) >= cutoff_date
        ]
        
        if not recent_products:
            return {"total_calories": 0, "avg_protein": 0, "avg_carbs": 0, "avg_fat": 0}
        
        total_calories = sum(product["calories"] for product in recent_products)
        avg_protein = sum(product["protein"] for product in recent_products) / len(recent_products)
        avg_carbs = sum(product["carbs"] for product in recent_products) / len(recent_products)
        avg_fat = sum(product["fat"] for product in recent_products) / len(recent_products)
        
        return {
            "total_calories": total_calories,
            "avg_protein": round(avg_protein, 1),
            "avg_carbs": round(avg_carbs, 1),
            "avg_fat": round(avg_fat, 1),
            "products_scanned": len(recent_products),
            "period_days": days
        }
    
    @staticmethod
    async def generate_insights(user_profile: Dict[str, Any], nutrition_summary: Dict[str, Any]) -> List[str]:
        """Generate personalized nutrition insights"""
        insights = []
        
        # BMR-based insights
        if user_profile.get("bmr") and nutrition_summary.get("total_calories"):
            daily_avg = nutrition_summary["total_calories"] / nutrition_summary.get("period_days", 7)
            bmr = user_profile["bmr"]
            
            if daily_avg < bmr * 0.8:
                insights.append("You might be under-eating. Consider adding healthy, calorie-dense foods like nuts, avocados, or olive oil.")
            elif daily_avg > bmr * 1.3:
                insights.append("You're consuming more calories than needed. Focus on portion control and nutrient-dense foods.")
        
        # Protein insights
        if nutrition_summary.get("avg_protein", 0) < 15:
            insights.append("Try to increase your protein intake! Add Greek yogurt, lean meats, or legumes to your meals.")
        
        # Goal-based insights
        goals = user_profile.get("goals", [])
        if "Weight Loss" in goals:
            insights.append("For weight loss, focus on high-protein, high-fiber foods that keep you full longer.")
        if "Muscle Building" in goals:
            insights.append("Great choice for muscle building! Make sure to have protein within 30 minutes after workouts.")
        
        return insights if insights else ["You're doing great! Keep focusing on balanced, nutritious meals."]