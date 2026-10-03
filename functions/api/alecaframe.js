/**
 * Cloudflare Pages Function: AlecaFrame Edge Proxy & Rate-Limit Shield
 * Route: /api/alecaframe?endpoint={stats|relics}&token={token}
 */

export async function onRequest(context) {
  const { request } = context;

  // Handle CORS preflight requests
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
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const url = new URL(request.url);
  const endpoint = url.searchParams.get('endpoint');
  const token = url.searchParams.get('token');

  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing required query parameter: token' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  let targetUrl = '';
  if (endpoint === 'relics') {
    targetUrl = `https://stats.alecaframe.com/api/stats/public/getRelicInventory?publicToken=${encodeURIComponent(token)}`;
  } else if (endpoint === 'stats') {
    targetUrl = `https://stats.alecaframe.com/api/stats/public?token=${encodeURIComponent(token)}`;
  } else {
    return new Response(JSON.stringify({ error: "Invalid endpoint parameter. Must be 'stats' or 'relics'" }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // Edge cache lookup to avoid exhausting AlecaFrame's 1 req/sec rate limit
  const cacheKey = new Request(targetUrl, { method: 'GET' });
  const cache = caches.default;
  let cachedResponse = await cache.match(cacheKey);

  if (cachedResponse) {
    const responseHeaders = new Headers(cachedResponse.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('X-Proxy-Cache', 'HIT');
    return new Response(cachedResponse.body, {
      status: cachedResponse.status,
      statusText: cachedResponse.statusText,
      headers: responseHeaders,
    });
  }

  try {
    const upstreamResponse = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'WarframeHelper-CFPages/1.0 (Squad Relic Sync Engine)',
        'Accept': endpoint === 'relics' ? 'application/octet-stream, application/json' : 'application/json',
      },
    });

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      return new Response(
        JSON.stringify({
          error: `Upstream AlecaFrame returned HTTP ${upstreamResponse.status}`,
          status: upstreamResponse.status,
          details: errorText.slice(0, 300),
        }),
        {
          status: upstreamResponse.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const responseHeaders = new Headers(upstreamResponse.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Cache-Control', 'public, max-age=60'); // 1 minute edge cache
    responseHeaders.set('X-Proxy-Cache', 'MISS');

    // Deliver binary directly for relics, json for stats
    if (endpoint === 'relics') {
      const bodyBuffer = await upstreamResponse.arrayBuffer();
      const response = new Response(bodyBuffer, {
        status: upstreamResponse.status,
        headers: responseHeaders,
      });

      // Cache clone in edge worker
      context.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    } else {
      const responseText = await upstreamResponse.text();
      const response = new Response(responseText, {
        status: upstreamResponse.status,
        headers: responseHeaders,
      });

      context.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: 'Failed to communicate with AlecaFrame backend',
        details: err.message,
      }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
