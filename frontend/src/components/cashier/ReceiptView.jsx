export default function ReceiptView({ receipt, onClose }) {
  if (!receipt) return null;
  const peso = (n) => `₱${Number(n || 0).toFixed(2)}`;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-black rounded-lg w-full max-w-xs font-mono text-xs p-4">
        <div className="text-center mb-2">
          <div className="font-bold text-sm">{receipt.storeName}</div>
          <div>123 Sample St., Cebu City, PH</div>
        </div>
        <div className="border-t border-dashed border-black my-2" />
        <div>Receipt No.: {receipt.receiptNumber}</div>
        <div>Date: {new Date(receipt.date).toLocaleString('en-PH')}</div>
        <div>Cashier: {receipt.cashier}</div>
        <div className="border-t border-dashed border-black my-2" />
        {receipt.items.map((it, i) => (
          <div key={i} className="flex justify-between">
            <span>{it.qty}x {it.name}</span>
            <span>{peso(it.lineTotal)}</span>
          </div>
        ))}
        <div className="border-t border-dashed border-black my-2" />
        <div className="flex justify-between"><span>Subtotal</span><span>{peso(receipt.subtotal)}</span></div>
        <div className="flex justify-between"><span>Discount</span><span>{peso(receipt.discount)}</span></div>
        <div className="flex justify-between font-bold"><span>Total</span><span>{peso(receipt.total)}</span></div>
        <div className="border-t border-dashed border-black my-2" />
        <div className="flex justify-between"><span>Payment</span><span>{receipt.paymentMethod?.toUpperCase()}</span></div>
        {receipt.amountTendered != null && (
          <div className="flex justify-between"><span>Tendered</span><span>{peso(receipt.amountTendered)}</span></div>
        )}
        {receipt.change != null && (
          <div className="flex justify-between"><span>Change</span><span>{peso(receipt.change)}</span></div>
        )}
        <div className="border-t border-dashed border-black my-2" />
        <div className="text-center">Thank you, salamat po!</div>
        <div className="text-center">Please come again 😊</div>

        <div className="flex gap-2 mt-4 font-sans">
          <button onClick={() => window.print()} className="flex-1 py-2 rounded bg-gray-200 text-black text-xs">Print</button>
          <button onClick={onClose} className="flex-1 py-2 rounded bg-black text-white text-xs">New Sale</button>
        </div>
      </div>
    </div>
  );
}
