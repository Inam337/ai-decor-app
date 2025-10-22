import { supabase, supabaseAdmin } from '@/lib/supabaseClient';
import { 
  UserProfile, 
  UserPreferences,
  UserSession,
  SessionData,
  RoomAnalysis,
  ArtworkCatalog, 
  StoreInfo,
  UserFeedback,
  TrendInsights,
  LocationSuggestion,
  TrendingStylesCache,
  ArtworkRecommendation,
  ColorPalette,
  LightingAnalysis,
  TABLES,
  InputType,
  FeedbackType,
  ArtworkSearchFilters,
  StoreSearchFilters,
  APIResponse,
  PaginatedResponse
} from '@/types/database';

// User Profile Management Functions
export class UserProfileService {
  static async createUserProfile(userId: string, preferences: UserPreferences = {}) {
    const { data, error } = await supabase
      .from(TABLES.USER_PROFILES)
      .insert([{ user_id: userId, preferences }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from(TABLES.USER_PROFILES)
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>) {
    const { data, error } = await supabase
      .from(TABLES.USER_PROFILES)
      .update({ preferences })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getAllUserProfiles(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from(TABLES.USER_PROFILES)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
}

// User Session Management Functions
export class UserSessionService {
  static async createSession(sessionData: Omit<UserSession, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from(TABLES.USER_SESSIONS)
      .insert([sessionData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getSessionsByUser(userId: string): Promise<UserSession[]> {
    const { data, error } = await supabase
      .from(TABLES.USER_SESSIONS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getSessionById(sessionId: string): Promise<UserSession | null> {
    const { data, error } = await supabase
      .from(TABLES.USER_SESSIONS)
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateSessionAnalysis(sessionId: string, roomAnalysis: RoomAnalysis) {
    const { data, error } = await supabase
      .from(TABLES.USER_SESSIONS)
      .update({ room_analysis: roomAnalysis })
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateSessionRecommendations(sessionId: string, recommendations: ArtworkRecommendation[]) {
    const { data, error } = await supabase
      .from(TABLES.USER_SESSIONS)
      .update({ recommendations })
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateSessionReasoning(sessionId: string, reasoning: string) {
    const { data, error } = await supabase
      .from(TABLES.USER_SESSIONS)
      .update({ final_reasoning: reasoning })
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

// Artwork Catalog Functions
export class ArtworkService {
  static async getAllArtworks(): Promise<ArtworkCatalog[]> {
    const { data, error } = await supabase
      .from(TABLES.ARTWORK_CATALOG)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getArtworkById(artworkId: string): Promise<ArtworkCatalog | null> {
    const { data, error } = await supabase
      .from(TABLES.ARTWORK_CATALOG)
      .select('*')
      .eq('artwork_id', artworkId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async searchArtworks(filters: ArtworkSearchFilters): Promise<ArtworkCatalog[]> {
    let query = supabase.from(TABLES.ARTWORK_CATALOG).select('*');

    if (filters.style) {
      query = query.eq('style', filters.style);
    }
    if (filters.min_price) {
      query = query.gte('price', filters.min_price);
    }
    if (filters.max_price) {
      query = query.lte('price', filters.max_price);
    }
    if (filters.artist) {
      query = query.ilike('artist', `%${filters.artist}%`);
    }
    if (filters.size) {
      query = query.ilike('size', `%${filters.size}%`);
    }
    if (filters.medium) {
      query = query.ilike('medium', `%${filters.medium}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getArtworksByStyle(style: string): Promise<ArtworkCatalog[]> {
    const { data, error } = await supabase
      .from(TABLES.ARTWORK_CATALOG)
      .select('*')
      .eq('style', style)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getArtworksByPriceRange(minPrice: number, maxPrice: number): Promise<ArtworkCatalog[]> {
    const { data, error } = await supabase
      .from(TABLES.ARTWORK_CATALOG)
      .select('*')
      .gte('price', minPrice)
      .lte('price', maxPrice)
      .order('price', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  static async createArtwork(artworkData: Omit<ArtworkCatalog, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from(TABLES.ARTWORK_CATALOG)
      .insert([artworkData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

// Store Information Functions
export class StoreService {
  static async getAllStores(): Promise<StoreInfo[]> {
    const { data, error } = await supabase
      .from(TABLES.STORE_INFO)
      .select('*')
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getStoreById(placeId: string): Promise<StoreInfo | null> {
    const { data, error } = await supabase
      .from(TABLES.STORE_INFO)
      .select('*')
      .eq('place_id', placeId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async searchStores(filters: StoreSearchFilters): Promise<StoreInfo[]> {
    let query = supabase.from(TABLES.STORE_INFO).select('*');

    if (filters.min_rating) {
      query = query.gte('rating', filters.min_rating);
    }
    if (filters.price_level) {
      query = query.eq('price_level', filters.price_level);
    }
    if (filters.business_status) {
      query = query.eq('business_status', filters.business_status);
    }

    const { data, error } = await query.order('rating', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getStoresByType(types: string[]): Promise<StoreInfo[]> {
    const { data, error } = await supabase
      .from(TABLES.STORE_INFO)
      .select('*')
      .overlaps('types', types)
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
}

// User Feedback Functions
export class FeedbackService {
  static async addFeedback(feedbackData: Omit<UserFeedback, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from(TABLES.USER_FEEDBACK)
      .insert([feedbackData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserFeedback(userId: string): Promise<UserFeedback[]> {
    const { data, error } = await supabase
      .from(TABLES.USER_FEEDBACK)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getArtworkFeedback(artworkId: string): Promise<UserFeedback[]> {
    const { data, error } = await supabase
      .from(TABLES.USER_FEEDBACK)
      .select('*')
      .eq('artwork_id', artworkId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getFeedbackByType(feedbackType: FeedbackType): Promise<UserFeedback[]> {
    const { data, error } = await supabase
      .from(TABLES.USER_FEEDBACK)
      .select('*')
      .eq('feedback_type', feedbackType)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
}

// Trending Styles Cache Functions
export class TrendingService {
  static async getTrendingCache(query: string, location?: string): Promise<TrendingStylesCache | null> {
    let queryBuilder = supabase
      .from(TABLES.TRENDING_STYLES_CACHE)
      .select('*')
      .eq('query', query)
      .gt('expires_at', new Date().toISOString());

    if (location) {
      queryBuilder = queryBuilder.eq('location', location);
    }

    const { data, error } = await queryBuilder.single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async setTrendingCache(cacheData: Omit<TrendingStylesCache, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from(TABLES.TRENDING_STYLES_CACHE)
      .insert([cacheData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async clearExpiredCache() {
    const { error } = await supabase
      .from(TABLES.TRENDING_STYLES_CACHE)
      .delete()
      .lt('expires_at', new Date().toISOString());
    
    if (error) throw error;
  }
}

// AI Integration Functions
export class AIService {
  static async saveChatSession(
    userId: string, 
    sessionData: SessionData, 
    roomAnalysis?: RoomAnalysis,
    recommendations?: ArtworkRecommendation[],
    reasoning?: string
  ) {
    // Create session
    const session = await UserSessionService.createSession({
      user_id: userId,
      session_data: sessionData,
      room_analysis: roomAnalysis,
      recommendations: recommendations,
      final_reasoning: reasoning
    });

    return session;
  }

  static async generateRecommendations(roomAnalysis: RoomAnalysis): Promise<ArtworkRecommendation[]> {
    // This would integrate with your AI backend
    // For now, return mock data based on room analysis
    const mockRecommendations: ArtworkRecommendation[] = [
      {
        artwork_id: 'art_001',
        title: 'Modern Abstract Composition',
        artist: 'Sarah Johnson',
        image_url: '/api/placeholder/300/400',
        price: 299.99,
        match_score: 0.95,
        reasoning: 'Perfect color match with your room palette',
        style_match: ['modern', 'abstract'],
        color_match: roomAnalysis.colors.primary
      },
      {
        artwork_id: 'art_002',
        title: 'Scandinavian Landscape',
        artist: 'Erik Nordstrom',
        image_url: '/api/placeholder/300/400',
        price: 199.99,
        match_score: 0.87,
        reasoning: 'Complements your minimalist style',
        style_match: ['minimalist', 'scandinavian'],
        color_match: roomAnalysis.colors.secondary
      }
    ];

    return mockRecommendations;
  }

  static async analyzeRoom(imageUrl: string): Promise<RoomAnalysis> {
    // This would integrate with your AI backend for actual analysis
    // For now, return mock analysis
    const mockAnalysis: RoomAnalysis = {
      room_type: 'Living Room',
      style: 'Modern Minimalist',
      colors: {
        primary: ['#8B5CF6', '#EC4899'],
        secondary: ['#F3F4F6', '#E5E7EB'],
        accent: ['#F59E0B', '#EF4444'],
        dominant: '#8B5CF6',
        complementary: ['#10B981', '#06B6D4']
      },
      lighting: {
        type: 'natural',
        intensity: 'medium',
        direction: 'south',
        temperature: 5500,
        brightness: 75
      },
      confidence: 0.92
    };

    return mockAnalysis;
  }
}

// Storage Functions
export class StorageService {
  static async uploadFile(file: File, bucket: string = 'room-uploads'): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    return publicUrl;
  }

  static async deleteFile(fileName: string, bucket: string = 'room-uploads') {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);
    
    if (error) throw error;
  }
}

// Utility Functions
export class DatabaseUtils {
  static async getDatabaseStats() {
    const [
      userProfiles,
      userSessions,
      artworkCatalog,
      storeInfo,
      userFeedback
    ] = await Promise.all([
      supabase.from(TABLES.USER_PROFILES).select('id', { count: 'exact' }),
      supabase.from(TABLES.USER_SESSIONS).select('id', { count: 'exact' }),
      supabase.from(TABLES.ARTWORK_CATALOG).select('id', { count: 'exact' }),
      supabase.from(TABLES.STORE_INFO).select('id', { count: 'exact' }),
      supabase.from(TABLES.USER_FEEDBACK).select('id', { count: 'exact' })
    ]);

    return {
      userProfiles: userProfiles.count || 0,
      userSessions: userSessions.count || 0,
      artworkCatalog: artworkCatalog.count || 0,
      storeInfo: storeInfo.count || 0,
      userFeedback: userFeedback.count || 0
    };
  }

  static async searchEverything(query: string) {
    const [artworks, stores] = await Promise.all([
      supabase
        .from(TABLES.ARTWORK_CATALOG)
        .select('*')
        .or(`title.ilike.%${query}%,artist.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10),
      supabase
        .from(TABLES.STORE_INFO)
        .select('*')
        .or(`name.ilike.%${query}%,address.ilike.%${query}%`)
        .limit(10)
    ]);

    return {
      artworks: artworks.data || [],
      stores: stores.data || []
    };
  }
}