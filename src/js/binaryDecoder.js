/**
 * AlecaFrame Relic Inventory Binary Parser
 * Decodes the 9-byte packed little-endian binary stream from:
 * /api/stats/public/getRelicInventory
 */

export const ERA_NAMES = {
  0: 'Lith',
  1: 'Meso',
  2: 'Neo',
  3: 'Axi',
  4: 'Requiem'
};

export const REFINEMENT_NAMES = {
  0: 'Intact',
  1: 'Exceptional',
  2: 'Flawless',
  3: 'Radiant',
  4: 'Exceptional',
  5: 'Flawless',
  6: 'Radiant'
};

/**
 * Standardize refinement tier index (0: Intact, 1: Exceptional, 2: Flawless, 3: Radiant)
 */
export const REFINEMENT_INDEX = {
  'Intact': 0,
  'Exceptional': 1,
  'Flawless': 2,
  'Radiant': 3
};

/**
 * Parses raw ArrayBuffer into structured relic objects
 * @param {ArrayBuffer} buffer
 * @returns {Array<{era: string, refinement: string, refinementLevel: number, code: string, fullName: string, count: number}>}
 */
export function parseRelicBinary(buffer) {
  if (!buffer || buffer.byteLength < 4) {
    return [];
  }

  const view = new DataView(buffer);
  const decoder = new TextDecoder('ascii');
  const count = view.getUint32(0, true);
  const relics = [];

  for (let i = 0; i < count; i++) {
    const offset = 4 + (i * 9);
    if (offset + 9 > buffer.byteLength) break;

    const eraCode = view.getUint8(offset);
    const refCode = view.getUint8(offset + 1);

    // Read 3-byte ASCII code and remove null terminators
    const nameBytes = new Uint8Array(buffer, offset + 2, 3);
    const code = decoder.decode(nameBytes).replace(/\0/g, '').trim().toUpperCase();

    const quantity = view.getUint32(offset + 5, true);

    const era = ERA_NAMES[eraCode] || 'Lith';
    const refinement = REFINEMENT_NAMES[refCode] || 'Intact';
    const refinementLevel = REFINEMENT_INDEX[refinement] ?? 0;

    relics.push({
      era,
      code,
      fullName: `${era} ${code}`,
      refinement,
      refinementLevel,
      count: quantity
    });
  }

  return relics;
}

/**
 * Utility to decode base64 string into ArrayBuffer if response is wrapped as JSON/string
 * @param {string} base64
 * @returns {ArrayBuffer}
 */
export function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Creates a mock ArrayBuffer with synthetic relic data for testing or offline demonstration
 * @returns {ArrayBuffer}
 */
export function createMockRelicBuffer(preset = 'balanced') {
  const mockEntries = [
    // Protea Prime relics
    { era: 3, ref: 0, code: 'P6', count: 3 }, // Axi P6 Intact
    { era: 3, ref: 3, code: 'P6', count: 1 }, // Axi P6 Radiant
    { era: 1, ref: 0, code: 'P14', count: 4 }, // Meso P14 Intact
    { era: 0, ref: 0, code: 'P9', count: 6 }, // Lith P9 Intact
    { era: 2, ref: 0, code: 'P4', count: 2 }, // Neo P4 Intact
    { era: 2, ref: 3, code: 'P4', count: 2 }, // Neo P4 Radiant

    // Glaive Prime relics
    { era: 3, ref: 0, code: 'G1', count: 2 }, // Axi G1 Intact
    { era: 3, ref: 3, code: 'G1', count: 1 }, // Axi G1 Radiant
    { era: 2, ref: 0, code: 'D1', count: 1 }, // Neo D1 Intact
    { era: 0, ref: 0, code: 'G1', count: 5 }, // Lith G1 Intact

    // Gauss / Wisp relics
    { era: 3, ref: 0, code: 'G11', count: 3 },
    { era: 3, ref: 0, code: 'W3', count: 2 },
    { era: 1, ref: 3, code: 'G6', count: 2 },
    { era: 2, ref: 0, code: 'W1', count: 3 },

    // Generic evergreen relics
    { era: 0, ref: 0, code: 'B4', count: 8 },
    { era: 3, ref: 0, code: 'B1', count: 2 },
    { era: 0, ref: 0, code: 'L1', count: 12 },
    { era: 3, ref: 3, code: 'L1', count: 4 }
  ];

  const buffer = new ArrayBuffer(4 + (mockEntries.length * 9));
  const view = new DataView(buffer);
  view.setUint32(0, mockEntries.length, true);

  const encoder = new TextEncoder();
  mockEntries.forEach((entry, idx) => {
    const offset = 4 + (idx * 9);
    view.setUint8(offset, entry.era);
    view.setUint8(offset + 1, entry.ref);

    const codeBytes = encoder.encode(entry.code.padEnd(3, '\0'));
    new Uint8Array(buffer, offset + 2, 3).set(codeBytes.slice(0, 3));

    view.setUint32(offset + 5, entry.count, true);
  });

  return buffer;
}
