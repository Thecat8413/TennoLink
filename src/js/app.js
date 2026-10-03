/**
 * Warframe Squad Relic Sync Engine - Main Application Controller
 * Features:
 * - Comprehensive Prime Source of Truth Catalog with live warframestat.us fallback
 * - Real-time Warframe.Market Platinum Pricing for sets and individual parts
 * - Canonical Relic Farming Nodes (Hepit, Apollo, Ukko, etc.) and Vault Status
 * - Cross-Fireteam Relic Stock Matrix & Radiant Trace Deficit Optimizer
 * - Stacking-Safe Floating Search Dropdown
 */

import { PrimeRepository } from './primeRepository.js';
import { WarframeMarketClient } from './marketClient.js';
import { getRelicAcquisitionInfo } from '../data/relicFarmingNodes.js';
import { SquadManager } from './squadManager.js';
import { evaluateComponentSquadStock } from './probability.js';
import { getStoredActiveTarget, saveStoredActiveTarget, getStoredActiveRoom, saveStoredActiveRoom } from './storage.js';
import { AuthManager } from './authManager.js';
import { MasteryController } from './masteryController.js';

class WarframeSquadApp {
  constructor() {
    this.primeRepo = new PrimeRepository();
    this.marketClient = new WarframeMarketClient();
    this.squadManager = new SquadManager();
    this.authManager = new AuthManager();

    this.activeTargetName = getStoredActiveTarget();
    this.currentCategory = 'All';
    this.searchQuery = '';
    this.squadInventories = {};
    this.marketData = null;
    this.isMarketLoading = false;
    this.currentView = 'relic'; // 'relic' | 'mastery'
    this.activeRoom = getStoredActiveRoom();

    this.initElements();
    this.masteryController = new MasteryController({
      container: this.masteryAssistantView,
      marketClient: this.marketClient,
      onPursueTarget: (targetName) => this.handlePursueFromMastery(targetName)
    });

    if (this.labelCurrentRoom) {
      this.labelCurrentRoom.textContent = this.activeRoom;
    }

    this.attachEventListeners();
  }

  initElements() {
    // View Switching Tabs & Views
    this.tabRelicEngine = document.getElementById('tabRelicEngine');
    this.tabMasteryAssistant = document.getElementById('tabMasteryAssistant');
    this.relicEngineView = document.getElementById('relicEngineView');
    this.masteryAssistantView = document.getElementById('masteryAssistantView');

    // Top Bar & Navigation Actions
    this.btnSyncSquad = document.getElementById('btnSyncSquad');
    this.btnManageSquad = document.getElementById('btnManageSquad');
    this.squadRosterContainer = document.getElementById('squadRosterContainer');
    this.userProfileArea = document.getElementById('userProfileArea');

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

    // Settings Modal
    this.btnManageSettings = document.getElementById('btnManageSettings');
    this.settingsModal = document.getElementById('settingsModal');
    this.btnCloseSettingsModal = document.getElementById('btnCloseSettingsModal');

    // Squad Modal & Room PIN
    this.squadModal = document.getElementById('squadModal');
    this.btnCloseSquadModal = document.getElementById('btnCloseSquadModal');
    this.formAddMember = document.getElementById('formAddMember');
    this.inputMemberName = document.getElementById('inputMemberName');
    this.inputMemberToken = document.getElementById('inputMemberToken');
    this.squadMemberListManage = document.getElementById('squadMemberListManage');
    this.labelCurrentRoom = document.getElementById('labelCurrentRoom');
    this.inputRoomCode = document.getElementById('inputRoomCode');
    this.inputRoomPin = document.getElementById('inputRoomPin');
    this.btnUpdateRoom = document.getElementById('btnUpdateRoom');

    // Auth Modal
    this.authModal = document.getElementById('authModal');
    this.btnCloseAuthModal = document.getElementById('btnCloseAuthModal');
    this.formAuthLogin = document.getElementById('formAuthLogin');
    this.inputAuthPlayerName = document.getElementById('inputAuthPlayerName');
    this.inputAuthPin = document.getElementById('inputAuthPin');

    // Companion Desktop Assistant Modal
    this.btnDownloadCompanion = document.getElementById('btnDownloadCompanion');
    this.companionModal = document.getElementById('companionModal');
    this.btnCloseCompanionModal = document.getElementById('btnCloseCompanionModal');
    this.btnCloseCompanionModalFooter = document.getElementById('btnCloseCompanionModalFooter');
    this.btnDownloadConfigJson = document.getElementById('btnDownloadConfigJson');
    this.companionConfigPreview = document.getElementById('companionConfigPreview');
    this.companionWebDropzone = document.getElementById('companionWebDropzone');
    this.inputWebDropzoneFile = document.getElementById('inputWebDropzoneFile');

    // Squad Modal Direct Upload
    this.btnCloseSquadModalFooter = document.getElementById('btnCloseSquadModalFooter');
    this.inputSquadUploadPlayer = document.getElementById('inputSquadUploadPlayer');
    this.inputSquadFileDrop = document.getElementById('inputSquadFileDrop');
    this.btnTriggerSquadUpload = document.getElementById('btnTriggerSquadUpload');

    // Toasts
    this.toastContainer = document.getElementById('toastContainer');
  }

  attachEventListeners() {
    // View switcher tabs
    if (this.tabRelicEngine) {
      this.tabRelicEngine.addEventListener('click', () => this.switchView('relic'));
    }
    if (this.tabMasteryAssistant) {
      this.tabMasteryAssistant.addEventListener('click', () => this.switchView('mastery'));
    }

    // Squad actions
    this.btnSyncSquad.addEventListener('click', () => this.handleSyncSquad());
    this.btnManageSquad.addEventListener('click', () => this.openSquadModal());
    this.btnCloseSquadModal.addEventListener('click', () => this.closeSquadModal());

    // Settings actions
    if (this.btnManageSettings) {
      this.btnManageSettings.addEventListener('click', () => this.openSettingsModal());
    }
    if (this.btnCloseSettingsModal) {
      this.btnCloseSettingsModal.addEventListener('click', () => this.closeSettingsModal());
    }
    if (this.settingsModal) {
      this.settingsModal.addEventListener('click', (e) => {
        if (e.target === this.settingsModal) this.closeSettingsModal();
      });
    }

    // Room update
    if (this.btnUpdateRoom) {
      this.btnUpdateRoom.addEventListener('click', () => this.handleUpdateRoom());
    }

    // Auth modal events
    if (this.btnCloseAuthModal) {
      this.btnCloseAuthModal.addEventListener('click', () => this.closeAuthModal());
    }
    if (this.formAuthLogin) {
      this.formAuthLogin.addEventListener('submit', (e) => this.handleAuthSubmit(e));
    }
    if (this.authModal) {
      this.authModal.addEventListener('click', (e) => {
        if (e.target === this.authModal) this.closeAuthModal();
      });
    }

    // Modal background click
    this.squadModal.addEventListener('click', (e) => {
      if (e.target === this.squadModal) this.closeSquadModal();
    });

    // Companion desktop assistant modal events
    if (this.btnDownloadCompanion) {
      this.btnDownloadCompanion.addEventListener('click', () => this.openCompanionModal());
    }
    if (this.btnCloseCompanionModal) {
      this.btnCloseCompanionModal.addEventListener('click', () => this.closeCompanionModal());
    }
    if (this.btnCloseCompanionModalFooter) {
      this.btnCloseCompanionModalFooter.addEventListener('click', () => this.closeCompanionModal());
    }
    if (this.companionModal) {
      this.companionModal.addEventListener('click', (e) => {
        if (e.target === this.companionModal) this.closeCompanionModal();
      });
    }
    if (this.btnDownloadConfigJson) {
      this.btnDownloadConfigJson.addEventListener('click', () => this.handleDownloadConfigJson());
    }

    if (this.btnCloseSquadModalFooter) {
      this.btnCloseSquadModalFooter.addEventListener('click', () => this.closeSquadModal());
    }

    // Direct Web Dropzone Upload
    if (this.companionWebDropzone && this.inputWebDropzoneFile) {
      this.companionWebDropzone.addEventListener('click', () => this.inputWebDropzoneFile.click());
      this.companionWebDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.companionWebDropzone.classList.add('dragover');
      });
      this.companionWebDropzone.addEventListener('dragleave', () => {
        this.companionWebDropzone.classList.remove('dragover');
      });
      this.companionWebDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        this.companionWebDropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          const activePlayer = this.authManager.getCurrentPlayer() || 'Tenno';
          this.handleDirectInventoryUpload(e.dataTransfer.files[0], activePlayer);
        }
      });
      this.inputWebDropzoneFile.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          const activePlayer = this.authManager.getCurrentPlayer() || 'Tenno';
          this.handleDirectInventoryUpload(e.target.files[0], activePlayer);
        }
      });
    }

    // Direct Squad Modal Upload
    if (this.btnTriggerSquadUpload && this.inputSquadFileDrop) {
      this.btnTriggerSquadUpload.addEventListener('click', () => this.inputSquadFileDrop.click());
      this.inputSquadFileDrop.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          const targetPlayer = (this.inputSquadUploadPlayer && this.inputSquadUploadPlayer.value.trim()) || 'SquadMate';
          this.handleDirectInventoryUpload(e.target.files[0], targetPlayer);
        }
      });
    }

    // Form add member
    this.formAddMember.addEventListener('submit', (e) => this.handleAddMember(e));

    // Search and Category Filters
    this.targetSearchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.renderTargetDropdown();
    });

    this.targetSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.targetDropdownList.style.display = 'none';
      }
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
    // 1. Check for URL auto-login from tray companion (#player=...&token=...)
    const autoSession = await this.authManager.checkUrlAutoLogin();
    if (autoSession) {
      this.showToast(`Auto-authenticated as ${autoSession.playerName} via companion tray!`, 'success');
    }

    // 2. Active player setup
    const activePlayer = this.authManager.getCurrentPlayer() || 'Tenno';
    this.updateUserProfileNav();
    await this.masteryController.loadPlayer(activePlayer);

    // 3. Squad initialization
    await this.refreshSquadData();
    this.render();

    // Fetch initial market data for the active target
    this.fetchMarketPricing();
  }

  async refreshSquadData() {
    this.squadInventories = await this.squadManager.getSquadInventories();
  }

  async fetchMarketPricing() {
    const target = this.primeRepo.getByName(this.activeTargetName);
    if (!target) return;

    this.isMarketLoading = true;
    this.renderActiveTargetCard();

    try {
      this.marketData = await this.marketClient.getFullTargetMarketData(target);
    } catch (e) {
      console.warn('Market fetch error:', e);
    } finally {
      this.isMarketLoading = false;
      this.renderActiveTargetCard();
      this.renderRelicMatrixAndPlanner();
    }
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

  openSettingsModal() {
    if (this.settingsModal) this.settingsModal.classList.add('open');
  }

  closeSettingsModal() {
    if (this.settingsModal) this.settingsModal.classList.remove('open');
  }

  openSquadModal() {
    this.renderSquadModalManageList();
    this.squadModal.classList.add('open');
  }

  closeSquadModal() {
    this.squadModal.classList.remove('open');
  }

  openCompanionModal() {
    const activePlayer = this.authManager.getCurrentPlayer() || 'Tenno';
    const roomCode = this.activeRoom || 'OROKIN-7741';
    const serverUrl = window.location.origin;

    const sampleConfig = {
      serverUrl: serverUrl,
      playerName: activePlayer,
      roomCode: roomCode
    };

    if (this.companionConfigPreview) {
      this.companionConfigPreview.textContent = JSON.stringify(sampleConfig, null, 2);
    }
    if (this.companionModal) {
      this.companionModal.classList.add('open');
    }
  }

  closeCompanionModal() {
    if (this.companionModal) {
      this.companionModal.classList.remove('open');
    }
  }

  handleDownloadConfigJson() {
    const activePlayer = this.authManager.getCurrentPlayer() || 'Tenno';
    const roomCode = this.activeRoom || 'OROKIN-7741';
    const serverUrl = window.location.origin;

    const config = {
      serverUrl: serverUrl,
      playerName: activePlayer,
      roomCode: roomCode
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast('Downloaded config.json! Drop it next to TennoRelicSync.exe.', 'success');
  }

  /**
   * Handle direct file uploads (.dat or .json) with zero-install, zero-download web processing
   * @param {File} file
   * @param {string} playerName
   */
  async handleDirectInventoryUpload(file, playerName) {
    if (!file) return;

    const targetPlayer = (playerName || this.authPlayerName || 'Tenno').trim();
    this.showToast(`Processing ${file.name} for ${targetPlayer}...`, 'info');

    try {
      const buffer = await file.arrayBuffer();
      const currentRoom = this.activeRoom || 'OROKIN-7741';

      const endpoint = `/api/upload/dat?player=${encodeURIComponent(targetPlayer)}&room=${encodeURIComponent(currentRoom)}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: buffer,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      const result = await response.json();
      if (!result.ok) {
        throw new Error(result.error || 'Failed to process inventory data');
      }

      // 1. Update squad manager with decrypted/sanitized relics
      if (result.relics && Array.isArray(result.relics)) {
        await this.squadManager.importRelicsForMember(targetPlayer, result.relics);
      }

      // 2. If uploaded for active authenticated player, update mastery controller
      if (this.masteryController && (!this.authPlayerName || targetPlayer.toLowerCase() === this.authPlayerName.toLowerCase())) {
        this.masteryController.integrateInventory(result.components || [], result.mastery || []);
      }

      // 3. Refresh squad data and table matrix
      await this.refreshSquadData();
      this.render();
      if (this.squadModal && this.squadModal.classList.contains('open')) {
        this.renderSquadModalManageList();
      }

      this.showToast(
        `✦ Synced ${result.relicCount || 0} relics & ${result.masteryCount || 0} mastery records for ${targetPlayer}!`,
        'success'
      );
    } catch (err) {
      console.error('Direct file upload error:', err);
      this.showToast(`Sync failed: ${err.message}`, 'error');
    }
  }

  setTarget(targetName) {
    this.activeTargetName = targetName;
    saveStoredActiveTarget(targetName);
    this.targetSearchInput.value = '';
    this.searchQuery = '';
    this.targetDropdownList.style.display = 'none';
    this.marketData = null;
    this.render();
    this.fetchMarketPricing();
  }

  switchView(viewName) {
    this.currentView = viewName;
    if (viewName === 'mastery') {
      if (this.tabRelicEngine) this.tabRelicEngine.classList.remove('active');
      if (this.tabMasteryAssistant) this.tabMasteryAssistant.classList.add('active');
      if (this.relicEngineView) this.relicEngineView.style.display = 'none';
      if (this.masteryAssistantView) {
        this.masteryAssistantView.style.display = 'flex';
        this.masteryController.render();
      }
    } else {
      if (this.tabMasteryAssistant) this.tabMasteryAssistant.classList.remove('active');
      if (this.tabRelicEngine) this.tabRelicEngine.classList.add('active');
      if (this.masteryAssistantView) this.masteryAssistantView.style.display = 'none';
      if (this.relicEngineView) {
        this.relicEngineView.style.display = 'block';
        this.render();
      }
    }
  }

  handlePursueFromMastery(targetName) {
    this.switchView('relic');
    this.setTarget(targetName);
    this.showToast(`✦ Pursuing ${targetName}! Squad relic stock & radiant trace plan updated.`, 'success');
  }

  openAuthModal() {
    const current = this.authManager.getCurrentPlayer() || '';
    if (this.inputAuthPlayerName) this.inputAuthPlayerName.value = current;
    if (this.inputAuthPin) this.inputAuthPin.value = '';
    if (this.authModal) this.authModal.classList.add('open');
  }

  closeAuthModal() {
    if (this.authModal) this.authModal.classList.remove('open');
  }

  async handleAuthSubmit(e) {
    e.preventDefault();
    const playerName = this.inputAuthPlayerName.value.trim();
    const pin = this.inputAuthPin.value.trim();

    if (!playerName || !pin) {
      this.showToast('Please enter both your Gamertag and 4-digit PIN.', 'error');
      return;
    }

    const res = await this.authManager.login(playerName, pin);
    if (!res.ok) {
      this.showToast(res.error || 'Authentication failed', 'error');
      return;
    }

    this.closeAuthModal();
    this.updateUserProfileNav();
    await this.masteryController.loadPlayer(playerName);
    this.showToast(`Sanctum unlocked for ${playerName}!`, 'success');
  }

  handleLogout() {
    const prev = this.authManager.getCurrentPlayer();
    this.authManager.logout();
    this.updateUserProfileNav();
    this.masteryController.loadPlayer('Tenno');
    this.showToast(`Tenno ${prev} signed out.`, 'info');
  }

  updateUserProfileNav() {
    if (!this.userProfileArea) return;
    const player = this.authManager.getCurrentPlayer();

    if (player) {
      const metrics = this.masteryController.calculateMasteryMetrics();
      this.userProfileArea.innerHTML = `
        <div class="user-profile-badge" title="Click to view Mastery Dossier">
          <div class="user-avatar-gold">✦</div>
          <div class="user-meta">
            <span class="user-gamertag">${player}</span>
            <span class="user-mr-badge">MR ${metrics.rank}</span>
          </div>
          <button id="btnLogout" class="btn-icon-subtle" title="Sign Out of Tenno Sanctum">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      `;

      const badge = this.userProfileArea.querySelector('.user-profile-badge');
      if (badge) {
        badge.addEventListener('click', (e) => {
          if (e.target.closest('#btnLogout')) return;
          this.switchView('mastery');
        });
      }

      const btnLogout = this.userProfileArea.querySelector('#btnLogout');
      if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
          e.stopPropagation();
          this.handleLogout();
        });
      }
    } else {
      this.userProfileArea.innerHTML = `
        <button id="btnOpenAuthModal" class="btn btn-secondary btn-sm" title="Sign in with Gamertag and 4-digit PIN">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Sign In (PIN)
        </button>
      `;

      const btnOpen = this.userProfileArea.querySelector('#btnOpenAuthModal');
      if (btnOpen) {
        btnOpen.addEventListener('click', () => this.openAuthModal());
      }
    }
  }

  handleUpdateRoom() {
    const code = this.inputRoomCode?.value.trim().toUpperCase() || 'OROKIN-7741';
    const pin = this.inputRoomPin?.value.trim() || '';

    if (pin && (pin.length !== 4 || !/^\d{4}$/.test(pin))) {
      this.showToast('Room PIN must be 4 digits', 'error');
      return;
    }

    if (this.labelCurrentRoom) this.labelCurrentRoom.textContent = code;
    this.authManager.saveRoomPin(code, pin);
    this.showToast(`Active room set to ${code}${pin ? ' (Protected with 4-Digit PIN)' : ''}`, 'success');
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
    const target = this.primeRepo.getByName(this.activeTargetName);
    if (!target) return;

    this.activeTargetName = target.name;
    const vaultClass = target.vaulted ? 'vaulted' : 'unvaulted';
    const vaultText = target.vaulted ? 'Vaulted' : 'Active Drop';

    const setPrice = this.marketData?.setSummary?.lowestPrice;
    const topSeller = this.marketData?.setSummary?.topSeller;

    this.targetActiveCard.innerHTML = `
      <div class="target-category-badge">${target.category} Prime Target</div>
      <div class="target-name">${target.name}</div>
      <div class="target-meta-row">
        <span class="vault-badge ${vaultClass}">${vaultText}</span>
        <span style="font-size: 0.8rem; color: var(--text-faint);">${target.components.length} Components</span>
        
        <!-- Live Market Price Tag -->
        ${this.isMarketLoading ? `
          <span class="market-badge" style="opacity: 0.7;">
            <svg class="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
            Fetching Market...
          </span>
        ` : (setPrice ? `
          <span class="market-badge gold" title="Lowest In-Game Sell Order on Warframe.Market">
            <span class="plat-symbol">✦</span> Full Set: ${setPrice}p
            ${topSeller ? `<span style="font-size: 0.7rem; color: var(--text-muted); font-weight: normal;">(via ${topSeller})</span>` : ''}
          </span>
        ` : '')}
      </div>
    `;
  }

  renderTargetDropdown() {
    const results = this.primeRepo.search(this.searchQuery, this.currentCategory);

    if (results.length === 0) {
      this.targetDropdownList.innerHTML = `
        <div style="padding: 1.25rem; text-align: center; color: var(--text-faint);">
          <div>No prime targets found locally for "${this.searchQuery}".</div>
          <button id="btnSearchLiveFallback" class="btn btn-cyan btn-sm" style="margin-top: 0.75rem;">
            Search WarframeStat.us Live
          </button>
        </div>
      `;

      const btnLive = this.targetDropdownList.querySelector('#btnSearchLiveFallback');
      if (btnLive) {
        btnLive.addEventListener('click', async () => {
          btnLive.textContent = 'Searching live...';
          const found = await this.primeRepo.fetchLiveFallback(this.searchQuery);
          if (found) {
            this.setTarget(found.name);
            this.showToast(`Imported ${found.name} from live Warframe database!`, 'success');
          } else {
            this.showToast(`No live Prime item found matching "${this.searchQuery}".`, 'error');
          }
        });
      }

      this.targetDropdownList.style.display = 'block';
      return;
    }

    this.targetDropdownList.innerHTML = '';
    // Show top 30 matching items
    results.slice(0, 30).forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'dropdown-item';

      itemEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.65rem;">
          <span style="font-weight: 700; color: #fff;">${item.name}</span>
          <span style="font-size: 0.75rem; color: var(--text-faint); padding: 0.1rem 0.4rem; background: rgba(255,255,255,0.06); border-radius: 4px;">${item.category}</span>
        </div>
        <span class="vault-badge ${item.vaulted ? 'vaulted' : 'unvaulted'}" style="font-size: 0.7rem;">
          ${item.vaulted ? 'Vaulted' : 'Active'}
        </span>
      `;

      itemEl.addEventListener('click', () => this.setTarget(item.name));
      this.targetDropdownList.appendChild(itemEl);
    });

    this.targetDropdownList.style.display = 'block';
  }

  renderRelicMatrixAndPlanner() {
    const target = this.primeRepo.getByName(this.activeTargetName);
    if (!target) return;

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

      // Get individual component market price
      const compMarket = this.marketData?.componentSummaries?.[comp.name];

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

        const acqInfo = getRelicAcquisitionInfo(row.era, row.vaulted);

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
              <div class="farm-source-badge" title="${acqInfo.advice}">
                <span class="vault-badge ${acqInfo.badgeClass}" style="font-size: 0.68rem; margin-bottom: 0.15rem; width: fit-content;">
                  ${acqInfo.status}
                </span>
                <span class="farm-source-name" style="font-size: 0.72rem;">${acqInfo.location}</span>
              </div>
            </td>
            ${memberCells}
            <td style="font-weight: 700; color: #fff;">${row.totalCount}</td>
            <td style="color: var(--gold-primary); font-weight: 600;">
              ${row.tracesToRadiantAll > 0 ? `${row.tracesToRadiantAll} Traces` : '<span style="color: var(--jade-prime);">All Radiant</span>'}
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

          <div class="comp-meta-actions">
            <!-- Individual Component Market Price Tag -->
            ${compMarket?.lowestPrice ? `
              <span class="market-badge" title="Lowest In-Game Sell Order for this part on Warframe.Market">
                <span class="plat-symbol">✦</span> Part: ${compMarket.lowestPrice}p
              </span>
            ` : ''}

            <div class="comp-odds-badge">
              <span style="color: var(--text-faint);">Current Squad Odds:</span>
              <span class="odds-number">${oddsPercent}%</span>
              <span style="color: var(--text-faint); margin-left: 0.5rem;">(Max Radiant: <span style="color: var(--gold-primary); font-weight: 700;">${potentialPercent}%</span>)</span>
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <table class="relic-matrix-table">
            <thead>
              <tr>
                <th>Relic</th>
                <th>Rarity</th>
                <th>Acquisition / Source</th>
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
