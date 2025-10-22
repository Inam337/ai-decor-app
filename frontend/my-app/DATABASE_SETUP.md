# 🗄️ Supabase Database Setup Guide

## 📋 **Step-by-Step Database Import**

### **1. Access Supabase Dashboard**
- Go to: `https://gfmzkpmyisgcmizcddtl.supabase.co`
- Login to your Supabase account
- Select your project: **ai-decor-db**

### **2. Import Database Schema**

#### **Option A: Using SQL Editor (Recommended)**
1. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

2. **Copy and Paste Schema**
   - Open `frontend/my-app/supabase-schema.sql`
   - Copy the entire content
   - Paste it into the SQL Editor

3. **Execute the Schema**
   - Click "Run" button
   - Wait for all tables to be created
   - Check for any errors in the output

#### **Option B: Using Database Schema Import**
1. **Go to Database Settings**
   - Click "Database" in the left sidebar
   - Click "Schema" tab

2. **Import Schema File**
   - Click "Import Schema"
   - Upload `supabase-schema.sql` file
   - Confirm import

### **3. Verify Database Setup**

#### **Check Tables Created:**
```sql
-- Run this query to verify all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected Tables:**
- ✅ `user_profiles`
- ✅ `user_sessions`
- ✅ `artwork_catalog`
- ✅ `store_info`
- ✅ `user_feedback`
- ✅ `trending_styles_cache`

#### **Check Sample Data:**
```sql
-- Verify sample data was inserted
SELECT COUNT(*) as user_profiles FROM user_profiles;
SELECT COUNT(*) as artwork_catalog FROM artwork_catalog;
SELECT COUNT(*) as store_info FROM store_info;
```

### **4. Configure Storage Buckets**

#### **Create Storage Buckets:**
1. **Go to Storage**
   - Click "Storage" in the left sidebar
   - Click "Create Bucket"

2. **Create Required Buckets:**
   - **Bucket Name**: `room-uploads`
     - **Public**: Yes
     - **File Size Limit**: 50MB
     - **Allowed MIME Types**: image/*

   - **Bucket Name**: `artwork-images`
     - **Public**: Yes
     - **File Size Limit**: 10MB
     - **Allowed MIME Types**: image/*

   - **Bucket Name**: `user-avatars`
     - **Public**: Yes
     - **File Size Limit**: 5MB
     - **Allowed MIME Types**: image/*

#### **Set Storage Policies:**
```sql
-- Allow authenticated users to upload room photos
CREATE POLICY "Authenticated users can upload room photos" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'room-uploads' 
    AND auth.role() = 'authenticated'
);

-- Allow public read access to artwork images
CREATE POLICY "Public can view artwork images" ON storage.objects
FOR SELECT USING (bucket_id = 'artwork-images');

-- Allow public read access to user avatars
CREATE POLICY "Public can view user avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'user-avatars');
```

### **5. Get Service Role Key**

#### **Get Your Service Role Key:**
1. **Go to Settings → API**
2. **Copy the "service_role" key** (not the anon key)
3. **Update Environment File:**
   ```bash
   # Update frontend/my-app/.env.local
   SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
   ```

### **6. Test Database Connection**

#### **Test from Frontend:**
1. **Start Development Server:**
   ```bash
   cd frontend/my-app
   npm run dev
   ```

2. **Test Database Functions:**
   - Visit `http://localhost:3000/explore`
   - Check if artwork data loads
   - Try uploading a file in Upload Manager

#### **Test Database Queries:**
```sql
-- Test user profile creation
INSERT INTO user_profiles (user_id, preferences) 
VALUES ('test_user_123', '{"aesthetic_style": "modern", "max_price": 500}');

-- Test artwork search
SELECT * FROM artwork_catalog WHERE style = 'modern' LIMIT 5;

-- Test store search
SELECT * FROM store_info WHERE rating >= 4.0 LIMIT 5;
```

## 🔧 **Database Schema Overview**

### **Core Tables:**

1. **`user_profiles`** - User preferences and settings
2. **`user_sessions`** - AI interaction sessions with analysis results
3. **`artwork_catalog`** - Curated artwork database with embeddings
4. **`store_info`** - Local store information from Google Places API
5. **`user_feedback`** - User interactions and feedback
6. **`trending_styles_cache`** - Cached trend analysis data

### **Key Features:**

- ✅ **Row Level Security (RLS)** - Users can only access their own data
- ✅ **JSONB Support** - Flexible storage for AI analysis results
- ✅ **Vector Embeddings** - Ready for FAISS integration
- ✅ **Performance Indexes** - Optimized queries
- ✅ **Sample Data** - Pre-populated with test data

## 🚀 **Next Steps**

### **1. Test All Features:**
- ✅ User profile creation
- ✅ Room photo upload and analysis
- ✅ Artwork recommendations
- ✅ Store location search
- ✅ User feedback system

### **2. Configure AI Integration:**
- Set up YOLOv8 for room analysis
- Configure CLIP for image embeddings
- Set up LLM for reasoning generation

### **3. Production Setup:**
- Configure production environment variables
- Set up database backups
- Monitor performance metrics

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **"Table doesn't exist" Error:**
   - Verify schema was imported correctly
   - Check table names match exactly

2. **"Permission denied" Error:**
   - Check RLS policies are set correctly
   - Verify user authentication

3. **"Storage bucket not found" Error:**
   - Create required storage buckets
   - Set proper bucket policies

4. **"Environment variables missing" Error:**
   - Check `.env.local` file exists
   - Verify all required keys are set

### **Debug Commands:**
```sql
-- Check table structure
\d user_profiles

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

-- Check storage buckets
SELECT * FROM storage.buckets;
```

## 📊 **Database Statistics**

After successful setup, you should see:
- **3 sample artworks** in artwork_catalog
- **2 sample stores** in store_info
- **1 sample user profile** in user_profiles
- **All tables** with proper indexes and triggers

Your Art.Decor.AI database is now ready for production! 🎉
