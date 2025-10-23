import json
import logging
from typing import List, Dict, Optional, Tuple
import os
from datetime import datetime
from cache import redis_cache

logger = logging.getLogger(__name__)

class ArtworkRetrievalSystem:
    def __init__(self):
        """Initialize artwork retrieval system with mock capabilities"""
        self.artwork_catalog = []
        self.embedding_dim = 512  # Mock embedding dimension
        self._initialize_system()
    
    def _initialize_system(self):
        """Initialize mock artwork catalog"""
        try:
            # Load or create artwork catalog
            catalog_path = "artwork_catalog.json"
            if os.path.exists(catalog_path):
                with open(catalog_path, 'r') as f:
                    self.artwork_catalog = json.load(f)
                logger.info(f"Loaded {len(self.artwork_catalog)} artworks from catalog")
            else:
                self.artwork_catalog = self._create_sample_catalog()
                self._save_catalog()
                logger.info("Created sample artwork catalog")
                
        except Exception as e:
            logger.error(f"Error initializing artwork retrieval system: {e}")
            self.artwork_catalog = self._create_sample_catalog()
    
    def _create_sample_catalog(self) -> List[Dict]:
        """Create a sample artwork catalog"""
        return [
            {
                "id": "art_001",
                "title": "Abstract Modern Canvas",
                "artist": "Contemporary Artist",
                "style": "modern",
                "colors": ["#2c3e50", "#3498db", "#e74c3c"],
                "price": 150.00,
                "size": "24x36 inches",
                "medium": "Acrylic on Canvas",
                "description": "Bold abstract composition with vibrant colors",
                "image_url": "https://example.com/art1.jpg",
                "tags": ["abstract", "modern", "colorful", "contemporary"],
                "embedding": [0.1] * 512  # Mock embedding
            },
            {
                "id": "art_002",
                "title": "Minimalist Landscape",
                "artist": "Nature Artist",
                "style": "minimalist",
                "colors": ["#f8f9fa", "#6c757d", "#495057"],
                "price": 200.00,
                "size": "30x40 inches",
                "medium": "Oil on Canvas",
                "description": "Serene minimalist landscape with soft tones",
                "image_url": "https://example.com/art2.jpg",
                "tags": ["minimalist", "landscape", "serene", "neutral"],
                "embedding": [0.2] * 512  # Mock embedding
            },
            {
                "id": "art_003",
                "title": "Vintage Botanical Print",
                "artist": "Botanical Illustrator",
                "style": "traditional",
                "colors": ["#28a745", "#6f42c1", "#fd7e14"],
                "price": 85.00,
                "size": "18x24 inches",
                "medium": "Digital Print",
                "description": "Classic botanical illustration with vintage charm",
                "image_url": "https://example.com/art3.jpg",
                "tags": ["botanical", "vintage", "traditional", "nature"],
                "embedding": [0.3] * 512  # Mock embedding
            },
            {
                "id": "art_004",
                "title": "Geometric Abstract",
                "artist": "Geometric Artist",
                "style": "contemporary",
                "colors": ["#dc3545", "#ffc107", "#17a2b8"],
                "price": 120.00,
                "size": "20x20 inches",
                "medium": "Mixed Media",
                "description": "Bold geometric patterns with contrasting colors",
                "image_url": "https://example.com/art4.jpg",
                "tags": ["geometric", "abstract", "bold", "contemporary"],
                "embedding": [0.4] * 512  # Mock embedding
            },
            {
                "id": "art_005",
                "title": "Scandinavian Textile Art",
                "artist": "Nordic Designer",
                "style": "scandinavian",
                "colors": ["#f8f9fa", "#343a40", "#007bff"],
                "price": 95.00,
                "size": "16x20 inches",
                "medium": "Textile Art",
                "description": "Clean Scandinavian design with natural textures",
                "image_url": "https://example.com/art5.jpg",
                "tags": ["scandinavian", "textile", "clean", "natural"],
                "embedding": [0.5] * 512  # Mock embedding
            }
        ]
    
    def _save_catalog(self):
        """Save artwork catalog to file"""
        try:
            with open("artwork_catalog.json", 'w') as f:
                json.dump(self.artwork_catalog, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving catalog: {e}")
    
    def add_artwork(self, artwork: Dict) -> bool:
        """Add new artwork to catalog"""
        try:
            artwork["id"] = f"art_{len(self.artwork_catalog) + 1:03d}"
            artwork["embedding"] = [0.0] * 512  # Mock embedding
            self.artwork_catalog.append(artwork)
            self._save_catalog()
            logger.info(f"Added artwork: {artwork['title']}")
            return True
        except Exception as e:
            logger.error(f"Error adding artwork: {e}")
            return False
    
    def search_similar_artworks(self, query_embedding: List[float], k: int = 5) -> List[Dict]:
        """Mock search for similar artworks"""
        try:
            logger.info(f"Mock searching for {k} similar artworks")
            
            # Simple mock similarity calculation
            similarities = []
            for i, artwork in enumerate(self.artwork_catalog):
                # Mock similarity calculation (dot product)
                similarity = sum(a * b for a, b in zip(query_embedding, artwork["embedding"]))
                similarities.append((similarity, i))
            
            # Sort by similarity and return top k
            similarities.sort(reverse=True)
            results = []
            
            for similarity, idx in similarities[:k]:
                artwork = self.artwork_catalog[idx].copy()
                artwork["similarity_score"] = similarity
                results.append(artwork)
            
            return results
            
        except Exception as e:
            logger.error(f"Error searching similar artworks: {e}")
            return []
    
    async def get_personalized_recommendations(self, room_analysis: Dict, user_preferences: Dict, k: int = 5) -> List[Dict]:
        """Get personalized artwork recommendations with Redis caching"""
        try:
            logger.info("Getting personalized recommendations with caching")
            
            # Create cache key based on analysis and preferences
            style = room_analysis.get("aesthetic_style", {}).get("style", "modern")
            max_price = user_preferences.get("max_price", 500)
            cache_key = f"recommendations_{style}_{max_price}_{k}"
            
            # Check Redis cache first
            cached_recommendations = await redis_cache.get_cached_artwork_recommendations(
                cache_key, style
            )
            if cached_recommendations:
                logger.info("Returning cached artwork recommendations from Redis")
                return cached_recommendations
            
            # Extract style from room analysis
            aesthetic_style = room_analysis.get("aesthetic_style", {})
            detected_style = aesthetic_style.get("style", "modern").lower()
            
            # Extract user preferences
            preferred_style = user_preferences.get("aesthetic_style", "modern").lower()
            max_price = user_preferences.get("max_price", 500)
            
            # Filter artworks by style and price
            filtered_artworks = []
            for artwork in self.artwork_catalog:
                artwork_style = artwork.get("style", "").lower()
                artwork_price = artwork.get("price", 0)
                
                # Check if style matches and price is within budget
                if (detected_style in artwork_style or preferred_style in artwork_style) and artwork_price <= max_price:
                    artwork_copy = artwork.copy()
                    artwork_copy["recommendation_reason"] = f"Matches your {detected_style} style and fits your budget"
                    filtered_artworks.append(artwork_copy)
            
            # Sort by price (ascending) and return top k
            filtered_artworks.sort(key=lambda x: x["price"])
            recommendations = filtered_artworks[:k]
            
            # Cache the recommendations in Redis (2 hours TTL)
            await redis_cache.cache_artwork_recommendations(
                cache_key, style, recommendations, ttl=7200
            )
            logger.info(f"Cached {len(recommendations)} artwork recommendations in Redis")
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error getting personalized recommendations: {e}")
            return []
    
    def get_artwork_by_id(self, artwork_id: str) -> Optional[Dict]:
        """Get artwork by ID"""
        try:
            for artwork in self.artwork_catalog:
                if artwork["id"] == artwork_id:
                    return artwork
            return None
        except Exception as e:
            logger.error(f"Error getting artwork by ID: {e}")
            return None
    
    def search_by_keywords(self, keywords: List[str], k: int = 5) -> List[Dict]:
        """Search artworks by keywords"""
        try:
            logger.info(f"Mock searching artworks by keywords: {keywords}")
            
            results = []
            keywords_lower = [kw.lower() for kw in keywords]
            
            for artwork in self.artwork_catalog:
                # Check if any keyword matches title, description, or tags
                title_match = any(kw in artwork.get("title", "").lower() for kw in keywords_lower)
                desc_match = any(kw in artwork.get("description", "").lower() for kw in keywords_lower)
                tag_match = any(kw in tag.lower() for tag in artwork.get("tags", []) for kw in keywords_lower)
                
                if title_match or desc_match or tag_match:
                    artwork_copy = artwork.copy()
                    artwork_copy["match_score"] = 1.0  # Mock score
                    results.append(artwork_copy)
            
            return results[:k]
            
        except Exception as e:
            logger.error(f"Error searching by keywords: {e}")
            return []
    
    def get_trending_artworks(self, k: int = 5) -> List[Dict]:
        """Get trending artworks"""
        try:
            logger.info("Mock getting trending artworks")
            
            # Return artworks sorted by price (as a proxy for popularity)
            trending = sorted(self.artwork_catalog, key=lambda x: x["price"], reverse=True)
            return trending[:k]
            
        except Exception as e:
            logger.error(f"Error getting trending artworks: {e}")
            return []

# Global instance
artwork_retrieval = ArtworkRetrievalSystem()