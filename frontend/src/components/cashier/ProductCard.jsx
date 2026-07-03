import React from "react";

const PLACEHOLDER =
  "https://placehold.co/300x300?text=No+Image";

export default function ProductCard({ product, onSelect }) {
  const outOfStock = product.stock_qty <= 0;

  return (
    <button
      onClick={() => !outOfStock && onSelect(product)}
      disabled={outOfStock}
      className={`bg-ngip-panel border rounded-xl overflow-hidden transition-all duration-200 text-left group ${
        outOfStock
          ? "opacity-50 cursor-not-allowed border-red-500/20"
          : "border-white/5 hover:border-ngip-accent hover:-translate-y-1 hover:shadow-lg"
      }`}
    >
      {/* Product Image */}

      <div className="aspect-square overflow-hidden bg-black/20">
        <img
          src={product.image_url || PLACEHOLDER}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* Product Info */}

      <div className="p-3">

        <h3 className="font-semibold line-clamp-2">
          {product.name}
        </h3>

        <p className="text-xs text-ngip-muted mt-1">
          {product.Category?.name || "Uncategorized"}
        </p>

        <div className="flex justify-between items-center mt-3">

          <span className="font-bold text-ngip-accent">
            ₱{Number(product.price).toFixed(2)}
          </span>

          <span
            className={`text-xs ${
              outOfStock
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            Stock {product.stock_qty}
          </span>

        </div>

      </div>
    </button>
  );
}