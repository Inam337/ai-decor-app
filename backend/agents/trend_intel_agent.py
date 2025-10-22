import logging
from typing import List, Dict, Optional
import json
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class TrendIntelAgent:
    def __init__(self):
        """Initialize trend agent with mock capabilities"""
        logger.info("Trend Intel Agent initialized (mock mode)")
    
    async def search_trending_styles(self, query: str, max_results: int = 10) -> List[Dict]:
        """Mock search for trending interior design styles"""
        try:
            logger.info(f"Mock searching trending styles: {query}")
            
            # Return mock trending styles
            trends = [
                {
                    "title": "Minimalist Scandinavian Design",
                    "content": "Clean lines, neutral colors, and natural materials continue to dominate interior design trends.",
                    "relevance_score": 0.9,
                    "trend_type": "style"
                },
                {
                    "title": "Sustainable Eco-Friendly Decor",
                    "content": "Biophilic design and sustainable materials are gaining popularity in home decor.",
                    "relevance_score": 0.8,
                    "trend_type": "material"
                },
                {
                    "title": "Warm Earth Tones",
                    "content": "Terracotta, sage green, and warm beiges are replacing cool grays in color palettes.",
                    "relevance_score": 0.85,
                    "trend_type": "color"
                },
                {
                    "title": "Mixed Metal Finishes",
                    "content": "Combining different metal finishes like brass and matte black creates visual interest.",
                    "relevance_score": 0.75,
                    "trend_type": "finish"
                },
                {
                    "title": "Curved Furniture",
                    "content": "Soft, rounded furniture shapes are replacing sharp, angular designs.",
                    "relevance_score": 0.7,
                    "trend_type": "form"
                }
            ]
            
            return trends[:max_results]
            
        except Exception as e:
            logger.error(f"Error searching trending styles: {e}")
            return []
    
    async def analyze_style_evolution(self, user_profile: Dict) -> Dict:
        """Mock analysis of style evolution"""
        try:
            logger.info("Mock analyzing style evolution")
            
            # Extract user preferences
            preferences = user_profile.get("preferences", {})
            current_style = preferences.get("aesthetic_style", "modern")
            
            evolution_insights = f"Based on current trends, your {current_style} style could benefit from incorporating warm earth tones, textured accents, and sustainable materials. Consider adding curved furniture pieces and mixed metal finishes to stay current while maintaining your personal aesthetic."
            
            return {
                "evolution_insights": evolution_insights,
                "trending_complements": self._extract_trending_complements(current_style),
                "seasonal_adaptations": self._get_seasonal_adaptations(),
                "analysis_timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error analyzing style evolution: {e}")
            return self._get_fallback_evolution()
    
    def _extract_trending_complements(self, current_style: str) -> List[str]:
        """Extract trending elements that complement current style"""
        style_complements = {
            "modern": ["curved accent pieces", "warm wood textures", "mixed metal finishes"],
            "traditional": ["contemporary lighting", "geometric patterns", "bold accent colors"],
            "scandinavian": ["textured textiles", "warm earth tones", "natural materials"],
            "industrial": ["soft textiles", "warm lighting", "plant elements"],
            "bohemian": ["structured elements", "neutral base colors", "modern furniture"],
            "contemporary": ["vintage accents", "natural textures", "artisanal pieces"]
        }
        
        return style_complements.get(current_style.lower(), ["mixed textures", "accent lighting", "artwork"])
    
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
        """Mock local trends"""
        try:
            logger.info(f"Mock getting local trends for {location}")
            
            return [
                {
                    "title": "Regional Material Preferences",
                    "content": "Local materials and traditional crafts are being incorporated into modern designs.",
                    "relevance_score": 0.8,
                    "trend_type": "material"
                },
                {
                    "title": "Climate-Adapted Design",
                    "content": "Designs adapted to local climate conditions and seasonal changes.",
                    "relevance_score": 0.75,
                    "trend_type": "functional"
                }
            ]
            
        except Exception as e:
            logger.error(f"Error getting local trends: {e}")
            return []

# Global instance
trend_agent = TrendIntelAgent()