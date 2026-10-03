export async function onRequest(context) {
  const { request, env } = context;

  // CORS Preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const url = new URL(request.url);
  const roomCode = url.searchParams.get('room');

  if (!roomCode) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing room parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  if (!env.DB) {
    return new Response(JSON.stringify({ ok: false, error: 'Database not bound' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    const { results } = await env.DB.prepare(`
      SELECT id, player_name, relics_json, updated_at
      FROM inventories
      WHERE room_code = ?
    `).bind(roomCode.toUpperCase()).all();

    const members = results.map(row => ({
      id: row.id,
      playerName: row.player_name,
      updatedAt: row.updated_at,
      relics: JSON.parse(row.relics_json || '[]')
    }));

    return new Response(JSON.stringify({ ok: true, members }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: `Database query failed: ${err.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
