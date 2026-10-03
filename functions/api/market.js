/**
 * Cloudflare Pages Function: Warframe.Market Edge Proxy & Cache
 * Route: /api/market?item={item_url_slug}&type={orders|statistics}
 */

export async function onRequest(context) {
  const { request } = context;

  // Handle CORS preflight
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
  const customPath = url.searchParams.get('path');
  const itemSlug = url.searchParams.get('item');
  const type = url.searchParams.get('type') || 'orders';

  let targetUrl = '';
  if (customPath) {
    targetUrl = `https://api.warframe.market/${customPath.replace(/^\//, '')}`;
  } else if (itemSlug) {
    const sanitizedSlug = itemSlug.toLowerCase().replace(/[^a-z0-9_]/g, '');
    targetUrl = type === 'statistics'
      ? `https://api.warframe.market/v2/items/${encodeURIComponent(sanitizedSlug)}/statistics`
      : `https://api.warframe.market/v2/orders/item/${encodeURIComponent(sanitizedSlug)}`;
  } else {
    return new Response(JSON.stringify({ error: 'Missing item or path' }), { status: 400 });
  }

  // Cache lookup (5 minutes TTL for market orders to strictly respect 3 req/sec rate limit)
  const cacheKey = new Request(targetUrl, { method: 'GET' });
  const cache = caches.default;
  let cachedResponse = await cache.match(cacheKey);

  if (cachedResponse) {
    const responseHeaders = new Headers(cachedResponse.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('X-Proxy-Cache', 'HIT');
    return new Response(cachedResponse.body, {
      status: cachedResponse.status,
      headers: responseHeaders,
    });
  }

  try {
    const upstreamResponse = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'WarframeHelper/1.0 (+https://github.com/Thecat8413/warframe-helper)',
        'Accept': 'application/json',
        'Language': 'en',
        'Platform': 'pc'
      },
    });

    if (!upstreamResponse.ok) {
      const errText = await upstreamResponse.text();
      return new Response(
        JSON.stringify({
          ok: false,
          upstreamStatus: upstreamResponse.status,
          upstreamHeaders: Object.fromEntries(upstreamResponse.headers.entries()),
          details: errText.slice(0, 500),
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

    const data = await upstreamResponse.json();
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', 'application/json');
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Cache-Control', 'public, max-age=300'); // 5 minute edge cache
    responseHeaders.set('X-Proxy-Cache', 'MISS');

    const response = new Response(JSON.stringify(data), {
      status: 200,
      headers: responseHeaders,
    });

    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: 'Failed to communicate with Warframe.market',
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
