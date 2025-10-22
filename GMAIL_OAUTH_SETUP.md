# Complete Gmail/Google OAuth Setup Guide for Supabase

## 🚀 Quick Setup Checklist

### ✅ Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create Project**
   - Click "Select a project" → "New Project"
   - Name: `Art.Decor.AI`
   - Click "Create"

3. **Enable Google+ API**
   - Go to `APIs & Services` → `Library`
   - Search for "Google+ API" 
   - Click on it and press "Enable"

4. **Configure OAuth Consent Screen**
   - Go to `APIs & Services` → `OAuth consent screen`
   - Choose "External" → "Create"
   - Fill required fields:
     ```
     App name: Art.Decor.AI
     User support email: your-email@gmail.com
     Developer contact: your-email@gmail.com
     ```
   - Add scopes: `../auth/userinfo.email`, `../auth/userinfo.profile`, `openid`
   - Add test users (your email for development)

5. **Create OAuth Credentials**
   - Go to `APIs & Services` → `Credentials`
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: `Web application`
   - Name: `Art.Decor.AI Web Client`
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `https://gfmzkpmyisgcmizcddtl.supabase.co/auth/v1/callback`
   - **Save Client ID and Client Secret**

### ✅ Step 2: Supabase Configuration

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/gfmzkpmyisgcmizcddtl
   - Navigate to `Authentication` → `Providers`

2. **Enable Google Provider**
   - Find "Google" in the list
   - Toggle it to **ON**
   - Paste your `Client ID` from Google Console
   - Paste your `Client Secret` from Google Console
   - Click "Save"

3. **Configure URLs**
   - Go to `Authentication` → `URL Configuration`
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/dashboard`

### ✅ Step 3: Test Google OAuth

1. **Start your applications**
   ```bash
   # Backend
   cd backend
   python main.py

   # Frontend
   cd frontend/my-app
   npm run dev
   ```

2. **Test Google Sign-in**
   - Go to `http://localhost:3000/auth`
   - Click "Google" tab
   - Click "Continue with Google"
   - Should redirect to Google login
   - After login, should redirect to `/dashboard`

## 🔧 Troubleshooting

### Common Issues:

1. **"Provider not enabled"**
   - Make sure Google provider is toggled ON in Supabase

2. **"Invalid redirect URI"**
   - Check redirect URI in Google Console matches Supabase callback URL exactly

3. **"Client ID not found"**
   - Verify Client ID and Secret are correctly entered in Supabase

4. **"Access blocked"**
   - Add your email to test users in Google Console
   - Make sure OAuth consent screen is configured

5. **"Domain not verified"**
   - For production, verify your domain in Google Console

### Development vs Production URLs:

**Development:**
- Site URL: `http://localhost:3000`
- Redirect: `http://localhost:3000/dashboard`
- Google Callback: `https://gfmzkpmyisgcmizcddtl.supabase.co/auth/v1/callback`

**Production:**
- Site URL: `https://yourdomain.com`
- Redirect: `https://yourdomain.com/dashboard`
- Google Callback: `https://gfmzkpmyisgcmizcddtl.supabase.co/auth/v1/callback`

## 🎯 What's Already Working

✅ **Frontend Code** - Google OAuth button is enabled
✅ **AuthContext** - Google sign-in function implemented
✅ **Error Handling** - Proper error messages for OAuth issues
✅ **Redirects** - Automatic redirect to dashboard after login
✅ **User Profile** - Automatic profile creation for new Google users

## 🚀 Next Steps After Setup

1. **Test the complete flow:**
   - Sign up with Google
   - Sign in with Google
   - Upload room photos
   - Check user profile creation

2. **For production:**
   - Update URLs in Google Console
   - Update URLs in Supabase
   - Verify domain in Google Console

3. **Optional enhancements:**
   - Add GitHub OAuth (similar process)
   - Customize OAuth consent screen
   - Add profile picture from Google

## 📞 Support

If you encounter issues:
1. Check Google Console for error details
2. Check Supabase logs in Authentication section
3. Verify all URLs match exactly
4. Ensure test users are added for development

The Google OAuth integration is now ready to use! 🎉
