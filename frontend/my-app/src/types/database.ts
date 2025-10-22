// Database Types for Supabase Integration - Updated to match backend schema

export interface UserProfile {
  id: string;
  user_id: string;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  aesthetic_style?: string;
  preferred_colors?: string[];
  max_price?: number;
  room_type?: string;
  [key: string]: string | string[] | number | undefined;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_data: SessionData;
  room_analysis?: RoomAnalysis;
  recommendations?: ArtworkRecommendation[];
  trend_insights?: TrendInsights;
  location_suggestions?: LocationSuggestion[];
  final_reasoning?: string;
  created_at: string;
}

export interface SessionData {
  input_type: 'photo' | 'text' | 'voice';
  query_text?: string;
  image_url?: string;
  location?: string;
  timestamp: string;
}

export interface RoomAnalysis {
  room_type: string;
  style: string;
  colors: ColorPalette;
  lighting: LightingAnalysis;
  dimensions?: {
    width: number;
    height: number;
    area: number;
  };
  confidence: number;
}

export interface ColorPalette {
  primary: string[];
  secondary: string[];
  accent: string[];
  dominant: string;
  complementary: string[];
}

export interface LightingAnalysis {
  type: 'natural' | 'artificial' | 'mixed';
  intensity: 'low' | 'medium' | 'high';
  direction: 'north' | 'south' | 'east' | 'west';
  temperature: number; // Kelvin
  brightness: number; // 0-100
}

export interface ArtworkCatalog {
  id: string;
  artwork_id: string;
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
  embedding?: number[]; // For FAISS integration
  created_at: string;
  updated_at: string;
}

export interface ArtworkRecommendation {
  artwork_id: string;
  title: string;
  artist: string;
  image_url: string;
  price: number;
  match_score: number;
  reasoning: string;
  style_match: string[];
  color_match: string[];
}

export interface StoreInfo {
  id: string;
  place_id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating: number;
  price_level: number;
  types: string[];
  geometry: {
    lat: number;
    lng: number;
  };
  business_status: string;
  user_ratings_total: number;
  created_at: string;
  updated_at: string;
}

export interface UserFeedback {
  id: string;
  user_id: string;
  session_id?: string;
  artwork_id?: string;
  feedback_type: 'like' | 'dislike' | 'purchase' | 'view';
  rating?: number;
  comments?: string;
  created_at: string;
}

export interface TrendInsights {
  trending_styles: string[];
  popular_colors: string[];
  price_trends: {
    average_price: number;
    price_range: {
      min: number;
      max: number;
    };
  };
  seasonal_trends: string[];
  location_trends: {
    [location: string]: string[];
  };
}

export interface LocationSuggestion {
  store: StoreInfo;
  distance: number;
  availability: boolean;
  estimated_price?: number;
  match_reason: string;
}

export interface TrendingStylesCache {
  id: string;
  query: string;
  trends_data: TrendInsights;
  location?: string;
  expires_at: string;
  created_at: string;
}

// Database Table Names
export const TABLES = {
  USER_PROFILES: 'user_profiles',
  USER_SESSIONS: 'user_sessions',
  ARTWORK_CATALOG: 'artwork_catalog',
  STORE_INFO: 'store_info',
  USER_FEEDBACK: 'user_feedback',
  TRENDING_STYLES_CACHE: 'trending_styles_cache'
} as const;

// Input Types
export type InputType = 'photo' | 'text' | 'voice';

// Feedback Types
export type FeedbackType = 'like' | 'dislike' | 'purchase' | 'view';

// Extended interfaces for API responses
export interface APIResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// Search and filter interfaces
export interface ArtworkSearchFilters {
  style?: string;
  min_price?: number;
  max_price?: number;
  colors?: string[];
  tags?: string[];
  artist?: string;
  size?: string;
  medium?: string;
}

export interface StoreSearchFilters {
  types?: string[];
  min_rating?: number;
  max_distance?: number;
  price_level?: number;
  business_status?: string;
}
