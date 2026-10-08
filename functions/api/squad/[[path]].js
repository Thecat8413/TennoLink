export async function onRequest(context) {
  const { request, env, params } = context;
  const pathParts = params.path || [];

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-room-pin',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const corsHeaders = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  if (!env.DB) {
    return new Response(JSON.stringify({ ok: false, error: 'Database not bound' }), { status: 500, headers: corsHeaders });
  }

  // Helper to init members table if missing (since it wasn't in original D1 script)
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS members (
      room_code TEXT NOT NULL,
      player_name TEXT NOT NULL,
      color TEXT,
      sync_token TEXT,
      joined_at INTEGER NOT NULL,
      PRIMARY KEY (room_code, player_name)
    );
  `).run();
  
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      pin TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `).run();

  const action = pathParts[0] || '';
  const subAction = pathParts[1] || '';
  const method = request.method;

  try {
    // 1. POST /api/squad/create
    if (method === 'POST' && (action === 'create' || action === '')) {
      let body = {};
      try { body = await request.json(); } catch(e){}
      
      const name = body?.name || 'Orokin Squad';
      const code = body?.code || `OROKIN-${Math.floor(1000 + Math.random() * 9000)}`;
      const pin = body?.pin ? String(body.pin).trim() : null;

      await env.DB.prepare(`
        INSERT INTO rooms (id, code, name, pin, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(code, code, name, pin, Date.now(), Date.now()).run();

      return new Response(JSON.stringify({ ok: true, room: { code, name, hasPin: !!pin } }), { status: 201, headers: corsHeaders });
    }

    // 2. GET /api/squad/rooms
    if (method === 'GET' && (action === 'rooms' || action === 'list')) {
      const { results } = await env.DB.prepare(`SELECT code, name, CASE WHEN pin IS NOT NULL THEN 1 ELSE 0 END as hasPin FROM rooms ORDER BY created_at DESC`).all();
      return new Response(JSON.stringify({ ok: true, rooms: results }), { status: 200, headers: corsHeaders });
    }

    const roomCode = action.toUpperCase();
    
    // Ensure room exists
    const roomRecord = await env.DB.prepare(`SELECT code, name, pin, updated_at FROM rooms WHERE code = ?`).bind(roomCode).first();
    if (!roomRecord) {
      return new Response(JSON.stringify({ ok: false, error: `Squad room '${roomCode}' not found` }), { status: 404, headers: corsHeaders });
    }

    const url = new URL(request.url);
    let body = null;
    if (method === 'POST') {
      try { body = await request.json(); } catch(e) {}
    }
    // --- AUTHENTICATION CHECK ---
    const authHeader = request.headers.get('Authorization');
    let authenticatedUser = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      const account = await env.DB.prepare('SELECT player_name FROM player_accounts WHERE sync_token = ?').bind(token).first();
      if (account) authenticatedUser = account.player_name;
    }

    // Require Auth for mutations
    if (method === 'POST' && (subAction === 'join' || subAction === 'sync')) {
      if (!authenticatedUser) {
        return new Response(JSON.stringify({ ok: false, error: 'Unauthorized. Valid Bearer token required.' }), { status: 401, headers: corsHeaders });
      }
      
      let reqPlayer = '';
      try { reqPlayer = body?.playerName?.trim(); } catch(e){}
      
      if (reqPlayer && reqPlayer.toLowerCase() !== authenticatedUser.toLowerCase()) {
        return new Response(JSON.stringify({ ok: false, error: 'Forbidden. You can only modify your own data.' }), { status: 403, headers: corsHeaders });
      }
    }
    // ----------------------------
    
    const providedPin = body?.pin || url.searchParams.get('pin') || request.headers.get('x-room-pin');
    
    if (roomRecord.pin && roomRecord.pin !== providedPin) {
      return new Response(JSON.stringify({ ok: false, requiresPin: true, error: 'Invalid or missing PIN', room: { code: roomRecord.code, name: roomRecord.name, hasPin: true } }), { status: 403, headers: corsHeaders });
    }

    // 3. GET /api/squad/:code
    if (method === 'GET' && !subAction) {
      const { results: members } = await env.DB.prepare(`SELECT player_name as playerName, color, sync_token as syncToken, joined_at as joinedAt FROM members WHERE room_code = ?`).bind(roomCode).all();
      
      const inventories = {};
      if (members.length > 0) {
        const placeholders = members.map(() => '?').join(',');
        const playerNames = members.map(m => m.playerName);
        const { results: invs } = await env.DB.prepare(`SELECT player_name, relics_json, mastery_json, components_json, updated_at FROM inventories WHERE player_name IN (${placeholders})`).bind(...playerNames).all();
        
        for (const row of invs) {
          inventories[row.player_name] = {
            relics: JSON.parse(row.relics_json || '[]'),
            mastery: JSON.parse(row.mastery_json || 'null'),
            components: JSON.parse(row.components_json || 'null'),
            updated_at: row.updated_at
          };
        }
      }

      return new Response(JSON.stringify({
        ok: true,
        room: { code: roomRecord.code, name: roomRecord.name, hasPin: !!roomRecord.pin, updated_at: roomRecord.updated_at },
        members,
        inventories
      }), { status: 200, headers: corsHeaders });
    }

    // 4. POST /api/squad/:code/join
    if (method === 'POST' && subAction === 'join') {
      const playerName = body?.playerName?.trim();
      const color = body?.color || '#e5c577';
      const syncToken = body?.syncToken || `tok_${Math.random().toString(36).substr(2, 8)}`;

      if (!playerName) {
        return new Response(JSON.stringify({ ok: false, error: 'Missing playerName' }), { status: 400, headers: corsHeaders });
      }

      await env.DB.prepare(`
        INSERT INTO members (room_code, player_name, color, sync_token, joined_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(room_code, player_name) DO UPDATE SET color = excluded.color, sync_token = excluded.sync_token, joined_at = excluded.joined_at
      `).bind(roomCode, playerName, color, syncToken, Date.now()).run();

      return new Response(JSON.stringify({ ok: true, member: { roomCode, playerName, color, syncToken, joinedAt: Date.now() } }), { status: 200, headers: corsHeaders });
    }

    // 5. POST /api/squad/:code/sync
    if (method === 'POST' && subAction === 'sync') {
      const playerName = body?.playerName?.trim();
      const relics = body?.relics || [];
      const mastery = body?.mastery || null;
      const components = body?.components || null;

      if (!playerName) {
        return new Response(JSON.stringify({ ok: false, error: 'Missing playerName' }), { status: 400, headers: corsHeaders });
      }

      await env.DB.prepare(`
        INSERT INTO inventories (id, room_code, player_name, relics_json, mastery_json, components_json, raw_hash, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          relics_json = excluded.relics_json,
          mastery_json = excluded.mastery_json,
          components_json = excluded.components_json,
          updated_at = excluded.updated_at
      `).bind(
        `inv_GLOBAL_${playerName}`, // We store inventories under GLOBAL, bound by playerName
        'GLOBAL',
        playerName,
        JSON.stringify(relics),
        JSON.stringify(mastery),
        JSON.stringify(components),
        '',
        Date.now()
      ).run();

      return new Response(JSON.stringify({ ok: true, message: `Updated inventory for ${playerName}` }), { status: 200, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ ok: false, error: 'Action not supported' }), { status: 405, headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: corsHeaders });
  }
}
