'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { dashboardService, DashboardStats, Activity, SystemHealth, AnalyticsData } from '@/services/dashboard';
import Chart from '@/components/dashboard/Chart';
import CacheManagement from '@/components/dashboard/CacheManagement';

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsData, activitiesData, healthData, analyticsData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivities(),
        dashboardService.getSystemHealth(),
        dashboardService.getAnalyticsData('7d')
      ]);

      setStats(statsData);
      setActivities(activitiesData);
      setSystemHealth(healthData);
      setAnalytics(analyticsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return '📸';
      case 'ai':
        return '🤖';
      case 'purchase':
        return '🛒';
      case 'chat':
        return '💬';
      default:
        return '📝';
    }
  };

  const getHealthColor = (value: number) => {
    if (value >= 90) return 'text-green-500';
    if (value >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthBgColor = (value: number) => {
    if (value >= 90) return 'bg-green-500';
    if (value >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Real-time analytics and system monitoring
              {lastUpdated && (
                <span className="ml-2 text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadDashboardData}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats ? Object.entries(stats).map(([key, stat]) => (
            <div key={key} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 capitalize">
                    {key.replace('_', ' ')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`flex items-center ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
            </div>
          )) : (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {['overview', 'analytics', 'cache'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
                    {systemHealth ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">System Health</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm">
                                <span>CPU Usage</span>
                                <span className={getHealthColor(systemHealth.cpu)}>{systemHealth.cpu}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${getHealthBgColor(systemHealth.cpu)}`} 
                                  style={{ width: `${systemHealth.cpu}%` }}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm">
                                <span>Memory Usage</span>
                                <span className={getHealthColor(systemHealth.memory)}>{systemHealth.memory}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${getHealthBgColor(systemHealth.memory)}`} 
                                  style={{ width: `${systemHealth.memory}%` }}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm">
                                <span>Storage</span>
                                <span className={getHealthColor(systemHealth.storage)}>{systemHealth.storage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${getHealthBgColor(systemHealth.storage)}`} 
                                  style={{ width: `${systemHealth.storage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Service Status</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <span className="text-sm font-medium text-green-800">AI Service</span>
                              <span className="text-sm text-green-600">{systemHealth.api_uptime}% uptime</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <span className="text-sm font-medium text-green-800">Database</span>
                              <span className="text-sm text-green-600">{systemHealth.database_uptime}% uptime</span>
                            </div>
                            <div className={`flex items-center justify-between p-3 rounded-lg ${
                              systemHealth.redis_healthy ? 'bg-green-50' : 'bg-red-50'
                            }`}>
                              <span className={`text-sm font-medium ${
                                systemHealth.redis_healthy ? 'text-green-800' : 'text-red-800'
                              }`}>Redis Cache</span>
                              <span className={`text-sm ${
                                systemHealth.redis_healthy ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {systemHealth.redis_healthy ? 'Connected' : 'Disconnected'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h3>
                    {analytics ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Chart
                            data={analytics.user_growth}
                            title="User Growth"
                            type="line"
                            color="#8B5CF6"
                          />
                          <Chart
                            data={analytics.recommendations}
                            title="AI Recommendations"
                            type="bar"
                            color="#06B6D4"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Chart
                            data={{
                              labels: analytics.top_styles.map(s => s.style),
                              data: analytics.top_styles.map(s => s.count)
                            }}
                            title="Popular Styles"
                            type="doughnut"
                          />
                          <div className="bg-white rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Style Distribution</h4>
                            <div className="space-y-2">
                              {analytics.top_styles.map((style, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">{style.style}</span>
                                  <div className="flex items-center space-x-2">
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${style.percentage}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 w-8">{style.percentage}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
                          <p>Loading analytics...</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'cache' && (
                  <div>
                    <CacheManagement onRefresh={loadDashboardData} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {activities.length > 0 ? activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="text-lg">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.user_email}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-gray-500 py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto mb-2"></div>
                    <p>Loading activities...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/admin/users"
                  className="w-full bg-purple-500 text-white py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors text-center block"
                >
                  Manage Users
                </Link>
                <Link
                  href="/upload-manager"
                  className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors text-center block"
                >
                  Upload Manager
                </Link>
                <Link
                  href="/trending"
                  className="w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition-colors text-center block"
                >
                  View Trends
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
