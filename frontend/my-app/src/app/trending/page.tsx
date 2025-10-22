'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { apiService, TrendingStyle } from '@/services/api';

export default function TrendingPage() {
  const [trends, setTrends] = useState<TrendingStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Trends' },
    { value: 'style', label: 'Styles' },
    { value: 'color', label: 'Colors' },
    { value: 'material', label: 'Materials' },
    { value: 'form', label: 'Forms' },
    { value: 'finish', label: 'Finishes' }
  ];

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    try {
      setLoading(true);
      const results = await apiService.getTrendingStyles('interior design trends 2024', 15);
      setTrends(results);
    } catch (error) {
      console.error('Failed to load trends:', error);
      // Fallback to mock data
      setTrends([
        {
          title: 'Minimalist Scandinavian Design',
          content: 'Clean lines, neutral colors, and natural materials continue to dominate interior design trends.',
          relevance_score: 0.9,
          trend_type: 'style'
        },
        {
          title: 'Sustainable Eco-Friendly Decor',
          content: 'Biophilic design and sustainable materials are gaining popularity in home decor.',
          relevance_score: 0.8,
          trend_type: 'material'
        },
        {
          title: 'Warm Earth Tones',
          content: 'Terracotta, sage green, and warm beiges are replacing cool grays in color palettes.',
          relevance_score: 0.85,
          trend_type: 'color'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrends = trends.filter(trend => 
    selectedCategory === 'all' || trend.trend_type === selectedCategory
  );

  const getTrendIcon = (type: string) => {
    switch (type) {
      case 'style':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        );
      case 'color':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        );
      case 'material':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
    }
  };

  const getTrendColor = (type: string) => {
    switch (type) {
      case 'style': return 'from-blue-500 to-blue-600';
      case 'color': return 'from-purple-500 to-purple-600';
      case 'material': return 'from-green-500 to-green-600';
      case 'form': return 'from-orange-500 to-orange-600';
      case 'finish': return 'from-pink-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-7xl mx-auto px-4 py-8 pt-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Trending Design Styles</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the latest interior design trends and get inspired for your space
          </p>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trends */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-600">Loading trending styles...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredTrends.length} trend{filteredTrends.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrends.map((trend, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${getTrendColor(trend.trend_type)} p-6`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white">
                          {getTrendIcon(trend.trend_type)}
                        </div>
                        <div>
                          <span className="text-white/80 text-sm font-medium capitalize">
                            {trend.trend_type}
                          </span>
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-white text-sm font-medium">
                              {(trend.relevance_score * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{trend.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{trend.content}</p>
                    
                    {/* Action */}
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                        Get Inspired
                      </button>
                      <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTrends.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.57M15 6.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trends found</h3>
                <p className="text-gray-500">Try selecting a different category to see more trends</p>
              </div>
            )}
          </>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Space?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Upload your room photo and get personalized artwork recommendations based on the latest trends
          </p>
          <Link
            href="/upload-manager"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}