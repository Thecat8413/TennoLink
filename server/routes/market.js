/**
 * Warframe.Market Edge Proxy Handler (Self-Hosted)
 * Interfaces with api.warframe.market v2 and SQLite cache
 */

import { Database } from '../db.js';

export async function handleMarketRequest(req, res, url) {
  const itemSlug = url.searchParams.get('item');
  const customPath = url.searchParams.get('path');
  const type = url.searchParams.get('type') || 'orders';

  let targetUrl = '';
  let cacheKey = '';

  if (customPath) {
    targetUrl = `https://api.warframe.market/${customPath.replace(/^\//, '')}`;
    cacheKey = customPath;
  } else if (itemSlug) {
    const sanitizedSlug = itemSlug.toLowerCase().replace(/[^a-z0-9_]/g, '');
    targetUrl = type === 'statistics'
      ? `https://api.warframe.market/v2/items/${encodeURIComponent(sanitizedSlug)}/statistics`
      : `https://api.warframe.market/v2/orders/item/${encodeURIComponent(sanitizedSlug)}`;
    cacheKey = sanitizedSlug;
  } else {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing item or path parameter' }));
    return;
  }

  // Check persistent SQLite cache
  const cached = Database.getMarketCache(cacheKey, type);
  if (cached) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Proxy-Cache': 'HIT',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(cached));
    return;
  }

  try {
    const upstreamRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'TennoLink-SelfHosted/1.0 (+https://github.com/Thecat8413/TennoLink)',
        'Accept': 'application/json',
        'Language': 'en',
        'Platform': 'pc'
      }
    });

    if (!upstreamRes.ok) {
      const errText = await upstreamRes.text();
      res.writeHead(upstreamRes.status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({
        ok: false,
        upstreamStatus: upstreamRes.status,
        details: errText.slice(0, 500)
      }));
      return;
    }

    const data = await upstreamRes.json();
    Database.setMarketCache(cacheKey, type, data);

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Proxy-Cache': 'MISS',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(data));
  } catch (err) {
    res.writeHead(502, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ error: 'Failed to communicate with Warframe.market', details: err.message }));
  }
}
