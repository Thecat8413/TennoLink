import os
import re

def secure_server_squad():
    path = 'server/routes/squad.js'
    with open(path, 'r') as f:
        content = f.read()

    auth_check = """
    const authHeader = req.headers['authorization'];
    let authenticatedUser = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      const valid = Database.verifyToken(null, token, true); // We need a way to get player from token
      if (valid) authenticatedUser = valid.playerName;
    }

    if (method === 'POST' && (subAction === 'join' || subAction === 'sync')) {
      if (!authenticatedUser) {
        res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ ok: false, error: 'Unauthorized. Valid Bearer token required.' }));
        return;
      }
      const reqPlayer = body?.playerName?.trim();
      if (reqPlayer && reqPlayer.toLowerCase() !== authenticatedUser.toLowerCase()) {
        res.writeHead(403, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ ok: false, error: 'Forbidden. You can only modify your own data.' }));
        return;
      }
    }
    """
    
    target = "const providedPin = body?.pin || url.searchParams.get('pin') || req.headers['x-room-pin'];"
    if target in content and "const authHeader = req.headers['authorization'];" not in content:
        content = content.replace(target, authHeader + "\n    " + target)
        with open(path, 'w') as f:
            f.write(content)
        print("Secured server/routes/squad.js")

def secure_server_dat():
    path = 'server/datParser.js'
    with open(path, 'r') as f:
        content = f.read()

    auth_check = """
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: false, error: 'Unauthorized' }));
    return;
  }

  let isAuthenticated = false;
  if (authHeader.startsWith('Basic ')) {
    const b64 = authHeader.replace('Basic ', '');
    const decoded = Buffer.from(b64, 'base64').toString('utf8');
    const [user, pwd] = decoded.split(':');
    if (user.toLowerCase() !== playerName.toLowerCase()) {
      res.writeHead(403, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Forbidden' }));
      return;
    }
    const result = Database.authenticatePlayer(user, pwd);
    if (result.ok) isAuthenticated = true;
  } else if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    const valid = Database.verifyToken(playerName, token);
    if (valid) isAuthenticated = true;
  }

  if (!isAuthenticated) {
    res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: false, error: 'Invalid credentials' }));
    return;
  }
"""

    target = "const roomCode = url.searchParams.get('room') || '';"
    if target in content and "const authHeader = req.headers['authorization'];" not in content:
        content = content.replace(target, target + "\n" + auth_check)
        with open(path, 'w') as f:
            f.write(content)
        print("Secured server/datParser.js")

secure_server_squad()
secure_server_dat()
