/**
 * Warframe Squad Relic Sync & Mastery Engine - Self-Hosted Core Server
 * Runs natively in Node.js 22+ with zero external npm dependencies
 * Supports Docker Compose, Reverse Proxies (Traefik/Nginx/Caddy), WireGuard VPN, and private LANs
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { handleMarketRequest } from './routes/market.js';
import { handleAlecaframeRequest } from './routes/alecaframe.js';
import { handleSquadRequest } from './routes/squad.js';
import { handleMasteryRequest } from './routes/mastery.js';
import { handleAuthRequest } from './routes/auth.js';
import { decryptLastDataDat, sanitizeInventory } from './datParser.js';
import { Database } from './db.js';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = process.cwd();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.exe': 'application/vnd.microsoft.portable-executable',
  '.zip': 'application/zip'
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // 1. CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  // 2. Health Probe for Docker / Reverse Proxy
  if (url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() }));
    return;
  }

  // 3. API Route Routing
  if (url.pathname.startsWith('/api/')) {
    // Read body for POST/PUT requests
    let body = null;
    let rawBuffer = null;

    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      rawBuffer = Buffer.concat(chunks);
      const contentType = req.headers['content-type'] || '';

      if (contentType.includes('application/json')) {
        try {
          body = JSON.parse(rawBuffer.toString('utf8'));
        } catch {
          body = null;
        }
      }
    }

    // Route: Warframe.Market Proxy
    if (url.pathname === '/api/market') {
      return handleMarketRequest(req, res, url);
    }

    // Route: AlecaFrame Public Token Proxy
    if (url.pathname === '/api/alecaframe') {
      return handleAlecaframeRequest(req, res, url);
    }

    // Route: Squad Squad Management
    if (url.pathname.startsWith('/api/squad')) {
      return handleSquadRequest(req, res, url, body);
    }

    // Route: Persistent Mastery Rank Management
    if (url.pathname.startsWith('/api/mastery')) {
      return handleMasteryRequest(req, res, url, body);
    }

    // Route: Player Authentication (Gamertag + 4-digit PIN)
    if (url.pathname.startsWith('/api/auth')) {
      return handleAuthRequest(req, res, url, body);
    }

    // Route: Direct .dat File Upload & Decryption
    if (url.pathname === '/api/upload/dat') {
      if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }));
        return;
      }

      try {
        if (!rawBuffer || rawBuffer.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ ok: false, error: 'Empty file buffer' }));
          return;
        }

        // Decrypt AES-128-CBC and sanitize in-memory
        const decryptedRaw = decryptLastDataDat(rawBuffer);
        const sanitized = sanitizeInventory(decryptedRaw);

        const playerName = url.searchParams.get('player') || 'Tenno';
        const authHeader = req.headers['authorization'];
        
        let isAuthenticated = false;
        if (authHeader && authHeader.startsWith('Basic ')) {
          const b64 = authHeader.replace('Basic ', '');
          const decoded = Buffer.from(b64, 'base64').toString('utf8');
          const [user, pwd] = decoded.split(':');
          if (user.toLowerCase() === playerName.toLowerCase()) {
            const auth = Database.authenticatePlayer(user, pwd);
            if (auth.ok || auth.isNew) isAuthenticated = true;
          }
        } else if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.replace('Bearer ', '').trim();
          const valid = Database.verifyToken(playerName, token);
          if (valid) isAuthenticated = true;
        }

        if (!isAuthenticated) {
          res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ ok: false, error: 'Unauthorized. Invalid Basic or Bearer token.' }));
          return;
        }

        Database.savePlayerInventory(playerName, sanitized.relics, sanitized.mastery, sanitized.components);

        // Automatically update long-term mastery profile
        if (sanitized.mastery.length > 0) {
          Database.saveMasteryRecords(playerName, sanitized.mastery);
        }

        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({
          ok: true,
          syncTime: sanitized.syncTime,
          relicCount: sanitized.relics.length,
          masteryCount: sanitized.mastery.length,
          componentsCount: sanitized.components.length,
          relics: sanitized.relics,
          mastery: sanitized.mastery
        }));
      } catch (err) {
        res.writeHead(422, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ ok: false, error: `Decryption error: ${err.message}` }));
      }
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ error: `API route ${url.pathname} not found` }));
    return;
  }

  // 4. Static File Serving
  let filePath = path.join(PUBLIC_DIR, url.pathname === '/' ? 'index.html' : url.pathname);

  // Security check: prevent directory traversal
  const normalizedPath = path.normalize(filePath);
  if (!normalizedPath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  // Check if file exists
  if (!fs.existsSync(normalizedPath) || fs.statSync(normalizedPath).isDirectory()) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
    });
    res.end(content);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Internal Server Error: ${err.message}`);
  }
});

server.listen(PORT, HOST, () => {
  console.log('====================================================');
  console.log(` Warframe Helper (Self-Hosted Warframe Sync)`);
  console.log(` Server active on: http://${HOST}:${PORT}`);
  console.log(` Data Volume Path: ${process.env.DATA_DIR || path.join(process.cwd(), 'data')}`);
  console.log('====================================================');
});

// Graceful termination
const shutdown = () => {
  console.log('\n[Server] Shutting down gracefully...');
  server.close(() => {
    console.log('[Server] Closed all active connections.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
