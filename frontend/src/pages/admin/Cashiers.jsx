import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Layout from '../../components/common/Layout.jsx';

export default function Cashiers() {
  const [cashiers, setCashiers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    const { data } = await api.get('/admin/cashiers');
    setCashiers(data);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await api.post('/admin/cashiers', form);
      setForm({ name: '', email: '', password: '' });
      setSuccess('Cashier account created.');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create cashier');
    }
  }

  async function toggleStatus(c) {
    await api.put(`/admin/cashiers/${c.id}/status`, { is_active: !c.is_active });
    load();
  }

  return (
    <Layout>
      <div className="p-8 max-w-3xl">
        <h1 className="font-display text-2xl font-bold mb-1">Cashiers</h1>
        <p className="text-ngip-muted text-sm mb-6">Create and manage cashier (POS) accounts.</p>

        <form onSubmit={handleCreate} className="bg-ngip-panel border border-white/5 rounded-2xl p-5 mb-6 grid grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-xs text-ngip-muted mb-1">Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent" />
          </div>
          <div>
            <label className="block text-xs text-ngip-muted mb-1">Email</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent" />
          </div>
          <div>
            <label className="block text-xs text-ngip-muted mb-1">Temp Password</label>
            <input required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent" />
          </div>
          <div className="col-span-3">
            <button className="bg-ngip-accent text-ngip-bg font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90">
              + Create Cashier
            </button>
            {error && <span className="ml-3 text-ngip-accent2 text-sm">{error}</span>}
            {success && <span className="ml-3 text-green-400 text-sm">{success}</span>}
          </div>
        </form>

        <div className="bg-ngip-panel border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-left text-ngip-muted text-xs border-b border-white/5">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {cashiers.map((c) => (
                <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3 text-ngip-muted">{c.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${c.is_active ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-ngip-muted'}`}>
                      {c.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => toggleStatus(c)} className="text-ngip-accent hover:underline">
                      {c.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
              {cashiers.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-ngip-muted">No cashiers yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
