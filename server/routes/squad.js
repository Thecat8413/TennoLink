/**
 * Squad Squad Management & Multi-Player Sync Handler
 * Supports persistent room creation with optional 4-digit PINs,
 * cross-player stock merging, and real-time updates
 */

import { Database } from '../db.js';

export async function handleSquadRequest(req, res, url, body) {
  const method = req.method;
  const pathParts = url.pathname.replace(/^\/api\/squad\/?/, '').split('/');
  const action = pathParts[0] || '';
  const subAction = pathParts[1] || '';

  // Extract authenticated user globally
  const authHeader = req.headers['authorization'];
  let authenticatedUser = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    authenticatedUser = Database.getPlayerByToken(token);
  }

  // 1. POST /api/squad/create - Create a new persistent squad room
  if (method === 'POST' && (action === 'create' || action === '')) {
    const name = body?.name || 'Orokin Squad';
    const code = body?.code || `OROKIN-${Math.floor(1000 + Math.random() * 9000)}`;
    const pin = body?.pin ? String(body.pin).trim() : null;

    const room = Database.createRoom(code, name, pin, authenticatedUser);

    res.writeHead(201, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true, room }));
    return;
  }

  // 2. GET /api/squad/rooms - List all rooms
  if (method === 'GET' && (action === 'rooms' || action === 'list')) {
    const rooms = Database.listRooms();
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true, rooms }));
    return;
  }

  const roomCode = action.toUpperCase();
  let room = Database.getRoom(roomCode);

  if (!room) {
    if (method === 'POST' && subAction === 'join') {
      if (!authenticatedUser) {
        res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ ok: false, error: 'Unauthorized to auto-create room. Valid Bearer token required.' }));
        return;
      }
      const providedPin = body?.pin || url.searchParams.get('pin') || req.headers['x-room-pin'];
      room = Database.createRoom(roomCode, `${roomCode} Squad`, providedPin, authenticatedUser);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: `Squad room '${roomCode}' not found` }));
      return;
    }
  }

  // Permissions for modifying room data
  if (method === 'POST' && (subAction === 'join' || subAction === 'sync')) {
    if (!authenticatedUser) {
      res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Unauthorized. Valid Bearer token required.' }));
      return;
    }
    let reqPlayer = '';
    try { reqPlayer = body?.playerName?.trim(); } catch(e){}
    
    if (reqPlayer && reqPlayer.toLowerCase() !== authenticatedUser.toLowerCase()) {
      res.writeHead(403, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Forbidden. You can only modify your own data.' }));
      return;
    }
  }

  // Delete Room
  if (method === 'DELETE' && !subAction) {
    if (!authenticatedUser) {
      res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Unauthorized.' }));
      return;
    }
    if (room.owner_name?.toLowerCase() !== authenticatedUser.toLowerCase()) {
      res.writeHead(403, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Only the room owner can delete the room.' }));
      return;
    }
    
    if (Database.isNativeSqlite) {
      Database.db.prepare('DELETE FROM members WHERE room_code = ?').run(roomCode);
      Database.db.prepare('DELETE FROM rooms WHERE code = ?').run(roomCode);
    }
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true, message: `Room ${roomCode} deleted.` }));
    return;
  }

  // Check PIN
  const providedPin = body?.pin || url.searchParams.get('pin') || req.headers['x-room-pin'];
  const pinCheck = Database.verifyRoomPin(roomCode, providedPin);

  // 3. GET /api/squad/:code
  if (method === 'GET' && !subAction) {
    if (!pinCheck.ok) {
      res.writeHead(403, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({
        ok: false,
        requiresPin: true,
        error: pinCheck.error,
        room: { code: room.code, name: room.name, hasPin: true }
      }));
      return;
    }

    const members = Database.getRoomMembers(roomCode);
    const inventories = Database.getRoomInventories(roomCode);

    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({
      ok: true,
      room: { code: room.code, name: room.name, hasPin: !!room.pin, owner_name: room.owner_name, updated_at: room.updated_at },
      members,
      inventories
    }));
    return;
  }

  // Transfer Ownership
  if (method === 'POST' && subAction === 'transfer') {
    if (!authenticatedUser) {
      res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Unauthorized.' }));
      return;
    }
    if (room.owner_name?.toLowerCase() !== authenticatedUser.toLowerCase()) {
      res.writeHead(403, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Only the room owner can transfer ownership.' }));
      return;
    }
    
    const newOwner = body?.newOwner?.trim();
    if (!newOwner) {
      res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Missing newOwner.' }));
      return;
    }
    
    if (Database.isNativeSqlite) {
      Database.db.prepare('UPDATE rooms SET owner_name = ?, updated_at = ? WHERE code = ?').run(newOwner, Date.now(), roomCode);
    }
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true, message: `Ownership transferred to ${newOwner}.` }));
    return;
  }

  // 4. POST /api/squad/:code/join
  if (method === 'POST' && subAction === 'join') {
    if (!pinCheck.ok) {
      res.writeHead(403, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, requiresPin: true, error: pinCheck.error }));
      return;
    }

    const playerName = body?.playerName?.trim();
    const color = body?.color || '#e5c577';
    const syncToken = body?.syncToken || `tok_${Math.random().toString(36).substr(2, 8)}`;

    if (!playerName) {
      res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Missing playerName' }));
      return;
    }
    
    if (Database.isNativeSqlite) {
      const currentRooms = Database.db.prepare('SELECT room_code FROM members WHERE player_name = ?').all(playerName);
      if (currentRooms.length >= 50 && !currentRooms.some(r => r.room_code === roomCode)) {
        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ ok: false, error: 'Maximum of 50 rooms reached. Please leave a room before joining another.' }));
        return;
      }
    }

    const member = Database.addOrUpdateMember(roomCode, playerName, color, syncToken);
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true, member }));
    return;
  }

  // Kick Member
  if (method === 'DELETE' && subAction === 'kick') {
    if (!authenticatedUser) {
      res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Unauthorized.' }));
      return;
    }
    if (room.owner_name?.toLowerCase() !== authenticatedUser.toLowerCase()) {
      res.writeHead(403, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Only the room owner can kick members.' }));
      return;
    }
    
    const targetPlayer = body?.playerName?.trim();
    if (!targetPlayer) {
      res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Missing playerName.' }));
      return;
    }
    
    if (targetPlayer.toLowerCase() === room.owner_name?.toLowerCase()) {
      res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Owner cannot kick themselves.' }));
      return;
    }

    if (Database.isNativeSqlite) {
      Database.db.prepare('DELETE FROM members WHERE room_code = ? AND player_name = ?').run(roomCode, targetPlayer);
    }
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true, message: `Kicked ${targetPlayer} from room ${roomCode}` }));
    return;
  }

  // 6. DELETE /api/squad/:code/leave
  if (method === 'DELETE' && subAction === 'leave') {
    if (!authenticatedUser) {
      res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Unauthorized.' }));
      return;
    }

    const playerName = body?.playerName?.trim() || authenticatedUser;

    if (playerName.toLowerCase() !== authenticatedUser.toLowerCase()) {
      res.writeHead(403, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Forbidden. You can only remove yourself.' }));
      return;
    }
    
    if (room.owner_name?.toLowerCase() === authenticatedUser.toLowerCase()) {
      res.writeHead(403, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'The room owner cannot leave the room. You must delete the room or transfer ownership.' }));
      return;
    }

    if (Database.isNativeSqlite) {
      Database.db.prepare('DELETE FROM members WHERE room_code = ? AND player_name = ?').run(roomCode, playerName);
    }
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true, message: `Left room ${roomCode}` }));
    return;
  }

  if (method === 'POST' && subAction === 'sync') {
    if (!pinCheck.ok) {
      res.writeHead(403, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, requiresPin: true, error: pinCheck.error }));
      return;
    }

    const playerName = body?.playerName?.trim();
    const relics = body?.relics || [];
    const mastery = body?.mastery || null;
    const components = body?.components || null;
    const rawHash = body?.hash || '';

    if (!playerName) {
      res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Missing playerName' }));
      return;
    }
    
    if (Database.isNativeSqlite) {
      const currentRooms = Database.db.prepare('SELECT room_code FROM members WHERE player_name = ?').all(playerName);
      if (currentRooms.length >= 50 && !currentRooms.some(r => r.room_code === roomCode)) {
        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ ok: false, error: 'Maximum of 50 rooms reached. Please leave a room before joining another.' }));
        return;
      }
    }

    Database.savePlayerInventory(playerName, relics, mastery, components, rawHash);

    if (mastery && Array.isArray(mastery)) {
      Database.saveMasteryRecords(playerName, mastery);
    }

    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({
      ok: true,
      message: `Updated inventory for ${playerName} in room ${roomCode}`,
      relicCount: relics.length
    }));
    return;
  }

  res.writeHead(405, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }));
}
