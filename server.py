from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class Theme(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    os_type: str
    category: str  # "desktop" or "boot"
    image_url: str
    description: str
    version: Optional[str] = None
    tags: List[str] = []
    is_favorite: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Favorite(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    theme_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CustomizationSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    accent_color: str = "#007AFF"
    icon_theme: str = "default"
    font_family: str = "default"
    font_size: int = 11
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ApplyThemeRequest(BaseModel):
    theme_id: str

class CustomizationUpdate(BaseModel):
    accent_color: Optional[str] = None
    icon_theme: Optional[str] = None
    font_family: Optional[str] = None
    font_size: Optional[int] = None

class AppliedTheme(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    theme_id: str
    theme_name: str
    category: str
    status: str = "applied"
    applied_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Initialize default themes
async def initialize_themes():
    count = await db.themes.count_documents({})
    if count == 0:
        default_themes = [
            {
                "id": "macos-monterey",
                "name": "macOS Monterey",
                "os_type": "macOS",
                "category": "desktop",
                "image_url": "https://images.unsplash.com/photo-1620121478247-ec786b9be2fa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwyfHxtYWNPUyUyMHdhbGxwYXBlcnxlbnwwfHx8fDE3NzU4MzU3MjZ8MA&ixlib=rb-4.1.0&q=85",
                "description": "Modern macOS Monterey theme with clean aesthetics",
                "version": "12.0",
                "tags": ["modern", "minimal", "apple"],
                "is_favorite": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "windows-11",
                "name": "Windows 11",
                "os_type": "Windows",
                "category": "desktop",
                "image_url": "https://images.unsplash.com/photo-1512138073931-b0ca6edf55e2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwzfHx3aW5kb3dzJTIwY29tcHV0ZXIlMjBhYnN0cmFjdHxlbnwwfHx8fDE3NzU4MzU3MjZ8MA&ixlib=rb-4.1.0&q=85",
                "description": "Windows 11 with rounded corners and modern UI",
                "version": "11",
                "tags": ["modern", "rounded", "microsoft"],
                "is_favorite": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "windows-10",
                "name": "Windows 10",
                "os_type": "Windows",
                "category": "desktop",
                "image_url": "https://images.unsplash.com/photo-1512138073931-b0ca6edf55e2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwzfHx3aW5kb3dzJTIwY29tcHV0ZXIlMjBhYnN0cmFjdHxlbnwwfHx8fDE3NzU4MzU3MjZ8MA&ixlib=rb-4.1.0&q=85",
                "description": "Classic Windows 10 flat design",
                "version": "10",
                "tags": ["flat", "classic", "microsoft"],
                "is_favorite": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "windows-8",
                "name": "Windows 8",
                "os_type": "Windows",
                "category": "desktop",
                "image_url": "https://images.unsplash.com/photo-1549665600-42c9e852661e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwxfHx3aW5kb3dzJTIwY29tcHV0ZXIlMjBhYnN0cmFjdHxlbnwwfHx8fDE3NzU4MzU3MjZ8MA&ixlib=rb-4.1.0&q=85",
                "description": "Metro UI design of Windows 8",
                "version": "8",
                "tags": ["metro", "tiles", "microsoft"],
                "is_favorite": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "windows-7",
                "name": "Windows 7",
                "os_type": "Windows",
                "category": "desktop",
                "image_url": "https://images.unsplash.com/photo-1549665600-42c9e852661e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwxfHx3aW5kb3dzJTIwY29tcHV0ZXIlMjBhYnN0cmFjdHxlbnwwfHx8fDE3NzU4MzU3MjZ8MA&ixlib=rb-4.1.0&q=85",
                "description": "Nostalgic Windows 7 Aero glass theme",
                "version": "7",
                "tags": ["aero", "glass", "classic"],
                "is_favorite": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "macos-boot",
                "name": "macOS Boot Theme",
                "os_type": "macOS",
                "category": "boot",
                "image_url": "https://images.unsplash.com/photo-1761599821310-da0d6356b4f3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZ2xvd2luZyUyMGNvbXB1dGVyJTIwY29kZXxlbnwwfHx8fDE3NzU4MzU3MjZ8MA&ixlib=rb-4.1.0&q=85",
                "description": "Apple-style boot loader theme",
                "tags": ["boot", "grub", "apple"],
                "is_favorite": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "windows-11-boot",
                "name": "Windows 11 Boot Theme",
                "os_type": "Windows",
                "category": "boot",
                "image_url": "https://images.unsplash.com/photo-1761599821310-da0d6356b4f3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZ2xvd2luZyUyMGNvbXB1dGVyJTIwY29kZXxlbnwwfHx8fDE3NzU4MzU3MjZ8MA&ixlib=rb-4.1.0&q=85",
                "description": "Modern Windows 11 boot loader",
                "tags": ["boot", "grub", "modern"],
                "is_favorite": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "windows-10-boot",
                "name": "Windows 10 Boot Theme",
                "os_type": "Windows",
                "category": "boot",
                "image_url": "https://images.unsplash.com/photo-1761599821310-da0d6356b4f3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZ2xvd2luZyUyMGNvbXB1dGVyJTIwY29kZXxlbnwwfHx8fDE3NzU4MzU3MjZ8MA&ixlib=rb-4.1.0&q=85",
                "description": "Windows 10 style boot loader",
                "tags": ["boot", "grub", "classic"],
                "is_favorite": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "windows-7-boot",
                "name": "Windows 7 Boot Theme",
                "os_type": "Windows",
                "category": "boot",
                "image_url": "https://images.unsplash.com/photo-1761599821310-da0d6356b4f3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZ2xvd2luZyUyMGNvbXB1dGVyJTIwY29kZXxlbnwwfHx8fDE3NzU4MzU3MjZ8MA&ixlib=rb-4.1.0&q=85",
                "description": "Classic Windows 7 boot loader",
                "tags": ["boot", "grub", "retro"],
                "is_favorite": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.themes.insert_many(default_themes)
        logger.info(f"Initialized {len(default_themes)} default themes")

# Routes
@api_router.get("/")
async def root():
    return {"message": "OS Theme Hub API", "version": "1.0.0"}

@api_router.get("/themes", response_model=List[Theme])
async def get_themes(category: Optional[str] = None, os_type: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    if os_type:
        query["os_type"] = os_type
    
    themes = await db.themes.find(query, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for theme in themes:
        if isinstance(theme.get('created_at'), str):
            theme['created_at'] = datetime.fromisoformat(theme['created_at'])
    
    # Check favorites
    favorites = await db.favorites.find({}, {"_id": 0}).to_list(1000)
    favorite_ids = [fav['theme_id'] for fav in favorites]
    
    for theme in themes:
        theme['is_favorite'] = theme['id'] in favorite_ids
    
    return themes

@api_router.get("/themes/{theme_id}", response_model=Theme)
async def get_theme(theme_id: str):
    theme = await db.themes.find_one({"id": theme_id}, {"_id": 0})
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")
    
    if isinstance(theme.get('created_at'), str):
        theme['created_at'] = datetime.fromisoformat(theme['created_at'])
    
    # Check if favorite
    favorite = await db.favorites.find_one({"theme_id": theme_id})
    theme['is_favorite'] = favorite is not None
    
    return theme

@api_router.post("/themes/{theme_id}/apply")
async def apply_theme(theme_id: str):
    theme = await db.themes.find_one({"id": theme_id}, {"_id": 0})
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")
    
    # In a real implementation, this would execute GTK theme commands
    # For now, we'll simulate the application
    applied_theme = AppliedTheme(
        theme_id=theme_id,
        theme_name=theme['name'],
        category=theme['category'],
        status="applied"
    )
    
    doc = applied_theme.model_dump()
    doc['applied_at'] = doc['applied_at'].isoformat()
    
    await db.applied_themes.insert_one(doc)
    
    return {
        "success": True,
        "message": f"Theme '{theme['name']}' applied successfully",
        "theme": theme,
        "simulation_note": "In production, this would apply GTK/GRUB themes to Zorin OS"
    }

@api_router.post("/themes/{theme_id}/preview")
async def preview_theme(theme_id: str):
    theme = await db.themes.find_one({"id": theme_id}, {"_id": 0})
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")
    
    return {
        "success": True,
        "message": f"Previewing theme '{theme['name']}'",
        "theme": theme
    }

@api_router.get("/favorites", response_model=List[Theme])
async def get_favorites():
    favorites = await db.favorites.find({}, {"_id": 0}).to_list(1000)
    favorite_theme_ids = [fav['theme_id'] for fav in favorites]
    
    if not favorite_theme_ids:
        return []
    
    themes = await db.themes.find({"id": {"$in": favorite_theme_ids}}, {"_id": 0}).to_list(1000)
    
    for theme in themes:
        if isinstance(theme.get('created_at'), str):
            theme['created_at'] = datetime.fromisoformat(theme['created_at'])
        theme['is_favorite'] = True
    
    return themes

@api_router.post("/favorites/{theme_id}")
async def add_favorite(theme_id: str):
    theme = await db.themes.find_one({"id": theme_id})
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")
    
    existing = await db.favorites.find_one({"theme_id": theme_id})
    if existing:
        return {"success": True, "message": "Theme already in favorites"}
    
    favorite = Favorite(theme_id=theme_id)
    doc = favorite.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.favorites.insert_one(doc)
    return {"success": True, "message": "Theme added to favorites"}

@api_router.delete("/favorites/{theme_id}")
async def remove_favorite(theme_id: str):
    result = await db.favorites.delete_one({"theme_id": theme_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    return {"success": True, "message": "Theme removed from favorites"}

@api_router.get("/customization", response_model=CustomizationSettings)
async def get_customization():
    settings = await db.customization.find_one({}, {"_id": 0})
    if not settings:
        # Return default settings
        default_settings = CustomizationSettings()
        doc = default_settings.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await db.customization.insert_one(doc)
        return default_settings
    
    if isinstance(settings.get('updated_at'), str):
        settings['updated_at'] = datetime.fromisoformat(settings['updated_at'])
    
    return settings

@api_router.post("/customization", response_model=CustomizationSettings)
async def update_customization(update: CustomizationUpdate):
    current = await db.customization.find_one({}, {"_id": 0})
    
    if not current:
        current = CustomizationSettings().model_dump()
    
    update_data = update.model_dump(exclude_none=True)
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    for key, value in update_data.items():
        current[key] = value
    
    await db.customization.delete_many({})
    await db.customization.insert_one(current)
    
    if isinstance(current.get('updated_at'), str):
        current['updated_at'] = datetime.fromisoformat(current['updated_at'])
    
    return current

@api_router.get("/applied-themes")
async def get_applied_themes():
    applied = await db.applied_themes.find({}, {"_id": 0}).sort("applied_at", -1).limit(10).to_list(10)
    
    for theme in applied:
        if isinstance(theme.get('applied_at'), str):
            theme['applied_at'] = datetime.fromisoformat(theme['applied_at'])
    
    return applied

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await initialize_themes()
    logger.info("Application started successfully")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

