import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Layout from '../../components/common/Layout.jsx';

export default function ShiftHistory() {
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    api.get('/pos/shift/history').then(({ data }) => setShifts(data));
  }, []);

  const peso = (n) => `₱${Number(n || 0).toFixed(2)}`;

  return (
    <Layout>
      <div className="p-8">
        <h1 className="font-display text-2xl font-bold mb-1">Shift History</h1>
        <p className="text-ngip-muted text-sm mb-6">Your past shifts and cash reconciliation.</p>

        <div className="bg-ngip-panel border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-left text-ngip-muted text-xs border-b border-white/5">
              <tr>
                <th className="px-4 py-3">Opened</th>
                <th className="px-4 py-3">Closed</th>
                <th className="px-4 py-3">Opening Cash</th>
                <th className="px-4 py-3">Closing Cash</th>
                <th className="px-4 py-3">Total Sales</th>
                <th className="px-4 py-3">Variance</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((s) => (
                <tr key={s.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 text-ngip-muted whitespace-nowrap">{new Date(s.opened_at).toLocaleString('en-PH')}</td>
                  <td className="px-4 py-3 text-ngip-muted whitespace-nowrap">{s.closed_at ? new Date(s.closed_at).toLocaleString('en-PH') : '—'}</td>
                  <td className="px-4 py-3">{peso(s.opening_cash)}</td>
                  <td className="px-4 py-3">{s.closing_cash != null ? peso(s.closing_cash) : '—'}</td>
                  <td className="px-4 py-3">{peso(s.total_sales)}</td>
                  <td className={`px-4 py-3 ${Number(s.cash_variance) < 0 ? 'text-ngip-accent2' : Number(s.cash_variance) > 0 ? 'text-green-400' : ''}`}>
                    {s.cash_variance != null ? peso(s.cash_variance) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${s.status === 'open' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-ngip-muted'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
              {shifts.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-ngip-muted">No shifts yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
