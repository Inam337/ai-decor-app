# Art.Decor.AI - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- Git

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp env.example .env

# Edit .env file with your API keys:
# - SUPABASE_KEY (from Supabase dashboard)
# - GOOGLE_MAPS_API_KEY
# - TAVILY_API_KEY
# - GROQ_API_KEY
# - AWS credentials (optional)

# Run the server
python main.py
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file
cp env.local.example .env.local

# Edit .env.local with your backend URL:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Run the development server
npm run dev
```

### 3. Database Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/gfmzkpmyisgcmizcddtl)
2. Navigate to SQL Editor
3. Run the SQL script from `backend/database_schema.sql`
4. Update your `.env` file with the Supabase key

## 🏗️ Architecture Overview

### Backend (FastAPI)
- **Vision-Match Agent**: YOLOv8 + CLIP for room analysis
- **Trend-Intel Agent**: Tavily + Groq for trend insights
- **Geo-Finder Agent**: Google Maps for store locations
- **Decision Router**: Orchestrates all agents
- **Artwork Retrieval**: FAISS vector search

### Frontend (Next.js)
- **Image Upload**: Drag & drop with preview
- **Text Query**: Natural language input
- **Voice Query**: Speech recognition
- **Recommendations**: AI-curated results display

### Database (Supabase)
- **User Profiles**: Preferences and settings
- **Sessions**: Analysis history
- **Artwork Catalog**: Vector embeddings
- **Store Info**: Location data

## 🔧 Configuration

### Required API Keys

1. **Supabase**: Get from project dashboard
2. **Google Maps**: Enable Places API and Directions API
3. **Tavily**: For trend search (optional)
4. **Groq**: For AI reasoning (optional)
5. **OpenAI**: Already configured

### Environment Variables

**Backend (.env):**
```
OPENAI_API_KEY=028fa2e1-fb69-4cca-89aa-1e11ffc4dcc1
OPENAI_BASE_URL=https://openai.dplit.com/v1
SUPABASE_KEY=your_supabase_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🎯 Features

### ✅ Implemented
- [x] Room image analysis with YOLOv8
- [x] Color palette extraction
- [x] Style matching with CLIP
- [x] Personalized recommendations
- [x] Trend insights
- [x] Nearby store finder
- [x] Multimodal input (image, text, voice)
- [x] Responsive UI with Tailwind CSS
- [x] Real-time analysis feedback

### 🔄 In Progress
- [ ] Advanced AI model integration
- [ ] Real-time collaboration
- [ ] Mobile app
- [ ] AR visualization

## 📱 Usage

### Image Analysis
1. Upload a clear room photo
2. AI analyzes walls, lighting, and style
3. Get personalized artwork recommendations
4. View detailed reasoning for each suggestion

### Text Queries
1. Describe your style preferences
2. Mention colors, room type, budget
3. Get curated recommendations
4. Explore trending styles

### Voice Queries
1. Click microphone to record
2. Speak naturally about your needs
3. View transcribed query
4. Get voice-based recommendations

## 🛠️ Development

### Backend Development
```bash
cd backend
python main.py  # Development server
```

### Frontend Development
```bash
cd frontend
npm run dev     # Development server
npm run build   # Production build
```

### Testing
```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend (Render/AWS)
1. Connect GitHub repository
2. Set environment variables
3. Deploy FastAPI application

### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `out`
4. Deploy Next.js application

### Database (Supabase)
- Already hosted on Supabase
- Configure production environment variables
- Set up proper RLS policies

## 📊 Performance

### Optimization Tips
- Use image compression for uploads
- Implement caching for API responses
- Optimize AI model loading
- Use CDN for static assets

### Monitoring
- Set up error tracking (Sentry)
- Monitor API response times
- Track user engagement metrics
- Monitor AI model performance

## 🔒 Security

### Best Practices
- Validate all user inputs
- Use HTTPS in production
- Implement rate limiting
- Secure API keys
- Use Row Level Security (RLS)

### Authentication
- Implement user authentication
- Use JWT tokens
- Set up proper session management

## 📈 Scaling

### Horizontal Scaling
- Use load balancers
- Implement microservices
- Use container orchestration
- Set up auto-scaling

### Database Scaling
- Use read replicas
- Implement connection pooling
- Optimize queries
- Use caching layers

## 🆘 Troubleshooting

### Common Issues

1. **Model Loading Errors**
   - Check internet connection
   - Verify model files exist
   - Check GPU memory

2. **API Connection Issues**
   - Verify environment variables
   - Check CORS settings
   - Test API endpoints

3. **Database Connection**
   - Verify Supabase credentials
   - Check network connectivity
   - Verify RLS policies

### Support
- Check logs in console
- Verify API responses
- Test with sample data
- Contact support team

## 📚 Documentation

- [API Documentation](http://localhost:8000/docs)
- [Component Library](./frontend/components/)
- [Database Schema](./backend/database_schema.sql)
- [Configuration Guide](./backend/config.py)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
