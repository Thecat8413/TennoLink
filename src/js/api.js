/**
 * Upstream AlecaFrame API Client
 * Interfaces with Cloudflare Pages Function /api/alecaframe
 */

import { parseRelicBinary, base64ToArrayBuffer, createMockRelicBuffer } from './binaryDecoder.js';

export class AlecaFrameClient {
  constructor(proxyPath = '/api/alecaframe') {
    this.proxyPath = proxyPath;
  }

  /**
   * Fetches and decodes the relic inventory for a given public token
   * @param {string} token
   * @param {boolean} isMock
   * @returns {Promise<Array>}
   */
  async fetchRelicInventory(token, isMock = false) {
    if (isMock || token.startsWith('mock_')) {
      // Simulate network latency
      await new Promise(r => setTimeout(r, 400));
      const buffer = createMockRelicBuffer(token);
      return parseRelicBinary(buffer);
    }

    const cleanToken = token.trim();
    const url = `${this.proxyPath}?endpoint=relics&token=${encodeURIComponent(cleanToken)}`;

    let response;
    try {
      response = await fetch(url, {
        headers: {
          'Accept': 'application/octet-stream, application/json'
        }
      });
    } catch (netErr) {
      throw new Error(`Network failure connecting to proxy: ${netErr.message}`);
    }

    if (!response.ok) {
      let errDetails = '';
      try {
        const json = await response.json();
        errDetails = json.error || json.details || response.statusText;
      } catch (e) {
        errDetails = response.statusText;
      }
      throw new Error(`AlecaFrame error (HTTP ${response.status}): ${errDetails}`);
    }

    const contentType = response.headers.get('content-type') || '';

    // Handle JSON wrapped response vs binary stream
    if (contentType.includes('application/json')) {
      const text = await response.text();
      try {
        const parsed = JSON.parse(text);
        if (typeof parsed === 'string') {
          // Base64 string payload
          const buffer = base64ToArrayBuffer(parsed);
          return parseRelicBinary(buffer);
        } else if (parsed && parsed.data) {
          const buffer = base64ToArrayBuffer(parsed.data);
          return parseRelicBinary(buffer);
        }
      } catch (e) {
        // Fallback to array buffer
      }
    }

    const arrayBuffer = await response.arrayBuffer();
    return parseRelicBinary(arrayBuffer);
  }

  /**
   * Verifies if a token is valid and checks its enabled scopes
   * @param {string} token
   * @returns {Promise<{valid: boolean, username?: string, publicParts: number, canRelics: boolean, lastUpdate?: string}>}
   */
  async verifyToken(token) {
    if (token.startsWith('mock_')) {
      return {
        valid: true,
        username: token.replace('mock_', '').toUpperCase(),
        publicParts: 129, // Trades (1) + Relics (128)
        canRelics: true,
        lastUpdate: new Date().toISOString()
      };
    }

    const cleanToken = token.trim();
    const url = `${this.proxyPath}?endpoint=stats&token=${encodeURIComponent(cleanToken)}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        return { valid: false, canRelics: false, error: `HTTP ${res.status}: Invalid or expired token` };
      }

      const data = await res.json();
      const publicParts = data.publicParts || 0;
      const canRelics = (publicParts & 128) === 128;

      return {
        valid: true,
        username: data.usernameWhenPublic || 'Anonymous Tenno',
        publicParts,
        canRelics,
        lastUpdate: data.lastUpdate
      };
    } catch (e) {
      return { valid: false, canRelics: false, error: e.message };
    }
  }
}
