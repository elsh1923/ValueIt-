"""
Direct test of the project update endpoint with logging
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/v1"

print("=" * 60)
print("TESTING PROJECT UPDATE ENDPOINT")
print("=" * 60)

# Step 1: Get all projects to find one
print("\n1. Fetching projects...")
try:
    # Try without auth first to see if endpoint responds
    response = requests.get(f"{BASE_URL}/projects/")
    print(f"Status: {response.status_code}")
    if response.status_code == 401:
        print("✓ Endpoint is responding (requires authentication)")
    elif response.status_code == 200:
        projects = response.json()
        print(f"✓ Got {len(projects)} projects")
    else:
        print(f"Response: {response.text}")
except requests.exceptions.ConnectionError:
    print(f"❌ Error: Could not connect to the server at {BASE_URL}.")
    print("   Make sure the backend is running (npm run dev or python -m uvicorn...)")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 60)
print("INSTRUCTIONS:")
print("=" * 60)
print("""
To test notifications properly, you need to:

1. Login as Manager through the frontend
2. Go to Projects and assign a user
3. Watch the backend terminal for logs

The backend terminal should show:
=== UPDATE PROJECT X ===
✓ Creating notification for Valuer ID: Y
✓ Database commit successful
=== UPDATE COMPLETE ===

If you don't see these logs, the frontend might not be calling
the correct endpoint or there's an issue with the request.
""")
