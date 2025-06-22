from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class FreshnessStatus(str, Enum):
    FRESH = "fresh"
    AGING = "aging" 
    SPOILED = "spoiled"

class MessageType(str, Enum):
    USER = "user"
    AI = "ai"

class UserSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    language: str = "en"
    theme: Dict[str, str] = {"name": "Pure White", "value": "#FFFFFF", "text": "#000000"}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    age: Optional[int] = None
    weight: Optional[float] = None  # in kg
    height: Optional[float] = None  # in cm
    gender: Optional[str] = None
    activity_level: str = "moderate"
    dietary_preferences: List[str] = []
    health_conditions: List[str] = []
    allergies: List[str] = []
    goals: List[str] = []
    bmr: Optional[int] = None  # calculated basal metabolic rate
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    barcode: Optional[str] = None
    calories: float  # per 100g
    protein: float  # per 100g
    carbs: float  # per 100g
    fat: float  # per 100g
    fiber: float = 0  # per 100g
    sugar: float = 0  # per 100g
    freshness: FreshnessStatus = FreshnessStatus.FRESH
    expiry_date: Optional[datetime] = None
    image_url: Optional[str] = None
    image_base64: Optional[str] = None
    scanned_by: str  # user_id
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Recipe(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    ingredients: List[str]
    instructions: List[str]
    cook_time: int  # in minutes
    servings: int
    calories: int  # total calories
    difficulty: str
    cuisine_type: Optional[str] = None
    dietary_tags: List[str] = []
    image_url: Optional[str] = None
    image_base64: Optional[str] = None
    created_by: str  # user_id
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ShoppingItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    needed: int
    unit: str
    purchased: bool = False
    price: Optional[float] = None

class ShoppingList(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    items: List[ShoppingItem] = []
    selected_store: Optional[Dict[str, Any]] = None
    delivery_address: Optional[str] = None
    total_amount: Optional[float] = None
    order_status: str = "pending"  # pending, ordered, delivered
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class InventoryItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    quantity: float
    unit: str
    expiry: datetime
    category: str
    added_from_receipt: bool = False
    low_stock_threshold: int = 2
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_id: str
    message_type: MessageType
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class CommunityPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    author_id: str
    author_name: str
    author_avatar: str
    title: str
    content: str
    tags: List[str] = []
    likes: int = 0
    comments: int = 0
    liked_by: List[str] = []  # user_ids who liked this post
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Achievement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    description: str
    earned: bool = False
    progress: int = 0
    max_progress: int = 100
    earned_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Request/Response Models
class UserProfileCreate(BaseModel):
    name: str
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    gender: Optional[str] = None
    activity_level: str = "moderate"
    dietary_preferences: List[str] = []
    health_conditions: List[str] = []
    allergies: List[str] = []
    goals: List[str] = []

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    gender: Optional[str] = None
    activity_level: Optional[str] = None
    dietary_preferences: Optional[List[str]] = None
    health_conditions: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    goals: Optional[List[str]] = None

class UserSettingsCreate(BaseModel):
    language: str = "en"
    theme: Dict[str, str] = {"name": "Pure White", "value": "#FFFFFF", "text": "#000000"}

class UserSettingsUpdate(BaseModel):
    language: Optional[str] = None
    theme: Optional[Dict[str, str]] = None

class ProductScanRequest(BaseModel):
    image_base64: Optional[str] = None
    barcode: Optional[str] = None
    user_id: str

class RecipeGenerateRequest(BaseModel):
    ingredients: List[str]
    user_id: str
    cuisine_type: Optional[str] = None
    difficulty: Optional[str] = None
    dietary_restrictions: List[str] = []

class ChatMessageCreate(BaseModel):
    user_id: str
    session_id: str
    message: str

class CommunityPostCreate(BaseModel):
    author_id: str
    author_name: str
    author_avatar: str = "👤"
    title: str
    content: str
    tags: List[str] = []

class CommunityPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None

class InventoryItemCreate(BaseModel):
    user_id: str
    name: str
    quantity: float
    unit: str
    expiry: datetime
    category: str
    added_from_receipt: bool = False

class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    expiry: Optional[datetime] = None
    category: Optional[str] = None

class ShoppingItemCreate(BaseModel):
    name: str
    category: str
    needed: int
    unit: str

class ShoppingListCreate(BaseModel):
    user_id: str
    items: List[ShoppingItemCreate] = []

class ShoppingListUpdate(BaseModel):
    items: Optional[List[ShoppingItem]] = None
    selected_store: Optional[Dict[str, Any]] = None
    delivery_address: Optional[str] = None
    total_amount: Optional[float] = None
    order_status: Optional[str] = None

class ReceiptScanRequest(BaseModel):
    user_id: str
    image_base64: str

class ReceiptScanResponse(BaseModel):
    success: bool
    items: List[Dict[str, Any]]
    total: float