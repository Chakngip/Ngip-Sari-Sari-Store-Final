export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        className="
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          p-6
          shadow-2xl
          bg-white
          dark:bg-ngip-panel
          text-gray-800
          dark:text-ngip-text
          border
          border-gray-200
          dark:border-white/10
          transition-colors
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Order Details
          </h2>

          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-xl transition"
          >
            ✕
          </button>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          <div>
            <p className="text-xs text-gray-500 dark:text-ngip-muted">
              Receipt No.
            </p>

            <p className="font-semibold">
              {order.receipt_number}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-ngip-muted">
              Status
            </p>

            <p className="capitalize font-semibold">
              {order.status.replaceAll("_", " ")}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-ngip-muted">
              Source
            </p>

            <p className="capitalize">
              {order.order_source}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-ngip-muted">
              Payment
            </p>

            <p className="uppercase">
              {order.payment_method}
            </p>
          </div>

          {/* Delivery Address */}
          <div className="col-span-2">
            <p className="text-xs text-gray-500 dark:text-ngip-muted mb-2">
              📍 Delivery Address
            </p>

            <div className="rounded-xl border-2 border-yellow-400 bg-yellow-100 dark:bg-yellow-400/10 p-4">
              <p className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                {order.delivery_address || "Walk-in Customer"}
              </p>
            </div>
          </div>

        </div>

        <hr className="border-gray-200 dark:border-white/10 mb-5" />

        {/* Ordered Items */}
        <h3 className="font-semibold mb-3">
          Ordered Items
        </h3>

        <table className="w-full text-sm">

          <thead
            className="
              text-gray-600
              dark:text-ngip-muted
              border-b
              border-gray-200
              dark:border-white/10
            "
          >
            <tr>
              <th className="text-left py-2">
                Product
              </th>

              <th className="text-center">
                Qty
              </th>

              <th className="text-right">
                Price
              </th>

              <th className="text-right">
                Total
              </th>
            </tr>
          </thead>

          <tbody>

            {order.items.map((item) => (

              <tr
                key={item.id}
                className="border-b border-gray-100 dark:border-white/5"
              >

                <td className="py-3">
                  {item.product_name}
                </td>

                <td className="text-center">
                  {item.quantity}
                </td>

                <td className="text-right">
                  ₱{Number(item.price_at_purchase).toFixed(2)}
                </td>

                <td className="text-right font-semibold">
                  ₱{Number(item.line_total).toFixed(2)}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {/* Totals */}
        <div className="mt-6 border-t border-gray-200 dark:border-white/10 pt-5">

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₱{Number(order.subtotal).toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Discount</span>
            <span>₱{Number(order.discount).toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-ngip-accent">
              ₱{Number(order.total_amount).toFixed(2)}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}