/**
 * Warframe Drop Probability & Radiant Trace Optimization Engine
 */

export const DROP_RATES = {
  Intact: { Common: 0.2533, Uncommon: 0.11, Rare: 0.02 },
  Exceptional: { Common: 0.2333, Uncommon: 0.13, Rare: 0.04 },
  Flawless: { Common: 0.20, Uncommon: 0.17, Rare: 0.06 },
  Radiant: { Common: 0.1667, Uncommon: 0.20, Rare: 0.10 }
};

export const TRACE_COST_TO_RADIANT = {
  Intact: 100,
  Exceptional: 75,
  Flawless: 50,
  Radiant: 0
};

/**
 * Calculates traces needed for a relic entry to reach Radiant
 * @param {string} refinement
 * @param {number} count
 * @returns {number}
 */
export function getTracesNeeded(refinement, count) {
  const cost = TRACE_COST_TO_RADIANT[refinement] ?? 100;
  return cost * count;
}

/**
 * Calculates binomial probability of at least 1 successful drop
 * P = 1 - (1 - p)^n
 * @param {number} dropChanceDecimal e.g. 0.10 for Rare Radiant
 * @param {number} totalRelicsRolled e.g. 4 for a single 4-man Radshare
 * @returns {number} Decimal between 0 and 1
 */
export function calculateCumulativeProbability(dropChanceDecimal, totalRelicsRolled) {
  if (totalRelicsRolled <= 0 || dropChanceDecimal <= 0) return 0;
  const failureRate = 1 - dropChanceDecimal;
  return 1 - Math.pow(failureRate, totalRelicsRolled);
}

/**
 * Computes squad stock summary, trace budget, and drop chances for a given target component
 * @param {Object} component - e.g. { name: "Glaive Prime Blade", count: 2, drops: [...] }
 * @param {Array<Object>} squadMembers - List of active squad members
 * @param {Record<string, Array>} squadInventories - Map of memberId -> Array of relics
 */
export function evaluateComponentSquadStock(component, squadMembers, squadInventories) {
  const relicNames = component.drops.map(d => d.relic.trim());
  const dropRarityMap = {};
  const dropVaultMap = {};
  component.drops.forEach(d => {
    dropRarityMap[d.relic.trim()] = d.rarity;
    dropVaultMap[d.relic.trim()] = d.vaulted;
  });

  const relicRows = [];
  let squadTotalRadiants = 0;
  let squadTotalIntacts = 0;
  let squadTotalRelics = 0;
  let totalSquadTracesNeeded = 0;
  const memberTraceRequirements = {};

  squadMembers.forEach(m => {
    memberTraceRequirements[m.id] = 0;
  });

  for (const relicFullName of relicNames) {
    const parts = relicFullName.split(' ');
    const era = parts[0];
    const code = parts[1];
    const rarity = dropRarityMap[relicFullName] || 'Rare';
    const vaulted = dropVaultMap[relicFullName] || false;

    const row = {
      relicFullName,
      era,
      code,
      rarity,
      vaulted,
      members: {},
      totalCount: 0,
      totalRadiants: 0,
      tracesToRadiantAll: 0
    };

    squadMembers.forEach(member => {
      const memberRelics = squadInventories[member.id] || [];
      const matching = memberRelics.filter(r => r.era === era && r.code === code);

      let intact = 0;
      let exceptional = 0;
      let flawless = 0;
      let radiant = 0;

      matching.forEach(r => {
        if (r.refinement === 'Radiant') radiant += r.count;
        else if (r.refinement === 'Flawless') flawless += r.count;
        else if (r.refinement === 'Exceptional') exceptional += r.count;
        else intact += r.count;
      });

      const memberSum = intact + exceptional + flawless + radiant;
      const tracesForMember = (intact * 100) + (exceptional * 75) + (flawless * 50);

      memberTraceRequirements[member.id] += tracesForMember;

      row.members[member.id] = {
        intact,
        exceptional,
        flawless,
        radiant,
        total: memberSum,
        tracesNeeded: tracesForMember
      };

      row.totalCount += memberSum;
      row.totalRadiants += radiant;
      row.tracesToRadiantAll += tracesForMember;
    });

    squadTotalRelics += row.totalCount;
    squadTotalRadiants += row.totalRadiants;
    squadTotalIntacts += (row.totalCount - row.totalRadiants);
    totalSquadTracesNeeded += row.tracesToRadiantAll;

    relicRows.push(row);
  }

  // Calculate success odds
  // We determine odds based on the dominant rarity (typically Rare or Uncommon)
  const primaryRarity = component.drops[0]?.rarity || 'Rare';
  const intactDropChance = DROP_RATES['Intact'][primaryRarity] || 0.02;
  const radiantDropChance = DROP_RATES['Radiant'][primaryRarity] || 0.10;

  // Immediate odds: using existing radiants + existing non-radiants as intacts
  const pCurrentFailRadiants = Math.pow(1 - radiantDropChance, squadTotalRadiants);
  const pCurrentFailIntacts = Math.pow(1 - intactDropChance, squadTotalIntacts);
  const currentOdds = squadTotalRelics > 0 ? (1 - (pCurrentFailRadiants * pCurrentFailIntacts)) : 0;

  // Potential odds: assuming all squad relics are upgraded to Radiant
  const potentialOdds = calculateCumulativeProbability(radiantDropChance, squadTotalRelics);

  // Radshares formable (4-player concurrent radiant runs)
  // How many complete 4-man runs can be formed immediately?
  let immediateFullRadshares = 0;
  if (squadMembers.length >= 4) {
    // Member with the fewest radiants limits the immediate full radshare
    const radiantsPerMember = squadMembers.map(m => {
      let sum = 0;
      relicRows.forEach(row => {
        sum += row.members[m.id]?.radiant || 0;
      });
      return sum;
    });
    immediateFullRadshares = Math.min(...radiantsPerMember);
  } else if (squadMembers.length > 0) {
    immediateFullRadshares = Math.floor(squadTotalRadiants / squadMembers.length);
  }

  return {
    relicRows,
    squadTotalRelics,
    squadTotalRadiants,
    totalSquadTracesNeeded,
    memberTraceRequirements,
    currentOdds: Math.min(0.9999, Math.max(0, currentOdds)),
    potentialOdds: Math.min(0.9999, Math.max(0, potentialOdds)),
    immediateFullRadshares,
    primaryRarity
  };
}
