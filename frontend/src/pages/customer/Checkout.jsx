import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/customer/Navbar.jsx';
import { useCart } from '../../context/CartContext.jsx';
import api from '../../api/axios';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
        payment_method: paymentMethod,
        delivery_address: address,
      });
      clearCart();
      navigate(`/orders/${data.order.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-xl mx-auto px-5 py-16 text-center text-ngip-muted">
          Your cart is empty.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-xl mx-auto px-5 py-8">
        <h1 className="font-display text-2xl font-bold mb-6">Checkout</h1>

        <form onSubmit={handleSubmit} className="bg-ngip-panel border border-white/5 rounded-2xl p-6 space-y-4">
          {error && <div className="text-ngip-accent2 text-sm">{error}</div>}

          <div>
            <label className="block text-xs text-ngip-muted mb-1">Delivery Address</label>
            <textarea
              required rows={3} value={address} onChange={(e) => setAddress(e.target.value)}
              placeholder="House/unit no., street, barangay, city"
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
            />
          </div>

          <div>
            <label className="block text-xs text-ngip-muted mb-1">Payment Method</label>
            <select
              value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
            >
              <option value="cod">Cash on Delivery</option>
              <option value="gcash">GCash (pay upon confirmation)</option>
              <option value="maya">Maya (pay upon confirmation)</option>
            </select>
            <p className="text-xs text-ngip-muted mt-1">
              Online payment gateway integration is coming soon — for now GCash/Maya orders are confirmed manually by the store.
            </p>
          </div>

          <div className="border-t border-white/5 pt-4 flex items-center justify-between">
            <span className="text-ngip-muted text-sm">Order Total</span>
            <span className="font-display text-xl font-bold text-ngip-accent">₱{total.toFixed(2)}</span>
          </div>

          <button
            type="submit" disabled={submitting}
            className="w-full bg-ngip-accent text-ngip-bg font-semibold rounded-lg py-2.5 text-sm hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Placing order…' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}
