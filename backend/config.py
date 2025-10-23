import os
from dotenv import load_dotenv

load_dotenv()

# OpenAI Configuration (Mock)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "mock-key")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")

# Supabase Configuration
SUPABASE_URL = "https://gfmzkpmyisgcmizcddtl.supabase.co"
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "mock-key")
SUPABASE_DB_PASSWORD = "Admin@123"

# Google Maps API (Mock)
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "mock-key")

# Tavily API (Mock)
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "mock-key")

# Groq API (Mock)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "mock-key")

# AWS S3 Configuration (Mock)
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "mock-key")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "mock-key")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME", "ai-decor-images")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

# Model Configuration (Mock paths)
YOLO_MODEL_PATH = "models/yolov8n.pt"
DINO_MODEL_NAME = "facebook/dinov2-base"
CLIP_MODEL_NAME = "openai/clip-vit-base-patch32"
LLAVA_MODEL_NAME = "llava-hf/llava-1.5-7b-hf"

# FAISS Configuration (Mock paths)
FAISS_INDEX_PATH = "data/faiss_index"
ARTWORK_CATALOG_PATH = "data/artwork_catalog.json"

# Server Configuration
HOST = "0.0.0.0"
PORT = 8000
DEBUG = os.getenv("DEBUG", "False").lower() == "true"



GOOGLE_API_KEY = "AIzaSyAGGCEW5K3-rj9WjqTt2xRwXwYhOxC2L2s"
GOOGLE_CX = "66d605b6550ff49fd"
# <script async src="https://cse.google.com/cse.js?cx=66d605b6550ff49fd">
# </script>
# <div class="gcse-search"></div>
DOWNLOAD_DIR = "./assets"
CHROMA_PERSIST_DIRECTORY = "./chroma_db"
CHROMA_COLLECTION_NAME = "products"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"  # sentence-transformers
