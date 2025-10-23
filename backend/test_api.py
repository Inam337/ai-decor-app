#!/usr/bin/env python3
"""
Test script for the Designer Query API
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health check: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_vector_search():
    """Test vector-only search"""
    try:
        response = requests.get(f"{BASE_URL}/vector_only_search", params={"q": "brown chair", "top_k": 5})
        print(f"Vector search: {response.status_code}")
        if response.status_code == 200:
            results = response.json()
            print(f"Found {len(results)} results")
            for i, result in enumerate(results[:2]):  # Show first 2 results
                print(f"  {i+1}. {result.get('title', 'No title')} (score: {result.get('score', 0):.3f})")
        return response.status_code == 200
    except Exception as e:
        print(f"Vector search failed: {e}")
        return False

def test_search_engine_search():
    """Test search engine only search"""
    try:
        response = requests.get(f"{BASE_URL}/search_engine_search", params={"q": "modern sofa", "num_results": 10})
        print(f"Search engine search: {response.status_code}")
        if response.status_code == 200:
            results = response.json()
            print(f"Found {len(results)} results")
            for i, result in enumerate(results[:2]):  # Show first 2 results
                print(f"  {i+1}. {result.get('title', 'No title')} (type: {result.get('search_type', 'unknown')})")
        return response.status_code == 200
    except Exception as e:
        print(f"Search engine search failed: {e}")
        return False

def test_hybrid_search():
    """Test hybrid search"""
    try:
        response = requests.get(f"{BASE_URL}/search", params={"q": "wooden table", "top_k": 5, "num_results": 10})
        print(f"Hybrid search: {response.status_code}")
        if response.status_code == 200:
            results = response.json()
            print(f"Found {len(results)} results")
            vector_count = sum(1 for r in results if r.get('search_type') == 'vector')
            google_count = sum(1 for r in results if r.get('search_type') == 'google')
            print(f"  Vector results: {vector_count}, Google results: {google_count}")
        return response.status_code == 200
    except Exception as e:
        print(f"Hybrid search failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing Designer Query API...")
    print("=" * 50)
    
    # Test all endpoints
    tests = [
        ("Health Check", test_health),
        ("Vector Search", test_vector_search),
        ("Search Engine Search", test_search_engine_search),
        ("Hybrid Search", test_hybrid_search),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n{test_name}:")
        if test_func():
            print(f"✅ {test_name} PASSED")
            passed += 1
        else:
            print(f"❌ {test_name} FAILED")
    
    print(f"\n{'=' * 50}")
    print(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
    else:
        print("⚠️  Some tests failed. Check the API server is running.")
