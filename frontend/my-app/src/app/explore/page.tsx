'use client';

import { useState } from 'react';
import Link from "next/link";
import { ArtworkService } from '@/services/database';
import { ArtworkCatalog } from '@/types/database';

export default function ExplorePage() {
  const [artworks, setArtworks] = useState<ArtworkCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    style: '',
    priceRange: { min: 0, max: 1000 },
    source: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for now - replace with actual API calls
  const mockArtworks: ArtworkCatalog[] = [
    {
      id: '1',
      title: 'Abstract Harmony',
      image_url: '/api/placeholder/300/400',
      dominant_palette: { primary: ['#8B5CF6', '#EC4899'], secondary: ['#F3F4F6', '#E5E7EB'], accent: [], dominant: '#8B5CF6', complementary: [] },
      style_tags: ['abstract', 'modern', 'colorful'],
      price: 129.99,
      source: 'PosterStore',
      dimensions: '24x36',
      artist: 'Sarah Chen',
      description: 'A vibrant abstract piece that brings energy to any space'
    },
    {
      id: '2',
      title: 'Minimalist Dreams',
      image_url: '/api/placeholder/300/400',
      dominant_palette: { primary: ['#3B82F6', '#10B981'], secondary: ['#F9FAFB', '#E5E7EB'], accent: [], dominant: '#3B82F6', complementary: [] },
      style_tags: ['minimalist', 'modern', 'blue'],
      price: 99.99,
      source: 'Etsy',
      dimensions: '18x24',
      artist: 'Mike Johnson',
      description: 'Clean lines and soothing colors for a peaceful atmosphere'
    },
    {
      id: '3',
      title: 'Urban Serenity',
      image_url: '/api/placeholder/300/400',
      dominant_palette: { primary: ['#6B7280', '#374151'], secondary: ['#F3F4F6', '#D1D5DB'], accent: [], dominant: '#6B7280', complementary: [] },
      style_tags: ['urban', 'monochrome', 'modern'],
      price: 89.99,
      source: 'Art.com',
      dimensions: '20x30',
      artist: 'Emma Davis',
      description: 'Contemporary urban art with sophisticated grayscale tones'
    },
    {
      id: '4',
      title: 'Nature Canvas',
      image_url: '/api/placeholder/300/400',
      dominant_palette: { primary: ['#059669', '#0D9488'], secondary: ['#ECFDF5', '#D1FAE5'], accent: [], dominant: '#059669', complementary: [] },
      style_tags: ['nature', 'green', 'organic'],
      price: 149.99,
      source: 'Society6',
      dimensions: '30x40',
      artist: 'Alex Rivera',
      description: 'Inspired by nature with organic shapes and earth tones'
    },
    {
      id: '5',
      title: 'Geometric Soul',
      image_url: '/api/placeholder/300/400',
      dominant_palette: { primary: ['#F59E0B', '#EF4444'], secondary: ['#FEF3C7', '#FEE2E2'], accent: [], dominant: '#F59E0B', complementary: [] },
      style_tags: ['geometric', 'bold', 'orange'],
      price: 119.99,
      source: 'PosterStore',
      dimensions: '22x28',
      artist: 'Lisa Wang',
      description: 'Bold geometric patterns with warm, energetic colors'
    },
    {
      id: '6',
      title: 'Ocean Breeze',
      image_url: '/api/placeholder/300/400',
      dominant_palette: { primary: ['#0EA5E9', '#06B6D4'], secondary: ['#E0F2FE', '#CFFAFE'], accent: [], dominant: '#0EA5E9', complementary: [] },
      style_tags: ['ocean', 'blue', 'calm'],
      price: 109.99,
      source: 'Etsy',
      dimensions: '24x32',
      artist: 'David Kim',
      description: 'Serene ocean-inspired artwork with calming blue tones'
    }
  ];

  const filteredArtworks = mockArtworks.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artwork.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artwork.style_tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStyle = !filters.style || artwork.style_tags.includes(filters.style);
    const matchesPrice = artwork.price >= filters.priceRange.min && artwork.price <= filters.priceRange.max;
    const matchesSource = !filters.source || artwork.source === filters.source;

    return matchesSearch && matchesStyle && matchesPrice && matchesSource;
  });

  const uniqueStyles = [...new Set(mockArtworks.flatMap(artwork => artwork.style_tags))];
  const uniqueSources = [...new Set(mockArtworks.map(artwork => artwork.source))];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Artwork</h2>
          <p className="text-gray-600">Discover beautiful artwork for your space</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search artwork..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Style Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
              <select
                value={filters.style}
                onChange={(e) => setFilters(prev => ({ ...prev, style: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Styles</option>
                {uniqueStyles.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    priceRange: { ...prev.priceRange, min: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    priceRange: { ...prev.priceRange, max: parseInt(e.target.value) || 1000 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Source Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
              <select
                value={filters.source}
                onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Sources</option>
                {uniqueSources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredArtworks.length} of {mockArtworks.length} artworks
          </p>
        </div>

        {/* Artwork Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtworks.map((artwork) => (
            <div key={artwork.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-64 bg-gradient-to-r from-purple-400 to-pink-500 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-white bg-opacity-90 text-gray-800 text-xs px-2 py-1 rounded-full">
                    {artwork.source}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{artwork.title}</h3>
                <p className="text-sm text-gray-600 mb-2">by {artwork.artist}</p>
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{artwork.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {artwork.style_tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-gray-900">${artwork.price}</span>
                  <span className="text-sm text-gray-500">{artwork.dimensions}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Link 
                    href={`/artwork/${artwork.id}`}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity text-center"
                  >
                    View Details
                  </Link>
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="bg-white border-2 border-purple-500 text-purple-500 px-8 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors">
            Load More Artwork
          </button>
        </div>
      </main>
    </div>
  );
}
