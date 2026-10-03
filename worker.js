/**
 * Cloudflare Worker Entrypoint with Static Assets
 * Dispatches dynamic API routes (/api/*) to their respective handlers
 * and serves static assets for all other routes.
 */

import { onRequest as handleMarket } from './functions/api/market.js';
import { onRequest as handleAlecaframe } from './functions/api/alecaframe.js';
import { onRequest as handleAuthLogin } from './functions/api/auth/login.js';
import { onRequest as handleUploadDat } from './functions/api/upload/dat.js';
import { onRequest as handleMastery } from './functions/api/mastery/[player].js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Build context compatible with Pages Functions signature
    const context = {
      request,
      env,
      ctx,
      params: {}
    };

    // Route API requests
    if (url.pathname === '/api/market') {
      return handleMarket(context);
    }

    if (url.pathname === '/api/alecaframe') {
      return handleAlecaframe(context);
    }

    if (url.pathname === '/api/auth/login') {
      return handleAuthLogin(context);
    }

    if (url.pathname === '/api/upload/dat') {
      return handleUploadDat(context);
    }

    if (url.pathname.startsWith('/api/mastery/')) {
      const parts = url.pathname.split('/api/mastery/');
      context.params.player = parts[1] ? decodeURIComponent(parts[1]) : 'Tenno';
      return handleMastery(context);
    }

    // Health probe
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // All non-API requests fall through to static assets (index.html, styles, .exe, .zip, etc.)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
