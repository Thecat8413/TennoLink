/**
 * Canonical Warframe Relic Farming Locations & Speed-Run Meta (2025-2026)
 */

export const RELIC_FARMING_NODES = {
  Lith: {
    recommended: 'Hepit (The Void)',
    missionType: 'Capture',
    notes: 'Sub-60 second runs. Near 100% chance for a Lith relic or Aya upon extraction.',
    alternatives: [
      { node: 'Olympus (Mars)', type: 'Disruption', rotation: 'Rot A' },
      { node: 'Cetus / Fortuna Bounties', type: 'Bounties', rotation: 'Tier 1-2' }
    ]
  },
  Meso: {
    recommended: 'Ukko (The Void) / Io (Jupiter)',
    missionType: 'Capture / Defense',
    notes: 'Ukko (Void Capture) co-drops Meso & Neo in under a minute. Io (Jupiter) offers fast Defense waves 5 & 10 (Rotation A).',
    alternatives: [
      { node: 'Olympus (Mars)', type: 'Disruption', rotation: 'Rot B & C' },
      { node: 'Helene (Saturn)', type: 'Defense', rotation: 'Rot A' }
    ]
  },
  Neo: {
    recommended: 'Ur (Uranus) / Ukko (The Void)',
    missionType: 'Disruption / Capture',
    notes: 'Ur Disruption drops Neo relics on Rotations B & C. Ukko provides quick co-drops with Meso.',
    alternatives: [
      { node: 'Apollo (Lua)', type: 'Disruption', rotation: 'Rot A' },
      { node: 'Xini (Eris)', type: 'Interception', rotation: 'Rot A' }
    ]
  },
  Axi: {
    recommended: 'Apollo (Lua)',
    missionType: 'Disruption',
    notes: 'The community gold-standard for Axi. Tier 3 Disruption: defend 4 conduits in rounds 1-3, then 1-2 conduits in round 4+ to lock in Rotation B/C for guaranteed Axi relics.',
    alternatives: [
      { node: 'Xini (Eris)', type: 'Interception', rotation: 'Rot B & C' },
      { node: 'Mithra (The Void)', type: 'Interception', rotation: 'Rot B & C' }
    ]
  },
  Requiem: {
    recommended: 'Kuva Siphon & Kuva Flood',
    missionType: 'Mission Alerts',
    notes: 'Guaranteed Requiem relic from Kuva Floods; 50% chance from Kuva Siphons. Also drops from Thralls & Hounds.',
    alternatives: [
      { node: 'Kuva Fortress Survival (Taveuni)', type: 'Survival', rotation: 'Rot B & C' }
    ]
  }
};

export const PASSIVE_RELIC_SOURCES = [
  { name: 'Syndicate Relic Packs', cost: '20,000 Standing', reward: '3 random relics (1 guaranteed Rare/Uncommon tier)' },
  { name: 'Teshin (Steel Path)', cost: '15 Steel Essence', reward: '3 random relic packs' },
  { name: 'Prime Resurgence (Varzia)', cost: '1 Aya per Relic', reward: 'Targeted unvaulted relic of choice' }
];

/**
 * Returns acquisition advice string for a given relic
 * @param {string} era
 * @param {boolean} isVaulted
 * @returns {{status: string, badgeClass: string, location: string, advice: string}}
 */
export function getRelicAcquisitionInfo(era, isVaulted) {
  if (isVaulted) {
    return {
      status: 'Vaulted',
      badgeClass: 'vaulted',
      location: 'Prime Resurgence / Trade / Squad Stock',
      advice: 'Cannot drop from standard missions. Obtainable via squad member inventory, Varzia (Aya during Prime Resurgence), or warframe.market.'
    };
  }

  const farmMeta = RELIC_FARMING_NODES[era];
  if (!farmMeta) {
    return {
      status: 'Active Drop',
      badgeClass: 'unvaulted',
      location: 'Starchart Void Fissures',
      advice: 'Active in the current drop tables.'
    };
  }

  return {
    status: 'Active Drop',
    badgeClass: 'unvaulted',
    location: farmMeta.recommended,
    advice: `${farmMeta.missionType}: ${farmMeta.notes}`
  };
}
