'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import { externalAPIsService, ExternalItem, SearchFilters } from '@/services/externalApis';

// Define TrendingStyle type locally since it was removed from api service
interface TrendingStyle {
  title: string;
  content: string;
  relevance_score: number;
  trend_type: string;
}

export default function TrendingPage() {
  const [trends, setTrends] = useState<TrendingStyle[]>([]);
  const [trendingItems, setTrendingItems] = useState<ExternalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'trends' | 'items'>('trends');

  const categories = [
    { value: 'all', label: 'All Trends' },
    { value: 'style', label: 'Styles' },
    { value: 'color', label: 'Colors' },
    { value: 'material', label: 'Materials' },
    { value: 'form', label: 'Forms' },
    { value: 'finish', label: 'Finishes' }
  ];

  const getMockTrends = (): TrendingStyle[] => [
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
    },
    {
      title: 'Maximalist Bold Patterns',
      content: 'Bold patterns, vibrant colors, and eclectic mixes are making a comeback in modern interiors.',
      relevance_score: 0.75,
      trend_type: 'style'
    },
    {
      title: 'Natural Wood Finishes',
      content: 'Raw wood textures and natural finishes are becoming increasingly popular for furniture and decor.',
      relevance_score: 0.82,
      trend_type: 'material'
    },
    {
      title: 'Jewel Tone Accents',
      content: 'Rich emerald, sapphire, and amethyst colors are being used as accent pieces in neutral spaces.',
      relevance_score: 0.78,
      trend_type: 'color'
    },
    {
      title: 'Curved Furniture Lines',
      content: 'Soft curves and organic shapes are replacing sharp angles in contemporary furniture design.',
      relevance_score: 0.88,
      trend_type: 'form'
    },
    {
      title: 'Matte Black Finishes',
      content: 'Matte black hardware and fixtures are trending for a sophisticated, modern look.',
      relevance_score: 0.79,
      trend_type: 'finish'
    }
  ];

  const loadTrends = useCallback(async () => {
    try {
      setLoading(true);
      // Check if the method exists before calling it
      if (apiService.getTrendingStyles) {
        const results = await apiService.getTrendingStyles('interior design trends 2024', 15);
        setTrends(results);
      } else {
        // Use mock data if method doesn't exist
        setTrends(getMockTrends());
      }
    } catch (error) {
      console.error('Failed to load trends:', error);
      // Fallback to mock data
      setTrends(getMockTrends());
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTrendingItems = async () => {
    try {
      const items = await externalAPIsService.getTrendingItems();
      setTrendingItems(items);
    } catch (error) {
      console.error('Failed to load trending items:', error);
    }
  };

  useEffect(() => {
    loadTrends();
    loadTrendingItems();
  }, [loadTrends]);

  const searchItemsByTrend = async (trend: TrendingStyle) => {
    try {
      setLoading(true);
      const filters: SearchFilters = {
        style: trend.title,
        availability: 'in_stock'
      };
      
      const items = await externalAPIsService.searchItems(trend.title, filters);
      setTrendingItems(items);
      setViewMode('items');
    } catch (error) {
      console.error('Failed to search items by trend:', error);
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {viewMode === 'trends' ? '🔍 Find Items - Browse Available Online Items' : '🛍️ Available Items from IKEA, Etsy & PosterStore'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            {viewMode === 'trends' 
              ? 'Discover trending design styles and find related items from IKEA, Etsy, and PosterStore'
              : 'Browse available items from IKEA, Etsy, and PosterStore - Skip reasoning agent, direct to VDB'
            }
          </p>
          
          {/* Store Integration Status */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-green-200">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">IKEA API</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Etsy API</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">PosterStore API</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex justify-center">
            <div className="bg-white rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode('trends')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'trends'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Design Trends
              </button>
              <button
                onClick={() => setViewMode('items')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'items'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Available Items
              </button>
            </div>
          </div>
        </div>

        {/* API Integration Showcase */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 mb-8 border-2 border-green-200">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">🚀 Direct API Integration</h3>
            <p className="text-gray-600">Skip reasoning agent • Direct to VDB • Real-time data</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* IKEA Integration */}
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">I</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">IKEA API</h4>
              <p className="text-sm text-gray-600 mb-4">Direct integration with IKEA&apos;s product catalog</p>
              <div className="flex justify-center space-x-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Live Pricing</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Stock Status</span>
              </div>
            </div>

            {/* Etsy Integration */}
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">E</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Etsy API</h4>
              <p className="text-sm text-gray-600 mb-4">Access to handmade and vintage items</p>
              <div className="flex justify-center space-x-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Handmade</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Unique</span>
              </div>
            </div>

            {/* PosterStore Integration */}
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">P</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">PosterStore API</h4>
              <p className="text-sm text-gray-600 mb-4">Art prints and wall decorations</p>
              <div className="flex justify-center space-x-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Art Prints</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Wall Art</span>
              </div>
            </div>
          </div>
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

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-600">
              {viewMode === 'trends' ? 'Loading trending styles...' : 'Loading available items...'}
            </p>
          </div>
        ) : (
          <>
            {/* Trends View */}
            {viewMode === 'trends' && (
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
                      <button 
                        onClick={() => searchItemsByTrend(trend)}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        🔍 Find Items
                        <div className="text-xs font-normal mt-1 opacity-90">
                          Skip reasoning • Direct to VDB
                        </div>
                      </button>
                      <button className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
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

            {/* Items View */}
            {viewMode === 'items' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-gray-600 text-lg">
                      Showing {trendingItems.length} available item{trendingItems.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Direct integration with IKEA, Etsy, and PosterStore APIs
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">IKEA</span>
                    <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">Etsy</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">PosterStore</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {trendingItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all transform hover:scale-105">
                      {/* Store Badge */}
                      <div className="relative">
                        <img 
                          src={item.image_url} 
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.store === 'IKEA' ? 'bg-blue-500 text-white shadow-lg' :
                            item.store === 'Etsy' ? 'bg-green-500 text-white shadow-lg' :
                            'bg-purple-500 text-white shadow-lg'
                          }`}>
                            {item.store} API
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.availability === 'in_stock' ? 'bg-green-500 text-white' :
                            item.availability === 'limited' ? 'bg-yellow-500 text-white' :
                            'bg-red-500 text-white'
                          }`}>
                            {item.availability === 'in_stock' ? 'In Stock' :
                             item.availability === 'limited' ? 'Limited' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Price and Action */}
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xl font-bold text-gray-900">${item.price}</span>
                            <span className="text-sm text-gray-500 ml-1">{item.currency}</span>
                          </div>
                          <a
                            href={item.store_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
                          >
                            View Item
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {trendingItems.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                    <p className="text-gray-500">Try browsing design trends to find related items</p>
        </div>
                )}
              </>
            )}
          </>
        )}

        
      </main>
    </div>
  );
}