import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/customer/Navbar.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleCheckout() {
    if (!user) {
      navigate('/login?next=/checkout');
      return;
    }
    navigate('/checkout');
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-5 py-8">
        <h1 className="font-display text-2xl font-bold mb-6">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16 text-ngip-muted">
            Your cart is empty. <Link to="/" className="text-ngip-accent hover:underline">Go shopping →</Link>
          </div>
        ) : (
          <>
            <div className="bg-ngip-panel border border-white/5 rounded-2xl overflow-hidden mb-6">
              {items.map((i) => (
                <div key={i.product.id} className="flex items-center justify-between px-4 py-4 border-b border-white/5 last:border-0">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{i.product.name}</div>
                    <div className="text-xs text-ngip-muted">₱{Number(i.product.price).toFixed(2)} each</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number" min="1" value={i.quantity}
                      onChange={(e) => updateQty(i.product.id, parseInt(e.target.value, 10) || 0)}
                      className="w-16 bg-black/20 border border-white/10 rounded px-2 py-1 text-sm text-center"
                    />
                    <span className="w-20 text-right text-sm">₱{(Number(i.product.price) * i.quantity).toFixed(2)}</span>
                    <button onClick={() => removeItem(i.product.id)} className="text-ngip-accent2 text-xs hover:underline">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between bg-ngip-panel border border-white/5 rounded-2xl p-5">
              <div>
                <div className="text-xs text-ngip-muted">Total</div>
                <div className="font-display text-2xl font-bold text-ngip-accent">₱{total.toFixed(2)}</div>
              </div>
              <button
                onClick={handleCheckout}
                className="bg-ngip-accent text-ngip-bg font-semibold px-5 py-2.5 rounded-lg text-sm hover:opacity-90"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
