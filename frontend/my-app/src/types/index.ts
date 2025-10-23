// User and Authentication Types
export interface UserProfile {
  id: string;
  user_id: string;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  aesthetic_style?: 'modern' | 'traditional' | 'minimalist' | 'bohemian' | 'industrial' | 'scandinavian';
  preferred_colors?: string[];
  max_price?: number;
  room_type?: 'living_room' | 'bedroom' | 'kitchen' | 'dining_room' | 'office' | 'bathroom';
  budget_range?: 'low' | 'medium' | 'high';
  color_scheme?: 'neutral' | 'bold' | 'pastel' | 'monochrome';
  furniture_style?: 'contemporary' | 'vintage' | 'rustic' | 'luxury';
  [key: string]: any; // Allow additional custom preferences
}

export interface UserSession {
  id: string;
  user_id: string;
  session_data: SessionData;
  room_analysis?: RoomAnalysis;
  recommendations?: ArtworkItem[];
  trend_insights?: TrendInsights;
  location_suggestions?: LocationSuggestions;
  final_reasoning?: string;
  created_at: string;
}

export interface SessionData {
  input_type: 'image' | 'text' | 'voice';
  query_text?: string;
  timestamp: string;
  location?: string;
  [key: string]: any;
}

// Room Analysis Types
export interface RoomAnalysis {
  style: string;
  confidence: number;
  colors: ColorPalette;
  lighting: LightingAnalysis;
  furniture_detected?: string[];
  room_dimensions?: {
    width: number;
    height: number;
    area: number;
  };
  [key: string]: any;
}

export interface ColorPalette {
  primary: string[];
  secondary?: string[];
  accent?: string[];
  dominant?: string;
  complementary?: string[];
}

export interface LightingAnalysis {
  type: 'natural' | 'artificial' | 'mixed';
  intensity: 'low' | 'medium' | 'high';
  direction?: 'north' | 'south' | 'east' | 'west';
  temperature?: number;
  brightness?: number;
}

// Artwork Types
export interface ArtworkItem {
  id: string;
  title: string;
  artist: string;
  style: string;
  colors: string[];
  price: number;
  size: string;
  medium: string;
  description: string;
  image_url: string;
  tags: string[];
  similarity_score?: number;
  match_score?: number;
  recommendation_reason?: string;
  availability?: 'in_stock' | 'out_of_stock' | 'limited';
  dimensions?: {
    width: number;
    height: number;
    depth?: number;
  };
}

// API Response Types
export interface RoomAnalysisResult {
  success: boolean;
  room_analysis: {
    detections: {
      walls: any[];
      windows: any[];
      furniture: any[];
      other: any[];
    };
    color_palette: Array<{
      rgb: number[];
      hex: string;
      percentage: number;
    }>;
    lighting: {
      mean_brightness: number;
      lighting_condition: string;
    };
    aesthetic_style: {
      style: string;
      confidence: number;
    };
  };
  recommendations: Array<{
    artwork_id: string;
    title: string;
    match_score: number;
    reasoning: string;
    artist?: string;
    price?: number;
    image_url?: string;
    style?: string;
  }>;
  trend_insights: TrendInsights;
  location_suggestions: LocationSuggestions;
  final_reasoning: string;
  session_id?: string;
}

export interface TrendInsights {
  trending_styles: string[];
  popular_colors: string[];
  emerging_trends: string[];
  seasonal_recommendations?: string[];
  [key: string]: any;
}

export interface LocationSuggestions {
  nearby_stores: NearbyStore[];
  local_trends?: string[];
  regional_preferences?: string[];
  [key: string]: any;
}

export interface NearbyStore {
  name: string;
  address: string;
  rating: number;
  types: string[];
  phone: string;
  is_open: boolean;
  place_id: string;
  distance?: number;
  website?: string;
  hours?: {
    [day: string]: string;
  };
}

export interface TrendingStyle {
  title: string;
  content: string;
  relevance_score: number;
  trend_type: string;
  source?: string;
  date?: string;
}

// API Error Types
export interface APIError {
  message: string;
  code?: string;
  details?: any;
}

// Form Types
export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
  agreeToTerms?: boolean;
}

// Component Props Types
export interface AnalysisResult {
  style: string;
  confidence: number;
  colors: ColorPalette;
  recommendations: ArtworkItem[];
  session_id?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  price: number;
  size: string;
  image_url?: string;
  style_tags?: string[];
}
