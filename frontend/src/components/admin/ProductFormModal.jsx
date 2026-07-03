import { useState, useEffect } from "react";
import api from "../../api/axios";

const emptyForm = {
  name: '',
  description: '',
  barcode: '',
  price: '',
  stock_qty: '',
  low_stock_threshold: 5,
  image_url: '',
  category_id: '',
};

export default function ProductFormModal({ open, onClose, onSubmit, categories, initialData }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    async function initializeForm() {
      if (!open) return;

      // Edit mode
      if (initialData) {
        setForm({
          ...emptyForm,
          ...initialData,
        });
        return;
      }

      // Add mode
      try {
        const { data } = await api.get("/products/generate-barcode");

        setForm({
          ...emptyForm,
          barcode: data.barcode,
        });
      } catch (err) {
        console.error(err);
        setForm(emptyForm);
      }
    }

    initializeForm();
  }, [open, initialData]);

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      ...form,
      price: parseFloat(form.price) || 0,
      stock_qty: parseInt(form.stock_qty, 10) || 0,
      low_stock_threshold:
        parseInt(form.low_stock_threshold, 10) || 5,
      category_id: form.category_id || null,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-ngip-panel border border-white/10 rounded-2xl w-full max-w-md p-6">
        <h2 className="font-display text-lg font-bold mb-4">
          {initialData ? 'Edit Product' : 'Add Product'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Field label="Name" name="name" value={form.name} onChange={handleChange} required />
          <Field label="Barcode (optional)" name="barcode" value={form.barcode} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Price (₱)"
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />

            <Field
              label="Low Stock Alert"
              name="low_stock_threshold"
              type="number"
              value={form.low_stock_threshold}
              onChange={handleChange}
            />
          </div>

          {/* Initial Stock (Create only) */}
          {!initialData && (
            <Field
              label="Initial Stock"
              name="stock_qty"
              type="number"
              value={form.stock_qty}
              onChange={handleChange}
              required
            />
          )}

          {/* Edit Mode */}
          {initialData && (
            <div className="rounded-lg border border-white/10 bg-black/20 p-3">
              <p className="text-xs text-ngip-muted">
                Current Stock
              </p>

              <p className="text-xl font-bold">
                {form.stock_qty} pcs
              </p>

              <p className="text-xs text-ngip-muted mt-1">
                Stock can only be modified from the Inventory module.
              </p>
            </div>
          )}
          <div>
            <label className="block text-xs text-ngip-muted mb-1">Category</label>
            <select
              name="category_id"
              value={form.category_id || ''}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
            >
              <option value="">— none —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <Field label="Image URL (optional)" name="image_url" value={form.image_url} onChange={handleChange} />
          <div>
            <label className="block text-xs text-ngip-muted mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-sm border border-white/10 hover:bg-white/5">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2 rounded-lg text-sm bg-ngip-accent text-ngip-bg font-semibold hover:opacity-90">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs text-ngip-muted mb-1">{label}</label>
      <input
        {...props}
        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
      />
    </div>
  );
}
