# Art.Decor.AI Backend

## Setup Instructions

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Configuration**
   - Copy `env.example` to `.env`
   - Update the API keys with your actual values:
     - Supabase key from your project dashboard
     - Google Maps API key
     - Tavily API key for trend search
     - Groq API key for AI reasoning
     - AWS credentials for image storage

3. **Database Setup**
   - The Supabase database should have the following tables:
     - `user_profiles` (user_id, preferences, created_at, updated_at)
     - `user_sessions` (id, user_id, session_data, created_at)

4. **Model Setup**
   - YOLOv8 model will be downloaded automatically on first run
   - CLIP and other models will be downloaded as needed

5. **Run the Server**
   ```bash
   python main.py
   ```

## API Endpoints

- `POST /api/analyze-room` - Upload room image for analysis
- `POST /api/text-query` - Process text-based queries
- `POST /api/voice-query` - Process voice queries
- `GET /api/user-profile/{user_id}` - Get user profile
- `POST /api/user-profile` - Create user profile
- `GET /api/trends` - Get trending styles
- `GET /api/nearby-stores` - Find nearby stores
- `GET /api/directions` - Get directions to stores

## Architecture

The backend uses three AI agents:
1. **Vision-Match Agent** - Analyzes room images using YOLOv8 and CLIP
2. **Trend-Intel Agent** - Provides trend insights using Tavily and Groq
3. **Geo-Finder Agent** - Finds nearby stores using Google Maps API

All agents are orchestrated by the Decision Router which provides final recommendations.
