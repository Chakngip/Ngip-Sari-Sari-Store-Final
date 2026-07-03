import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Layout from '../../components/common/Layout.jsx';

export default function Settings() {
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/settings').then(({ data }) => setForm(data));
  }, []);

  function update(field) {
    return (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setForm((f) => ({ ...f, [field]: value }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(''); setSuccess('');
    try {
      const { data } = await api.put('/admin/settings', form);
      setForm(data);
      setSuccess('Settings saved.');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save settings');
    } finally {
      setSaving(false);
    }
  }

  if (!form) return <Layout><div className="p-8 text-ngip-muted">Loading…</div></Layout>;

  return (
    <Layout>
      <div className="p-8 max-w-xl">
        <h1 className="font-display text-2xl font-bold mb-1">Store Settings</h1>
        <p className="text-ngip-muted text-sm mb-6">Store details shown to customers, receipts, and defaults.</p>

        <form onSubmit={handleSubmit} className="bg-ngip-panel border border-white/5 rounded-2xl p-6 space-y-4">
          {error && <div className="text-ngip-accent2 text-sm">{error}</div>}
          {success && <div className="text-green-400 text-sm">{success}</div>}

          <div className="flex items-center justify-between bg-black/20 rounded-lg px-4 py-3">
            <div>
              <div className="text-sm font-medium">Store is {form.is_store_open ? 'Open' : 'Closed'}</div>
              <div className="text-xs text-ngip-muted">Toggle off to pause new online orders</div>
            </div>
            <input type="checkbox" checked={form.is_store_open} onChange={update('is_store_open')} className="w-5 h-5" />
          </div>

          <Field label="Store Name" value={form.store_name} onChange={update('store_name')} required />
          <Field label="Address" value={form.address || ''} onChange={update('address')} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone" value={form.phone || ''} onChange={update('phone')} />
            <Field label="Email" type="email" value={form.email || ''} onChange={update('email')} />
          </div>
          <Field label="Business Hours" value={form.business_hours || ''} onChange={update('business_hours')} placeholder="Mon-Sun 7:00 AM - 10:00 PM" />
          <Field label="Logo URL" value={form.logo_url || ''} onChange={update('logo_url')} />

          <div className="grid grid-cols-2 gap-3">
            <Field label="Delivery Fee (₱)" type="number" step="0.01" value={form.delivery_fee} onChange={update('delivery_fee')} />
            <Field label="Default Low-Stock Threshold" type="number" value={form.low_stock_default_threshold} onChange={update('low_stock_default_threshold')} />
          </div>

          <div>
            <label className="block text-xs text-ngip-muted mb-1">Receipt Footer Message</label>
            <textarea
              rows={2} value={form.receipt_footer_message || ''} onChange={update('receipt_footer_message')}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
            />
          </div>

          <button
            type="submit" disabled={saving}
            className="w-full bg-ngip-accent text-ngip-bg font-semibold rounded-lg py-2.5 text-sm hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </form>
      </div>
    </Layout>
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
