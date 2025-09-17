# backend/test_deployment.py
import requests
import sys

def test_api_endpoints():
    base_url = "https://your-backend.onrender.com/api/v1"
    endpoints = [
        "/projects/",
        "/projects/featured/",
        "/tech-stack/",
        "/highlights/",
        "/metadata/",
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}")
            if response.status_code == 200:
                print(f"✅ {endpoint} - OK")
            else:
                print(f"❌ {endpoint} - Error {response.status_code}")
        except Exception as e:
            print(f"❌ {endpoint} - Exception: {e}")

if __name__ == "__main__":
    test_api_endpoints()