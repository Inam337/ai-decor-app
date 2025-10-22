# Authentication Setup Guide

## Frontend Setup

1. Create a `.env.local` file in `frontend/my-app/` with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://gfmzkpmyisgcmizcddtl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

2. Replace `your_supabase_anon_key_here` with your actual Supabase anon key from your Supabase project dashboard.

## Backend Setup

1. Update your `backend/.env` file with:

```env
# Supabase Configuration
SUPABASE_URL=https://gfmzkpmyisgcmizcddtl.supabase.co
SUPABASE_KEY=your_supabase_service_role_key_here
SUPABASE_DB_PASSWORD=Admin@123

# Other existing environment variables...
```

2. Replace `your_supabase_service_role_key_here` with your actual Supabase service role key.

## Supabase Configuration

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Enable Google OAuth provider
4. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
5. Set the redirect URL to: `http://localhost:3000/auth/callback`

## Database Setup

Run the SQL schema in `frontend/my-app/supabase-schema.sql` in your Supabase SQL editor to set up the required tables and RLS policies.

## Testing Authentication

1. Start the backend: `cd backend && python main.py`
2. Start the frontend: `cd frontend/my-app && npm run dev`
3. Navigate to `http://localhost:3000/auth` to test sign up/sign in
4. Try uploading a room photo at `http://localhost:3000/upload-manager`

## Features Implemented

- ✅ Google OAuth authentication with Supabase
- ✅ Email/password authentication
- ✅ Protected routes with authentication middleware
- ✅ User profile creation and management
- ✅ Backend API authentication with JWT tokens
- ✅ Frontend authentication context and hooks
- ✅ Sign out functionality
- ✅ Password reset functionality
- ✅ Authentication state persistence
