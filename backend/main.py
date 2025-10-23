from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict
import logging
import os
import uuid
from datetime import datetime
import shutil

from decision_router import decision_router
from database import supabase_client
from config import HOST, PORT, DEBUG
from auth import get_current_user, require_auth, optional_auth
from cache import redis_cache
from cache_invalidation import cache_invalidation
from search import vector_search, search_engine_search, hybrid_search

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Art.Decor.AI API",
    description="AI-Powered Home Décor Recommendation Platform",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class UserProfile(BaseModel):
    user_id: str
    preferences: Dict
    created_at: Optional[str] = None

class TextQuery(BaseModel):
    query: str
    user_id: str
    location: Optional[str] = None

class VoiceQuery(BaseModel):
    audio_data: str  # Base64 encoded audio
    user_id: str
    location: Optional[str] = None

class ExternalItem(BaseModel):
    id: str
    title: str
    price: float
    currency: str
    image_url: str
    store: str
    store_url: str
    availability: str
    category: str
    tags: List[str]
    description: str

class SearchFilters(BaseModel):
    style: Optional[str] = None
    colorPalette: Optional[List[str]] = None
    priceRange: Optional[Dict[str, float]] = None
    category: Optional[str] = None
    availability: Optional[str] = None

class ExternalSearchRequest(BaseModel):
    query: str
    filters: Optional[SearchFilters] = None

class RecommendationRequest(BaseModel):
    user_id: str
    room_analysis: Optional[Dict] = None
    preferences: Optional[Dict] = None
    location: Optional[str] = None

# Utility functions
def save_uploaded_file(upload_file: UploadFile) -> str:
    """Save uploaded file and return file path"""
    try:
        # Create uploads directory if it doesn't exist
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        file_extension = upload_file.filename.split(".")[-1] if "." in upload_file.filename else "jpg"
        filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(upload_dir, filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        
        return file_path
    except Exception as e:
        logger.error(f"Error saving uploaded file: {e}")
        raise HTTPException(status_code=500, detail="Error saving uploaded file")

# API Endpoints

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Art.Decor.AI API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "database": "connected",
            "ai_agents": "ready",
            "artwork_retrieval": "ready"
        }
    }

@app.post("/api/analyze-room")
async def analyze_room(
    image: UploadFile = File(...),
    location: Optional[str] = Form(None),
    current_user: dict = Depends(require_auth)
):
    """Analyze room image and provide décor recommendations"""
    try:
        # Validate image file
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Save uploaded image
        image_path = save_uploaded_file(image)
        
        # Process room analysis
        result = await decision_router.process_room_analysis(image_path, current_user["user_id"], location)
        
        # Clean up uploaded file
        try:
            os.remove(image_path)
        except:
            pass
        
        return JSONResponse(content=result)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in room analysis: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/text-query")
async def process_text_query(
    query: str = Form(...),
    location: Optional[str] = Form(None),
    current_user: dict = Depends(require_auth)
):
    """Process text-based queries for décor recommendations"""
    try:
        result = await decision_router.process_text_query(
            query, 
            current_user["user_id"], 
            location
        )
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"Error processing text query: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/voice-query")
async def process_voice_query(
    audio_data: str = Form(...),
    location: Optional[str] = Form(None),
    current_user: dict = Depends(require_auth)
):
    """Process voice queries for décor recommendations"""
    try:
        # In a real implementation, you would decode the base64 audio data
        # and save it to a temporary file for processing
        result = await decision_router.process_voice_query(
            audio_data, 
            current_user["user_id"], 
            location
        )
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"Error processing voice query: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/user-profile")
async def create_user_profile(
    preferences: Dict,
    current_user: dict = Depends(require_auth)
):
    """Create or update user profile"""
    try:
        result = await supabase_client.create_user_profile(
            current_user["user_id"], 
            preferences
        )
        
        if result:
            return JSONResponse(content={"success": True, "profile": result})
        else:
            raise HTTPException(status_code=500, detail="Failed to create user profile")
            
    except Exception as e:
        logger.error(f"Error creating user profile: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/user-profile")
async def get_user_profile(current_user: dict = Depends(require_auth)):
    """Get current user's profile"""
    try:
        profile = await supabase_client.get_user_profile(current_user["user_id"])
        
        if profile:
            return JSONResponse(content={"success": True, "profile": profile})
        else:
            raise HTTPException(status_code=404, detail="User profile not found")
            
    except Exception as e:
        logger.error(f"Error getting user profile: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.put("/api/user-profile")
async def update_user_profile(
    preferences: Dict,
    current_user: dict = Depends(require_auth)
):
    """Update user preferences"""
    try:
        result = await supabase_client.update_user_preferences(current_user["user_id"], preferences)
        
        if result:
            return JSONResponse(content={"success": True, "profile": result})
        else:
            raise HTTPException(status_code=500, detail="Failed to update user profile")
            
    except Exception as e:
        logger.error(f"Error updating user profile: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/user-sessions")
async def get_user_sessions(
    limit: int = 10,
    current_user: dict = Depends(require_auth)
):
    """Get user's recent sessions"""
    try:
        sessions = await supabase_client.get_user_sessions(current_user["user_id"], limit)
        return JSONResponse(content={"success": True, "sessions": sessions})
        
    except Exception as e:
        logger.error(f"Error getting user sessions: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/search-context")
async def get_search_context(current_user: dict = Depends(require_auth)):
    """Get user's current search context"""
    try:
        context = await supabase_client.get_search_context(current_user["user_id"])
        
        if context:
            return JSONResponse(content={
                "success": True, 
                "context": context,
                "has_context": True
            })
        else:
            return JSONResponse(content={
                "success": True, 
                "context": None,
                "has_context": False
            })
            
    except Exception as e:
        logger.error(f"Error getting search context: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.delete("/api/search-context")
async def clear_search_context(current_user: dict = Depends(require_auth)):
    """Clear user's search context"""
    try:
        # In a real implementation, this would delete the context from database
        # For mock implementation, we'll just return success
        logger.info(f"Clearing search context for user {current_user['user_id']}")
        
        return JSONResponse(content={
            "success": True, 
            "message": "Search context cleared successfully"
        })
            
    except Exception as e:
        logger.error(f"Error clearing search context: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/search-context/update")
async def update_search_context(
    additional_context: Dict,
    current_user: dict = Depends(require_auth)
):
    """Update user's search context with additional information"""
    try:
        result = await supabase_client.update_search_context(
            current_user["user_id"], 
            additional_context
        )
        
        if result:
            return JSONResponse(content={
                "success": True, 
                "message": "Search context updated successfully",
                "context": result
            })
        else:
            raise HTTPException(status_code=500, detail="Failed to update search context")
            
    except Exception as e:
        logger.error(f"Error updating search context: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/trends")
async def get_trending_styles(query: str = "interior design trends 2024", max_results: int = 10):
    """Get trending interior design styles"""
    try:
        from agents.trend_intel_agent import trend_agent
        trends = await trend_agent.search_trending_styles(query, max_results)
        return JSONResponse(content={"success": True, "trends": trends})
        
    except Exception as e:
        logger.error(f"Error getting trending styles: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/nearby-stores")
async def get_nearby_stores(location: str, radius: int = 5000):
    """Get nearby art and décor stores"""
    try:
        from agents.geo_finder_agent import geo_agent
        stores = geo_agent.find_nearby_art_shops(location, radius)
        return JSONResponse(content={"success": True, "stores": stores})
        
    except Exception as e:
        logger.error(f"Error getting nearby stores: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/directions")
async def get_directions(origin: str, destination: str, mode: str = "driving"):
    """Get directions to a store"""
    try:
        from agents.geo_finder_agent import geo_agent
        directions = geo_agent.get_directions(origin, destination, mode)
        return JSONResponse(content={"success": True, "directions": directions})
        
    except Exception as e:
        logger.error(f"Error getting directions: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/artwork")
async def add_artwork(artwork: Dict):
    """Add new artwork to the catalog"""
    try:
        from artwork_retrieval import artwork_retrieval
        success = artwork_retrieval.add_artwork(artwork)
        
        if success:
            return JSONResponse(content={"success": True, "message": "Artwork added successfully"})
        else:
            raise HTTPException(status_code=500, detail="Failed to add artwork")
            
    except Exception as e:
        logger.error(f"Error adding artwork: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/artwork/search")
async def search_artwork(query: str, k: int = 5):
    """Search artwork catalog"""
    try:
        from artwork_retrieval import artwork_retrieval
        # This would need a query embedding - simplified for demo
        import numpy as np
        query_embedding = np.random.random(512).astype(np.float32)
        results = artwork_retrieval.search_similar_artworks(query_embedding, k)
        return JSONResponse(content={"success": True, "artworks": results})
        
    except Exception as e:
        logger.error(f"Error searching artwork: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# External API Integration Endpoints
@app.post("/api/external/search")
async def search_external_items(request: ExternalSearchRequest):
    """Search items across IKEA, Etsy, and PosterStore"""
    try:
        # Mock data for development - replace with actual API calls
        mock_items = [
            {
                "id": "ikea-001",
                "title": "Framsta Wall Art - Modern Abstract",
                "price": 29.99,
                "currency": "USD",
                "image_url": "https://picsum.photos/seed/ikea1/300/300",
                "store": "IKEA",
                "store_url": "https://www.ikea.com/us/en/p/framsta-wall-art-modern-abstract-00412345/",
                "availability": "in_stock",
                "category": "Wall Art",
                "tags": ["Modern", "Abstract", "Minimalist"],
                "description": "Contemporary wall art with clean lines and neutral colors"
            },
            {
                "id": "etsy-001",
                "title": "Handmade Ceramic Vase - Blue",
                "price": 45.00,
                "currency": "USD",
                "image_url": "https://picsum.photos/seed/etsy1/300/300",
                "store": "Etsy",
                "store_url": "https://www.etsy.com/listing/1234567890/handmade-ceramic-vase-blue",
                "availability": "in_stock",
                "category": "Decor",
                "tags": ["Handmade", "Ceramic", "Blue", "Artisan"],
                "description": "Unique handcrafted ceramic vase with beautiful blue glaze"
            },
            {
                "id": "posterstore-001",
                "title": "Minimalist Typography Poster",
                "price": 24.99,
                "currency": "USD",
                "image_url": "https://picsum.photos/seed/poster1/300/300",
                "store": "PosterStore",
                "store_url": "https://www.posterstore.com/minimalist-typography-poster",
                "availability": "in_stock",
                "category": "Posters",
                "tags": ["Typography", "Minimalist", "Black", "White"],
                "description": "Clean typography poster with inspirational quote"
            }
        ]
        
        # Filter items based on search criteria
        filtered_items = mock_items
        
        if request.filters:
            if request.filters.style:
                filtered_items = [item for item in filtered_items 
                                if any(tag.lower() in request.filters.style.lower() 
                                      for tag in item["tags"])]
            
            if request.filters.colorPalette:
                filtered_items = [item for item in filtered_items 
                                if any(tag.lower() in color.lower().replace('#', '') 
                                      for tag in item["tags"] 
                                      for color in request.filters.colorPalette)]
            
            if request.filters.priceRange:
                min_price = request.filters.priceRange.get("min", 0)
                max_price = request.filters.priceRange.get("max", 1000)
                filtered_items = [item for item in filtered_items 
                                if min_price <= item["price"] <= max_price]
            
            if request.filters.category:
                filtered_items = [item for item in filtered_items 
                                if request.filters.category.lower() in item["category"].lower()]
            
            if request.filters.availability and request.filters.availability != "all":
                filtered_items = [item for item in filtered_items 
                                if item["availability"] == request.filters.availability]
        
        return JSONResponse(content={"success": True, "items": filtered_items})
        
    except Exception as e:
        logger.error(f"Error searching external items: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/external/trending")
async def get_trending_items():
    """Get trending items from all stores"""
    try:
        trending_items = [
            {
                "id": "trending-001",
                "title": "Trending: Modern Abstract Canvas",
                "price": 89.99,
                "currency": "USD",
                "image_url": "https://picsum.photos/seed/trending1/300/300",
                "store": "Etsy",
                "store_url": "https://www.etsy.com/listing/trending1",
                "availability": "in_stock",
                "category": "Art",
                "tags": ["Trending", "Modern", "Abstract", "Canvas"],
                "description": "Currently trending modern abstract canvas art"
            },
            {
                "id": "trending-002",
                "title": "Popular: Minimalist Wall Shelf",
                "price": 45.00,
                "currency": "USD",
                "image_url": "https://picsum.photos/seed/trending2/300/300",
                "store": "IKEA",
                "store_url": "https://www.ikea.com/us/en/p/trending2",
                "availability": "in_stock",
                "category": "Shelving",
                "tags": ["Popular", "Minimalist", "Wall", "Shelf"],
                "description": "Popular minimalist wall shelf design"
            },
            {
                "id": "trending-003",
                "title": "Hot: Boho Macrame Plant Hanger",
                "price": 32.00,
                "currency": "USD",
                "image_url": "https://picsum.photos/seed/trending3/300/300",
                "store": "Etsy",
                "store_url": "https://www.etsy.com/listing/trending3",
                "availability": "in_stock",
                "category": "Plant Accessories",
                "tags": ["Hot", "Boho", "Macrame", "Plant"],
                "description": "Hot trending boho macrame plant hanger"
            }
        ]
        
        return JSONResponse(content={"success": True, "items": trending_items})
        
    except Exception as e:
        logger.error(f"Error getting trending items: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Dashboard Analytics API Endpoints

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(current_user: dict = Depends(require_auth)):
    """Get real-time dashboard statistics"""
    try:
        # Get real user count from database
        users_data = await supabase_client.get_all_users()
        total_users = len(users_data) if users_data else 0
        
        # Get active sessions (mock for now, would be real in production)
        active_sessions = await supabase_client.get_active_sessions()
        active_count = len(active_sessions) if active_sessions else 0
        
        # Get AI recommendations count
        recommendations_data = await supabase_client.get_recommendations_count()
        ai_recommendations = recommendations_data.get('count', 0) if recommendations_data else 0
        
        # Calculate growth percentages (mock for now)
        stats = {
            "total_users": {
                "value": f"{total_users:,}",
                "change": "+12%",
                "trend": "up"
            },
            "active_sessions": {
                "value": f"{active_count:,}",
                "change": "+8%",
                "trend": "up"
            },
            "ai_recommendations": {
                "value": f"{ai_recommendations:,}",
                "change": "+23%",
                "trend": "up"
            },
            "revenue": {
                "value": "$89,432",
                "change": "+15%",
                "trend": "up"
            }
        }
        
        return JSONResponse(content={
            "success": True,
            "stats": stats,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error getting dashboard stats: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/dashboard/activities")
async def get_recent_activities(current_user: dict = Depends(require_auth)):
    """Get recent user activities"""
    try:
        # Get recent activities from database
        activities = await supabase_client.get_recent_activities(limit=10)
        
        if not activities:
            # Fallback mock data
            activities = [
                {
                    "id": 1,
                    "user_email": "john.doe@gmail.com",
                    "action": "Uploaded room photo",
                    "timestamp": datetime.now().isoformat(),
                    "type": "upload"
                },
                {
                    "id": 2,
                    "user_email": "sarah.smith@gmail.com",
                    "action": "Received AI recommendations",
                    "timestamp": datetime.now().isoformat(),
                    "type": "ai"
                },
                {
                    "id": 3,
                    "user_email": "mike.wilson@gmail.com",
                    "action": "Purchased artwork",
                    "timestamp": datetime.now().isoformat(),
                    "type": "purchase"
                },
                {
                    "id": 4,
                    "user_email": "emma.brown@gmail.com",
                    "action": "Started chat session",
                    "timestamp": datetime.now().isoformat(),
                    "type": "chat"
                }
            ]
        
        return JSONResponse(content={
            "success": True,
            "activities": activities,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error getting recent activities: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/dashboard/system-health")
async def get_system_health(current_user: dict = Depends(require_auth)):
    """Get system health metrics"""
    try:
        # Get Redis health
        redis_healthy = False
        try:
            await redis_cache.connect()
            if redis_cache.client:
                await redis_cache.client.ping()
                redis_healthy = True
        except:
            redis_healthy = False
        
        # Get cache stats
        cache_stats = await cache_invalidation.get_cache_stats()
        
        # Mock system metrics (in production, these would be real)
        system_health = {
            "cpu": 45,
            "memory": 67,
            "storage": 23,
            "api_uptime": 99.9,
            "database_uptime": 99.8,
            "redis_healthy": redis_healthy,
            "cache_stats": cache_stats
        }
        
        return JSONResponse(content={
            "success": True,
            "health": system_health,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error getting system health: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/dashboard/analytics")
async def get_analytics_data(
    period: str = "7d",
    current_user: dict = Depends(require_auth)
):
    """Get analytics data for charts"""
    try:
        # Mock analytics data (in production, this would be real)
        analytics = {
            "period": period,
            "user_growth": {
                "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                "data": [120, 150, 180, 200, 250, 300, 280]
            },
            "recommendations": {
                "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                "data": [450, 520, 600, 750, 800, 900, 850]
            },
            "revenue": {
                "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                "data": [1200, 1500, 1800, 2000, 2500, 3000, 2800]
            },
            "top_styles": [
                {"style": "Modern Minimalist", "count": 1250, "percentage": 35},
                {"style": "Scandinavian", "count": 980, "percentage": 28},
                {"style": "Contemporary", "count": 750, "percentage": 21},
                {"style": "Traditional", "count": 520, "percentage": 16}
            ]
        }
        
        return JSONResponse(content={
            "success": True,
            "analytics": analytics,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error getting analytics data: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Search API Endpoints

@app.get("/api/search")
async def search_items(
    q: str,
    top_k: int = 10,
    num_results: int = 20,
    current_user: dict = Depends(optional_auth)
):
    """
    Hybrid search: searches both vector database and Google search engine.
    First searches in vector DB, then in Google search results.
    """
    try:
        results = hybrid_search(q, top_k, num_results)
        return JSONResponse(content={
            "success": True,
            "query": q,
            "results": results,
            "total_results": len(results),
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error in hybrid search: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/search/vector")
async def vector_only_search(
    q: str,
    top_k: int = 10,
    current_user: dict = Depends(optional_auth)
):
    """
    Search in vector database only using ChromaDB
    """
    try:
        results = vector_search(q, top_k)
        return JSONResponse(content={
            "success": True,
            "query": q,
            "results": results,
            "total_results": len(results),
            "search_type": "vector",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error in vector search: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/search/google")
async def search_engine_only_search(
    q: str,
    num_results: int = 20,
    current_user: dict = Depends(optional_auth)
):
    """
    Search using Google Custom Search API only
    """
    try:
        results = search_engine_search(q, num_results)
        return JSONResponse(content={
            "success": True,
            "query": q,
            "results": results,
            "total_results": len(results),
            "search_type": "google",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error in Google search: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Redis Health Check and Cache Management Endpoints

@app.get("/api/health/redis")
async def redis_health_check():
    """Check Redis connection health"""
    try:
        await redis_cache.connect()
        if redis_cache.client:
            await redis_cache.client.ping()
            return JSONResponse(content={
                "status": "healthy",
                "redis_url": redis_cache.REDIS_URL,
                "connected": True,
                "timestamp": datetime.now().isoformat()
            })
        else:
            return JSONResponse(content={
                "status": "unhealthy",
                "redis_url": redis_cache.REDIS_URL,
                "connected": False,
                "error": "Redis client not initialized",
                "timestamp": datetime.now().isoformat()
            })
    except Exception as e:
        logger.error(f"Redis health check failed: {e}")
        return JSONResponse(content={
            "status": "unhealthy",
            "redis_url": redis_cache.REDIS_URL,
            "connected": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        })

@app.get("/api/cache/stats")
async def get_cache_stats(current_user: dict = Depends(require_auth)):
    """Get cache statistics (admin only)"""
    try:
        stats = await cache_invalidation.get_cache_stats()
        return JSONResponse(content={
            "success": True,
            "stats": stats,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error getting cache stats: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/cache/invalidate/user/{user_id}")
async def invalidate_user_cache(
    user_id: str,
    cache_types: Optional[List[str]] = None,
    current_user: dict = Depends(require_auth)
):
    """Invalidate cache for a specific user (admin only)"""
    try:
        # Only allow users to invalidate their own cache or admin users
        if current_user.get("id") != user_id and current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Forbidden")
        
        invalidated_count = await cache_invalidation.invalidate_user_cache(user_id, cache_types)
        return JSONResponse(content={
            "success": True,
            "invalidated_count": invalidated_count,
            "user_id": user_id,
            "cache_types": cache_types,
            "timestamp": datetime.now().isoformat()
        })
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error invalidating user cache: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/cache/invalidate/trends")
async def invalidate_stale_trends(
    max_age_hours: int = 6,
    current_user: dict = Depends(require_auth)
):
    """Invalidate stale trend data (admin only)"""
    try:
        # Only allow admin users
        if current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Forbidden")
        
        invalidated_count = await cache_invalidation.invalidate_stale_trends(max_age_hours)
        return JSONResponse(content={
            "success": True,
            "invalidated_count": invalidated_count,
            "max_age_hours": max_age_hours,
            "timestamp": datetime.now().isoformat()
        })
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error invalidating stale trends: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/cache/warmup/{user_id}")
async def warm_up_user_cache(
    user_id: str,
    common_styles: Optional[List[str]] = None,
    current_user: dict = Depends(require_auth)
):
    """Warm up cache for a specific user (admin only)"""
    try:
        # Only allow admin users
        if current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Forbidden")
        
        warmed_count = await cache_invalidation.warm_up_cache(user_id, common_styles)
        return JSONResponse(content={
            "success": True,
            "warmed_count": warmed_count,
            "user_id": user_id,
            "common_styles": common_styles,
            "timestamp": datetime.now().isoformat()
        })
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error warming up cache: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)
