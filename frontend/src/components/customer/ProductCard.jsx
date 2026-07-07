import { FiShoppingCart } from "react-icons/fi";

export default function ProductCard({ product, onAdd }) {
  const outOfStock = product.stock_qty <= 0;

  return (
    <div
      className="
        group
        bg-white
        dark:bg-ngip-panel
        border
        border-gray-200
        dark:border-white/5
        rounded-3xl
        overflow-hidden
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
        flex
        flex-col
      "
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-black/20">

        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="
              w-full
              h-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-110
            "
          />
        ) : (
          <div className="flex items-center justify-center h-full text-6xl">
            🛍️
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 dark:bg-black/70 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
            {product.Category?.name || "General"}
          </span>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {outOfStock ? (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Out
            </span>
          ) : (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              {product.stock_qty} left
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-5">

        <h3 className="font-semibold text-base line-clamp-2 min-h-[48px]">
          {product.name}
        </h3>

        <div className="mt-2 text-xs text-gray-500 dark:text-ngip-muted">
          Available Stock
        </div>

        <div className="font-medium mb-4">
          {product.stock_qty} pcs
        </div>

        <div className="mt-auto">

          <div className="text-2xl font-display font-bold text-ngip-accent mb-4">
            ₱{Number(product.price).toFixed(2)}
          </div>

          <button
            onClick={() => onAdd(product)}
            disabled={outOfStock}
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              bg-ngip-accent
              text-ngip-bg
              font-semibold
              py-3
              rounded-xl
              hover:opacity-90
              transition
              disabled:bg-gray-400
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <FiShoppingCart />

            {outOfStock ? "Out of Stock" : "Add to Cart"}
          </button>

        </div>

      </div>
    </div>
  );
}