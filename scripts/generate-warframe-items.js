/**
 * Utility script to generate src/data/warframeItems.js from WFCD warframe-items
 * Merges detailed relic drop schemas from allPrimes.js for Prime items.
 */

import fs from 'node:fs';
import path from 'node:path';
import { ALL_PRIMES_CATALOG } from '../src/data/allPrimes.js';

const primeMap = new Map();
for (const p of ALL_PRIMES_CATALOG) {
  primeMap.set(p.name.toLowerCase().trim(), p);
}

const categories = [
  { file: 'Warframes', cat: 'Warframe', defaultXp: 6000 },
  { file: 'Primary', cat: 'Primary', defaultXp: 3000 },
  { file: 'Secondary', cat: 'Secondary', defaultXp: 3000 },
  { file: 'Melee', cat: 'Melee', defaultXp: 3000 },
  { file: 'Sentinels', cat: 'Companion', defaultXp: 6000 },
  { file: 'SentinelWeapons', cat: 'Companion', defaultXp: 3000 },
  { file: 'Pets', cat: 'Companion', defaultXp: 6000 },
  { file: 'Archwing', cat: 'Archwing', defaultXp: 6000 },
  { file: 'Arch-Gun', cat: 'Arch-Gun', defaultXp: 3000 },
  { file: 'Arch-Melee', cat: 'Arch-Melee', defaultXp: 3000 }
];

async function generate() {
  console.log('Fetching Warframe item catalogs from WFCD repository...');
  const allItems = [];
  const seen = new Set();

  for (const c of categories) {
    const url = `https://raw.githubusercontent.com/WFCD/warframe-items/master/data/json/${c.file}.json`;
    console.log(`- Fetching ${c.file}...`);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
    }
    const data = await res.json();

    for (const item of data) {
      if (!item.masterable) continue;
      const cleanName = item.name.trim();
      if (seen.has(cleanName.toLowerCase())) continue;
      seen.add(cleanName.toLowerCase());

      const existingPrime = primeMap.get(cleanName.toLowerCase());

      // Use rich drop & component metadata from allPrimes if prime, else filter WFCD components
      let comps = [];
      if (existingPrime && existingPrime.components && existingPrime.components.length > 0) {
        comps = existingPrime.components;
      } else if (item.components && item.components.length > 0) {
        comps = item.components
          .filter(comp => {
            const n = comp.name || '';
            return n && 
              !n.includes('Cell') && 
              !n.includes('Forma') && 
              !n.includes('Tellurium') && 
              !n.includes('Credits') && 
              !n.includes('Argon') &&
              !n.includes('Plastids') &&
              !n.includes('Polymer') &&
              !n.includes('Rubedo') &&
              !n.includes('Ferrite') &&
              !n.includes('Nano');
          })
          .map(comp => ({
            name: comp.name.trim(),
            count: comp.itemCount || 1
          }));
      }

      allItems.push({
        name: cleanName,
        category: c.cat,
        type: item.type || c.cat,
        isPrime: !!item.isPrime,
        vaulted: existingPrime ? existingPrime.vaulted : !!item.vaulted,
        masteryReq: item.masteryReq || 0,
        xp: c.defaultXp,
        marketSlug: existingPrime ? existingPrime.marketSlug : (cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_') + (item.isPrime ? '_set' : '')),
        components: comps,
        imageName: item.imageName || ''
      });
    }
  }

  // Sort alphabetically by name
  allItems.sort((a, b) => a.name.localeCompare(b.name));

  const outputPath = path.resolve('src/data/warframeItems.js');
  const fileContent = `/**
 * Complete Offline Catalog of All Masterable Warframe Items
 * Total Items: ${allItems.length}
 * Covers all Warframes, Primary/Secondary/Melee weapons, Companions, and Archwing equipment.
 */

export const ALL_WARFRAME_ITEMS = ${JSON.stringify(allItems, null, 2)};
`;

  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log(` Successfully generated ${outputPath} with ${allItems.length} items!`);
}

generate().catch(err => {
  console.error('Generation failed:', err);
  process.exit(1);
});
