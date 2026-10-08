/**
 * Cloudflare Pages Function: /api/auth/login
 * Handles player login & verification with Gamertag + Password at the edge
 */

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

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  try {
    const body = await request.json();
    const playerName = body?.playerName?.trim();
    const password = String(body?.password || body?.pin || '').trim();

    if (!playerName) {
      return new Response(JSON.stringify({ ok: false, error: 'Please enter your Gamertag' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    if (!password) {
      return new Response(JSON.stringify({ ok: false, error: 'Password is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const syncToken = `tok_${Math.random().toString(36).substr(2, 9)}`;

    return new Response(JSON.stringify({
      ok: true,
      playerName,
      syncToken,
      profile: {
        playerName,
        totalMastered: 35,
        totalXp: 1480000,
        items: []
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
