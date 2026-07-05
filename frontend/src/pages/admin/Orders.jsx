import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Layout from '../../components/common/Layout.jsx';
import OrderDetailsModal from "../../components/admin/OrderDetailsModal.jsx";
import { useTheme } from "../../context/ThemeContext";

const STATUSES = ['pending', 'paid', 'preparing', 'out_for_delivery', 'completed', 'cancelled'];


export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quickFilter, setQuickFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState('');
  const [newOrderCount, setNewOrderCount] = useState(0);
  const { theme, toggleTheme } = useTheme();

  async function loadNewOrderCount() {
    const { data } = await api.get('/admin/orders', {
      params: { status: 'pending' },
    });

    setNewOrderCount(data.length);
  }

  async function load(start = startDate, end = endDate) {
    console.log("load() received:", start, end);

    const params = {};

    if (statusFilter) params.status = statusFilter;

    if (start && end) {
      params.startDate = start;
      params.endDate = end;
    }

    console.log("Sending Params:", params);

    const { data } = await api.get("/admin/orders", { params });

    setOrders(data);
  }

  useEffect(() => {
    load();
    loadNewOrderCount();
  }, [statusFilter]);

  useEffect(() => {
    const interval = setInterval(() => {
      load();
      loadNewOrderCount();
    }, 5000);

    return () => clearInterval(interval);
  }, [statusFilter, startDate, endDate]);

  useEffect(() => {
    load();
  }, [statusFilter, startDate, endDate]);

  async function updateStatus(id, status) {
    await api.put(`/admin/orders/${id}/status`, { status });
    load();
  }

  async function openOrder(id) {
    try {
      const { data } = await api.get(`/orders/${id}`);

      console.log("Selected Order:");
      console.log(data);

      setSelectedOrder(data);
      setShowModal(true);
    } catch (err) {
      console.error(err);
    }
  }

  function applyQuickFilter(type) {
    const today = new Date();

    let start = "";
    let end = "";

    switch (type) {
      case "all":
        setQuickFilter("all");
        setStartDate("");
        setEndDate("");
        load("", "");
        return;

      case "today":
        setQuickFilter("today");
        start = end = today.toISOString().split("T")[0];
        break;

      case "yesterday":
        setQuickFilter("yesterday");
        today.setDate(today.getDate() - 1);
        start = end = today.toISOString().split("T")[0];
        break;

      case "week": {
        setQuickFilter("week");
        const firstDay = new Date(today);
        firstDay.setDate(today.getDate() - today.getDay());

        start = firstDay.toISOString().split("T")[0];
        end = new Date().toISOString().split("T")[0];
        break;
      }

      case "month": {
        setQuickFilter("month");
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

        start = firstDay.toISOString().split("T")[0];
        end = new Date().toISOString().split("T")[0];
        break;
      }

      default:
        return;
    }
    console.log("Quick Filter Dates:", start, end);

    setStartDate(start);
    setEndDate(end);

    load(start, end);
  }

  function getRowColor(status) {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 hover:bg-yellow-500/20";

      case "paid":
        return "bg-blue-500/10 hover:bg-blue-500/20";

      case "preparing":
        return "bg-orange-500/10 hover:bg-orange-500/20";

      case "out_for_delivery":
        return "bg-purple-500/10 hover:bg-purple-500/20";

      case "completed":
        return "bg-green-500/10 hover:bg-green-500/20";

      case "cancelled":
        return "bg-red-500/10 hover:bg-red-500/20";

      default:
        return "hover:bg-white/5";
    }
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-64px)] flex flex-col p-8  bg-gray-50 text-gray-800 dark:bg-ngip-bg dark:text-ngip-text transition-colors duration-200">
        <div className="flex items-center justify-between shrink-0">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-6 shrink-0">
              <h1 className="font-display text-2xl font-bold">
                Orders
              </h1>

              {newOrderCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {newOrderCount} new
                </span>
              )}
            </div>

            <p className="text-gray-500 dark:text-ngip-muted mt-1">
              Online orders and in-store (POS) sales, all in one place.
            </p>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-ngip-panel border border-gray-300 dark:border-white/10 text-gray-800 dark:text-ngip-text rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent transition-colors"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 mb-4 shrink-0">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
          />

        </div>
        <div className="flex items-center gap-2 mb-5 shrink-0">

          <button
              onClick={() => applyQuickFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-sm transition
              ${
                  quickFilter === "all"
                      ? "bg-ngip-accent text-ngip-bg font-semibold"
                      : `
                        border border-gray-300
                        dark:border-white/10
                        text-gray-700
                        dark:text-ngip-text
                        hover:bg-gray-100
                        dark:hover:bg-white/5
                      `
              }`}
          >
              All
          </button>

          <button
              onClick={() => applyQuickFilter("today")}
              className={`px-3 py-1.5 rounded-lg text-sm transition
              ${
                  quickFilter === "today"
                      ? "bg-ngip-accent text-ngip-bg font-semibold"
                      : "border border-white/10 hover:bg-white/5"
              }`}
          >
              Today
          </button>

          <button
              onClick={() => applyQuickFilter("yesterday")}
              className={`px-3 py-1.5 rounded-lg text-sm transition
              ${
                  quickFilter === "yesterday"
                      ? "bg-ngip-accent text-ngip-bg font-semibold"
                      : "border border-white/10 hover:bg-white/5"
              }`}
          >
              Yesterday
          </button>

          <button
              onClick={() => applyQuickFilter("week")}
              className={`px-3 py-1.5 rounded-lg text-sm transition
              ${
                  quickFilter === "week"
                      ? "bg-ngip-accent text-ngip-bg font-semibold"
                      : "border border-white/10 hover:bg-white/5"
              }`}
          >
              This Week
          </button>

          <button
              onClick={() => applyQuickFilter("month")}
              className={`px-3 py-1.5 rounded-lg text-sm transition
              ${
                  quickFilter === "month"
                      ? "bg-ngip-accent text-ngip-bg font-semibold"
                      : "border border-white/10 hover:bg-white/5"
              }`}
          >
              This Month
          </button>

        </div>

        <div className="flex-1 overflow-y-auto bg-white dark:bg-ngip-panel border border-gray-200 dark:border-white/5 rounded-2xl transition-colors">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-100 dark:bg-ngip-panel text-gray-600 dark:text-ngip-muted border-b border-gray-200 dark:border-white/5">
              <tr>
                <th className="px-4 py-3">Receipt No.</th>
                <th className="px-4 py-3">
                  Date & Time
                </th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Customer / Cashier</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className={`border-b border-gray-200 dark:border-white/5 transition-colors ${getRowColor(o.status)}`}
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openOrder(o.id)}
                      className="text-ngip-accent hover:underline font-semibold"
                    >
                      {o.receipt_number}
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      {new Date(o.createdAt).toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>

                    <div className="text-xs text-gray-500 dark:text-ngip-muted">
                      {new Date(o.createdAt).toLocaleTimeString("en-PH", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-ngip-muted capitalize">{o.order_source}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-ngip-muted">{o.customer?.name || o.cashier?.name || '—'}</td>
                  <td className="px-4 py-3">₱{Number(o.total_amount).toFixed(2)}</td>
                  <td className="px-4 py-3 capitalize">{o.status.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 text-right">
                    {(
                    o.status === "cancelled" ||
                    o.status === "completed" ||
                    o.order_source === "pos"
                  ) ? (
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${
                        o.status === "cancelled"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      Locked
                    </span>
                  ) : (
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="bg-white dark:bg-ngip-panel border border-gray-300 dark:border-white/10 text-gray-800 dark:text-ngip-text rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent transition-colors"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-ngip-muted">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </Layout>
  );
}
