import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Layout from '../../components/common/Layout.jsx';
import ProductFormModal from '../../components/admin/ProductFormModal.jsx';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [categoryModal, setCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  async function loadProducts() {
    try {
      const { data } = await api.get('/products', {
        params: {
          search: search || undefined,
          category_id:
            selectedCategory !== 'all' ? selectedCategory : undefined,
        },
      });
      setProducts(data);
    } catch {
      setError('Could not load products');
    }
  }
  useEffect(() => {
    const t = setTimeout(loadProducts, 250);
    return () => clearTimeout(t);
  }, [search, selectedCategory]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(loadProducts, 250); // debounce search
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleSave(form) {
    try {
      if (editing) {
        await api.put(`/products/${editing.id}`, form);
      } else {
        await api.post('/products', form);
      }
      setModalOpen(false);
      setEditing(null);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  }

  async function handleDeactivate(id) {
    if (!confirm('Deactivate this product? It will be hidden from sale but kept in records.')) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  }

  //Category Add,Delete,Edit
  async function loadCategories() {
    const { data } = await api.get('/categories');
    setCategories(data);
  }

  async function saveCategory() {
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, {
          name: categoryName,
        });
      } else {
        await api.post('/categories', {
          name: categoryName,
        });
      }

      // ✅ close modal + reset state
      setCategoryModal(false);
      setCategoryName('');
      setEditingCategory(null);

      // ✅ refresh data
      loadCategories();
      loadProducts();

    } catch (err) {
      setError(err.response?.data?.message || 'Category save failed');
    }
  }

  async function deleteCategory(id) {
    if (!confirm('Delete this category?')) return;
    await api.delete(`/categories/${id}`);
    loadCategories();
    loadProducts();
  }

  return (
  <Layout>
    <div className="h-[calc(100vh-64px)] flex flex-col p-8">
      
      {/* HEADER (NOT SCROLLABLE) */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">
            Products
          </h1>
          <p className="text-ngip-muted text-sm">
            Manage what's for sale, online and in-store.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCategoryModal(true)}
            className="bg-ngip-accent text-ngip-bg font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90"
          >
            Manage Categories
          </button>

          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="bg-ngip-accent text-ngip-bg font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* SEARCH + CATEGORY TABS (NOT SCROLLABLE) */}
      <div className="shrink-0 mb-5 space-y-3">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full max-w-sm bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
        />

        {/* CATEGORY TABS */}
        <div className="flex gap-2 flex-wrap">
          
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs border ${
              selectedCategory === 'all'
                ? 'bg-ngip-accent text-ngip-bg'
                : 'border-white/10 text-ngip-muted'
            }`}
          >
            All
          </button>

          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-full text-xs border ${
                selectedCategory === c.id
                  ? 'bg-ngip-accent text-ngip-bg'
                  : 'border-white/10 text-ngip-muted'
              }`}
            >
              {c.name}
            </button>
          ))}

        </div>

        {error && (
          <div className="text-ngip-accent2 text-sm">{error}</div>
        )}
      </div>

      {/* TABLE AREA (ONLY SCROLLABLE) */}
      <div className="flex-1 overflow-y-auto bg-ngip-panel border border-white/5 rounded-2xl">
        <table className="w-full text-sm">
          
          <thead className="text-left text-ngip-muted text-xs border-b border-white/5 sticky top-0 bg-ngip-panel z-10">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-b border-white/5 last:border-0 hover:bg-white/5"
              >
                <td className="px-4 py-3">{p.name}</td>

                <td className="px-4 py-3 text-ngip-muted">
                  {p.Category?.name || '—'}
                </td>

                <td className="px-4 py-3">
                  ₱{Number(p.price).toFixed(2)}
                </td>

                <td
                  className={`px-4 py-3 ${
                    p.stock_qty <= p.low_stock_threshold
                      ? 'text-ngip-accent2'
                      : ''
                  }`}
                >
                  {p.stock_qty}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      p.stock_qty <= 0
                        ? "bg-red-500/10 text-red-400"
                        : p.is_active
                        ? "bg-green-500/10 text-green-400"
                        : "bg-gray-500/10 text-gray-400"
                    }`}
                  >
                    {p.stock_qty <= 0
                      ? "Out of Stock"
                      : p.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>

                <td className="px-4 py-3 text-right space-x-3">
                  <button
                    onClick={() => {
                      setEditing(p);
                      setModalOpen(true);
                    }}
                    className="text-ngip-accent hover:underline"
                  >
                    Edit
                  </button>

                  {p.is_active && (
                    <button
                      onClick={() => handleDeactivate(p.id)}
                      className="text-ngip-accent2 hover:underline"
                    >
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-ngip-muted"
                >
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

      <ProductFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSave}
        categories={categories}
        initialData={editing}
      />

      {categoryModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-ngip-panel p-6 rounded-xl w-[400px] z-50 relative">
            <h2 className="text-lg font-bold mb-3">Categories</h2>

            <input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full mb-3 bg-black/20 border border-white/10 px-3 py-2 rounded"
            />

            <button
              onClick={saveCategory}
              className="w-full bg-ngip-accent text-ngip-bg py-2 rounded mb-4"
            >
              {editingCategory ? 'Update' : 'Add'}
            </button>

            <div className="max-h-60 overflow-auto space-y-2">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between items-center text-sm border-b border-white/5 py-2"
                >
                  <span>{c.name}</span>

                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setEditingCategory(c);
                        setCategoryName(c.name);
                      }}
                      className="text-ngip-accent text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCategory(c.id)}
                      className="text-ngip-accent2 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCategoryModal(false)}
              className="mt-4 text-xs text-ngip-muted"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
