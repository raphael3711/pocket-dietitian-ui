from motor.motor_asyncio import AsyncIOMotorClient
from models import *
import os
from typing import List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class Database:
    def __init__(self, client: AsyncIOMotorClient, db_name: str):
        self.client = client
        self.db = client[db_name]
        
        # Collections
        self.user_profiles = self.db.user_profiles
        self.user_settings = self.db.user_settings
        self.products = self.db.products
        self.recipes = self.db.recipes
        self.shopping_lists = self.db.shopping_lists
        self.inventory_items = self.db.inventory_items
        self.chat_messages = self.db.chat_messages
        self.community_posts = self.db.community_posts
        self.achievements = self.db.achievements

    # User Profile operations
    async def create_user_profile(self, profile_data: UserProfileCreate) -> UserProfile:
        # Calculate BMR if we have the required data
        bmr = None
        if profile_data.weight and profile_data.height and profile_data.age and profile_data.gender:
            bmr = self._calculate_bmr(
                profile_data.weight, 
                profile_data.height, 
                profile_data.age, 
                profile_data.gender,
                profile_data.activity_level
            )
        
        profile = UserProfile(**profile_data.dict(), bmr=bmr)
        await self.user_profiles.insert_one(profile.dict())
        return profile

    async def get_user_profile(self, profile_id: str) -> Optional[UserProfile]:
        profile_data = await self.user_profiles.find_one({"id": profile_id})
        return UserProfile(**profile_data) if profile_data else None

    async def update_user_profile(self, profile_id: str, update_data: UserProfileUpdate) -> Optional[UserProfile]:
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        update_dict["updated_at"] = datetime.utcnow()
        
        result = await self.user_profiles.update_one(
            {"id": profile_id}, 
            {"$set": update_dict}
        )
        
        if result.modified_count:
            return await self.get_user_profile(profile_id)
        return None

    async def delete_user_profile(self, profile_id: str) -> bool:
        result = await self.user_profiles.delete_one({"id": profile_id})
        return result.deleted_count > 0

    # User Settings operations
    async def create_user_settings(self, user_id: str, settings_data: UserSettingsCreate) -> UserSettings:
        settings = UserSettings(user_id=user_id, **settings_data.dict())
        await self.user_settings.insert_one(settings.dict())
        return settings

    async def get_user_settings(self, user_id: str) -> Optional[UserSettings]:
        settings_data = await self.user_settings.find_one({"user_id": user_id})
        return UserSettings(**settings_data) if settings_data else None

    async def update_user_settings(self, user_id: str, update_data: UserSettingsUpdate) -> Optional[UserSettings]:
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        update_dict["updated_at"] = datetime.utcnow()
        
        result = await self.user_settings.update_one(
            {"user_id": user_id}, 
            {"$set": update_dict}
        )
        
        if result.modified_count:
            return await self.get_user_settings(user_id)
        return None

    # Product operations
    async def create_product(self, product_data: dict) -> Product:
        product = Product(**product_data)
        await self.products.insert_one(product.dict())
        return product

    async def get_products_by_user(self, user_id: str, limit: int = 100) -> List[Product]:
        cursor = self.products.find({"scanned_by": user_id}).sort("created_at", -1).limit(limit)
        products = await cursor.to_list(length=limit)
        return [Product(**product) for product in products]

    async def get_product(self, product_id: str) -> Optional[Product]:
        product_data = await self.products.find_one({"id": product_id})
        return Product(**product_data) if product_data else None

    # Recipe operations
    async def create_recipe(self, recipe_data: dict) -> Recipe:
        recipe = Recipe(**recipe_data)
        await self.recipes.insert_one(recipe.dict())
        return recipe

    async def get_recipes_by_user(self, user_id: str, limit: int = 50) -> List[Recipe]:
        cursor = self.recipes.find({"created_by": user_id}).sort("created_at", -1).limit(limit)
        recipes = await cursor.to_list(length=limit)
        return [Recipe(**recipe) for recipe in recipes]

    async def get_recipe(self, recipe_id: str) -> Optional[Recipe]:
        recipe_data = await self.recipes.find_one({"id": recipe_id})
        return Recipe(**recipe_data) if recipe_data else None

    # Shopping List operations
    async def create_shopping_list(self, shopping_data: ShoppingListCreate) -> ShoppingList:
        shopping_list = ShoppingList(**shopping_data.dict())
        await self.shopping_lists.insert_one(shopping_list.dict())
        return shopping_list

    async def get_user_shopping_list(self, user_id: str) -> Optional[ShoppingList]:
        # Get the most recent shopping list for the user
        shopping_data = await self.shopping_lists.find_one(
            {"user_id": user_id}, 
            sort=[("created_at", -1)]
        )
        return ShoppingList(**shopping_data) if shopping_data else None

    async def update_shopping_list(self, list_id: str, update_data: ShoppingListUpdate) -> Optional[ShoppingList]:
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        update_dict["updated_at"] = datetime.utcnow()
        
        result = await self.shopping_lists.update_one(
            {"id": list_id}, 
            {"$set": update_dict}
        )
        
        if result.modified_count:
            shopping_data = await self.shopping_lists.find_one({"id": list_id})
            return ShoppingList(**shopping_data) if shopping_data else None
        return None

    # Inventory operations
    async def create_inventory_item(self, item_data: InventoryItemCreate) -> InventoryItem:
        item = InventoryItem(**item_data.dict())
        await self.inventory_items.insert_one(item.dict())
        return item

    async def get_user_inventory(self, user_id: str) -> List[InventoryItem]:
        cursor = self.inventory_items.find({"user_id": user_id}).sort("created_at", -1)
        items = await cursor.to_list(length=None)
        return [InventoryItem(**item) for item in items]

    async def update_inventory_item(self, item_id: str, update_data: InventoryItemUpdate) -> Optional[InventoryItem]:
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        update_dict["updated_at"] = datetime.utcnow()
        
        result = await self.inventory_items.update_one(
            {"id": item_id}, 
            {"$set": update_dict}
        )
        
        if result.modified_count:
            item_data = await self.inventory_items.find_one({"id": item_id})
            return InventoryItem(**item_data) if item_data else None
        return None

    async def delete_inventory_item(self, item_id: str) -> bool:
        result = await self.inventory_items.delete_one({"id": item_id})
        return result.deleted_count > 0

    async def get_expiring_items(self, user_id: str, days_ahead: int = 3) -> List[InventoryItem]:
        from datetime import timedelta
        cutoff_date = datetime.utcnow() + timedelta(days=days_ahead)
        
        cursor = self.inventory_items.find({
            "user_id": user_id,
            "expiry": {"$lte": cutoff_date, "$gte": datetime.utcnow()}
        }).sort("expiry", 1)
        
        items = await cursor.to_list(length=None)
        return [InventoryItem(**item) for item in items]

    async def get_low_stock_items(self, user_id: str) -> List[InventoryItem]:
        cursor = self.inventory_items.find({
            "user_id": user_id,
            "$expr": {"$lte": ["$quantity", "$low_stock_threshold"]}
        })
        
        items = await cursor.to_list(length=None)
        return [InventoryItem(**item) for item in items]

    # Chat operations
    async def create_chat_message(self, message_data: ChatMessageCreate, message_type: MessageType) -> ChatMessage:
        message = ChatMessage(
            message_type=message_type,
            **message_data.dict()
        )
        await self.chat_messages.insert_one(message.dict())
        return message

    async def get_chat_history(self, user_id: str, session_id: str, limit: int = 50) -> List[ChatMessage]:
        cursor = self.chat_messages.find({
            "user_id": user_id, 
            "session_id": session_id
        }).sort("timestamp", 1).limit(limit)
        
        messages = await cursor.to_list(length=limit)
        return [ChatMessage(**message) for message in messages]

    # Community operations
    async def create_community_post(self, post_data: CommunityPostCreate) -> CommunityPost:
        post = CommunityPost(**post_data.dict())
        await self.community_posts.insert_one(post.dict())
        return post

    async def get_community_posts(self, limit: int = 50, tag_filter: Optional[str] = None) -> List[CommunityPost]:
        query = {}
        if tag_filter:
            query["tags"] = tag_filter
            
        cursor = self.community_posts.find(query).sort("created_at", -1).limit(limit)
        posts = await cursor.to_list(length=limit)
        return [CommunityPost(**post) for post in posts]

    async def like_post(self, post_id: str, user_id: str) -> bool:
        # Check if user already liked the post
        post = await self.community_posts.find_one({"id": post_id})
        if not post:
            return False
            
        liked_by = post.get("liked_by", [])
        
        if user_id in liked_by:
            # Unlike the post
            result = await self.community_posts.update_one(
                {"id": post_id},
                {
                    "$pull": {"liked_by": user_id},
                    "$inc": {"likes": -1}
                }
            )
        else:
            # Like the post
            result = await self.community_posts.update_one(
                {"id": post_id},
                {
                    "$addToSet": {"liked_by": user_id},
                    "$inc": {"likes": 1}
                }
            )
        
        return result.modified_count > 0

    # Utility methods
    def _calculate_bmr(self, weight: float, height: float, age: int, gender: str, activity_level: str) -> int:
        """Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation"""
        if gender.lower() == "male":
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        else:
            bmr = 10 * weight + 6.25 * height - 5 * age - 161
        
        # Apply activity multiplier
        activity_multipliers = {
            "sedentary": 1.2,
            "light": 1.375,
            "moderate": 1.55,
            "active": 1.725,
            "very_active": 1.9
        }
        
        multiplier = activity_multipliers.get(activity_level, 1.55)
        return int(bmr * multiplier)