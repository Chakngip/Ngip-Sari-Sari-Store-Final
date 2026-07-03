const PLACEHOLDER =
  "https://placehold.co/300x300?text=No+Image";

export default function ProductGrid({
  products,
  addToCart,
}) {
  if (!products.length) {
    return (
      <div className="bg-ngip-panel rounded-2xl h-[70vh] flex items-center justify-center text-ngip-muted">
        No products found.
      </div>
    );
  }

  return (
    <div
      className="
      h-[70vh]
      overflow-y-auto
      pr-2
      "
    >
      <div
        className="
        grid
        grid-cols-2
        md:grid-cols-3
        xl:grid-cols-4
        gap-4
        "
      >
        {products.map((product) => {
            const outOfStock = product.stock_qty <= 0;

            return (
                <button
                key={product.id}
                disabled={outOfStock}
                onClick={() => addToCart(product)}
                className={`
                    bg-ngip-panel
                    rounded-xl
                    overflow-hidden
                    border
                    border-white/5
                    transition
                    ${
                    outOfStock
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105 hover:border-ngip-accent"
                    }
                `}
                >
                <img
                    src={product.image_url || PLACEHOLDER}
                    alt={product.name}
                    className={`
                    w-full
                    h-40
                    object-cover
                    ${outOfStock ? "grayscale" : ""}
                    `}
                />

                <div className="p-3">
                    <h3 className="font-semibold text-left line-clamp-2">
                    {product.name}
                    </h3>

                    <p
                        className={`text-xs text-left mt-1 ${
                            outOfStock
                            ? "text-red-400"
                            : "text-ngip-muted"
                        }`}
                    >
                        Stock: {product.stock_qty}
                    </p>

                    <div className="mt-3 flex justify-between items-center">
                    <span className="font-bold text-ngip-accent">
                        ₱{Number(product.price).toFixed(2)}
                    </span>

                    <span
                        className={`
                        text-xs
                        px-3
                        py-1
                        rounded-full
                        ${
                            outOfStock
                            ? "bg-gray-600 text-gray-300"
                            : "bg-ngip-accent text-ngip-bg"
                        }
                        `}
                    >
                        {outOfStock ? "Out of Stock" : "Add"}
                    </span>
                    </div>
                </div>
                </button>
            );
            })}
      </div>
    </div>
  );
}