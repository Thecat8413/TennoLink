/**
 * AlecaFrame lastData.dat File Decryption & Zero-Knowledge Sanitizer
 * Protocol: AES-128-CBC with PKCS#7 padding
 * Extracts ONLY Mastery XP and Relic inventory counts; purges all financial/session data.
 */

import crypto from 'node:crypto';

// Static AlecaFrame encryption parameters
const AES_KEY = Buffer.from('LEO-ALEC\tEO-ALEC', 'utf8'); // 16 bytes
const AES_IV = Buffer.from([49, 50, 70, 71, 66, 51, 54, 45, 76, 69, 51, 45, 113, 61, 57, 0]); // 16 bytes: "12FGB36-LE3-q=9\0"

/**
 * Decrypts a raw lastData.dat buffer
 * @param {Buffer|Uint8Array} fileBuffer
 * @returns {Object} Parsed raw inventory object
 */
export function decryptLastDataDat(fileBuffer) {
  try {
    const str = Buffer.from(fileBuffer).toString('utf8').trim();
    if (str.startsWith('{') && str.endsWith('}')) {
      const parsed = JSON.parse(str);
      if (parsed.InventoryJson) {
        return typeof parsed.InventoryJson === 'string' ? JSON.parse(parsed.InventoryJson) : parsed.InventoryJson;
      }
      return parsed;
    }

    const decipher = crypto.createDecipheriv('aes-128-cbc', AES_KEY, AES_IV);
    decipher.setAutoPadding(true);

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(fileBuffer)),
      decipher.final()
    ]);

    const outerJson = JSON.parse(decrypted.toString('utf8'));
    if (!outerJson) {
      throw new Error('Empty decrypted payload');
    }

    // AlecaFrame stores the inner game data as a stringified JSON in InventoryJson
    if (outerJson.InventoryJson) {
      return typeof outerJson.InventoryJson === 'string'
        ? JSON.parse(outerJson.InventoryJson)
        : outerJson.InventoryJson;
    }

    return outerJson;
  } catch (err) {
    throw new Error(`Failed to decrypt inventory data: ${err.message}`);
  }
}

/**
 * Extracts and sanitizes Mastery Rank progression and Relic inventory.
 * Strips all sensitive data (Platinum, Credits, Ducats, Nonces, Trade history).
 * Supports both AlecaFrame and raw Digital Extremes API (warframe-api-helper/WFHelper) formats.
 * @param {Object} rawInventory
 * @returns {{syncTime: string, mastery: Array, relics: Array, components: Array}}
 */
export function sanitizeInventory(rawInventory) {
  if (!rawInventory) {
    return { syncTime: new Date().toISOString(), mastery: [], relics: [], components: [] };
  }

  // 1. Process Relics (Supports 'Relics' from AlecaFrame and 'Projections' from raw DE API)
  const relics = [];
  const rawRelics = rawInventory.Relics || rawInventory.Projections || [];

  for (const r of rawRelics) {
    const itemType = r.ItemType || '';
    // Format is typically: /Lotus/Types/Game/Projections/T1Lith/T1LithRelicB2 or similar
    const relicMatch = itemType.match(/(T[1-5])?(Lith|Meso|Neo|Axi|Requiem)?Relic([A-Z0-9]+)/i) ||
                       itemType.match(/(Lith|Meso|Neo|Axi|Requiem)\s+([A-Z0-9]+)/i);

    let era = 'Lith';
    let code = 'A1';

    if (relicMatch) {
      era = relicMatch[2] || relicMatch[1];
      code = relicMatch[3] || relicMatch[2];
    } else {
      // Direct string fallback
      const parts = itemType.split('/').pop().replace('Relic', ' ');
      era = parts.split(' ')[0] || 'Lith';
      code = parts.split(' ')[1] || 'Unknown';
    }

    // Refinement Tier
    let refinement = 'intact';
    const quality = r.Quality || r.Refinement || 0;
    if (quality === 1 || String(quality).toLowerCase().includes('exceptional')) refinement = 'exceptional';
    else if (quality === 2 || String(quality).toLowerCase().includes('flawless')) refinement = 'flawless';
    else if (quality === 3 || String(quality).toLowerCase().includes('radiant')) refinement = 'radiant';

    relics.push({
      itemType,
      era,
      code,
      name: `${era} ${code}`,
      refinement,
      count: r.ItemCount || r.Count || 1
    });
  }

  // 2. Process Mastery Progression (Equipment XP)
  const mastery = [];

  const equipmentCategories = [
    { key: 'Suits', category: 'Warframe', maxLevelXp: 450000, xpPerLevel: 200 },
    { key: 'Weapons', category: 'Weapon', maxLevelXp: 450000, xpPerLevel: 100 },
    { key: 'SpaceSuits', category: 'Archwing', maxLevelXp: 450000, xpPerLevel: 200 },
    { key: 'SpaceGuns', category: 'Archgun', maxLevelXp: 450000, xpPerLevel: 100 },
    { key: 'SpaceMelee', category: 'Archmelee', maxLevelXp: 450000, xpPerLevel: 100 },
    { key: 'Sentinels', category: 'Companion', maxLevelXp: 450000, xpPerLevel: 200 },
    { key: 'MechSuits', category: 'Necramech', maxLevelXp: 800000, xpPerLevel: 200 }
  ];

  for (const cat of equipmentCategories) {
    const items = rawInventory[cat.key] || [];
    for (const item of items) {
      const itemType = item.ItemType || '';
      const name = itemType.split('/').pop().replace(/([A-Z])/g, ' $1').trim();
      const xp = item.XP || 0;

      // In Warframe, Rank 30 equipment typically accumulates 450,000 XP
      const isMastered = xp >= cat.maxLevelXp || item.Flags?.includes('Mastered') || false;

      mastery.push({
        itemId: itemType,
        name,
        category: cat.category,
        xp,
        mastered: isMastered
      });
    }
  }

  // 3. Process Crafting Components & Prime Parts
  const components = [];
  const rawMisc = rawInventory.MiscItems || [];
  for (const m of rawMisc) {
    const itemType = m.ItemType || '';
    if (itemType.includes('Prime') || itemType.includes('Blueprint') || itemType.includes('Part')) {
      const name = itemType.split('/').pop().replace(/([A-Z])/g, ' $1').trim();
      components.push({
        itemId: itemType,
        name,
        count: m.ItemCount || 1
      });
    }
  }

  const syncTime = rawInventory.LastInventorySync?.$oid
    ? new Date(parseInt(rawInventory.LastInventorySync.$oid.substr(0, 8), 16) * 1000).toISOString()
    : new Date().toISOString();

  return {
    syncTime,
    relics,
    mastery,
    components
  };
}
