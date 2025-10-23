# search_api.py
from fastapi import FastAPI, Query
from pydantic import BaseModel
from search import vector_search, search_engine_search, hybrid_search
import time

app = FastAPI(title="Designer Query API")

class SearchResponseItem(BaseModel):
    id: str
    score: float
    title: str | None
    image_url: str | None
    page_link: str | None
    source_domain: str | None
    snippet: str | None
    search_type: str

@app.get("/search", response_model=list[SearchResponseItem])
def search(q: str = Query(..., min_length=1), top_k: int = 10, num_results: int = 20):
    """
    Hybrid search: searches both vector database and Google search engine.
    First searches in vector DB, then in Google search results.
    """
    results = hybrid_search(q, top_k, num_results)
    return [SearchResponseItem(**result) for result in results]

@app.get("/vector_only_search", response_model=list[SearchResponseItem])
def vector_only_search(q: str = Query(..., min_length=1), top_k: int = 10):
    """
    Search in vector database only using ChromaDB
    """
    results = vector_search(q, top_k)
    return [SearchResponseItem(**result) for result in results]

@app.get("/search_engine_search", response_model=list[SearchResponseItem])
def search_engine_only_search(q: str = Query(..., min_length=1), num_results: int = 20):
    """
    Search using Google Custom Search API only
    """
    results = search_engine_search(q, num_results)
    return [SearchResponseItem(**result) for result in results]

@app.get("/health")
def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy", "timestamp": time.time()}
