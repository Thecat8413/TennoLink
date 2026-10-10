import urllib.request
import urllib.error
import json
import time

BASE_URL = 'http://0.0.0.0:3000'

def make_request(method, endpoint, data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {}
    if data:
        data = json.dumps(data).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    if token:
        headers['Authorization'] = f'Bearer {token}'
        
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as res:
            return res.status, json.loads(res.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8'))

def test_flow():
    print("=== Testing End-to-End API Flow ===")
    
    # 1. Login / Register
    print("\\n1. Logging in as 'TestAdmin'...")
    status, data = make_request('POST', '/api/auth/login', data={"playerName": "TestAdmin", "password": "password123"})
    if status != 200:
        print("Login failed:", data)
        return
    token = data['syncToken']
    is_admin = data.get('isAdmin', False)
    print(f"Logged in. isAdmin flag: {is_admin}")
    
    # 2. Claim Admin
    print("\\n2. Claiming Admin rights...")
    status, res = make_request('POST', '/api/admin/claim', token=token)
    print("Claim response:", status, res)
    
    # 3. Re-login to get updated isAdmin flag
    print("\\n3. Re-logging in to verify isAdmin flag...")
    status, data = make_request('POST', '/api/auth/login', data={"playerName": "TestAdmin", "password": "password123"})
    token = data['syncToken']
    is_admin = data.get('isAdmin', False)
    print(f"Logged in. isAdmin flag: {is_admin}")
    
    # 4. Access Admin Dashboard
    print("\\n4. Accessing Admin Users list...")
    status, res = make_request('GET', '/api/admin/users', token=token)
    print("Admin Users response:", status)
    if 'users' in res:
        for u in res['users']:
            print(f" - {u['playerName']} (Admin: {u['isAdmin']})")
    
    # 5. Join a Room
    print("\\n5. Joining room TESTROOM...")
    status, res = make_request('POST', '/api/squad/TESTROOM/join', data={"playerName": "TestAdmin", "color": "#000", "syncToken": token, "pin": ""}, token=token)
    print("Join Room response:", status, res)
    
    # 6. Fetch Profile (Active Rooms)
    print("\\n6. Fetching Profile...")
    status, res = make_request('GET', '/api/auth/profile', token=token)
    print("Profile response:", status, res)
    
    # 7. Leave Room
    print("\\n7. Leaving room TESTROOM...")
    status, res = make_request('DELETE', '/api/squad/TESTROOM/leave', data={"playerName": "TestAdmin"}, token=token)
    print("Leave Room response:", status, res)
    
    # 8. Hard Purge
    print("\\n8. Hard Purging account...")
    status, res = make_request('DELETE', '/api/auth/profile', token=token)
    print("Purge response:", status, res)
    
    # 9. Verify Purge by trying to login
    print("\\n9. Verifying purge...")
    status, data = make_request('POST', '/api/auth/login', data={"playerName": "TestAdmin", "password": "password123"})
    print("Re-login after purge response (should have isAdmin=false): isAdmin=", data.get('isAdmin', False))

if __name__ == '__main__':
    time.sleep(1)
    test_flow()
