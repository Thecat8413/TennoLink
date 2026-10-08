export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const url = new URL(request.url);
  const playerName = url.searchParams.get('player');
  if (!playerName) return new Response('Missing player parameter', { status: 400 });

  // Require Authorization
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });

  let isAuthenticated = false;

  if (!env.DB) return new Response('DB not bound', { status: 500 });

  if (authHeader.startsWith('Basic ')) {
    const b64 = authHeader.replace('Basic ', '');
    const decoded = atob(b64);
    const [user, pwd] = decoded.split(':');
    if (user.toLowerCase() !== playerName.toLowerCase()) return new Response('Forbidden', { status: 403 });
    
    // Hash password (using SHA-256 for now, as salt migration requires DB wipe, keeping simple for parity)
    const myText = new TextEncoder().encode(pwd.trim());
    const myDigest = await crypto.subtle.digest({ name: 'SHA-256' }, myText);
    const hashArray = Array.from(new Uint8Array(myDigest));
    const hashedPwd = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const account = await env.DB.prepare('SELECT * FROM player_accounts WHERE player_name = ? AND password_hash = ?').bind(user, hashedPwd).first();
    if (account) isAuthenticated = true;
  } else if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
    const account = await env.DB.prepare('SELECT * FROM player_accounts WHERE player_name = ? AND sync_token = ?').bind(playerName, token).first();
    if (account) isAuthenticated = true;
  }

  if (!isAuthenticated) return new Response('Invalid credentials', { status: 401 });

  try {
    const payload = await request.json();
    let relics = [];
    if (Array.isArray(payload)) relics = payload;
    else if (payload.InventoryJson) {
      relics = typeof payload.InventoryJson === 'string' ? JSON.parse(payload.InventoryJson) : payload.InventoryJson;
    }

    await env.DB.prepare(`
        INSERT INTO inventories (id, room_code, player_name, relics_json, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          relics_json = excluded.relics_json,
          updated_at = excluded.updated_at
    `).bind(
        `inv_GLOBAL_${playerName}`, 'GLOBAL', playerName, JSON.stringify(relics), Date.now()
    ).run();

    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}