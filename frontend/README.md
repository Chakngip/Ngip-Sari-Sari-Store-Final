# Ngip Frontend (Customer Storefront + Admin + Cashier)

React + Vite + TailwindCSS. Covers the customer storefront (browse/cart/checkout/orders), the Admin dashboard/products/cashiers/orders, and the Cashier POS (Quick Sale) screen — all in one web app, role-routed after login.

## Setup

```bash
cd frontend
npm install
cp .env.example .env
# edit VITE_API_URL if your backend isn't on localhost:5000

npm run dev   # http://localhost:5173
```

- Browse the storefront at `/` without logging in — cart is stored in `localStorage`.
- Sign in or register as a customer to check out.
- Log in with the seeded admin account (see backend README) for `/admin/*`, or create a cashier account from Admin → Cashiers and log in with that for `/cashier/pos`.

## Structure

```
src/
├── api/axios.js              # API client with auth token attached automatically
├── context/
│   ├── AuthContext           # login/register/logout state, persisted in localStorage
│   └── CartContext           # customer shopping cart, persisted in localStorage
├── routes/ProtectedRoute     # role-based route guard, preserves intended destination
├── components/
│   ├── common/Layout          # admin/cashier sidebar nav, role-aware links
│   ├── admin/                 # StatCard, ProductFormModal
│   ├── cashier/                # ReceiptView
│   └── customer/               # Navbar, ProductCard, StatusBadge
├── pages/
│   ├── Login.jsx / Register.jsx
│   ├── customer/               # Home, Cart, Checkout, OrderHistory, OrderDetail
│   ├── admin/                  # Dashboard, Products, Cashiers, Orders
│   └── cashier/POS.jsx         # Quick Sale screen (the POS itself)
└── App.jsx                     # route table
```

## What's working

- **Customer:** browse/search/filter products, cart (persists across reloads), register/login, checkout (delivery address + COD/GCash/Maya), order history, order detail with a tracking timeline, cancel a pending order
- **Admin:** login, dashboard stats, product CRUD, **Inventory** (stock levels, low-stock flagging, restock, manual adjustments, full movement history), **Orders** (online + POS, status updates), **Reports** (date-ranged revenue chart, revenue by source/payment method, top products, shift history across all cashiers), **Users** (all accounts, search/filter by role, block/unblock, customer order stats), **Settings** (store name/address/hours, delivery fee, low-stock default, receipt footer, open/closed toggle), cashier account creation/enable/disable
- **Cashier:** open shift (starting cash) → search/add products → cart with editable qty → checkout (cash/GCash/Maya/card) → auto change calculation → receipt view (print-ready) → close shift → own **Shift History** with cash reconciliation

## Not yet built (next phases)
- Online payment gateway integration (GCash/Maya currently confirmed manually by the admin)
- Push notifications for order status changes
- Mobile apps (Android/iOS) — this web app is the foundation; a Flutter or React Native build can reuse the same backend API
- Delivery/rider flow

