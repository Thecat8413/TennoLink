/**
 * Tenno Authentication & Session Manager
 * Handles Gamertag + Password authentication, session tokens,
 * room PIN caching, and local/remote synchronization.
 */

const LS_SESSION = 'wf_tenno_session';
const LS_ROOM_PINS = 'wf_room_pins';

export class AuthManager {
  constructor() {
    this.session = this.loadSession();
    this.roomPins = this.loadRoomPins();
  }

  loadSession() {
    try {
      const raw = localStorage.getItem(LS_SESSION);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  saveSession(session) {
    this.session = session;
    if (session) {
      localStorage.setItem(LS_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(LS_SESSION);
    }
  }

  loadRoomPins() {
    try {
      const raw = localStorage.getItem(LS_ROOM_PINS);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  saveRoomPin(roomCode, pin) {
    if (!roomCode) return;
    this.roomPins[roomCode.toUpperCase()] = String(pin).trim();
    localStorage.setItem(LS_ROOM_PINS, JSON.stringify(this.roomPins));
  }

  getRoomPin(roomCode) {
    if (!roomCode) return null;
    return this.roomPins[roomCode.toUpperCase()] || null;
  }

  isLoggedIn() {
    return !!(this.session && this.session.playerName);
  }

  getCurrentPlayer() {
    return this.session ? this.session.playerName : null;
  }

  getSession() {
    return this.session;
  }

  /**
   * Hashes a password with SHA-256 for secure client-side comparison
   */
  async hashPassword(playerName, password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(`tenno:${playerName.toLowerCase()}:${password}:orokin_salt`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Login or register a player with Gamertag + Password
   * @param {string} playerName
   * @param {string} password
   * @returns {Promise<{ok: boolean, playerName?: string, token?: string, error?: string}>}
   */
  async login(playerName, password) {
    const cleanName = playerName.trim();
    const cleanPassword = String(password).trim();

    if (!cleanName) {
      return { ok: false, error: 'Please enter your Gamertag / Player Name' };
    }

    if (!cleanPassword || cleanPassword.length < 4) {
      return { ok: false, error: 'Password must be at least 4 characters' };
    }

    // Attempt backend login first
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: cleanName, password: cleanPassword })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ok) {
          const session = {
            playerName: data.playerName,
            syncToken: data.syncToken,
            loggedInAt: Date.now()
          };
          this.saveSession(session);
          return { ok: true, playerName: data.playerName, token: data.syncToken, profile: data.profile };
        }
      } else if (res.status === 401) {
        const data = await res.json().catch(() => ({}));
        return { ok: false, error: data.error || 'Incorrect Password for this Gamertag' };
      }
    } catch (e) {
      // Backend unavailable; proceed with client-side authentication fallback
      console.warn('Backend /api/auth/login unavailable, using client-side fallback:', e);
    }

    // Client-side fallback authentication
    const passwordHash = await this.hashPassword(cleanName, cleanPassword);
    const existingAccountsKey = 'wf_tenno_accounts';
    let accounts = {};
    try {
      accounts = JSON.parse(localStorage.getItem(existingAccountsKey) || '{}');
    } catch {
      accounts = {};
    }

    if (accounts[cleanName]) {
      if (accounts[cleanName].passwordHash !== passwordHash && accounts[cleanName].pinHash !== passwordHash) {
        return { ok: false, error: 'Incorrect Password for this Gamertag' };
      }
    } else {
      // Register new account locally
      accounts[cleanName] = {
        playerName: cleanName,
        passwordHash,
        token: `tok_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now()
      };
      localStorage.setItem(existingAccountsKey, JSON.stringify(accounts));
    }

    const session = {
      playerName: cleanName,
      syncToken: accounts[cleanName].token,
      loggedInAt: Date.now()
    };
    this.saveSession(session);
    return { ok: true, playerName: cleanName, token: session.syncToken };
  }

  /**
   * Log out current player
   */
  logout() {
    this.saveSession(null);
  }

  /**
   * Checks for companion auto-login via URL hash: #player=Player2&token=...
   */
  async checkUrlAutoLogin() {
    if (!window.location.hash) return null;
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const player = params.get('player');
    const token = params.get('token');

    if (player && token) {
      const session = {
        playerName: player.trim(),
        syncToken: token.trim(),
        loggedInAt: Date.now()
      };
      this.saveSession(session);
      // Clean hash from URL for a clean address bar
      history.replaceState(null, '', window.location.pathname + window.location.search);
      return session;
    }
    return null;
  }
}
