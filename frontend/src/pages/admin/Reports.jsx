import { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import api from '../../api/axios';
import Layout from '../../components/common/Layout.jsx';
import StatCard from '../../components/admin/StatCard.jsx';

function toDateInput(d) {
  return d.toISOString().slice(0, 10);
}

const today = new Date();
const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);

export default function Reports() {
  const [from, setFrom] = useState(toDateInput(weekAgo));
  const [to, setTo] = useState(toDateInput(today));
  const [source, setSource] = useState('');
  const [report, setReport] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [tab, setTab] = useState('sales'); // 'sales' | 'shifts'

  async function loadSales() {
    const { data } = await api.get('/admin/reports/sales', { params: { from, to, source: source || undefined } });
    setReport(data);
  }

  async function loadShifts() {
    const { data } = await api.get('/admin/reports/shifts', { params: { from, to } });
    setShifts(data);
  }

  useEffect(() => { loadSales(); }, [from, to, source]);
  useEffect(() => { if (tab === 'shifts') loadShifts(); }, [tab, from, to]);

  const peso = (n) => `₱${Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold mb-1">Reports</h1>
            <p className="text-ngip-muted text-sm">Sales performance and cashier shift history.</p>
          </div>
          <div className="flex items-center gap-2">
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent" />
            <span className="text-ngip-muted text-sm">to</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent" />
            <select value={source} onChange={(e) => setSource(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent">
              <option value="">Online + POS</option>
              <option value="online">Online only</option>
              <option value="pos">POS only</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 mb-5">
          <button onClick={() => setTab('sales')} className={`text-sm px-3 py-1.5 rounded-lg ${tab === 'sales' ? 'bg-ngip-accent text-ngip-bg font-semibold' : 'text-ngip-muted hover:bg-white/5'}`}>
            Sales
          </button>
          <button onClick={() => setTab('shifts')} className={`text-sm px-3 py-1.5 rounded-lg ${tab === 'shifts' ? 'bg-ngip-accent text-ngip-bg font-semibold' : 'text-ngip-muted hover:bg-white/5'}`}>
            Shift History
          </button>
        </div>

        {tab === 'sales' && report && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <StatCard label="Total Revenue" value={peso(report.totalRevenue)} accent />
              <StatCard label="Total Orders" value={report.totalOrders} />
              <StatCard label="Avg. Order Value" value={peso(report.avgOrderValue)} />
            </div>

            <div className="bg-ngip-panel border border-white/5 rounded-2xl p-5 mb-6">
              <h2 className="font-display font-bold text-sm mb-4">Revenue by Day</h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={report.dailySeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: '#93A08D', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#93A08D', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#16241A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [peso(v), 'Revenue']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#F2B705" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-ngip-panel border border-white/5 rounded-2xl p-5">
                <h2 className="font-display font-bold text-sm mb-3">Revenue by Source</h2>
                {Object.entries(report.revenueBySource).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm py-1.5 border-b border-white/5 last:border-0">
                    <span className="capitalize text-ngip-muted">{k}</span>
                    <span>{peso(v)}</span>
                  </div>
                ))}
                {Object.keys(report.revenueBySource).length === 0 && <div className="text-ngip-muted text-sm">No data.</div>}
              </div>
              <div className="bg-ngip-panel border border-white/5 rounded-2xl p-5">
                <h2 className="font-display font-bold text-sm mb-3">Revenue by Payment Method</h2>
                {Object.entries(report.revenueByMethod).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm py-1.5 border-b border-white/5 last:border-0">
                    <span className="uppercase text-ngip-muted">{k}</span>
                    <span>{peso(v)}</span>
                  </div>
                ))}
                {Object.keys(report.revenueByMethod).length === 0 && <div className="text-ngip-muted text-sm">No data.</div>}
              </div>
            </div>

            <div className="bg-ngip-panel border border-white/5 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5 font-display font-bold text-sm">Top Products</div>
              <table className="w-full text-sm">
                <thead className="text-left text-ngip-muted text-xs border-b border-white/5">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Qty Sold</th>
                    <th className="px-4 py-3">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {report.topProducts.map((p) => (
                    <tr key={p.name} className="border-b border-white/5 last:border-0">
                      <td className="px-4 py-3">{p.name}</td>
                      <td className="px-4 py-3">{p.quantity}</td>
                      <td className="px-4 py-3">{peso(p.revenue)}</td>
                    </tr>
                  ))}
                  {report.topProducts.length === 0 && (
                    <tr><td colSpan={3} className="px-4 py-8 text-center text-ngip-muted">No sales in this range.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'shifts' && (
          <div className="bg-ngip-panel border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-left text-ngip-muted text-xs border-b border-white/5">
                <tr>
                  <th className="px-4 py-3">Cashier</th>
                  <th className="px-4 py-3">Opened</th>
                  <th className="px-4 py-3">Closed</th>
                  <th className="px-4 py-3">Opening Cash</th>
                  <th className="px-4 py-3">Closing Cash</th>
                  <th className="px-4 py-3">Variance</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((s) => (
                  <tr key={s.id} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3">{s.cashier?.name || '—'}</td>
                    <td className="px-4 py-3 text-ngip-muted whitespace-nowrap">{new Date(s.opened_at).toLocaleString('en-PH')}</td>
                    <td className="px-4 py-3 text-ngip-muted whitespace-nowrap">{s.closed_at ? new Date(s.closed_at).toLocaleString('en-PH') : '—'}</td>
                    <td className="px-4 py-3">{peso(s.opening_cash)}</td>
                    <td className="px-4 py-3">{s.closing_cash != null ? peso(s.closing_cash) : '—'}</td>
                    <td className={`px-4 py-3 ${Number(s.cash_variance) < 0 ? 'text-ngip-accent2' : Number(s.cash_variance) > 0 ? 'text-green-400' : ''}`}>
                      {s.cash_variance != null ? peso(s.cash_variance) : '—'}
                    </td>
                    <td className="px-4 py-3 capitalize">{s.status}</td>
                  </tr>
                ))}
                {shifts.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-ngip-muted">No shifts in this range.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
