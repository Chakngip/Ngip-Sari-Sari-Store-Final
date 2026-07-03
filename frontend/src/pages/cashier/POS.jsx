import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Layout from '../../components/common/Layout.jsx';
import ReceiptView from '../../components/cashier/ReceiptView.jsx';
import ProductSearch from "../../components/cashier/ProductSearch.jsx";
import ProductGrid from "../../components/cashier/ProductGrid.jsx";
import CartTable from "../../components/cashier/CartTable.jsx";
import CartPanel from "../../components/cashier/CartPanel.jsx";
import CategoryTabs from "../../components/cashier/CategoryTabs.jsx";

export default function POS() {
  const [shift, setShift] = useState(null);
  const [openingCash, setOpeningCash] = useState('');
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]); // [{ product, quantity }]
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [tendered, setTendered] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  async function loadShift() {
    try {
      const { data } = await api.get('/pos/shift/summary');
      if (data.shift?.status === 'open') setShift(data.shift);
    } catch {
      // no shifts yet — fine
    }
  }

  async function loadProducts() {
    try {
      const { data } = await api.get("/products", {
        params: {
          search,
          category_id:
            selectedCategory === "all"
              ? undefined
              : selectedCategory,
          active_only: "true",
        },
      });

      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadShift();
    loadCategories();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      loadProducts();
    }, 200);

    return () => clearTimeout(t);
  }, [search, selectedCategory]);

  async function handleOpenShift(e) {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/pos/shift/open', { opening_cash: parseFloat(openingCash) || 0 });
      setShift(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not open shift');
    }
  }

  async function loadCategories() {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  }

  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    setSearch('');
  }

  function updateQty(productId, qty) {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setCart((prev) => prev.map((i) => i.product.id === productId ? { ...i, quantity: qty } : i));
    }
  }

  const total = cart.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);
  const change = paymentMethod === 'cash' && tendered ? (parseFloat(tendered) - total) : null;

  async function handleCheckout() {
    if (!cart.length) return;

    setSubmitting(true);
    setError('');

    try {
      const { data } = await api.post('/pos/sales', {
        items: cart.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
        payment_method: paymentMethod,
        amount_tendered:
          paymentMethod === 'cash' ? parseFloat(tendered) || 0 : null,
        discount: 0,
      });

      setReceipt(data.receipt);
      setCart([]);
      setTendered('');

      // ✅ ADD THIS (IMPORTANT)
      await loadProducts();

    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  }

  function handleCloseReceipt() {
    setReceipt(null);
  }

  async function handleCloseShift() {
    const closing = prompt('Enter counted cash to close the shift:');
    if (closing === null) return;
    await api.post('/pos/shift/close', { closing_cash: parseFloat(closing) || 0 });
    setShift(null);
  }

  if (!shift) {
    return (
      <Layout>
        <div className="p-8 max-w-sm mx-auto mt-16">
          <h1 className="font-display text-xl font-bold mb-1">Open Your Shift</h1>
          <p className="text-ngip-muted text-sm mb-5">Enter your starting cash to begin selling.</p>
          <form onSubmit={handleOpenShift} className="bg-ngip-panel border border-white/5 rounded-2xl p-5 space-y-3">
            {error && <div className="text-ngip-accent2 text-sm">{error}</div>}
            <div>
              <label className="block text-xs text-ngip-muted mb-1">Opening Cash (₱)</label>
              <input
                type="number" step="0.01" required value={openingCash}
                onChange={(e) => setOpeningCash(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
              />
            </div>
            <button className="w-full bg-ngip-accent text-ngip-bg font-semibold rounded-lg py-2.5 text-sm hover:opacity-90">
              Open Shift
            </button>
          </form>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 grid grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="col-span-2">

          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display text-2xl font-bold">
              Quick Sale
            </h1>

            <button
              onClick={handleCloseShift}
              className="text-xs text-ngip-accent2 hover:underline"
            >
              Close Shift
            </button>
          </div>

          <ProductSearch
            search={search}
            setSearch={setSearch}
            products={products}
            onSelectProduct={addToCart}
          />

          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />

          <div className="mt-4">
            <ProductGrid
              products={products}
              addToCart={addToCart}
            />
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div>
          <CartPanel
            total={total}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            tendered={tendered}
            setTendered={setTendered}
            change={change}
            error={error}
            cart={cart}
            submitting={submitting}
            handleCheckout={handleCheckout}
          />
          <CartTable
            cart={cart}
            updateQty={updateQty}
          />
        </div>

      </div>

      <ReceiptView receipt={receipt} onClose={handleCloseReceipt} />
    </Layout>
  );
}
