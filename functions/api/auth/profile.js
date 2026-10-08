/**
 * Cloudflare Pages Function: /api/auth/profile
 * Edge handler for profile actions (like Hard Purge)
 */

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;

  const corsHeaders = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: { ...corsHeaders, 'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }
    });
  }

  if (!env.DB) return new Response(JSON.stringify({ ok: false, error: 'Database not bound' }), { status: 500, headers: corsHeaders });

  // Authenticate user
  const authHeader = request.headers.get('Authorization');
  let authenticatedUser = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    const account = await env.DB.prepare('SELECT player_name FROM player_accounts WHERE sync_token = ?').bind(token).first();
    if (account) authenticatedUser = account.player_name;
  }

  if (!authenticatedUser) {
    return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  // DELETE /api/auth/profile - Hard Purge Self
  
  // GET /api/auth/profile - Fetch user profile and active rooms
  if (method === 'GET') {
    const { results } = await env.DB.prepare('SELECT room_code FROM members WHERE player_name = ?').bind(authenticatedUser).all();
    const rooms = results.map(r => r.room_code);
    return new Response(JSON.stringify({ ok: true, player: authenticatedUser, rooms }), { status: 200, headers: corsHeaders });
  }

  if (method === 'DELETE') {
    await env.DB.batch([
      env.DB.prepare('DELETE FROM player_accounts WHERE player_name = ?').bind(authenticatedUser),
      env.DB.prepare('DELETE FROM inventories WHERE player_name = ?').bind(authenticatedUser),
      env.DB.prepare('DELETE FROM mastery_records WHERE player_name = ?').bind(authenticatedUser),
      env.DB.prepare('DELETE FROM members WHERE player_name = ?').bind(authenticatedUser)
    ]);
    return new Response(JSON.stringify({ ok: true, message: `Your data has been permanently purged.` }), { status: 200, headers: corsHeaders });
  }

  return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
}
