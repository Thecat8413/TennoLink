/**
 * Warframe Squad Relic Sync Engine - Main Application Controller
 */

import { PRIME_RELIC_MAP } from '../data/primeRelicMap.js';
import { SquadManager } from './squadManager.js';
import { evaluateComponentSquadStock } from './probability.js';
import { getStoredActiveTarget, saveStoredActiveTarget } from './storage.js';

class WarframeSquadApp {
  constructor() {
    this.squadManager = new SquadManager();
    this.activeTargetName = getStoredActiveTarget();
    this.currentCategory = 'All';
    this.searchQuery = '';
    this.squadInventories = {};

    this.initElements();
    this.attachEventListeners();
  }

  initElements() {
    // Top Bar
    this.btnSyncSquad = document.getElementById('btnSyncSquad');
    this.btnManageSquad = document.getElementById('btnManageSquad');
    this.btnLoadDemo = document.getElementById('btnLoadDemo');
    this.squadRosterContainer = document.getElementById('squadRosterContainer');

    // Target Selection
    this.targetSearchInput = document.getElementById('targetSearchInput');
    this.categoryChips = document.querySelectorAll('.cat-chip');
    this.targetActiveCard = document.getElementById('targetActiveCard');
    this.targetDropdownList = document.getElementById('targetDropdownList');

    // Planner Banner
    this.valRadsharesReady = document.getElementById('valRadsharesReady');
    this.valTotalTraces = document.getElementById('valTotalTraces');
    this.valDropOdds = document.getElementById('valDropOdds');
    this.memberTracesContainer = document.getElementById('memberTracesContainer');

    // Relic Matrix
    this.relicMatrixContainer = document.getElementById('relicMatrixContainer');

    // Modals
    this.squadModal = document.getElementById('squadModal');
    this.btnCloseSquadModal = document.getElementById('btnCloseSquadModal');
    this.formAddMember = document.getElementById('formAddMember');
    this.inputMemberName = document.getElementById('inputMemberName');
    this.inputMemberToken = document.getElementById('inputMemberToken');
    this.squadMemberListManage = document.getElementById('squadMemberListManage');

    // Toasts
    this.toastContainer = document.getElementById('toastContainer');
  }

  attachEventListeners() {
    // Squad sync
    this.btnSyncSquad.addEventListener('click', () => this.handleSyncSquad());
    this.btnManageSquad.addEventListener('click', () => this.openSquadModal());
    this.btnCloseSquadModal.addEventListener('click', () => this.closeSquadModal());
    if (this.btnLoadDemo) {
      this.btnLoadDemo.addEventListener('click', () => this.handleLoadDemoSquad());
    }

    // Modal background click
    this.squadModal.addEventListener('click', (e) => {
      if (e.target === this.squadModal) this.closeSquadModal();
    });

    // Form add member
    this.formAddMember.addEventListener('submit', (e) => this.handleAddMember(e));

    // Search and Category Filters
    this.targetSearchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.renderTargetDropdown();
    });

    this.categoryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.categoryChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentCategory = chip.dataset.category;
        this.renderTargetDropdown();
      });
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!this.targetSearchInput.contains(e.target) && !this.targetDropdownList.contains(e.target)) {
        this.targetDropdownList.style.display = 'none';
      }
    });

    this.targetSearchInput.addEventListener('focus', () => {
      this.renderTargetDropdown();
    });
  }

  async start() {
    const members = this.squadManager.getMembers();
    if (members.length === 0) {
      // Auto-seed demo squad if brand new session for immediate out-of-the-box delight
      await this.squadManager.seedDemoSquad();
      this.showToast('Initialized demo fireteam. Click "Manage Squad" to add real AlecaFrame tokens.', 'info');
    }

    await this.refreshSquadData();
    this.render();
  }

  async refreshSquadData() {
    this.squadInventories = await this.squadManager.getSquadInventories();
  }

  async handleSyncSquad() {
    this.btnSyncSquad.classList.add('loading');
    const icon = this.btnSyncSquad.querySelector('svg');
    if (icon) icon.classList.add('animate-spin');

    try {
      this.showToast('Synchronizing squad relic inventories from AlecaFrame...', 'info');
      await this.squadManager.syncAllMembers();
      await this.refreshSquadData();
      this.render();
      this.showToast('Squad inventories updated successfully!', 'success');
    } catch (err) {
      this.showToast(`Squad sync error: ${err.message}`, 'error');
    } finally {
      this.btnSyncSquad.classList.remove('loading');
      if (icon) icon.classList.remove('animate-spin');
    }
  }

  async handleLoadDemoSquad() {
    this.showToast('Loading 4-player demo squad...', 'info');
    await this.squadManager.seedDemoSquad();
    await this.refreshSquadData();
    this.render();
    this.renderSquadModalManageList();
    this.showToast('Demo squad populated with sample relic stock!', 'success');
  }

  async handleAddMember(e) {
    e.preventDefault();
    const name = this.inputMemberName.value.trim();
    const token = this.inputMemberToken.value.trim();

    if (!token) {
      this.showToast('Please provide an AlecaFrame Public Token', 'error');
      return;
    }

    this.showToast(`Adding ${name || 'member'} and importing relics...`, 'info');
    try {
      await this.squadManager.addMember(name, token);
      await this.refreshSquadData();
      this.inputMemberName.value = '';
      this.inputMemberToken.value = '';
      this.render();
      this.renderSquadModalManageList();
      this.showToast(`Successfully added ${name}!`, 'success');
    } catch (err) {
      this.showToast(`Failed to add member: ${err.message}`, 'error');
    }
  }

  async handleRemoveMember(memberId) {
    await this.squadManager.removeMember(memberId);
    await this.refreshSquadData();
    this.render();
    this.renderSquadModalManageList();
    this.showToast('Member removed from fireteam.', 'info');
  }

  openSquadModal() {
    this.renderSquadModalManageList();
    this.squadModal.classList.add('open');
  }

  closeSquadModal() {
    this.squadModal.classList.remove('open');
  }

  setTarget(targetName) {
    this.activeTargetName = targetName;
    saveStoredActiveTarget(targetName);
    this.targetSearchInput.value = '';
    this.searchQuery = '';
    this.targetDropdownList.style.display = 'none';
    this.render();
  }

  // -------------------------------------------------------------
  // Rendering Methods
  // -------------------------------------------------------------

  render() {
    this.renderSquadRoster();
    this.renderActiveTargetCard();
    this.renderRelicMatrixAndPlanner();
  }

  renderSquadRoster() {
    const members = this.squadManager.getMembers();
    this.squadRosterContainer.innerHTML = '';

    if (members.length === 0) {
      this.squadRosterContainer.innerHTML = `
        <div class="squad-empty-state">
          <span>No squad members active. Click "Manage Squad" to add public tokens.</span>
        </div>
      `;
      return;
    }

    members.forEach(m => {
      const card = document.createElement('div');
      card.className = 'squad-member-card';
      card.style.setProperty('--member-color', m.color.hex);

      const initial = m.name.charAt(0).toUpperCase();
      const statusClass = m.syncStatus === 'synced' ? 'synced' : (m.syncStatus === 'syncing' ? 'syncing' : 'error');

      card.innerHTML = `
        <div class="squad-member-avatar" style="border-color: ${m.color.hex}; color: ${m.color.hex};">
          ${initial}
        </div>
        <div class="squad-member-info">
          <div class="squad-member-name">
            ${m.name}
            ${m.isMock ? '<span style="font-size: 0.65rem; color: var(--gold-primary); font-weight: 700;">[DEMO]</span>' : ''}
          </div>
          <div class="squad-member-sub">
            <span class="status-dot ${statusClass}"></span>
            <span>${m.totalRelics || 0} Relics</span>
          </div>
        </div>
      `;
      this.squadRosterContainer.appendChild(card);
    });
  }

  renderActiveTargetCard() {
    const target = PRIME_RELIC_MAP.find(t => t.name === this.activeTargetName) || PRIME_RELIC_MAP[0];
    this.activeTargetName = target.name;

    const vaultClass = target.vaulted ? 'vaulted' : 'unvaulted';
    const vaultText = target.vaulted ? 'Vaulted' : 'Active Drop';

    this.targetActiveCard.innerHTML = `
      <div class="target-category-badge">${target.category} Prime Target</div>
      <div class="target-name">${target.name}</div>
      <div class="target-meta-row">
        <span class="vault-badge ${vaultClass}">${vaultText}</span>
        <span style="font-size: 0.8rem; color: var(--text-faint);">${target.components.length} Components to Craft</span>
      </div>
    `;
  }

  renderTargetDropdown() {
    const filtered = PRIME_RELIC_MAP.filter(item => {
      const matchesCategory = this.currentCategory === 'All' || item.category === this.currentCategory;
      const matchesSearch = !this.searchQuery || item.name.toLowerCase().includes(this.searchQuery);
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      this.targetDropdownList.innerHTML = `<div style="padding: 1rem; color: var(--text-faint);">No prime targets found.</div>`;
      this.targetDropdownList.style.display = 'block';
      return;
    }

    this.targetDropdownList.innerHTML = '';
    filtered.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'dropdown-item';
      itemEl.style.padding = '0.75rem 1rem';
      itemEl.style.cursor = 'pointer';
      itemEl.style.display = 'flex';
      itemEl.style.justifyContent = 'space-between';
      itemEl.style.alignItems = 'center';
      itemEl.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';

      itemEl.innerHTML = `
        <div>
          <span style="font-weight: 600; color: #fff;">${item.name}</span>
          <span style="font-size: 0.75rem; color: var(--text-faint); margin-left: 0.5rem;">${item.category}</span>
        </div>
        <span class="vault-badge ${item.vaulted ? 'vaulted' : 'unvaulted'}" style="font-size: 0.7rem;">
          ${item.vaulted ? 'Vaulted' : 'Active'}
        </span>
      `;

      itemEl.addEventListener('mouseenter', () => itemEl.style.background = 'rgba(245, 158, 11, 0.1)');
      itemEl.addEventListener('mouseleave', () => itemEl.style.background = 'transparent');
      itemEl.addEventListener('click', () => this.setTarget(item.name));

      this.targetDropdownList.appendChild(itemEl);
    });

    this.targetDropdownList.style.display = 'block';
  }

  renderRelicMatrixAndPlanner() {
    const target = PRIME_RELIC_MAP.find(t => t.name === this.activeTargetName) || PRIME_RELIC_MAP[0];
    const members = this.squadManager.getMembers();

    this.relicMatrixContainer.innerHTML = '';

    let grandTotalRadshares = 0;
    let grandTotalTraces = 0;
    const aggregatedMemberTraces = {};
    members.forEach(m => aggregatedMemberTraces[m.id] = 0);

    const componentStatsList = [];

    // Evaluate each component
    target.components.forEach(comp => {
      const stats = evaluateComponentSquadStock(comp, members, this.squadInventories);
      componentStatsList.push({ comp, stats });

      grandTotalRadshares += stats.immediateFullRadshares;
      grandTotalTraces += stats.totalSquadTracesNeeded;

      Object.entries(stats.memberTraceRequirements).forEach(([id, traces]) => {
        aggregatedMemberTraces[id] = (aggregatedMemberTraces[id] || 0) + traces;
      });

      // Build component card DOM
      const card = document.createElement('div');
      card.className = 'glass-panel component-card';

      const oddsPercent = (stats.currentOdds * 100).toFixed(1);
      const potentialPercent = (stats.potentialOdds * 100).toFixed(1);

      // Component Header
      let memberHeaderCols = '';
      members.forEach(m => {
        memberHeaderCols += `<th style="color: ${m.color.hex}; border-left: 1px solid var(--border-glass);">${m.name}</th>`;
      });

      let tableRows = '';
      stats.relicRows.forEach(row => {
        let memberCells = '';
        members.forEach(m => {
          const s = row.members[m.id] || { intact: 0, exceptional: 0, flawless: 0, radiant: 0, total: 0 };
          memberCells += `
            <td style="border-left: 1px solid rgba(255, 255, 255, 0.03);">
              <div class="stock-chips-group">
                ${s.radiant > 0 ? `<span class="stock-chip radiant" title="Radiant">✦ ${s.radiant}</span>` : ''}
                ${s.flawless > 0 ? `<span class="stock-chip flawless" title="Flawless">▲ ${s.flawless}</span>` : ''}
                ${s.exceptional > 0 ? `<span class="stock-chip exceptional" title="Exceptional">◆ ${s.exceptional}</span>` : ''}
                ${s.intact > 0 ? `<span class="stock-chip intact" title="Intact">○ ${s.intact}</span>` : ''}
                ${s.total === 0 ? `<span class="stock-chip zero">-</span>` : ''}
              </div>
            </td>
          `;
        });

        tableRows += `
          <tr>
            <td>
              <div class="relic-tag">
                <span class="era-pill era-${row.era}">${row.era}</span>
                <span>${row.code}</span>
              </div>
            </td>
            <td>
              <span class="rarity-pill rarity-${row.rarity}">${row.rarity}</span>
            </td>
            <td>
              <span class="vault-badge ${row.vaulted ? 'vaulted' : 'unvaulted'}" style="font-size: 0.7rem;">
                ${row.vaulted ? 'Vaulted' : 'Active'}
              </span>
            </td>
            ${memberCells}
            <td style="font-weight: 700; color: #fff;">${row.totalCount}</td>
            <td style="color: var(--cyan-primary); font-weight: 600;">
              ${row.tracesToRadiantAll > 0 ? `${row.tracesToRadiantAll} Traces` : '<span style="color: var(--emerald-prime);">All Radiant</span>'}
            </td>
          </tr>
        `;
      });

      card.innerHTML = `
        <div class="component-header">
          <div class="comp-title-group">
            <div class="comp-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <div class="comp-name">${comp.name}</div>
              <span class="comp-count-pill">${comp.count} Required</span>
            </div>
          </div>
          <div class="comp-odds-badge">
            <span style="color: var(--text-faint);">Current Squad Odds:</span>
            <span class="odds-number">${oddsPercent}%</span>
            <span style="color: var(--text-faint); margin-left: 0.5rem;">(Max Radiant: <span style="color: var(--gold-primary); font-weight: 700;">${potentialPercent}%</span>)</span>
          </div>
        </div>
        <div class="table-responsive">
          <table class="relic-matrix-table">
            <thead>
              <tr>
                <th>Relic</th>
                <th>Rarity</th>
                <th>Status</th>
                ${memberHeaderCols}
                <th>Squad Total</th>
                <th>Trace Cost</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      `;

      this.relicMatrixContainer.appendChild(card);
    });

    // Update Banner Metrics
    this.valRadsharesReady.textContent = grandTotalRadshares;
    this.valTotalTraces.textContent = grandTotalTraces.toLocaleString();

    // Cumulative item drop odds (all components together)
    // Probability of securing all components:
    const allComponentsSuccessRate = componentStatsList.reduce((acc, curr) => acc * curr.stats.currentOdds, 1);
    this.valDropOdds.textContent = `${(allComponentsSuccessRate * 100).toFixed(0)}%`;

    // Render Per-Member Trace Bills
    this.memberTracesContainer.innerHTML = '';
    members.forEach(m => {
      const bill = aggregatedMemberTraces[m.id] || 0;
      const tag = document.createElement('div');
      tag.className = 'member-trace-tag';
      tag.style.setProperty('--member-color', m.color.hex);
      tag.innerHTML = `<span style="color: ${m.color.hex};">${m.name}:</span> <strong>${bill.toLocaleString()}</strong> traces`;
      this.memberTracesContainer.appendChild(tag);
    });
  }

  renderSquadModalManageList() {
    const members = this.squadManager.getMembers();
    this.squadMemberListManage.innerHTML = '';

    if (members.length === 0) {
      this.squadMemberListManage.innerHTML = `<div style="color: var(--text-faint);">No squad members added yet.</div>`;
      return;
    }

    members.forEach(m => {
      const item = document.createElement('div');
      item.className = 'member-manage-item';
      item.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: ${m.color.hex};"></div>
          <div>
            <div style="font-weight: 600; color: #fff;">${m.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-faint); font-family: monospace;">
              Token: ${m.token.slice(0, 10)}... | ${m.totalRelics || 0} relics
            </div>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" style="color: var(--crimson-alert); border-color: rgba(239, 68, 68, 0.3);">
          Remove
        </button>
      `;

      item.querySelector('button').addEventListener('click', () => this.handleRemoveMember(m.id));
      this.squadMemberListManage.appendChild(item);
    });
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span style="flex: 1;">${message}</span>
    `;

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => toast.remove(), 200);
    }, 4000);
  }
}

// Bootstrap application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new WarframeSquadApp();
  app.start();
});
