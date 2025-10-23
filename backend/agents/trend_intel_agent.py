import logging
from typing import List, Dict, Optional
import json
import asyncio
import aiohttp
import requests
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import re
from collections import Counter
import os
from cache import redis_cache

logger = logging.getLogger(__name__)

class TrendIntelAgent:
    def __init__(self):
        """Initialize trend agent with real-time capabilities"""
        logger.info("Trend Intel Agent initialized with real-time capabilities")
        
        # Trend sources configuration
        self.trend_sources = {
            "pinterest": "https://www.pinterest.com/search/pins/?q=interior%20design%20trends%202024",
            "instagram": "https://www.instagram.com/explore/tags/interiordesign/",
            "design_blogs": [
                "https://www.architecturaldigest.com/story/interior-design-trends",
                "https://www.housebeautiful.com/design/decorating/a123456789/design-trends/",
                "https://www.apartmenttherapy.com/design-trends-2024"
            ],
            "art_sources": [
                "https://www.artsy.net/trending",
                "https://www.saatchiart.com/trending",
                "https://www.artnet.com/news/art-market/"
            ]
        }
        
        # Style evolution patterns
        self.style_evolution_patterns = {
            "modern": {
                "emerging": ["warm minimalism", "biophilic design", "curved furniture"],
                "declining": ["cold grays", "sharp angles", "sterile spaces"],
                "stable": ["clean lines", "neutral palettes", "functional design"]
            },
            "traditional": {
                "emerging": ["modern traditional", "mixed metals", "bold patterns"],
                "declining": ["heavy drapery", "dark woods", "formal arrangements"],
                "stable": ["classic proportions", "quality materials", "timeless appeal"]
            },
            "scandinavian": {
                "emerging": ["hygge elements", "warm textures", "sustainable materials"],
                "declining": ["pure white", "minimal accessories", "cold finishes"],
                "stable": ["natural light", "functional furniture", "cozy atmosphere"]
            }
        }
        
        # Cache for trend data
        self.trend_cache = {}
        self.cache_duration = timedelta(hours=6)  # Cache trends for 6 hours
    
    async def search_trending_styles(self, query: str, max_results: int = 10) -> List[Dict]:
        """Real-time search for trending interior design styles with Redis caching"""
        try:
            logger.info(f"Searching trending styles: {query}")
            
            # Check Redis cache first
            cache_key = f"trends_{query}_{max_results}"
            cached_trends = await redis_cache.get_cached_trend_data(cache_key)
            if cached_trends:
                logger.info("Returning cached trend data from Redis")
                return cached_trends.get("data", [])
            
            # Check local cache as fallback
            if self._is_cache_valid(cache_key):
                logger.info("Returning cached trend data from local cache")
                return self.trend_cache[cache_key]["data"]
            
            # Fetch trends from multiple sources
            trends = await self._fetch_trends_from_sources(query)
            
            # Process and rank trends
            processed_trends = self._process_and_rank_trends(trends, query)
            
            # Cache results in both Redis and local cache
            trend_data = {
                "data": processed_trends[:max_results],
                "timestamp": datetime.now().isoformat(),
                "query": query,
                "max_results": max_results
            }
            
            # Cache in Redis (6 hours TTL)
            await redis_cache.cache_trend_data(cache_key, trend_data, ttl=21600)
            
            # Cache locally as backup
            self.trend_cache[cache_key] = {
                "data": processed_trends[:max_results],
                "timestamp": datetime.now()
            }
            
            logger.info(f"Found {len(processed_trends)} trending styles and cached in Redis")
            return processed_trends[:max_results]
            
        except Exception as e:
            logger.error(f"Error searching trending styles: {e}")
            return self._get_fallback_trends()
    
    async def _fetch_trends_from_sources(self, query: str) -> List[Dict]:
        """Fetch trends from multiple online sources"""
        trends = []
        
        try:
            # Fetch from design blogs
            blog_trends = await self._scrape_design_blogs(query)
            trends.extend(blog_trends)
            
            # Fetch from art sources
            art_trends = await self._scrape_art_sources(query)
            trends.extend(art_trends)
            
            # Fetch from social media APIs (simulated)
            social_trends = await self._fetch_social_trends(query)
            trends.extend(social_trends)
            
        except Exception as e:
            logger.error(f"Error fetching trends from sources: {e}")
        
        return trends
    
    async def _scrape_design_blogs(self, query: str) -> List[Dict]:
        """Scrape design blogs for trending styles"""
        trends = []
        
        try:
            for blog_url in self.trend_sources["design_blogs"]:
                try:
                    response = requests.get(blog_url, timeout=10)
                    if response.status_code == 200:
                        soup = BeautifulSoup(response.content, 'html.parser')
                        
                        # Extract trend information
                        articles = soup.find_all(['article', 'div'], class_=re.compile(r'(article|post|trend)', re.I))
                        
                        for article in articles[:5]:  # Limit to 5 articles per blog
                            title_elem = article.find(['h1', 'h2', 'h3', 'h4'])
                            content_elem = article.find(['p', 'div'], class_=re.compile(r'(content|excerpt|summary)', re.I))
                            
                            if title_elem and content_elem:
                                title = title_elem.get_text(strip=True)
                                content = content_elem.get_text(strip=True)[:200] + "..."
                                
                                # Calculate relevance score
                                relevance_score = self._calculate_relevance_score(title + " " + content, query)
                                
                                if relevance_score > 0.3:  # Only include relevant trends
                                    trends.append({
                                        "title": title,
                                        "content": content,
                                        "relevance_score": relevance_score,
                                        "trend_type": self._classify_trend_type(title + " " + content),
                                        "source": "design_blog",
                                        "url": blog_url
                                    })
                
                except Exception as e:
                    logger.warning(f"Error scraping blog {blog_url}: {e}")
                    continue
        
        except Exception as e:
            logger.error(f"Error scraping design blogs: {e}")
        
        return trends
    
    async def _scrape_art_sources(self, query: str) -> List[Dict]:
        """Scrape art sources for trending styles"""
        trends = []
        
        try:
            for art_url in self.trend_sources["art_sources"]:
                try:
                    response = requests.get(art_url, timeout=10)
                    if response.status_code == 200:
                        soup = BeautifulSoup(response.content, 'html.parser')
                        
                        # Look for art trend information
                        trend_elements = soup.find_all(['div', 'article'], class_=re.compile(r'(trend|style|artwork)', re.I))
                        
                        for element in trend_elements[:3]:  # Limit to 3 per source
                            title_elem = element.find(['h1', 'h2', 'h3', 'h4'])
                            content_elem = element.find(['p', 'span'])
                            
                            if title_elem:
                                title = title_elem.get_text(strip=True)
                                content = content_elem.get_text(strip=True) if content_elem else ""
                                
                                relevance_score = self._calculate_relevance_score(title + " " + content, query)
                                
                                if relevance_score > 0.4:  # Higher threshold for art trends
                                    trends.append({
                                        "title": title,
                                        "content": content,
                                        "relevance_score": relevance_score,
                                        "trend_type": "art",
                                        "source": "art_source",
                                        "url": art_url
                                    })
                
                except Exception as e:
                    logger.warning(f"Error scraping art source {art_url}: {e}")
                    continue
        
        except Exception as e:
            logger.error(f"Error scraping art sources: {e}")
        
        return trends
    
    async def _fetch_social_trends(self, query: str) -> List[Dict]:
        """Fetch trends from social media (simulated API calls)"""
        trends = []
        
        try:
            # Simulate social media trend data
            # In a real implementation, you would use Instagram API, Pinterest API, etc.
            social_trends_data = [
                {
                    "title": "Biophilic Design Surge",
                    "content": "Plant-filled spaces and natural materials are trending across social media platforms.",
                    "relevance_score": 0.9,
                    "trend_type": "style",
                    "source": "social_media",
                    "engagement_score": 0.85
                },
                {
                    "title": "Warm Minimalism",
                    "content": "Soft, warm minimalism is replacing cold, stark minimalism in interior design.",
                    "relevance_score": 0.8,
                    "trend_type": "style",
                    "source": "social_media",
                    "engagement_score": 0.78
                },
                {
                    "title": "Sustainable Decor",
                    "content": "Eco-friendly and upcycled decor items are gaining popularity.",
                    "relevance_score": 0.75,
                    "trend_type": "material",
                    "source": "social_media",
                    "engagement_score": 0.72
                }
            ]
            
            # Filter by query relevance
            for trend in social_trends_data:
                if self._calculate_relevance_score(trend["title"] + " " + trend["content"], query) > 0.3:
                    trends.append(trend)
        
        except Exception as e:
            logger.error(f"Error fetching social trends: {e}")
        
        return trends
    
    def _calculate_relevance_score(self, text: str, query: str) -> float:
        """Calculate relevance score between text and query"""
        try:
            text_lower = text.lower()
            query_lower = query.lower()
            
            # Simple keyword matching
            query_words = query_lower.split()
            matches = sum(1 for word in query_words if word in text_lower)
            
            # Calculate score based on matches and text length
            score = matches / len(query_words) if query_words else 0
            
            # Boost score for design-related keywords
            design_keywords = ["design", "interior", "decor", "style", "trend", "art", "furniture"]
            design_matches = sum(1 for keyword in design_keywords if keyword in text_lower)
            score += design_matches * 0.1
            
            return min(score, 1.0)
        
        except Exception as e:
            logger.error(f"Error calculating relevance score: {e}")
            return 0.0
    
    def _classify_trend_type(self, text: str) -> str:
        """Classify the type of trend based on text content"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ["color", "palette", "hue", "tone"]):
            return "color"
        elif any(word in text_lower for word in ["furniture", "chair", "table", "sofa"]):
            return "furniture"
        elif any(word in text_lower for word in ["material", "wood", "metal", "fabric"]):
            return "material"
        elif any(word in text_lower for word in ["lighting", "lamp", "fixture"]):
            return "lighting"
        elif any(word in text_lower for word in ["art", "painting", "sculpture", "print"]):
            return "art"
        else:
            return "style"
    
    def _process_and_rank_trends(self, trends: List[Dict], query: str) -> List[Dict]:
        """Process and rank trends by relevance and popularity"""
        try:
            # Remove duplicates based on title similarity
            unique_trends = self._remove_duplicate_trends(trends)
            
            # Sort by relevance score
            unique_trends.sort(key=lambda x: x["relevance_score"], reverse=True)
            
            # Add trend momentum (simulated)
            for trend in unique_trends:
                trend["momentum"] = self._calculate_trend_momentum(trend)
                trend["final_score"] = trend["relevance_score"] * 0.7 + trend["momentum"] * 0.3
            
            # Sort by final score
            unique_trends.sort(key=lambda x: x["final_score"], reverse=True)
            
            return unique_trends
            
        except Exception as e:
            logger.error(f"Error processing trends: {e}")
            return trends
    
    def _remove_duplicate_trends(self, trends: List[Dict]) -> List[Dict]:
        """Remove duplicate trends based on title similarity"""
        unique_trends = []
        seen_titles = set()
        
        for trend in trends:
            title_lower = trend["title"].lower()
            
            # Check if similar title already exists
            is_duplicate = False
            for seen_title in seen_titles:
                if self._titles_similar(title_lower, seen_title):
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                unique_trends.append(trend)
                seen_titles.add(title_lower)
        
        return unique_trends
    
    def _titles_similar(self, title1: str, title2: str) -> bool:
        """Check if two titles are similar"""
        words1 = set(title1.split())
        words2 = set(title2.split())
        
        # If more than 70% of words overlap, consider them similar
        overlap = len(words1.intersection(words2))
        total_words = len(words1.union(words2))
        
        return overlap / total_words > 0.7 if total_words > 0 else False
    
    def _calculate_trend_momentum(self, trend: Dict) -> float:
        """Calculate trend momentum based on various factors"""
        momentum = 0.5  # Base momentum
        
        # Boost for recent trends
        if "2024" in trend.get("title", "") or "2024" in trend.get("content", ""):
            momentum += 0.2
        
        # Boost for social media trends
        if trend.get("source") == "social_media":
            momentum += 0.1
        
        # Boost for high engagement
        if "engagement_score" in trend and trend["engagement_score"] > 0.8:
            momentum += 0.1
        
        return min(momentum, 1.0)
    
    def _is_cache_valid(self, cache_key: str) -> bool:
        """Check if cached data is still valid"""
        if cache_key not in self.trend_cache:
            return False
        
        cache_time = self.trend_cache[cache_key]["timestamp"]
        return datetime.now() - cache_time < self.cache_duration
    
    def _get_fallback_trends(self) -> List[Dict]:
        """Fallback trends when real-time fetching fails"""
        return [
            {
                "title": "Minimalist Scandinavian Design",
                "content": "Clean lines, neutral colors, and natural materials continue to dominate interior design trends.",
                "relevance_score": 0.9,
                "trend_type": "style",
                "source": "fallback"
            },
            {
                "title": "Sustainable Eco-Friendly Decor",
                "content": "Biophilic design and sustainable materials are gaining popularity in home decor.",
                "relevance_score": 0.8,
                "trend_type": "material",
                "source": "fallback"
            },
            {
                "title": "Warm Earth Tones",
                "content": "Terracotta, sage green, and warm beiges are replacing cool grays in color palettes.",
                "relevance_score": 0.85,
                "trend_type": "color",
                "source": "fallback"
            }
        ]
    
    async def analyze_style_evolution(self, user_profile: Dict) -> Dict:
        """Real analysis of style evolution based on current trends with Redis caching"""
        try:
            logger.info("Analyzing style evolution based on current trends")
            
            # Extract user preferences
            preferences = user_profile.get("preferences", {})
            current_style = preferences.get("aesthetic_style", "modern")
            
            # Check Redis cache first
            cache_key = f"style_evolution_{current_style}_{hash(str(preferences))}"
            cached_evolution = await redis_cache.get_cached_trend_data(cache_key)
            if cached_evolution:
                logger.info("Returning cached style evolution from Redis")
                return cached_evolution
            
            # Get current trends for the user's style
            trend_query = f"{current_style} interior design trends 2024"
            current_trends = await self.search_trending_styles(trend_query, max_results=5)
            
            # Analyze style evolution patterns
            evolution_insights = self._generate_evolution_insights(current_style, current_trends, preferences)
            
            # Get trending complements
            trending_complements = self._extract_trending_complements(current_style, current_trends)
            
            # Get seasonal adaptations
            seasonal_adaptations = self._get_seasonal_adaptations()
            
            # Get local trends if location is provided
            location = user_profile.get("location")
            local_trends = await self.get_local_trends(location) if location else []
            
            evolution_result = {
                "evolution_insights": evolution_insights,
                "trending_complements": trending_complements,
                "seasonal_adaptations": seasonal_adaptations,
                "local_trends": local_trends,
                "current_trends": current_trends,
                "style_evolution_score": self._calculate_evolution_score(current_style, current_trends),
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            # Cache the result in Redis (4 hours TTL)
            await redis_cache.cache_trend_data(cache_key, evolution_result, ttl=14400)
            logger.info("Cached style evolution analysis in Redis")
            
            return evolution_result
            
        except Exception as e:
            logger.error(f"Error analyzing style evolution: {e}")
            return self._get_fallback_evolution()
    
    def _generate_evolution_insights(self, current_style: str, trends: List[Dict], preferences: Dict) -> str:
        """Generate personalized evolution insights"""
        try:
            insights_parts = []
            
            # Base insight about current style
            insights_parts.append(f"Your {current_style} style is evolving with current trends.")
            
            # Analyze trend patterns
            trend_types = [trend.get("trend_type", "style") for trend in trends]
            trend_counter = Counter(trend_types)
            
            # Most prominent trend type
            if trend_counter:
                dominant_trend = trend_counter.most_common(1)[0][0]
                insights_parts.append(f"The dominant trend for {current_style} styles is {dominant_trend}.")
            
            # Specific trend recommendations
            relevant_trends = [trend for trend in trends if trend.get("relevance_score", 0) > 0.7]
            if relevant_trends:
                top_trend = relevant_trends[0]
                insights_parts.append(f"Consider incorporating {top_trend['title'].lower()} to stay current.")
            
            # Color preferences evolution
            color_trends = [trend for trend in trends if trend.get("trend_type") == "color"]
            if color_trends:
                color_trend = color_trends[0]
                insights_parts.append(f"Color trends suggest {color_trend['content'][:100]}...")
            
            # Material preferences
            material_trends = [trend for trend in trends if trend.get("trend_type") == "material"]
            if material_trends:
                material_trend = material_trends[0]
                insights_parts.append(f"Material trends indicate {material_trend['content'][:100]}...")
            
            return " ".join(insights_parts)
            
        except Exception as e:
            logger.error(f"Error generating evolution insights: {e}")
            return f"Your {current_style} style can benefit from incorporating current trends like warm earth tones, sustainable materials, and mixed textures."
    
    def _extract_trending_complements(self, current_style: str, trends: List[Dict]) -> List[str]:
        """Extract trending elements that complement current style"""
        try:
            complements = []
            
            # Get base complements from style patterns
            base_complements = self.style_evolution_patterns.get(current_style.lower(), {}).get("emerging", [])
            complements.extend(base_complements)
            
            # Add complements from current trends
            for trend in trends:
                if trend.get("relevance_score", 0) > 0.6:
                    trend_type = trend.get("trend_type", "style")
                    title = trend.get("title", "")
                    
                    # Extract key elements from trend titles
                    if trend_type == "color":
                        complements.append(f"{title.lower()} color palette")
                    elif trend_type == "material":
                        complements.append(f"{title.lower()} materials")
                    elif trend_type == "furniture":
                        complements.append(f"{title.lower()} furniture")
                    elif trend_type == "art":
                        complements.append(f"{title.lower()} artwork")
            
            # Remove duplicates and limit results
            unique_complements = list(set(complements))
            return unique_complements[:8]  # Limit to 8 complements
            
        except Exception as e:
            logger.error(f"Error extracting trending complements: {e}")
            return self.style_evolution_patterns.get(current_style.lower(), {}).get("emerging", ["mixed textures", "accent lighting", "artwork"])
    
    def _calculate_evolution_score(self, current_style: str, trends: List[Dict]) -> float:
        """Calculate how well the user's style aligns with current trends"""
        try:
            if not trends:
                return 0.5  # Neutral score if no trends
            
            # Calculate average relevance score
            avg_relevance = sum(trend.get("relevance_score", 0) for trend in trends) / len(trends)
            
            # Calculate trend momentum
            avg_momentum = sum(trend.get("momentum", 0.5) for trend in trends) / len(trends)
            
            # Calculate final evolution score
            evolution_score = (avg_relevance * 0.6) + (avg_momentum * 0.4)
            
            return round(evolution_score, 3)
            
        except Exception as e:
            logger.error(f"Error calculating evolution score: {e}")
            return 0.5
    
    def _get_seasonal_adaptations(self) -> Dict:
        """Get seasonal adaptation suggestions"""
        current_month = datetime.now().month
        
        if current_month in [12, 1, 2]:  # Winter
            return {
                "season": "winter",
                "suggestions": ["warm textiles", "cozy lighting", "rich colors", "layered textures"]
            }
        elif current_month in [3, 4, 5]:  # Spring
            return {
                "season": "spring",
                "suggestions": ["fresh greenery", "light colors", "natural materials", "airy fabrics"]
            }
        elif current_month in [6, 7, 8]:  # Summer
            return {
                "season": "summer",
                "suggestions": ["cool colors", "lightweight fabrics", "minimal decor", "natural ventilation"]
            }
        else:  # Fall
            return {
                "season": "fall",
                "suggestions": ["warm tones", "textured materials", "cozy elements", "natural accents"]
            }
    
    def _get_fallback_evolution(self) -> Dict:
        """Fallback evolution analysis when AI is unavailable"""
        return {
            "evolution_insights": "Consider incorporating trending elements like warm earth tones, mixed textures, and sustainable materials to keep your space current while maintaining your personal style.",
            "trending_complements": ["textured accents", "warm lighting", "natural materials"],
            "seasonal_adaptations": {
                "season": "current",
                "suggestions": ["layered textures", "accent lighting", "artwork", "plants"]
            },
            "analysis_timestamp": datetime.now().isoformat()
        }
    
    async def get_local_trends(self, location: str) -> List[Dict]:
        """Get location-specific trends"""
        try:
            logger.info(f"Getting local trends for {location}")
            
            if not location:
                return []
            
            # Search for location-specific trends
            location_query = f"{location} interior design trends local style"
            local_trends = await self.search_trending_styles(location_query, max_results=3)
            
            # Add location-specific insights
            enhanced_trends = []
            for trend in local_trends:
                enhanced_trend = trend.copy()
                enhanced_trend["location"] = location
                enhanced_trend["local_relevance"] = self._calculate_local_relevance(trend, location)
                enhanced_trends.append(enhanced_trend)
            
            # Add regional style insights
            regional_insights = self._get_regional_style_insights(location)
            enhanced_trends.extend(regional_insights)
            
            return enhanced_trends
            
        except Exception as e:
            logger.error(f"Error getting local trends: {e}")
            return self._get_fallback_local_trends(location)
    
    def _calculate_local_relevance(self, trend: Dict, location: str) -> float:
        """Calculate how relevant a trend is to a specific location"""
        try:
            location_lower = location.lower()
            trend_text = (trend.get("title", "") + " " + trend.get("content", "")).lower()
            
            # Check for location-specific keywords
            location_keywords = location_lower.split()
            matches = sum(1 for keyword in location_keywords if keyword in trend_text)
            
            # Calculate relevance score
            relevance = matches / len(location_keywords) if location_keywords else 0
            
            # Boost for regional design terms
            regional_terms = ["regional", "local", "traditional", "cultural", "heritage"]
            regional_matches = sum(1 for term in regional_terms if term in trend_text)
            relevance += regional_matches * 0.2
            
            return min(relevance, 1.0)
            
        except Exception as e:
            logger.error(f"Error calculating local relevance: {e}")
            return 0.5
    
    def _get_regional_style_insights(self, location: str) -> List[Dict]:
        """Get regional style insights based on location"""
        try:
            location_lower = location.lower()
            
            # Regional style patterns
            regional_patterns = {
                "california": {
                    "styles": ["mid-century modern", "coastal", "mediterranean"],
                    "materials": ["redwood", "stucco", "tile"],
                    "colors": ["warm neutrals", "ocean blues", "sunset oranges"]
                },
                "new york": {
                    "styles": ["industrial", "contemporary", "art deco"],
                    "materials": ["steel", "concrete", "glass"],
                    "colors": ["grays", "blacks", "bold accents"]
                },
                "texas": {
                    "styles": ["ranch", "southwestern", "rustic"],
                    "materials": ["wood", "stone", "leather"],
                    "colors": ["earth tones", "warm browns", "desert colors"]
                },
                "florida": {
                    "styles": ["tropical", "art deco", "coastal"],
                    "materials": ["rattan", "tile", "light woods"],
                    "colors": ["pastels", "bright colors", "ocean tones"]
                }
            }
            
            # Find matching regional pattern
            regional_info = None
            for region, info in regional_patterns.items():
                if region in location_lower:
                    regional_info = info
                    break
            
            if not regional_info:
                # Default regional insights
                regional_info = {
                    "styles": ["contemporary", "traditional"],
                    "materials": ["wood", "metal"],
                    "colors": ["neutrals", "earth tones"]
                }
            
            # Create regional trend insights
            insights = []
            
            # Style insight
            insights.append({
                "title": f"Regional Style Preferences in {location.title()}",
                "content": f"Local design preferences lean toward {', '.join(regional_info['styles'])} styles, incorporating {', '.join(regional_info['materials'])} materials and {', '.join(regional_info['colors'])} color palettes.",
                "relevance_score": 0.8,
                "trend_type": "regional_style",
                "location": location,
                "local_relevance": 0.9
            })
            
            # Material insight
            insights.append({
                "title": f"Local Material Trends in {location.title()}",
                "content": f"Regional materials like {', '.join(regional_info['materials'])} are being used in innovative ways to create authentic local design.",
                "relevance_score": 0.75,
                "trend_type": "material",
                "location": location,
                "local_relevance": 0.8
            })
            
            return insights
            
        except Exception as e:
            logger.error(f"Error getting regional style insights: {e}")
            return []
    
    def _get_fallback_local_trends(self, location: str) -> List[Dict]:
        """Fallback local trends when real-time fetching fails"""
        return [
            {
                "title": f"Regional Material Preferences in {location.title()}",
                "content": "Local materials and traditional crafts are being incorporated into modern designs.",
                "relevance_score": 0.8,
                "trend_type": "material",
                "location": location,
                "local_relevance": 0.7
            },
            {
                "title": f"Climate-Adapted Design in {location.title()}",
                "content": "Designs adapted to local climate conditions and seasonal changes.",
                "relevance_score": 0.75,
                "trend_type": "functional",
                "location": location,
                "local_relevance": 0.8
            }
        ]

# Global instance
trend_agent = TrendIntelAgent()