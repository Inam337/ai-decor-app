'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { apiService } from '@/services/api';
import { ArtworkItem } from '@/types';

export default function RecommendationsPage() {
  const [artworks, setArtworks] = useState<ArtworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const styles = [
    { value: 'all', label: 'All Styles' },
    { value: 'modern', label: 'Modern' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'traditional', label: 'Traditional' },
    { value: 'contemporary', label: 'Contemporary' },
    { value: 'scandinavian', label: 'Scandinavian' }
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-100', label: 'Under $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200-500', label: '$200 - $500' },
    { value: '500+', label: '$500+' }
  ];

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      );
      
      const apiPromise = apiService.searchArtwork('artwork', 20);
      const results = await Promise.race([apiPromise, timeoutPromise]) as ArtworkItem[];
      setArtworks(results);
    } catch (error) {
      console.error('Failed to load artworks:', error);
      setError('Failed to load artworks from server. Showing sample data.');
      // Fallback to mock data
      setArtworks([
        {
          id: 'art_001',
          title: 'Abstract Modern Canvas',
          artist: 'Contemporary Artist',
          style: 'modern',
          colors: ['#2c3e50', '#3498db', '#e74c3c'],
          price: 150,
          size: '24x36 inches',
          medium: 'Acrylic on Canvas',
          description: 'Bold abstract composition with vibrant colors',
          image_url: 'https://example.com/art1.jpg',
          tags: ['abstract', 'modern', 'colorful', 'contemporary']
        },
        {
          id: 'art_002',
          title: 'Minimalist Landscape',
          artist: 'Nature Artist',
          style: 'minimalist',
          colors: ['#f8f9fa', '#6c757d', '#495057'],
          price: 200,
          size: '30x40 inches',
          medium: 'Oil on Canvas',
          description: 'Serene minimalist landscape with soft tones',
          image_url: 'https://example.com/art2.jpg',
          tags: ['minimalist', 'landscape', 'serene', 'neutral']
        },
        {
          id: 'art_003',
          title: 'Contemporary Geometric',
          artist: 'Modern Designer',
          style: 'contemporary',
          colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
          price: 180,
          size: '20x30 inches',
          medium: 'Mixed Media',
          description: 'Bold geometric patterns with contemporary flair',
          image_url: 'https://example.com/art3.jpg',
          tags: ['geometric', 'contemporary', 'bold', 'modern']
        },
        {
          id: 'art_004',
          title: 'Traditional Still Life',
          artist: 'Classic Painter',
          style: 'traditional',
          colors: ['#8b4513', '#daa520', '#228b22'],
          price: 250,
          size: '18x24 inches',
          medium: 'Oil on Canvas',
          description: 'Classic still life with warm earth tones',
          image_url: 'https://example.com/art4.jpg',
          tags: ['traditional', 'still-life', 'classic', 'warm']
        },
        {
          id: 'art_005',
          title: 'Scandinavian Simplicity',
          artist: 'Nordic Artist',
          style: 'scandinavian',
          colors: ['#ffffff', '#e8e8e8', '#d3d3d3'],
          price: 120,
          size: '16x20 inches',
          medium: 'Watercolor',
          description: 'Clean lines and minimalist Scandinavian design',
          image_url: 'https://example.com/art5.jpg',
          tags: ['scandinavian', 'minimalist', 'clean', 'simple']
        },
        {
          id: 'art_006',
          title: 'Modern Abstract Expression',
          artist: 'Expressionist',
          style: 'modern',
          colors: ['#ff4757', '#ffa502', '#2ed573'],
          price: 300,
          size: '36x48 inches',
          medium: 'Acrylic on Canvas',
          description: 'Dynamic abstract expression with vibrant energy',
          image_url: 'https://example.com/art6.jpg',
          tags: ['abstract', 'expressionist', 'dynamic', 'vibrant']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtworks = artworks.filter(artwork => {
    const styleMatch = selectedStyle === 'all' || artwork.style === selectedStyle;
    
    let priceMatch = true;
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(p => p === '+' ? Infinity : parseInt(p));
      priceMatch = artwork.price >= min && (max === undefined || artwork.price <= max);
    }
    
    return styleMatch && priceMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-7xl mx-auto px-4 py-8 pt-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Artwork Recommendations</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover perfect artwork pieces that match your space and style preferences
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {styles.map(style => (
                  <option key={style.value} value={style.value}>{style.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-600">Loading recommendations...</p>
          </div>
        ) : (
          <>
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-yellow-800">{error}</p>
                  </div>
                  <button
                    onClick={loadArtworks}
                    className="ml-4 px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredArtworks.length} artwork{filteredArtworks.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtworks.map((artwork) => (
                <div key={artwork.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Image Placeholder */}
                  <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">Artwork Image</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{artwork.title}</h3>
                      <span className="text-lg font-bold text-blue-600">${artwork.price}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">by {artwork.artist}</p>
                    <p className="text-sm text-gray-500 mb-4">{artwork.description}</p>
                    
                    {/* Color Palette */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Color Palette</p>
                      <div className="flex space-x-1">
                        {artwork.colors.slice(0, 5).map((color: string, index: number) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: color }}
                            title={color}
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {artwork.tags.slice(0, 3).map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="text-xs text-gray-500 mb-4">
                      <p>{artwork.size} • {artwork.medium}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                        View Details
                      </button>
                      <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredArtworks.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.57M15 6.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No artworks found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}