-- Art.Decor.AI Database Schema for Supabase
-- Database: ai-decor-db

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    session_data JSONB NOT NULL,
    room_analysis JSONB,
    recommendations JSONB,
    trend_insights JSONB,
    location_suggestions JSONB,
    final_reasoning TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artwork Catalog Table
CREATE TABLE IF NOT EXISTS artwork_catalog (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artwork_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    style VARCHAR(100),
    colors JSONB DEFAULT '[]',
    price DECIMAL(10,2),
    size VARCHAR(50),
    medium VARCHAR(100),
    description TEXT,
    image_url TEXT,
    tags JSONB DEFAULT '[]',
    embedding VECTOR(512), -- For FAISS integration
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store Information Table
CREATE TABLE IF NOT EXISTS store_info (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    place_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    website TEXT,
    rating DECIMAL(3,2),
    price_level INTEGER,
    types JSONB DEFAULT '[]',
    geometry JSONB,
    business_status VARCHAR(50),
    user_ratings_total INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Feedback Table
CREATE TABLE IF NOT EXISTS user_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    session_id UUID REFERENCES user_sessions(id),
    artwork_id VARCHAR(255),
    feedback_type VARCHAR(50) NOT NULL, -- 'like', 'dislike', 'purchase', 'view'
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trending Styles Cache Table
CREATE TABLE IF NOT EXISTS trending_styles_cache (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    query VARCHAR(500) NOT NULL,
    trends_data JSONB NOT NULL,
    location VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_artwork_catalog_style ON artwork_catalog(style);
CREATE INDEX IF NOT EXISTS idx_artwork_catalog_price ON artwork_catalog(price);
CREATE INDEX IF NOT EXISTS idx_store_info_rating ON store_info(rating DESC);
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_trending_styles_query ON trending_styles_cache(query);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artwork_catalog_updated_at 
    BEFORE UPDATE ON artwork_catalog 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_store_info_updated_at 
    BEFORE UPDATE ON store_info 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO user_profiles (user_id, preferences) VALUES 
('user_123', '{"aesthetic_style": "modern", "preferred_colors": ["neutral", "blue"], "max_price": 500, "room_type": "living_room"}')
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample artwork
INSERT INTO artwork_catalog (artwork_id, title, artist, style, colors, price, size, medium, description, image_url, tags) VALUES 
('art_001', 'Modern Abstract Composition', 'Sarah Johnson', 'modern', '["#2C3E50", "#E74C3C", "#F39C12"]', 299.99, '24x36', 'acrylic on canvas', 'Bold geometric shapes in contemporary colors', 'https://example.com/art_001.jpg', '["abstract", "modern", "geometric", "bold"]'),
('art_002', 'Scandinavian Landscape', 'Erik Nordstrom', 'scandinavian', '["#F8F9FA", "#6C757D", "#28A745"]', 199.99, '18x24', 'watercolor', 'Minimalist Nordic landscape with clean lines', 'https://example.com/art_002.jpg', '["landscape", "minimalist", "scandinavian", "nature"]'),
('art_003', 'Industrial Cityscape', 'Marcus Steel', 'industrial', '["#343A40", "#6C757D", "#DC3545"]', 399.99, '30x40', 'oil on canvas', 'Urban industrial architecture in monochrome', 'https://example.com/art_003.jpg', '["industrial", "urban", "architecture", "monochrome"]')
ON CONFLICT (artwork_id) DO NOTHING;

-- Insert sample store
INSERT INTO store_info (place_id, name, address, phone, rating, price_level, types, business_status, user_ratings_total) VALUES 
('sample_place_1', 'Local Art Gallery', '123 Main Street, Your City', '(555) 123-4567', 4.2, 2, '["art_gallery", "store"]', 'OPERATIONAL', 150),
('sample_place_2', 'Home Decor Store', '456 Oak Avenue, Your City', '(555) 234-5678', 4.0, 2, '["home_goods_store", "furniture_store"]', 'OPERATIONAL', 89)
ON CONFLICT (place_id) DO NOTHING;

-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your authentication system)
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can view their own sessions" ON user_sessions
    FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert their own sessions" ON user_sessions
    FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can view their own feedback" ON user_feedback
    FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert their own feedback" ON user_feedback
    FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

-- Public access for artwork catalog and store info
CREATE POLICY "Public can view artwork catalog" ON artwork_catalog
    FOR SELECT USING (true);

CREATE POLICY "Public can view store info" ON store_info
    FOR SELECT USING (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
