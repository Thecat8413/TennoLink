# TennoLink

> A high-performance, edge-hosted Warframe relic synchronization engine, radshare optimizer, and persistent mastery tracker. Built with a sleek **Vitruvian aesthetic**, designed natively for **Cloudflare Pages + D1 Serverless Edge** with full support for **Self-Hosted Docker** deployments.

---

## 🏛️ Architecture & Paradigm Shift

**User-Owned Data:** In TennoLink, your data belongs to *you*, not a specific room. Your persistent inventory and mastery data are stored securely under your Gamertag. You can freely join and leave temporary **Squad Rooms** to sync, compare, and build Radshares with friends, bringing your data with you seamlessly.

**Edge Security:** Fully secured API endpoints. The edge API authenticates native companions using `Basic Auth` and web interfaces using `Bearer Tokens`, completely eliminating spoofing, unauthorized overwrites, and IDOR vulnerabilities. Decryption of sensitive local files is fully isolated to the client.

---

## ✨ Key Features

1. **Native Windows Companion (`TennoLink-Setup.exe`):**
   - A lightweight C# System Tray application that automatically detects and reads your local `%LOCALAPPDATA%\AlecaFrame\lastData.dat` file.
   - **Client-Side Decryption:** Decrypts AES-128-CBC locally. Your raw binary files and decryption keys are *never* transmitted over the internet.
   - **Zero-Knowledge Sanitization:** Securely pushes *only* your Relic quantities and Mastery XP to the server.
   - Supports **Auto-Start on Login** and background auto-updates via GitHub Releases.

2. **Web Sync Option (Token-less Proxy):**
   - Don't want to install the `.exe`? Simply paste your AlecaFrame Public Token directly into the TennoLink Web UI. The UI will securely fetch your inventory and proxy it to the central database, keeping you synced with your squad instantly.

3. **Persistent Mastery Rank Tracker:**
   - Tracks equipment XP and Mastery completion across Warframes, Primaries, Secondaries, Melees, Companions, Archwings, and Necramechs.
   - Historical records are securely saved to the Cloudflare D1 or local SQLite database.

4. **Cross-Squad Relic Stock Matrix:**
   - Synchronize up to 4 squad members in a shared squad room.
   - Immediate detection of formable 4-player Radshares.
   - Calculates the exact Void Trace bill per squad member to refine stock to Radiant.

5. **Vitruvian Interface:**
   - Authentic aesthetic featuring warm obsidian backgrounds, hairline gold filigree, and compact high-density tables designed for multi-monitor glanceability.

---

## 🚀 Deployment Options

TennoLink supports two deployment models depending on your needs.

### Option A: Cloudflare Pages & D1 (Recommended / Serverless)

TennoLink is built natively for Cloudflare's Edge network, meaning you can host it for free with zero maintenance.

1. Fork this repository.
2. In the Cloudflare Dashboard, create a new **D1 Database** named `tennolink-db`.
3. Link your GitHub repository to **Cloudflare Pages**.
4. Set up the D1 Binding in your Pages project settings (`DB` -> `tennolink-db`).
5. Deploy! The application will automatically create the required database tables (`player_accounts`, `inventories`, `rooms`, `members`) upon first boot via the edge router.

### Option B: Self-Hosted Docker Compose (Homelab)

If you prefer to keep your data completely isolated on your own network:

```bash
# Clone the repository
git clone https://github.com/Thecat8413/TennoLink.git
cd TennoLink

# Start the stack
docker compose up -d
```
Your persistent SQLite database will be created in `./data/warframe.db`, and the web UI will be accessible at `http://localhost:3000`.

---

## 📥 Installing the Companion App

1. Navigate to the **Releases** tab on GitHub.
2. Download `TennoLink-Setup.exe`.
3. Run the installer. You can choose to automatically start the companion when you log into Windows.
4. Once running, double-click the gold diamond icon in your system tray to open Settings.
5. Enter your Server URL (e.g., `https://tennolink.pages.dev` or `http://localhost:3000`), your Gamertag, and your Password.

The companion will silently sync your data in the background whenever your Warframe inventory changes!

---

## 🛠️ Development & Building

### Building the C# Companion
The `TennoLink-Setup.exe` installer is automatically built via GitHub Actions (`build-companion.yml`) using the Inno Setup Compiler (`ISCC.exe`).

To compile manually:
```bash
cd companion-cs
dotnet publish -c Release -r win-x64 --self-contained true
```

### Running the Node.js Server Locally
```bash
npm install
npm start
```
