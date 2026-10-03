/**
 * Persistent Mastery Rank Management Handler
 * Tracks historical weapon and frame mastery status, XP benchmarks, and deficit calculations
 */

import { Database } from '../db.js';

export async function handleMasteryRequest(req, res, url, body) {
  const method = req.method;
  const pathParts = url.pathname.replace(/^\/api\/mastery\/?/, '').split('/');
  const playerName = decodeURIComponent(pathParts[0] || '').trim();

  if (!playerName) {
    res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: false, error: 'Missing playerName in URL path (/api/mastery/:playerName)' }));
    return;
  }

  // 1. GET /api/mastery/:playerName - Fetch persistent profile
  if (method === 'GET') {
    const profile = Database.getMasteryProfile(playerName);
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true, profile }));
    return;
  }

  // 2. POST /api/mastery/:playerName - Update mastery records
  if (method === 'POST') {
    const items = body?.items || body?.mastery || [];
    if (!Array.isArray(items)) {
      res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ ok: false, error: 'Expected items array in body' }));
      return;
    }

    Database.saveMasteryRecords(playerName, items);
    const updated = Database.getMasteryProfile(playerName);

    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({
      ok: true,
      message: `Updated ${items.length} mastery records for ${playerName}`,
      profile: updated
    }));
    return;
  }

  res.writeHead(405, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }));
}
