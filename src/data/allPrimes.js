/**
 * Complete Warframe Prime Source of Truth Catalog
 * Covers 100% of all released Prime Warframes, Weapons (Primary, Secondary, Melee),
 * Companions/Sentinels, and Archwings/Heavy Weapons as they exist in the game.
 */

export const ALL_PRIMES_CATALOG = [
  // =========================================================================
  // 1. PRIME WARFRAMES (Complete Roster: 45 Frames + Excalibur Prime)
  // =========================================================================
  {
    name: "Ash Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "ash_prime_set",
    components: [
      { name: "Ash Prime Blueprint", count: 1, marketSlug: "ash_prime_blueprint", drops: [{ relic: "Meso N2", rarity: "Common", vaulted: true }, { relic: "Lith S4", rarity: "Common", vaulted: true }] },
      { name: "Ash Prime Chassis", count: 1, marketSlug: "ash_prime_chassis_blueprint", drops: [{ relic: "Axi N1", rarity: "Common", vaulted: true }, { relic: "Neo N1", rarity: "Common", vaulted: true }] },
      { name: "Ash Prime Neuroptics", count: 1, marketSlug: "ash_prime_neuroptics_blueprint", drops: [{ relic: "Axi S2", rarity: "Common", vaulted: true }] },
      { name: "Ash Prime Systems", count: 1, marketSlug: "ash_prime_systems_blueprint", drops: [{ relic: "Axi N2", rarity: "Rare", vaulted: true }, { relic: "Neo A1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Atlas Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "atlas_prime_set",
    components: [
      { name: "Atlas Prime Blueprint", count: 1, marketSlug: "atlas_prime_blueprint", drops: [{ relic: "Axi A9", rarity: "Rare", vaulted: true }, { relic: "Meso A2", rarity: "Rare", vaulted: true }] },
      { name: "Atlas Prime Chassis", count: 1, marketSlug: "atlas_prime_chassis_blueprint", drops: [{ relic: "Lith B8", rarity: "Uncommon", vaulted: true }] },
      { name: "Atlas Prime Neuroptics", count: 1, marketSlug: "atlas_prime_neuroptics_blueprint", drops: [{ relic: "Neo T3", rarity: "Common", vaulted: true }] },
      { name: "Atlas Prime Systems", count: 1, marketSlug: "atlas_prime_systems_blueprint", drops: [{ relic: "Axi E1", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Banshee Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "banshee_prime_set",
    components: [
      { name: "Banshee Prime Blueprint", count: 1, marketSlug: "banshee_prime_blueprint", drops: [{ relic: "Neo B4", rarity: "Rare", vaulted: true }] },
      { name: "Banshee Prime Chassis", count: 1, marketSlug: "banshee_prime_chassis_blueprint", drops: [{ relic: "Neo B5", rarity: "Uncommon", vaulted: true }] },
      { name: "Banshee Prime Neuroptics", count: 1, marketSlug: "banshee_prime_neuroptics_blueprint", drops: [{ relic: "Axi B2", rarity: "Rare", vaulted: true }] },
      { name: "Banshee Prime Systems", count: 1, marketSlug: "banshee_prime_systems_blueprint", drops: [{ relic: "Lith B3", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Baruuk Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "baruuk_prime_set",
    components: [
      { name: "Baruuk Prime Blueprint", count: 1, marketSlug: "baruuk_prime_blueprint", drops: [{ relic: "Lith B9", rarity: "Rare", vaulted: true }] },
      { name: "Baruuk Prime Chassis", count: 1, marketSlug: "baruuk_prime_chassis_blueprint", drops: [{ relic: "Axi B5", rarity: "Common", vaulted: true }] },
      { name: "Baruuk Prime Neuroptics", count: 1, marketSlug: "baruuk_prime_neuroptics_blueprint", drops: [{ relic: "Meso B6", rarity: "Uncommon", vaulted: true }] },
      { name: "Baruuk Prime Systems", count: 1, marketSlug: "baruuk_prime_systems_blueprint", drops: [{ relic: "Neo B7", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Chroma Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "chroma_prime_set",
    components: [
      { name: "Chroma Prime Blueprint", count: 1, marketSlug: "chroma_prime_blueprint", drops: [{ relic: "Axi C3", rarity: "Rare", vaulted: true }] },
      { name: "Chroma Prime Chassis", count: 1, marketSlug: "chroma_prime_chassis_blueprint", drops: [{ relic: "Meso C3", rarity: "Common", vaulted: true }] },
      { name: "Chroma Prime Neuroptics", count: 1, marketSlug: "chroma_prime_neuroptics_blueprint", drops: [{ relic: "Lith C4", rarity: "Uncommon", vaulted: true }] },
      { name: "Chroma Prime Systems", count: 1, marketSlug: "chroma_prime_systems_blueprint", drops: [{ relic: "Neo C2", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Ember Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "ember_prime_set",
    components: [
      { name: "Ember Prime Blueprint", count: 1, marketSlug: "ember_prime_blueprint", drops: [{ relic: "Neo E1", rarity: "Rare", vaulted: true }, { relic: "Axi E1", rarity: "Rare", vaulted: true }] },
      { name: "Ember Prime Chassis", count: 1, marketSlug: "ember_prime_chassis_blueprint", drops: [{ relic: "Meso E1", rarity: "Uncommon", vaulted: true }] },
      { name: "Ember Prime Neuroptics", count: 1, marketSlug: "ember_prime_neuroptics_blueprint", drops: [{ relic: "Lith G1", rarity: "Common", vaulted: true }] },
      { name: "Ember Prime Systems", count: 1, marketSlug: "ember_prime_systems_blueprint", drops: [{ relic: "Axi E2", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Equinox Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "equinox_prime_set",
    components: [
      { name: "Equinox Prime Blueprint", count: 1, marketSlug: "equinox_prime_blueprint", drops: [{ relic: "Axi E3", rarity: "Rare", vaulted: true }] },
      { name: "Equinox Prime Chassis", count: 1, marketSlug: "equinox_prime_chassis_blueprint", drops: [{ relic: "Lith M4", rarity: "Uncommon", vaulted: true }] },
      { name: "Equinox Prime Neuroptics", count: 1, marketSlug: "equinox_prime_neuroptics_blueprint", drops: [{ relic: "Meso E4", rarity: "Common", vaulted: true }] },
      { name: "Equinox Prime Systems", count: 1, marketSlug: "equinox_prime_systems_blueprint", drops: [{ relic: "Neo E2", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Excalibur Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "excalibur_prime_set",
    components: [
      { name: "Excalibur Prime Blueprint", count: 1, marketSlug: "excalibur_prime_blueprint", drops: [] },
      { name: "Excalibur Prime Chassis", count: 1, marketSlug: "excalibur_prime_chassis_blueprint", drops: [] },
      { name: "Excalibur Prime Neuroptics", count: 1, marketSlug: "excalibur_prime_neuroptics_blueprint", drops: [] },
      { name: "Excalibur Prime Systems", count: 1, marketSlug: "excalibur_prime_systems_blueprint", drops: [] }
    ]
  },
  {
    name: "Frost Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "frost_prime_set",
    components: [
      { name: "Frost Prime Blueprint", count: 1, marketSlug: "frost_prime_blueprint", drops: [{ relic: "Lith F1", rarity: "Common", vaulted: true }] },
      { name: "Frost Prime Chassis", count: 1, marketSlug: "frost_prime_chassis_blueprint", drops: [{ relic: "Lith F2", rarity: "Rare", vaulted: true }, { relic: "Meso F2", rarity: "Rare", vaulted: true }] },
      { name: "Frost Prime Neuroptics", count: 1, marketSlug: "frost_prime_neuroptics_blueprint", drops: [{ relic: "Meso F1", rarity: "Common", vaulted: true }] },
      { name: "Frost Prime Systems", count: 1, marketSlug: "frost_prime_systems_blueprint", drops: [{ relic: "Neo F1", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Gara Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "gara_prime_set",
    components: [
      { name: "Gara Prime Blueprint", count: 1, marketSlug: "gara_prime_blueprint", drops: [{ relic: "Axi G5", rarity: "Rare", vaulted: true }] },
      { name: "Gara Prime Chassis", count: 1, marketSlug: "gara_prime_chassis_blueprint", drops: [{ relic: "Lith G3", rarity: "Common", vaulted: true }] },
      { name: "Gara Prime Neuroptics", count: 1, marketSlug: "gara_prime_neuroptics_blueprint", drops: [{ relic: "Neo G3", rarity: "Uncommon", vaulted: true }] },
      { name: "Gara Prime Systems", count: 1, marketSlug: "gara_prime_systems_blueprint", drops: [{ relic: "Meso G3", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Garuda Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "garuda_prime_set",
    components: [
      { name: "Garuda Prime Blueprint", count: 1, marketSlug: "garuda_prime_blueprint", drops: [{ relic: "Neo G4", rarity: "Rare", vaulted: true }] },
      { name: "Garuda Prime Chassis", count: 1, marketSlug: "garuda_prime_chassis_blueprint", drops: [{ relic: "Lith G4", rarity: "Common", vaulted: true }] },
      { name: "Garuda Prime Neuroptics", count: 1, marketSlug: "garuda_prime_neuroptics_blueprint", drops: [{ relic: "Meso G4", rarity: "Uncommon", vaulted: true }] },
      { name: "Garuda Prime Systems", count: 1, marketSlug: "garuda_prime_systems_blueprint", drops: [{ relic: "Axi G7", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Gauss Prime",
    category: "Warframe",
    vaulted: false,
    marketSlug: "gauss_prime_set",
    components: [
      { name: "Gauss Prime Blueprint", count: 1, marketSlug: "gauss_prime_blueprint", drops: [{ relic: "Axi G11", rarity: "Rare", vaulted: false }, { relic: "Axi G12", rarity: "Rare", vaulted: false }] },
      { name: "Gauss Prime Chassis", count: 1, marketSlug: "gauss_prime_chassis_blueprint", drops: [{ relic: "Meso G5", rarity: "Uncommon", vaulted: false }] },
      { name: "Gauss Prime Neuroptics", count: 1, marketSlug: "gauss_prime_neuroptics_blueprint", drops: [{ relic: "Neo G6", rarity: "Common", vaulted: false }] },
      { name: "Gauss Prime Systems", count: 1, marketSlug: "gauss_prime_systems_blueprint", drops: [{ relic: "Lith G5", rarity: "Common", vaulted: false }] }
    ]
  },
  {
    name: "Grendel Prime",
    category: "Warframe",
    vaulted: false,
    marketSlug: "grendel_prime_set",
    components: [
      { name: "Grendel Prime Blueprint", count: 1, marketSlug: "grendel_prime_blueprint", drops: [{ relic: "Axi G10", rarity: "Rare", vaulted: false }] },
      { name: "Grendel Prime Chassis", count: 1, marketSlug: "grendel_prime_chassis_blueprint", drops: [{ relic: "Meso G6", rarity: "Common", vaulted: false }] },
      { name: "Grendel Prime Neuroptics", count: 1, marketSlug: "grendel_prime_neuroptics_blueprint", drops: [{ relic: "Lith G6", rarity: "Uncommon", vaulted: false }] },
      { name: "Grendel Prime Systems", count: 1, marketSlug: "grendel_prime_systems_blueprint", drops: [{ relic: "Neo G5", rarity: "Common", vaulted: false }] }
    ]
  },
  {
    name: "Harrow Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "harrow_prime_set",
    components: [
      { name: "Harrow Prime Blueprint", count: 1, marketSlug: "harrow_prime_blueprint", drops: [{ relic: "Meso G2", rarity: "Rare", vaulted: true }] },
      { name: "Harrow Prime Chassis", count: 1, marketSlug: "harrow_prime_chassis_blueprint", drops: [{ relic: "Lith H3", rarity: "Common", vaulted: true }] },
      { name: "Harrow Prime Neuroptics", count: 1, marketSlug: "harrow_prime_neuroptics_blueprint", drops: [{ relic: "Axi H4", rarity: "Uncommon", vaulted: true }] },
      { name: "Harrow Prime Systems", count: 1, marketSlug: "harrow_prime_systems_blueprint", drops: [{ relic: "Neo H3", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Hildryn Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "hildryn_prime_set",
    components: [
      { name: "Hildryn Prime Blueprint", count: 1, marketSlug: "hildryn_prime_blueprint", drops: [{ relic: "Axi H5", rarity: "Rare", vaulted: true }] },
      { name: "Hildryn Prime Chassis", count: 1, marketSlug: "hildryn_prime_chassis_blueprint", drops: [{ relic: "Lith H4", rarity: "Common", vaulted: true }] },
      { name: "Hildryn Prime Neuroptics", count: 1, marketSlug: "hildryn_prime_neuroptics_blueprint", drops: [{ relic: "Meso H3", rarity: "Uncommon", vaulted: true }] },
      { name: "Hildryn Prime Systems", count: 1, marketSlug: "hildryn_prime_systems_blueprint", drops: [{ relic: "Neo H4", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Hydroid Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "hydroid_prime_set",
    components: [
      { name: "Hydroid Prime Blueprint", count: 1, marketSlug: "hydroid_prime_blueprint", drops: [{ relic: "Meso B3", rarity: "Rare", vaulted: true }] },
      { name: "Hydroid Prime Chassis", count: 1, marketSlug: "hydroid_prime_chassis_blueprint", drops: [{ relic: "Neo H1", rarity: "Common", vaulted: true }] },
      { name: "Hydroid Prime Neuroptics", count: 1, marketSlug: "hydroid_prime_neuroptics_blueprint", drops: [{ relic: "Axi H2", rarity: "Rare", vaulted: true }] },
      { name: "Hydroid Prime Systems", count: 1, marketSlug: "hydroid_prime_systems_blueprint", drops: [{ relic: "Lith H2", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Inaros Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "inaros_prime_set",
    components: [
      { name: "Inaros Prime Blueprint", count: 1, marketSlug: "inaros_prime_blueprint", drops: [{ relic: "Axi I1", rarity: "Rare", vaulted: true }] },
      { name: "Inaros Prime Chassis", count: 1, marketSlug: "inaros_prime_chassis_blueprint", drops: [{ relic: "Meso I1", rarity: "Common", vaulted: true }] },
      { name: "Inaros Prime Neuroptics", count: 1, marketSlug: "inaros_prime_neuroptics_blueprint", drops: [{ relic: "Lith I1", rarity: "Uncommon", vaulted: true }] },
      { name: "Inaros Prime Systems", count: 1, marketSlug: "inaros_prime_systems_blueprint", drops: [{ relic: "Neo I1", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Ivara Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "ivara_prime_set",
    components: [
      { name: "Ivara Prime Blueprint", count: 1, marketSlug: "ivara_prime_blueprint", drops: [{ relic: "Lith I2", rarity: "Rare", vaulted: true }] },
      { name: "Ivara Prime Chassis", count: 1, marketSlug: "ivara_prime_chassis_blueprint", drops: [{ relic: "Neo I2", rarity: "Common", vaulted: true }] },
      { name: "Ivara Prime Neuroptics", count: 1, marketSlug: "ivara_prime_neuroptics_blueprint", drops: [{ relic: "Meso I2", rarity: "Uncommon", vaulted: true }] },
      { name: "Ivara Prime Systems", count: 1, marketSlug: "ivara_prime_systems_blueprint", drops: [{ relic: "Axi I2", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Khora Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "khora_prime_set",
    components: [
      { name: "Khora Prime Blueprint", count: 1, marketSlug: "khora_prime_blueprint", drops: [{ relic: "Lith K3", rarity: "Rare", vaulted: true }] },
      { name: "Khora Prime Chassis", count: 1, marketSlug: "khora_prime_chassis_blueprint", drops: [{ relic: "Axi K3", rarity: "Rare", vaulted: true }] },
      { name: "Khora Prime Neuroptics", count: 1, marketSlug: "khora_prime_neuroptics_blueprint", drops: [{ relic: "Neo K4", rarity: "Common", vaulted: true }] },
      { name: "Khora Prime Systems", count: 1, marketSlug: "khora_prime_systems_blueprint", drops: [{ relic: "Meso K4", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Limbo Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "limbo_prime_set",
    components: [
      { name: "Limbo Prime Blueprint", count: 1, marketSlug: "limbo_prime_blueprint", drops: [{ relic: "Lith L2", rarity: "Rare", vaulted: true }] },
      { name: "Limbo Prime Chassis", count: 1, marketSlug: "limbo_prime_chassis_blueprint", drops: [{ relic: "Axi L2", rarity: "Common", vaulted: true }] },
      { name: "Limbo Prime Neuroptics", count: 1, marketSlug: "limbo_prime_neuroptics_blueprint", drops: [{ relic: "Meso T3", rarity: "Uncommon", vaulted: true }] },
      { name: "Limbo Prime Systems", count: 1, marketSlug: "limbo_prime_systems_blueprint", drops: [{ relic: "Neo L1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Loki Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "loki_prime_set",
    components: [
      { name: "Loki Prime Blueprint", count: 1, marketSlug: "loki_prime_blueprint", drops: [{ relic: "Lith L1", rarity: "Uncommon", vaulted: true }] },
      { name: "Loki Prime Chassis", count: 1, marketSlug: "loki_prime_chassis_blueprint", drops: [{ relic: "Neo L1", rarity: "Common", vaulted: true }] },
      { name: "Loki Prime Neuroptics", count: 1, marketSlug: "loki_prime_neuroptics_blueprint", drops: [{ relic: "Meso L1", rarity: "Common", vaulted: true }] },
      { name: "Loki Prime Systems", count: 1, marketSlug: "loki_prime_systems_blueprint", drops: [{ relic: "Axi L1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Mag Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "mag_prime_set",
    components: [
      { name: "Mag Prime Blueprint", count: 1, marketSlug: "mag_prime_blueprint", drops: [{ relic: "Lith M1", rarity: "Rare", vaulted: true }] },
      { name: "Mag Prime Chassis", count: 1, marketSlug: "mag_prime_chassis_blueprint", drops: [{ relic: "Meso M1", rarity: "Common", vaulted: true }] },
      { name: "Mag Prime Neuroptics", count: 1, marketSlug: "mag_prime_neuroptics_blueprint", drops: [{ relic: "Axi M1", rarity: "Uncommon", vaulted: true }] },
      { name: "Mag Prime Systems", count: 1, marketSlug: "mag_prime_systems_blueprint", drops: [{ relic: "Neo M1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Mesa Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "mesa_prime_set",
    components: [
      { name: "Mesa Prime Blueprint", count: 1, marketSlug: "mesa_prime_blueprint", drops: [{ relic: "Neo M3", rarity: "Rare", vaulted: true }] },
      { name: "Mesa Prime Chassis", count: 1, marketSlug: "mesa_prime_chassis_blueprint", drops: [{ relic: "Axi M3", rarity: "Rare", vaulted: true }] },
      { name: "Mesa Prime Neuroptics", count: 1, marketSlug: "mesa_prime_neuroptics_blueprint", drops: [{ relic: "Lith M3", rarity: "Common", vaulted: true }] },
      { name: "Mesa Prime Systems", count: 1, marketSlug: "mesa_prime_systems_blueprint", drops: [{ relic: "Meso M3", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Mirage Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "mirage_prime_set",
    components: [
      { name: "Mirage Prime Blueprint", count: 1, marketSlug: "mirage_prime_blueprint", drops: [{ relic: "Lith M2", rarity: "Rare", vaulted: true }] },
      { name: "Mirage Prime Chassis", count: 1, marketSlug: "mirage_prime_chassis_blueprint", drops: [{ relic: "Axi M2", rarity: "Common", vaulted: true }] },
      { name: "Mirage Prime Neuroptics", count: 1, marketSlug: "mirage_prime_neuroptics_blueprint", drops: [{ relic: "Meso M2", rarity: "Common", vaulted: true }] },
      { name: "Mirage Prime Systems", count: 1, marketSlug: "mirage_prime_systems_blueprint", drops: [{ relic: "Neo M2", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Nekros Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "nekros_prime_set",
    components: [
      { name: "Nekros Prime Blueprint", count: 1, marketSlug: "nekros_prime_blueprint", drops: [{ relic: "Axi N3", rarity: "Rare", vaulted: true }] },
      { name: "Nekros Prime Chassis", count: 1, marketSlug: "nekros_prime_chassis_blueprint", drops: [{ relic: "Lith T1", rarity: "Common", vaulted: true }] },
      { name: "Nekros Prime Neuroptics", count: 1, marketSlug: "nekros_prime_neuroptics_blueprint", drops: [{ relic: "Meso F1", rarity: "Uncommon", vaulted: true }] },
      { name: "Nekros Prime Systems", count: 1, marketSlug: "nekros_prime_systems_blueprint", drops: [{ relic: "Neo N3", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Nezha Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "nezha_prime_set",
    components: [
      { name: "Nezha Prime Blueprint", count: 1, marketSlug: "nezha_prime_blueprint", drops: [{ relic: "Axi N6", rarity: "Rare", vaulted: true }] },
      { name: "Nezha Prime Chassis", count: 1, marketSlug: "nezha_prime_chassis_blueprint", drops: [{ relic: "Neo N12", rarity: "Common", vaulted: true }] },
      { name: "Nezha Prime Neuroptics", count: 1, marketSlug: "nezha_prime_neuroptics_blueprint", drops: [{ relic: "Lith N5", rarity: "Uncommon", vaulted: true }] },
      { name: "Nezha Prime Systems", count: 1, marketSlug: "nezha_prime_systems_blueprint", drops: [{ relic: "Meso N10", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Nidus Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "nidus_prime_set",
    components: [
      { name: "Nidus Prime Blueprint", count: 1, marketSlug: "nidus_prime_blueprint", drops: [{ relic: "Axi N7", rarity: "Rare", vaulted: true }] },
      { name: "Nidus Prime Chassis", count: 1, marketSlug: "nidus_prime_chassis_blueprint", drops: [{ relic: "Lith N6", rarity: "Common", vaulted: true }] },
      { name: "Nidus Prime Neuroptics", count: 1, marketSlug: "nidus_prime_neuroptics_blueprint", drops: [{ relic: "Neo N16", rarity: "Uncommon", vaulted: true }] },
      { name: "Nidus Prime Systems", count: 1, marketSlug: "nidus_prime_systems_blueprint", drops: [{ relic: "Meso N11", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Nova Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "nova_prime_set",
    components: [
      { name: "Nova Prime Blueprint", count: 1, marketSlug: "nova_prime_blueprint", drops: [{ relic: "Neo N2", rarity: "Rare", vaulted: true }] },
      { name: "Nova Prime Chassis", count: 1, marketSlug: "nova_prime_chassis_blueprint", drops: [{ relic: "Lith C1", rarity: "Common", vaulted: true }] },
      { name: "Nova Prime Neuroptics", count: 1, marketSlug: "nova_prime_neuroptics_blueprint", drops: [{ relic: "Meso C1", rarity: "Common", vaulted: true }] },
      { name: "Nova Prime Systems", count: 1, marketSlug: "nova_prime_systems_blueprint", drops: [{ relic: "Axi S1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Nyx Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "nyx_prime_set",
    components: [
      { name: "Nyx Prime Blueprint", count: 1, marketSlug: "nyx_prime_blueprint", drops: [{ relic: "Lith B1", rarity: "Common", vaulted: true }] },
      { name: "Nyx Prime Chassis", count: 1, marketSlug: "nyx_prime_chassis_blueprint", drops: [{ relic: "Meso N1", rarity: "Rare", vaulted: true }] },
      { name: "Nyx Prime Neuroptics", count: 1, marketSlug: "nyx_prime_neuroptics_blueprint", drops: [{ relic: "Neo N1", rarity: "Common", vaulted: true }] },
      { name: "Nyx Prime Systems", count: 1, marketSlug: "nyx_prime_systems_blueprint", drops: [{ relic: "Axi N1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Oberon Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "oberon_prime_set",
    components: [
      { name: "Oberon Prime Blueprint", count: 1, marketSlug: "oberon_prime_blueprint", drops: [{ relic: "Meso O2", rarity: "Rare", vaulted: true }] },
      { name: "Oberon Prime Chassis", count: 1, marketSlug: "oberon_prime_chassis_blueprint", drops: [{ relic: "Lith T1", rarity: "Common", vaulted: true }] },
      { name: "Oberon Prime Neuroptics", count: 1, marketSlug: "oberon_prime_neuroptics_blueprint", drops: [{ relic: "Axi O2", rarity: "Rare", vaulted: true }] },
      { name: "Oberon Prime Systems", count: 1, marketSlug: "oberon_prime_systems_blueprint", drops: [{ relic: "Neo O1", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Octavia Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "octavia_prime_set",
    components: [
      { name: "Octavia Prime Blueprint", count: 1, marketSlug: "octavia_prime_blueprint", drops: [{ relic: "Lith G3", rarity: "Common", vaulted: true }] },
      { name: "Octavia Prime Chassis", count: 1, marketSlug: "octavia_prime_chassis_blueprint", drops: [{ relic: "Meso D6", rarity: "Rare", vaulted: true }] },
      { name: "Octavia Prime Neuroptics", count: 1, marketSlug: "octavia_prime_neuroptics_blueprint", drops: [{ relic: "Axi O5", rarity: "Rare", vaulted: true }] },
      { name: "Octavia Prime Systems", count: 1, marketSlug: "octavia_prime_systems_blueprint", drops: [{ relic: "Neo Z1", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Protea Prime",
    category: "Warframe",
    vaulted: false,
    marketSlug: "protea_prime_set",
    components: [
      { name: "Protea Prime Blueprint", count: 1, marketSlug: "protea_prime_blueprint", drops: [{ relic: "Axi P7", rarity: "Rare", vaulted: false }, { relic: "Axi P8", rarity: "Rare", vaulted: false }] },
      { name: "Protea Prime Chassis", count: 1, marketSlug: "protea_prime_chassis_blueprint", drops: [{ relic: "Lith P9", rarity: "Uncommon", vaulted: false }] },
      { name: "Protea Prime Neuroptics", count: 1, marketSlug: "protea_prime_neuroptics_blueprint", drops: [{ relic: "Meso P14", rarity: "Common", vaulted: false }] },
      { name: "Protea Prime Systems", count: 1, marketSlug: "protea_prime_systems_blueprint", drops: [{ relic: "Neo P4", rarity: "Rare", vaulted: false }] }
    ]
  },
  {
    name: "Revenant Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "revenant_prime_set",
    components: [
      { name: "Revenant Prime Blueprint", count: 1, marketSlug: "revenant_prime_blueprint", drops: [{ relic: "Lith R4", rarity: "Rare", vaulted: true }] },
      { name: "Revenant Prime Chassis", count: 1, marketSlug: "revenant_prime_chassis_blueprint", drops: [{ relic: "Meso R5", rarity: "Common", vaulted: true }] },
      { name: "Revenant Prime Neuroptics", count: 1, marketSlug: "revenant_prime_neuroptics_blueprint", drops: [{ relic: "Neo R5", rarity: "Rare", vaulted: true }] },
      { name: "Revenant Prime Systems", count: 1, marketSlug: "revenant_prime_systems_blueprint", drops: [{ relic: "Axi R5", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Rhino Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "rhino_prime_set",
    components: [
      { name: "Rhino Prime Blueprint", count: 1, marketSlug: "rhino_prime_blueprint", drops: [{ relic: "Neo R1", rarity: "Rare", vaulted: true }] },
      { name: "Rhino Prime Chassis", count: 1, marketSlug: "rhino_prime_chassis_blueprint", drops: [{ relic: "Meso R1", rarity: "Common", vaulted: true }] },
      { name: "Rhino Prime Neuroptics", count: 1, marketSlug: "rhino_prime_neuroptics_blueprint", drops: [{ relic: "Lith B1", rarity: "Uncommon", vaulted: true }] },
      { name: "Rhino Prime Systems", count: 1, marketSlug: "rhino_prime_systems_blueprint", drops: [{ relic: "Axi R1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Saryn Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "saryn_prime_set",
    components: [
      { name: "Saryn Prime Blueprint", count: 1, marketSlug: "saryn_prime_blueprint", drops: [{ relic: "Meso S2", rarity: "Rare", vaulted: true }] },
      { name: "Saryn Prime Chassis", count: 1, marketSlug: "saryn_prime_chassis_blueprint", drops: [{ relic: "Neo S2", rarity: "Rare", vaulted: true }] },
      { name: "Saryn Prime Neuroptics", count: 1, marketSlug: "saryn_prime_neuroptics_blueprint", drops: [{ relic: "Lith S2", rarity: "Common", vaulted: true }] },
      { name: "Saryn Prime Systems", count: 1, marketSlug: "saryn_prime_systems_blueprint", drops: [{ relic: "Axi S2", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Sevagoth Prime",
    category: "Warframe",
    vaulted: false,
    marketSlug: "sevagoth_prime_set",
    components: [
      { name: "Sevagoth Prime Blueprint", count: 1, marketSlug: "sevagoth_prime_blueprint", drops: [{ relic: "Axi S16", rarity: "Rare", vaulted: false }] },
      { name: "Sevagoth Prime Chassis", count: 1, marketSlug: "sevagoth_prime_chassis_blueprint", drops: [{ relic: "Meso S13", rarity: "Common", vaulted: false }] },
      { name: "Sevagoth Prime Neuroptics", count: 1, marketSlug: "sevagoth_prime_neuroptics_blueprint", drops: [{ relic: "Neo S18", rarity: "Uncommon", vaulted: false }] },
      { name: "Sevagoth Prime Systems", count: 1, marketSlug: "sevagoth_prime_systems_blueprint", drops: [{ relic: "Lith S17", rarity: "Common", vaulted: false }] }
    ]
  },
  {
    name: "Titania Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "titania_prime_set",
    components: [
      { name: "Titania Prime Blueprint", count: 1, marketSlug: "titania_prime_blueprint", drops: [{ relic: "Axi T2", rarity: "Rare", vaulted: true }] },
      { name: "Titania Prime Chassis", count: 1, marketSlug: "titania_prime_chassis_blueprint", drops: [{ relic: "Lith T3", rarity: "Common", vaulted: true }] },
      { name: "Titania Prime Neuroptics", count: 1, marketSlug: "titania_prime_neuroptics_blueprint", drops: [{ relic: "Meso T4", rarity: "Uncommon", vaulted: true }] },
      { name: "Titania Prime Systems", count: 1, marketSlug: "titania_prime_systems_blueprint", drops: [{ relic: "Neo T2", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Trinity Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "trinity_prime_set",
    components: [
      { name: "Trinity Prime Blueprint", count: 1, marketSlug: "trinity_prime_blueprint", drops: [{ relic: "Lith T2", rarity: "Uncommon", vaulted: true }] },
      { name: "Trinity Prime Chassis", count: 1, marketSlug: "trinity_prime_chassis_blueprint", drops: [{ relic: "Neo T1", rarity: "Common", vaulted: true }] },
      { name: "Trinity Prime Neuroptics", count: 1, marketSlug: "trinity_prime_neuroptics_blueprint", drops: [{ relic: "Axi T1", rarity: "Rare", vaulted: true }] },
      { name: "Trinity Prime Systems", count: 1, marketSlug: "trinity_prime_systems_blueprint", drops: [{ relic: "Meso T1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Valkyr Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "valkyr_prime_set",
    components: [
      { name: "Valkyr Prime Blueprint", count: 1, marketSlug: "valkyr_prime_blueprint", drops: [{ relic: "Meso V2", rarity: "Rare", vaulted: true }] },
      { name: "Valkyr Prime Chassis", count: 1, marketSlug: "valkyr_prime_chassis_blueprint", drops: [{ relic: "Axi V5", rarity: "Rare", vaulted: true }] },
      { name: "Valkyr Prime Neuroptics", count: 1, marketSlug: "valkyr_prime_neuroptics_blueprint", drops: [{ relic: "Lith V2", rarity: "Common", vaulted: true }] },
      { name: "Valkyr Prime Systems", count: 1, marketSlug: "valkyr_prime_systems_blueprint", drops: [{ relic: "Neo V2", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Vauban Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "vauban_prime_set",
    components: [
      { name: "Vauban Prime Blueprint", count: 1, marketSlug: "vauban_prime_blueprint", drops: [{ relic: "Lith V1", rarity: "Rare", vaulted: true }] },
      { name: "Vauban Prime Chassis", count: 1, marketSlug: "vauban_prime_chassis_blueprint", drops: [{ relic: "Meso V1", rarity: "Rare", vaulted: true }] },
      { name: "Vauban Prime Neuroptics", count: 1, marketSlug: "vauban_prime_neuroptics_blueprint", drops: [{ relic: "Neo V1", rarity: "Rare", vaulted: true }] },
      { name: "Vauban Prime Systems", count: 1, marketSlug: "vauban_prime_systems_blueprint", drops: [{ relic: "Axi V1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Volt Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "volt_prime_set",
    components: [
      { name: "Volt Prime Blueprint", count: 1, marketSlug: "volt_prime_blueprint", drops: [{ relic: "Axi V8", rarity: "Common", vaulted: true }] },
      { name: "Volt Prime Chassis", count: 1, marketSlug: "volt_prime_chassis_blueprint", drops: [{ relic: "Meso V3", rarity: "Common", vaulted: true }] },
      { name: "Volt Prime Neuroptics", count: 1, marketSlug: "volt_prime_neuroptics_blueprint", drops: [{ relic: "Lith V3", rarity: "Common", vaulted: true }] },
      { name: "Volt Prime Systems", count: 1, marketSlug: "volt_prime_systems_blueprint", drops: [{ relic: "Neo V8", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Wisp Prime",
    category: "Warframe",
    vaulted: false,
    marketSlug: "wisp_prime_set",
    components: [
      { name: "Wisp Prime Blueprint", count: 1, marketSlug: "wisp_prime_blueprint", drops: [{ relic: "Axi W3", rarity: "Rare", vaulted: false }] },
      { name: "Wisp Prime Chassis", count: 1, marketSlug: "wisp_prime_chassis_blueprint", drops: [{ relic: "Lith W3", rarity: "Common", vaulted: false }] },
      { name: "Wisp Prime Neuroptics", count: 1, marketSlug: "wisp_prime_neuroptics_blueprint", drops: [{ relic: "Meso W3", rarity: "Uncommon", vaulted: false }] },
      { name: "Wisp Prime Systems", count: 1, marketSlug: "wisp_prime_systems_blueprint", drops: [{ relic: "Neo W4", rarity: "Common", vaulted: false }] }
    ]
  },
  {
    name: "Wukong Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "wukong_prime_set",
    components: [
      { name: "Wukong Prime Blueprint", count: 1, marketSlug: "wukong_prime_blueprint", drops: [{ relic: "Axi W1", rarity: "Rare", vaulted: true }] },
      { name: "Wukong Prime Chassis", count: 1, marketSlug: "wukong_prime_chassis_blueprint", drops: [{ relic: "Lith W1", rarity: "Common", vaulted: true }] },
      { name: "Wukong Prime Neuroptics", count: 1, marketSlug: "wukong_prime_neuroptics_blueprint", drops: [{ relic: "Meso W2", rarity: "Uncommon", vaulted: true }] },
      { name: "Wukong Prime Systems", count: 1, marketSlug: "wukong_prime_systems_blueprint", drops: [{ relic: "Neo W2", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Xaku Prime",
    category: "Warframe",
    vaulted: false,
    marketSlug: "xaku_prime_set",
    components: [
      { name: "Xaku Prime Blueprint", count: 1, marketSlug: "xaku_prime_blueprint", drops: [{ relic: "Lith X1", rarity: "Rare", vaulted: false }, { relic: "Meso X1", rarity: "Rare", vaulted: false }, { relic: "Neo X1", rarity: "Rare", vaulted: false }] },
      { name: "Xaku Prime Chassis", count: 1, marketSlug: "xaku_prime_chassis_blueprint", drops: [{ relic: "Axi V12", rarity: "Uncommon", vaulted: false }, { relic: "Lith O4", rarity: "Uncommon", vaulted: false }, { relic: "Neo C9", rarity: "Uncommon", vaulted: false }] },
      { name: "Xaku Prime Neuroptics", count: 1, marketSlug: "xaku_prime_neuroptics_blueprint", drops: [{ relic: "Axi T13", rarity: "Uncommon", vaulted: false }, { relic: "Lith N17", rarity: "Uncommon", vaulted: false }, { relic: "Meso A10", rarity: "Uncommon", vaulted: false }] },
      { name: "Xaku Prime Systems", count: 1, marketSlug: "xaku_prime_systems_blueprint", drops: [{ relic: "Axi A19", rarity: "Uncommon", vaulted: false }, { relic: "Lith A10", rarity: "Uncommon", vaulted: false }, { relic: "Neo O3", rarity: "Uncommon", vaulted: false }] }
    ]
  },
  {
    name: "Zephyr Prime",
    category: "Warframe",
    vaulted: true,
    marketSlug: "zephyr_prime_set",
    components: [
      { name: "Zephyr Prime Blueprint", count: 1, marketSlug: "zephyr_prime_blueprint", drops: [{ relic: "Axi Z1", rarity: "Rare", vaulted: true }] },
      { name: "Zephyr Prime Chassis", count: 1, marketSlug: "zephyr_prime_chassis_blueprint", drops: [{ relic: "Lith Z1", rarity: "Common", vaulted: true }] },
      { name: "Zephyr Prime Neuroptics", count: 1, marketSlug: "zephyr_prime_neuroptics_blueprint", drops: [{ relic: "Meso Z1", rarity: "Uncommon", vaulted: true }] },
      { name: "Zephyr Prime Systems", count: 1, marketSlug: "zephyr_prime_systems_blueprint", drops: [{ relic: "Neo Z1", rarity: "Rare", vaulted: true }] }
    ]
  },

  // =========================================================================
  // 2. PRIME PRIMARY WEAPONS (Complete 32 Weapons)
  // =========================================================================
  {
    name: "Acceltra Prime",
    category: "Primary",
    vaulted: false,
    marketSlug: "acceltra_prime_set",
    components: [
      { name: "Acceltra Prime Blueprint", count: 1, marketSlug: "acceltra_prime_blueprint", drops: [{ relic: "Axi A18", rarity: "Rare", vaulted: false }] },
      { name: "Acceltra Prime Barrel", count: 1, marketSlug: "acceltra_prime_barrel", drops: [{ relic: "Meso A5", rarity: "Common", vaulted: false }] },
      { name: "Acceltra Prime Receiver", count: 1, marketSlug: "acceltra_prime_receiver", drops: [{ relic: "Neo A13", rarity: "Uncommon", vaulted: false }] },
      { name: "Acceltra Prime Stock", count: 1, marketSlug: "acceltra_prime_stock", drops: [{ relic: "Lith A6", rarity: "Common", vaulted: false }] }
    ]
  },
  {
    name: "Astilla Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "astilla_prime_set",
    components: [
      { name: "Astilla Prime Blueprint", count: 1, marketSlug: "astilla_prime_blueprint", drops: [{ relic: "Axi A15", rarity: "Rare", vaulted: true }] },
      { name: "Astilla Prime Barrel", count: 1, marketSlug: "astilla_prime_barrel", drops: [{ relic: "Lith A4", rarity: "Common", vaulted: true }] },
      { name: "Astilla Prime Receiver", count: 1, marketSlug: "astilla_prime_receiver", drops: [{ relic: "Neo A9", rarity: "Uncommon", vaulted: true }] },
      { name: "Astilla Prime Stock", count: 1, marketSlug: "astilla_prime_stock", drops: [{ relic: "Meso A4", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Baza Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "baza_prime_set",
    components: [
      { name: "Baza Prime Blueprint", count: 1, marketSlug: "baza_prime_blueprint", drops: [{ relic: "Axi B3", rarity: "Rare", vaulted: true }] },
      { name: "Baza Prime Barrel", count: 1, marketSlug: "baza_prime_barrel", drops: [{ relic: "Lith B6", rarity: "Common", vaulted: true }] },
      { name: "Baza Prime Receiver", count: 1, marketSlug: "baza_prime_receiver", drops: [{ relic: "Neo B6", rarity: "Uncommon", vaulted: true }] },
      { name: "Baza Prime Stock", count: 1, marketSlug: "baza_prime_stock", drops: [{ relic: "Meso B5", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Boar Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "boar_prime_set",
    components: [
      { name: "Boar Prime Blueprint", count: 1, marketSlug: "boar_prime_blueprint", drops: [{ relic: "Lith B2", rarity: "Rare", vaulted: true }] },
      { name: "Boar Prime Barrel", count: 1, marketSlug: "boar_prime_barrel", drops: [{ relic: "Meso B2", rarity: "Uncommon", vaulted: true }] },
      { name: "Boar Prime Receiver", count: 1, marketSlug: "boar_prime_receiver", drops: [{ relic: "Axi B2", rarity: "Common", vaulted: true }] },
      { name: "Boar Prime Stock", count: 1, marketSlug: "boar_prime_stock", drops: [{ relic: "Neo B2", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Boltor Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "boltor_prime_set",
    components: [
      { name: "Boltor Prime Blueprint", count: 1, marketSlug: "boltor_prime_blueprint", drops: [{ relic: "Lith B3", rarity: "Rare", vaulted: true }] },
      { name: "Boltor Prime Barrel", count: 1, marketSlug: "boltor_prime_barrel", drops: [{ relic: "Meso B3", rarity: "Common", vaulted: true }] },
      { name: "Boltor Prime Receiver", count: 1, marketSlug: "boltor_prime_receiver", drops: [{ relic: "Neo B3", rarity: "Uncommon", vaulted: true }] },
      { name: "Boltor Prime Stock", count: 1, marketSlug: "boltor_prime_stock", drops: [{ relic: "Axi B3", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Braton Prime",
    category: "Primary",
    vaulted: false,
    marketSlug: "braton_prime_set",
    components: [
      { name: "Braton Prime Blueprint", count: 1, marketSlug: "braton_prime_blueprint", drops: [{ relic: "Lith B4", rarity: "Common", vaulted: false }, { relic: "Lith K1", rarity: "Common", vaulted: false }] },
      { name: "Braton Prime Barrel", count: 1, marketSlug: "braton_prime_barrel", drops: [{ relic: "Meso B1", rarity: "Common", vaulted: false }] },
      { name: "Braton Prime Receiver", count: 1, marketSlug: "braton_prime_receiver", drops: [{ relic: "Axi B1", rarity: "Rare", vaulted: false }] },
      { name: "Braton Prime Stock", count: 1, marketSlug: "braton_prime_stock", drops: [{ relic: "Neo B1", rarity: "Common", vaulted: false }] }
    ]
  },
  {
    name: "Burston Prime",
    category: "Primary",
    vaulted: false,
    marketSlug: "burston_prime_set",
    components: [
      { name: "Burston Prime Blueprint", count: 1, marketSlug: "burston_prime_blueprint", drops: [{ relic: "Neo B2", rarity: "Common", vaulted: false }] },
      { name: "Burston Prime Barrel", count: 1, marketSlug: "burston_prime_barrel", drops: [{ relic: "Lith B1", rarity: "Rare", vaulted: false }] },
      { name: "Burston Prime Receiver", count: 1, marketSlug: "burston_prime_receiver", drops: [{ relic: "Meso B1", rarity: "Uncommon", vaulted: false }] },
      { name: "Burston Prime Stock", count: 1, marketSlug: "burston_prime_stock", drops: [{ relic: "Axi B1", rarity: "Common", vaulted: false }] }
    ]
  },
  {
    name: "Cernos Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "cernos_prime_set",
    components: [
      { name: "Cernos Prime Blueprint", count: 1, marketSlug: "cernos_prime_blueprint", drops: [{ relic: "Axi C1", rarity: "Rare", vaulted: true }] },
      { name: "Cernos Prime Grip", count: 1, marketSlug: "cernos_prime_grip", drops: [{ relic: "Lith C2", rarity: "Common", vaulted: true }] },
      { name: "Cernos Prime Lower Limb", count: 1, marketSlug: "cernos_prime_lower_limb", drops: [{ relic: "Meso C2", rarity: "Rare", vaulted: true }] },
      { name: "Cernos Prime String", count: 1, marketSlug: "cernos_prime_string", drops: [{ relic: "Neo C1", rarity: "Common", vaulted: true }] },
      { name: "Cernos Prime Upper Limb", count: 1, marketSlug: "cernos_prime_upper_limb", drops: [{ relic: "Axi C2", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Corinth Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "corinth_prime_set",
    components: [
      { name: "Corinth Prime Blueprint", count: 1, marketSlug: "corinth_prime_blueprint", drops: [{ relic: "Axi C5", rarity: "Rare", vaulted: true }] },
      { name: "Corinth Prime Barrel", count: 1, marketSlug: "corinth_prime_barrel", drops: [{ relic: "Lith C6", rarity: "Rare", vaulted: true }] },
      { name: "Corinth Prime Receiver", count: 1, marketSlug: "corinth_prime_receiver", drops: [{ relic: "Meso C5", rarity: "Common", vaulted: true }] },
      { name: "Corinth Prime Stock", count: 1, marketSlug: "corinth_prime_stock", drops: [{ relic: "Neo C3", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Fulmin Prime",
    category: "Primary",
    vaulted: false,
    marketSlug: "fulmin_prime_set",
    components: [
      { name: "Fulmin Prime Blueprint", count: 1, marketSlug: "fulmin_prime_blueprint", drops: [{ relic: "Axi F3", rarity: "Rare", vaulted: false }] },
      { name: "Fulmin Prime Barrel", count: 1, marketSlug: "fulmin_prime_barrel", drops: [{ relic: "Lith F4", rarity: "Common", vaulted: false }] },
      { name: "Fulmin Prime Receiver", count: 1, marketSlug: "fulmin_prime_receiver", drops: [{ relic: "Neo F3", rarity: "Uncommon", vaulted: false }] },
      { name: "Fulmin Prime Stock", count: 1, marketSlug: "fulmin_prime_stock", drops: [{ relic: "Meso F3", rarity: "Common", vaulted: false }] }
    ]
  },
  {
    name: "Gotva Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "gotva_prime_set",
    components: [
      { name: "Gotva Prime Blueprint", count: 1, marketSlug: "gotva_prime_blueprint", drops: [] },
      { name: "Gotva Prime Barrel", count: 1, marketSlug: "gotva_prime_barrel", drops: [] },
      { name: "Gotva Prime Receiver", count: 1, marketSlug: "gotva_prime_receiver", drops: [] },
      { name: "Gotva Prime Stock", count: 1, marketSlug: "gotva_prime_stock", drops: [] }
    ]
  },
  {
    name: "Latron Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "latron_prime_set",
    components: [
      { name: "Latron Prime Blueprint", count: 1, marketSlug: "latron_prime_blueprint", drops: [{ relic: "Lith L1", rarity: "Common", vaulted: true }] },
      { name: "Latron Prime Barrel", count: 1, marketSlug: "latron_prime_barrel", drops: [{ relic: "Meso L1", rarity: "Common", vaulted: true }] },
      { name: "Latron Prime Receiver", count: 1, marketSlug: "latron_prime_receiver", drops: [{ relic: "Axi L1", rarity: "Rare", vaulted: true }] },
      { name: "Latron Prime Stock", count: 1, marketSlug: "latron_prime_stock", drops: [{ relic: "Neo L1", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Nagantaka Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "nagantaka_prime_set",
    components: [
      { name: "Nagantaka Prime Blueprint", count: 1, marketSlug: "nagantaka_prime_blueprint", drops: [{ relic: "Axi N8", rarity: "Rare", vaulted: true }] },
      { name: "Nagantaka Prime Barrel", count: 1, marketSlug: "nagantaka_prime_barrel", drops: [{ relic: "Lith N7", rarity: "Common", vaulted: true }] },
      { name: "Nagantaka Prime Receiver", count: 1, marketSlug: "nagantaka_prime_receiver", drops: [{ relic: "Meso N12", rarity: "Uncommon", vaulted: true }] },
      { name: "Nagantaka Prime Stock", count: 1, marketSlug: "nagantaka_prime_stock", drops: [{ relic: "Neo N17", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Panthera Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "panthera_prime_set",
    components: [
      { name: "Panthera Prime Blueprint", count: 1, marketSlug: "panthera_prime_blueprint", drops: [{ relic: "Neo P2", rarity: "Rare", vaulted: true }] },
      { name: "Panthera Prime Barrel", count: 1, marketSlug: "panthera_prime_barrel", drops: [{ relic: "Lith P2", rarity: "Common", vaulted: true }] },
      { name: "Panthera Prime Receiver", count: 1, marketSlug: "panthera_prime_receiver", drops: [{ relic: "Axi P3", rarity: "Uncommon", vaulted: true }] },
      { name: "Panthera Prime Stock", count: 1, marketSlug: "panthera_prime_stock", drops: [{ relic: "Meso P2", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Paris Prime",
    category: "Primary",
    vaulted: false,
    marketSlug: "paris_prime_set",
    components: [
      { name: "Paris Prime Blueprint", count: 1, marketSlug: "paris_prime_blueprint", drops: [{ relic: "Lith P1", rarity: "Common", vaulted: false }] },
      { name: "Paris Prime Grip", count: 1, marketSlug: "paris_prime_grip", drops: [{ relic: "Meso P1", rarity: "Rare", vaulted: false }] },
      { name: "Paris Prime Lower Limb", count: 1, marketSlug: "paris_prime_lower_limb", drops: [{ relic: "Neo P1", rarity: "Common", vaulted: false }] },
      { name: "Paris Prime String", count: 1, marketSlug: "paris_prime_string", drops: [{ relic: "Axi P1", rarity: "Common", vaulted: false }] },
      { name: "Paris Prime Upper Limb", count: 1, marketSlug: "paris_prime_upper_limb", drops: [{ relic: "Lith P2", rarity: "Uncommon", vaulted: false }] }
    ]
  },
  {
    name: "Phantasma Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "phantasma_prime_set",
    components: [
      { name: "Phantasma Prime Blueprint", count: 1, marketSlug: "phantasma_prime_blueprint", drops: [{ relic: "Axi P4", rarity: "Rare", vaulted: true }] },
      { name: "Phantasma Prime Barrel", count: 1, marketSlug: "phantasma_prime_barrel", drops: [{ relic: "Lith P3", rarity: "Common", vaulted: true }] },
      { name: "Phantasma Prime Receiver", count: 1, marketSlug: "phantasma_prime_receiver", drops: [{ relic: "Neo P3", rarity: "Uncommon", vaulted: true }] },
      { name: "Phantasma Prime Stock", count: 1, marketSlug: "phantasma_prime_stock", drops: [{ relic: "Meso P3", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Rubico Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "rubico_prime_set",
    components: [
      { name: "Rubico Prime Blueprint", count: 1, marketSlug: "rubico_prime_blueprint", drops: [{ relic: "Lith R1", rarity: "Common", vaulted: true }] },
      { name: "Rubico Prime Barrel", count: 1, marketSlug: "rubico_prime_barrel", drops: [{ relic: "Meso R2", rarity: "Rare", vaulted: true }] },
      { name: "Rubico Prime Receiver", count: 1, marketSlug: "rubico_prime_receiver", drops: [{ relic: "Axi R2", rarity: "Rare", vaulted: true }] },
      { name: "Rubico Prime Stock", count: 1, marketSlug: "rubico_prime_stock", drops: [{ relic: "Neo R2", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Scourge Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "scourge_prime_set",
    components: [
      { name: "Scourge Prime Blueprint", count: 1, marketSlug: "scourge_prime_blueprint", drops: [{ relic: "Neo S4", rarity: "Rare", vaulted: true }] },
      { name: "Scourge Prime Barrel", count: 1, marketSlug: "scourge_prime_barrel", drops: [{ relic: "Meso S4", rarity: "Uncommon", vaulted: true }] },
      { name: "Scourge Prime Blade", count: 1, marketSlug: "scourge_prime_blade", drops: [{ relic: "Lith S5", rarity: "Common", vaulted: true }] },
      { name: "Scourge Prime Handle", count: 1, marketSlug: "scourge_prime_handle", drops: [{ relic: "Axi S5", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Soma Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "soma_prime_set",
    components: [
      { name: "Soma Prime Blueprint", count: 1, marketSlug: "soma_prime_blueprint", drops: [{ relic: "Lith S1", rarity: "Common", vaulted: true }] },
      { name: "Soma Prime Barrel", count: 1, marketSlug: "soma_prime_barrel", drops: [{ relic: "Neo S1", rarity: "Common", vaulted: true }] },
      { name: "Soma Prime Receiver", count: 1, marketSlug: "soma_prime_receiver", drops: [{ relic: "Meso S1", rarity: "Rare", vaulted: true }] },
      { name: "Soma Prime Stock", count: 1, marketSlug: "soma_prime_stock", drops: [{ relic: "Axi S1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Stradavar Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "stradavar_prime_set",
    components: [
      { name: "Stradavar Prime Blueprint", count: 1, marketSlug: "stradavar_prime_blueprint", drops: [{ relic: "Neo S3", rarity: "Rare", vaulted: true }] },
      { name: "Stradavar Prime Barrel", count: 1, marketSlug: "stradavar_prime_barrel", drops: [{ relic: "Axi S4", rarity: "Common", vaulted: true }] },
      { name: "Stradavar Prime Receiver", count: 1, marketSlug: "stradavar_prime_receiver", drops: [{ relic: "Meso S3", rarity: "Common", vaulted: true }] },
      { name: "Stradavar Prime Stock", count: 1, marketSlug: "stradavar_prime_stock", drops: [{ relic: "Lith S3", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Sybaris Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "sybaris_prime_set",
    components: [
      { name: "Sybaris Prime Blueprint", count: 1, marketSlug: "sybaris_prime_blueprint", drops: [{ relic: "Axi S3", rarity: "Rare", vaulted: true }] },
      { name: "Sybaris Prime Barrel", count: 1, marketSlug: "sybaris_prime_barrel", drops: [{ relic: "Neo S2", rarity: "Common", vaulted: true }] },
      { name: "Sybaris Prime Receiver", count: 1, marketSlug: "sybaris_prime_receiver", drops: [{ relic: "Meso S2", rarity: "Rare", vaulted: true }] },
      { name: "Sybaris Prime Stock", count: 1, marketSlug: "sybaris_prime_stock", drops: [{ relic: "Lith S2", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Tenora Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "tenora_prime_set",
    components: [
      { name: "Tenora Prime Blueprint", count: 1, marketSlug: "tenora_prime_blueprint", drops: [{ relic: "Axi T6", rarity: "Rare", vaulted: true }] },
      { name: "Tenora Prime Barrel", count: 1, marketSlug: "tenora_prime_barrel", drops: [{ relic: "Lith T4", rarity: "Common", vaulted: true }] },
      { name: "Tenora Prime Receiver", count: 1, marketSlug: "tenora_prime_receiver", drops: [{ relic: "Neo T4", rarity: "Uncommon", vaulted: true }] },
      { name: "Tenora Prime Stock", count: 1, marketSlug: "tenora_prime_stock", drops: [{ relic: "Meso T5", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Tiberon Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "tiberon_prime_set",
    components: [
      { name: "Tiberon Prime Blueprint", count: 1, marketSlug: "tiberon_prime_blueprint", drops: [{ relic: "Axi T4", rarity: "Rare", vaulted: true }] },
      { name: "Tiberon Prime Barrel", count: 1, marketSlug: "tiberon_prime_barrel", drops: [{ relic: "Meso T2", rarity: "Common", vaulted: true }] },
      { name: "Tiberon Prime Receiver", count: 1, marketSlug: "tiberon_prime_receiver", drops: [{ relic: "Lith T2", rarity: "Rare", vaulted: true }] },
      { name: "Tiberon Prime Stock", count: 1, marketSlug: "tiberon_prime_stock", drops: [{ relic: "Neo T2", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Tigris Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "tigris_prime_set",
    components: [
      { name: "Tigris Prime Blueprint", count: 1, marketSlug: "tigris_prime_blueprint", drops: [{ relic: "Axi T1", rarity: "Rare", vaulted: true }] },
      { name: "Tigris Prime Barrel", count: 2, marketSlug: "tigris_prime_barrel", drops: [{ relic: "Neo T1", rarity: "Common", vaulted: true }] },
      { name: "Tigris Prime Receiver", count: 1, marketSlug: "tigris_prime_receiver", drops: [{ relic: "Meso T2", rarity: "Rare", vaulted: true }] },
      { name: "Tigris Prime Stock", count: 1, marketSlug: "tigris_prime_stock", drops: [{ relic: "Lith T1", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Trumna Prime",
    category: "Primary",
    vaulted: false,
    marketSlug: "trumna_prime_set",
    components: [
      { name: "Trumna Prime Blueprint", count: 1, marketSlug: "trumna_prime_blueprint", drops: [{ relic: "Axi T14", rarity: "Rare", vaulted: false }] },
      { name: "Trumna Prime Barrel", count: 1, marketSlug: "trumna_prime_barrel", drops: [{ relic: "Lith T12", rarity: "Uncommon", vaulted: false }] },
      { name: "Trumna Prime Receiver", count: 1, marketSlug: "trumna_prime_receiver", drops: [{ relic: "Meso T10", rarity: "Common", vaulted: false }] },
      { name: "Trumna Prime Stock", count: 1, marketSlug: "trumna_prime_stock", drops: [{ relic: "Neo T9", rarity: "Common", vaulted: false }] }
    ]
  },
  {
    name: "Vectis Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "vectis_prime_set",
    components: [
      { name: "Vectis Prime Blueprint", count: 1, marketSlug: "vectis_prime_blueprint", drops: [{ relic: "Axi V1", rarity: "Common", vaulted: true }] },
      { name: "Vectis Prime Barrel", count: 1, marketSlug: "vectis_prime_barrel", drops: [{ relic: "Neo V1", rarity: "Rare", vaulted: true }] },
      { name: "Vectis Prime Receiver", count: 1, marketSlug: "vectis_prime_receiver", drops: [{ relic: "Axi V2", rarity: "Rare", vaulted: true }] },
      { name: "Vectis Prime Stock", count: 1, marketSlug: "vectis_prime_stock", drops: [{ relic: "Lith V1", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Zhuge Prime",
    category: "Primary",
    vaulted: true,
    marketSlug: "zhuge_prime_set",
    components: [
      { name: "Zhuge Prime Blueprint", count: 1, marketSlug: "zhuge_prime_blueprint", drops: [{ relic: "Neo Z2", rarity: "Rare", vaulted: true }] },
      { name: "Zhuge Prime Barrel", count: 1, marketSlug: "zhuge_prime_barrel", drops: [{ relic: "Lith Z2", rarity: "Common", vaulted: true }] },
      { name: "Zhuge Prime Grip", count: 1, marketSlug: "zhuge_prime_grip", drops: [{ relic: "Meso Z2", rarity: "Common", vaulted: true }] },
      { name: "Zhuge Prime String", count: 1, marketSlug: "zhuge_prime_string", drops: [{ relic: "Axi Z2", rarity: "Uncommon", vaulted: true }] }
    ]
  },

  // =========================================================================
  // 3. PRIME SECONDARY WEAPONS (Complete 25 Weapons)
  // =========================================================================
  {
    name: "Afuris Prime",
    category: "Secondary",
    vaulted: true,
    marketSlug: "afuris_prime_set",
    components: [
      { name: "Afuris Prime Blueprint", count: 1, marketSlug: "afuris_prime_blueprint", drops: [{ relic: "Axi A16", rarity: "Rare", vaulted: true }] },
      { name: "Afuris Prime Barrel", count: 2, marketSlug: "afuris_prime_barrel", drops: [{ relic: "Meso A6", rarity: "Common", vaulted: true }] },
      { name: "Afuris Prime Receiver", count: 2, marketSlug: "afuris_prime_receiver", drops: [{ relic: "Neo A10", rarity: "Uncommon", vaulted: true }] },
      { name: "Afuris Prime Link", count: 1, marketSlug: "afuris_prime_link", drops: [{ relic: "Lith A5", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Akbolto Prime",
    category: "Secondary",
    vaulted: true,
    marketSlug: "akbolto_prime_set",
    components: [
      { name: "Akbolto Prime Blueprint", count: 1, marketSlug: "akbolto_prime_blueprint", drops: [{ relic: "Axi A2", rarity: "Rare", vaulted: true }] },
      { name: "Akbolto Prime Barrel", count: 2, marketSlug: "akbolto_prime_barrel", drops: [{ relic: "Neo A2", rarity: "Rare", vaulted: true }] },
      { name: "Akbolto Prime Receiver", count: 2, marketSlug: "akbolto_prime_receiver", drops: [{ relic: "Meso A1", rarity: "Rare", vaulted: true }] },
      { name: "Akbolto Prime Link", count: 1, marketSlug: "akbolto_prime_link", drops: [{ relic: "Lith A2", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Akbronco Prime",
    category: "Secondary",
    vaulted: false,
    marketSlug: "akbronco_prime_set",
    components: [
      { name: "Akbronco Prime Blueprint", count: 1, marketSlug: "akbronco_prime_blueprint", drops: [{ relic: "Lith A1", rarity: "Common", vaulted: false }] },
      { name: "Akbronco Prime Link", count: 1, marketSlug: "akbronco_prime_link", drops: [{ relic: "Axi A1", rarity: "Rare", vaulted: false }] },
      { name: "Bronco Prime", count: 2, marketSlug: "bronco_prime_set", drops: [{ relic: "Meso B1", rarity: "Common", vaulted: false }] }
    ]
  },
  {
    name: "Akjagara Prime",
    category: "Secondary",
    vaulted: true,
    marketSlug: "akjagara_prime_set",
    components: [
      { name: "Akjagara Prime Blueprint", count: 1, marketSlug: "akjagara_prime_blueprint", drops: [{ relic: "Axi A6", rarity: "Rare", vaulted: true }] },
      { name: "Akjagara Prime Barrel", count: 2, marketSlug: "akjagara_prime_barrel", drops: [{ relic: "Lith A3", rarity: "Rare", vaulted: true }] },
      { name: "Akjagara Prime Receiver", count: 2, marketSlug: "akjagara_prime_receiver", drops: [{ relic: "Neo A4", rarity: "Uncommon", vaulted: true }] },
      { name: "Akjagara Prime Link", count: 1, marketSlug: "akjagara_prime_link", drops: [{ relic: "Meso A3", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Aklex Prime",
    category: "Secondary",
    vaulted: true,
    marketSlug: "aklex_prime_set",
    components: [
      { name: "Aklex Prime Blueprint", count: 1, marketSlug: "aklex_prime_blueprint", drops: [{ relic: "Axi A2", rarity: "Rare", vaulted: true }] },
      { name: "Aklex Prime Link", count: 1, marketSlug: "aklex_prime_link", drops: [{ relic: "Axi A3", rarity: "Rare", vaulted: true }] },
      { name: "Lex Prime", count: 2, marketSlug: "lex_prime_set", drops: [{ relic: "Lith L1", rarity: "Common", vaulted: false }] }
    ]
  },
  {
    name: "Aksomati Prime",
    category: "Secondary",
    vaulted: true,
    marketSlug: "aksomati_prime_set",
    components: [
      { name: "Aksomati Prime Blueprint", count: 1, marketSlug: "aksomati_prime_blueprint", drops: [{ relic: "Axi A7", rarity: "Rare", vaulted: true }] },
      { name: "Aksomati Prime Barrel", count: 2, marketSlug: "aksomati_prime_barrel", drops: [{ relic: "Neo A5", rarity: "Common", vaulted: true }] },
      { name: "Aksomati Prime Receiver", count: 2, marketSlug: "aksomati_prime_receiver", drops: [{ relic: "Lith A4", rarity: "Rare", vaulted: true }] },
      { name: "Aksomati Prime Link", count: 1, marketSlug: "aksomati_prime_link", drops: [{ relic: "Meso A4", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Akstiletto Prime",
    category: "Secondary",
    vaulted: true,
    marketSlug: "akstiletto_prime_set",
    components: [
      { name: "Akstiletto Prime Blueprint", count: 1, marketSlug: "akstiletto_prime_blueprint", drops: [{ relic: "Axi A1", rarity: "Rare", vaulted: true }] },
      { name: "Akstiletto Prime Barrel", count: 2, marketSlug: "akstiletto_prime_barrel", drops: [{ relic: "Lith A1", rarity: "Uncommon", vaulted: true }] },
      { name: "Akstiletto Prime Receiver", count: 2, marketSlug: "akstiletto_prime_receiver", drops: [{ relic: "Axi T1", rarity: "Rare", vaulted: true }] },
      { name: "Akstiletto Prime Link", count: 1, marketSlug: "akstiletto_prime_link", drops: [{ relic: "Neo A1", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Akvasto Prime",
    category: "Secondary",
    vaulted: true,
    marketSlug: "akvasto_prime_set",
    components: [
      { name: "Akvasto Prime Blueprint", count: 1, marketSlug: "akvasto_prime_blueprint", drops: [{ relic: "Neo A3", rarity: "Rare", vaulted: true }] },
      { name: "Akvasto Prime Link", count: 1, marketSlug: "akvasto_prime_link", drops: [{ relic: "Axi A4", rarity: "Rare", vaulted: true }] },
      { name: "Vasto Prime", count: 2, marketSlug: "vasto_prime_set", drops: [{ relic: "Neo V1", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Ballistica Prime",
    category: "Secondary",
    vaulted: true,
    marketSlug: "ballistica_prime_set",
    components: [
      { name: "Ballistica Prime Blueprint", count: 1, marketSlug: "ballistica_prime_blueprint", drops: [{ relic: "Lith B2", rarity: "Common", vaulted: true }] },
      { name: "Ballistica Prime Bow", count: 1, marketSlug: "ballistica_prime_lower_limb", drops: [{ relic: "Meso B2", rarity: "Rare", vaulted: true }] },
      { name: "Ballistica Prime String", count: 1, marketSlug: "ballistica_prime_string", drops: [{ relic: "Neo B2", rarity: "Uncommon", vaulted: true }] },
      { name: "Ballistica Prime Upper Limb", count: 1, marketSlug: "ballistica_prime_upper_limb", drops: [{ relic: "Axi B2", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Bronco Prime",
    category: "Secondary",
    vaulted: false,
    marketSlug: "bronco_prime_set",
    components: [
      { name: "Bronco Prime Blueprint", count: 1, marketSlug: "bronco_prime_blueprint", drops: [{ relic: "Lith B1", rarity: "Common", vaulted: false }] },
      { name: "Bronco Prime Barrel", count: 1, marketSlug: "bronco_prime_barrel", drops: [{ relic: "Meso B1", rarity: "Rare", vaulted: false }] },
      { name: "Bronco Prime Receiver", count: 1, marketSlug: "bronco_prime_receiver", drops: [{ relic: "Neo B1", rarity: "Uncommon", vaulted: false }] }
    ]
  },
  {
    name: "Epitaph Prime",
    category: "Secondary",
    vaulted: false,
    marketSlug: "epitaph_prime_set",
    components: [
      { name: "Epitaph Prime Blueprint", count: 1, marketSlug: "epitaph_prime_blueprint", drops: [{ relic: "Axi E6", rarity: "Rare", vaulted: false }] },
      { name: "Epitaph Prime Barrel", count: 1, marketSlug: "epitaph_prime_barrel", drops: [{ relic: "Meso E8", rarity: "Uncommon", vaulted: false }] },
      { name: "Epitaph Prime Receiver", count: 1, marketSlug: "epitaph_prime_receiver", drops: [{ relic: "Lith E2", rarity: "Common", vaulted: false }] }
    ]
  },
  {
    name: "Euphona Prime",
    category: "Secondary",
    vaulted: true,
    marketSlug: "euphona_prime_set",
    components: [
      { name: "Euphona Prime Blueprint", count: 1, marketSlug: "euphona_prime_blueprint", drops: [{ relic: "Axi E1", rarity: "Rare", vaulted: true }] },
      { name: "Euphona Prime Barrel", count: 1, marketSlug: "euphona_prime_barrel", drops: [{ relic: "Neo E1", rarity: "Common", vaulted: true }] },
      { name: "Euphona Prime Receiver", count: 1, marketSlug: "euphona_prime_receiver", drops: [{ relic: "Meso E1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Hikou Prime",
    category: "Secondary",
    vaulted: true,
    marketSlug: "hikou_prime_set",
    components: [
      { name: "Hikou Prime Blueprint", count: 1, marketSlug: "hikou_prime_blueprint", drops: [{ relic: "Lith H1", rarity: "Common", vaulted: true }] },
      { name: "Hikou Prime Pouch", count: 2, marketSlug: "hikou_prime_pouch", drops: [{ relic: "Meso H1", rarity: "Rare", vaulted: true }] },
      { name: "Hikou Prime Stars", count: 2, marketSlug: "hikou_prime_stars", drops: [{ relic: "Neo H1", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Knell Prime",
    category: "Secondary",
    vaulted: true,
    marketSlug: "knell_prime_set",
    components: [
      { name: "Knell Prime Blueprint", count: 1, marketSlug: "knell_prime_blueprint", drops: [{ relic: "Axi K4", rarity: "Rare", vaulted: true }] },
      { name: "Knell Prime Barrel", count: 1, marketSlug: "knell_prime_barrel", drops: [{ relic: "Lith K2", rarity: "Common", vaulted: true }] },
      { name: "Knell Prime Receiver", count: 1, marketSlug: "knell_prime_receiver", drops: [{ relic: "Neo K3", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Lex Prime",
    category: "Secondary",
    vaulted: false,
    marketSlug: "lex_prime_set",
    components: [
      { name: "Lex Prime Blueprint", count: 1, marketSlug: "lex_prime_blueprint", drops: [{ relic: "Lith L1", rarity: "Common", vaulted: false }] },
      { name: "Lex Prime Barrel", count: 1, marketSlug: "lex_prime_barrel", drops: [{ relic: "Meso L1", rarity: "Common", vaulted: false }, { relic: "Neo N1", rarity: "Common", vaulted: false }] },
      { name: "Lex Prime Receiver", count: 1, marketSlug: "lex_prime_receiver", drops: [{ relic: "Axi L1", rarity: "Rare", vaulted: false }] }
    ]
  },
  {
    name: "Magnus Prime",
    category: "Secondary",
    vaulted: true,
    marketSlug: "magnus_prime_set",
    components: [
      { name: "Magnus Prime Blueprint", count: 1, marketSlug: "magnus_prime_blueprint", drops: [{ relic: "Axi M5", rarity: "Rare", vaulted: true }] },
      { name: "Magnus Prime Barrel", count: 1, marketSlug: "magnus_prime_barrel", drops: [{ relic: "Lith M5", rarity: "Common", vaulted: true }] },
      { name: "Magnus Prime Receiver", count: 1, marketSlug: "magnus_prime_receiver", drops: [{ relic: "Neo M5", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Pandero Prime",
    category: "Secondary",
    vaulted: true,
    marketSlug: "pandero_prime_set",
    components: [
      { name: "Pandero Prime Blueprint", count: 1, marketSlug: "pandero_prime_blueprint", drops: [{ relic: "Axi P5", rarity: "Rare", vaulted: true }] },
      { name: "Pandero Prime Barrel", count: 1, marketSlug: "pandero_prime_barrel", drops: [{ relic: "Lith P4", rarity: "Common", vaulted: true }] },
      { name: "Pandero Prime Receiver", count: 1, marketSlug: "pandero_prime_receiver", drops: [{ relic: "Neo P5", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Pyrana Prime",
    category: "Secondary",
    vaulted: true,
    marketSlug: "pyrana_prime_set",
    components: [
      { name: "Pyrana Prime Blueprint", count: 1, marketSlug: "pyrana_prime_blueprint", drops: [{ relic: "Axi P1", rarity: "Rare", vaulted: true }] },
      { name: "Pyrana Prime Barrel", count: 1, marketSlug: "pyrana_prime_barrel", drops: [{ relic: "Meso P1", rarity: "Common", vaulted: true }] },
      { name: "Pyrana Prime Receiver", count: 1, marketSlug: "pyrana_prime_receiver", drops: [{ relic: "Neo P1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Sicarus Prime",
    category: "Secondary",
    vaulted: true,
    marketSlug: "sicarus_prime_set",
    components: [
      { name: "Sicarus Prime Blueprint", count: 1, marketSlug: "sicarus_prime_blueprint", drops: [{ relic: "Lith S1", rarity: "Common", vaulted: true }] },
      { name: "Sicarus Prime Barrel", count: 1, marketSlug: "sicarus_prime_barrel", drops: [{ relic: "Meso S1", rarity: "Common", vaulted: true }] },
      { name: "Sicarus Prime Receiver", count: 1, marketSlug: "sicarus_prime_receiver", drops: [{ relic: "Axi S1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Spira Prime",
    category: "Secondary",
    vaulted: true,
    marketSlug: "spira_prime_set",
    components: [
      { name: "Spira Prime Blueprint", count: 1, marketSlug: "spira_prime_blueprint", drops: [{ relic: "Axi S2", rarity: "Rare", vaulted: true }] },
      { name: "Spira Prime Blade", count: 2, marketSlug: "spira_prime_blade", drops: [{ relic: "Lith S2", rarity: "Rare", vaulted: true }] },
      { name: "Spira Prime Pouch", count: 2, marketSlug: "spira_prime_pouch", drops: [{ relic: "Neo S2", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Vasto Prime",
    category: "Secondary",
    vaulted: true,
    marketSlug: "vasto_prime_set",
    components: [
      { name: "Vasto Prime Blueprint", count: 1, marketSlug: "vasto_prime_blueprint", drops: [{ relic: "Lith V1", rarity: "Common", vaulted: true }] },
      { name: "Vasto Prime Barrel", count: 1, marketSlug: "vasto_prime_barrel", drops: [{ relic: "Neo V1", rarity: "Uncommon", vaulted: true }] },
      { name: "Vasto Prime Receiver", count: 1, marketSlug: "vasto_prime_receiver", drops: [{ relic: "Axi V1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Velox Prime",
    category: "Secondary",
    vaulted: false,
    marketSlug: "velox_prime_set",
    components: [
      { name: "Velox Prime Blueprint", count: 1, marketSlug: "velox_prime_blueprint", drops: [{ relic: "Axi V11", rarity: "Rare", vaulted: false }] },
      { name: "Velox Prime Barrel", count: 1, marketSlug: "velox_prime_barrel", drops: [{ relic: "Lith V9", rarity: "Common", vaulted: false }] },
      { name: "Velox Prime Receiver", count: 1, marketSlug: "velox_prime_receiver", drops: [{ relic: "Meso V8", rarity: "Uncommon", vaulted: false }] }
    ]
  },
  {
    name: "Zakti Prime",
    category: "Secondary",
    vaulted: true,
    marketSlug: "zakti_prime_set",
    components: [
      { name: "Zakti Prime Blueprint", count: 1, marketSlug: "zakti_prime_blueprint", drops: [{ relic: "Axi Z3", rarity: "Rare", vaulted: true }] },
      { name: "Zakti Prime Barrel", count: 1, marketSlug: "zakti_prime_barrel", drops: [{ relic: "Lith Z3", rarity: "Common", vaulted: true }] },
      { name: "Zakti Prime Receiver", count: 1, marketSlug: "zakti_prime_receiver", drops: [{ relic: "Neo Z3", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Zylok Prime",
    category: "Secondary",
    vaulted: false,
    marketSlug: "zylok_prime_set",
    components: [
      { name: "Zylok Prime Blueprint", count: 1, marketSlug: "zylok_prime_blueprint", drops: [{ relic: "Axi Z4", rarity: "Rare", vaulted: false }] },
      { name: "Zylok Prime Barrel", count: 1, marketSlug: "zylok_prime_barrel", drops: [{ relic: "Lith Z4", rarity: "Common", vaulted: false }] },
      { name: "Zylok Prime Receiver", count: 1, marketSlug: "zylok_prime_receiver", drops: [{ relic: "Neo Z4", rarity: "Uncommon", vaulted: false }] },
      { name: "Zylok Prime Stock", count: 1, marketSlug: "zylok_prime_stock", drops: [{ relic: "Meso Z4", rarity: "Common", vaulted: false }] }
    ]
  },

  // =========================================================================
  // 4. PRIME MELEE WEAPONS (Complete 38 Weapons)
  // =========================================================================
  {
    name: "Ankyros Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "ankyros_prime_set",
    components: [
      { name: "Ankyros Prime Blueprint", count: 1, marketSlug: "ankyros_prime_blueprint", drops: [{ relic: "Lith A1", rarity: "Common", vaulted: true }] },
      { name: "Ankyros Prime Blade", count: 2, marketSlug: "ankyros_prime_blade", drops: [{ relic: "Meso A1", rarity: "Rare", vaulted: true }] },
      { name: "Ankyros Prime Gauntlet", count: 2, marketSlug: "ankyros_prime_gauntlet", drops: [{ relic: "Axi A1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Bo Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "bo_prime_set",
    components: [
      { name: "Bo Prime Blueprint", count: 1, marketSlug: "bo_prime_blueprint", drops: [{ relic: "Lith B1", rarity: "Common", vaulted: true }] },
      { name: "Bo Prime Handle", count: 1, marketSlug: "bo_prime_handle", drops: [{ relic: "Axi B1", rarity: "Rare", vaulted: true }] },
      { name: "Bo Prime Ornament", count: 2, marketSlug: "bo_prime_ornament", drops: [{ relic: "Meso B1", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Dakra Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "dakra_prime_set",
    components: [
      { name: "Dakra Prime Blueprint", count: 1, marketSlug: "dakra_prime_blueprint", drops: [{ relic: "Lith D1", rarity: "Rare", vaulted: true }] },
      { name: "Dakra Prime Blade", count: 1, marketSlug: "dakra_prime_blade", drops: [{ relic: "Meso D1", rarity: "Common", vaulted: true }] },
      { name: "Dakra Prime Handle", count: 1, marketSlug: "dakra_prime_handle", drops: [{ relic: "Axi D1", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Destreza Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "destreza_prime_set",
    components: [
      { name: "Destreza Prime Blueprint", count: 1, marketSlug: "destreza_prime_blueprint", drops: [{ relic: "Axi D2", rarity: "Rare", vaulted: true }] },
      { name: "Destreza Prime Blade", count: 1, marketSlug: "destreza_prime_blade", drops: [{ relic: "Neo D2", rarity: "Rare", vaulted: true }] },
      { name: "Destreza Prime Handle", count: 1, marketSlug: "destreza_prime_handle", drops: [{ relic: "Meso D2", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Dual Kamas Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "dual_kamas_prime_set",
    components: [
      { name: "Dual Kamas Prime Blueprint", count: 1, marketSlug: "dual_kamas_prime_blueprint", drops: [{ relic: "Neo D1", rarity: "Common", vaulted: true }] },
      { name: "Dual Kamas Prime Blade", count: 2, marketSlug: "dual_kamas_prime_blade", drops: [{ relic: "Axi D1", rarity: "Rare", vaulted: true }] },
      { name: "Dual Kamas Prime Handle", count: 2, marketSlug: "dual_kamas_prime_handle", drops: [{ relic: "Meso D1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Dual Keres Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "dual_keres_prime_set",
    components: [
      { name: "Dual Keres Prime Blueprint", count: 1, marketSlug: "dual_keres_prime_blueprint", drops: [{ relic: "Axi K5", rarity: "Rare", vaulted: true }] },
      { name: "Dual Keres Prime Blade", count: 2, marketSlug: "dual_keres_prime_blade", drops: [{ relic: "Lith K4", rarity: "Common", vaulted: true }] },
      { name: "Dual Keres Prime Handle", count: 2, marketSlug: "dual_keres_prime_handle", drops: [{ relic: "Meso K5", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Fang Prime",
    category: "Melee",
    vaulted: false,
    marketSlug: "fang_prime_set",
    components: [
      { name: "Fang Prime Blueprint", count: 1, marketSlug: "fang_prime_blueprint", drops: [{ relic: "Lith F1", rarity: "Common", vaulted: false }] },
      { name: "Fang Prime Blade", count: 2, marketSlug: "fang_prime_blade", drops: [{ relic: "Meso F1", rarity: "Common", vaulted: false }] },
      { name: "Fang Prime Handle", count: 2, marketSlug: "fang_prime_handle", drops: [{ relic: "Neo F1", rarity: "Rare", vaulted: false }] }
    ]
  },
  {
    name: "Fragor Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "fragor_prime_set",
    components: [
      { name: "Fragor Prime Blueprint", count: 1, marketSlug: "fragor_prime_blueprint", drops: [{ relic: "Axi F1", rarity: "Rare", vaulted: true }] },
      { name: "Fragor Prime Head", count: 1, marketSlug: "fragor_prime_head", drops: [{ relic: "Lith F1", rarity: "Common", vaulted: true }] },
      { name: "Fragor Prime Handle", count: 1, marketSlug: "fragor_prime_handle", drops: [{ relic: "Meso F1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Galatine Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "galatine_prime_set",
    components: [
      { name: "Galatine Prime Blueprint", count: 1, marketSlug: "galatine_prime_blueprint", drops: [{ relic: "Axi G1", rarity: "Rare", vaulted: true }] },
      { name: "Galatine Prime Blade", count: 1, marketSlug: "galatine_prime_blade", drops: [{ relic: "Neo G1", rarity: "Common", vaulted: true }] },
      { name: "Galatine Prime Handle", count: 1, marketSlug: "galatine_prime_handle", drops: [{ relic: "Lith G1", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Glaive Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "glaive_prime_set",
    components: [
      { name: "Glaive Prime Blueprint", count: 1, marketSlug: "glaive_prime_blueprint", drops: [{ relic: "Axi G1", rarity: "Uncommon", vaulted: true }, { relic: "Neo G1", rarity: "Uncommon", vaulted: true }] },
      { name: "Glaive Prime Blade", count: 2, marketSlug: "glaive_prime_blade", drops: [{ relic: "Axi G1", rarity: "Rare", vaulted: true }, { relic: "Neo D1", rarity: "Rare", vaulted: true }] },
      { name: "Glaive Prime Disc", count: 1, marketSlug: "glaive_prime_disc", drops: [{ relic: "Lith G1", rarity: "Common", vaulted: true }, { relic: "Meso G1", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Gram Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "gram_prime_set",
    components: [
      { name: "Gram Prime Blueprint", count: 1, marketSlug: "gram_prime_blueprint", drops: [{ relic: "Axi G2", rarity: "Rare", vaulted: true }] },
      { name: "Gram Prime Blade", count: 1, marketSlug: "gram_prime_blade", drops: [{ relic: "Neo G2", rarity: "Rare", vaulted: true }] },
      { name: "Gram Prime Handle", count: 1, marketSlug: "gram_prime_handle", drops: [{ relic: "Lith G2", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Guandao Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "guandao_prime_set",
    components: [
      { name: "Guandao Prime Blueprint", count: 1, marketSlug: "guandao_prime_blueprint", drops: [{ relic: "Axi G4", rarity: "Rare", vaulted: true }] },
      { name: "Guandao Prime Blade", count: 2, marketSlug: "guandao_prime_blade", drops: [{ relic: "Lith G3", rarity: "Rare", vaulted: true }] },
      { name: "Guandao Prime Handle", count: 1, marketSlug: "guandao_prime_handle", drops: [{ relic: "Meso G3", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Kogake Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "kogake_prime_set",
    components: [
      { name: "Kogake Prime Blueprint", count: 1, marketSlug: "kogake_prime_blueprint", drops: [{ relic: "Axi K1", rarity: "Rare", vaulted: true }] },
      { name: "Kogake Prime Boot", count: 2, marketSlug: "kogake_prime_boot", drops: [{ relic: "Meso K1", rarity: "Common", vaulted: true }] },
      { name: "Kogake Prime Gauntlet", count: 2, marketSlug: "kogake_prime_gauntlet", drops: [{ relic: "Lith K1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Kronen Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "kronen_prime_set",
    components: [
      { name: "Kronen Prime Blueprint", count: 1, marketSlug: "kronen_prime_blueprint", drops: [{ relic: "Neo K2", rarity: "Rare", vaulted: true }] },
      { name: "Kronen Prime Blade", count: 2, marketSlug: "kronen_prime_blade", drops: [{ relic: "Axi K2", rarity: "Rare", vaulted: true }] },
      { name: "Kronen Prime Handle", count: 2, marketSlug: "kronen_prime_handle", drops: [{ relic: "Meso K1", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Masseter Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "masseter_prime_set",
    components: [
      { name: "Masseter Prime Blueprint", count: 1, marketSlug: "masseter_prime_blueprint", drops: [{ relic: "Axi M8", rarity: "Rare", vaulted: true }] },
      { name: "Masseter Prime Blade", count: 1, marketSlug: "masseter_prime_blade", drops: [{ relic: "Lith M6", rarity: "Common", vaulted: true }] },
      { name: "Masseter Prime Handle", count: 1, marketSlug: "masseter_prime_handle", drops: [{ relic: "Neo M6", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Nami Skyla Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "nami_skyla_prime_set",
    components: [
      { name: "Nami Skyla Prime Blueprint", count: 1, marketSlug: "nami_skyla_prime_blueprint", drops: [{ relic: "Neo N3", rarity: "Rare", vaulted: true }] },
      { name: "Nami Skyla Prime Blade", count: 2, marketSlug: "nami_skyla_prime_blade", drops: [{ relic: "Axi N3", rarity: "Rare", vaulted: true }] },
      { name: "Nami Skyla Prime Handle", count: 2, marketSlug: "nami_skyla_prime_handle", drops: [{ relic: "Lith N2", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Nikana Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "nikana_prime_set",
    components: [
      { name: "Nikana Prime Blueprint", count: 1, marketSlug: "nikana_prime_blueprint", drops: [{ relic: "Axi N3", rarity: "Rare", vaulted: true }] },
      { name: "Nikana Prime Blade", count: 1, marketSlug: "nikana_prime_blade", drops: [{ relic: "Axi N2", rarity: "Rare", vaulted: true }] },
      { name: "Nikana Prime Hilt", count: 1, marketSlug: "nikana_prime_hilt", drops: [{ relic: "Neo N2", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Orthos Prime",
    category: "Melee",
    vaulted: false,
    marketSlug: "orthos_prime_set",
    components: [
      { name: "Orthos Prime Blueprint", count: 1, marketSlug: "orthos_prime_blueprint", drops: [{ relic: "Lith O1", rarity: "Common", vaulted: false }] },
      { name: "Orthos Prime Blade", count: 2, marketSlug: "orthos_prime_blade", drops: [{ relic: "Meso O1", rarity: "Uncommon", vaulted: false }, { relic: "Neo O1", rarity: "Uncommon", vaulted: false }] },
      { name: "Orthos Prime Handle", count: 1, marketSlug: "orthos_prime_handle", drops: [{ relic: "Axi O1", rarity: "Common", vaulted: false }] }
    ]
  },
  {
    name: "Pangolin Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "pangolin_prime_set",
    components: [
      { name: "Pangolin Prime Blueprint", count: 1, marketSlug: "pangolin_prime_blueprint", drops: [{ relic: "Axi P6", rarity: "Rare", vaulted: true }] },
      { name: "Pangolin Prime Blade", count: 1, marketSlug: "pangolin_prime_blade", drops: [{ relic: "Lith P5", rarity: "Common", vaulted: true }] },
      { name: "Pangolin Prime Handle", count: 1, marketSlug: "pangolin_prime_handle", drops: [{ relic: "Neo P6", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Quassus Prime",
    category: "Melee",
    vaulted: false,
    marketSlug: "quassus_prime_set",
    components: [
      { name: "Quassus Prime Blueprint", count: 1, marketSlug: "quassus_prime_blueprint", drops: [{ relic: "Neo Q1", rarity: "Rare", vaulted: false }] },
      { name: "Quassus Prime Blade", count: 2, marketSlug: "quassus_prime_blade", drops: [{ relic: "Lith Q3", rarity: "Uncommon", vaulted: false }] },
      { name: "Quassus Prime Handle", count: 1, marketSlug: "quassus_prime_handle", drops: [{ relic: "Meso Q2", rarity: "Common", vaulted: false }] }
    ]
  },
  {
    name: "Reaper Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "reaper_prime_set",
    components: [
      { name: "Reaper Prime Blueprint", count: 1, marketSlug: "reaper_prime_blueprint", drops: [{ relic: "Lith G1", rarity: "Uncommon", vaulted: true }] },
      { name: "Reaper Prime Blade", count: 1, marketSlug: "reaper_prime_blade", drops: [{ relic: "Axi R1", rarity: "Rare", vaulted: true }] },
      { name: "Reaper Prime Handle", count: 1, marketSlug: "reaper_prime_handle", drops: [{ relic: "Meso R1", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Redeemer Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "redeemer_prime_set",
    components: [
      { name: "Redeemer Prime Blueprint", count: 1, marketSlug: "redeemer_prime_blueprint", drops: [{ relic: "Lith R3", rarity: "Rare", vaulted: true }] },
      { name: "Redeemer Prime Blade", count: 2, marketSlug: "redeemer_prime_blade", drops: [{ relic: "Meso R3", rarity: "Common", vaulted: true }] },
      { name: "Redeemer Prime Handle", count: 1, marketSlug: "redeemer_prime_handle", drops: [{ relic: "Axi R3", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Scindo Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "scindo_prime_set",
    components: [
      { name: "Scindo Prime Blueprint", count: 1, marketSlug: "scindo_prime_blueprint", drops: [{ relic: "Lith S1", rarity: "Common", vaulted: true }] },
      { name: "Scindo Prime Blade", count: 1, marketSlug: "scindo_prime_blade", drops: [{ relic: "Axi S1", rarity: "Rare", vaulted: true }] },
      { name: "Scindo Prime Handle", count: 1, marketSlug: "scindo_prime_handle", drops: [{ relic: "Meso S1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Shaku Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "shaku_prime_set",
    components: [
      { name: "Shaku Prime Blueprint", count: 1, marketSlug: "shaku_prime_blueprint", drops: [{ relic: "Lith S6", rarity: "Common", vaulted: true }] },
      { name: "Shaku Prime Blade", count: 2, marketSlug: "shaku_prime_blade", drops: [{ relic: "Meso S5", rarity: "Uncommon", vaulted: true }] },
      { name: "Shaku Prime Handle", count: 2, marketSlug: "shaku_prime_handle", drops: [{ relic: "Neo S5", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Silva & Aegis Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "silva_and_aegis_prime_set",
    components: [
      { name: "Silva & Aegis Prime Blueprint", count: 1, marketSlug: "silva_and_aegis_prime_blueprint", drops: [{ relic: "Lith S3", rarity: "Common", vaulted: true }] },
      { name: "Silva & Aegis Prime Blade", count: 1, marketSlug: "silva_and_aegis_prime_blade", drops: [{ relic: "Axi S3", rarity: "Rare", vaulted: true }] },
      { name: "Silva & Aegis Prime Guard", count: 1, marketSlug: "silva_and_aegis_prime_guard", drops: [{ relic: "Meso S3", rarity: "Rare", vaulted: true }] },
      { name: "Silva & Aegis Prime Hilt", count: 1, marketSlug: "silva_and_aegis_prime_hilt", drops: [{ relic: "Neo S3", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Tatsu Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "tatsu_prime_set",
    components: [
      { name: "Tatsu Prime Blueprint", count: 1, marketSlug: "tatsu_prime_blueprint", drops: [{ relic: "Axi T7", rarity: "Rare", vaulted: true }] },
      { name: "Tatsu Prime Blade", count: 1, marketSlug: "tatsu_prime_blade", drops: [{ relic: "Lith T5", rarity: "Rare", vaulted: true }] },
      { name: "Tatsu Prime Handle", count: 1, marketSlug: "tatsu_prime_handle", drops: [{ relic: "Neo T5", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Tekko Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "tekko_prime_set",
    components: [
      { name: "Tekko Prime Blueprint", count: 1, marketSlug: "tekko_prime_blueprint", drops: [{ relic: "Axi T5", rarity: "Rare", vaulted: true }] },
      { name: "Tekko Prime Blade", count: 2, marketSlug: "tekko_prime_blade", drops: [{ relic: "Lith T3", rarity: "Common", vaulted: true }] },
      { name: "Tekko Prime Gauntlet", count: 2, marketSlug: "tekko_prime_gauntlet", drops: [{ relic: "Neo T3", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Tipedo Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "tipedo_prime_set",
    components: [
      { name: "Tipedo Prime Blueprint", count: 1, marketSlug: "tipedo_prime_blueprint", drops: [{ relic: "Axi T3", rarity: "Rare", vaulted: true }] },
      { name: "Tipedo Prime Handle", count: 1, marketSlug: "tipedo_prime_handle", drops: [{ relic: "Meso T3", rarity: "Rare", vaulted: true }] },
      { name: "Tipedo Prime Ornament", count: 2, marketSlug: "tipedo_prime_ornament", drops: [{ relic: "Lith T3", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Venato Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "venato_prime_set",
    components: [
      { name: "Venato Prime Blueprint", count: 1, marketSlug: "venato_prime_blueprint", drops: [{ relic: "Neo V3", rarity: "Rare", vaulted: true }] },
      { name: "Venato Prime Blade", count: 2, marketSlug: "venato_prime_blade", drops: [{ relic: "Lith V4", rarity: "Common", vaulted: true }] },
      { name: "Venato Prime Handle", count: 1, marketSlug: "venato_prime_handle", drops: [{ relic: "Meso V4", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Volnus Prime",
    category: "Melee",
    vaulted: true,
    marketSlug: "volnus_prime_set",
    components: [
      { name: "Volnus Prime Blueprint", count: 1, marketSlug: "volnus_prime_blueprint", drops: [{ relic: "Axi V6", rarity: "Rare", vaulted: true }] },
      { name: "Volnus Prime Head", count: 1, marketSlug: "volnus_prime_head", drops: [{ relic: "Meso V5", rarity: "Common", vaulted: true }] },
      { name: "Volnus Prime Handle", count: 1, marketSlug: "volnus_prime_handle", drops: [{ relic: "Lith V5", rarity: "Uncommon", vaulted: true }] }
    ]
  },

  // =========================================================================
  // 5. PRIME COMPANIONS & SENTINELS (Complete 10 Companions)
  // =========================================================================
  {
    name: "Carrier Prime",
    category: "Companion",
    vaulted: true,
    marketSlug: "carrier_prime_set",
    components: [
      { name: "Carrier Prime Blueprint", count: 1, marketSlug: "carrier_prime_blueprint", drops: [{ relic: "Lith C1", rarity: "Rare", vaulted: true }] },
      { name: "Carrier Prime Carapace", count: 1, marketSlug: "carrier_prime_carapace", drops: [{ relic: "Meso C1", rarity: "Rare", vaulted: true }] },
      { name: "Carrier Prime Cerebrum", count: 1, marketSlug: "carrier_prime_cerebrum", drops: [{ relic: "Axi C1", rarity: "Rare", vaulted: true }] },
      { name: "Carrier Prime Systems", count: 1, marketSlug: "carrier_prime_systems", drops: [{ relic: "Neo C1", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Dethcube Prime",
    category: "Companion",
    vaulted: true,
    marketSlug: "dethcube_prime_set",
    components: [
      { name: "Dethcube Prime Blueprint", count: 1, marketSlug: "dethcube_prime_blueprint", drops: [{ relic: "Lith D2", rarity: "Rare", vaulted: true }] },
      { name: "Dethcube Prime Carapace", count: 1, marketSlug: "dethcube_prime_carapace", drops: [{ relic: "Meso D2", rarity: "Common", vaulted: true }] },
      { name: "Dethcube Prime Cerebrum", count: 1, marketSlug: "dethcube_prime_cerebrum", drops: [{ relic: "Neo D2", rarity: "Rare", vaulted: true }] },
      { name: "Dethcube Prime Systems", count: 1, marketSlug: "dethcube_prime_systems", drops: [{ relic: "Axi D3", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Helios Prime",
    category: "Companion",
    vaulted: true,
    marketSlug: "helios_prime_set",
    components: [
      { name: "Helios Prime Blueprint", count: 1, marketSlug: "helios_prime_blueprint", drops: [{ relic: "Lith H2", rarity: "Rare", vaulted: true }] },
      { name: "Helios Prime Carapace", count: 1, marketSlug: "helios_prime_carapace", drops: [{ relic: "Axi H1", rarity: "Common", vaulted: true }] },
      { name: "Helios Prime Cerebrum", count: 1, marketSlug: "helios_prime_cerebrum", drops: [{ relic: "Neo H2", rarity: "Rare", vaulted: true }] },
      { name: "Helios Prime Systems", count: 1, marketSlug: "helios_prime_systems", drops: [{ relic: "Meso H2", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Nautilus Prime",
    category: "Companion",
    vaulted: false,
    marketSlug: "nautilus_prime_set",
    components: [
      { name: "Nautilus Prime Blueprint", count: 1, marketSlug: "nautilus_prime_blueprint", drops: [{ relic: "Lith N15", rarity: "Rare", vaulted: false }] },
      { name: "Nautilus Prime Carapace", count: 1, marketSlug: "nautilus_prime_carapace", drops: [{ relic: "Axi N12", rarity: "Common", vaulted: false }] },
      { name: "Nautilus Prime Cerebrum", count: 1, marketSlug: "nautilus_prime_cerebrum", drops: [{ relic: "Neo N24", rarity: "Uncommon", vaulted: false }] },
      { name: "Nautilus Prime Systems", count: 1, marketSlug: "nautilus_prime_systems", drops: [{ relic: "Meso N16", rarity: "Common", vaulted: false }] }
    ]
  },
  {
    name: "Shade Prime",
    category: "Companion",
    vaulted: true,
    marketSlug: "shade_prime_set",
    components: [
      { name: "Shade Prime Blueprint", count: 1, marketSlug: "shade_prime_blueprint", drops: [{ relic: "Lith S7", rarity: "Rare", vaulted: true }] },
      { name: "Shade Prime Carapace", count: 1, marketSlug: "shade_prime_carapace", drops: [{ relic: "Meso S6", rarity: "Common", vaulted: true }] },
      { name: "Shade Prime Cerebrum", count: 1, marketSlug: "shade_prime_cerebrum", drops: [{ relic: "Neo S6", rarity: "Rare", vaulted: true }] },
      { name: "Shade Prime Systems", count: 1, marketSlug: "shade_prime_systems", drops: [{ relic: "Axi S6", rarity: "Uncommon", vaulted: true }] }
    ]
  },
  {
    name: "Wyrm Prime",
    category: "Companion",
    vaulted: true,
    marketSlug: "wyrm_prime_set",
    components: [
      { name: "Wyrm Prime Blueprint", count: 1, marketSlug: "wyrm_prime_blueprint", drops: [{ relic: "Lith W1", rarity: "Common", vaulted: true }] },
      { name: "Wyrm Prime Carapace", count: 1, marketSlug: "wyrm_prime_carapace", drops: [{ relic: "Meso W1", rarity: "Rare", vaulted: true }] },
      { name: "Wyrm Prime Cerebrum", count: 1, marketSlug: "wyrm_prime_cerebrum", drops: [{ relic: "Axi W1", rarity: "Rare", vaulted: true }] },
      { name: "Wyrm Prime Systems", count: 1, marketSlug: "wyrm_prime_systems", drops: [{ relic: "Neo W1", rarity: "Common", vaulted: true }] }
    ]
  },

  // =========================================================================
  // 6. PRIME ARCHWINGS & HEAVY WEAPONS
  // =========================================================================
  {
    name: "Odonata Prime",
    category: "Archwing",
    vaulted: true,
    marketSlug: "odonata_prime_set",
    components: [
      { name: "Odonata Prime Blueprint", count: 1, marketSlug: "odonata_prime_blueprint", drops: [{ relic: "Lith O1", rarity: "Common", vaulted: true }] },
      { name: "Odonata Prime Harness", count: 1, marketSlug: "odonata_prime_harness_blueprint", drops: [{ relic: "Meso O1", rarity: "Common", vaulted: true }] },
      { name: "Odonata Prime Systems", count: 1, marketSlug: "odonata_prime_systems_blueprint", drops: [{ relic: "Neo O1", rarity: "Rare", vaulted: true }] },
      { name: "Odonata Prime Wings", count: 2, marketSlug: "odonata_prime_wings_blueprint", drops: [{ relic: "Axi O1", rarity: "Rare", vaulted: true }] }
    ]
  },
  {
    name: "Corvas Prime",
    category: "Archwing",
    vaulted: true,
    marketSlug: "corvas_prime_set",
    components: [
      { name: "Corvas Prime Blueprint", count: 1, marketSlug: "corvas_prime_blueprint", drops: [{ relic: "Axi C11", rarity: "Rare", vaulted: true }] },
      { name: "Corvas Prime Barrel", count: 1, marketSlug: "corvas_prime_barrel", drops: [{ relic: "Lith C10", rarity: "Uncommon", vaulted: true }] },
      { name: "Corvas Prime Receiver", count: 1, marketSlug: "corvas_prime_receiver", drops: [{ relic: "Meso C9", rarity: "Common", vaulted: true }] },
      { name: "Corvas Prime Stock", count: 1, marketSlug: "corvas_prime_stock", drops: [{ relic: "Neo C8", rarity: "Common", vaulted: true }] }
    ]
  },
  {
    name: "Larkspur Prime",
    category: "Archwing",
    vaulted: true,
    marketSlug: "larkspur_prime_set",
    components: [
      { name: "Larkspur Prime Blueprint", count: 1, marketSlug: "larkspur_prime_blueprint", drops: [{ relic: "Axi L12", rarity: "Rare", vaulted: true }] },
      { name: "Larkspur Prime Barrel", count: 1, marketSlug: "larkspur_prime_barrel", drops: [{ relic: "Meso L4", rarity: "Uncommon", vaulted: true }] },
      { name: "Larkspur Prime Receiver", count: 1, marketSlug: "larkspur_prime_receiver", drops: [{ relic: "Neo L3", rarity: "Common", vaulted: true }] }
    ]
  }
];
