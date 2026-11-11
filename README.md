# BLACKVAULT — Cyberpunk Underground Marketplace Simulation

> **IMPORTANT SIMULATION & SAFETY NOTICE**  
> **BLACKVAULT** is a purely **fictional, simulated creative experience** designed for entertainment, Three.js 3D demonstration, and UI/UX architecture. All products, users, transactions, messages, balances, and reviews are synthetic in-memory demo data. No illegal items, real dark-web connectivity, weapons, malware, or genuine financial services exist or are supported.

---

## ⚡ System Highlights

- **Cinematic Boot Experience:** Terminal boot log stream, scanning pulse, neon progress tracker, audio chimes, and automatic `?autostart=1` query parameter support.
- **Three.js 3D Cyber Vault:** Procedurally constructed multi-part 3D vault core with faceted crystal geometry, rotating holographic gimbal rings, ground grid, ambient particle vortex, and a collapsible bottom control dock (Matrix Green, Cyber Red, Electric Cyan themes + interactive scan burst).
- **Complete Marketplace Interface:** 8 specialized digital departments (Gaming Assets, 3D Models, UI Templates, Digital Art, Developer Tools, Software Demos, Collectibles, Digital Accessories) with real-time search, price range filtering, sorting, grid/list view toggles, and pagination.
- **Encrypted Product Manifests:** Detailed modal views with SHA-256 integrity checksum copy, technical specs (file format, archive size, license), seller trust rating, interactive reviews submission form, and related items.
- **Simulated Cart & Escrow Checkout:** Live quantity adjustment, promotional code discounts (`CYBER2026` for 20% off, `BLACKVAULT` for 15% off), simulated 2% escrow collateral calculation, mock PGP signature option, and instant downloadable JSON order manifest.
- **Operator Dashboard & Wallet:** Simulated balance top-up (+100, +250, +500, +1,000 BVT), mock testnet withdrawal with gas calculations, 7-day spending velocity SVG spline chart, order history with receipts, and profile editor.
- **The Mesh Underground Community:** Forum transmissions categorized by topic, interactive likes, comment threads, trending hashtags, and new post creation.
- **P2P Encrypted Messaging:** Real-time messaging terminal with online/offline contacts (0xGhost, NexusOps, CipherQueen) and simulated automated seller responses.
- **Root Admin Panel (Full CRUD):** Role-based authorization gate with instant 1-click elevation, Add/Edit/Delete asset modal forms, order status updates, and simulated analytics.
- **Zero-Asset Web Audio Synthesizer:** Real-time synthetic terminal beeps, keystroke clicks, glitch sweeps, and success chimes with global mute toggle.

---

## 🔑 Demo Test Credentials

You can log in or switch roles instantly using the 1-click buttons in the **User Account Menu** or **Auth Modal**:

| Role | Username | Handle / Email | Fictional Balance | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Standard Buyer** | `CipherRunner_09` | `operator@blackvault.mesh` | `1,500.00 BVT` | Marketplace, Cart, Wallet, Orders, Community |
| **Root Admin** | `RootArchivist` | `admin@blackvault.mesh` | `98,400.00 BVT` | Full Catalog CRUD, User Directory, Order Moderation |

*Tip: You can also switch roles at any time by clicking your avatar in the top-right navbar.*

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Motion
- **3D Graphics:** Three.js (r160+) with `RoomEnvironment`, procedural geometries, and software WebGL detection (`isSoftwareGl`)
- **Audio:** Custom Web Audio API synthesizer (`src/utils/audio.ts`)
- **Unit Testing:** Node test runner (`node:test`, `node:assert/strict`) via `tsx`
- **Tooling:** Vite 8, Lucide React icons

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Run deterministic unit tests
npm test

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

---

## 📄 License & Integrity
All demonstration assets and code licensed for educational and simulation showcase purposes.
