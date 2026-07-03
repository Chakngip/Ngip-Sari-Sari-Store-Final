# Ngip Backend

Express + Sequelize + PostgreSQL API covering Auth, Products, Categories, Admin (cashier management, dashboard), and POS (cashier sales, shifts, receipts).

## Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your PostgreSQL credentials

# create the database first, e.g.:
# createdb ngip_store

npm run seed   # creates first admin account + sample data
npm run dev    # starts on http://localhost:5000
```

Default seeded admin login:
- email: `[email protected]`
- password: `admin12345`
**Change this immediately after first login.**

## Key endpoints

| Method | Route | Role | Purpose |
|---|---|---|---|
| POST | /api/auth/register | public | customer self-registration |
| POST | /api/auth/login | any | login (customer/cashier/admin) |
| GET | /api/auth/me | any (auth) | current user profile |
| GET | /api/products | any | list products (search, category, barcode filters) |
| POST | /api/products | admin | create product |
| PUT | /api/products/:id | admin | update product |
| POST | /api/orders | customer | checkout (deducts stock, returns receipt) |
| GET | /api/orders | customer | own order history |
| GET | /api/orders/:id | customer/admin | order detail |
| PUT | /api/orders/:id/cancel | customer | cancel a pending order (restores stock) |
| POST | /api/admin/cashiers | admin | create a cashier account |
| GET | /api/admin/dashboard/stats | admin | store-wide stats |
| GET | /api/admin/orders | admin | all orders, online + POS |
| PUT | /api/admin/orders/:id/status | admin | update fulfillment status |
| GET | /api/admin/inventory | admin | stock levels (filter `low_stock=true`) |
| POST | /api/admin/inventory/:productId/restock | admin | add stock, logs a movement |
| POST | /api/admin/inventory/:productId/adjust | admin | correct stock (+/-), logs a movement, requires a note |
| GET | /api/admin/inventory/movements | admin | stock movement history (filter `product_id`) |
| GET | /api/admin/users | admin | list all accounts (filter `role`, `search`) |
| GET | /api/admin/users/:id | admin | user detail (+ order stats for customers) |
| PUT | /api/admin/users/:id/status | admin | block/unblock any non-admin account |
| GET | /api/admin/settings | admin | full store settings |
| PUT | /api/admin/settings | admin | update store settings |
| GET | /api/settings | public | store name/address/hours/open-status (for storefront) |
| GET | /api/admin/reports/sales | admin | revenue, order count, top products, breakdowns (filter `from`, `to`, `source`) |
| GET | /api/admin/reports/shifts | admin | shift history across all cashiers (filter `from`, `to`, `cashier_id`) |
| POST | /api/pos/shift/open | cashier | start a shift |
| POST | /api/pos/sales | cashier | record a walk-in sale (deducts stock, returns receipt) |
| POST | /api/pos/shift/close | cashier | close shift, compute cash variance |
| GET | /api/pos/shift/history | cashier | own past shifts |

See `src/routes/*` for the full list.

## Notes
- `sequelize.sync({ alter: true })` auto-creates/updates tables in dev. Switch to `sequelize-cli` migrations before production.
- All monetary fields are `DECIMAL(10,2)`.
- Stock deduction on POS sale and online checkout happens inside a DB transaction with row locking to prevent overselling.
- Every stock change (POS sale, online order, void, cancel, restock, manual adjustment) goes through the shared `applyStockChange()` helper in `src/utils/inventory.js`, which both updates `products.stock_qty` and writes a `StockMovement` row — that's what powers the Inventory → Movement History screen in the admin app.
