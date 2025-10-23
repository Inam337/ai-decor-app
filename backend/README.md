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


# Designer Query API

A FastAPI-based search service that combines vector search with Google Custom Search API for finding design-related products and images.

## Features

- **Hybrid Search**: Combines vector database search with Google Custom Search
- **Vector-Only Search**: Search only in the ChromaDB vector database
- **Search Engine Only**: Search only using Google Custom Search API
- **Automatic Caching**: Google search results are automatically cached into the vector database
- **Global Search**: Searches across all domains without restrictions

## Architecture

The API uses ChromaDB for vector storage and Google Custom Search API for web search. The hybrid search approach:

1. First searches the vector database for similar cached results
2. Then searches Google Custom Search API for fresh results
3. Combines and deduplicates results
4. Automatically caches new Google results into the vector database

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure your Google Custom Search API:
   - Get a Google API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Create a Custom Search Engine at [Google Custom Search](https://cse.google.com/)
   - Update `config.py` with your API key and Custom Search Engine ID

3. Run the API server:
```bash
uvicorn api:app --reload
```

## API Endpoints

### 1. Hybrid Search
**GET** `/search`

Searches both vector database and Google search engine.

**Parameters:**
- `q` (string, required): Search query
- `top_k` (int, optional, default=10): Number of results to return
- `num_results` (int, optional, default=20): Number of Google search results to fetch

**Example:**
```bash
curl "http://localhost:8000/search?q=brown%20chair&top_k=10&num_results=20"
```

### 2. Vector-Only Search
**GET** `/vector_only_search`

Searches only in the ChromaDB vector database.

**Parameters:**
- `q` (string, required): Search query
- `top_k` (int, optional, default=10): Number of results to return

**Example:**
```bash
curl "http://localhost:8000/vector_only_search?q=modern%20sofa&top_k=5"
```

### 3. Search Engine Only
**GET** `/search_engine_search`

Searches only using Google Custom Search API.

**Parameters:**
- `q` (string, required): Search query
- `num_results` (int, optional, default=20): Number of Google search results to fetch

**Example:**
```bash
curl "http://localhost:8000/search_engine_search?q=wooden%20table&num_results=20"
```

### 4. Health Check
**GET** `/health`

Returns the health status of the API.

**Example:**
```bash
curl "http://localhost:8000/health"
```

## Response Format

All search endpoints return an array of search results with the following structure:

```json
[
  {
    "id": "unique_identifier",
    "score": 0.95,
    "title": "Product Title",
    "image_url": "https://example.com/image.jpg",
    "page_link": "https://example.com/product",
    "source_domain": "example.com",
    "snippet": "Product description",
    "search_type": "vector" // or "google"
  }
]
```

## Configuration

Edit `config.py` to configure:

- `GOOGLE_API_KEY`: Your Google Custom Search API key
- `GOOGLE_CX`: Your Google Custom Search Engine ID
- `CHROMA_PERSIST_DIRECTORY`: Directory for ChromaDB storage
- `EMBEDDING_MODEL`: Sentence transformer model for embeddings

## Data Ingestion

To populate the vector database with initial data, run:

```bash
python search.py
```

This will search for "Brown Chair with Rustic Look" across all domains and cache the results.

## Docker Deployment

### Using Docker Compose (Recommended)

1. **Create environment file:**
```bash
# Create .env file with your Google API credentials
echo "GOOGLE_API_KEY=your_google_api_key_here" > .env
echo "GOOGLE_CX=your_google_custom_search_engine_id_here" >> .env
```

2. **Build and run:**
```bash
docker-compose up --build
```

3. **Access the API:**
```bash
curl "http://localhost:8000/health"
```

### Using Docker directly

1. **Build the image:**
```bash
docker build -t designer-query-api .
```

2. **Run the container:**
```bash
docker run -d \
  --name designer-query-api \
  -p 8000:8000 \
  -e GOOGLE_API_KEY=your_api_key \
  -e GOOGLE_CX=your_cx_id \
  -v $(pwd)/chroma_db:/app/chroma_db \
  -v $(pwd)/assets:/app/assets \
  designer-query-api
```

### Docker Features

- **Multi-stage build**: Optimized production image
- **Security**: Runs as non-root user
- **Health checks**: Automatic container health monitoring
- **Data persistence**: ChromaDB and assets are persisted via volumes
- **Environment variables**: Easy configuration management

## Testing

Run the test suite:

```bash
python test_api.py
```

Make sure the API server is running on `http://localhost:8000` before running tests.

### Docker Testing

```bash
# Test with Docker container
docker exec designer-query-api python test_api.py
```

## Dependencies

- **FastAPI**: Web framework
- **ChromaDB**: Vector database
- **Sentence Transformers**: Text embeddings
- **Google Custom Search API**: Web search
- **Requests**: HTTP client

## File Structure

```
├── api.py              # FastAPI application with endpoints
├── search.py           # Search functions and data ingestion
├── config.py           # Configuration settings
├── requirements.txt    # Python dependencies
├── test_api.py         # Test suite
├── README.md           # This file
├── assets/             # Downloaded images (created automatically)
└── chroma_db/          # ChromaDB storage (created automatically)
```
