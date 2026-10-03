/**
 * Squad Fireteam Roster Manager
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
  { name: 'Orokin Gold', hex: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b' },
  { name: 'Void Cyan', hex: '#00e5ff', bg: 'rgba(0, 229, 255, 0.15)', border: '#00e5ff' },
  { name: 'Lotus Violet', hex: '#d946ef', bg: 'rgba(217, 70, 239, 0.15)', border: '#d946ef' },
  { name: 'Tenno Emerald', hex: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981' },
  { name: 'Solar Amber', hex: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', border: '#f97316' },
  { name: 'Electric Blue', hex: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6' }
];

export class SquadManager {
  constructor() {
    this.client = new AlecaFrameClient();
    this.members = getStoredSquadMembers();
  }

  getMembers() {
    return this.members;
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
   * Retrieve all squad inventories from IndexedDB
   * @returns {Promise<Record<string, Array>>}
   */
  async getSquadInventories() {
    const ids = this.members.map(m => m.id);
    return await getAllSquadRelics(ids);
  }

  /**
   * Seeds demo squad data for instant testing
   */
  async seedDemoSquad() {
    this.members = [];
    const demoProfiles = [
      { name: 'Nova (Host)', token: 'mock_nova' },
      { name: 'Excalibur', token: 'mock_excalibur' },
      { name: 'Mag', token: 'mock_mag' },
      { name: 'Volt', token: 'mock_volt' }
    ];

    for (const demo of demoProfiles) {
      await this.addMember(demo.name, demo.token, true);
    }
  }
}
