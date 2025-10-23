import { apiService } from './api';

export interface DashboardStats {
  total_users: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
  active_sessions: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
  ai_recommendations: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
  revenue: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
}

export interface Activity {
  id: number;
  user_email: string;
  action: string;
  timestamp: string;
  type: 'upload' | 'ai' | 'purchase' | 'chat';
}

export interface SystemHealth {
  cpu: number;
  memory: number;
  storage: number;
  api_uptime: number;
  database_uptime: number;
  redis_healthy: boolean;
  cache_stats: {
    total_keys: number;
    by_type: Record<string, number>;
    memory_usage: number;
    hit_rate: number;
  };
}

export interface AnalyticsData {
  period: string;
  user_growth: {
    labels: string[];
    data: number[];
  };
  recommendations: {
    labels: string[];
    data: number[];
  };
  revenue: {
    labels: string[];
    data: number[];
  };
  top_styles: Array<{
    style: string;
    count: number;
    percentage: number;
  }>;
}

export interface CacheStats {
  total_keys: number;
  by_type: Record<string, number>;
  memory_usage: number;
  hit_rate: number;
}

class DashboardService {
  private baseUrl = '/api/dashboard';

  async getStats(): Promise<DashboardStats> {
    try {
      const response = await apiService.get(`${this.baseUrl}/stats`);
      return response.stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getRecentActivities(): Promise<Activity[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/activities`);
      return response.activities;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  }

  async getSystemHealth(): Promise<SystemHealth> {
    try {
      const response = await apiService.get(`${this.baseUrl}/system-health`);
      return response.health;
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  }

  async getAnalyticsData(period: string = '7d'): Promise<AnalyticsData> {
    try {
      const response = await apiService.get(`${this.baseUrl}/analytics?period=${period}`);
      return response.analytics;
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  }

  async getCacheStats(): Promise<CacheStats> {
    try {
      const response = await apiService.get('/api/cache/stats');
      return response.stats;
    } catch (error) {
      console.error('Error fetching cache stats:', error);
      throw error;
    }
  }

  async invalidateUserCache(userId: string, cacheTypes?: string[]): Promise<number> {
    try {
      const response = await apiService.post(`/api/cache/invalidate/user/${userId}`, {
        cache_types: cacheTypes
      });
      return response.invalidated_count;
    } catch (error) {
      console.error('Error invalidating user cache:', error);
      throw error;
    }
  }

  async invalidateStaleTrends(maxAgeHours: number = 6): Promise<number> {
    try {
      const response = await apiService.post('/api/cache/invalidate/trends', {
        max_age_hours: maxAgeHours
      });
      return response.invalidated_count;
    } catch (error) {
      console.error('Error invalidating stale trends:', error);
      throw error;
    }
  }

  async warmUpCache(userId: string, commonStyles?: string[]): Promise<number> {
    try {
      const response = await apiService.post(`/api/cache/warmup/${userId}`, {
        common_styles: commonStyles
      });
      return response.warmed_count;
    } catch (error) {
      console.error('Error warming up cache:', error);
      throw error;
    }
  }

  async getRedisHealth(): Promise<{ status: string; connected: boolean; error?: string }> {
    try {
      const response = await apiService.get('/api/health/redis');
      return {
        status: response.status,
        connected: response.connected,
        error: response.error
      };
    } catch (error) {
      console.error('Error checking Redis health:', error);
      return {
        status: 'unhealthy',
        connected: false,
        error: 'Failed to check Redis health'
      };
    }
  }
}

export const dashboardService = new DashboardService();
