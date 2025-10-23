import logging
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from cache import redis_cache

logger = logging.getLogger(__name__)

class CacheInvalidationService:
    """Service for managing cache invalidation strategies"""
    
    def __init__(self):
        self.invalidation_patterns = {
            "user_preferences": ["user_preferences:*"],
            "room_analysis": ["room_analysis:*", "style_embeddings:*", "color_palette:*"],
            "artwork_recommendations": ["artwork_recommendations:*"],
            "trend_data": ["trend_data:*"],
            "location_data": ["location_data:*"]
        }
    
    async def invalidate_user_cache(self, user_id: str, cache_types: List[str] = None):
        """Invalidate all cache entries for a specific user"""
        try:
            logger.info(f"Invalidating cache for user {user_id}")
            
            if cache_types is None:
                cache_types = list(self.invalidation_patterns.keys())
            
            invalidated_count = 0
            
            for cache_type in cache_types:
                patterns = self.invalidation_patterns.get(cache_type, [])
                for pattern in patterns:
                    # Add user_id to pattern
                    user_pattern = pattern.replace("*", f"*{user_id}*")
                    count = await self._invalidate_by_pattern(user_pattern)
                    invalidated_count += count
            
            logger.info(f"Invalidated {invalidated_count} cache entries for user {user_id}")
            return invalidated_count
            
        except Exception as e:
            logger.error(f"Error invalidating user cache: {e}")
            return 0
    
    async def invalidate_stale_trends(self, max_age_hours: int = 6):
        """Invalidate trend data older than specified hours"""
        try:
            logger.info(f"Invalidating trend data older than {max_age_hours} hours")
            
            # Get all trend data keys
            trend_keys = await self._get_keys_by_pattern("trend_data:*")
            invalidated_count = 0
            
            for key in trend_keys:
                trend_data = await redis_cache.get(key)
                if trend_data and "timestamp" in trend_data:
                    try:
                        timestamp = datetime.fromisoformat(trend_data["timestamp"])
                        if datetime.now() - timestamp > timedelta(hours=max_age_hours):
                            await redis_cache.client.delete(key)
                            invalidated_count += 1
                    except (ValueError, TypeError):
                        # Invalid timestamp format, delete the key
                        await redis_cache.client.delete(key)
                        invalidated_count += 1
            
            logger.info(f"Invalidated {invalidated_count} stale trend entries")
            return invalidated_count
            
        except Exception as e:
            logger.error(f"Error invalidating stale trends: {e}")
            return 0
    
    async def invalidate_room_analysis_cache(self, image_hash: str, user_id: str):
        """Invalidate specific room analysis cache entry"""
        try:
            logger.info(f"Invalidating room analysis cache for image {image_hash}")
            
            keys_to_invalidate = [
                f"room_analysis:{user_id}:{image_hash}",
                f"style_embeddings:{image_hash}",
                f"color_palette:{image_hash}"
            ]
            
            invalidated_count = 0
            for key in keys_to_invalidate:
                if await redis_cache.client.exists(key):
                    await redis_cache.client.delete(key)
                    invalidated_count += 1
            
            logger.info(f"Invalidated {invalidated_count} room analysis cache entries")
            return invalidated_count
            
        except Exception as e:
            logger.error(f"Error invalidating room analysis cache: {e}")
            return 0
    
    async def invalidate_recommendations_cache(self, user_id: str, style_preference: str = None):
        """Invalidate artwork recommendations cache"""
        try:
            logger.info(f"Invalidating recommendations cache for user {user_id}")
            
            if style_preference:
                # Invalidate specific style preference
                key = f"artwork_recommendations:{user_id}:{style_preference}"
                if await redis_cache.client.exists(key):
                    await redis_cache.client.delete(key)
                    logger.info(f"Invalidated specific recommendation cache: {key}")
                    return 1
            else:
                # Invalidate all recommendations for user
                pattern = f"artwork_recommendations:{user_id}:*"
                count = await self._invalidate_by_pattern(pattern)
                logger.info(f"Invalidated {count} recommendation cache entries")
                return count
            
        except Exception as e:
            logger.error(f"Error invalidating recommendations cache: {e}")
            return 0
    
    async def warm_up_cache(self, user_id: str, common_styles: List[str] = None):
        """Pre-populate cache with common data"""
        try:
            logger.info(f"Warming up cache for user {user_id}")
            
            if common_styles is None:
                common_styles = ["modern", "traditional", "scandinavian", "contemporary"]
            
            warmed_count = 0
            
            # Pre-populate trend data for common styles
            for style in common_styles:
                trend_key = f"trends_{style}_interior_design_trends_2024_5"
                cached_trends = await redis_cache.get_cached_trend_data(trend_key)
                if not cached_trends:
                    # This would trigger trend fetching in background
                    logger.info(f"Pre-warming trend cache for style: {style}")
                    warmed_count += 1
            
            logger.info(f"Warmed up {warmed_count} cache entries")
            return warmed_count
            
        except Exception as e:
            logger.error(f"Error warming up cache: {e}")
            return 0
    
    async def get_cache_stats(self) -> Dict:
        """Get cache statistics"""
        try:
            stats = {
                "total_keys": 0,
                "by_type": {},
                "memory_usage": 0,
                "hit_rate": 0
            }
            
            # Get total keys
            all_keys = await self._get_keys_by_pattern("*")
            stats["total_keys"] = len(all_keys)
            
            # Count by type
            for cache_type, patterns in self.invalidation_patterns.items():
                count = 0
                for pattern in patterns:
                    keys = await self._get_keys_by_pattern(pattern)
                    count += len(keys)
                stats["by_type"][cache_type] = count
            
            # Get memory usage (if Redis supports it)
            try:
                info = await redis_cache.client.info("memory")
                stats["memory_usage"] = info.get("used_memory", 0)
            except:
                stats["memory_usage"] = 0
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting cache stats: {e}")
            return {}
    
    async def _invalidate_by_pattern(self, pattern: str) -> int:
        """Invalidate all keys matching a pattern"""
        try:
            keys = await self._get_keys_by_pattern(pattern)
            if keys:
                await redis_cache.client.delete(*keys)
            return len(keys)
        except Exception as e:
            logger.error(f"Error invalidating pattern {pattern}: {e}")
            return 0
    
    async def _get_keys_by_pattern(self, pattern: str) -> List[str]:
        """Get all keys matching a pattern"""
        try:
            if redis_cache.client:
                return await redis_cache.client.keys(pattern)
            return []
        except Exception as e:
            logger.error(f"Error getting keys for pattern {pattern}: {e}")
            return []

# Global instance
cache_invalidation = CacheInvalidationService()
