import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/customer/Navbar.jsx';
import StatusBadge from '../../components/customer/StatusBadge.jsx';
import api from '../../api/axios';

const COD_STEPS = [
  {
    key: "pending",
    title: "Pending",
    subtitle: "Order received",
  },
  {
    key: "preparing",
    title: "Preparing",
    subtitle: "Packing your order",
  },
  {
    key: "out_for_delivery",
    title: "Out for Delivery",
    subtitle: "On the way",
  },
  {
    key: "completed",
    title: "Completed",
    subtitle: "Delivered & Paid",
  },
];

const ONLINE_STEPS = [
  {
    key: "pending",
    title: "Pending",
    subtitle: "Waiting for payment",
  },
  {
    key: "paid",
    title: "Paid",
    subtitle: "Payment confirmed",
  },
  {
    key: "preparing",
    title: "Preparing",
    subtitle: "Packing your order",
  },
  {
    key: "out_for_delivery",
    title: "Out for Delivery",
    subtitle: "On the way",
  },
  {
    key: "completed",
    title: "Completed",
    subtitle: "Delivered",
  },
];

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
  if (!order && !error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="p-8 text-center text-ngip-muted">
          Loading order details...
        </div>
      </div>
    );
  }

  const displaySteps =
    order.payment_method === "cod"
      ? COD_STEPS
      : ONLINE_STEPS;

  const stepIndex = displaySteps.findIndex(
    (step) => step.key === order.status
  );


  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-5 py-8">

        {/* Back Button */}
        <button
          onClick={() => navigate('/orders')}
          className="mb-4 inline-flex items-center gap-1 text-sm text-ngip-muted hover:text-ngip-text transition"
        >
          ← Back to orders
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-display text-2xl font-bold">
            {order.receipt_number}
          </h1>

          <StatusBadge status={order.status} />
        </div>

        <p className="text-ngip-muted text-sm mb-6">
          {new Date(order.createdAt).toLocaleString('en-PH')}
        </p>

        {/* Tracking */}
        {order.status !== "cancelled" && (
          <div className="bg-ngip-panel border border-white/5 rounded-2xl p-8 mb-6">
            <div className="flex items-start">
              {displaySteps.map((step, index) => (
                <div
                  key={step.key}
                  className={`flex items-center ${
                    index === displaySteps.length - 1 ? "flex-none" : "flex-1"
                  }`}
                >
                  {/* Step */}
                  <div className="flex flex-col items-center z-10">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        text-sm font-bold transition-all duration-300
                        ${
                          index < stepIndex
                            ? "bg-green-500 text-white"
                            : index === stepIndex
                            ? "bg-yellow-400 text-black"
                            : "bg-gray-300 dark:bg-gray-700 text-gray-500"
                        }
                      `}
                    >
                      {index < stepIndex ? "✓" : index + 1}
                    </div>

                    <div
                      className={`mt-2 text-center ${
                        index <= stepIndex
                          ? "text-ngip-text"
                          : "text-ngip-muted"
                      }`}
                    >
                      <div className="text-xs font-medium">
                        {step.title}
                      </div>

                      <div className="text-[10px] opacity-70">
                        {step.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Connector */}
                  {index !== displaySteps.length - 1 && (
                    <div className="flex-1 h-1 mx-2 rounded-full bg-gray-300 dark:bg-gray-700 relative -mt-6">
                      <div
                        className={`
                          h-full rounded-full transition-all duration-500
                          ${
                            index < stepIndex
                              ? "bg-green-500 w-full"
                              : "bg-transparent w-0"
                          }
                        `}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-ngip-panel border border-white/5 rounded-2xl overflow-hidden mb-6">

          {/* Section Header */}
          <div className="px-4 py-3 border-b border-white/5 text-sm font-semibold">
            Order Items
          </div>

          {/* Items */}
          {order.items.map((it) => (
            <div
              key={it.id}
              className="flex justify-between px-4 py-3 text-sm border-b border-white/5 last:border-0"
            >
              <span className="text-ngip-text">
                {it.quantity}x {it.product_name}
              </span>

              <span className="font-medium">
                ₱{Number(it.line_total).toFixed(2)}
              </span>
            </div>
          ))}

          {/* Total */}
          <div className="flex justify-between px-4 py-3 font-bold text-sm bg-ngip-accent/10">
            <span>Total</span>
            <span className="text-ngip-accent">
              ₱{Number(order.total_amount).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-ngip-panel border border-white/5 rounded-2xl p-5 text-sm space-y-2 mb-6">

          <div>
            <span className="text-ngip-muted">Delivery Address:</span>
            <div className="text-ngip-text mt-1">
              {order.delivery_address}
            </div>
          </div>

          <div>
            <span className="text-ngip-muted">Payment Method:</span>
            <div className="text-ngip-text mt-1 uppercase">
              {order.payment_method}
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        {order.status === 'pending' && (
          <button
            onClick={handleCancel}
            className="
              w-full
              px-4 py-3
              rounded-lg
              text-sm
              font-semibold
              bg-red-500/10
              text-red-400
              hover:bg-red-500/20
              transition
            "
          >
            Cancel Order
          </button>
        )}

      </div>
    </div>
  );
}
