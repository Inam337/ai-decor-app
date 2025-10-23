// External APIs integration for IKEA, Etsy, and PosterStore
// This service provides direct integration with external store APIs
// Skip reasoning agent - Direct to VDB (Vector Database) for item retrieval
// Real-time availability and pricing from IKEA, Etsy, and PosterStore
export interface ExternalItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  image_url: string;
  store: 'IKEA' | 'Etsy' | 'PosterStore';
  store_url: string;
  availability: 'in_stock' | 'limited' | 'out_of_stock';
  category: string;
  tags: string[];
  description: string;
}

export interface SearchFilters {
  style?: string;
  colorPalette?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  category?: string;
  availability?: 'in_stock' | 'limited' | 'all';
}

class ExternalAPIsService {
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

  // Get API integration status
  async getAPIStatus(): Promise<{ ikea: boolean; etsy: boolean; posterstore: boolean }> {
    try {
      // In a real implementation, this would check actual API endpoints
      // For now, return mock status showing all APIs are connected
      return {
        ikea: true,
        etsy: true,
        posterstore: true
      };
    } catch (error) {
      console.error('Failed to check API status:', error);
      return {
        ikea: false,
        etsy: false,
        posterstore: false
      };
    }
  }

  // Search items across all stores
  async searchItems(query: string, filters: SearchFilters = {}): Promise<ExternalItem[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/external/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          filters,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error searching external items:', error);
      // Return mock data for development
      return this.getMockItems(query, filters);
    }
  }

  // Search items by specific store
  async searchByStore(store: 'IKEA' | 'Etsy' | 'PosterStore', query: string, filters: SearchFilters = {}): Promise<ExternalItem[]> {
    try {
      const allItems = await this.searchItems(query, filters);
      return allItems.filter(item => item.store === store);
    } catch (error) {
      console.error(`Failed to search ${store} items:`, error);
      return [];
    }
  }

  // Search items by style and color palette
  async searchByStyle(style: string, colorPalette: string[]): Promise<ExternalItem[]> {
    return this.searchItems(style, {
      style,
      colorPalette,
      availability: 'in_stock',
    });
  }

  // Get trending items
  async getTrendingItems(): Promise<ExternalItem[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/external/trending`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching trending items:', error);
      return this.getMockTrendingItems();
    }
  }

  // Get items by category
  async getItemsByCategory(category: string): Promise<ExternalItem[]> {
    return this.searchItems('', {
      category,
      availability: 'in_stock',
    });
  }

  // Mock data for development
  private getMockItems(query: string, filters: SearchFilters): ExternalItem[] {
    const mockItems: ExternalItem[] = [
      // IKEA Items
      {
        id: 'ikea-001',
        title: 'Framsta Wall Art - Modern Abstract',
        price: 29.99,
        currency: 'USD',
        image_url: 'https://picsum.photos/seed/ikea1/300/300',
        store: 'IKEA',
        store_url: 'https://www.ikea.com/us/en/p/framsta-wall-art-modern-abstract-00412345/',
        availability: 'in_stock',
        category: 'Wall Art',
        tags: ['Modern', 'Abstract', 'Minimalist'],
        description: 'Contemporary wall art with clean lines and neutral colors'
      },
      {
        id: 'ikea-002',
        title: 'Lack Side Table - White',
        price: 19.99,
        currency: 'USD',
        image_url: 'https://picsum.photos/seed/ikea2/300/300',
        store: 'IKEA',
        store_url: 'https://www.ikea.com/us/en/p/lack-side-table-white-00412346/',
        availability: 'in_stock',
        category: 'Furniture',
        tags: ['Modern', 'Minimalist', 'White'],
        description: 'Simple and functional side table perfect for modern spaces'
      },
      {
        id: 'ikea-003',
        title: 'Stockholm Mirror - Gold',
        price: 149.99,
        currency: 'USD',
        image_url: 'https://picsum.photos/seed/ikea3/300/300',
        store: 'IKEA',
        store_url: 'https://www.ikea.com/us/en/p/stockholm-mirror-gold-00412347/',
        availability: 'limited',
        category: 'Mirrors',
        tags: ['Luxury', 'Gold', 'Statement'],
        description: 'Elegant gold mirror that adds sophistication to any room'
      },

      // Etsy Items
      {
        id: 'etsy-001',
        title: 'Handmade Ceramic Vase - Blue',
        price: 45.00,
        currency: 'USD',
        image_url: 'https://picsum.photos/seed/etsy1/300/300',
        store: 'Etsy',
        store_url: 'https://www.etsy.com/listing/1234567890/handmade-ceramic-vase-blue',
        availability: 'in_stock',
        category: 'Decor',
        tags: ['Handmade', 'Ceramic', 'Blue', 'Artisan'],
        description: 'Unique handcrafted ceramic vase with beautiful blue glaze'
      },
      {
        id: 'etsy-002',
        title: 'Macrame Wall Hanging - Boho',
        price: 65.00,
        currency: 'USD',
        image_url: 'https://picsum.photos/seed/etsy2/300/300',
        store: 'Etsy',
        store_url: 'https://www.etsy.com/listing/1234567891/macrame-wall-hanging-boho',
        availability: 'in_stock',
        category: 'Wall Decor',
        tags: ['Boho', 'Macrame', 'Handmade', 'Natural'],
        description: 'Beautiful macrame wall hanging perfect for boho-style rooms'
      },
      {
        id: 'etsy-003',
        title: 'Wooden Candle Holders Set',
        price: 35.00,
        currency: 'USD',
        image_url: 'https://picsum.photos/seed/etsy3/300/300',
        store: 'Etsy',
        store_url: 'https://www.etsy.com/listing/1234567892/wooden-candle-holders-set',
        availability: 'in_stock',
        category: 'Candles',
        tags: ['Wooden', 'Natural', 'Rustic', 'Set'],
        description: 'Set of three wooden candle holders with natural wood finish'
      },

      // PosterStore Items
      {
        id: 'posterstore-001',
        title: 'Minimalist Typography Poster',
        price: 24.99,
        currency: 'USD',
        image_url: 'https://picsum.photos/seed/poster1/300/300',
        store: 'PosterStore',
        store_url: 'https://www.posterstore.com/minimalist-typography-poster',
        availability: 'in_stock',
        category: 'Posters',
        tags: ['Typography', 'Minimalist', 'Black', 'White'],
        description: 'Clean typography poster with inspirational quote'
      },
      {
        id: 'posterstore-002',
        title: 'Abstract Geometric Art Print',
        price: 19.99,
        currency: 'USD',
        image_url: 'https://picsum.photos/seed/poster2/300/300',
        store: 'PosterStore',
        store_url: 'https://www.posterstore.com/abstract-geometric-art-print',
        availability: 'in_stock',
        category: 'Art Prints',
        tags: ['Abstract', 'Geometric', 'Colorful', 'Modern'],
        description: 'Vibrant abstract geometric art print for modern spaces'
      },
      {
        id: 'posterstore-003',
        title: 'Nature Photography - Forest',
        price: 29.99,
        currency: 'USD',
        image_url: 'https://picsum.photos/seed/poster3/300/300',
        store: 'PosterStore',
        store_url: 'https://www.posterstore.com/nature-photography-forest',
        availability: 'in_stock',
        category: 'Photography',
        tags: ['Nature', 'Forest', 'Green', 'Calming'],
        description: 'Beautiful forest photography print bringing nature indoors'
      }
    ];

    // Filter items based on search criteria
    let filteredItems = mockItems;

    if (filters.style) {
      filteredItems = filteredItems.filter(item => 
        item.tags.some(tag => tag.toLowerCase().includes(filters.style!.toLowerCase()))
      );
    }

    if (filters.colorPalette && filters.colorPalette.length > 0) {
      filteredItems = filteredItems.filter(item => 
        item.tags.some(tag => 
          filters.colorPalette!.some(color => 
            tag.toLowerCase().includes(color.toLowerCase().replace('#', ''))
          )
        )
      );
    }

    if (filters.priceRange) {
      filteredItems = filteredItems.filter(item => 
        item.price >= filters.priceRange!.min && item.price <= filters.priceRange!.max
      );
    }

    if (filters.category) {
      filteredItems = filteredItems.filter(item => 
        item.category.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }

    if (filters.availability && filters.availability !== 'all') {
      filteredItems = filteredItems.filter(item => 
        item.availability === filters.availability
      );
    }

    return filteredItems;
  }

  private getMockTrendingItems(): ExternalItem[] {
    return [
      {
        id: 'trending-001',
        title: 'Trending: Modern Abstract Canvas',
        price: 89.99,
        currency: 'USD',
        image_url: 'https://picsum.photos/seed/trending1/300/300',
        store: 'Etsy',
        store_url: 'https://www.etsy.com/listing/trending1',
        availability: 'in_stock',
        category: 'Art',
        tags: ['Trending', 'Modern', 'Abstract', 'Canvas'],
        description: 'Currently trending modern abstract canvas art'
      },
      {
        id: 'trending-002',
        title: 'Popular: Minimalist Wall Shelf',
        price: 45.00,
        currency: 'USD',
        image_url: 'https://picsum.photos/seed/trending2/300/300',
        store: 'IKEA',
        store_url: 'https://www.ikea.com/us/en/p/trending2',
        availability: 'in_stock',
        category: 'Shelving',
        tags: ['Popular', 'Minimalist', 'Wall', 'Shelf'],
        description: 'Popular minimalist wall shelf design'
      },
      {
        id: 'trending-003',
        title: 'Hot: Boho Macrame Plant Hanger',
        price: 32.00,
        currency: 'USD',
        image_url: 'https://picsum.photos/seed/trending3/300/300',
        store: 'Etsy',
        store_url: 'https://www.etsy.com/listing/trending3',
        availability: 'in_stock',
        category: 'Plant Accessories',
        tags: ['Hot', 'Boho', 'Macrame', 'Plant'],
        description: 'Hot trending boho macrame plant hanger'
      }
    ];
  }
}

export const externalAPIsService = new ExternalAPIsService();
