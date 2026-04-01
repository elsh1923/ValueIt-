# Quick Test: Update Project Assignment
# This script tests the project assignment endpoint directly

import requests
import json

# Configuration
BASE_URL = "http://127.0.0.1:8000/api/v1"

# You need to replace these with actual values from your database
# Configuration - update these to match your actual database contents
# You can check users using 'python check_user_role.py'
MANAGER_EMAIL = "manager@example.com"
MANAGER_PASSWORD = "password123"
PROJECT_ID = 1  
VALUER_ID = 2   

print("=" * 50)
print("Testing Project Assignment & Notification")
print("=" * 50)

# Step 1: Login as manager
print("\n1. Logging in as manager...")
login_response = requests.post(
    f"{BASE_URL}/auth/login",
    data={
        "username": MANAGER_EMAIL,
        "password": MANAGER_PASSWORD
    }
)

if login_response.status_code != 200:
    print(f"❌ Login failed: {login_response.status_code}")
    print(login_response.text)
    exit(1)

token = login_response.json()["access_token"]
print(f"✓ Login successful, got token")

# Step 2: Update project assignment
print(f"\n2. Assigning Valuer ID {VALUER_ID} to Project ID {PROJECT_ID}...")
headers = {"Authorization": f"Bearer {token}"}
update_data = {
    "assigned_valuer_id": VALUER_ID
}

update_response = requests.put(
    f"{BASE_URL}/projects/{PROJECT_ID}",
    headers=headers,
    json=update_data
)

if update_response.status_code != 200:
    print(f"❌ Update failed: {update_response.status_code}")
    print(update_response.text)
    exit(1)

print(f"✓ Project updated successfully")
print(f"Response: {json.dumps(update_response.json(), indent=2)}")

print("\n" + "=" * 50)
print("✓ Test completed!")
print("Check the backend terminal for detailed logs")
print("=" * 50)
