async function makeRequest(method, path, data, token) {
  const url = `http://127.0.0.1:3000${path}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (data) options.body = JSON.stringify(data);
  if (token) options.headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(url, options);
  try {
    const json = await res.json();
    return { status: res.status, data: json };
  } catch (e) {
    const text = await res.text();
    return { status: res.status, data: text };
  }
}

async function test() {
  console.log("=== API Test ===");
  try {
    let res = await makeRequest('POST', '/api/auth/login', { playerName: "TestAdmin", password: "password123" });
    console.log("1. Login:", res.status, res.data.isAdmin ? "isAdmin: true" : "isAdmin: false");
    let token = res.data.syncToken;
    
    res = await makeRequest('POST', '/api/admin/claim', null, token);
    console.log("2. Claim Admin:", res.status, res.data);
    
    res = await makeRequest('POST', '/api/auth/login', { playerName: "TestAdmin", password: "password123" });
    console.log("3. Re-login:", res.status, res.data.isAdmin ? "isAdmin: true" : "isAdmin: false");
    token = res.data.syncToken;
    
    res = await makeRequest('GET', '/api/admin/users', null, token);
    console.log("4. List Users:", res.status, res.data.users ? res.data.users.length + " users" : res.data);
    
    res = await makeRequest('POST', '/api/squad/TESTROOM/join', { playerName: "TestAdmin", color: "#000", syncToken: token }, token);
    console.log("5. Join Room:", res.status, res.data.ok ? "OK" : res.data);
    
    res = await makeRequest('GET', '/api/auth/profile', null, token);
    console.log("6. Fetch Profile:", res.status, res.data.rooms);
    
    res = await makeRequest('DELETE', '/api/squad/TESTROOM/leave', { playerName: "TestAdmin" }, token);
    console.log("7. Leave Room:", res.status, res.data);
    
    res = await makeRequest('DELETE', '/api/auth/profile', null, token);
    console.log("8. Hard Purge:", res.status, res.data);
    
    res = await makeRequest('POST', '/api/auth/login', { playerName: "TestAdmin", password: "password123" });
    console.log("9. Verify Purge:", res.status, res.data.isAdmin ? "isAdmin: true" : "isAdmin: false");
  } catch(e) {
    console.error(e);
  }
}

test();
