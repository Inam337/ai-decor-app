# Supabase Integration Setup Guide

This guide will help you set up Supabase database integration for your Art.Decor.AI application.

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose your organization and region
3. Set a strong database password
4. Wait for the project to be created

### 2. Get Your Credentials

In your Supabase dashboard:
1. Go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Copy your **service_role** key (keep this secret!)

### 3. Environment Variables

Create a `.env.local` file in your `frontend/my-app` directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# AI Configuration
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# Storage Configuration
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=your-s3-bucket
```

### 4. Database Schema Setup

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase-schema.sql`
3. Run the SQL script to create all tables, indexes, and policies

### 5. Storage Buckets

Create storage buckets for file uploads:

1. Go to **Storage** in your Supabase dashboard
2. Create buckets:
   - `room-uploads` (for room photos)
   - `artwork-images` (for artwork catalog)
   - `user-avatars` (for user profile pictures)

3. Set bucket policies:
   ```sql
   -- Allow authenticated users to upload to room-uploads
   CREATE POLICY "Authenticated users can upload room photos" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'room-uploads' AND auth.role() = 'authenticated');
   
   -- Allow public read access to artwork images
   CREATE POLICY "Public can view artwork images" ON storage.objects
   FOR SELECT USING (bucket_id = 'artwork-images');
   ```

## 🗄️ Database Schema Overview

### Core Tables

1. **users** - User accounts and profiles
2. **room_uploads** - Room photos and AI analysis results
3. **artwork_catalog** - Curated artwork database
4. **sessions** - AI interaction sessions
5. **chat_history** - Conversation messages
6. **user_preferences** - User customization settings
7. **recommendations** - AI-generated artwork suggestions
8. **user_interactions** - User behavior tracking

### Key Features

- **Row Level Security (RLS)** - Users can only access their own data
- **JSONB Support** - Flexible storage for AI analysis results
- **Array Support** - Style tags and preferences as arrays
- **Foreign Key Constraints** - Data integrity and relationships
- **Performance Indexes** - Optimized queries for common operations

## 🔧 Backend Integration

### FastAPI + Supabase

```python
# backend/main.py
from supabase import create_client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def store_room_analysis(user_id, s3_url, palette, lighting, style):
    data = {
        "user_id": user_id,
        "s3_url": s3_url,
        "palette_json": palette,
        "lighting_json": lighting,
        "style_detected": style
    }
    result = supabase.table("room_uploads").insert(data).execute()
    return result.data

def get_user_recommendations(user_id):
    result = supabase.table("recommendations").select(
        "*, artwork_catalog(*), sessions(*)"
    ).eq("sessions.user_id", user_id).execute()
    return result.data
```

## 🤖 AI Integration Workflow

### 1. Photo Upload Flow
```
User uploads photo → Supabase Storage → YOLOv8 Analysis → 
Store results in room_uploads → Generate recommendations → 
Store in recommendations table
```

### 2. Chat Flow
```
User sends message → Create session → Store in sessions table → 
LLM processes → Store response in chat_history → 
Update session with AI result
```

### 3. Voice Query Flow
```
Voice input → Speech-to-text → Create session → 
LLM processes → Store in chat_history → 
Generate recommendations
```

## 📊 Database Functions

### Built-in Functions

1. **get_user_stats(user_uuid)** - Get user activity statistics
2. **search_artworks(style_tags, min_price, max_price)** - Search artwork catalog
3. **update_updated_at_column()** - Auto-update timestamps

### Example Usage

```sql
-- Get user statistics
SELECT get_user_stats('user-uuid-here');

-- Search artworks
SELECT * FROM search_artworks(
    ARRAY['modern', 'abstract'], 
    50.00, 
    200.00, 
    10
);
```

## 🔐 Security Features

### Row Level Security (RLS)

- Users can only access their own data
- Public read access for artwork catalog
- Admin users have elevated permissions

### Authentication

- Supabase Auth handles user authentication
- JWT tokens for API access
- Service role for backend operations

### Data Protection

- Encrypted connections (TLS)
- Secure API keys
- Input validation and sanitization

## 📈 Performance Optimization

### Indexes

- Email lookups on users table
- User ID indexes on related tables
- GIN indexes for array searches
- Timestamp indexes for sorting

### Query Optimization

- Use prepared statements
- Limit result sets
- Use appropriate JOIN strategies
- Cache frequently accessed data

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
   - Use production Supabase project
   - Secure API keys
   - Configure CORS settings

2. **Database**
   - Run migration scripts
   - Set up backups
   - Monitor performance

3. **Storage**
   - Configure CDN for images
   - Set up file compression
   - Implement cleanup policies

### Monitoring

- Use Supabase dashboard for metrics
- Set up alerts for errors
- Monitor database performance
- Track user activity

## 🔧 Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Check user authentication
   - Verify policy conditions
   - Test with service role key

2. **Storage Upload Failures**
   - Check bucket policies
   - Verify file size limits
   - Ensure proper authentication

3. **Query Performance**
   - Add missing indexes
   - Optimize query structure
   - Use EXPLAIN ANALYZE

### Debug Tools

- Supabase dashboard logs
- Browser developer tools
- Database query logs
- API response monitoring

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Documentation](https://supabase.com/docs/guides/storage)

## 🎯 Next Steps

1. Set up your Supabase project
2. Configure environment variables
3. Run the database schema
4. Test the integration
5. Deploy to production

Your Art.Decor.AI application is now ready with full Supabase integration!
