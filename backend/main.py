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
    current_user: dict = Depends(require_auth())
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
    current_user: dict = Depends(require_auth())
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
    current_user: dict = Depends(require_auth())
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
    current_user: dict = Depends(require_auth())
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
async def get_user_profile(current_user: dict = Depends(require_auth())):
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
    current_user: dict = Depends(require_auth())
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
    current_user: dict = Depends(require_auth())
):
    """Get user's recent sessions"""
    try:
        sessions = await supabase_client.get_user_sessions(current_user["user_id"], limit)
        return JSONResponse(content={"success": True, "sessions": sessions})
        
    except Exception as e:
        logger.error(f"Error getting user sessions: {e}")
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)
