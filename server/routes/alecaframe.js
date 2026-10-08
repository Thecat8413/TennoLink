/**
 * AlecaFrame Public Token Proxy Handler (Self-Hosted)
 * Interfaces with stats.alecaframe.com and caches responses in SQLite
 */

import { Database } from '../db.js';

export async function handleAlecaframeRequest(req, res, url) {
  const token = url.searchParams.get('token');
  const endpoint = url.searchParams.get('endpoint') || 'relics';

  if (!token) {
    res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ error: 'Missing required query parameter: token' }));
    return;
  }

  const cacheKey = `aleca_${token}_${endpoint}`;
  const cached = Database.getMarketCache(cacheKey, 'aleca');
  if (cached) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Proxy-Cache': 'HIT',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(cached));
    return;
  }

  let targetUrl = '';
  if (endpoint === 'relics') {
    targetUrl = `https://stats.alecaframe.com/api/stats/public/getRelicInventory?publicToken=${encodeURIComponent(token)}`;
  } else if (endpoint === 'stats') {
    targetUrl = `https://stats.alecaframe.com/api/stats/public?token=${encodeURIComponent(token)}`;
  } else {
    res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ error: "Invalid endpoint. Must be 'stats' or 'relics'" }));
    return;
  }

  try {
    const upstreamRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'TennoLink-SelfHosted/1.0',
        'Accept': 'application/json'
      }
    });

    if (!upstreamRes.ok) {
      const errText = await upstreamRes.text();
      res.writeHead(upstreamRes.status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ error: 'Upstream AlecaFrame error', status: upstreamRes.status, details: errText.slice(0, 300) }));
      return;
    }

    const data = await upstreamRes.json();
    Database.setMarketCache(cacheKey, 'aleca', data);

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Proxy-Cache': 'MISS',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(data));
  } catch (err) {
    res.writeHead(502, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ error: 'Failed to communicate with AlecaFrame API', details: err.message }));
  }
}
