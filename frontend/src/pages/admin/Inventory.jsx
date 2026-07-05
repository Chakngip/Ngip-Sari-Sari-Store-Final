import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../components/common/Layout.jsx";
import StockModal from "../../components/admin/StockModal.jsx";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [tab, setTab] = useState("stock"); // 'stock' | 'history'
  const [modal, setModal] = useState({
    open: false,
    mode: null,
    product: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadProducts() {
    const { data } = await api.get("/admin/inventory", {
      params: showLowStockOnly ? { low_stock: "true" } : {},
    });
    setProducts(data);
  }

  async function loadMovements() {
    const { data } = await api.get("/admin/inventory/movements");
    setMovements(data);
  }

  useEffect(() => {
    loadProducts();
  }, [showLowStockOnly]);
  useEffect(() => {
    if (tab === "history") loadMovements();
  }, [tab]);

  async function handleStockSubmit(payload) {
    setError("");
    setSuccess("");
    try {
      const endpoint =
        modal.mode === "restock"
          ? `/admin/inventory/${modal.product.id}/restock`
          : `/admin/inventory/${modal.product.id}/adjust`;
      await api.post(endpoint, payload);
      setSuccess(
        `${modal.mode === "restock" ? "Restocked" : "Adjusted"} ${modal.product.name}.`,
      );
      setModal({ open: false, mode: null, product: null });
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update stock");
    }
  }

  const lowStockCount = products.filter(
    (p) => p.stock_qty <= p.low_stock_threshold,
  ).length;

  return (
    <Layout>
      <div className="h-[calc(100vh-64px)] flex flex-col p-8">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div>
            <h1 className="font-display text-2xl font-bold mb-1">Inventory</h1>
            <p className="text-ngip-muted text-sm">
              Stock levels shared by the online store and the POS counter.
              {lowStockCount > 0 && (
                <span className="text-ngip-accent2">
                  {" "}
                  · {lowStockCount} low-stock item(s)
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setTab("stock")}
            className={`text-sm px-3 py-1.5 rounded-lg ${tab === "stock" ? "bg-ngip-accent text-ngip-bg font-semibold" : "text-ngip-muted hover:bg-white/5"}`}
          >
            Stock Levels
          </button>
          <button
            onClick={() => setTab("history")}
            className={`text-sm px-3 py-1.5 rounded-lg ${tab === "history" ? "bg-ngip-accent text-ngip-bg font-semibold" : "text-ngip-muted hover:bg-white/5"}`}
          >
            Movement History
          </button>
        </div>

        {error && <div className="text-ngip-accent2 text-sm mb-3">{error}</div>}
        {success && (
          <div className="text-green-400 text-sm mb-3">{success}</div>
        )}

        {tab === "stock" ? (
          <>
            <label className="flex items-center gap-2 text-sm text-ngip-muted mb-4">
              <input
                type="checkbox"
                checked={showLowStockOnly}
                onChange={(e) => setShowLowStockOnly(e.target.checked)}
              />
              Show low-stock items only
            </label>

            <div className="flex-1 overflow-y-auto bg-ngip-panel border border-white/5 rounded-2xl">
              <table className="w-full text-sm">
                <thead className="text-left text-ngip-muted text-xs border-b border-white/5 sticky top-0 bg-ngip-panel z-10">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Threshold</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const low = p.stock_qty <= p.low_stock_threshold;
                    return (
                      <tr
                        key={p.id}
                        className="border-b border-white/5 last:border-0 hover:bg-white/5"
                      >
                        <td className="px-4 py-3">{p.name}</td>
                        <td className="px-4 py-3 text-ngip-muted">
                          {p.Category?.name || "—"}
                        </td>
                        <td
                          className={`px-4 py-3 font-medium ${low ? "text-ngip-accent2" : ""}`}
                        >
                          {p.stock_qty}{" "}
                          {low && <span className="text-xs">⚠ low</span>}
                        </td>
                        <td className="px-4 py-3 text-ngip-muted">
                          {p.low_stock_threshold}
                        </td>
                        <td className="px-4 py-3 text-right space-x-3">
                          <button
                            onClick={() =>
                              setModal({
                                open: true,
                                mode: "restock",
                                product: p,
                              })
                            }
                            className="text-ngip-accent hover:underline"
                          >
                            Restock
                          </button>
                          <button
                            onClick={() =>
                              setModal({
                                open: true,
                                mode: "adjust",
                                product: p,
                              })
                            }
                            className="text-ngip-muted hover:underline"
                          >
                            Adjust
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {products.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-ngip-muted"
                      >
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto bg-ngip-panel border border-white/5 rounded-2xl">
            <table className="w-full text-sm">
              <thead className="text-left text-ngip-muted text-xs border-b border-white/5 sticky top-0 bg-ngip-panel z-10">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Change</th>
                  <th className="px-4 py-3">Resulting Stock</th>
                  <th className="px-4 py-3">By</th>
                  <th className="px-4 py-3">Note</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="px-4 py-3 text-ngip-muted whitespace-nowrap">
                      {new Date(m.createdAt).toLocaleString("en-PH")}
                    </td>
                    <td className="px-4 py-3">{m.Product?.name || "—"}</td>
                    <td className="px-4 py-3 capitalize text-ngip-muted">
                      {m.type.replace(/_/g, " ")}
                    </td>
                    <td
                      className={`px-4 py-3 font-medium ${m.quantity_change < 0 ? "text-ngip-accent2" : "text-green-400"}`}
                    >
                      {m.quantity_change > 0 ? "+" : ""}
                      {m.quantity_change}
                    </td>
                    <td className="px-4 py-3">{m.resulting_stock}</td>
                    <td className="px-4 py-3 text-ngip-muted">
                      {m.actor?.name || "System"}
                    </td>
                    <td className="px-4 py-3 text-ngip-muted">
                      {m.note || "—"}
                    </td>
                  </tr>
                ))}
                {movements.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-ngip-muted"
                    >
                      No stock movements yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <StockModal
        open={modal.open}
        mode={modal.mode}
        product={modal.product}
        onClose={() => setModal({ open: false, mode: null, product: null })}
        onSubmit={handleStockSubmit}
      />
    </Layout>
  );
}
