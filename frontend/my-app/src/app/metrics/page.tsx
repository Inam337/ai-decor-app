'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";

export default function SystemMetricsPage() {
  const [timeRange, setTimeRange] = useState('24h');
  const [metrics, setMetrics] = useState({
    cpu: 45,
    memory: 67,
    storage: 23,
    network: 89,
    apiLatency: 120,
    errorRate: 0.2,
    uptime: 99.9
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.max(20, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(95, prev.memory + (Math.random() - 0.5) * 8)),
        network: Math.max(50, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
        apiLatency: Math.max(50, Math.min(500, prev.apiLatency + (Math.random() - 0.5) * 50))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'High CPU usage detected', timestamp: '2 min ago', resolved: false },
    { id: 2, type: 'info', message: 'Scheduled maintenance completed', timestamp: '1 hour ago', resolved: true },
    { id: 3, type: 'error', message: 'API endpoint timeout', timestamp: '3 hours ago', resolved: true }
  ];

  const performanceData = [
    { time: '00:00', requests: 120, latency: 95, errors: 2 },
    { time: '04:00', requests: 80, latency: 110, errors: 1 },
    { time: '08:00', requests: 450, latency: 125, errors: 5 },
    { time: '12:00', requests: 680, latency: 140, errors: 8 },
    { time: '16:00', requests: 520, latency: 130, errors: 3 },
    { time: '20:00', requests: 380, latency: 115, errors: 2 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">System Metrics</h2>
              <p className="text-gray-600">Real-time system performance and monitoring</p>
            </div>
            <div className="flex space-x-2">
              {['1h', '24h', '7d', '30d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-purple-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">CPU Usage</h3>
              <span className="text-2xl font-bold text-gray-900">{metrics.cpu.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  metrics.cpu > 80 ? 'bg-red-500' : metrics.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{width: `${metrics.cpu}%`}}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Memory Usage</h3>
              <span className="text-2xl font-bold text-gray-900">{metrics.memory.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  metrics.memory > 85 ? 'bg-red-500' : metrics.memory > 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{width: `${metrics.memory}%`}}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Storage</h3>
              <span className="text-2xl font-bold text-gray-900">{metrics.storage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  metrics.storage > 80 ? 'bg-red-500' : metrics.storage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{width: `${metrics.storage}%`}}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Network</h3>
              <span className="text-2xl font-bold text-gray-900">{metrics.network.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  metrics.network > 90 ? 'bg-red-500' : metrics.network > 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{width: `${metrics.network}%`}}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Over Time</h3>
              <div className="h-64 bg-gray-50 rounded-lg p-4">
                <div className="h-full flex items-end justify-between space-x-2">
                  {performanceData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div className="w-8 bg-blue-500 rounded-t" style={{height: `${(data.requests / 700) * 200}px`}}></div>
                      <span className="text-xs text-gray-600">{data.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* API Metrics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">API Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{metrics.apiLatency.toFixed(0)}ms</div>
                  <div className="text-sm text-gray-600">Average Latency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{metrics.errorRate}%</div>
                  <div className="text-sm text-gray-600">Error Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{metrics.uptime}%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts and Status */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
              <div className="space-y-3">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                    alert.type === 'error' ? 'border-red-500 bg-red-50' :
                    alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      {alert.resolved && (
                        <span className="text-xs text-green-600 font-medium">Resolved</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">AI Service</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600 font-medium">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600 font-medium">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">File Storage</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600 font-medium">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Service</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600 font-medium">Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
