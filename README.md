# Warframe Squad Relic Sync & Mastery Engine (Self-Hosted Edition)

> A high-performance, self-hosted Warframe relic synchronization engine, radshare optimizer, and persistent mastery tracker. Built with a sleek **Vitruvian Orokin aesthetic**, running on **Docker Compose** with persistent **SQLite storage**.

---

## 🏛️ Key Features

1. **Vitruvian Orokin Interface:**
   - Authentic *The Sacrifice* aesthetic featuring warm obsidian backgrounds, hairline gold filigree, parchment typography, and compact high-density tables.
   - Clean, low-scroll layout designed for multi-monitor setups and quick in-mission glanceability.

2. **Self-Hosted & Private-First (Docker Compose):**
   - **Zero Cloud Lock-in**: Run completely on your own homelab, server, or VPS.
   - **Long-Term Data Persistence**: Persistent SQLite database (`./data/warframe.db`) preserves player profiles, historical mastery, and squad inventories permanently.
   - **LAN & WireGuard VPN Ready**: Operate strictly on your private local network or WireGuard mesh without exposing any ports to the public internet.
   - **Reverse Proxy Friendly**: Drop directly behind Caddy, Traefik, Nginx, or Nginx Proxy Manager with SSL termination.

3. **AlecaFrame `lastData.dat` Auto-Sync:**
   - Native support for AlecaFrame's local `%LOCALAPPDATA%\AlecaFrame\lastData.dat` file.
   - Decrypts standard AES-128-CBC and applies **Zero-Knowledge Sanitization**—extracts *only* Mastery XP and Relic quantities while purging all personal tokens, Platinum, and Credit balances.
   - Background PowerShell companion script (`scripts/sync-agent.ps1`) automatically syncs inventories whenever missions conclude.

4. **Persistent Mastery Rank Tracker:**
   - Tracks equipment XP and Mastery completion across Warframes, Primaries, Secondaries, Melees, Companions, Archwings, and Necramechs.
   - Historical records survive server restarts and browser cache clears.

5. **Complete Prime Source of Truth Catalog:**
   - 145+ Prime items imported locally across all categories (Warframes, Weapons, Companions, Archwings).
   - Real-time **Warframe.Market v2 pricing** for sets and individual components with local persistent caching.
   - Canonical speed-farming nodes (Hepit, Ukko, Apollo Lua 4-3-2-1 strategy) and Vault status.

6. **Cross-Fireteam Relic Stock Matrix:**
   - Synchronize up to 4 fireteam members in a shared squad room.
   - Immediate detection of formable 4-player Radshares.
   - Calculates the exact Void Trace bill per squad member to refine stock to Radiant.

---

## 🚀 Quick Start with Docker Compose

### 1. Launch the Stack
```bash
# Clone the repository
git clone https://github.com/Thecat8413/warframe-helper.git
cd warframe-helper

# (Optional) Customize environment
cp .env.example .env

# Start with Docker Compose
docker compose up -d
```

Open your browser to:
**`http://localhost:3000`** (or your server's LAN / WireGuard IP).

---

## ⚙️ Configuration & Environment

Configuration options in `.env`:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `3000` | Host port exposed by Docker container. |
| `HOST_BIND_IP` | `0.0.0.0` | IP to bind on host (`127.0.0.1` for reverse proxy, `0.0.0.0` for LAN/WireGuard). |
| `DATA_DIR` | `/app/data` | Container path for the persistent SQLite database. |
| `NODE_ENV` | `production` | Environment mode. |

---

## 🔒 Reverse Proxy & WireGuard Setup

### A. Caddy
```caddy
warframe.myhome.net {
    reverse_proxy 127.0.0.1:3000
}
```

### B. Nginx / Nginx Proxy Manager
Forward incoming requests to `http://127.0.0.1:3000` with `client_max_body_size 10M;`. Full example in [docs/reverse-proxy.md](docs/reverse-proxy.md).

### C. Local LAN / WireGuard Only
In `.env`, set `HOST_BIND_IP=0.0.0.0`. Teammates on your WireGuard network connect directly to `http://10.x.x.x:3000`.

---

## 🔄 AlecaFrame Auto-Sync Companion

To automatically sync your local inventory from your gaming PC to your self-hosted server:

```powershell
# In PowerShell on your gaming PC:
.\scripts\sync-agent.ps1 -ServerUrl "https://warframe.myhome.net" -PlayerName "YourGamertag" -RoomCode "OROKIN-42"
```

The script watches `%LOCALAPPDATA%\AlecaFrame\lastData.dat` and automatically posts sanitized updates whenever your inventory changes.

---

## 🛠️ Native Node.js Run (Without Docker)

You can also run natively on any machine with Node.js 22+:

```bash
# Start the server
npm start
```
The server will initialize the SQLite database at `./data/warframe.db` and listen on port `3000`.
