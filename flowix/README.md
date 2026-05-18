# FLOWIX

FLOWIX is a desktop barcode sales and stock management system for small businesses.

## Stack
- Electron + React + TailwindCSS (desktop UI)
- Node.js + SQLite (local backend)

## Key capabilities
- Offline-first POS
- Touchscreen-friendly UI
- Turkish localization by default
- Role-based login (admin/kasiyer)
- Sales, products, stock, customers, reports, settings modules
- Demo seed data
- Windows installer config (electron-builder)

## Run
```bash
cd flowix
npm install
npm run dev
```

## Build installer
```bash
npm run build:win
```

Output installer: `dist/FLOWIX Setup *.exe`
