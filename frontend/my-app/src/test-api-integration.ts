// Frontend API Integration Test
// This file demonstrates how the new API response structure integrates with the frontend

import { RoomAnalysisResult } from '@/types';

// Mock API response matching the new structure
const mockApiResponse: RoomAnalysisResult = {
  success: true,
  room_analysis: {
    detections: {
      walls: [
        { type: "wall", color: "#f0f0f0", area: 15.5 },
        { type: "wall", color: "#e8e8e8", area: 12.3 }
      ],
      windows: [
        { type: "window", area: 2.1, position: "north" },
        { type: "window", area: 1.8, position: "south" }
      ],
      furniture: [
        { name: "sofa", type: "furniture", color: "#8B4513" },
        { name: "coffee_table", type: "furniture", color: "#654321" },
        { name: "bookshelf", type: "furniture", color: "#2F4F4F" }
      ],
      other: [
        { name: "lamp", type: "lighting", color: "#FFD700" },
        { name: "plant", type: "decoration", color: "#228B22" }
      ]
    },
    color_palette: [
      { rgb: [200, 180, 160], hex: "#c8b4a0", percentage: 35.2 },
      { rgb: [139, 69, 19], hex: "#8b4513", percentage: 25.8 },
      { rgb: [47, 79, 79], hex: "#2f4f4f", percentage: 20.1 },
      { rgb: [255, 215, 0], hex: "#ffd700", percentage: 12.5 },
      { rgb: [34, 139, 34], hex: "#228b22", percentage: 6.4 }
    ],
    lighting: {
      mean_brightness: 125.5,
      lighting_condition: "moderate"
    },
    aesthetic_style: {
      style: "modern minimalist interior design",
      confidence: 0.87
    }
  },
  recommendations: [
    {
      artwork_id: "art_001",
      title: "Modern Abstract",
      match_score: 0.95,
      reasoning: "Matches your modern style; Complements your #c8b4a0 color scheme",
      artist: "Jane Smith",
      price: 450,
      image_url: "https://example.com/art1.jpg",
      style: "modern"
    },
    {
      artwork_id: "art_002",
      title: "Minimalist Lines", 
      match_score: 0.89,
      reasoning: "Perfect for minimalist aesthetic; Neutral colors complement your space",
      artist: "John Doe",
      price: 320,
      image_url: "https://example.com/art2.jpg",
      style: "minimalist"
    },
    {
      artwork_id: "art_003",
      title: "Earth Tones",
      match_score: 0.82,
      reasoning: "Warm earth tones match your furniture; Adds natural warmth",
      artist: "Sarah Wilson",
      price: 280,
      image_url: "https://example.com/art3.jpg",
      style: "contemporary"
    }
  ],
  trend_insights: {
    evolution_insights: "Your modern style is evolving with current trends. The dominant trend for modern styles is color. Consider incorporating warm earth tones to stay current.",
    trending_complements: ["warm minimalism", "biophilic design", "curved furniture"],
    seasonal_adaptations: {
      season: "winter",
      suggestions: ["warm textiles", "cozy lighting", "rich colors", "layered textures"]
    },
    analysis_timestamp: new Date().toISOString()
  },
  location_suggestions: {
    nearby_stores: [
      {
        name: "Modern Art Gallery",
        address: "123 Main St, City",
        rating: 4.5,
        types: ["art_gallery", "home_decor"],
        phone: "+1-555-0123",
        is_open: true,
        place_id: "ChIJ123456789",
        distance: 0.8
      }
    ]
  },
  final_reasoning: "Your room has a modern minimalist interior design aesthetic with 87% confidence. The dominant color in your space is #c8b4a0. Your space has moderate lighting conditions. Our top recommendation is 'Modern Abstract' which perfectly complements your space. Based on current trends, we've also considered evolving design preferences.",
  session_id: "session_20241201_143022"
};

// Test function to verify data extraction
export function testApiIntegration() {
  console.log("Testing Frontend API Integration...");
  console.log("=" * 50);
  
  // Test room analysis data extraction
  const roomAnalysis = mockApiResponse.room_analysis;
  console.log("✓ Room Analysis Data:");
  console.log(`  - Style: ${roomAnalysis.aesthetic_style.style}`);
  console.log(`  - Confidence: ${(roomAnalysis.aesthetic_style.confidence * 100).toFixed(0)}%`);
  console.log(`  - Lighting: ${roomAnalysis.lighting.lighting_condition}`);
  console.log(`  - Color Palette: ${roomAnalysis.color_palette.length} colors`);
  
  // Test detections data extraction
  const detections = roomAnalysis.detections;
  const totalObjects = (detections.walls?.length || 0) + 
                      (detections.windows?.length || 0) + 
                      (detections.furniture?.length || 0) + 
                      (detections.other?.length || 0);
  console.log("✓ Detections Data:");
  console.log(`  - Total Objects: ${totalObjects}`);
  console.log(`  - Furniture: ${detections.furniture?.length || 0}`);
  console.log(`  - Windows: ${detections.windows?.length || 0}`);
  console.log(`  - Walls: ${detections.walls?.length || 0}`);
  console.log(`  - Other: ${detections.other?.length || 0}`);
  
  // Test recommendations data extraction
  const recommendations = mockApiResponse.recommendations;
  console.log("✓ Recommendations Data:");
  console.log(`  - Total Recommendations: ${recommendations.length}`);
  recommendations.forEach((rec, index) => {
    console.log(`  - ${index + 1}. ${rec.title} (${(rec.match_score * 100).toFixed(0)}% match)`);
  });
  
  // Test color palette data extraction
  console.log("✓ Color Palette Data:");
  roomAnalysis.color_palette.forEach((color, index) => {
    console.log(`  - ${index + 1}. ${color.hex} (${color.percentage.toFixed(1)}%)`);
  });
  
  // Test wall colors extraction
  const wallColors = detections.walls?.map(wall => wall.color || '#f0f0f0') || [];
  console.log("✓ Wall Colors:");
  wallColors.forEach((color, index) => {
    console.log(`  - Wall ${index + 1}: ${color}`);
  });
  
  console.log("=" * 50);
  console.log("Frontend API Integration Test Complete!");
  
  return {
    success: true,
    roomAnalysis,
    recommendations,
    totalObjects,
    wallColors,
    colorPalette: roomAnalysis.color_palette
  };
}

// Example usage in a React component
export function ExampleUsage() {
  const testResult = testApiIntegration();
  
  return {
    // This would be used in the AnalysisResults component
    analysisData: mockApiResponse,
    extractedData: testResult
  };
}

export default mockApiResponse;
