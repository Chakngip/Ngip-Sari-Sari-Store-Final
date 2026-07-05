import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Navbar from '../../components/customer/Navbar.jsx';
import ProductCard from '../../components/customer/ProductCard.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [toast, setToast] = useState('');
  const { addItem } = useCart();
  const cart = useCart();
  console.log(cart);
  const { user } = useAuth();
  console.log("HOME USER:", user);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    const params = { active_only: 'true' };
    if (search) params.search = search;
    if (activeCategory) params.category_id = activeCategory;
    const t = setTimeout(() => {
      api.get('/products', { params }).then(({ data }) => setProducts(data));
    }, 200);
    return () => clearTimeout(t);
  }, [search, activeCategory]);

  function handleAdd(product) {
    addItem(product, 1);
    setToast(`Added ${product.name} to cart`);
    setTimeout(() => setToast(''), 1500);
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-5 py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold mb-1">Shop the Store</h1>
          <p className="text-ngip-muted text-sm">Everyday essentials, straight from Ngip Sari-Sari Store.</p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full max-w-sm mb-4 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
        />

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory('')}
            className={`text-xs px-3 py-1.5 rounded-full border ${activeCategory === '' ? 'bg-ngip-accent text-ngip-bg border-ngip-accent font-semibold' : 'border-white/10 text-ngip-muted hover:text-ngip-text'}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`text-xs px-3 py-1.5 rounded-full border ${activeCategory === c.id ? 'bg-ngip-accent text-ngip-bg border-ngip-accent font-semibold' : 'border-white/10 text-ngip-muted hover:text-ngip-text'}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} />
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center text-ngip-muted py-16">No products found.</div>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-ngip-accent text-ngip-bg text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
