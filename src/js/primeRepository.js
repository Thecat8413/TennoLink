/**
 * Prime Item Source of Truth Repository
 * Integrates comprehensive static catalog with dynamic warframestat.us fallback
 */

import { ALL_PRIMES_CATALOG } from '../data/allPrimes.js';
import { ALL_WARFRAME_ITEMS } from '../data/warframeItems.js';

export class PrimeRepository {
  constructor() {
    const existing = new Set(ALL_PRIMES_CATALOG.map(p => p.name.toLowerCase().trim()));
    const additional = ALL_WARFRAME_ITEMS
      .filter(i => i.isPrime && !existing.has(i.name.toLowerCase().trim()))
      .map(i => ({
        name: i.name,
        category: i.category,
        vaulted: i.vaulted,
        marketSlug: i.marketSlug,
        components: i.components
      }));

    this.catalog = [...ALL_PRIMES_CATALOG, ...additional];
    this.dynamicCache = new Map();
  }

  getAll() {
    return this.catalog;
  }

  getByName(name) {
    if (!name) return this.catalog[0];
    const normalized = name.toLowerCase().trim();
    return this.catalog.find(p => p.name.toLowerCase() === normalized) || null;
  }

  search(query = '', category = 'All') {
    const q = query.toLowerCase().trim();
    return this.catalog.filter(item => {
      const matchCat = category === 'All' || item.category === category;
      const matchQ = !q || item.name.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }

  /**
   * Fallback to live api.warframestat.us search if an item is not found locally
   * @param {string} query
   * @returns {Promise<Object|null>}
   */
  async fetchLiveFallback(query) {
    if (!query) return null;
    const cleanQuery = query.trim();
    if (this.dynamicCache.has(cleanQuery)) {
      return this.dynamicCache.get(cleanQuery);
    }

    try {
      const url = `https://api.warframestat.us/items/search/${encodeURIComponent(cleanQuery)}`;
      const res = await fetch(url);
      if (!res.ok) return null;

      const items = await res.json();
      const primeItem = items.find(i => i.isPrime === true && i.components && i.components.length > 0);

      if (!primeItem) return null;

      // Normalize warframestat schema into our schema
      const normalized = {
        name: primeItem.name,
        category: primeItem.category === 'Warframes' ? 'Warframe' : (primeItem.category || 'Weapon'),
        vaulted: !!primeItem.vaulted,
        marketSlug: primeItem.name.toLowerCase().replace(/\s+/g, '_') + '_set',
        components: primeItem.components
          .filter(c => c.name !== 'Orokin Cell' && c.tradable !== false)
          .map(c => {
            const relicDrops = (c.drops || [])
              .filter(d => d.location && d.location.includes('Relic'))
              .map(d => {
                const match = d.location.match(/(Lith|Meso|Neo|Axi|Requiem)\s+([A-Z0-9]+)/i);
                const relicName = match ? `${match[1]} ${match[2]}` : d.location;
                return {
                  relic: relicName,
                  rarity: d.rarity || 'Rare',
                  vaulted: !!primeItem.vaulted
                };
              });

            return {
              name: c.name.includes(primeItem.name) ? c.name : `${primeItem.name} ${c.name}`,
              count: c.itemCount || 1,
              marketSlug: `${primeItem.name}_${c.name}`.toLowerCase().replace(/\s+/g, '_'),
              drops: relicDrops
            };
          })
      };

      // Add to catalog so it is immediately searchable
      this.catalog.push(normalized);
      this.dynamicCache.set(cleanQuery, normalized);
      return normalized;
    } catch (e) {
      console.warn('Live fallback lookup failed:', e);
      return null;
    }
  }
}
