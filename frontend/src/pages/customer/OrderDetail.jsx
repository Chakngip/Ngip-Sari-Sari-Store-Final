import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/customer/Navbar.jsx';
import StatusBadge from '../../components/customer/StatusBadge.jsx';
import api from '../../api/axios';

const TRACKING_STEPS = ['pending', 'preparing', 'out_for_delivery', 'completed'];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch {
      setError('Could not load this order');
    }
  }

  useEffect(() => { load(); }, [id]);

  async function handleCancel() {
    if (!confirm('Cancel this order? Stock will be restored.')) return;
    await api.put(`/orders/${id}/cancel`);
    load();
  }

  if (error) return <div className="min-h-screen"><Navbar /><div className="p-8 text-center text-ngip-accent2">{error}</div></div>;
  if (!order) return <div className="min-h-screen"><Navbar /></div>;

  const stepIndex = TRACKING_STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-5 py-8">
        <button onClick={() => navigate('/orders')} className="text-xs text-ngip-muted hover:text-ngip-text mb-4">← Back to orders</button>

        <div className="flex items-center justify-between mb-1">
          <h1 className="font-display text-2xl font-bold">{order.receipt_number}</h1>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-ngip-muted text-sm mb-6">{new Date(order.createdAt).toLocaleString('en-PH')}</p>

        {order.status !== 'cancelled' && (
          <div className="bg-ngip-panel border border-white/5 rounded-2xl p-5 mb-6">
            <div className="flex justify-between">
              {TRACKING_STEPS.map((s, i) => (
                <div key={s} className="flex-1 text-center">
                  <div className={`w-3 h-3 mx-auto rounded-full mb-2 ${i <= stepIndex ? 'bg-ngip-accent' : 'bg-white/10'}`} />
                  <div className={`text-[11px] ${i <= stepIndex ? 'text-ngip-text' : 'text-ngip-muted'}`}>
                    {s.replace(/_/g, ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-ngip-panel border border-white/5 rounded-2xl overflow-hidden mb-6">
          {order.items.map((it) => (
            <div key={it.id} className="flex justify-between px-4 py-3 border-b border-white/5 last:border-0 text-sm">
              <span>{it.quantity}x {it.product_name}</span>
              <span>₱{Number(it.line_total).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between px-4 py-3 font-bold text-sm bg-black/10">
            <span>Total</span>
            <span className="text-ngip-accent">₱{Number(order.total_amount).toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-ngip-panel border border-white/5 rounded-2xl p-5 text-sm space-y-1 mb-6">
          <div><span className="text-ngip-muted">Delivery Address: </span>{order.delivery_address}</div>
          <div><span className="text-ngip-muted">Payment Method: </span>{order.payment_method?.toUpperCase()}</div>
        </div>

        {order.status === 'pending' && (
          <button onClick={handleCancel} className="text-ngip-accent2 text-sm hover:underline">
            Cancel this order
          </button>
        )}
      </div>
    </div>
  );
}
