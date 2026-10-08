/**
 * Cloudflare Pages Function: /api/upload/dat
 * Ingests raw lastData.dat uploads from the native Windows System Tray companion or Web Dropzone.
 * Decrypts with Web Crypto (AES-128-CBC) and applies zero-knowledge sanitization at the Cloudflare edge.
 */

const AES_KEY_BYTES = new TextEncoder().encode("LEO-ALEC\tEO-ALEC");
const AES_IV_BYTES = new Uint8Array([49, 50, 70, 71, 66, 51, 54, 45, 76, 69, 51, 45, 113, 61, 57, 0]);

export async function onRequest(context) {
  const { request, env } = context;

  // 1. CORS Preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const url = new URL(request.url);
  const playerName = url.searchParams.get('player') || 'Tenno';
  const roomCode = url.searchParams.get('room') || '';

  try {
    const rawBuffer = await request.arrayBuffer();
    if (!rawBuffer || rawBuffer.byteLength === 0) {
      return new Response(JSON.stringify({ ok: false, error: 'Empty file buffer' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Check if uploaded payload is already plain JSON (e.g. from warframe-api-helper or WFHelper)
    let rawInventory = null;
    const textPreview = new TextDecoder('utf-8').decode(rawBuffer.slice(0, 10)).trim();
    if (textPreview.startsWith('{')) {
      const fullText = new TextDecoder('utf-8').decode(rawBuffer);
      const parsed = JSON.parse(fullText);
      rawInventory = parsed.InventoryJson
        ? (typeof parsed.InventoryJson === 'string' ? JSON.parse(parsed.InventoryJson) : parsed.InventoryJson)
        : parsed;
    } else {
      // Decrypt AES-128-CBC using Web Crypto
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        AES_KEY_BYTES,
        { name: 'AES-CBC' },
        false,
        ['decrypt']
      );

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: AES_IV_BYTES },
        cryptoKey,
        rawBuffer
      );

      const decryptedText = new TextDecoder('utf-8').decode(decryptedBuffer);
      const outerJson = JSON.parse(decryptedText);

      rawInventory = outerJson;
      if (outerJson.InventoryJson) {
        rawInventory = typeof outerJson.InventoryJson === 'string'
          ? JSON.parse(outerJson.InventoryJson)
          : outerJson.InventoryJson;
      }
    }

    // Zero-Knowledge Sanitization (strip currencies, private IDs, keep mastery & relics)
    const sanitized = sanitizeInventoryAtEdge(rawInventory);

    // Optional D1 / KV persistence if bound in Cloudflare dashboard
    if (env.DB && roomCode) {
      try {
        await env.DB.prepare(`
          INSERT INTO inventories (id, room_code, player_name, relics_json, mastery_json, components_json, raw_hash, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            relics_json = excluded.relics_json,
            mastery_json = excluded.mastery_json,
            components_json = excluded.components_json,
            raw_hash = excluded.raw_hash,
            updated_at = excluded.updated_at
        `).bind(
          `inv_${roomCode}_${playerName}`,
          roomCode.toUpperCase(),
          playerName,
          JSON.stringify(sanitized.relics),
          JSON.stringify(sanitized.mastery),
          JSON.stringify(sanitized.components),
          '',
          Date.now()
        ).run();
      } catch (dbErr) {
        console.warn('D1 write warning:', dbErr.message);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        syncTime: sanitized.syncTime,
        relicCount: sanitized.relics.length,
        masteryCount: sanitized.mastery.length,
        componentsCount: sanitized.components.length,
        relics: sanitized.relics,
        mastery: sanitized.mastery,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: `Edge decryption failed: ${err.message}` }),
      {
        status: 422,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
}

function sanitizeInventoryAtEdge(rawInventory) {
  if (!rawInventory) {
    return { syncTime: new Date().toISOString(), mastery: [], relics: [], components: [] };
  }

  const relics = [];
  for (const r of (rawInventory.Relics || rawInventory.Projections || [])) {
    const itemType = r.ItemType || '';
    const relicMatch = itemType.match(/(T[1-5])?(Lith|Meso|Neo|Axi|Requiem)?Relic([A-Z0-9]+)/i) ||
                       itemType.match(/(Lith|Meso|Neo|Axi|Requiem)\s+([A-Z0-9]+)/i);

    let era = 'Lith';
    let code = 'A1';
    if (relicMatch) {
      era = relicMatch[2] || relicMatch[1];
      code = relicMatch[3] || relicMatch[2];
    } else {
      const parts = itemType.split('/').pop().replace('Relic', ' ');
      era = parts.split(' ')[0] || 'Lith';
      code = parts.split(' ')[1] || 'Unknown';
    }

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
      count: r.ItemCount || r.Count || 1,
    });
  }

  const mastery = [];
  const categories = ['Suits', 'Weapons', 'SpaceSuits', 'SpaceGuns', 'SpaceMelee', 'Sentinels', 'MechSuits'];
  for (const cat of categories) {
    for (const item of (rawInventory[cat] || [])) {
      const itemType = item.ItemType || '';
      const name = itemType.split('/').pop().replace(/([A-Z])/g, ' $1').trim();
      const xp = item.XP || 0;
      mastery.push({
        itemId: itemType,
        name,
        category: cat === 'Suits' ? 'Warframe' : (cat === 'Weapons' ? 'Weapon' : cat),
        xp,
        mastered: xp >= 450000 || item.Flags?.includes('Mastered') || false,
      });
    }
  }

  const components = [];
  for (const m of (rawInventory.MiscItems || [])) {
    const itemType = m.ItemType || '';
    if (itemType.includes('Prime') || itemType.includes('Blueprint') || itemType.includes('Part')) {
      const name = itemType.split('/').pop().replace(/([A-Z])/g, ' $1').trim();
      components.push({
        itemId: itemType,
        name,
        count: m.ItemCount || 1,
      });
    }
  }

  const syncTime = rawInventory.LastInventorySync?.$oid
    ? new Date(parseInt(rawInventory.LastInventorySync.$oid.substr(0, 8), 16) * 1000).toISOString()
    : new Date().toISOString();

  return { syncTime, relics, mastery, components };
}
