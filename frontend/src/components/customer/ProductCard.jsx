export default function ProductCard({ product, onAdd }) {
  const outOfStock = product.stock_qty <= 0;

  return (
    <div className="bg-ngip-panel border border-white/5 rounded-2xl overflow-hidden flex flex-col">
      <div className="aspect-square bg-black/20 flex items-center justify-center">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl">🛒</span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-xs text-ngip-muted mb-1">{product.Category?.name || 'General'}</div>
        <div className="font-medium text-sm mb-2 flex-1">{product.name}</div>
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-ngip-accent">₱{Number(product.price).toFixed(2)}</span>
          <button
            onClick={() => onAdd(product)}
            disabled={outOfStock}
            className="text-xs bg-ngip-accent text-ngip-bg font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {outOfStock ? 'Out of stock' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
