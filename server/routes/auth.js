/**
 * Player Authentication Handler
 * Supports Gamertag + Password authentication with persistent session tokens
 */

import { Database } from '../db.js';

export async function handleAuthRequest(req, res, url, body) {
  const method = req.method;
  const pathParts = url.pathname.replace(/^\/api\/auth\/?/, '').split('/');
  const action = pathParts[0] || 'login';

  // 1. POST /api/auth/login
  if (method === 'POST' && action === 'login') {
    const playerName = body?.playerName?.trim();
    const password = String(body?.password || body?.pin || '').trim(); // fallback to pin for older clients

    if (!playerName) {
      res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Please enter your Gamertag / Player Name' }));
      return;
    }

    if (!password) {
      res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Please enter a password' }));
      return;
    }

    const result = Database.authenticatePlayer(playerName, password);
    if (!result.ok) {
      res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: result.error }));
      return;
    }

    // Also fetch their mastery stats
    const profile = Database.getMasteryProfile(playerName);

    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({
      ok: true,
      playerName: result.playerName,
      syncToken: result.syncToken,
      isNew: result.isNew,
      profile
    }));
    return;
  }

  // 2. GET or POST /api/auth/verify
  if (action === 'verify') {
    const playerName = body?.playerName || url.searchParams.get('player');
    const token = body?.token || url.searchParams.get('token') || req.headers['authorization']?.replace(/^Bearer\s+/, '');

    if (!playerName || !token) {
      res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Missing player or token' }));
      return;
    }

    const valid = Database.verifyToken(playerName, token);
    if (!valid) {
      res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Invalid or expired session token' }));
      return;
    }

    const profile = Database.getMasteryProfile(playerName);
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true, playerName, profile }));
    return;
  }

  res.writeHead(405, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }));
}
