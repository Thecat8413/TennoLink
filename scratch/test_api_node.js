const http = require('http');

function makeRequest(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', e => reject(e));
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
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
