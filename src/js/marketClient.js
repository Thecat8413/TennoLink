/**
 * Warframe.Market API Client
 * Interfaces with Cloudflare Pages Function /api/market
 */

export class WarframeMarketClient {
  constructor(proxyPath = '/api/market') {
    this.proxyPath = proxyPath;
    this.memoryCache = new Map();
  }

  /**
   * Fetches the lowest in-game sell price and trade summary for an item slug
   * @param {string} itemSlug e.g. "glaive_prime_set" or "glaive_prime_blade"
   * @returns {Promise<{itemSlug: string, lowestPrice: number|null, topSeller: string|null, medianPrice: number|null, orderCount: number}>}
   */
  async getItemMarketSummary(itemSlug) {
    if (!itemSlug) return { itemSlug, lowestPrice: null, topSeller: null, medianPrice: null, orderCount: 0 };

    const cacheKey = `market_${itemSlug}`;
    if (this.memoryCache.has(cacheKey)) {
      const cached = this.memoryCache.get(cacheKey);
      if (Date.now() - cached.timestamp < 300000) { // 5 minutes cache
        return cached.data;
      }
    }

    try {
      let slug = itemSlug;
      let url = `${this.proxyPath}?item=${encodeURIComponent(slug)}&type=orders`;
      let res = await fetch(url);

      if (!res.ok) {
        // If 404 and slug is missing _blueprint (common for Warframe chassis/systems/neuroptics), try with _blueprint
        if (!slug.endsWith('_blueprint')) {
          const altSlug = `${slug}_blueprint`;
          const altRes = await fetch(`${this.proxyPath}?item=${encodeURIComponent(altSlug)}&type=orders`);
          if (altRes.ok) {
            res = altRes;
            slug = altSlug;
          }
        }
      }

      if (!res.ok) {
        return this.getMockMarketSummary(itemSlug);
      }

      const json = await res.json();
      const orders = json.data || json.payload?.orders || [];

      // Filter for active sell orders: prioritize in-game sellers, then online sellers, then all sells
      const allSells = orders
        .filter(o => (o.type === 'sell' || o.order_type === 'sell') && o.visible !== false)
        .sort((a, b) => a.platinum - b.platinum);

      const ingameSells = allSells.filter(o => o.user?.status === 'ingame');
      const onlineSells = allSells.filter(o => o.user?.status === 'online');
      
      const bestCandidate = ingameSells[0] || onlineSells[0] || allSells[0] || null;

      const summary = {
        itemSlug: slug,
        lowestPrice: bestCandidate ? bestCandidate.platinum : null,
        topSeller: bestCandidate ? (bestCandidate.user?.ingameName || bestCandidate.user?.ingame_name) : null,
        userStatus: bestCandidate ? bestCandidate.user?.status : null,
        orderCount: (ingameSells.length || onlineSells.length || allSells.length),
        isSimulated: false
      };

      this.memoryCache.set(cacheKey, { timestamp: Date.now(), data: summary });
      return summary;
    } catch (err) {
      console.warn(`Market fetch failed for ${itemSlug}:`, err.message);
      return this.getMockMarketSummary(itemSlug);
    }
  }

  /**
   * Fetches market summaries for an entire target set and all of its components
   * @param {Object} targetItem e.g. { name: "Glaive Prime", marketSlug: "glaive_prime_set", components: [...] }
   * @returns {Promise<{setSummary: Object, componentSummaries: Record<string, Object>}>}
   */
  async getFullTargetMarketData(targetItem) {
    const setSummary = await this.getItemMarketSummary(targetItem.marketSlug);
    const componentSummaries = {};

    // Parallel fetch components with slight spacing to be respectful of rate limit
    for (const comp of targetItem.components) {
      if (comp.marketSlug) {
        componentSummaries[comp.name] = await this.getItemMarketSummary(comp.marketSlug);
      }
    }

    return {
      setSummary,
      componentSummaries
    };
  }

  /**
   * Provides deterministic simulated market prices if offline or proxy is unreachable
   * @param {string} slug
   */
  getMockMarketSummary(slug) {
    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
      hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
    }
    let mockPrice = 30 + (hash % 110);
    if (slug.includes('set')) mockPrice = 65 + (hash % 115);
    else if (slug.includes('blade') || slug.includes('receiver') || slug.includes('systems')) mockPrice = 25 + (hash % 45);
    else if (slug.includes('blueprint') || slug.includes('barrel') || slug.includes('chassis')) mockPrice = 15 + (hash % 30);
    else mockPrice = 10 + (hash % 20);

    return {
      itemSlug: slug,
      lowestPrice: mockPrice,
      topSeller: 'TennoTrader',
      userStatus: 'ingame',
      orderCount: 15,
      isSimulated: true
    };
  }
}
