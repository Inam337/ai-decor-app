import redis.asyncio as redis
import json
import logging
from typing import Any, Optional, Dict, List
from datetime import timedelta
import hashlib
import os
from functools import wraps

logger = logging.getLogger(__name__)

class RedisCache:
    """Redis caching service for AI decor application"""
    
    def __init__(self):
        """Initialize Redis connection"""
        self.client = None
        self.is_connected = False
        
        # Redis configuration
        self.host = os.getenv('REDIS_HOST', 'localhost')
        self.port = int(os.getenv('REDIS_PORT', 6379))
        self.password = os.getenv('REDIS_PASSWORD', None)
        self.db = int(os.getenv('REDIS_DB', 0))
        
        # Cache TTL settings (in seconds)
        self.ttl_settings = {
            'room_analysis': 3600,      # 1 hour
            'trend_data': 1800,         # 30 minutes
            'artwork_recommendations': 7200,  # 2 hours
            'user_preferences': 86400,  # 24 hours
            'style_embeddings': 14400,  # 4 hours
            'color_palette': 1800,      # 30 minutes
            'location_data': 3600,      # 1 hour
            'session_data': 7200,       # 2 hours
        }
    
    async def connect(self):
        """Establish Redis connection"""
        try:
            self.client = redis.Redis(
                host=self.host,
                port=self.port,
                password=self.password,
                db=self.db,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5,
                retry_on_timeout=True
            )
            
            # Test connection
            await self.client.ping()
            self.is_connected = True
            logger.info(f"Redis connected successfully to {self.host}:{self.port}")
            
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            self.is_connected = False
            self.client = None
    
    async def disconnect(self):
        """Close Redis connection"""
        if self.client:
            await self.client.close()
            self.is_connected = False
            logger.info("Redis connection closed")
    
    def _generate_cache_key(self, prefix: str, *args) -> str:
        """Generate a consistent cache key"""
        # Create a hash of all arguments for consistent key generation
        key_data = f"{prefix}:{':'.join(str(arg) for arg in args)}"
        return hashlib.md5(key_data.encode()).hexdigest()
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self.is_connected:
            return None
        
        try:
            value = await self.client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            logger.error(f"Error getting cache key {key}: {e}")
            return None
    
    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """Set value in cache with optional TTL"""
        if not self.is_connected:
            return False
        
        try:
            serialized_value = json.dumps(value, default=str)
            if ttl:
                await self.client.setex(key, ttl, serialized_value)
            else:
                await self.client.set(key, serialized_value)
            return True
        except Exception as e:
            logger.error(f"Error setting cache key {key}: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete key from cache"""
        if not self.is_connected:
            return False
        
        try:
            await self.client.delete(key)
            return True
        except Exception as e:
            logger.error(f"Error deleting cache key {key}: {e}")
            return False
    
    async def exists(self, key: str) -> bool:
        """Check if key exists in cache"""
        if not self.is_connected:
            return False
        
        try:
            return await self.client.exists(key) > 0
        except Exception as e:
            logger.error(f"Error checking cache key {key}: {e}")
            return False
    
    async def get_or_set(self, key: str, func, ttl: Optional[int] = None, *args, **kwargs) -> Any:
        """Get from cache or set if not exists"""
        # Try to get from cache first
        cached_value = await self.get(key)
        if cached_value is not None:
            logger.debug(f"Cache hit for key: {key}")
            return cached_value
        
        # Cache miss, execute function and cache result
        logger.debug(f"Cache miss for key: {key}")
        try:
            if asyncio.iscoroutinefunction(func):
                result = await func(*args, **kwargs)
            else:
                result = func(*args, **kwargs)
            
            # Cache the result
            await self.set(key, result, ttl)
            return result
        except Exception as e:
            logger.error(f"Error in get_or_set for key {key}: {e}")
            raise
    
    # Specialized cache methods for different data types
    
    async def cache_room_analysis(self, image_hash: str, user_id: str, analysis_result: Dict) -> bool:
        """Cache room analysis result"""
        key = self._generate_cache_key('room_analysis', image_hash, user_id)
        ttl = self.ttl_settings['room_analysis']
        return await self.set(key, analysis_result, ttl)
    
    async def get_cached_room_analysis(self, image_hash: str, user_id: str) -> Optional[Dict]:
        """Get cached room analysis result"""
        key = self._generate_cache_key('room_analysis', image_hash, user_id)
        return await self.get(key)
    
    async def cache_trend_data(self, query: str, trend_data: List[Dict]) -> bool:
        """Cache trend intelligence data"""
        key = self._generate_cache_key('trend_data', query)
        ttl = self.ttl_settings['trend_data']
        return await self.set(key, trend_data, ttl)
    
    async def get_cached_trend_data(self, query: str) -> Optional[List[Dict]]:
        """Get cached trend data"""
        key = self._generate_cache_key('trend_data', query)
        return await self.get(key)
    
    async def cache_artwork_recommendations(self, user_id: str, style_preferences: str, recommendations: List[Dict]) -> bool:
        """Cache artwork recommendations"""
        key = self._generate_cache_key('artwork_recommendations', user_id, style_preferences)
        ttl = self.ttl_settings['artwork_recommendations']
        return await self.set(key, recommendations, ttl)
    
    async def get_cached_artwork_recommendations(self, user_id: str, style_preferences: str) -> Optional[List[Dict]]:
        """Get cached artwork recommendations"""
        key = self._generate_cache_key('artwork_recommendations', user_id, style_preferences)
        return await self.get(key)
    
    async def cache_user_preferences(self, user_id: str, preferences: Dict) -> bool:
        """Cache user preferences"""
        key = self._generate_cache_key('user_preferences', user_id)
        ttl = self.ttl_settings['user_preferences']
        return await self.set(key, preferences, ttl)
    
    async def get_cached_user_preferences(self, user_id: str) -> Optional[Dict]:
        """Get cached user preferences"""
        key = self._generate_cache_key('user_preferences', user_id)
        return await self.get(key)
    
    async def cache_style_embeddings(self, image_hash: str, embeddings: List[float]) -> bool:
        """Cache style embeddings"""
        key = self._generate_cache_key('style_embeddings', image_hash)
        ttl = self.ttl_settings['style_embeddings']
        return await self.set(key, embeddings, ttl)
    
    async def get_cached_style_embeddings(self, image_hash: str) -> Optional[List[float]]:
        """Get cached style embeddings"""
        key = self._generate_cache_key('style_embeddings', image_hash)
        return await self.get(key)
    
    async def cache_color_palette(self, image_hash: str, color_palette: List[Dict]) -> bool:
        """Cache color palette analysis"""
        key = self._generate_cache_key('color_palette', image_hash)
        ttl = self.ttl_settings['color_palette']
        return await self.set(key, color_palette, ttl)
    
    async def get_cached_color_palette(self, image_hash: str) -> Optional[List[Dict]]:
        """Get cached color palette"""
        key = self._generate_cache_key('color_palette', image_hash)
        return await self.get(key)
    
    async def cache_location_data(self, location: str, data: Dict) -> bool:
        """Cache location-based data"""
        key = self._generate_cache_key('location_data', location)
        ttl = self.ttl_settings['location_data']
        return await self.set(key, data, ttl)
    
    async def get_cached_location_data(self, location: str) -> Optional[Dict]:
        """Get cached location data"""
        key = self._generate_cache_key('location_data', location)
        return await self.get(key)
    
    async def cache_session_data(self, session_id: str, session_data: Dict) -> bool:
        """Cache session data"""
        key = self._generate_cache_key('session_data', session_id)
        ttl = self.ttl_settings['session_data']
        return await self.set(key, session_data, ttl)
    
    async def get_cached_session_data(self, session_id: str) -> Optional[Dict]:
        """Get cached session data"""
        key = self._generate_cache_key('session_data', session_id)
        return await self.get(key)
    
    async def invalidate_user_cache(self, user_id: str) -> bool:
        """Invalidate all cache entries for a specific user"""
        if not self.is_connected:
            return False
        
        try:
            # Get all keys with user_id pattern
            pattern = f"*:{user_id}*"
            keys = await self.client.keys(pattern)
            
            if keys:
                await self.client.delete(*keys)
                logger.info(f"Invalidated {len(keys)} cache entries for user {user_id}")
            
            return True
        except Exception as e:
            logger.error(f"Error invalidating user cache for {user_id}: {e}")
            return False
    
    async def get_cache_stats(self) -> Dict:
        """Get cache statistics"""
        if not self.is_connected:
            return {"status": "disconnected"}
        
        try:
            info = await self.client.info()
            return {
                "status": "connected",
                "used_memory": info.get("used_memory_human", "N/A"),
                "connected_clients": info.get("connected_clients", 0),
                "total_commands_processed": info.get("total_commands_processed", 0),
                "keyspace_hits": info.get("keyspace_hits", 0),
                "keyspace_misses": info.get("keyspace_misses", 0),
                "hit_rate": self._calculate_hit_rate(info)
            }
        except Exception as e:
            logger.error(f"Error getting cache stats: {e}")
            return {"status": "error", "error": str(e)}
    
    def _calculate_hit_rate(self, info: Dict) -> float:
        """Calculate cache hit rate"""
        hits = info.get("keyspace_hits", 0)
        misses = info.get("keyspace_misses", 0)
        total = hits + misses
        
        if total == 0:
            return 0.0
        
        return round((hits / total) * 100, 2)

# Cache decorator for easy function caching
def cache_result(cache_type: str, ttl: Optional[int] = None):
    """Decorator to cache function results"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key from function name and arguments
            cache_key = f"{cache_type}:{func.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache
            cached_result = await redis_cache.get(cache_key)
            if cached_result is not None:
                logger.debug(f"Cache hit for {func.__name__}")
                return cached_result
            
            # Execute function and cache result
            logger.debug(f"Cache miss for {func.__name__}")
            result = await func(*args, **kwargs)
            
            # Cache the result
            await redis_cache.set(cache_key, result, ttl)
            return result
        
        return wrapper
    return decorator

# Global Redis cache instance
redis_cache = RedisCache()
