import { useState } from 'react';

export default function StockModal({ open, mode, product, onClose, onSubmit }) {
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');

  if (!open || !product) return null;
  const isRestock = mode === 'restock';

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      quantity: isRestock ? parseInt(quantity, 10) : undefined,
      quantity_change: !isRestock ? parseInt(quantity, 10) : undefined,
      note,
    });
    setQuantity('');
    setNote('');
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-ngip-panel border border-white/10 rounded-2xl w-full max-w-sm p-6">
        <h2 className="font-display text-lg font-bold mb-1">
          {isRestock ? 'Restock' : 'Adjust Stock'}
        </h2>
        <p className="text-ngip-muted text-sm mb-4">{product.name} · current stock: {product.stock_qty}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-ngip-muted mb-1">
              {isRestock ? 'Quantity to add' : 'Quantity change (use negative to subtract)'}
            </label>
            <input
              type="number" required value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={isRestock ? 'e.g. 50' : 'e.g. -3 or 5'}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
            />
          </div>
          <div>
            <label className="block text-xs text-ngip-muted mb-1">Note {isRestock ? '(optional)' : '(required)'}</label>
            <input
              value={note} onChange={(e) => setNote(e.target.value)} required={!isRestock}
              placeholder={isRestock ? 'e.g. Supplier delivery' : 'e.g. Damaged goods, recount correction'}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-sm border border-white/10 hover:bg-white/5">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2 rounded-lg text-sm bg-ngip-accent text-ngip-bg font-semibold hover:opacity-90">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
