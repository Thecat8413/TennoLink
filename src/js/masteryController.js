/**
 * Mastery Assistant & Target Pursuer Controller
 * Vitruvian Orokin aesthetic, personal MR telemetry, crafting readiness scanner,
 * and 1-click pursuit linking to the Fireteam Relic Engine.
 */

import { ALL_PRIMES_CATALOG } from '../data/allPrimes.js';

// Canonical Warframe MR Titles (0 through 34)
const MR_TITLES = [
  'Unranked',
  'Initiate', 'Silver Initiate', 'Gold Initiate',
  'Novice', 'Silver Novice', 'Gold Novice',
  'Disciple', 'Silver Disciple', 'Gold Disciple',
  'Seeker', 'Silver Seeker', 'Gold Seeker',
  'Hunter', 'Silver Hunter', 'Gold Hunter',
  'Eagle', 'Silver Eagle', 'Gold Eagle',
  'Tiger', 'Silver Tiger', 'Gold Tiger',
  'Dragon', 'Silver Dragon', 'Gold Dragon',
  'Sage', 'Silver Sage', 'Gold Sage',
  'Master', 'Middle Master', 'True Master',
  'Legendary 1', 'Legendary 2', 'Legendary 3', 'Legendary 4'
];

export class MasteryController {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('masteryAssistantView');
    this.onPursueTarget = options.onPursueTarget || (() => {});
    this.marketClient = options.marketClient || null;

    this.activeFilter = 'ready'; // Default to "Ready to Craft" so high-value opportunities shine first!
    this.searchQuery = '';
    this.playerName = 'Tenno';
    this.masteryMap = new Map(); // itemName -> { mastered: boolean, xp: number }
    this.ownedComponentsMap = new Map(); // normalized component name -> count
    this.marketPrices = new Map(); // slug -> minPrice
  }

  /**
   * Set active player and load their personal mastery and inventory data
   * @param {string} playerName
   */
  async loadPlayer(playerName) {
    this.playerName = playerName || 'Tenno';
    this.loadLocalData();
    await this.fetchRemoteData();
    this.render();
  }

  loadLocalData() {
    // 1. Load mastery status
    try {
      const raw = localStorage.getItem(`wf_mastery_${this.playerName}`);
      if (raw) {
        const records = JSON.parse(raw);
        this.masteryMap.clear();
        for (const r of records) {
          this.masteryMap.set(r.name.toLowerCase(), { mastered: !!r.mastered, xp: r.xp || 0 });
        }
      } else {
        // Seed initial realistic profile for immediate discovery
        this.seedInitialProfile();
      }
    } catch {
      this.seedInitialProfile();
    }

    // 2. Load owned components
    try {
      const rawComp = localStorage.getItem(`wf_components_${this.playerName}`);
      if (rawComp) {
        const comps = JSON.parse(rawComp);
        this.ownedComponentsMap.clear();
        for (const c of comps) {
          const norm = this.normalizeComponentName(c.name);
          this.ownedComponentsMap.set(norm, (this.ownedComponentsMap.get(norm) || 0) + (c.count || 1));
        }
      } else {
        this.seedInitialComponents();
      }
    } catch {
      this.seedInitialComponents();
    }
  }

  seedInitialProfile() {
    this.masteryMap.clear();
    // Pre-mark some classic older primes as mastered so MR calculates realistically (~MR 24)
    const masteredList = [
      'Ash Prime', 'Atlas Prime', 'Banshee Prime', 'Chroma Prime', 'Ember Prime',
      'Equinox Prime', 'Frost Prime', 'Hydroid Prime', 'Inaros Prime', 'Ivara Prime',
      'Limbo Prime', 'Loki Prime', 'Mag Prime', 'Mesa Prime', 'Mirage Prime',
      'Nekros Prime', 'Nova Prime', 'Nyx Prime', 'Oberon Prime', 'Rhino Prime',
      'Saryn Prime', 'Trinity Prime', 'Valkyr Prime', 'Vauban Prime', 'Volt Prime',
      'Braton Prime', 'Burston Prime', 'Paris Prime', 'Tigris Prime', 'Soma Prime',
      'Lex Prime', 'Akbolto Prime', 'Hikou Prime', 'Fang Prime', 'Orthos Prime',
      'Galatine Prime', 'Nikana Prime', 'Scindo Prime', 'Carrier Prime', 'Wyrm Prime'
    ];

    for (const name of masteredList) {
      this.masteryMap.set(name.toLowerCase(), { mastered: true, xp: 6000 });
    }
    this.saveMasteryLocal();
  }

  seedInitialComponents() {
    this.ownedComponentsMap.clear();
    // Seed some exciting inventory components showing "Ready to Craft" and "Missing 1"
    const sampleOwned = [
      // Protea Prime: 4/4 Complete! (Ready to craft)
      'Protea Prime Blueprint',
      'Protea Prime Chassis',
      'Protea Prime Neuroptics',
      'Protea Prime Systems',
      // Sevagoth Prime: 4/4 Complete!
      'Sevagoth Prime Blueprint',
      'Sevagoth Prime Chassis',
      'Sevagoth Prime Neuroptics',
      'Sevagoth Prime Systems',
      // Glaive Prime: 2/3 (Missing Blade)
      'Glaive Prime Blueprint',
      'Glaive Prime Disc',
      // Xaku Prime: 3/4 (Missing Chassis)
      'Xaku Prime Blueprint',
      'Xaku Prime Neuroptics',
      'Xaku Prime Systems'
    ];

    for (const c of sampleOwned) {
      const norm = this.normalizeComponentName(c);
      this.ownedComponentsMap.set(norm, 1);
    }
    this.saveComponentsLocal();
  }

  normalizeComponentName(name = '') {
    return name
      .toLowerCase()
      .replace(/blueprint/g, '')
      .replace(/prime/g, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }

  saveMasteryLocal() {
    const arr = [];
    for (const [name, val] of this.masteryMap.entries()) {
      arr.push({ name, mastered: val.mastered, xp: val.xp });
    }
    localStorage.setItem(`wf_mastery_${this.playerName}`, JSON.stringify(arr));
  }

  saveComponentsLocal() {
    const arr = [];
    for (const [name, count] of this.ownedComponentsMap.entries()) {
      arr.push({ name, count });
    }
    localStorage.setItem(`wf_components_${this.playerName}`, JSON.stringify(arr));
  }

  async fetchRemoteData() {
    try {
      const res = await fetch(`/api/mastery/${encodeURIComponent(this.playerName)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.ok && json.profile) {
          if (json.profile.items && json.profile.items.length > 0) {
            for (const r of json.profile.items) {
              this.masteryMap.set(r.item_name.toLowerCase(), { mastered: r.mastered === 1, xp: r.xp || 0 });
            }
            this.saveMasteryLocal();
          }

          if (json.profile.ownedComponents && json.profile.ownedComponents.length > 0) {
            for (const c of json.profile.ownedComponents) {
              const norm = this.normalizeComponentName(c.name);
              this.ownedComponentsMap.set(norm, (this.ownedComponentsMap.get(norm) || 0) + (c.count || 1));
            }
            this.saveComponentsLocal();
          }
        }
      }
    } catch {
      // Offline / standalone mode
    }
  }

  /**
   * Sync a newly uploaded or parsed inventory from .dat or companion
   */
  integrateInventory(components = [], mastery = []) {
    if (components.length > 0) {
      this.ownedComponentsMap.clear();
      for (const c of components) {
        const norm = this.normalizeComponentName(c.name);
        this.ownedComponentsMap.set(norm, (this.ownedComponentsMap.get(norm) || 0) + (c.count || 1));
      }
      this.saveComponentsLocal();
    }

    if (mastery.length > 0) {
      for (const m of mastery) {
        this.masteryMap.set(m.name.toLowerCase(), {
          mastered: !!m.mastered,
          xp: m.category === 'Warframe' || m.category === 'Companion' ? 6000 : 3000
        });
      }
      this.saveMasteryLocal();
    }

    this.render();
  }

  /**
   * Calculates current Mastery Rank and XP progression
   */
  calculateMasteryMetrics() {
    let totalXp = 0;
    let totalMastered = 0;

    for (const item of ALL_PRIMES_CATALOG) {
      const record = this.masteryMap.get(item.name.toLowerCase());
      if (record && record.mastered) {
        totalMastered++;
        const itemXp = (item.category === 'Warframe' || item.category === 'Companion' || item.category === 'Archwing') ? 6000 : 3000;
        totalXp += itemXp;
      }
    }

    // Add baseline star chart & quest XP bonus for realistic feel if > 0
    if (totalMastered > 0) {
      totalXp += 30000; // Star chart completion bonus
    }

    // Warframe MR Rank Formula: Rank = floor(sqrt(totalXp / 2500))
    const rank = Math.min(34, Math.max(0, Math.floor(Math.sqrt(totalXp / 2500))));
    const title = MR_TITLES[rank] || `Grand Master ${rank}`;

    const currentRankMinXp = 2500 * Math.pow(rank, 2);
    const nextRankMinXp = 2500 * Math.pow(rank + 1, 2);
    const rankBracket = nextRankMinXp - currentRankMinXp;
    const progressInRank = Math.max(0, totalXp - currentRankMinXp);
    const progressPct = rankBracket > 0 ? Math.min(100, Math.round((progressInRank / rankBracket) * 100)) : 100;
    const xpNeeded = Math.max(0, nextRankMinXp - totalXp);

    return {
      rank,
      title,
      totalXp,
      nextRankMinXp,
      progressPct,
      xpNeeded,
      totalMastered,
      totalCatalog: ALL_PRIMES_CATALOG.length
    };
  }

  /**
   * Checks player's owned components for a specific Prime item
   */
  evaluatePrimeReadiness(prime) {
    const isMastered = !!this.masteryMap.get(prime.name.toLowerCase())?.mastered;
    const components = prime.components || [];
    let ownedCount = 0;
    const componentStatus = [];

    for (const comp of components) {
      const norm = this.normalizeComponentName(comp.name);
      // Check if we own this part
      let isOwned = false;
      let count = 0;

      for (const [ownedNorm, ownedQty] of this.ownedComponentsMap.entries()) {
        if (norm.includes(ownedNorm) || ownedNorm.includes(norm)) {
          isOwned = true;
          count += ownedQty;
        }
      }

      if (isOwned) ownedCount++;

      componentStatus.push({
        name: comp.name,
        count: comp.count || 1,
        ownedCount: count,
        isOwned,
        drops: comp.drops || []
      });
    }

    const totalComponents = components.length;
    let readiness = 'unmastered';
    if (isMastered) {
      readiness = 'mastered';
    } else if (totalComponents > 0 && ownedCount >= totalComponents) {
      readiness = 'ready'; // 100% parts owned!
    } else if (totalComponents > 1 && ownedCount === totalComponents - 1) {
      readiness = 'almost'; // Missing exactly 1 part!
    }

    return {
      prime,
      isMastered,
      readiness,
      ownedCount,
      totalComponents,
      componentStatus
    };
  }

  /**
   * Toggle mastery checkmark manually
   */
  async toggleMastery(primeName) {
    const key = primeName.toLowerCase();
    const current = !!this.masteryMap.get(key)?.mastered;
    const nextState = !current;
    const prime = ALL_PRIMES_CATALOG.find(p => p.name.toLowerCase() === key);
    const xp = (prime?.category === 'Warframe' || prime?.category === 'Companion') ? 6000 : 3000;

    this.masteryMap.set(key, { mastered: nextState, xp: nextState ? xp : 0 });
    this.saveMasteryLocal();
    this.render();

    // Persist to backend if online
    try {
      await fetch(`/api/mastery/${encodeURIComponent(this.playerName)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ name: primeName, mastered: nextState, xp: nextState ? xp : 0, category: prime?.category || 'Item' }]
        })
      });
    } catch {
      // Local sync succeeded
    }
  }

  // --------------------------------------------------------------------------
  // Rendering
  // --------------------------------------------------------------------------

  render() {
    if (!this.container) return;

    const metrics = this.calculateMasteryMetrics();
    const evaluatedItems = ALL_PRIMES_CATALOG.map(p => this.evaluatePrimeReadiness(p));

    // Calculate count totals for filter badges
    const counts = {
      all: evaluatedItems.length,
      ready: evaluatedItems.filter(i => i.readiness === 'ready').length,
      almost: evaluatedItems.filter(i => i.readiness === 'almost').length,
      unmastered: evaluatedItems.filter(i => !i.isMastered).length,
      warframes: evaluatedItems.filter(i => i.prime.category === 'Warframe' && !i.isMastered).length,
      weapons: evaluatedItems.filter(i => ['Primary', 'Secondary', 'Melee'].includes(i.prime.category) && !i.isMastered).length,
      mastered: evaluatedItems.filter(i => i.isMastered).length
    };

    // Filter items according to active tab & search
    const filtered = evaluatedItems.filter(item => {
      // Search text match
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchesName = item.prime.name.toLowerCase().includes(q);
        const matchesComp = item.componentStatus.some(c => c.name.toLowerCase().includes(q));
        if (!matchesName && !matchesComp) return false;
      }

      // Tab filter
      switch (this.activeFilter) {
        case 'ready':
          return item.readiness === 'ready';
        case 'almost':
          return item.readiness === 'almost';
        case 'unmastered':
          return !item.isMastered;
        case 'warframe':
          return item.prime.category === 'Warframe' && !item.isMastered;
        case 'weapons':
          return ['Primary', 'Secondary', 'Melee'].includes(item.prime.category) && !item.isMastered;
        case 'companions':
          return item.prime.category === 'Companion' && !item.isMastered;
        case 'mastered':
          return item.isMastered;
        default:
          return true;
      }
    });

    // Sort: "ready" first, then "almost", then unvaulted, then alphabetical
    filtered.sort((a, b) => {
      const score = item => {
        if (item.readiness === 'ready') return 4;
        if (item.readiness === 'almost') return 3;
        if (!item.isMastered && !item.prime.vaulted) return 2;
        if (!item.isMastered) return 1;
        return 0;
      };
      return score(b) - score(a) || a.prime.name.localeCompare(b.prime.name);
    });

    this.container.innerHTML = `
      <!-- 1. Personal Tenno Dossier Telemetry Banner -->
      <section class="glass-panel mastery-dossier-banner">
        <div class="dossier-left">
          <div class="dossier-sigil">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gold">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div class="dossier-identity">
            <div class="dossier-name-row">
              <span class="dossier-gamertag">${this.escape(this.playerName)}</span>
              <span class="dossier-mr-badge">MR ${metrics.rank}</span>
            </div>
            <div class="dossier-title">${metrics.title}</div>
          </div>
        </div>

        <div class="dossier-center">
          <div class="xp-meta-row">
            <span class="xp-current"><strong class="text-gold">${metrics.totalXp.toLocaleString()}</strong> Total XP</span>
            <span class="xp-needed">${metrics.xpNeeded > 0 ? `${metrics.xpNeeded.toLocaleString()} XP to MR ${metrics.rank + 1}` : 'Maximum Rank Attained'}</span>
          </div>
          <div class="mastery-xp-bar-track" title="${metrics.progressPct}% towards next Mastery Rank">
            <div class="mastery-xp-bar-fill" style="width: ${metrics.progressPct}%"></div>
          </div>
        </div>

        <div class="dossier-right">
          <div class="dossier-stat-pill">
            <span class="stat-number gold">${metrics.totalMastered} / ${metrics.totalCatalog}</span>
            <span class="stat-caption">Primes Mastered (${Math.round((metrics.totalMastered / metrics.totalCatalog) * 100)}%)</span>
          </div>
          <div class="dossier-stat-pill highlight-green">
            <span class="stat-number green">${counts.ready}</span>
            <span class="stat-caption">Ready to Craft</span>
          </div>
        </div>
      </section>

      <!-- 2. Target Strategy Filter Tabs & Search -->
      <section class="glass-panel mastery-filter-panel">
        <div class="mastery-filter-chips">
          <button class="m-chip ${this.activeFilter === 'ready' ? 'active' : ''}" data-filter="ready">
            <span class="chip-dot dot-green"></span>
            Ready to Craft <span class="chip-badge">${counts.ready}</span>
          </button>
          <button class="m-chip ${this.activeFilter === 'almost' ? 'active' : ''}" data-filter="almost">
            <span class="chip-dot dot-yellow"></span>
            Missing 1 Part <span class="chip-badge">${counts.almost}</span>
          </button>
          <button class="m-chip ${this.activeFilter === 'unmastered' ? 'active' : ''}" data-filter="unmastered">
            All Unmastered <span class="chip-badge">${counts.unmastered}</span>
          </button>
          <button class="m-chip ${this.activeFilter === 'warframe' ? 'active' : ''}" data-filter="warframe">
            Warframes <span class="chip-badge">${counts.warframes}</span>
          </button>
          <button class="m-chip ${this.activeFilter === 'weapons' ? 'active' : ''}" data-filter="weapons">
            Weapons <span class="chip-badge">${counts.weapons}</span>
          </button>
          <button class="m-chip ${this.activeFilter === 'mastered' ? 'active' : ''}" data-filter="mastered">
            Mastered <span class="chip-badge">${counts.mastered}</span>
          </button>
        </div>

        <div class="mastery-search-wrap">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="masterySearchInput" class="mastery-search-input" placeholder="Filter targets or missing components..." value="${this.escape(this.searchQuery)}">
          ${this.searchQuery ? '<button id="btnClearMasterySearch" class="btn-clear-search">&times;</button>' : ''}
        </div>
      </section>

      <!-- 3. Target Pursuit Cards Grid -->
      <section class="mastery-grid">
        ${filtered.length === 0 ? this.renderEmptyState() : filtered.map(item => this.renderPursuitCard(item)).join('')}
      </section>
    `;

    this.attachDomEvents();
  }

  renderPursuitCard(item) {
    const { prime, isMastered, readiness, ownedCount, totalComponents, componentStatus } = item;
    const isReady = readiness === 'ready';
    const isAlmost = readiness === 'almost';

    let readinessBadge = '';
    if (isMastered) {
      readinessBadge = '<span class="readiness-badge mastered"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Mastered</span>';
    } else if (isReady) {
      readinessBadge = '<span class="readiness-badge ready"><span class="dot-pulse"></span> 4/4 Ready to Craft</span>';
    } else if (isAlmost) {
      readinessBadge = `<span class="readiness-badge almost">${ownedCount}/${totalComponents} Owned (Missing 1)</span>`;
    } else {
      readinessBadge = `<span class="readiness-badge pending">${ownedCount}/${totalComponents} Parts Owned</span>`;
    }

    return `
      <div class="pursuit-card glass-panel ${isReady ? 'border-ready' : ''} ${isAlmost ? 'border-almost' : ''} ${isMastered ? 'card-mastered' : ''}">
        <!-- Header -->
        <div class="pursuit-card-header">
          <div class="pursuit-title-wrap">
            <h3 class="pursuit-name">${this.escape(prime.name)}</h3>
            <div class="pursuit-tags">
              <span class="category-tag">${prime.category}</span>
              <span class="vault-tag ${prime.vaulted ? 'vaulted' : 'unvaulted'}">${prime.vaulted ? 'Vaulted' : 'Unvaulted'}</span>
            </div>
          </div>
          <div>${readinessBadge}</div>
        </div>

        <!-- Component Checklist -->
        <div class="pursuit-components-list">
          ${componentStatus.map(comp => {
            const missingRelic = comp.drops && comp.drops[0] ? comp.drops[0].relic : null;
            return `
              <div class="pursuit-comp-row ${comp.isOwned ? 'owned' : 'missing'}">
                <div class="comp-check-icon">
                  ${comp.isOwned
                    ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--jade-prime)" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>'
                    : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
                  }
                </div>
                <div class="comp-details">
                  <span class="comp-name-text">${this.escape(comp.name)}</span>
                  ${comp.isOwned
                    ? `<span class="comp-owned-pill">Owned: ${comp.ownedCount}</span>`
                    : (missingRelic ? `<span class="comp-source-pill">Relic: <strong>${missingRelic}</strong></span>` : '<span class="comp-source-pill">Vaulted Relic</span>')
                  }
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Footer / Pursue Action -->
        <div class="pursuit-card-footer">
          <button class="btn btn-secondary btn-xs btn-toggle-mastery" data-target="${this.escape(prime.name)}" title="Toggle mastery status">
            ${isMastered
              ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Mastered'
              : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg> Mark Mastered'
            }
          </button>

          <button class="btn btn-primary btn-sm btn-pursue-target" data-target="${this.escape(prime.name)}" title="Set as squad target in the Relic Engine">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 14 14"></polyline>
            </svg>
            Pursue Target ✦
          </button>
        </div>
      </div>
    `;
  }

  renderEmptyState() {
    return `
      <div class="mastery-empty-state glass-panel">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p class="empty-title">No matching Prime targets in this filter</p>
        <p class="empty-sub">Try switching filter categories or clearing the search query.</p>
      </div>
    `;
  }

  attachDomEvents() {
    // Filter chips
    const chips = this.container.querySelectorAll('.m-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.activeFilter = chip.dataset.filter;
        this.render();
      });
    });

    // Search input
    const searchInput = this.container.querySelector('#masterySearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim();
        this.render();
      });
    }

    const btnClear = this.container.querySelector('#btnClearMasterySearch');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        this.searchQuery = '';
        this.render();
      });
    }

    // Toggle Mastery
    const toggleBtns = this.container.querySelectorAll('.btn-toggle-mastery');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = btn.dataset.target;
        this.toggleMastery(target);
      });
    });

    // Pursue Target in Relic Engine
    const pursueBtns = this.container.querySelectorAll('.btn-pursue-target');
    pursueBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = btn.dataset.target;
        this.onPursueTarget(target);
      });
    });
  }

  escape(str = '') {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
