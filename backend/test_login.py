import urllib.request
import urllib.parse
import json
import urllib.error

# URL for login
url = "http://127.0.0.1:8000/api/v1/auth/login"

# Credentials (use the ones you just registered or commonly use)
# Assuming the user registered previously with these or similar. 
# I will use the debug user I created in the previous step if it exists, or one the user likely used.
# Since I can't know the user's exact credentials, I'll rely on the one I created 'debug_user_v3@example.com' 'password123'
# OR I can create a new one first.
# To be safe, I'll register a new one then login.

register_url = "http://127.0.0.1:8000/api/v1/auth/register"
reg_headers = {
    "Origin": "http://localhost:3000",
    "Content-Type": "application/json"
}
reg_payload = {
    "email": "login_test_user@example.com",
    "password": "password123",
    "full_name": "Login Test User",
    "role": "valuer"
}

def register():
    try:
        data = json.dumps(reg_payload).encode('utf-8')
        req = urllib.request.Request(register_url, data=data, headers=reg_headers, method='POST')
        with urllib.request.urlopen(req) as response:
            print("Registration successful (or user exists)")
    except urllib.error.HTTPError as e:
        print(f"Registration status: {e.code}")
        print(e.read().decode('utf-8'))

def login():
    print("\nAttempting Login...")
    # OAuth2PasswordRequestForm expects form data (username, password)
    data = urllib.parse.urlencode({
        "username": "login_test_user@example.com",
        "password": "password123"
    }).encode('utf-8')
    
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    req = urllib.request.Request(url, data=data, headers=headers, method='POST')

    try:
        with urllib.request.urlopen(req) as response:
            print(f"Login Status Code: {response.getcode()}")
            print("Login Successful!")
            print(response.read().decode('utf-8'))

    except urllib.error.HTTPError as e:
        print(f"Login HTTPError: {e.code}")
        print("Response Body:")
        print(e.read().decode('utf-8'))
    except Exception as e:
        print(f"Login Error: {e}")

if __name__ == "__main__":
    register()
    login()
