/**
 * Cloudflare Pages Function: /api/admin/*
 * Edge handler for admin panel features
 */

export async function onRequest(context) {
  const { request, env, params } = context;
  const method = request.method;
  
  const pathParts = params.path || [];
  const action = pathParts[0]; // e.g. 'claim', 'users', 'rooms'
  const targetId = pathParts[1] ? decodeURIComponent(pathParts[1]) : null;

  const corsHeaders = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: { ...corsHeaders, 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }
    });
  }

  if (!env.DB) return new Response(JSON.stringify({ ok: false, error: 'Database not bound' }), { status: 500, headers: corsHeaders });

  // Authenticate user
  const authHeader = request.headers.get('Authorization');
  let authenticatedUser = null;
  let isAdmin = false;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    const account = await env.DB.prepare('SELECT player_name, is_admin FROM player_accounts WHERE sync_token = ?').bind(token).first();
    if (account) {
      authenticatedUser = account.player_name;
      isAdmin = !!account.is_admin;
    }
  }

  if (!authenticatedUser) {
    return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  // POST /api/admin/claim - Claim super admin if none exists
  if (method === 'POST' && action === 'claim') {
    const anyAdmins = await env.DB.prepare('SELECT COUNT(*) as count FROM player_accounts WHERE is_admin = 1').first();
    if (anyAdmins && anyAdmins.count > 0) {
      return new Response(JSON.stringify({ ok: false, error: 'An admin already exists' }), { status: 403, headers: corsHeaders });
    }
    await env.DB.prepare('UPDATE player_accounts SET is_admin = 1 WHERE player_name = ?').bind(authenticatedUser).run();
    return new Response(JSON.stringify({ ok: true, message: 'Admin rights claimed successfully' }), { status: 200, headers: corsHeaders });
  }

  // All other endpoints require Admin
  if (!isAdmin) {
    return new Response(JSON.stringify({ ok: false, error: 'Forbidden. Admin required.' }), { status: 403, headers: corsHeaders });
  }

  // GET /api/admin/users
  if (method === 'GET' && action === 'users') {
    const { results } = await env.DB.prepare(`
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

    return new Response(JSON.stringify({ ok: true, users }), { status: 200, headers: corsHeaders });
  }

  // GET /api/admin/rooms
  if (method === 'GET' && action === 'rooms') {
    const { results: rawRooms } = await env.DB.prepare(`
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

    return new Response(JSON.stringify({ ok: true, rooms: Object.values(roomsMap) }), { status: 200, headers: corsHeaders });
  }

  // DELETE /api/admin/users/:player
  if (method === 'DELETE' && action === 'users' && targetId) {
    // Cannot delete yourself here
    if (targetId.toLowerCase() === authenticatedUser.toLowerCase()) {
      return new Response(JSON.stringify({ ok: false, error: 'Cannot delete yourself from this endpoint' }), { status: 400, headers: corsHeaders });
    }
    
    // Purge everything for this player
    await env.DB.batch([
      env.DB.prepare('DELETE FROM player_accounts WHERE player_name = ?').bind(targetId),
      env.DB.prepare('DELETE FROM inventories WHERE player_name = ?').bind(targetId),
      env.DB.prepare('DELETE FROM mastery_records WHERE player_name = ?').bind(targetId),
      env.DB.prepare('DELETE FROM members WHERE player_name = ?').bind(targetId)
    ]);
    return new Response(JSON.stringify({ ok: true, message: `Purged user ${targetId}` }), { status: 200, headers: corsHeaders });
  }

  // DELETE /api/admin/rooms/:code
  if (method === 'DELETE' && action === 'rooms' && targetId) {
    await env.DB.batch([
      env.DB.prepare('DELETE FROM rooms WHERE code = ?').bind(targetId),
      env.DB.prepare('DELETE FROM members WHERE room_code = ?').bind(targetId)
    ]);
    return new Response(JSON.stringify({ ok: true, message: `Purged room ${targetId}` }), { status: 200, headers: corsHeaders });
  }

  return new Response(JSON.stringify({ ok: false, error: 'Endpoint not found' }), { status: 404, headers: corsHeaders });
}
