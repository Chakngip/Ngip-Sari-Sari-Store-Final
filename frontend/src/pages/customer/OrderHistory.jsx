import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/customer/Navbar.jsx';
import StatusBadge from '../../components/customer/StatusBadge.jsx';
import api from '../../api/axios';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-5 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">
              My Orders
            </h1>

            <p className="text-gray-500 dark:text-ngip-muted mt-2">
              View your order history and track your purchases.
            </p>
          </div>

          <div
            className="
              px-4 py-2
              rounded-full
              bg-ngip-accent/10
              text-ngip-accent
              font-semibold
            "
          >
            {orders.length} Orders
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 text-ngip-muted">
            No orders yet. <Link to="/" className="text-ngip-accent hover:underline">Start shopping →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <Link
                key={o.id} to={`/orders/${o.id}`}
                className="block bg-ngip-panel border border-white/5 rounded-2xl p-4 hover:-translate-y-1 hover:shadow-xl transition-all duration 300 transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{o.receipt_number}</span>
                  <StatusBadge status={o.status} />
                </div>
                <div className="text-xs text-ngip-muted">
                  {new Date(o.createdAt).toLocaleString('en-PH')} · {o.items?.length || 0} item(s)
                </div>
                <div className="mt-3 flex justify-between items-end">
                  <div>
                      <div className="text-xs text-gray-500 dark:text-ngip-muted">
                          Total
                      </div>

                      <div className="font-display text-xl font-bold text-ngip-accent">
                          ₱{Number(o.total_amount).toFixed(2)}
                      </div>
                  </div>

                  <span className="text-sm text-ngip-accent font-medium">
                      View Details →
                  </span>
              </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
