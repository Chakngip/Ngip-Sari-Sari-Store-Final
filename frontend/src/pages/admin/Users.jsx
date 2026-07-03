import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Layout from '../../components/common/Layout.jsx';

const ROLE_TABS = [
  { value: '', label: 'All' },
  { value: 'customer', label: 'Customers' },
  { value: 'cashier', label: 'Cashiers' },
  { value: 'admin', label: 'Admins' },
];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState(null);

  async function load() {
    const params = {};
    if (role) params.role = role;
    if (search) params.search = search;
    const { data } = await api.get('/admin/users', { params });
    setUsers(data);
  }

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, search]);

  async function toggleStatus(u) {
    await api.put(`/admin/users/${u.id}/status`, { is_active: !u.is_active });
    load();
  }

  async function openDetail(u) {
    const { data } = await api.get(`/admin/users/${u.id}`);
    setDetail(data);
  }

  return (
    <Layout>
      <div className="p-8">
        <h1 className="font-display text-2xl font-bold mb-1">Users</h1>
        <p className="text-ngip-muted text-sm mb-6">All accounts — customers, cashiers, and admins.</p>

        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-2">
            {ROLE_TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setRole(t.value)}
                className={`text-sm px-3 py-1.5 rounded-lg ${role === t.value ? 'bg-ngip-accent text-ngip-bg font-semibold' : 'text-ngip-muted hover:bg-white/5'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone…"
            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent w-64"
          />
        </div>

        <div className="bg-ngip-panel border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-left text-ngip-muted text-xs border-b border-white/5">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <button onClick={() => openDetail(u)} className="hover:underline text-left">{u.name}</button>
                  </td>
                  <td className="px-4 py-3 text-ngip-muted">{u.email || u.phone || '—'}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3 text-ngip-muted">{new Date(u.createdAt).toLocaleDateString('en-PH')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${u.is_active ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-ngip-muted'}`}>
                      {u.is_active ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.role !== 'admin' && (
                      <button onClick={() => toggleStatus(u)} className="text-ngip-accent hover:underline">
                        {u.is_active ? 'Block' : 'Unblock'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-ngip-muted">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setDetail(null)}>
          <div className="bg-ngip-panel border border-white/10 rounded-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-lg font-bold mb-1">{detail.name}</h2>
            <p className="text-ngip-muted text-sm mb-4 capitalize">{detail.role}</p>
            <div className="text-sm space-y-1 mb-4">
              <div><span className="text-ngip-muted">Email: </span>{detail.email || '—'}</div>
              <div><span className="text-ngip-muted">Phone: </span>{detail.phone || '—'}</div>
              <div><span className="text-ngip-muted">Address: </span>{detail.address || '—'}</div>
              <div><span className="text-ngip-muted">Joined: </span>{new Date(detail.createdAt).toLocaleDateString('en-PH')}</div>
            </div>
            {detail.orderStats && (
              <div className="bg-black/20 rounded-lg p-3 text-sm mb-4">
                <div className="flex justify-between"><span className="text-ngip-muted">Total Orders</span><span>{detail.orderStats.totalOrders}</span></div>
                <div className="flex justify-between"><span className="text-ngip-muted">Total Spent</span><span className="text-ngip-accent font-semibold">₱{detail.orderStats.totalSpent.toFixed(2)}</span></div>
              </div>
            )}
            <button onClick={() => setDetail(null)} className="w-full py-2 rounded-lg text-sm border border-white/10 hover:bg-white/5">
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
