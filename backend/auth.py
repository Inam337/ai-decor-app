from fastapi import HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
import os
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# Initialize Supabase client for authentication
supabase_url = "https://gfmzkpmyisgcmizcddtl.supabase.co"
supabase_key = os.getenv("SUPABASE_KEY", "mock-key")

if supabase_key != "mock-key":
    supabase_auth: Client = create_client(supabase_url, supabase_key)
else:
    supabase_auth = None

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Verify JWT token from Supabase
    """
    if not supabase_auth:
        # In development mode without proper Supabase key
        logger.warning("Supabase auth not configured, skipping token verification")
        return {"user_id": "dev-user-123", "email": "dev@example.com"}
    
    try:
        # Verify the JWT token with Supabase
        response = supabase_auth.auth.get_user(credentials.credentials)
        
        if response.user:
            return {
                "user_id": response.user.id,
                "email": response.user.email,
                "user_metadata": response.user.user_metadata
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid token")
            
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(token_data: dict = Depends(verify_token)) -> dict:
    """
    Get current authenticated user
    """
    return token_data

def require_auth():
    """
    Dependency that requires authentication
    """
    return Depends(get_current_user)

def optional_auth():
    """
    Dependency that optionally requires authentication
    """
    async def get_optional_user(request: Request) -> Optional[dict]:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None
        
        try:
            token = auth_header.split(" ")[1]
            credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
            return await verify_token(credentials)
        except:
            return None
    
    return Depends(get_optional_user)
