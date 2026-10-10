import { Database } from '../db.js';

export function handleAdminRequest(req, res, url, body) {
  const method = req.method;
  const parts = url.pathname.split('/').filter(Boolean);
  const action = parts[2]; // /api/admin/:action
  const targetId = parts[3] ? decodeURIComponent(parts[3]) : null;

  // Authenticate user
  const authHeader = req.headers['authorization'];
  let authenticatedUser = null;
  let isAdmin = false;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    const player = Database.getPlayerByToken(token);
    if (player) {
      // Look up admin status
      const account = Database.isNativeSqlite 
        ? Database.db.prepare('SELECT is_admin FROM player_accounts WHERE sync_token = ?').get(token)
        : Array.from(Database.fallbackStore.accounts.values()).find(a => a.syncToken === token);

      if (account) {
        authenticatedUser = player;
        isAdmin = Database.isNativeSqlite ? !!account.is_admin : !!account.isAdmin;
      }
    }
  }

  if (!authenticatedUser) {
    res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: false, error: 'Unauthorized' }));
    return;
  }

  // POST /api/admin/claim
  if (method === 'POST' && action === 'claim') {
    if (Database.isNativeSqlite) {
      const anyAdmins = Database.db.prepare('SELECT COUNT(*) as count FROM player_accounts WHERE is_admin = 1').get();
      if (anyAdmins && anyAdmins.count > 0) {
        res.writeHead(403, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ ok: false, error: 'An admin already exists' }));
        return;
      }
      Database.db.prepare('UPDATE player_accounts SET is_admin = 1 WHERE player_name = ?').run(authenticatedUser);
    } else {
      const anyAdmins = Array.from(Database.fallbackStore.accounts.values()).some(a => a.isAdmin);
      if (anyAdmins) {
        res.writeHead(403, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ ok: false, error: 'An admin already exists' }));
        return;
      }
      const acc = Database.fallbackStore.accounts.get(authenticatedUser);
      if (acc) acc.isAdmin = true;
    }

    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true, message: 'Admin rights claimed successfully' }));
    return;
  }

  // All other endpoints require Admin
  if (!isAdmin) {
    res.writeHead(403, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: false, error: 'Forbidden. Admin required.' }));
    return;
  }

  // GET /api/admin/users
  if (method === 'GET' && action === 'users') {
    if (Database.isNativeSqlite) {
      const results = Database.db.prepare(`
        SELECT p.player_name, p.is_admin, p.created_at, i.updated_at as last_sync
        FROM player_accounts p
        LEFT JOIN inventories i ON p.player_name = i.player_name
        ORDER BY p.created_at DESC
      `).all();

      const users = results.map(row => ({
        playerName: row.player_name,
        isAdmin: !!row.is_admin,
        createdAt: row.created_at,
        hasSynced: !!row.last_sync,
        lastSync: row.last_sync || null
      }));

      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: true, users }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: true, users: [] }));
    }
    return;
  }

  // GET /api/admin/rooms
  if (method === 'GET' && action === 'rooms') {
    if (Database.isNativeSqlite) {
      const rawRooms = Database.db.prepare(`
        SELECT r.code, r.name, r.created_at, r.updated_at, m.player_name
        FROM rooms r
        LEFT JOIN members m ON r.code = m.room_code
      `).all();

      const roomsMap = {};
      for (const row of rawRooms) {
        if (!roomsMap[row.code]) {
          roomsMap[row.code] = {
            code: row.code,
            name: row.name,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            members: []
          };
        }
        if (row.player_name) {
          roomsMap[row.code].members.push(row.player_name);
        }
      }
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: true, rooms: Object.values(roomsMap) }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: true, rooms: [] }));
    }
    return;
  }

  // DELETE /api/admin/users/:player
  if (method === 'DELETE' && action === 'users' && targetId) {
    if (targetId.toLowerCase() === authenticatedUser.toLowerCase()) {
      res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Cannot delete yourself from this endpoint' }));
      return;
    }
    if (Database.isNativeSqlite) {
      Database.db.prepare('DELETE FROM player_accounts WHERE player_name = ?').run(targetId);
      Database.db.prepare('DELETE FROM inventories WHERE player_name = ?').run(targetId);
      Database.db.prepare('DELETE FROM mastery_records WHERE player_name = ?').run(targetId);
      Database.db.prepare('DELETE FROM members WHERE player_name = ?').run(targetId);
    }
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true, message: `Purged user ${targetId}` }));
    return;
  }

  // DELETE /api/admin/rooms/:code
  if (method === 'DELETE' && action === 'rooms' && targetId) {
    if (Database.isNativeSqlite) {
      Database.db.prepare('DELETE FROM rooms WHERE code = ?').run(targetId);
      Database.db.prepare('DELETE FROM members WHERE room_code = ?').run(targetId);
    }
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true, message: `Purged room ${targetId}` }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify({ ok: false, error: 'Endpoint not found' }));
}
