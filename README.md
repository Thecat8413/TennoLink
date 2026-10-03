# Warframe Squad Relic Sync Engine

> A cross-squad Warframe relic synchronization engine and radshare planner built for **Cloudflare Pages** using **AlecaFrame Public Tokens**.

---

## 🎯 Features

1. **Target Any Prime Warframe or Weapon:**
   - Instant search and category filtering (*Warframes, Primaries, Secondaries, Melees*).
   - Component recipe breakdown (Blueprints, Chassis, Neuroptics, Systems, Barrels, Receivers, Blades, etc.).
   - Vault status indicators (*Vaulted* vs *Active Drop*).

2. **Cross-Fireteam Relic Stock Matrix:**
   - Each squad member inputs their AlecaFrame Public Token (stored locally in browser `localStorage`).
   - Relic inventories are parsed from the AlecaFrame binary stream and cached asynchronously in `IndexedDB`.
   - Grid breakdown showing each member's holdings across all refinement tiers:
     - ⚪ **Intact**
     - 🟢 **Exceptional**
     - 🔵 **Flawless**
     - 🟣 **Radiant**

3. **Void Trace Budget & Radshare Calculator:**
   - **Immediate Radshares Formable:** Identifies how many concurrent 4-player Radiant runs the squad can form immediately.
   - **Trace Deficit Shopping List:** Calculates the exact Void Trace bill per squad member to refine their intact stock to Radiant (100 traces per Intact).
   - **Binomial Drop Probability:** Statistical likelihood of securing the target part with the squad's relic pool.

4. **Cloudflare Pages Edge Proxy (`/functions/api/alecaframe.js`):**
   - Resolves browser CORS blocks to `stats.alecaframe.com`.
   - Edge-caches responses for 60 seconds to protect against AlecaFrame's strict 1 request/second per IP rate limit.

5. **Demo Fireteam Included:**
   - 1-click **"Demo Squad"** button to immediately preview and test the full squad matrix with 4 sample Tenno profiles without needing real tokens upfront.

---

## 🚀 Local Development & Deployment

### Run Locally with Wrangler
```bash
# Start local Cloudflare Pages environment (with Functions support)
npx wrangler pages dev .
```

Then open `http://localhost:8788` in your browser.

### Deploy to Cloudflare Pages
1. Push this repository to GitHub or GitLab.
2. In the **Cloudflare Dashboard**, navigate to **Compute (Workers) > Pages**.
3. Select **Connect to Git** and choose this repository.
4. **Build Settings:**
   - **Framework Preset:** *None*
   - **Build command:** *(leave empty)*
   - **Build output directory:** `.` (root directory)
5. Click **Save and Deploy**. Cloudflare automatically activates both the static site and the edge function in `/functions`.

---

## 🔑 How to Generate AlecaFrame Public Tokens

1. Open the **AlecaFrame** desktop app (running via Overwolf).
2. Go to the **Stats** tab.
3. Click **"Create Public Link"**.
4. Check the **"Relics"** option (and any other statistics you wish to share).
5. Click **"Generate token"**.
6. Copy the token into this web tool via **Manage Squad &rarr; Add Member**.

*Tokens are valid for 1 year, preserve user privacy, and can be revoked at any time inside the AlecaFrame app.*

---

## 🔮 Roadmap: Dual-Function Expansion
- **Phase 1 (Current):** Cross-Squad Relic Sync Engine via Public Tokens.
- **Phase 2 (Planned):** Full Mastery Management Tool utilizing automatic local network synchronization for `%localappdata%/AlecaFrame/lastData.dat` without exposing raw local files over the public internet.
