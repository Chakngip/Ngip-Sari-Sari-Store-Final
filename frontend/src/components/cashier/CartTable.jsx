export default function ProductGrid({
  cart,
  updateQty,
}) {
  return (
    <div className="bg-ngip-panel border border-white/5 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="text-left text-ngip-muted text-xs border-b border-white/5">
          <tr>
            <th className="px-4 py-3">Item</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Qty</th>
            <th className="px-4 py-3">Line Total</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>

        <tbody>
          {cart.map((item) => (
            <tr
              key={item.product.id}
              className="border-b border-white/5 last:border-0"
            >
              <td className="px-4 py-3">
                {item.product.name}
              </td>

              <td className="px-4 py-3 text-ngip-muted">
                ₱{Number(item.product.price).toFixed(2)}
              </td>

              <td className="px-4 py-3">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQty(
                      item.product.id,
                      parseInt(e.target.value, 10) || 0
                    )
                  }
                  className="w-16 bg-black/20 border border-white/10 rounded px-2 py-1 text-sm"
                />
              </td>

              <td className="px-4 py-3">
                ₱
                {(
                  Number(item.product.price) *
                  item.quantity
                ).toFixed(2)}
              </td>

              <td className="px-4 py-3 text-right">
                <button
                  onClick={() =>
                    updateQty(item.product.id, 0)
                  }
                  className="text-ngip-accent2 text-xs hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}

          {cart.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-8 text-center text-ngip-muted"
              >
                Cart is empty. Search above to add items.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}