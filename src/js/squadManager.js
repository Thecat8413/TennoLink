/**
 * Squad Squad Roster Manager
 */

import {
  getStoredSquadMembers,
  saveStoredSquadMembers,
  saveMemberRelics,
  getAllSquadRelics,
  deleteMemberRelics
} from './storage.js';
import { AlecaFrameClient } from './api.js';

export const SQUAD_COLORS = [
  { name: 'Orokin Gold', hex: '#e5c577', bg: 'rgba(229, 197, 119, 0.15)', border: '#e5c577' },
  { name: 'Orokin Bronze', hex: '#c99b5d', bg: 'rgba(201, 155, 93, 0.15)', border: '#c99b5d' },
  { name: 'Celestine Argent', hex: '#9db4c0', bg: 'rgba(157, 180, 192, 0.15)', border: '#9db4c0' },
  { name: 'Orokin Jade', hex: '#87aa8e', bg: 'rgba(135, 170, 142, 0.15)', border: '#87aa8e' },
  { name: 'Solar Copper', hex: '#d48b59', bg: 'rgba(212, 139, 89, 0.15)', border: '#d48b59' },
  { name: 'Void Umber', hex: '#b3957b', bg: 'rgba(179, 149, 123, 0.15)', border: '#b3957b' }
];

export class SquadManager {
  constructor() {
    this.client = new AlecaFrameClient();
    // Filter out and purge any demo/mock squad members
    const stored = getStoredSquadMembers();
    this.members = stored.filter(m => !m.isMock && !m.token?.startsWith('mock_'));
    if (this.members.length !== stored.length) {
      saveStoredSquadMembers(this.members);
    }
  }

  getMembers() {
    return this.members;
  }

  async clearMembers() {
    for (const m of this.members) {
      await deleteMemberRelics(m.id);
    }
    this.members = [];
    saveStoredSquadMembers(this.members);
  }

  /**
   * Add a new member to the squad
   * @param {string} name
   * @param {string} token
   * @param {boolean} isMock
   */
  async addMember(name, token, isMock = false) {
    const colorIndex = this.members.length % SQUAD_COLORS.length;
    const memberColor = SQUAD_COLORS[colorIndex];

    const newMember = {
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim() || `Tenno ${this.members.length + 1}`,
      token: token.trim(),
      isMock: isMock || token.startsWith('mock_'),
      color: memberColor,
      totalRelics: 0,
      lastSync: null,
      syncStatus: 'pending',
      error: null
    };

    this.members.push(newMember);
    saveStoredSquadMembers(this.members);

    // Initial sync
    await this.syncMember(newMember.id);
    return newMember;
  }

  /**
   * Remove a member from the squad and wipe their IDB relic store
   * @param {string} memberId
   */
  async removeMember(memberId) {
    this.members = this.members.filter(m => m.id !== memberId);
    saveStoredSquadMembers(this.members);
    await deleteMemberRelics(memberId);
  }

  /**
   * Syncs a single member's relic inventory from AlecaFrame
   * @param {string} memberId
   */
  async syncMember(memberId) {
    const member = this.members.find(m => m.id === memberId);
    if (!member) return;

    member.syncStatus = 'syncing';
    member.error = null;
    saveStoredSquadMembers(this.members);

    try {
      const relics = await this.client.fetchRelicInventory(member.token, member.isMock);
      await saveMemberRelics(member.id, relics);

      try {
         const sessionStr = window.localStorage.getItem('wf_tenno_session');
         const session = sessionStr ? JSON.parse(sessionStr) : null;
         const token = session ? session.syncToken : '';
         await fetch(`/api/upload/dat?player=${encodeURIComponent(member.name)}`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ InventoryJson: relics })
         });
      } catch (e) {
         console.error('Failed to broadcast token sync to server', e);
      }

      // Sum total quantity
      const totalCount = relics.reduce((sum, r) => sum + r.count, 0);

      member.totalRelics = totalCount;
      member.lastSync = new Date().toISOString();
      member.syncStatus = 'synced';
      member.error = null;
    } catch (err) {
      console.error(`Sync error for ${member.name}:`, err);
      member.syncStatus = 'error';
      member.error = err.message;
    }

    saveStoredSquadMembers(this.members);
  }

  /**
   * Synchronize all active squad members
   * @param {function} onProgress
   */
  async syncAllMembers(onProgress = null) {
    for (let i = 0; i < this.members.length; i++) {
      const member = this.members[i];
      if (onProgress) onProgress(member, i + 1, this.members.length);
      await this.syncMember(member.id);
    }
  }

  /**
   * Import relics directly from uploaded data (e.g. from /api/upload/dat or web file dropzone)
   * @param {string} name
   * @param {Array} relics
   */
  async importRelicsForMember(name, relics) {
    const cleanName = (name || 'Tenno').trim();
    let member = this.members.find(m => m.name.toLowerCase() === cleanName.toLowerCase());

    if (!member) {
      const colorIndex = this.members.length % SQUAD_COLORS.length;
      member = {
        id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: cleanName,
        token: 'web_upload',
        isMock: false,
        color: SQUAD_COLORS[colorIndex],
        totalRelics: 0,
        lastSync: null,
        syncStatus: 'synced',
        error: null
      };
      this.members.push(member);
    }

    await saveMemberRelics(member.id, relics);
    const totalCount = relics.reduce((sum, r) => sum + (r.count || 1), 0);

    member.totalRelics = totalCount;
    member.lastSync = new Date().toISOString();
    member.syncStatus = 'synced';
    member.error = null;

    saveStoredSquadMembers(this.members);
    return member;
  }

  /**
   * Fetch all room members from the server and merge them into the local squad
   * @param {string} roomCode
   */
  async syncRoomMembers(roomCode) {
    if (!roomCode) return;

    const sessionStr = window.localStorage.getItem('wf_tenno_session');
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    const currentActivePlayer = session ? session.playerName : null;

    if (currentActivePlayer) {
      try {
        await fetch(`/api/squad/${encodeURIComponent(roomCode)}/join`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.syncToken}`
          },
          body: JSON.stringify({ playerName: currentActivePlayer })
        });
      } catch (e) {}
    }

    try {
      const response = await fetch(`/api/squad/${encodeURIComponent(roomCode)}`);
      if (!response.ok) return;
      const data = await response.json();
      if (!data.ok || !data.members || !data.inventories) return;

      let changed = false;
      for (const remoteMember of data.members) {
        if (currentActivePlayer && currentActivePlayer.toLowerCase() === remoteMember.playerName.toLowerCase()) continue;

        const inv = data.inventories[remoteMember.playerName];
        if (!inv) continue;

        let localMember = this.members.find(m => m.name.toLowerCase() === remoteMember.playerName.toLowerCase());
        
        if (localMember && localMember.lastSync && new Date(localMember.lastSync) >= new Date(inv.updated_at)) {
          continue;
        }

        if (!localMember) {
          const colorIndex = this.members.length % SQUAD_COLORS.length;
          localMember = {
            id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            name: remoteMember.playerName,
            token: 'room_sync',
            isMock: false,
            color: SQUAD_COLORS[colorIndex],
            totalRelics: 0,
            lastSync: inv.updated_at,
            syncStatus: 'synced',
            error: null
          };
          this.members.push(localMember);
        }

        await saveMemberRelics(localMember.id, inv.relics);
        const totalCount = inv.relics.reduce((sum, r) => sum + (r.count || 1), 0);
        
        localMember.totalRelics = totalCount;
        localMember.lastSync = inv.updated_at;
        localMember.syncStatus = 'synced';
        localMember.error = null;
        changed = true;
      }

      if (changed) {
        saveStoredSquadMembers(this.members);
      }
      return changed;
    } catch (err) {
      console.error('Failed to sync room members:', err);
      return false;
    }
  }

  /**
   * Retrieve all squad inventories from IndexedDB
   * @returns {Promise<Record<string, Array>>}
   */
  async getSquadInventories() {
    const ids = this.members.map(m => m.id);
    return await getAllSquadRelics(ids);
  }
}

