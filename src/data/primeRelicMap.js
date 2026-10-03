/**
 * Comprehensive Warframe Prime Items & Relic Drop Catalog
 * Each entry specifies:
 * - name: string
 * - category: 'Warframe' | 'Primary' | 'Secondary' | 'Melee'
 * - vaulted: boolean
 * - components: Array of { name, count, drops: Array of { relic: 'Era Code', rarity: 'Common'|'Uncommon'|'Rare', vaulted: boolean } }
 */

export const PRIME_RELIC_MAP = [
  {
    name: "Protea Prime",
    category: "Warframe",
    vaulted: false,
    components: [
      {
        name: "Protea Prime Blueprint",
        count: 1,
        drops: [
          { relic: "Axi P6", rarity: "Rare", vaulted: false },
          { relic: "Axi P7", rarity: "Rare", vaulted: false }
        ]
      },
      {
        name: "Protea Prime Chassis",
        count: 1,
        drops: [
          { relic: "Meso P14", rarity: "Uncommon", vaulted: false },
          { relic: "Meso P15", rarity: "Uncommon", vaulted: false }
        ]
      },
      {
        name: "Protea Prime Neuroptics",
        count: 1,
        drops: [
          { relic: "Lith P9", rarity: "Common", vaulted: false },
          { relic: "Lith P10", rarity: "Common", vaulted: false }
        ]
      },
      {
        name: "Protea Prime Systems",
        count: 1,
        drops: [
          { relic: "Neo P4", rarity: "Rare", vaulted: false },
          { relic: "Neo P5", rarity: "Rare", vaulted: false }
        ]
      }
    ]
  },
  {
    name: "Glaive Prime",
    category: "Melee",
    vaulted: true,
    components: [
      {
        name: "Glaive Prime Blueprint",
        count: 1,
        drops: [
          { relic: "Axi G1", rarity: "Uncommon", vaulted: true },
          { relic: "Neo G1", rarity: "Uncommon", vaulted: true }
        ]
      },
      {
        name: "Glaive Prime Blade",
        count: 2,
        drops: [
          { relic: "Axi G1", rarity: "Rare", vaulted: true },
          { relic: "Neo D1", rarity: "Rare", vaulted: true }
        ]
      },
      {
        name: "Glaive Prime Disc",
        count: 1,
        drops: [
          { relic: "Lith G1", rarity: "Common", vaulted: true },
          { relic: "Meso G1", rarity: "Common", vaulted: true }
        ]
      }
    ]
  },
  {
    name: "Gauss Prime",
    category: "Warframe",
    vaulted: false,
    components: [
      {
        name: "Gauss Prime Blueprint",
        count: 1,
        drops: [
          { relic: "Axi G11", rarity: "Rare", vaulted: false },
          { relic: "Axi G12", rarity: "Rare", vaulted: false }
        ]
      },
      {
        name: "Gauss Prime Chassis",
        count: 1,
        drops: [
          { relic: "Meso G6", rarity: "Rare", vaulted: false }
        ]
      },
      {
        name: "Gauss Prime Neuroptics",
        count: 1,
        drops: [
          { relic: "Neo G6", rarity: "Common", vaulted: false }
        ]
      },
      {
        name: "Gauss Prime Systems",
        count: 1,
        drops: [
          { relic: "Lith G8", rarity: "Uncommon", vaulted: false }
        ]
      }
    ]
  },
  {
    name: "Wisp Prime",
    category: "Warframe",
    vaulted: false,
    components: [
      {
        name: "Wisp Prime Blueprint",
        count: 1,
        drops: [
          { relic: "Axi W3", rarity: "Rare", vaulted: false }
        ]
      },
      {
        name: "Wisp Prime Chassis",
        count: 1,
        drops: [
          { relic: "Neo W1", rarity: "Uncommon", vaulted: false }
        ]
      },
      {
        name: "Wisp Prime Neuroptics",
        count: 1,
        drops: [
          { relic: "Meso W1", rarity: "Common", vaulted: false }
        ]
      },
      {
        name: "Wisp Prime Systems",
        count: 1,
        drops: [
          { relic: "Lith W3", rarity: "Rare", vaulted: false }
        ]
      }
    ]
  },
  {
    name: "Sevagoth Prime",
    category: "Warframe",
    vaulted: false,
    components: [
      {
        name: "Sevagoth Prime Blueprint",
        count: 1,
        drops: [
          { relic: "Axi S16", rarity: "Rare", vaulted: false }
        ]
      },
      {
        name: "Sevagoth Prime Chassis",
        count: 1,
        drops: [
          { relic: "Neo S19", rarity: "Uncommon", vaulted: false }
        ]
      },
      {
        name: "Sevagoth Prime Neuroptics",
        count: 1,
        drops: [
          { relic: "Meso S15", rarity: "Common", vaulted: false }
        ]
      },
      {
        name: "Sevagoth Prime Systems",
        count: 1,
        drops: [
          { relic: "Lith S15", rarity: "Rare", vaulted: false }
        ]
      }
    ]
  },
  {
    name: "Revenant Prime",
    category: "Warframe",
    vaulted: true,
    components: [
      {
        name: "Revenant Prime Blueprint",
        count: 1,
        drops: [
          { relic: "Lith R4", rarity: "Uncommon", vaulted: true }
        ]
      },
      {
        name: "Revenant Prime Chassis",
        count: 1,
        drops: [
          { relic: "Axi R5", rarity: "Rare", vaulted: true }
        ]
      },
      {
        name: "Revenant Prime Neuroptics",
        count: 1,
        drops: [
          { relic: "Meso R5", rarity: "Common", vaulted: true }
        ]
      },
      {
        name: "Revenant Prime Systems",
        count: 1,
        drops: [
          { relic: "Neo R5", rarity: "Rare", vaulted: true }
        ]
      }
    ]
  },
  {
    name: "Mesa Prime",
    category: "Warframe",
    vaulted: true,
    components: [
      {
        name: "Mesa Prime Blueprint",
        count: 1,
        drops: [
          { relic: "Axi M1", rarity: "Rare", vaulted: true },
          { relic: "Neo M1", rarity: "Rare", vaulted: true }
        ]
      },
      {
        name: "Mesa Prime Chassis",
        count: 1,
        drops: [
          { relic: "Lith M3", rarity: "Common", vaulted: true },
          { relic: "Axi H5", rarity: "Common", vaulted: true }
        ]
      },
      {
        name: "Mesa Prime Neuroptics",
        count: 1,
        drops: [
          { relic: "Meso M3", rarity: "Uncommon", vaulted: true }
        ]
      },
      {
        name: "Mesa Prime Systems",
        count: 1,
        drops: [
          { relic: "Neo M2", rarity: "Rare", vaulted: true }
        ]
      }
    ]
  },
  {
    name: "Saryn Prime",
    category: "Warframe",
    vaulted: true,
    components: [
      {
        name: "Saryn Prime Blueprint",
        count: 1,
        drops: [
          { relic: "Axi S1", rarity: "Rare", vaulted: true }
        ]
      },
      {
        name: "Saryn Prime Chassis",
        count: 1,
        drops: [
          { relic: "Meso S2", rarity: "Rare", vaulted: true }
        ]
      },
      {
        name: "Saryn Prime Neuroptics",
        count: 1,
        drops: [
          { relic: "Axi S2", rarity: "Uncommon", vaulted: true }
        ]
      },
      {
        name: "Saryn Prime Systems",
        count: 1,
        drops: [
          { relic: "Lith S1", rarity: "Common", vaulted: true }
        ]
      }
    ]
  },
  {
    name: "Volt Prime",
    category: "Warframe",
    vaulted: true,
    components: [
      {
        name: "Volt Prime Blueprint",
        count: 1,
        drops: [
          { relic: "Axi V8", rarity: "Rare", vaulted: true },
          { relic: "Meso V2", rarity: "Rare", vaulted: true }
        ]
      },
      {
        name: "Volt Prime Chassis",
        count: 1,
        drops: [
          { relic: "Meso V3", rarity: "Rare", vaulted: true },
          { relic: "Axi V1", rarity: "Rare", vaulted: true }
        ]
      },
      {
        name: "Volt Prime Neuroptics",
        count: 1,
        drops: [
          { relic: "Axi V4", rarity: "Common", vaulted: true }
        ]
      },
      {
        name: "Volt Prime Systems",
        count: 1,
        drops: [
          { relic: "Lith V1", rarity: "Common", vaulted: true }
        ]
      }
    ]
  },
  {
    name: "Rhino Prime",
    category: "Warframe",
    vaulted: true,
    components: [
      {
        name: "Rhino Prime Blueprint",
        count: 1,
        drops: [
          { relic: "Axi R1", rarity: "Rare", vaulted: true },
          { relic: "Lith R1", rarity: "Rare", vaulted: true }
        ]
      },
      {
        name: "Rhino Prime Chassis",
        count: 1,
        drops: [
          { relic: "Axi R2", rarity: "Rare", vaulted: true }
        ]
      },
      {
        name: "Rhino Prime Neuroptics",
        count: 1,
        drops: [
          { relic: "Meso R1", rarity: "Uncommon", vaulted: true }
        ]
      },
      {
        name: "Rhino Prime Systems",
        count: 1,
        drops: [
          { relic: "Lith R2", rarity: "Common", vaulted: true }
        ]
      }
    ]
  },
  {
    name: "Khora Prime",
    category: "Warframe",
    vaulted: true,
    components: [
      {
        name: "Khora Prime Blueprint",
        count: 1,
        drops: [
          { relic: "Lith K9", rarity: "Rare", vaulted: true }
        ]
      },
      {
        name: "Khora Prime Chassis",
        count: 1,
        drops: [
          { relic: "Axi K9", rarity: "Rare", vaulted: true }
        ]
      },
      {
        name: "Khora Prime Neuroptics",
        count: 1,
        drops: [
          { relic: "Meso K4", rarity: "Common", vaulted: true }
        ]
      },
      {
        name: "Khora Prime Systems",
        count: 1,
        drops: [
          { relic: "Neo K5", rarity: "Uncommon", vaulted: true }
        ]
      }
    ]
  },
  {
    name: "Braton Prime",
    category: "Primary",
    vaulted: false,
    components: [
      {
        name: "Braton Prime Blueprint",
        count: 1,
        drops: [
          { relic: "Lith B4", rarity: "Common", vaulted: false },
          { relic: "Lith K1", rarity: "Common", vaulted: false }
        ]
      },
      {
        name: "Braton Prime Barrel",
        count: 1,
        drops: [
          { relic: "Meso B1", rarity: "Common", vaulted: false },
          { relic: "Meso S1", rarity: "Common", vaulted: false }
        ]
      },
      {
        name: "Braton Prime Receiver",
        count: 1,
        drops: [
          { relic: "Axi B1", rarity: "Rare", vaulted: false },
          { relic: "Axi R1", rarity: "Rare", vaulted: false }
        ]
      },
      {
        name: "Braton Prime Stock",
        count: 1,
        drops: [
          { relic: "Neo B1", rarity: "Common", vaulted: false }
        ]
      }
    ]
  },
  {
    name: "Lex Prime",
    category: "Secondary",
    vaulted: false,
    components: [
      {
        name: "Lex Prime Blueprint",
        count: 1,
        drops: [
          { relic: "Lith L1", rarity: "Common", vaulted: false },
          { relic: "Lith T1", rarity: "Common", vaulted: false }
        ]
      },
      {
        name: "Lex Prime Barrel",
        count: 1,
        drops: [
          { relic: "Meso L1", rarity: "Common", vaulted: false },
          { relic: "Neo N1", rarity: "Common", vaulted: false }
        ]
      },
      {
        name: "Lex Prime Receiver",
        count: 1,
        drops: [
          { relic: "Axi L1", rarity: "Rare", vaulted: false },
          { relic: "Axi C1", rarity: "Rare", vaulted: false }
        ]
      }
    ]
  },
  {
    name: "Orthos Prime",
    category: "Melee",
    vaulted: false,
    components: [
      {
        name: "Orthos Prime Blueprint",
        count: 1,
        drops: [
          { relic: "Lith O1", rarity: "Common", vaulted: false },
          { relic: "Meso O2", rarity: "Common", vaulted: false }
        ]
      },
      {
        name: "Orthos Prime Blade",
        count: 2,
        drops: [
          { relic: "Meso O1", rarity: "Uncommon", vaulted: false },
          { relic: "Neo O1", rarity: "Uncommon", vaulted: false }
        ]
      },
      {
        name: "Orthos Prime Handle",
        count: 1,
        drops: [
          { relic: "Axi O1", rarity: "Common", vaulted: false },
          { relic: "Lith O2", rarity: "Common", vaulted: false }
        ]
      }
    ]
  },
  {
    name: "Nikana Prime",
    category: "Melee",
    vaulted: true,
    components: [
      {
        name: "Nikana Prime Blueprint",
        count: 1,
        drops: [
          { relic: "Axi N3", rarity: "Rare", vaulted: true }
        ]
      },
      {
        name: "Nikana Prime Blade",
        count: 1,
        drops: [
          { relic: "Axi N2", rarity: "Rare", vaulted: true }
        ]
      },
      {
        name: "Nikana Prime Hilt",
        count: 1,
        drops: [
          { relic: "Neo N2", rarity: "Rare", vaulted: true }
        ]
      }
    ]
  },
  {
    name: "Acceltra Prime",
    category: "Primary",
    vaulted: false,
    components: [
      {
        name: "Acceltra Prime Blueprint",
        count: 1,
        drops: [
          { relic: "Axi A18", rarity: "Rare", vaulted: false }
        ]
      },
      {
        name: "Acceltra Prime Barrel",
        count: 1,
        drops: [
          { relic: "Meso A5", rarity: "Common", vaulted: false }
        ]
      },
      {
        name: "Acceltra Prime Receiver",
        count: 1,
        drops: [
          { relic: "Neo A13", rarity: "Uncommon", vaulted: false }
        ]
      },
      {
        name: "Acceltra Prime Stock",
        count: 1,
        drops: [
          { relic: "Lith A6", rarity: "Common", vaulted: false }
        ]
      }
    ]
  },
  {
    name: "Kronen Prime",
    category: "Melee",
    vaulted: true,
    components: [
      {
        name: "Kronen Prime Blueprint",
        count: 1,
        drops: [
          { relic: "Neo K2", rarity: "Rare", vaulted: true }
        ]
      },
      {
        name: "Kronen Prime Blade",
        count: 2,
        drops: [
          { relic: "Axi K2", rarity: "Rare", vaulted: true }
        ]
      },
      {
        name: "Kronen Prime Handle",
        count: 2,
        drops: [
          { relic: "Meso K1", rarity: "Uncommon", vaulted: true }
        ]
      }
    ]
  },
  {
    name: "Rubico Prime",
    category: "Primary",
    vaulted: true,
    components: [
      {
        name: "Rubico Prime Blueprint",
        count: 1,
        drops: [
          { relic: "Lith R1", rarity: "Common", vaulted: true }
        ]
      },
      {
        name: "Rubico Prime Barrel",
        count: 1,
        drops: [
          { relic: "Meso R2", rarity: "Rare", vaulted: true }
        ]
      },
      {
        name: "Rubico Prime Receiver",
        count: 1,
        drops: [
          { relic: "Axi R2", rarity: "Rare", vaulted: true }
        ]
      },
      {
        name: "Rubico Prime Stock",
        count: 1,
        drops: [
          { relic: "Neo R2", rarity: "Uncommon", vaulted: true }
        ]
      }
    ]
  }
];
