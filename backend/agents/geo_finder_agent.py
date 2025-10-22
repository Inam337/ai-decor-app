import logging
from typing import List, Dict, Optional, Tuple
import json
from datetime import datetime

logger = logging.getLogger(__name__)

class GeoFinderAgent:
    def __init__(self):
        """Initialize geo agent with mock capabilities"""
        logger.info("Geo Finder Agent initialized (mock mode)")
    
    def find_nearby_art_shops(self, location: str, radius: int = 5000) -> List[Dict]:
        """Mock find nearby art shops and galleries"""
        try:
            logger.info(f"Mock finding nearby art shops in {location}")
            
            # Return mock shops
            shops = [
                {
                    "name": "Local Art Gallery",
                    "address": "123 Main Street, Your City",
                    "rating": 4.2,
                    "types": ["art_gallery", "store"],
                    "phone": "(555) 123-4567",
                    "is_open": True,
                    "place_id": "mock_place_1"
                },
                {
                    "name": "Home Decor Store",
                    "address": "456 Oak Avenue, Your City",
                    "rating": 4.0,
                    "types": ["home_goods_store", "furniture_store"],
                    "phone": "(555) 234-5678",
                    "is_open": True,
                    "place_id": "mock_place_2"
                },
                {
                    "name": "Modern Art Supply",
                    "address": "789 Pine Street, Your City",
                    "rating": 4.5,
                    "types": ["art_supply_store"],
                    "phone": "(555) 345-6789",
                    "is_open": False,
                    "place_id": "mock_place_3"
                }
            ]
            
            return shops
            
        except Exception as e:
            logger.error(f"Error finding nearby art shops: {e}")
            return []
    
    def get_directions(self, origin: str, destination: str, mode: str = "driving") -> Dict:
        """Mock get directions to a specific store"""
        try:
            logger.info(f"Mock getting directions from {origin} to {destination}")
            
            return {
                "distance": "2.5 miles",
                "duration": "8 minutes",
                "steps": ["Head north on Main Street", "Turn right on Oak Avenue", "Destination on the left"],
                "start_address": origin,
                "end_address": destination
            }
            
        except Exception as e:
            logger.error(f"Error getting directions: {e}")
            return self._get_fallback_directions()
    
    def check_store_availability(self, place_id: str) -> Dict:
        """Mock check if a store is currently open"""
        try:
            logger.info(f"Mock checking availability for place {place_id}")
            
            return {
                "is_open": True,
                "business_status": "OPERATIONAL",
                "phone": "(555) 123-4567",
                "hours": ["Mon-Fri: 9AM-6PM", "Sat: 10AM-5PM", "Sun: Closed"],
                "last_updated": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error checking store availability: {e}")
            return self._get_fallback_availability()
    
    def find_online_alternatives(self, artwork_query: str) -> List[Dict]:
        """Mock find online alternatives for specific artwork"""
        try:
            logger.info(f"Mock finding online alternatives for {artwork_query}")
            
            online_stores = [
                {
                    "name": "Wayfair",
                    "url": f"https://www.wayfair.com/keyword.php?keyword={artwork_query}",
                    "price_range": "$50-$500",
                    "shipping": "Free shipping on orders over $35",
                    "rating": 4.2
                },
                {
                    "name": "Etsy",
                    "url": f"https://www.etsy.com/search?q={artwork_query}",
                    "price_range": "$20-$200",
                    "shipping": "Varies by seller",
                    "rating": 4.5
                },
                {
                    "name": "Amazon",
                    "url": f"https://www.amazon.com/s?k={artwork_query}",
                    "price_range": "$15-$300",
                    "shipping": "Prime delivery available",
                    "rating": 4.0
                },
                {
                    "name": "Society6",
                    "url": f"https://society6.com/search?q={artwork_query}",
                    "price_range": "$25-$150",
                    "shipping": "Worldwide shipping",
                    "rating": 4.3
                }
            ]
            
            return online_stores
            
        except Exception as e:
            logger.error(f"Error finding online alternatives: {e}")
            return []
    
    def get_location_based_recommendations(self, location: str, user_preferences: Dict) -> Dict:
        """Mock get location-specific recommendations"""
        try:
            logger.info(f"Mock getting location-based recommendations for {location}")
            
            # Find nearby shops
            nearby_shops = self.find_nearby_art_shops(location)
            
            # Filter based on user preferences
            filtered_shops = self._filter_shops_by_preferences(nearby_shops, user_preferences)
            
            # Get online alternatives
            style = user_preferences.get("aesthetic_style", "modern")
            online_alternatives = self.find_online_alternatives(f"{style} wall art")
            
            return {
                "nearby_shops": filtered_shops[:5],
                "online_alternatives": online_alternatives,
                "location": location,
                "recommendation_timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting location-based recommendations: {e}")
            return {"nearby_shops": [], "online_alternatives": [], "location": location}
    
    def _filter_shops_by_preferences(self, shops: List[Dict], preferences: Dict) -> List[Dict]:
        """Filter shops based on user preferences"""
        try:
            style = preferences.get("aesthetic_style", "").lower()
            price_preference = preferences.get("price_range", "medium")
            
            filtered_shops = []
            
            for shop in shops:
                shop_types = [t.lower() for t in shop.get("types", [])]
                
                # Check if shop type matches user preferences
                if any(keyword in " ".join(shop_types) for keyword in ["art", "decor", "furniture", "interior"]):
                    # Adjust rating based on price preference
                    adjusted_rating = self._adjust_rating_for_price(shop.get("rating", 0), price_preference)
                    shop["adjusted_rating"] = adjusted_rating
                    filtered_shops.append(shop)
            
            return sorted(filtered_shops, key=lambda x: x.get("adjusted_rating", 0), reverse=True)
            
        except Exception as e:
            logger.error(f"Error filtering shops: {e}")
            return shops
    
    def _adjust_rating_for_price(self, rating: float, price_preference: str) -> float:
        """Adjust shop rating based on price preference"""
        price_adjustments = {
            "low": 0.1,      # Slight boost for budget-friendly
            "medium": 0.0,   # No adjustment
            "high": -0.1     # Slight penalty for expensive
        }
        
        adjustment = price_adjustments.get(price_preference, 0.0)
        return max(0.0, min(5.0, rating + adjustment))
    
    def _get_fallback_directions(self) -> Dict:
        """Fallback directions when API is unavailable"""
        return {
            "distance": "2.5 miles",
            "duration": "8 minutes",
            "steps": ["Head north on Main Street", "Turn right on Oak Avenue", "Destination on the left"],
            "start_address": "Your Location",
            "end_address": "Store Location"
        }
    
    def _get_fallback_availability(self) -> Dict:
        """Fallback availability when API is unavailable"""
        return {
            "is_open": True,
            "business_status": "OPERATIONAL",
            "phone": "(555) 123-4567",
            "hours": ["Mon-Fri: 9AM-6PM", "Sat: 10AM-5PM", "Sun: Closed"],
            "last_updated": datetime.now().isoformat()
        }

# Global instance
geo_agent = GeoFinderAgent()