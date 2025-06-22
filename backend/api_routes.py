from fastapi import APIRouter, HTTPException, Depends
from models import *
from database import Database
from services import MockAPIService, NotificationService, AnalyticsService
from motor.motor_asyncio import AsyncIOMotorClient
import os
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)

# Database dependency
async def get_database() -> Database:
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db_name = os.environ.get('DB_NAME', 'nutritionist_app')
    return Database(client, db_name)

router = APIRouter()

# User Profile endpoints
@router.post("/users/profile", response_model=UserProfile)
async def create_user_profile(
    profile_data: UserProfileCreate,
    db: Database = Depends(get_database)
):
    try:
        profile = await db.create_user_profile(profile_data)
        
        # Initialize default achievements for new user
        default_achievements = [
            {"title": "Welcome!", "description": "Created your first profile", "earned": True, "progress": 100, "max_progress": 100},
            {"title": "7-Day Streak", "description": "Log meals for 7 consecutive days", "earned": False, "progress": 0, "max_progress": 7},
            {"title": "Recipe Master", "description": "Try 10 different recipes", "earned": False, "progress": 0, "max_progress": 10},
            {"title": "Healthy Choices", "description": "Scan 50 healthy products", "earned": False, "progress": 0, "max_progress": 50},
        ]
        
        for achievement_data in default_achievements:
            achievement = Achievement(user_id=profile.id, **achievement_data)
            await db.achievements.insert_one(achievement.dict())
        
        return profile
    except Exception as e:
        logger.error(f"Error creating user profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to create user profile")

@router.get("/users/profile/{profile_id}", response_model=UserProfile)
async def get_user_profile(
    profile_id: str,
    db: Database = Depends(get_database)
):
    profile = await db.get_user_profile(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")
    return profile

@router.put("/users/profile/{profile_id}", response_model=UserProfile)
async def update_user_profile(
    profile_id: str,
    update_data: UserProfileUpdate,
    db: Database = Depends(get_database)
):
    profile = await db.update_user_profile(profile_id, update_data)
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")
    return profile

# User Settings endpoints
@router.post("/users/{user_id}/settings", response_model=UserSettings)
async def create_user_settings(
    user_id: str,
    settings_data: UserSettingsCreate,
    db: Database = Depends(get_database)
):
    try:
        settings = await db.create_user_settings(user_id, settings_data)
        return settings
    except Exception as e:
        logger.error(f"Error creating user settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to create user settings")

@router.get("/users/{user_id}/settings", response_model=UserSettings)
async def get_user_settings(
    user_id: str,
    db: Database = Depends(get_database)
):
    settings = await db.get_user_settings(user_id)
    if not settings:
        raise HTTPException(status_code=404, detail="User settings not found")
    return settings

@router.put("/users/{user_id}/settings", response_model=UserSettings)
async def update_user_settings(
    user_id: str,
    update_data: UserSettingsUpdate,
    db: Database = Depends(get_database)
):
    settings = await db.update_user_settings(user_id, update_data)
    if not settings:
        raise HTTPException(status_code=404, detail="User settings not found")
    return settings

# Product scanning endpoints
@router.post("/products/scan", response_model=Dict[str, Any])
async def scan_product(
    scan_request: ProductScanRequest,
    db: Database = Depends(get_database)
):
    try:
        # Use mock service for now
        result = await MockAPIService.scan_product(
            scan_request.image_base64, 
            scan_request.barcode
        )
        
        if result["success"]:
            # Save scanned product to database
            product_data = result["product"]
            product_data["scanned_by"] = scan_request.user_id
            
            # Convert expiry_date string to datetime if present
            if "expiry_date" in product_data and product_data["expiry_date"]:
                product_data["expiry_date"] = datetime.fromisoformat(product_data["expiry_date"].replace("Z", "+00:00"))
            
            product = await db.create_product(product_data)
            
            return {"success": True, "product": product.dict()}
        else:
            raise HTTPException(status_code=400, detail="Failed to scan product")
            
    except Exception as e:
        logger.error(f"Error scanning product: {e}")
        raise HTTPException(status_code=500, detail="Failed to scan product")

@router.get("/products/user/{user_id}", response_model=List[Product])
async def get_user_products(
    user_id: str,
    limit: int = 100,
    db: Database = Depends(get_database)
):
    try:
        products = await db.get_products_by_user(user_id, limit)
        return products
    except Exception as e:
        logger.error(f"Error getting user products: {e}")
        raise HTTPException(status_code=500, detail="Failed to get user products")

# Recipe endpoints
@router.post("/recipes/generate", response_model=Dict[str, Any])
async def generate_recipes(
    recipe_request: RecipeGenerateRequest,
    db: Database = Depends(get_database)
):
    try:
        preferences = {
            "cuisine_type": recipe_request.cuisine_type,
            "difficulty": recipe_request.difficulty,
            "dietary_restrictions": recipe_request.dietary_restrictions
        }
        
        result = await MockAPIService.generate_recipes(
            recipe_request.ingredients, 
            preferences
        )
        
        if result["success"]:
            # Save generated recipes to database
            saved_recipes = []
            for recipe_data in result["recipes"]:
                recipe_data["created_by"] = recipe_request.user_id
                recipe = await db.create_recipe(recipe_data)
                saved_recipes.append(recipe.dict())
            
            return {"success": True, "recipes": saved_recipes}
        else:
            raise HTTPException(status_code=400, detail="Failed to generate recipes")
            
    except Exception as e:
        logger.error(f"Error generating recipes: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate recipes")

@router.get("/recipes/user/{user_id}", response_model=List[Recipe])
async def get_user_recipes(
    user_id: str,
    limit: int = 50,
    db: Database = Depends(get_database)
):
    try:
        recipes = await db.get_recipes_by_user(user_id, limit)
        return recipes
    except Exception as e:
        logger.error(f"Error getting user recipes: {e}")
        raise HTTPException(status_code=500, detail="Failed to get user recipes")

# Shopping list endpoints
@router.post("/shopping-list", response_model=ShoppingList)
async def create_shopping_list(
    shopping_data: ShoppingListCreate,
    db: Database = Depends(get_database)
):
    try:
        shopping_list = await db.create_shopping_list(shopping_data)
        return shopping_list
    except Exception as e:
        logger.error(f"Error creating shopping list: {e}")
        raise HTTPException(status_code=500, detail="Failed to create shopping list")

@router.get("/shopping-list/user/{user_id}", response_model=Optional[ShoppingList])
async def get_user_shopping_list(
    user_id: str,
    db: Database = Depends(get_database)
):
    try:
        shopping_list = await db.get_user_shopping_list(user_id)
        return shopping_list
    except Exception as e:
        logger.error(f"Error getting shopping list: {e}")
        raise HTTPException(status_code=500, detail="Failed to get shopping list")

@router.put("/shopping-list/{list_id}", response_model=ShoppingList)
async def update_shopping_list(
    list_id: str,
    update_data: ShoppingListUpdate,
    db: Database = Depends(get_database)
):
    try:
        shopping_list = await db.update_shopping_list(list_id, update_data)
        if not shopping_list:
            raise HTTPException(status_code=404, detail="Shopping list not found")
        return shopping_list
    except Exception as e:
        logger.error(f"Error updating shopping list: {e}")
        raise HTTPException(status_code=500, detail="Failed to update shopping list")

# Inventory endpoints
@router.post("/inventory", response_model=InventoryItem)
async def create_inventory_item(
    item_data: InventoryItemCreate,
    db: Database = Depends(get_database)
):
    try:
        item = await db.create_inventory_item(item_data)
        return item
    except Exception as e:
        logger.error(f"Error creating inventory item: {e}")
        raise HTTPException(status_code=500, detail="Failed to create inventory item")

@router.get("/inventory/user/{user_id}", response_model=List[InventoryItem])
async def get_user_inventory(
    user_id: str,
    db: Database = Depends(get_database)
):
    try:
        inventory = await db.get_user_inventory(user_id)
        return inventory
    except Exception as e:
        logger.error(f"Error getting user inventory: {e}")
        raise HTTPException(status_code=500, detail="Failed to get user inventory")

@router.put("/inventory/{item_id}", response_model=InventoryItem)
async def update_inventory_item(
    item_id: str,
    update_data: InventoryItemUpdate,
    db: Database = Depends(get_database)
):
    try:
        item = await db.update_inventory_item(item_id, update_data)
        if not item:
            raise HTTPException(status_code=404, detail="Inventory item not found")
        return item
    except Exception as e:
        logger.error(f"Error updating inventory item: {e}")
        raise HTTPException(status_code=500, detail="Failed to update inventory item")

@router.delete("/inventory/{item_id}")
async def delete_inventory_item(
    item_id: str,
    db: Database = Depends(get_database)
):
    try:
        success = await db.delete_inventory_item(item_id)
        if not success:
            raise HTTPException(status_code=404, detail="Inventory item not found")
        return {"success": True}
    except Exception as e:
        logger.error(f"Error deleting inventory item: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete inventory item")

@router.post("/inventory/scan-receipt", response_model=ReceiptScanResponse)
async def scan_receipt(
    scan_request: ReceiptScanRequest,
    db: Database = Depends(get_database)
):
    try:
        result = await MockAPIService.scan_receipt(scan_request.image_base64)
        
        if result["success"]:
            # Add scanned items to inventory
            for item_data in result["items"]:
                inventory_item = InventoryItemCreate(
                    user_id=scan_request.user_id,
                    name=item_data["name"],
                    quantity=item_data["quantity"],
                    unit="pieces",
                    expiry=datetime.utcnow() + timedelta(days=7),  # Default 7 days
                    category="Produce",  # Default category
                    added_from_receipt=True
                )
                await db.create_inventory_item(inventory_item)
            
            return ReceiptScanResponse(**result)
        else:
            raise HTTPException(status_code=400, detail="Failed to scan receipt")
            
    except Exception as e:
        logger.error(f"Error scanning receipt: {e}")
        raise HTTPException(status_code=500, detail="Failed to scan receipt")

@router.get("/inventory/user/{user_id}/alerts")
async def get_inventory_alerts(
    user_id: str,
    db: Database = Depends(get_database)
):
    try:
        inventory = await db.get_user_inventory(user_id)
        inventory_dicts = [item.dict() for item in inventory]
        
        expiring_items = await NotificationService.check_expiring_items(inventory_dicts)
        low_stock_items = await NotificationService.check_low_stock(inventory_dicts)
        
        return {
            "expiring_items": expiring_items,
            "low_stock_items": low_stock_items
        }
    except Exception as e:
        logger.error(f"Error getting inventory alerts: {e}")
        raise HTTPException(status_code=500, detail="Failed to get inventory alerts")

# Chat endpoints
@router.post("/chat/message", response_model=ChatMessage)
async def send_chat_message(
    message_data: ChatMessageCreate,
    db: Database = Depends(get_database)
):
    try:
        # Save user message
        user_message = await db.create_chat_message(message_data, MessageType.USER)
        
        # Get AI response
        user_profile = await db.get_user_profile(message_data.user_id)
        profile_dict = user_profile.dict() if user_profile else None
        
        ai_response_text = await MockAPIService.get_ai_response(
            message_data.message, 
            profile_dict
        )
        
        # Save AI response
        ai_message_data = ChatMessageCreate(
            user_id=message_data.user_id,
            session_id=message_data.session_id,
            message=ai_response_text
        )
        ai_message = await db.create_chat_message(ai_message_data, MessageType.AI)
        
        return ai_message
    except Exception as e:
        logger.error(f"Error sending chat message: {e}")
        raise HTTPException(status_code=500, detail="Failed to send chat message")

@router.get("/chat/history/{user_id}/{session_id}", response_model=List[ChatMessage])
async def get_chat_history(
    user_id: str,
    session_id: str,
    limit: int = 50,
    db: Database = Depends(get_database)
):
    try:
        messages = await db.get_chat_history(user_id, session_id, limit)
        return messages
    except Exception as e:
        logger.error(f"Error getting chat history: {e}")
        raise HTTPException(status_code=500, detail="Failed to get chat history")

# Community endpoints
@router.post("/community/posts", response_model=CommunityPost)
async def create_community_post(
    post_data: CommunityPostCreate,
    db: Database = Depends(get_database)
):
    try:
        post = await db.create_community_post(post_data)
        return post
    except Exception as e:
        logger.error(f"Error creating community post: {e}")
        raise HTTPException(status_code=500, detail="Failed to create community post")

@router.get("/community/posts", response_model=List[CommunityPost])
async def get_community_posts(
    limit: int = 50,
    tag_filter: Optional[str] = None,
    db: Database = Depends(get_database)
):
    try:
        posts = await db.get_community_posts(limit, tag_filter)
        return posts
    except Exception as e:
        logger.error(f"Error getting community posts: {e}")
        raise HTTPException(status_code=500, detail="Failed to get community posts")

@router.post("/community/posts/{post_id}/like")
async def like_community_post(
    post_id: str,
    user_id: str,
    db: Database = Depends(get_database)
):
    try:
        success = await db.like_post(post_id, user_id)
        if not success:
            raise HTTPException(status_code=404, detail="Post not found")
        return {"success": True}
    except Exception as e:
        logger.error(f"Error liking post: {e}")
        raise HTTPException(status_code=500, detail="Failed to like post")

# Analytics endpoints
@router.get("/analytics/user/{user_id}/summary")
async def get_user_analytics(
    user_id: str,
    days: int = 7,
    db: Database = Depends(get_database)
):
    try:
        user_profile = await db.get_user_profile(user_id)
        user_products = await db.get_products_by_user(user_id)
        
        profile_dict = user_profile.dict() if user_profile else {}
        products_dict = [product.dict() for product in user_products]
        
        nutrition_summary = await AnalyticsService.calculate_nutrition_summary(products_dict, days)
        insights = await AnalyticsService.generate_insights(profile_dict, nutrition_summary)
        
        return {
            "nutrition_summary": nutrition_summary,
            "insights": insights,
            "profile": profile_dict
        }
    except Exception as e:
        logger.error(f"Error getting user analytics: {e}")
        raise HTTPException(status_code=500, detail="Failed to get user analytics")