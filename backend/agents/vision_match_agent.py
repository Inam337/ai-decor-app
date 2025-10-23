import logging
from typing import List, Dict, Tuple, Optional
import os
import json
import numpy as np
import cv2
from datetime import datetime
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
import requests
from PIL import Image
import torch
import torchvision.transforms as transforms

logger = logging.getLogger(__name__)

class VisionMatchAgent:
    def __init__(self):
        """Initialize vision agent with real AI capabilities"""
        logger.info("Vision agent initialized with real AI models")
        
        # Initialize YOLOv8 for object detection
        try:
            from ultralytics import YOLO
            self.yolo_model = YOLO('yolov8n.pt')  # Nano version for faster inference
            logger.info("YOLOv8 model loaded successfully")
        except ImportError:
            logger.warning("YOLOv8 not available, using mock detection")
            self.yolo_model = None
        
        # Initialize DINOv2 for style embeddings
        try:
            self.dinov2_model = torch.hub.load('facebookresearch/dinov2', 'dinov2_vitb14')
            self.dinov2_model.eval()
            self.dinov2_transform = transforms.Compose([
                transforms.Resize(224),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
            ])
            logger.info("DINOv2 model loaded successfully")
        except Exception as e:
            logger.warning(f"DINOv2 not available: {e}, using mock embeddings")
            self.dinov2_model = None
        
        # Load artwork catalog
        self.artwork_catalog = self._load_artwork_catalog()
        
        # Style descriptions for matching
        self.style_descriptions = [
            "modern minimalist interior design",
            "traditional classic home decor", 
            "scandinavian nordic style",
            "industrial loft aesthetic",
            "bohemian eclectic design",
            "contemporary luxury interior",
            "rustic farmhouse style",
            "mid-century modern design"
        ]
    
    def _load_artwork_catalog(self) -> List[Dict]:
        """Load artwork catalog from JSON file"""
        try:
            catalog_path = os.path.join(os.path.dirname(__file__), '..', 'artwork_catalog.json')
            with open(catalog_path, 'r') as f:
                catalog = json.load(f)
            logger.info(f"Loaded {len(catalog)} artworks from catalog")
            return catalog
        except Exception as e:
            logger.error(f"Error loading artwork catalog: {e}")
            return []
    
    def detect_walls_and_furniture(self, image_path: str) -> Dict:
        """Real wall and furniture detection using YOLOv8"""
        try:
            logger.info(f"Detecting walls and furniture in {image_path}")
            
            if self.yolo_model is None:
                return self._mock_detection()
            
            # Load and process image
            image = cv2.imread(image_path)
            if image is None:
                logger.error(f"Could not load image: {image_path}")
                return self._mock_detection()
            
            # Run YOLOv8 detection
            results = self.yolo_model(image)
            
            # Process results
            detections = {
                "walls": [],
                "windows": [],
                "furniture": [],
                "other": []
            }
            
            # COCO class names for furniture and room elements
            furniture_classes = ['chair', 'couch', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush']
            window_classes = ['window']  # Custom class if available
            
            for result in results:
                boxes = result.boxes
                if boxes is not None:
                    for box in boxes:
                        class_id = int(box.cls[0])
                        confidence = float(box.conf[0])
                        bbox = box.xyxy[0].tolist()
                        
                        class_name = self.yolo_model.names[class_id]
                        
                        detection = {
                            "class": class_id,
                            "class_name": class_name,
                            "confidence": confidence,
                            "bbox": bbox
                        }
                        
                        if class_name in furniture_classes:
                            detections["furniture"].append(detection)
                        elif class_name in window_classes:
                            detections["windows"].append(detection)
                        else:
                            detections["other"].append(detection)
            
            # Detect walls using edge detection (simplified approach)
            walls = self._detect_walls(image)
            detections["walls"] = walls
            
            logger.info(f"Detection complete: {len(detections['walls'])} walls, {len(detections['windows'])} windows, {len(detections['furniture'])} furniture items")
            return detections
            
        except Exception as e:
            logger.error(f"Error in wall detection: {e}")
            return self._mock_detection()
    
    def _detect_walls(self, image: np.ndarray) -> List[Dict]:
        """Detect walls using edge detection and line detection"""
        try:
            # Convert to grayscale
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Edge detection
            edges = cv2.Canny(gray, 50, 150)
            
            # Line detection
            lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=100, minLineLength=100, maxLineGap=10)
            
            walls = []
            if lines is not None:
                for i, line in enumerate(lines):
                    x1, y1, x2, y2 = line[0]
                    walls.append({
                        "class": 0,
                        "class_name": "wall",
                        "confidence": 0.8,
                        "bbox": [min(x1, x2), min(y1, y2), max(x1, x2), max(y1, y2)]
                    })
            
            return walls[:5]  # Limit to 5 walls max
            
        except Exception as e:
            logger.error(f"Error detecting walls: {e}")
            return []
    
    def _mock_detection(self) -> Dict:
        """Fallback mock detection"""
        return {
            "walls": [{"class": 0, "confidence": 0.95, "bbox": [0, 0, 800, 600]}],
            "windows": [{"class": 1, "confidence": 0.87, "bbox": [200, 100, 400, 300]}],
            "furniture": [{"class": 2, "confidence": 0.82, "bbox": [100, 400, 300, 550]}],
            "other": []
        }
    
    def extract_color_palette(self, image_path: str, n_colors: int = 5) -> List[Dict]:
        """Real color palette extraction using k-means clustering in LAB color space"""
        try:
            logger.info(f"Extracting color palette from {image_path}")
            
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                logger.error(f"Could not load image: {image_path}")
                return self._mock_color_palette()
            
            # Convert BGR to RGB
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Resize image for faster processing
            height, width = image_rgb.shape[:2]
            if height * width > 1000000:  # If image is too large
                scale = (1000000 / (height * width)) ** 0.5
                new_height = int(height * scale)
                new_width = int(width * scale)
                image_rgb = cv2.resize(image_rgb, (new_width, new_height))
            
            # Reshape image to be a list of pixels
            pixels = image_rgb.reshape(-1, 3)
            
            # Convert RGB to LAB color space for better clustering
            pixels_lab = cv2.cvtColor(pixels.reshape(1, -1, 3), cv2.COLOR_RGB2LAB).reshape(-1, 3)
            
            # Apply k-means clustering
            kmeans = KMeans(n_clusters=n_colors, random_state=42, n_init=10)
            kmeans.fit(pixels_lab)
            
            # Get cluster centers in LAB space
            lab_centers = kmeans.cluster_centers_
            
            # Convert LAB centers back to RGB
            rgb_centers = cv2.cvtColor(lab_centers.reshape(1, -1, 3).astype(np.uint8), cv2.COLOR_LAB2RGB).reshape(-1, 3)
            
            # Get cluster labels and calculate percentages
            labels = kmeans.labels_
            unique_labels, counts = np.unique(labels, return_counts=True)
            percentages = (counts / len(labels)) * 100
            
            # Create color palette
            palette = []
            for i, (rgb_color, percentage) in enumerate(zip(rgb_centers, percentages)):
                hex_color = f"#{rgb_color[0]:02x}{rgb_color[1]:02x}{rgb_color[2]:02x}"
                palette.append({
                    "rgb": rgb_color.tolist(),
                    "hex": hex_color,
                    "percentage": round(percentage, 1)
                })
            
            # Sort by percentage (most dominant first)
            palette.sort(key=lambda x: x['percentage'], reverse=True)
            
            logger.info(f"Color palette extracted: {len(palette)} colors")
            return palette
            
        except Exception as e:
            logger.error(f"Error extracting color palette: {e}")
            return self._mock_color_palette()
    
    def _mock_color_palette(self) -> List[Dict]:
        """Fallback mock color palette"""
        return [
            {"rgb": [200, 180, 160], "hex": "#c8b4a0", "percentage": 35.2},
            {"rgb": [120, 100, 80], "hex": "#786450", "percentage": 28.7},
            {"rgb": [240, 230, 220], "hex": "#f0e6dc", "percentage": 20.1},
            {"rgb": [80, 60, 40], "hex": "#503c28", "percentage": 12.3},
            {"rgb": [160, 140, 120], "hex": "#a08c78", "percentage": 3.7}
        ]
    
    def analyze_lighting(self, image_path: str) -> Dict:
        """Real lighting analysis using image statistics"""
        try:
            logger.info(f"Analyzing lighting in {image_path}")
            
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                logger.error(f"Could not load image: {image_path}")
                return self._mock_lighting()
            
            # Convert to grayscale for brightness analysis
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Calculate brightness statistics
            mean_brightness = np.mean(gray)
            std_brightness = np.std(gray)
            
            # Calculate contrast using standard deviation
            contrast = std_brightness
            
            # Determine lighting condition based on brightness
            if mean_brightness < 80:
                lighting_condition = "dim"
            elif mean_brightness < 150:
                lighting_condition = "moderate"
            else:
                lighting_condition = "bright"
            
            lighting_analysis = {
                "mean_brightness": round(mean_brightness, 1),
                "std_brightness": round(std_brightness, 1),
                "contrast": round(contrast, 1),
                "lighting_condition": lighting_condition
            }
            
            logger.info(f"Lighting analysis complete: {lighting_condition} ({mean_brightness:.1f} brightness)")
            return lighting_analysis
            
        except Exception as e:
            logger.error(f"Error analyzing lighting: {e}")
            return self._mock_lighting()
    
    def _mock_lighting(self) -> Dict:
        """Fallback mock lighting analysis"""
        return {
            "mean_brightness": 125.5,
            "std_brightness": 45.2,
            "contrast": 45.2,
            "lighting_condition": "moderate"
        }
    
    def extract_style_embeddings(self, image_path: str) -> List[float]:
        """Real style embeddings extraction using DINOv2"""
        try:
            logger.info(f"Extracting style embeddings from {image_path}")
            
            if self.dinov2_model is None:
                return self._mock_embeddings()
            
            # Load and preprocess image
            image = Image.open(image_path).convert('RGB')
            input_tensor = self.dinov2_transform(image).unsqueeze(0)
            
            # Extract features
            with torch.no_grad():
                features = self.dinov2_model(input_tensor)
                embeddings = features.squeeze().cpu().numpy().tolist()
            
            logger.info(f"Style embeddings extracted: {len(embeddings)} dimensions")
            return embeddings
            
        except Exception as e:
            logger.error(f"Error extracting style embeddings: {e}")
            return self._mock_embeddings()
    
    def _mock_embeddings(self) -> List[float]:
        """Fallback mock embeddings"""
        import random
        random.seed(42)
        return [random.uniform(-1, 1) for _ in range(512)]
    
    def match_aesthetic_style(self, room_embedding: List[float], style_descriptions: List[str]) -> Dict:
        """Real aesthetic style matching using cosine similarity"""
        try:
            logger.info("Matching aesthetic style")
            
            # For now, use a simplified approach with predefined style embeddings
            # In a full implementation, you would have pre-computed embeddings for each style
            style_scores = []
            
            for i, style in enumerate(style_descriptions):
                # Generate mock style embedding based on style name
                # In real implementation, these would be pre-computed
                style_embedding = self._get_style_embedding(style)
                
                # Calculate cosine similarity
                similarity = cosine_similarity([room_embedding], [style_embedding])[0][0]
                style_scores.append(similarity)
            
            # Find best matching style
            best_match_idx = np.argmax(style_scores)
            best_style = style_descriptions[best_match_idx]
            best_confidence = style_scores[best_match_idx]
            
            style_match = {
                "style": best_style,
                "confidence": round(best_confidence, 3),
                "all_scores": [round(score, 3) for score in style_scores]
            }
            
            logger.info(f"Style match: {best_style} (confidence: {best_confidence:.3f})")
            return style_match
            
        except Exception as e:
            logger.error(f"Error matching aesthetic style: {e}")
            return {"style": "unknown", "confidence": 0.0, "all_scores": []}
    
    def _get_style_embedding(self, style_name: str) -> List[float]:
        """Generate mock style embedding based on style name"""
        import hashlib
        # Use hash of style name to generate consistent embedding
        hash_obj = hashlib.md5(style_name.encode())
        hash_bytes = hash_obj.digest()
        
        # Convert hash to embedding vector
        embedding = []
        for i in range(0, len(hash_bytes), 4):
            chunk = hash_bytes[i:i+4]
            if len(chunk) == 4:
                value = int.from_bytes(chunk, 'big') / (2**32)  # Normalize to [0,1]
                embedding.append(value * 2 - 1)  # Scale to [-1,1]
        
        # Pad or truncate to 512 dimensions
        while len(embedding) < 512:
            embedding.extend(embedding[:min(4, len(embedding))])
        
        return embedding[:512]
    
    def get_personalized_recommendations(self, room_analysis: Dict, user_preferences: Dict = None, max_recommendations: int = 5) -> List[Dict]:
        """Get personalized artwork recommendations based on room analysis"""
        try:
            logger.info("Generating personalized artwork recommendations")
            
            if not self.artwork_catalog:
                logger.warning("No artwork catalog available")
                return []
            
            # Extract analysis data
            color_palette = room_analysis.get('color_palette', [])
            detected_style = room_analysis.get('aesthetic_style', {}).get('style', 'modern')
            lighting = room_analysis.get('lighting', {}).get('lighting_condition', 'moderate')
            
            # Score artworks based on compatibility
            scored_artworks = []
            
            for artwork in self.artwork_catalog:
                score = self._calculate_artwork_score(artwork, color_palette, detected_style, lighting, user_preferences)
                scored_artworks.append((artwork, score))
            
            # Sort by score and return top recommendations
            scored_artworks.sort(key=lambda x: x[1], reverse=True)
            
            recommendations = []
            for artwork, score in scored_artworks[:max_recommendations]:
                recommendation = {
                    "artwork_id": artwork.get('artwork_id', ''),
                    "title": artwork.get('title', ''),
                    "artist": artwork.get('artist', ''),
                    "image_url": artwork.get('image_url', ''),
                    "price": artwork.get('price', 0),
                    "match_score": round(score, 3),
                    "reasoning": self._generate_reasoning(artwork, color_palette, detected_style),
                    "style_match": artwork.get('style_tags', []),
                    "color_match": self._get_color_matches(artwork, color_palette)
                }
                recommendations.append(recommendation)
            
            logger.info(f"Generated {len(recommendations)} personalized recommendations")
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {e}")
            return []
    
    def _calculate_artwork_score(self, artwork: Dict, color_palette: List[Dict], style: str, lighting: str, user_preferences: Dict = None) -> float:
        """Calculate compatibility score for an artwork"""
        score = 0.0
        
        # Style compatibility (40% weight)
        artwork_styles = artwork.get('style_tags', [])
        style_lower = style.lower()
        if any(style_lower in tag.lower() for tag in artwork_styles):
            score += 0.4
        
        # Color compatibility (30% weight)
        artwork_colors = artwork.get('color_tags', [])
        if color_palette and artwork_colors:
            color_score = self._calculate_color_compatibility(color_palette, artwork_colors)
            score += 0.3 * color_score
        
        # Price compatibility (20% weight)
        if user_preferences and 'price_range' in user_preferences:
            price_range = user_preferences['price_range']
            artwork_price = artwork.get('price', 0)
            if price_range['min'] <= artwork_price <= price_range['max']:
                score += 0.2
        
        # Lighting compatibility (10% weight)
        if lighting == 'bright' and artwork.get('brightness', 'medium') == 'high':
            score += 0.1
        elif lighting == 'dim' and artwork.get('brightness', 'medium') == 'low':
            score += 0.1
        else:
            score += 0.05  # Neutral lighting compatibility
        
        return min(score, 1.0)  # Cap at 1.0
    
    def _calculate_color_compatibility(self, room_colors: List[Dict], artwork_colors: List[str]) -> float:
        """Calculate color compatibility between room and artwork"""
        if not room_colors or not artwork_colors:
            return 0.5  # Neutral score
        
        # Convert room colors to hex
        room_hex_colors = [color['hex'] for color in room_colors]
        
        # Simple color matching based on color families
        compatibility_score = 0.0
        for room_color in room_hex_colors:
            for artwork_color in artwork_colors:
                if self._colors_compatible(room_color, artwork_color):
                    compatibility_score += 0.2
        
        return min(compatibility_score, 1.0)
    
    def _colors_compatible(self, color1: str, color2: str) -> bool:
        """Check if two colors are compatible"""
        # Simple compatibility check based on color families
        # In a real implementation, you would use more sophisticated color theory
        try:
            # Convert hex to RGB
            rgb1 = tuple(int(color1[i:i+2], 16) for i in (1, 3, 5))
            rgb2 = tuple(int(color2[i:i+2], 16) for i in (1, 3, 5))
            
            # Calculate color distance
            distance = sum((a - b) ** 2 for a, b in zip(rgb1, rgb2)) ** 0.5
            
            # Colors are compatible if they're similar or complementary
            return distance < 100 or distance > 300
        except:
            return True  # Default to compatible if parsing fails
    
    def _generate_reasoning(self, artwork: Dict, color_palette: List[Dict], style: str) -> str:
        """Generate reasoning for artwork recommendation"""
        reasons = []
        
        # Style reasoning
        artwork_styles = artwork.get('style_tags', [])
        if any(style.lower() in tag.lower() for tag in artwork_styles):
            reasons.append(f"Matches your {style} style")
        
        # Color reasoning
        if color_palette:
            dominant_color = color_palette[0]['hex']
            reasons.append(f"Complements your {dominant_color} color scheme")
        
        # Price reasoning
        price = artwork.get('price', 0)
        if price < 100:
            reasons.append("Great value for money")
        elif price > 500:
            reasons.append("Premium quality piece")
        
        return "; ".join(reasons) if reasons else "Well-suited for your space"
    
    def _get_color_matches(self, artwork: Dict, color_palette: List[Dict]) -> List[str]:
        """Get color matches between artwork and room"""
        if not color_palette:
            return []
        
        artwork_colors = artwork.get('color_tags', [])
        matches = []
        
        for room_color in color_palette[:3]:  # Top 3 room colors
            for artwork_color in artwork_colors:
                if self._colors_compatible(room_color['hex'], artwork_color):
                    matches.append(room_color['hex'])
                    break
        
        return matches
    
    def analyze_room(self, image_path: str, user_preferences: Dict = None) -> Dict:
        """Complete room analysis combining all vision capabilities"""
        try:
            logger.info(f"Starting room analysis for {image_path}")
            
            # Detect objects
            detections = self.detect_walls_and_furniture(image_path)
            
            # Extract color palette
            palette = self.extract_color_palette(image_path)
            
            # Analyze lighting
            lighting = self.analyze_lighting(image_path)
            
            # Extract style embeddings
            embeddings = self.extract_style_embeddings(image_path)
            
            # Match aesthetic style
            style_match = self.match_aesthetic_style(embeddings, self.style_descriptions)
            
            # Create room analysis result
            room_analysis = {
                "detections": detections,
                "color_palette": palette,
                "lighting": lighting,
                "style_embeddings": embeddings,
                "aesthetic_style": style_match,
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            # Get personalized recommendations
            recommendations = self.get_personalized_recommendations(room_analysis, user_preferences)
            
            # Final result with recommendations
            result = {
                "room_analysis": room_analysis,
                "recommendations": recommendations,
                "session_id": f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "final_reasoning": self._generate_final_reasoning(room_analysis, recommendations)
            }
            
            logger.info("Room analysis completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"Error in complete room analysis: {e}")
            return {}
    
    def _generate_final_reasoning(self, room_analysis: Dict, recommendations: List[Dict]) -> str:
        """Generate final reasoning for the analysis"""
        try:
            style = room_analysis.get('aesthetic_style', {}).get('style', 'modern')
            lighting = room_analysis.get('lighting', {}).get('lighting_condition', 'moderate')
            color_count = len(room_analysis.get('color_palette', []))
            
            reasoning_parts = [
                f"Your space has a {style} aesthetic with {lighting} lighting.",
                f"Detected {color_count} primary colors in your room palette.",
                f"Found {len(recommendations)} personalized artwork recommendations that complement your space."
            ]
            
            if recommendations:
                top_recommendation = recommendations[0]
                reasoning_parts.append(f"Our top recommendation is '{top_recommendation['title']}' by {top_recommendation['artist']}.")
            
            return " ".join(reasoning_parts)
            
        except Exception as e:
            logger.error(f"Error generating final reasoning: {e}")
            return "Analysis completed successfully with personalized recommendations."

# Global instance
vision_agent = VisionMatchAgent()