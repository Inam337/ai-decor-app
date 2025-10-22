// API service to connect with the backend
import { 
  RoomAnalysisResult, 
  ArtworkItem, 
  TrendingStyle, 
  NearbyStore, 
  UserProfile, 
  UserSession,
  UserPreferences,
  APIError 
} from '@/types';

const API_BASE_URL = 'http://localhost:8000';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('supabase.auth.token');
  }
  return null;
};

class APIService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Only set Content-Type for JSON requests, not for FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async analyzeRoom(imageFile: File, userId: string, location?: string): Promise<RoomAnalysisResult> {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (location) {
      formData.append('location', location);
    }

    return this.request<RoomAnalysisResult>('/api/analyze-room', {
      method: 'POST',
      body: formData,
    });
  }

  async processTextQuery(query: string, userId: string, location?: string): Promise<RoomAnalysisResult> {
    const formData = new FormData();
    formData.append('query', query);
    if (location) {
      formData.append('location', location);
    }

    return this.request<RoomAnalysisResult>('/api/text-query', {
      method: 'POST',
      body: formData,
    });
  }

  async getTrendingStyles(query: string = 'interior design trends 2024', maxResults: number = 10): Promise<TrendingStyle[]> {
    const response = await this.request<{ success: boolean; trends: TrendingStyle[] }>(`/api/trends?query=${encodeURIComponent(query)}&max_results=${maxResults}`);
    return response.trends;
  }

  async getNearbyStores(location: string, radius: number = 5000): Promise<NearbyStore[]> {
    const response = await this.request<{ success: boolean; stores: NearbyStore[] }>(`/api/nearby-stores?location=${encodeURIComponent(location)}&radius=${radius}`);
    return response.stores;
  }

  async searchArtwork(query: string, k: number = 5): Promise<ArtworkItem[]> {
    const response = await this.request<{ success: boolean; artworks: ArtworkItem[] }>(`/api/artwork/search?query=${encodeURIComponent(query)}&k=${k}`);
    return response.artworks;
  }

  async getUserProfile(): Promise<UserProfile> {
    const response = await this.request<{ success: boolean; profile: UserProfile }>('/api/user-profile');
    return response.profile;
  }

  async createUserProfile(preferences: UserProfile['preferences']): Promise<UserProfile> {
    const response = await this.request<{ success: boolean; profile: UserProfile }>('/api/user-profile', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
    return response.profile;
  }

  async updateUserProfile(preferences: UserProfile['preferences']): Promise<UserProfile> {
    const response = await this.request<{ success: boolean; profile: UserProfile }>('/api/user-profile', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
    return response.profile;
  }

  async getUserSessions(limit: number = 10): Promise<UserSession[]> {
    const response = await this.request<{ success: boolean; sessions: UserSession[] }>(`/api/user-sessions?limit=${limit}`);
    return response.sessions;
  }

  async getHealthStatus(): Promise<{ success: boolean; message: string }> {
    return this.request('/health');
  }
}

export const apiService = new APIService();
