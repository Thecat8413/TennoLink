export async function onRequest(context) {
  const { request, env, params } = context;
  const playerName = decodeURIComponent(params.player || 'Tenno');

  const corsHeaders = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: { ...corsHeaders, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }
    });
  }

  if (!env.DB) return new Response(JSON.stringify({ ok: false, error: 'Database not bound' }), { status: 500, headers: corsHeaders });

  if (request.method === 'GET') {
    const inv = await env.DB.prepare('SELECT mastery_json, components_json FROM inventories WHERE player_name = ?').bind(playerName).first();
    let mastery = [];
    let components = [];
    if (inv) {
      try { mastery = JSON.parse(inv.mastery_json || '[]'); } catch {}
      try { components = JSON.parse(inv.components_json || '[]'); } catch {}
    }
    
    return new Response(JSON.stringify({
      ok: true,
      profile: { playerName, items: mastery, ownedComponents: components }
    }), { status: 200, headers: corsHeaders });
  }

  if (request.method === 'POST') {
    // Auth Check
    const authHeader = request.headers.get('Authorization');
    let authenticatedUser = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      const account = await env.DB.prepare('SELECT player_name FROM player_accounts WHERE sync_token = ?').bind(token).first();
      if (account) authenticatedUser = account.player_name;
    }

    if (!authenticatedUser || authenticatedUser.toLowerCase() !== playerName.toLowerCase()) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    let items = [];
    let components = [];
    try {
      const body = await request.json();
      items = body?.items || [];
      components = body?.components || [];
    } catch {}

    await env.DB.prepare(`
        INSERT INTO inventories (id, room_code, player_name, mastery_json, components_json, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          mastery_json = excluded.mastery_json,
          components_json = excluded.components_json,
          updated_at = excluded.updated_at
    `).bind(
        `inv_GLOBAL_${playerName}`, 'GLOBAL', playerName, JSON.stringify(items), JSON.stringify(components), Date.now()
    ).run();

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
  }

  return new Response(JSON.stringify({ ok: false }), { status: 405, headers: corsHeaders });
}
