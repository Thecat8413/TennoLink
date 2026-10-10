/**
 * Warframe Helper - Database Persistence Engine
 * Supports Node.js built-in node:sqlite (Node 22+) with automated schema initialization
 * Handles Squad Room PINs, Player Accounts (Gamertag + PIN auth), and long-term mastery
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { EventEmitter } from 'node:events';

export const dbEvents = new EventEmitter();

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'warframe.db');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let db = null;
let isNativeSqlite = false;

const fallbackStore = {
  rooms: new Map(),
  members: new Map(),
  inventories: new Map(),
  mastery: new Map(),
  accounts: new Map(),
  marketCache: new Map()
};

try {
  const { DatabaseSync } = await import('node:sqlite');
  db = new DatabaseSync(DB_PATH);
  isNativeSqlite = true;
  console.log(`[DB] Connected to persistent SQLite database at: ${DB_PATH}`);
  initSchema();
} catch (err) {
  console.warn(`[DB] Native node:sqlite unavailable (${err.message}). Using JSON-persisted storage.`);
  initJsonFallback();
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password || '').trim()).digest('hex');
}

function initSchema() {
  if (!db) return;

  // 1. Squad Rooms Table (with optional 4-digit PIN)
  db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      pin TEXT,
      owner_name TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // Migrate if column missing in existing db
  try {
    db.exec(`ALTER TABLE rooms ADD COLUMN pin TEXT;`);
  } catch {}
  try {
    db.exec(`ALTER TABLE rooms ADD COLUMN owner_name TEXT;`);
  } catch {}

  // 2. Player Accounts Table (Gamertag + 4-digit PIN auth)
  db.exec(`
    CREATE TABLE IF NOT EXISTS player_accounts (
      player_name TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      sync_token TEXT NOT NULL,
      is_admin INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_accounts_token ON player_accounts(sync_token);
  `);

  try {
    // Migrate old column name to new column name if it exists
    db.exec(`ALTER TABLE player_accounts RENAME COLUMN pin_hash TO password_hash;`);
  } catch {}

  try {
    db.exec(`ALTER TABLE player_accounts ADD COLUMN is_admin INTEGER DEFAULT 0;`);
  } catch {}

  // 3. Squad Members Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      room_code TEXT NOT NULL,
      player_name TEXT NOT NULL,
      color TEXT NOT NULL,
      sync_token TEXT,
      last_sync INTEGER,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_members_room ON members(room_code);
  `);

  // 4. Player Inventories Table (relics, mastery, components)
  db.exec(`
    CREATE TABLE IF NOT EXISTS inventories (
      id TEXT PRIMARY KEY,
      room_code TEXT NOT NULL,
      player_name TEXT NOT NULL,
      relics_json TEXT NOT NULL,
      mastery_json TEXT,
      components_json TEXT,
      raw_hash TEXT,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_inv_room ON inventories(room_code);
    CREATE INDEX IF NOT EXISTS idx_inv_player ON inventories(player_name);
  `);

  try {
    db.exec(`ALTER TABLE inventories ADD COLUMN components_json TEXT;`);
  } catch {}

  // 5. Long-Term Mastery Records Table (persistent across all sessions)
  db.exec(`
    CREATE TABLE IF NOT EXISTS mastery_records (
      player_name TEXT NOT NULL,
      item_id TEXT NOT NULL,
      item_name TEXT NOT NULL,
      category TEXT NOT NULL,
      xp INTEGER NOT NULL,
      mastered INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (player_name, item_id)
    );
    CREATE INDEX IF NOT EXISTS idx_mastery_player ON mastery_records(player_name);
  `);

  // 6. Warframe.market & External API Cache Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS market_cache (
      item_slug TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      data_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  console.log('[DB] SQLite tables and migrations initialized successfully.');
}

function initJsonFallback() {
  const jsonFile = path.join(DATA_DIR, 'fallback_store.json');
  if (fs.existsSync(jsonFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
      Object.entries(data.rooms || {}).forEach(([k, v]) => fallbackStore.rooms.set(k, v));
      Object.entries(data.members || {}).forEach(([k, v]) => fallbackStore.members.set(k, v));
      Object.entries(data.inventories || {}).forEach(([k, v]) => fallbackStore.inventories.set(k, v));
      Object.entries(data.mastery || {}).forEach(([k, v]) => fallbackStore.mastery.set(k, v));
      Object.entries(data.accounts || {}).forEach(([k, v]) => fallbackStore.accounts.set(k, v));
      Object.entries(data.marketCache || {}).forEach(([k, v]) => fallbackStore.marketCache.set(k, v));
    } catch (e) {
      console.warn('[DB] Could not parse fallback JSON store:', e.message);
    }
  }
}

function saveJsonFallback() {
  if (isNativeSqlite) return;
  const jsonFile = path.join(DATA_DIR, 'fallback_store.json');
  const serialized = {
    rooms: Object.fromEntries(fallbackStore.rooms),
    members: Object.fromEntries(fallbackStore.members),
    inventories: Object.fromEntries(fallbackStore.inventories),
    mastery: Object.fromEntries(fallbackStore.mastery),
    accounts: Object.fromEntries(fallbackStore.accounts),
    marketCache: Object.fromEntries(fallbackStore.marketCache)
  };
  fs.writeFileSync(jsonFile, JSON.stringify(serialized, null, 2), 'utf8');
}

export const Database = {
  db, fallbackStore, isNativeSqlite,
  // --- Player Authentication (Gamertag + Password) ---
  authenticatePlayer(playerName, password) {
    const cleanName = playerName.trim();
    const cleanPass = String(password || '').trim();
    const passwordHash = hashPassword(cleanPass);
    const now = Date.now();

    if (isNativeSqlite) {
      const account = db.prepare('SELECT * FROM player_accounts WHERE player_name = ?').get(cleanName);
      if (!account) {
        // Register on first login
        const syncToken = `tok_${crypto.randomBytes(16).toString('hex')}`;
        db.prepare(`
          INSERT INTO player_accounts (player_name, password_hash, sync_token, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?)
        `).run(cleanName, passwordHash, syncToken, now, now);

        return { ok: true, isNew: true, playerName: cleanName, syncToken, isAdmin: false };
      }

      if (account.password_hash !== passwordHash && account.pin_hash !== passwordHash) {
        return { ok: false, error: 'Incorrect password for this Gamertag' };
      }

      return { ok: true, isNew: false, playerName: cleanName, syncToken: account.sync_token, isAdmin: !!account.is_admin };
    } else {
      let account = fallbackStore.accounts.get(cleanName);
      if (!account) {
        const syncToken = `tok_${crypto.randomBytes(16).toString('hex')}`;
        account = { player_name: cleanName, password_hash: passwordHash, sync_token: syncToken, created_at: now, updated_at: now };
        fallbackStore.accounts.set(cleanName, account);
        saveJsonFallback();
        return { ok: true, isNew: true, playerName: cleanName, syncToken, isAdmin: false };
      }

      if (account.password_hash !== passwordHash && account.pin_hash !== passwordHash) {
        return { ok: false, error: 'Incorrect password for this Gamertag' };
      }
      return { ok: true, isNew: false, playerName: cleanName, syncToken: account.sync_token, isAdmin: !!account.is_admin };
    }
  },

  
  getPlayerByToken(token) {
    if (!token) return null;
    if (isNativeSqlite) {
      const account = db.prepare('SELECT player_name FROM player_accounts WHERE sync_token = ?').get(token);
      return account ? account.player_name : null;
    } else {
      const account = Array.from(fallbackStore.accounts.values()).find(a => a.syncToken === token || a.sync_token === token);
      return account ? (account.playerName || account.player_name) : null;
    }
  },

  getPlayerRooms(playerName) {
    if (!playerName) return [];
    if (isNativeSqlite) {
      const rows = db.prepare('SELECT room_code FROM members WHERE player_name = ?').all(playerName);
      return rows.map(r => r.room_code);
    } else {
      return Array.from(fallbackStore.members.values())
        .filter(m => m.playerName === playerName || m.player_name === playerName)
        .map(m => m.roomCode || m.room_code);
    }
  },

  hardPurgeUser(playerName) {
    if (!playerName) return;
    if (isNativeSqlite) {
      db.prepare('DELETE FROM player_accounts WHERE player_name = ?').run(playerName);
      db.prepare('DELETE FROM inventories WHERE player_name = ?').run(playerName);
      db.prepare('DELETE FROM mastery_records WHERE player_name = ?').run(playerName);
      db.prepare('DELETE FROM members WHERE player_name = ?').run(playerName);
    } else {
      fallbackStore.accounts.delete(playerName);
      fallbackStore.inventories.delete(playerName);
      fallbackStore.mastery.delete(playerName);
      // Clean members
      for (const [key, val] of fallbackStore.members.entries()) {
        if (val.playerName === playerName || val.player_name === playerName) {
           fallbackStore.members.delete(key);
        }
      }
      saveJsonFallback();
    }
  },
  verifyToken(playerName, token) {
    if (!token) return false;
    const cleanName = playerName.trim();
    if (isNativeSqlite) {
      const account = db.prepare('SELECT sync_token FROM player_accounts WHERE player_name = ?').get(cleanName);
      return account && account.sync_token === token;
    } else {
      const account = fallbackStore.accounts.get(cleanName);
      return account && account.sync_token === token;
    }
  },

  // --- Rooms (with 4-Digit PIN) ---
  createRoom(code, name, pin = null, ownerName = null) {
    const now = Date.now();
    const id = `room_${now}_${Math.random().toString(36).substr(2, 6)}`;
    const cleanPin = pin ? String(pin).trim() : null;

    if (isNativeSqlite) {
      db.prepare(`
        INSERT INTO rooms (id, code, name, pin, owner_name, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(id, code.toUpperCase(), name, cleanPin, ownerName, now, now);
    } else {
      fallbackStore.rooms.set(code.toUpperCase(), { id, code: code.toUpperCase(), name, pin: cleanPin, owner_name: ownerName, created_at: now, updated_at: now });
      saveJsonFallback();
    }
    return { id, code: code.toUpperCase(), name, hasPin: !!cleanPin, owner_name: ownerName, created_at: now, updated_at: now };
  },

  getRoom(code) {
    if (isNativeSqlite) {
      const stmt = db.prepare('SELECT * FROM rooms WHERE code = ?');
      return stmt.get(code.toUpperCase()) || null;
    } else {
      return fallbackStore.rooms.get(code.toUpperCase()) || null;
    }
  },

  verifyRoomPin(code, providedPin) {
    const room = this.getRoom(code);
    if (!room) return { ok: false, error: 'Room not found' };
    if (!room.pin) return { ok: true }; // No PIN required

    const match = String(room.pin).trim() === String(providedPin || '').trim();
    if (!match) return { ok: false, error: 'Incorrect 4-digit Room PIN' };
    return { ok: true };
  },

  listRooms() {
    if (isNativeSqlite) {
      const stmt = db.prepare('SELECT id, code, name, (pin IS NOT NULL AND pin != "") AS has_pin, owner_name, updated_at FROM rooms ORDER BY updated_at DESC LIMIT 50');
      return stmt.all();
    } else {
      return Array.from(fallbackStore.rooms.values())
        .map(r => ({ id: r.id, code: r.code, name: r.name, has_pin: !!r.pin, owner_name: r.owner_name, updated_at: r.updated_at }))
        .sort((a, b) => b.updated_at - a.updated_at);
    }
  },

  // --- Members ---
  addOrUpdateMember(roomCode, playerName, color, syncToken = null) {
    const now = Date.now();
    const id = `mem_${now}_${Math.random().toString(36).substr(2, 6)}`;
    const upperCode = roomCode.toUpperCase();

    if (isNativeSqlite) {
      const existing = db.prepare('SELECT id FROM members WHERE room_code = ? AND player_name = ?').get(upperCode, playerName);
      if (existing) {
        db.prepare('UPDATE members SET color = ?, last_sync = ? WHERE id = ?').run(color, now, existing.id);
        return { id: existing.id, room_code: upperCode, player_name: playerName, color, last_sync: now };
      } else {
        db.prepare(`
          INSERT INTO members (id, room_code, player_name, color, sync_token, last_sync, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(id, upperCode, playerName, color, syncToken, now, now);
        return { id, room_code: upperCode, player_name: playerName, color, last_sync: now };
      }
    } else {
      const key = `${upperCode}:${playerName}`;
      const record = { id, room_code: upperCode, player_name: playerName, color, sync_token: syncToken, last_sync: now, created_at: now };
      fallbackStore.members.set(key, record);
      saveJsonFallback();
      return record;
    }
  },

  getRoomMembers(roomCode) {
    const upperCode = roomCode.toUpperCase();
    if (isNativeSqlite) {
      const stmt = db.prepare('SELECT id, room_code, player_name, color, last_sync FROM members WHERE room_code = ? ORDER BY created_at ASC');
      return stmt.all(upperCode);
    } else {
      return Array.from(fallbackStore.members.values()).filter(m => m.room_code === upperCode);
    }
  },

  // --- Inventories (Relics & Room State) ---
  savePlayerInventory(playerName, relics, mastery = null, components = null, rawHash = '') {
    const now = Date.now();
    const id = `inv_${playerName}`;
    const relicsJson = JSON.stringify(relics || []);
    const masteryJson = mastery ? JSON.stringify(mastery) : null;
    const componentsJson = components ? JSON.stringify(components) : null;

    if (isNativeSqlite) {
      db.prepare(`
        INSERT INTO inventories (id, room_code, player_name, relics_json, mastery_json, components_json, raw_hash, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          relics_json = excluded.relics_json,
          mastery_json = excluded.mastery_json,
          components_json = excluded.components_json,
          raw_hash = excluded.raw_hash,
          updated_at = excluded.updated_at
      `).run(id, 'GLOBAL', playerName, relicsJson, masteryJson, componentsJson, rawHash, now);

      db.prepare('UPDATE members SET last_sync = ? WHERE player_name = ?').run(now, playerName);
    } else {
      fallbackStore.inventories.set(id, { id, room_code: 'GLOBAL', player_name: playerName, relics, mastery, components, rawHash, updated_at: now });
      saveJsonFallback();
    }
  },

  getRoomInventories(roomCode) {
    const upperCode = roomCode.toUpperCase();
    if (isNativeSqlite) {
      const members = db.prepare('SELECT player_name FROM members WHERE room_code = ?').all(upperCode);
      const playerNames = members.map(m => m.player_name);
      
      if (playerNames.length === 0) return [];
      
      const placeholders = playerNames.map(() => '?').join(',');
      const stmt = db.prepare(`SELECT * FROM inventories WHERE player_name IN (${placeholders})`);
      const rows = stmt.all(...playerNames);
      return rows.map(r => ({
        ...r,
        relics: JSON.parse(r.relics_json || '[]'),
        mastery: r.mastery_json ? JSON.parse(r.mastery_json) : null,
        components: r.components_json ? JSON.parse(r.components_json) : []
      }));
    } else {
      const members = Array.from(fallbackStore.members.values()).filter(m => m.room_code === upperCode);
      const playerNames = members.map(m => m.player_name);
      return Array.from(fallbackStore.inventories.values())
        .filter(i => playerNames.includes(i.player_name));
    }
  },

  // --- Long-Term Mastery Records ---
  saveMasteryRecords(playerName, masteryItems) {
    const now = Date.now();
    if (isNativeSqlite) {
      const insertStmt = db.prepare(`
        INSERT INTO mastery_records (player_name, item_id, item_name, category, xp, mastered, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(player_name, item_id) DO UPDATE SET
          xp = excluded.xp,
          mastered = excluded.mastered,
          updated_at = excluded.updated_at
      `);

      for (const item of masteryItems) {
        insertStmt.run(
          playerName,
          item.itemId || item.itemType || item.name,
          item.name || item.itemType || 'Unknown',
          item.category || 'Item',
          item.xp || 0,
          item.mastered ? 1 : 0,
          now
        );
      }
    } else {
      masteryItems.forEach(item => {
        const key = `${playerName}:${item.itemId || item.name}`;
        fallbackStore.mastery.set(key, { ...item, player_name: playerName, updated_at: now });
      });
      saveJsonFallback();
    }
  },

  getMasteryProfile(playerName) {
    if (isNativeSqlite) {
      const stmt = db.prepare('SELECT * FROM mastery_records WHERE player_name = ? ORDER BY category ASC, item_name ASC');
      const rows = stmt.all(playerName);
      const totalMastered = rows.filter(r => r.mastered === 1).length;
      const totalXp = rows.reduce((sum, r) => sum + (r.xp || 0), 0);

      // Get latest components for crafting readiness
      const latestInv = db.prepare('SELECT components_json FROM inventories WHERE player_name = ? ORDER BY updated_at DESC LIMIT 1').get(playerName);
      const ownedComponents = latestInv?.components_json ? JSON.parse(latestInv.components_json) : [];

      return { playerName, totalMastered, totalXp, items: rows, ownedComponents };
    } else {
      const rows = Array.from(fallbackStore.mastery.values()).filter(m => m.player_name === playerName);
      const totalMastered = rows.filter(r => r.mastered === 1).length;
      const totalXp = rows.reduce((sum, r) => sum + (r.xp || 0), 0);
      return { playerName, totalMastered, totalXp, items: rows, ownedComponents: [] };
    }
  },

  // --- Market Cache ---
  getMarketCache(slug, type = 'orders') {
    const now = Date.now();
    const key = `${slug}:${type}`;
    if (isNativeSqlite) {
      const row = db.prepare('SELECT * FROM market_cache WHERE item_slug = ? AND type = ?').get(slug, type);
      if (row && (now - row.updated_at < 300000)) {
        return JSON.parse(row.data_json);
      }
      return null;
    } else {
      const cached = fallbackStore.marketCache.get(key);
      if (cached && (now - cached.updated_at < 300000)) {
        return cached.data;
      }
      return null;
    }
  },

  setMarketCache(slug, type, data) {
    const now = Date.now();
    const key = `${slug}:${type}`;
    const json = JSON.stringify(data);
    if (isNativeSqlite) {
      db.prepare(`
        INSERT INTO market_cache (item_slug, type, data_json, updated_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(item_slug) DO UPDATE SET
          type = excluded.type,
          data_json = excluded.data_json,
          updated_at = excluded.updated_at
      `).run(slug, type, json, now);
    } else {
      fallbackStore.marketCache.set(key, { data, updated_at: now });
      saveJsonFallback();
    }
  }
};
