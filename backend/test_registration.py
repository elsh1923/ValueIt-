import urllib.request
import urllib.error
import json

url = "http://127.0.0.1:8000/api/v1/auth/register"
headers = {
    "Origin": "http://localhost:3000",
    "Content-Type": "application/json"
}
payload = {
    "email": "debug_user_v3@example.com",
    "password": "password123",
    "full_name": "Debug User V3",
    "role": "valuer"
}
data = json.dumps(payload).encode('utf-8')

req = urllib.request.Request(url, data=data, headers=headers, method='POST')

def run_test():
    try:
        print(f"Testing POST to {url}")
        with urllib.request.urlopen(req) as response:
            print(f"Status Code: {response.getcode()}")
            print("Response Headers:")
            for k, v in response.info().items():
                if "access-control" in k.lower():
                    print(f"  {k}: {v}")
            # print("\nResponse Body:")
            # print(response.read().decode('utf-8'))

    except urllib.error.HTTPError as e:
        print(f"HTTPError: {e.code}")
        print("Response Headers:")
        for k, v in e.headers.items():
            if "access-control" in k.lower():
                print(f"  {k}: {v}")
        print("\nResponse Body:")
        print(e.read().decode('utf-8'))
    except Exception as e:
        print(f"Error: {e}")

print("--- Attempt 1 (Expect 200) ---")
run_test()
print("\n--- Attempt 2 (Expect 400) ---")
run_test()
