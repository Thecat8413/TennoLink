export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const corsHeaders = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
  }

  if (!env.DB) {
    return new Response(JSON.stringify({ ok: false, error: 'Database not bound' }), { status: 500, headers: corsHeaders });
  }

  // Ensure table exists
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS player_accounts (
      player_name TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      sync_token TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `).run();

  try {
    const body = await request.json();
    const playerName = body?.playerName?.trim();
    const password = String(body?.password || body?.pin || '').trim();

    if (!playerName) {
      return new Response(JSON.stringify({ ok: false, error: 'Please enter your Gamertag' }), { status: 400, headers: corsHeaders });
    }

    if (!password) {
      return new Response(JSON.stringify({ ok: false, error: 'Password is required' }), { status: 400, headers: corsHeaders });
    }

    // Hash password (SHA-256 for backward compatibility with Node local DB)
    const myText = new TextEncoder().encode(password);
    const myDigest = await crypto.subtle.digest({ name: 'SHA-256' }, myText);
    const hashArray = Array.from(new Uint8Array(myDigest));
    const hashedPwd = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const account = await env.DB.prepare('SELECT * FROM player_accounts WHERE player_name = ?').bind(playerName).first();

    const syncToken = `tok_${Math.random().toString(36).substr(2, 9)}`;

    if (account) {
      // Verify password
      if (account.password_hash !== hashedPwd) {
        return new Response(JSON.stringify({ ok: false, error: 'Invalid password' }), { status: 401, headers: corsHeaders });
      }
      
      // Update sync token
      await env.DB.prepare('UPDATE player_accounts SET sync_token = ?, updated_at = ? WHERE player_name = ?')
        .bind(syncToken, Date.now(), playerName).run();
    } else {
      // Auto-register
      await env.DB.prepare('INSERT INTO player_accounts (player_name, password_hash, sync_token, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
        .bind(playerName, hashedPwd, syncToken, Date.now(), Date.now()).run();
    }

    return new Response(JSON.stringify({
      ok: true,
      playerName,
      syncToken,
      profile: { playerName, items: [] }
    }), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: corsHeaders });
  }
}
