/**
 * Mastery Assistant & Target Pursuer Controller
 * Vitruvian Orokin aesthetic, personal MR telemetry, crafting readiness scanner,
 * and 1-click pursuit linking to the Fireteam Relic Engine.
 * 
 * Powered by complete offline dataset of all 799 masterable Warframe items:
 * Warframes, Primaries, Secondaries, Melees, Companions, and Archwings.
 */

import { ALL_WARFRAME_ITEMS } from '../data/warframeItems.js';
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

    this.activeFilter = 'unmastered'; // Default to unmastered items to pursue
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
    // 1. Load mastery status (no fake demo seeding)
    this.masteryMap.clear();
    try {
      const raw = localStorage.getItem(`wf_mastery_${this.playerName}`);
      if (raw) {
        const records = JSON.parse(raw);
        for (const r of records) {
          if (r && r.name) {
            this.masteryMap.set(r.name.toLowerCase().trim(), { mastered: !!r.mastered, xp: r.xp || 0 });
          }
        }
      }
    } catch (e) {
      console.warn('Error reading local mastery:', e);
    }

    // 2. Load owned components (no fake demo seeding)
    this.ownedComponentsMap.clear();
    try {
      const rawComp = localStorage.getItem(`wf_components_${this.playerName}`);
      if (rawComp) {
        const comps = JSON.parse(rawComp);
        for (const c of comps) {
          if (c && c.name) {
            const norm = this.normalizeComponentName(c.name);
            this.ownedComponentsMap.set(norm, (this.ownedComponentsMap.get(norm) || 0) + (c.count || 1));
          }
        }
      }
    } catch (e) {
      console.warn('Error reading local components:', e);
    }
  }

  normalizeComponentName(name = '') {
    return name
      .toLowerCase()
      .replace(/\s+blueprint$/, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  saveMasteryLocal() {
    const arr = [];
    for (const [name, data] of this.masteryMap.entries()) {
      arr.push({ name, mastered: data.mastered, xp: data.xp });
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
              if (r.item_name) {
                this.masteryMap.set(r.item_name.toLowerCase().trim(), { mastered: r.mastered === 1, xp: r.xp || 0 });
              }
            }
            this.saveMasteryLocal();
          }

          if (json.profile.ownedComponents && json.profile.ownedComponents.length > 0) {
            for (const c of json.profile.ownedComponents) {
              if (c.name) {
                const norm = this.normalizeComponentName(c.name);
                this.ownedComponentsMap.set(norm, (this.ownedComponentsMap.get(norm) || 0) + (c.count || 1));
              }
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
        this.masteryMap.set(m.name.toLowerCase().trim(), {
          mastered: !!m.mastered,
          xp: m.category === 'Warframe' || m.category === 'Companion' ? 6000 : 3000
        });
      }
      this.saveMasteryLocal();
    }

    this.render();
  }

  /**
   * Calculates current Mastery Rank and XP progression based on all in-game items
   */
  calculateMasteryMetrics() {
    let totalXp = 0;
    let totalMastered = 0;

    for (const item of ALL_WARFRAME_ITEMS) {
      const record = this.masteryMap.get(item.name.toLowerCase().trim());
      if (record && record.mastered) {
        totalMastered++;
        totalXp += item.xp || (item.category === 'Warframe' || item.category === 'Companion' || item.category === 'Archwing' ? 6000 : 3000);
      }
    }

    // Baseline star chart & quest bonus if any items are mastered
    if (totalMastered > 0) {
      totalXp += 30000;
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
      totalCatalog: ALL_WARFRAME_ITEMS.length
    };
  }

  /**
   * Evaluates crafting readiness based on owned components
   */
  evaluateItemReadiness(item) {
    const isMastered = !!this.masteryMap.get(item.name.toLowerCase().trim())?.mastered;
    const components = item.components || [];
    let ownedCount = 0;
    const componentStatus = [];

    for (const comp of components) {
      const norm = this.normalizeComponentName(comp.name);
      let isOwned = false;
      let count = 0;

      for (const [ownedNorm, ownedQty] of this.ownedComponentsMap.entries()) {
        if (norm === ownedNorm || norm.includes(ownedNorm) || ownedNorm.includes(norm)) {
          isOwned = true;
          count += ownedQty;
        }
      }

      if (isOwned) ownedCount++;
      componentStatus.push({
        name: comp.name,
        isOwned,
        ownedCount: count,
        drops: comp.drops || []
      });
    }

    let readiness = 'unowned';
    const totalComponents = components.length;

    if (totalComponents > 0 && ownedCount === totalComponents) {
      readiness = 'ready';
    } else if (totalComponents > 1 && ownedCount === totalComponents - 1) {
      readiness = 'almost';
    } else if (ownedCount > 0) {
      readiness = 'in-progress';
    }

    return {
      item,
      isMastered,
      readiness,
      ownedCount,
      totalComponents,
      componentStatus
    };
  }

  /**
   * Toggle mastery status manually
   */
  async toggleMastery(itemName) {
    const key = itemName.toLowerCase().trim();
    const current = !!this.masteryMap.get(key)?.mastered;
    const nextState = !current;
    const item = ALL_WARFRAME_ITEMS.find(i => i.name.toLowerCase().trim() === key);
    const xp = item?.xp || 3000;

    this.masteryMap.set(key, { mastered: nextState, xp: nextState ? xp : 0 });
    this.saveMasteryLocal();
    this.render();

    // Persist to backend if online
    try {
      await fetch(`/api/mastery/${encodeURIComponent(this.playerName)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ name: itemName, mastered: nextState, xp: nextState ? xp : 0, category: item?.category || 'Item' }]
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
    const evaluatedItems = ALL_WARFRAME_ITEMS.map(i => this.evaluateItemReadiness(i));

    // Calculate count totals for filter badges
    const counts = {
      all: evaluatedItems.length,
      ready: evaluatedItems.filter(i => i.readiness === 'ready' && !i.isMastered).length,
      almost: evaluatedItems.filter(i => i.readiness === 'almost' && !i.isMastered).length,
      unmastered: evaluatedItems.filter(i => !i.isMastered).length,
      primes: evaluatedItems.filter(i => i.item.isPrime && !i.isMastered).length,
      warframes: evaluatedItems.filter(i => i.item.category === 'Warframe' && !i.isMastered).length,
      weapons: evaluatedItems.filter(i => ['Primary', 'Secondary', 'Melee'].includes(i.item.category) && !i.isMastered).length,
      companions: evaluatedItems.filter(i => i.item.category === 'Companion' && !i.isMastered).length,
      archwing: evaluatedItems.filter(i => ['Archwing', 'Arch-Gun', 'Arch-Melee'].includes(i.item.category) && !i.isMastered).length,
      mastered: evaluatedItems.filter(i => i.isMastered).length
    };

    // Filter items according to active tab & search
    const filtered = evaluatedItems.filter(i => {
      // Search text match
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchesName = i.item.name.toLowerCase().includes(q);
        const matchesType = i.item.type.toLowerCase().includes(q);
        const matchesComp = i.componentStatus.some(c => c.name.toLowerCase().includes(q));
        if (!matchesName && !matchesType && !matchesComp) return false;
      }

      // Tab filter
      switch (this.activeFilter) {
        case 'ready':
          return i.readiness === 'ready' && !i.isMastered;
        case 'almost':
          return i.readiness === 'almost' && !i.isMastered;
        case 'primes':
          return i.item.isPrime && !i.isMastered;
        case 'warframe':
          return i.item.category === 'Warframe' && !i.isMastered;
        case 'weapons':
          return ['Primary', 'Secondary', 'Melee'].includes(i.item.category) && !i.isMastered;
        case 'companions':
          return i.item.category === 'Companion' && !i.isMastered;
        case 'archwing':
          return ['Archwing', 'Arch-Gun', 'Arch-Melee'].includes(i.item.category) && !i.isMastered;
        case 'unmastered':
          return !i.isMastered;
        case 'mastered':
          return i.isMastered;
        default:
          return true;
      }
    });

    // Sort: "ready" first, then "almost", then Primes, then alphabetical
    filtered.sort((a, b) => {
      const score = itm => {
        if (itm.readiness === 'ready') return 4;
        if (itm.readiness === 'almost') return 3;
        if (!itm.isMastered && itm.item.isPrime && !itm.item.vaulted) return 2.5;
        if (!itm.isMastered && itm.item.isPrime) return 2;
        if (!itm.isMastered) return 1;
        return 0;
      };
      return score(b) - score(a) || a.item.name.localeCompare(b.item.name);
    });

    // Is brand new player with zero synced data?
    const isBrandNewSession = metrics.totalMastered === 0 && this.ownedComponentsMap.size === 0;

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
            <span class="stat-caption">Items Mastered (${Math.round((metrics.totalMastered / metrics.totalCatalog) * 100)}%)</span>
          </div>
          <div class="dossier-stat-pill ${counts.ready > 0 ? 'highlight-green' : ''}">
            <span class="stat-number ${counts.ready > 0 ? 'green' : 'gold'}">${counts.ready}</span>
            <span class="stat-caption">Ready to Craft</span>
          </div>
        </div>
      </section>

      ${isBrandNewSession ? `
        <!-- First-Run Zero Data Guidance Banner -->
        <section class="glass-panel" style="padding: 0.85rem 1.15rem; background: linear-gradient(135deg, rgba(229,197,119,0.08) 0%, rgba(9,11,15,0.7) 100%); border-left: 3px solid var(--gold-primary); margin-bottom: 0.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <div style="font-size: 0.88rem; font-weight: 700; color: var(--gold-primary); margin-bottom: 0.2rem;">
                ✦ Ready to sync your in-game mastery & crafting components
              </div>
              <div style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">
                Download the lightweight <strong>Assistant (.exe)</strong> or connect via WFHelper / AlecaFrame to automatically populate your exact Warframe progression and parts! You can also check items off manually below.
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="document.getElementById('btnDownloadCompanion')?.click()">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Get Companion (.exe)
            </button>
          </div>
        </section>
      ` : ''}

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
          <button class="m-chip ${this.activeFilter === 'primes' ? 'active' : ''}" data-filter="primes">
            Primes Only <span class="chip-badge">${counts.primes}</span>
          </button>
          <button class="m-chip ${this.activeFilter === 'warframe' ? 'active' : ''}" data-filter="warframe">
            Warframes <span class="chip-badge">${counts.warframes}</span>
          </button>
          <button class="m-chip ${this.activeFilter === 'weapons' ? 'active' : ''}" data-filter="weapons">
            Weapons <span class="chip-badge">${counts.weapons}</span>
          </button>
          <button class="m-chip ${this.activeFilter === 'companions' ? 'active' : ''}" data-filter="companions">
            Companions <span class="chip-badge">${counts.companions}</span>
          </button>
          <button class="m-chip ${this.activeFilter === 'archwing' ? 'active' : ''}" data-filter="archwing">
            Archwing <span class="chip-badge">${counts.archwing}</span>
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
          <input type="text" id="masterySearchInput" class="mastery-search-input" placeholder="Filter 799 targets (e.g. Dante, Sevagoth, Torid, Glaive)..." value="${this.escape(this.searchQuery)}">
          ${this.searchQuery ? '<button id="btnClearMasterySearch" class="btn-clear-search">&times;</button>' : ''}
        </div>
      </section>

      <!-- 3. Target Pursuit Cards Grid -->
      <section class="mastery-grid">
        ${filtered.length === 0 ? this.renderEmptyState() : filtered.slice(0, 150).map(item => this.renderPursuitCard(item)).join('')}
      </section>
      ${filtered.length > 150 ? `
        <div style="text-align: center; padding: 1rem; color: var(--text-faint); font-size: 0.78rem;">
          Showing top 150 of ${filtered.length} matching items. Use the search bar above to narrow targets.
        </div>
      ` : ''}
    `;

    this.attachDomEvents();
  }

  renderPursuitCard(evaluated) {
    const { item, isMastered, readiness, ownedCount, totalComponents, componentStatus } = evaluated;
    const isReady = readiness === 'ready';
    const isAlmost = readiness === 'almost';

    let readinessBadge = '';
    if (isMastered) {
      readinessBadge = '<span class="readiness-badge mastered"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Mastered</span>';
    } else if (isReady) {
      readinessBadge = `<span class="readiness-badge ready"><span class="dot-pulse"></span> ${totalComponents}/${totalComponents} Ready to Craft</span>`;
    } else if (isAlmost) {
      readinessBadge = `<span class="readiness-badge almost">${ownedCount}/${totalComponents} Owned (Missing 1)</span>`;
    } else if (totalComponents > 0) {
      readinessBadge = `<span class="readiness-badge pending">${ownedCount}/${totalComponents} Parts</span>`;
    } else {
      readinessBadge = `<span class="readiness-badge unowned">MR ${item.masteryReq || 0}</span>`;
    }

    return `
      <div class="pursuit-card glass-panel ${isReady ? 'border-ready' : ''} ${isAlmost ? 'border-almost' : ''} ${isMastered ? 'card-mastered' : ''}">
        <!-- Header -->
        <div class="pursuit-card-header">
          <div class="pursuit-title-wrap">
            <h3 class="pursuit-name">${this.escape(item.name)}</h3>
            <div class="pursuit-tags">
              <span class="category-tag">${item.category}</span>
              ${item.isPrime ? `<span class="vault-tag ${item.vaulted ? 'vaulted' : 'unvaulted'}">${item.vaulted ? 'Vaulted Prime' : 'Unvaulted Prime'}</span>` : `<span class="vault-tag" style="border-color: rgba(255,255,255,0.1); color: var(--text-muted);">${item.type}</span>`}
            </div>
          </div>
          <div>${readinessBadge}</div>
        </div>

        <!-- Component Checklist -->
        <div class="pursuit-components-list">
          ${componentStatus.length > 0 ? componentStatus.map(comp => {
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
                    : (missingRelic ? `<span class="comp-source-pill">Relic: <strong>${missingRelic}</strong></span>` : '<span class="comp-source-pill">Foundry Part</span>')
                  }
                </div>
              </div>
            `;
          }).join('') : `
            <div style="font-size: 0.72rem; color: var(--text-faint); padding: 0.4rem 0.2rem; font-style: italic;">
              ${item.masteryReq > 0 ? `Requires Mastery Rank ${item.masteryReq} to craft.` : 'Market / Syndicate / Clan Research acquisition.'}
            </div>
          `}
        </div>

        <!-- Footer / Pursue Action -->
        <div class="pursuit-card-footer">
          <button class="btn btn-secondary btn-xs btn-toggle-mastery" data-target="${this.escape(item.name)}" title="Toggle mastery status">
            ${isMastered
              ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Mastered'
              : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg> Mark Mastered'
            }
          </button>

          ${item.isPrime ? `
            <button class="btn btn-primary btn-sm btn-pursue-target" data-target="${this.escape(item.name)}" title="Set as squad target in the Relic Engine">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 14 14"></polyline>
              </svg>
              Pursue Target ✦
            </button>
          ` : `
            <span style="font-size: 0.68rem; color: var(--text-faint); padding: 0.2rem 0.4rem;">${item.xp} XP</span>
          `}
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
        <p class="empty-title">No matching targets found</p>
        <p class="empty-sub">Try switching filter tabs or clearing your search term.</p>
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
