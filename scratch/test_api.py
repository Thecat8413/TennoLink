import requests
import json
import time

BASE_URL = 'http://0.0.0.0:3000'

def test_flow():
    print("=== Testing End-to-End API Flow ===")
    
    # 1. Login / Register
    print("\\n1. Logging in as 'TestAdmin'...")
    res = requests.post(f"{BASE_URL}/api/auth/login", json={"playerName": "TestAdmin", "password": "password123"})
    if res.status_code != 200:
        print("Login failed:", res.text)
        return
    data = res.json()
    token = data['syncToken']
    is_admin = data.get('isAdmin', False)
    print(f"Logged in. isAdmin flag: {is_admin}")
    
    # 2. Claim Admin
    print("\\n2. Claiming Admin rights...")
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.post(f"{BASE_URL}/api/admin/claim", headers=headers)
    print("Claim response:", res.status_code, res.text)
    
    # 3. Re-login to get updated isAdmin flag
    print("\\n3. Re-logging in to verify isAdmin flag...")
    res = requests.post(f"{BASE_URL}/api/auth/login", json={"playerName": "TestAdmin", "password": "password123"})
    data = res.json()
    token = data['syncToken'] # Token refreshes on login
    headers = {"Authorization": f"Bearer {token}"}
    is_admin = data.get('isAdmin', False)
    print(f"Logged in. isAdmin flag: {is_admin}")
    if not is_admin:
        print("ERROR: Admin flag not set in login payload!")
        
    # 4. Access Admin Dashboard
    print("\\n4. Accessing Admin Users list...")
    res = requests.get(f"{BASE_URL}/api/admin/users", headers=headers)
    print("Admin Users response:", res.status_code, res.text)
    
    # 5. Join a Room
    print("\\n5. Joining room TESTROOM...")
    res = requests.post(f"{BASE_URL}/api/squad/TESTROOM/join", headers=headers, json={"playerName": "TestAdmin", "color": "#000", "syncToken": token, "pin": ""})
    print("Join Room response:", res.status_code, res.text)
    
    # 6. Fetch Profile (Active Rooms)
    print("\\n6. Fetching Profile...")
    res = requests.get(f"{BASE_URL}/api/auth/profile", headers=headers)
    print("Profile response:", res.status_code, res.text)
    
    # 7. Leave Room
    print("\\n7. Leaving room TESTROOM...")
    res = requests.delete(f"{BASE_URL}/api/squad/TESTROOM/leave", headers=headers, json={"playerName": "TestAdmin"})
    print("Leave Room response:", res.status_code, res.text)
    
    # 8. Hard Purge
    print("\\n8. Hard Purging account...")
    res = requests.delete(f"{BASE_URL}/api/auth/profile", headers=headers)
    print("Purge response:", res.status_code, res.text)
    
    # 9. Verify Purge by trying to login
    print("\\n9. Verifying purge (logging in should create a NEW account and fail if password is wrong, but since we use same password it works, so let's check users list)...")
    res = requests.post(f"{BASE_URL}/api/auth/login", json={"playerName": "TestAdmin", "password": "password123"})
    data = res.json()
    print("Re-login after purge response (should have isAdmin=false):", data)

if __name__ == '__main__':
    # Wait for server to be fully ready
    time.sleep(2)
    test_flow()
