import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Layout from '../../components/common/Layout.jsx';

const STATUSES = ['pending', 'paid', 'preparing', 'out_for_delivery', 'completed', 'cancelled'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  async function load() {
    const { data } = await api.get('/admin/orders', { params: statusFilter ? { status: statusFilter } : {} });
    setOrders(data);
  }

  useEffect(() => { load(); }, [statusFilter]);

  async function updateStatus(id, status) {
    await api.put(`/admin/orders/${id}/status`, { status });
    load();
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold mb-1">Orders</h1>
            <p className="text-ngip-muted text-sm">Online orders and in-store (POS) sales, all in one place.</p>
          </div>
          <select
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        <div className="bg-ngip-panel border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-left text-ngip-muted text-xs border-b border-white/5">
              <tr>
                <th className="px-4 py-3">Receipt No.</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Customer / Cashier</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                  <td className="px-4 py-3">{o.receipt_number}</td>
                  <td className="px-4 py-3 text-ngip-muted capitalize">{o.order_source}</td>
                  <td className="px-4 py-3 text-ngip-muted">{o.customer?.name || o.cashier?.name || '—'}</td>
                  <td className="px-4 py-3">₱{Number(o.total_amount).toFixed(2)}</td>
                  <td className="px-4 py-3 capitalize">{o.status.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-xs outline-none focus:border-ngip-accent"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-ngip-muted">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
