# Ngip Sari-Sari Store

Cross-platform store app — this package contains the **backend API** and the **Admin + Cashier web app**. Customer-facing storefront and mobile builds come in a later phase (see the structural plan).

```
ngip-sari-sari-store/
├── backend/     Node.js + Express + Sequelize + PostgreSQL API
└── frontend/    React + Vite + Tailwind — Admin dashboard & Cashier POS
```

## Quick Start

**1. Backend**
```bash
cd backend
npm install
cp .env.example .env      # set your Postgres credentials
createdb ngip_store       # create the database
npm run seed               # creates first admin: [email protected] / admin12345
npm run dev                 # http://localhost:5000
```

**2. Frontend** (in a second terminal)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev                 # http://localhost:5173
```

**3. Log in**
- Go to `http://localhost:5173/login`
- Admin: `[email protected]` / `admin12345` → change the password immediately (via `/api/auth` — a change-password endpoint can be added next)
- Create cashier accounts from **Admin → Cashiers**, then log in as that cashier to use the POS

## What's built so far
- Full **Admin**: dashboard stats, product CRUD, category-linked stock, cashier account management
- Full **Cashier POS**: open/close shift with cash reconciliation, quick sale (search or scan barcode), cart, multi-payment checkout, auto change calculation, printable receipt matching the documented receipt format
- Shared inventory: POS sales and (future) online orders deduct from the same `products.stock_qty`

## Next up
- Customer storefront (browse/cart/checkout) — web first, then Flutter/React Native for Android & iOS
- Payment gateway integration (GCash/Maya via PayMongo)
- Push notifications, order tracking, delivery/rider flow

See `Ngip_Sari-Sari_Store_Structural_Plan.md` (shared earlier) for the full architecture and roadmap.
