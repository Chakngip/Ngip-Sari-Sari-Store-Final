export default function CartPanel({
  total,
  paymentMethod,
  setPaymentMethod,
  tendered,
  setTendered,
  change,
  error,
  cart,
  submitting,
  handleCheckout,
}) {
  return (
    <div className="bg-ngip-panel border border-white/5 rounded-2xl p-5 sticky top-8">
      <h2 className="font-display font-bold mb-4">Checkout</h2>

      <div className="flex justify-between text-sm mb-2">
        <span className="text-ngip-muted">Total</span>
        <span className="font-display text-xl font-bold text-ngip-accent">
          ₱{total.toFixed(2)}
        </span>
      </div>

      <div className="mt-4">
        <label className="block text-xs text-ngip-muted mb-1">
          Payment Method
        </label>

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
        >
          <option value="cash">Cash</option>
          <option value="gcash">GCash</option>
          <option value="maya">Maya</option>
          <option value="card">Card</option>
        </select>
      </div>

      {paymentMethod === "cash" && (
        <div className="mt-3">
          <label className="block text-xs text-ngip-muted mb-1">
            Amount Tendered (₱)
          </label>

          <input
            type="number"
            step="0.01"
            value={tendered}
            onChange={(e) => setTendered(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
          />

          {change != null && !isNaN(change) && (
            <div
              className={`text-sm mt-2 ${
                change < 0
                  ? "text-ngip-accent2"
                  : "text-green-400"
              }`}
            >
              Change: ₱{change.toFixed(2)}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="text-ngip-accent2 text-sm mt-3">
          {error}
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={
          !cart.length ||
          submitting ||
          (paymentMethod === "cash" && change < 0)
        }
        className="w-full mt-5 bg-ngip-accent text-ngip-bg font-semibold rounded-lg py-2.5 text-sm hover:opacity-90 disabled:opacity-40"
      >
        {submitting ? "Processing…" : "Complete Sale"}
      </button>
    </div>
  );
}