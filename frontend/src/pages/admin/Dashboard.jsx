import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Layout from '../../components/common/Layout.jsx';
import StatCard from '../../components/admin/StatCard.jsx';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard/stats')
      .then(({ data }) => setStats(data))
      .catch(() => setError('Could not load dashboard stats'));
  }, []);

  const peso = (n) => `₱${Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

  return (
    <Layout>
      <div className="p-8 max-w-5xl">
        <h1 className="font-display text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-ngip-muted text-sm mb-6">Store overview — online + in-store sales combined.</p>

        {error && <div className="text-ngip-accent2 text-sm mb-4">{error}</div>}

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Sales Today" value={peso(stats.salesToday)} accent />
            <StatCard label="Orders Today" value={stats.ordersToday} />
            <StatCard label="Active Products" value={stats.totalProducts} />
            <StatCard label="Customers" value={stats.totalCustomers} />
            <StatCard label="Cashiers" value={stats.totalCashiers} />
            <StatCard label="Lifetime Online Sales" value={peso(stats.lifetimeOnlineSales)} />
            <StatCard label="Lifetime POS Sales" value={peso(stats.lifetimePosSales)} />
          </div>
        )}
      </div>
    </Layout>
  );
}
