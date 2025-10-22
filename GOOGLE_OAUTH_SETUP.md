# Supabase Google OAuth Setup Guide

## Step 1: Enable Google Provider in Supabase

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `gfmzkpmyisgcmizcddtl`

2. **Navigate to Authentication Settings**
   - Go to `Authentication` → `Providers`
   - Find `Google` in the list
   - Toggle it to **Enabled**

3. **Configure Google OAuth**
   - You'll need to create a Google OAuth application first

## Step 2: Create Google OAuth Application

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Go to `APIs & Services` → `Library`
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to `APIs & Services` → `Credentials`
   - Click `Create Credentials` → `OAuth 2.0 Client IDs`
   - Application type: `Web application`
   - Name: `Art.Decor.AI`
   - Authorized redirect URIs:
     ```
     https://gfmzkpmyisgcmizcddtl.supabase.co/auth/v1/callback
     ```

4. **Copy Credentials**
   - Copy the `Client ID` and `Client Secret`

## Step 3: Configure Supabase

1. **Back in Supabase Dashboard**
   - Go to `Authentication` → `Providers` → `Google`
   - Paste your `Client ID` and `Client Secret`
   - Save the configuration

2. **Set Site URL**
   - Go to `Authentication` → `URL Configuration`
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/dashboard`

## Step 4: Test the Configuration

1. **Start your applications**
   ```bash
   # Backend
   cd backend
   python main.py

   # Frontend
   cd frontend/my-app
   npm run dev
   ```

2. **Test Google OAuth**
   - Go to `http://localhost:3000/auth`
   - Click on Google tab
   - Click "Continue with Google"
   - Should redirect to Google login

## Alternative: Email/Password Authentication

If you want to test without Google OAuth, you can use email/password authentication:

1. **Go to Supabase Dashboard**
   - `Authentication` → `Providers`
   - Make sure `Email` is enabled

2. **Test Email Sign Up**
   - Go to `http://localhost:3000/auth`
   - Use Email tab
   - Sign up with any email (it will send verification email)

## Troubleshooting

### Common Issues:

1. **"Provider not enabled"**
   - Make sure Google provider is toggled ON in Supabase

2. **"Invalid redirect URI"**
   - Check that redirect URI in Google Console matches Supabase callback URL

3. **"Client ID not found"**
   - Verify Client ID and Secret are correctly entered in Supabase

4. **"Domain not verified"**
   - For production, you'll need to verify your domain in Google Console

### Development vs Production URLs:

**Development:**
- Site URL: `http://localhost:3000`
- Redirect: `http://localhost:3000/dashboard`
- Google Callback: `https://gfmzkpmyisgcmizcddtl.supabase.co/auth/v1/callback`

**Production:**
- Site URL: `https://yourdomain.com`
- Redirect: `https://yourdomain.com/dashboard`
- Google Callback: `https://gfmzkpmyisgcmizcddtl.supabase.co/auth/v1/callback`

## Quick Fix for Testing

If you want to test immediately without Google OAuth setup:

1. **Use Email Authentication**
   - Go to `http://localhost:3000/auth`
   - Switch to Email tab
   - Sign up with any email address
   - Check your email for verification link

2. **Or modify the auth page to skip Google temporarily**
   - Comment out the Google OAuth button
   - Focus on email/password authentication first
