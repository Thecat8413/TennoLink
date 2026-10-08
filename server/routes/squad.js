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

  // 1. POST /api/squad/create - Create a new persistent squad room (with optional 4-digit PIN)
  if (method === 'POST' && (action === 'create' || action === '')) {
    const name = body?.name || 'Orokin Squad';
    const code = body?.code || `OROKIN-${Math.floor(1000 + Math.random() * 9000)}`;
    const pin = body?.pin ? String(body.pin).trim() : null;

    const room = Database.createRoom(code, name, pin);

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
  const room = Database.getRoom(roomCode);

  if (!room) {
    res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: false, error: `Squad room '${roomCode}' not found` }));
    return;
  }

  // Check 4-digit PIN if room has one
  const providedPin = body?.pin || url.searchParams.get('pin') || req.headers['x-room-pin'];
  const pinCheck = Database.verifyRoomPin(roomCode, providedPin);

  // 3. GET /api/squad/:code - Get room details, members, and aggregated inventories
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
      room: { code: room.code, name: room.name, hasPin: !!room.pin, updated_at: room.updated_at },
      members,
      inventories
    }));
    return;
  }

  // 4. POST /api/squad/:code/join - Join room (requires PIN if room is protected)
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

    const member = Database.addOrUpdateMember(roomCode, playerName, color, syncToken);
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true, member }));
    return;
  }

  // 5. POST /api/squad/:code/sync - Ingest member relics & mastery into the room
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
