'use client';

import { useState, useEffect } from 'react';
import { dashboardService, CacheStats } from '@/services/dashboard';

interface CacheManagementProps {
  onRefresh?: () => void;
}

export default function CacheManagement({ onRefresh }: CacheManagementProps) {
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadCacheStats();
  }, []);

  const loadCacheStats = async () => {
    try {
      setIsLoading(true);
      const stats = await dashboardService.getCacheStats();
      setCacheStats(stats);
    } catch (error) {
      console.error('Error loading cache stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvalidateUserCache = async () => {
    try {
      setIsLoading(true);
      const count = await dashboardService.invalidateUserCache('all');
      setMessage({ type: 'success', text: `Invalidated ${count} user cache entries` });
      loadCacheStats();
      onRefresh?.();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to invalidate user cache' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvalidateStaleTrends = async () => {
    try {
      setIsLoading(true);
      const count = await dashboardService.invalidateStaleTrends(6);
      setMessage({ type: 'success', text: `Invalidated ${count} stale trend entries` });
      loadCacheStats();
      onRefresh?.();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to invalidate stale trends' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWarmUpCache = async () => {
    try {
      setIsLoading(true);
      const count = await dashboardService.warmUpCache('system', ['modern', 'traditional', 'scandinavian']);
      setMessage({ type: 'success', text: `Warmed up ${count} cache entries` });
      loadCacheStats();
      onRefresh?.();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to warm up cache' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Cache Management</h3>
        <button
          onClick={loadCacheStats}
          disabled={isLoading}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {cacheStats && (
        <div className="space-y-6">
          {/* Cache Statistics */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Cache Statistics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Total Keys</div>
                <div className="text-lg font-semibold text-gray-900">{cacheStats.total_keys}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Memory Usage</div>
                <div className="text-lg font-semibold text-gray-900">{formatBytes(cacheStats.memory_usage)}</div>
              </div>
            </div>
          </div>

          {/* Cache by Type */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Cache by Type</h4>
            <div className="space-y-2">
              {Object.entries(cacheStats.by_type).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">{type.replace('_', ' ')}</span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cache Actions */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Cache Actions</h4>
            <div className="space-y-2">
              <button
                onClick={handleInvalidateUserCache}
                disabled={isLoading}
                className="w-full px-4 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                Invalidate User Cache
              </button>
              <button
                onClick={handleInvalidateStaleTrends}
                disabled={isLoading}
                className="w-full px-4 py-2 text-sm bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors disabled:opacity-50"
              >
                Invalidate Stale Trends
              </button>
              <button
                onClick={handleWarmUpCache}
                disabled={isLoading}
                className="w-full px-4 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
              >
                Warm Up Cache
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
