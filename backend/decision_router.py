import logging
from typing import Dict, List, Optional
from agents.vision_match_agent import vision_agent
from agents.trend_intel_agent import trend_agent
from agents.geo_finder_agent import geo_agent
from artwork_retrieval import artwork_retrieval
from database import supabase_client
import json
from datetime import datetime

logger = logging.getLogger(__name__)

class DecisionRouter:
    def __init__(self):
        self.vision_agent = vision_agent
        self.trend_agent = trend_agent
        self.geo_agent = geo_agent
        self.artwork_retrieval = artwork_retrieval
        self.supabase_client = supabase_client
    
    async def process_room_analysis(self, image_path: str, user_id: str, location: str = None) -> Dict:
        """Process room analysis using all agents"""
        try:
            # Step 1: Vision analysis
            logger.info("Starting vision analysis")
            room_analysis = self.vision_agent.analyze_room(image_path)
            
            # Step 2: Get user preferences
            user_profile = await self.supabase_client.get_user_profile(user_id)
            user_preferences = user_profile.get("preferences", {}) if user_profile else {}
            
            # Step 3: Get personalized recommendations
            logger.info("Getting personalized recommendations")
            recommendations = self.artwork_retrieval.get_personalized_recommendations(
                room_analysis, user_preferences, k=5
            )
            
            # Step 4: Get trend insights
            logger.info("Getting trend insights")
            trend_insights = await self.trend_agent.analyze_style_evolution(user_preferences)
            
            # Step 5: Get location-based suggestions
            location_suggestions = {}
            if location:
                logger.info("Getting location-based suggestions")
                location_suggestions = self.geo_agent.get_location_based_recommendations(
                    location, user_preferences
                )
            
            # Step 6: Generate final reasoning
            final_reasoning = self._generate_final_reasoning(
                room_analysis, recommendations, trend_insights, user_preferences
            )
            
            # Step 7: Save session
            session_data = {
                "user_id": user_id,
                "room_analysis": room_analysis,
                "recommendations": recommendations,
                "trend_insights": trend_insights,
                "location_suggestions": location_suggestions,
                "final_reasoning": final_reasoning,
                "created_at": datetime.now().isoformat()
            }
            await self.supabase_client.save_session(session_data)
            
            return {
                "success": True,
                "room_analysis": room_analysis,
                "recommendations": recommendations,
                "trend_insights": trend_insights,
                "location_suggestions": location_suggestions,
                "final_reasoning": final_reasoning,
                "session_id": session_data.get("id")
            }
            
        except Exception as e:
            logger.error(f"Error in room analysis processing: {e}")
            return {
                "success": False,
                "error": str(e),
                "recommendations": [],
                "trend_insights": {},
                "location_suggestions": {}
            }
    
    async def process_text_query(self, query: str, user_id: str, location: str = None) -> Dict:
        """Process text-based queries with context awareness"""
        try:
            # Get user preferences
            user_profile = await self.supabase_client.get_user_profile(user_id)
            user_preferences = user_profile.get("preferences", {}) if user_profile else {}
            
            # Get previous search context
            previous_context = await self.supabase_client.get_search_context(user_id)
            
            # Parse query for style preferences
            parsed_query = self._parse_text_query(query)
            
            # Enhance query with context if available
            if previous_context:
                context_data = previous_context.get("context_data", {})
                parsed_query = self._enhance_query_with_context(parsed_query, context_data, query)
                logger.info(f"Enhanced query with context for user {user_id}")
            
            # Get recommendations based on text description
            recommendations = self.artwork_retrieval.get_personalized_recommendations(
                parsed_query, user_preferences, k=5
            )
            
            # Get trend insights
            trend_insights = await self.trend_agent.analyze_style_evolution(user_preferences)
            
            # Get location suggestions
            location_suggestions = {}
            if location:
                location_suggestions = self.geo_agent.get_location_based_recommendations(
                    location, user_preferences
                )
            
            # Generate reasoning
            final_reasoning = self._generate_text_query_reasoning(
                query, recommendations, trend_insights, user_preferences, previous_context
            )
            
            # Save current search context for future reference
            current_context = {
                "query": query,
                "parsed_query": parsed_query,
                "location": location,
                "recommendations": recommendations,
                "trend_insights": trend_insights,
                "location_suggestions": location_suggestions,
                "final_reasoning": final_reasoning,
                "query_type": "text",
                "timestamp": datetime.now().isoformat()
            }
            await self.supabase_client.save_search_context(user_id, current_context)
            
            return {
                "success": True,
                "query": query,
                "parsed_query": parsed_query,
                "recommendations": recommendations,
                "trend_insights": trend_insights,
                "location_suggestions": location_suggestions,
                "final_reasoning": final_reasoning,
                "context_used": previous_context is not None,
                "context_summary": self._get_context_summary(previous_context) if previous_context else None
            }
            
        except Exception as e:
            logger.error(f"Error processing text query: {e}")
            return {
                "success": False,
                "error": str(e),
                "recommendations": [],
                "trend_insights": {},
                "location_suggestions": {}
            }
    
    async def process_voice_query(self, audio_data: str, user_id: str, location: str = None) -> Dict:
        """Process voice queries with context awareness"""
        try:
            # In a real implementation, this would use Whisper to transcribe audio
            # For now, we'll simulate a transcribed query
            transcribed_query = "I need modern wall art for my living room"
            
            # Get user preferences
            user_profile = await self.supabase_client.get_user_profile(user_id)
            user_preferences = user_profile.get("preferences", {}) if user_profile else {}
            
            # Get previous search context
            previous_context = await self.supabase_client.get_search_context(user_id)
            
            # Parse query for style preferences
            parsed_query = self._parse_text_query(transcribed_query)
            
            # Enhance query with context if available
            if previous_context:
                context_data = previous_context.get("context_data", {})
                parsed_query = self._enhance_query_with_context(parsed_query, context_data, transcribed_query)
                logger.info(f"Enhanced voice query with context for user {user_id}")
            
            # Get recommendations based on transcribed query
            recommendations = self.artwork_retrieval.get_personalized_recommendations(
                parsed_query, user_preferences, k=5
            )
            
            # Get trend insights
            trend_insights = await self.trend_agent.analyze_style_evolution(user_preferences)
            
            # Get location suggestions
            location_suggestions = {}
            if location:
                location_suggestions = self.geo_agent.get_location_based_recommendations(
                    location, user_preferences
                )
            
            # Generate reasoning
            final_reasoning = self._generate_text_query_reasoning(
                transcribed_query, recommendations, trend_insights, user_preferences, previous_context
            )
            
            # Save current search context for future reference
            current_context = {
                "query": transcribed_query,
                "parsed_query": parsed_query,
                "location": location,
                "recommendations": recommendations,
                "trend_insights": trend_insights,
                "location_suggestions": location_suggestions,
                "final_reasoning": final_reasoning,
                "query_type": "voice",
                "audio_data": audio_data[:100] + "..." if len(audio_data) > 100 else audio_data,  # Store truncated audio for reference
                "timestamp": datetime.now().isoformat()
            }
            await self.supabase_client.save_search_context(user_id, current_context)
            
            return {
                "success": True,
                "transcribed_query": transcribed_query,
                "parsed_query": parsed_query,
                "recommendations": recommendations,
                "trend_insights": trend_insights,
                "location_suggestions": location_suggestions,
                "final_reasoning": final_reasoning,
                "context_used": previous_context is not None,
                "context_summary": self._get_context_summary(previous_context) if previous_context else None
            }
            
        except Exception as e:
            logger.error(f"Error processing voice query: {e}")
            return {
                "success": False,
                "error": str(e),
                "recommendations": [],
                "trend_insights": {},
                "location_suggestions": {}
            }
    
    def _parse_text_query(self, query: str) -> Dict:
        """Parse text query to extract style information"""
        try:
            query_lower = query.lower()
            
            # Extract style keywords
            style_keywords = {
                "modern": ["modern", "contemporary", "minimalist", "clean"],
                "traditional": ["traditional", "classic", "vintage", "antique"],
                "scandinavian": ["scandinavian", "nordic", "minimal", "hygge"],
                "industrial": ["industrial", "urban", "loft", "raw"],
                "bohemian": ["bohemian", "eclectic", "boho", "vibrant"],
                "rustic": ["rustic", "farmhouse", "country", "natural"]
            }
            
            detected_styles = []
            for style, keywords in style_keywords.items():
                if any(keyword in query_lower for keyword in keywords):
                    detected_styles.append(style)
            
            # Extract color preferences
            color_keywords = {
                "neutral": ["neutral", "beige", "white", "gray", "cream"],
                "warm": ["warm", "brown", "tan", "gold", "orange"],
                "cool": ["cool", "blue", "green", "purple", "teal"],
                "bold": ["bold", "bright", "vibrant", "colorful", "pop"]
            }
            
            detected_colors = []
            for color_type, keywords in color_keywords.items():
                if any(keyword in query_lower for keyword in keywords):
                    detected_colors.append(color_type)
            
            # Extract room type
            room_keywords = {
                "living_room": ["living room", "lounge", "sitting room"],
                "bedroom": ["bedroom", "sleeping room"],
                "kitchen": ["kitchen", "cooking"],
                "dining_room": ["dining room", "eating room"],
                "office": ["office", "study", "workspace"]
            }
            
            detected_room = "living_room"  # default
            for room_type, keywords in room_keywords.items():
                if any(keyword in query_lower for keyword in keywords):
                    detected_room = room_type
                    break
            
            return {
                "detected_styles": detected_styles,
                "detected_colors": detected_colors,
                "detected_room": detected_room,
                "original_query": query,
                "style_embeddings": [0.0] * 512  # Placeholder for embeddings
            }
            
        except Exception as e:
            logger.error(f"Error parsing text query: {e}")
            return {
                "detected_styles": ["modern"],
                "detected_colors": ["neutral"],
                "detected_room": "living_room",
                "original_query": query,
                "style_embeddings": [0.0] * 512
            }
    
    def _generate_final_reasoning(self, room_analysis: Dict, recommendations: List[Dict], 
                                trend_insights: Dict, user_preferences: Dict) -> str:
        """Generate final reasoning for recommendations"""
        try:
            reasoning_parts = []
            
            # Room analysis insights
            aesthetic_style = room_analysis.get("aesthetic_style", {})
            if aesthetic_style.get("style"):
                reasoning_parts.append(f"Your room has a {aesthetic_style['style']} aesthetic with {aesthetic_style.get('confidence', 0):.1%} confidence.")
            
            # Color palette insights
            color_palette = room_analysis.get("color_palette", [])
            if color_palette:
                dominant_color = color_palette[0].get("hex", "#000000")
                reasoning_parts.append(f"The dominant color in your space is {dominant_color}.")
            
            # Lighting insights
            lighting = room_analysis.get("lighting", {})
            lighting_condition = lighting.get("lighting_condition", "moderate")
            reasoning_parts.append(f"Your space has {lighting_condition} lighting conditions.")
            
            # Recommendation insights
            if recommendations:
                top_recommendation = recommendations[0]
                reasoning_parts.append(f"Our top recommendation is '{top_recommendation.get('title', 'Unknown')}' which perfectly complements your space.")
            
            # Trend insights
            if trend_insights.get("evolution_insights"):
                reasoning_parts.append("Based on current trends, we've also considered evolving design preferences.")
            
            return " ".join(reasoning_parts) if reasoning_parts else "We've analyzed your space and provided personalized recommendations."
            
        except Exception as e:
            logger.error(f"Error generating final reasoning: {e}")
            return "We've provided personalized recommendations based on your space analysis."
    
    def _enhance_query_with_context(self, parsed_query: Dict, context_data: Dict, current_query: str) -> Dict:
        """Enhance current query with information from previous context"""
        try:
            enhanced_query = parsed_query.copy()
            
            # Get previous query information
            previous_query = context_data.get("query", "")
            previous_parsed = context_data.get("parsed_query", {})
            previous_recommendations = context_data.get("recommendations", [])
            
            # Enhance detected styles with previous preferences
            if previous_parsed.get("detected_styles"):
                current_styles = enhanced_query.get("detected_styles", [])
                previous_styles = previous_parsed.get("detected_styles", [])
                
                # Merge styles, giving priority to current query but including relevant previous styles
                all_styles = list(set(current_styles + previous_styles))
                enhanced_query["detected_styles"] = all_styles
            
            # Enhance color preferences
            if previous_parsed.get("detected_colors"):
                current_colors = enhanced_query.get("detected_colors", [])
                previous_colors = previous_parsed.get("detected_colors", [])
                
                all_colors = list(set(current_colors + previous_colors))
                enhanced_query["detected_colors"] = all_colors
            
            # Add context information
            enhanced_query["context_enhanced"] = True
            enhanced_query["previous_query"] = previous_query
            enhanced_query["context_timestamp"] = context_data.get("timestamp", "")
            
            # If current query is vague, use more context
            if len(current_query.split()) < 3:  # Very short query
                enhanced_query["detected_room"] = previous_parsed.get("detected_room", enhanced_query.get("detected_room", "living_room"))
                if not enhanced_query.get("detected_styles"):
                    enhanced_query["detected_styles"] = previous_parsed.get("detected_styles", ["modern"])
            
            return enhanced_query
            
        except Exception as e:
            logger.error(f"Error enhancing query with context: {e}")
            return parsed_query
    
    def _get_context_summary(self, context: Dict) -> str:
        """Generate a summary of the previous context for user reference"""
        try:
            if not context:
                return None
            
            context_data = context.get("context_data", {})
            previous_query = context_data.get("query", "")
            query_type = context_data.get("query_type", "text")
            timestamp = context_data.get("timestamp", "")
            
            # Format timestamp for display
            if timestamp:
                try:
                    from datetime import datetime
                    dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                    formatted_time = dt.strftime("%B %d, %Y at %I:%M %p")
                except:
                    formatted_time = "recently"
            else:
                formatted_time = "recently"
            
            summary_parts = []
            
            if previous_query:
                summary_parts.append(f"Your last {query_type} query was: '{previous_query}'")
            
            summary_parts.append(f"Search context from {formatted_time}")
            
            # Add style information if available
            parsed_query = context_data.get("parsed_query", {})
            if parsed_query.get("detected_styles"):
                styles = ", ".join(parsed_query["detected_styles"])
                summary_parts.append(f"Previous style preferences: {styles}")
            
            return " | ".join(summary_parts)
            
        except Exception as e:
            logger.error(f"Error generating context summary: {e}")
            return "Previous search context available"
    
    def _generate_text_query_reasoning(self, query: str, recommendations: List[Dict], 
                                     trend_insights: Dict, user_preferences: Dict, previous_context: Dict = None) -> str:
        """Generate reasoning for text query results with context awareness"""
        try:
            reasoning_parts = []
            
            # Base reasoning
            reasoning_parts.append(f"Based on your request: '{query}', we've curated recommendations that match your described preferences.")
            
            # Add context-aware reasoning
            if previous_context:
                context_data = previous_context.get("context_data", {})
                previous_query = context_data.get("query", "")
                
                if previous_query and previous_query != query:
                    reasoning_parts.append(f"Building on your previous search for '{previous_query}', I've refined these recommendations to better match your evolving preferences.")
                
                # Add style continuity reasoning
                parsed_query = context_data.get("parsed_query", {})
                if parsed_query.get("detected_styles"):
                    styles = ", ".join(parsed_query["detected_styles"])
                    reasoning_parts.append(f"Maintaining consistency with your preferred {styles} style.")
            
            if recommendations:
                top_recommendation = recommendations[0]
                reasoning_parts.append(f"Our top suggestion is '{top_recommendation.get('title', 'Unknown')}' which aligns with your style preferences.")
            
            if trend_insights.get("trending_complements"):
                reasoning_parts.append("We've also included trending elements that complement your style.")
            
            return " ".join(reasoning_parts) if reasoning_parts else "We've provided recommendations based on your query."
            
        except Exception as e:
            logger.error(f"Error generating text query reasoning: {e}")
            return "We've provided recommendations based on your request."
    
    async def update_user_preferences(self, user_id: str, new_preferences: Dict) -> bool:
        """Update user preferences based on interactions"""
        try:
            # Get current preferences
            user_profile = await self.supabase_client.get_user_profile(user_id)
            current_preferences = user_profile.get("preferences", {}) if user_profile else {}
            
            # Merge new preferences
            updated_preferences = {**current_preferences, **new_preferences}
            
            # Update in database
            result = await self.supabase_client.update_user_preferences(user_id, updated_preferences)
            
            return result is not None
            
        except Exception as e:
            logger.error(f"Error updating user preferences: {e}")
            return False

# Global instance
decision_router = DecisionRouter()
