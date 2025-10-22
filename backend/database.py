import logging
from typing import Dict, List, Optional
import json
from datetime import datetime

logger = logging.getLogger(__name__)

class SupabaseClient:
    def __init__(self):
        """Initialize mock Supabase client"""
        logger.info("Supabase client initialized (mock mode)")
        self.mock_data = {
            "user_profiles": {},
            "user_sessions": [],
            "artwork_catalog": [],
            "store_info": [],
            "user_feedback": []
        }
    
    async def create_user_profile(self, user_id: str, preferences: dict):
        """Mock create a new user profile with preferences"""
        try:
            logger.info(f"Mock creating user profile for {user_id}")
            
            profile = {
                "user_id": user_id,
                "preferences": preferences,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            
            self.mock_data["user_profiles"][user_id] = profile
            return profile
            
        except Exception as e:
            logger.error(f"Error creating user profile: {e}")
            return None
    
    async def get_user_profile(self, user_id: str):
        """Mock get user profile by ID"""
        try:
            logger.info(f"Mock getting user profile for {user_id}")
            
            profile = self.mock_data["user_profiles"].get(user_id)
            if profile:
                return profile
            else:
                # Create default profile if not found
                default_preferences = {
                    "aesthetic_style": "modern",
                    "preferred_colors": ["#2c3e50", "#3498db"],
                    "max_price": 500,
                    "room_type": "living_room"
                }
                return await self.create_user_profile(user_id, default_preferences)
                
        except Exception as e:
            logger.error(f"Error getting user profile: {e}")
            return None
    
    async def update_user_preferences(self, user_id: str, preferences: dict):
        """Mock update user preferences"""
        try:
            logger.info(f"Mock updating user preferences for {user_id}")
            
            if user_id in self.mock_data["user_profiles"]:
                self.mock_data["user_profiles"][user_id]["preferences"].update(preferences)
                self.mock_data["user_profiles"][user_id]["updated_at"] = datetime.now().isoformat()
                return self.mock_data["user_profiles"][user_id]
            else:
                return await self.create_user_profile(user_id, preferences)
                
        except Exception as e:
            logger.error(f"Error updating user preferences: {e}")
            return None
    
    async def save_session(self, session_data: dict):
        """Mock save a user session"""
        try:
            logger.info("Mock saving user session")
            
            session = {
                "id": f"session_{len(self.mock_data['user_sessions']) + 1}",
                **session_data,
                "created_at": datetime.now().isoformat()
            }
            
            self.mock_data["user_sessions"].append(session)
            return session
            
        except Exception as e:
            logger.error(f"Error saving session: {e}")
            return None
    
    async def get_user_sessions(self, user_id: str, limit: int = 10):
        """Mock get user sessions"""
        try:
            logger.info(f"Mock getting user sessions for {user_id}")
            
            user_sessions = [
                session for session in self.mock_data["user_sessions"]
                if session.get("user_id") == user_id
            ]
            
            # Sort by created_at descending and limit
            user_sessions.sort(key=lambda x: x.get("created_at", ""), reverse=True)
            return user_sessions[:limit]
            
        except Exception as e:
            logger.error(f"Error getting user sessions: {e}")
            return []
    
    async def add_artwork(self, artwork_data: dict):
        """Mock add artwork to catalog"""
        try:
            logger.info("Mock adding artwork to catalog")
            
            artwork = {
                "id": f"artwork_{len(self.mock_data['artwork_catalog']) + 1}",
                **artwork_data,
                "created_at": datetime.now().isoformat()
            }
            
            self.mock_data["artwork_catalog"].append(artwork)
            return artwork
            
        except Exception as e:
            logger.error(f"Error adding artwork: {e}")
            return None
    
    async def get_artwork_catalog(self, limit: int = 50):
        """Mock get artwork catalog"""
        try:
            logger.info("Mock getting artwork catalog")
            
            return self.mock_data["artwork_catalog"][:limit]
            
        except Exception as e:
            logger.error(f"Error getting artwork catalog: {e}")
            return []
    
    async def add_store(self, store_data: dict):
        """Mock add store information"""
        try:
            logger.info("Mock adding store information")
            
            store = {
                "id": f"store_{len(self.mock_data['store_info']) + 1}",
                **store_data,
                "created_at": datetime.now().isoformat()
            }
            
            self.mock_data["store_info"].append(store)
            return store
            
        except Exception as e:
            logger.error(f"Error adding store: {e}")
            return None
    
    async def get_stores(self, location: str = None, limit: int = 20):
        """Mock get stores"""
        try:
            logger.info(f"Mock getting stores for location: {location}")
            
            stores = self.mock_data["store_info"]
            
            if location:
                # Filter by location (mock)
                stores = [store for store in stores if location.lower() in store.get("address", "").lower()]
            
            return stores[:limit]
            
        except Exception as e:
            logger.error(f"Error getting stores: {e}")
            return []
    
    async def add_feedback(self, feedback_data: dict):
        """Mock add user feedback"""
        try:
            logger.info("Mock adding user feedback")
            
            feedback = {
                "id": f"feedback_{len(self.mock_data['user_feedback']) + 1}",
                **feedback_data,
                "created_at": datetime.now().isoformat()
            }
            
            self.mock_data["user_feedback"].append(feedback)
            return feedback
            
        except Exception as e:
            logger.error(f"Error adding feedback: {e}")
            return None
    
    async def get_feedback(self, user_id: str = None, limit: int = 20):
        """Mock get user feedback"""
        try:
            logger.info(f"Mock getting feedback for user: {user_id}")
            
            feedback = self.mock_data["user_feedback"]
            
            if user_id:
                feedback = [f for f in feedback if f.get("user_id") == user_id]
            
            return feedback[:limit]
            
        except Exception as e:
            logger.error(f"Error getting feedback: {e}")
            return []

# Global instance
supabase_client = SupabaseClient()