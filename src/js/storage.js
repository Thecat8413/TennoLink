/**
 * Client Storage Layer:
 * - localStorage: Fast synchronous storage for squad profiles, active target, and preferences
 * - IndexedDB: High-capacity asynchronous storage for decoded relic inventories
 */

const DB_NAME = 'WarframeSquadDB';
const DB_VERSION = 1;
const STORE_RELICS = 'member_relics';

const LS_SQUAD_MEMBERS = 'wf_squad_members';
const LS_ACTIVE_TARGET = 'wf_active_target';
const LS_SETTINGS = 'wf_app_settings';
const LS_ACTIVE_ROOM = 'wf_active_room';

/**
 * Initializes and returns the IndexedDB database instance
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_RELICS)) {
        db.createObjectStore(STORE_RELICS, { keyPath: 'memberId' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save parsed relic inventory for a squad member
 * @param {string} memberId
 * @param {Array} relics
 */
export async function saveMemberRelics(memberId, relics) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_RELICS, 'readwrite');
    const store = tx.objectStore(STORE_RELICS);
    const request = store.put({ memberId, relics, updatedAt: Date.now() });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get relic inventory for a specific member
 * @param {string} memberId
 * @returns {Promise<Array>}
 */
export async function getMemberRelics(memberId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_RELICS, 'readonly');
    const store = tx.objectStore(STORE_RELICS);
    const request = store.get(memberId);

    request.onsuccess = () => resolve(request.result ? request.result.relics : []);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get relic inventories for all squad members simultaneously
 * @param {Array<string>} memberIds
 * @returns {Promise<Record<string, Array>>}
 */
export async function getAllSquadRelics(memberIds) {
  const results = {};
  for (const id of memberIds) {
    results[id] = await getMemberRelics(id);
  }
  return results;
}

/**
 * Remove relic cache for a member
 * @param {string} memberId
 */
export async function deleteMemberRelics(memberId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_RELICS, 'readwrite');
    const store = tx.objectStore(STORE_RELICS);
    const request = store.delete(memberId);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// -------------------------------------------------------------
// localStorage Squad Member Management
// -------------------------------------------------------------

export function getStoredSquadMembers() {
  try {
    const raw = localStorage.getItem(LS_SQUAD_MEMBERS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse stored squad members:', e);
    return [];
  }
}

export function saveStoredSquadMembers(members) {
  localStorage.setItem(LS_SQUAD_MEMBERS, JSON.stringify(members));
}

export function getStoredActiveTarget() {
  return localStorage.getItem(LS_ACTIVE_TARGET) || 'Protea Prime';
}

export function saveStoredActiveTarget(targetName) {
  localStorage.setItem(LS_ACTIVE_TARGET, targetName);
}

export function getStoredSettings() {
  try {
    const raw = localStorage.getItem(LS_SETTINGS);
    return raw ? JSON.parse(raw) : { mockEnabled: false, autoSyncHours: 6 };
  } catch (e) {
    return { mockEnabled: false, autoSyncHours: 6 };
  }
}

export function saveStoredSettings(settings) {
  localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));
}

export function getStoredActiveRoom() {
  return localStorage.getItem(LS_ACTIVE_ROOM) || 'OROKIN-7741';
}

export function saveStoredActiveRoom(roomCode) {
  localStorage.setItem(LS_ACTIVE_ROOM, roomCode);
}
