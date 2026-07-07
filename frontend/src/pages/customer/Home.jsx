import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../components/customer/Navbar.jsx";
import ProductCard from "../../components/customer/ProductCard.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { FiSearch } from "react-icons/fi";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [toast, setToast] = useState("");
  const { addItem } = useCart();
  const cart = useCart();
  console.log(cart);
  const { user } = useAuth();
  console.log("HOME USER:", user);

  useEffect(() => {
    api
      .get("/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params = { active_only: "true" };
    if (search) params.search = search;
    if (activeCategory) params.category_id = activeCategory;
    const t = setTimeout(() => {
      api.get("/products", { params }).then(({ data }) => setProducts(data));
    }, 200);
    return () => clearTimeout(t);
  }, [search, activeCategory]);

  function handleAdd(product) {
    addItem(product, 1);
    setToast(`Added ${product.name} to cart`);
    setTimeout(() => setToast(""), 1500);
  }

  return (
    <div className="min-h-screen">
      <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
          <div className="
            rounded-3xl
            bg-gradient-to-r
            from-ngip-accent
            via-yellow-400
            to-yellow-300
            text-ngip-bg
            p-8
            lg:p-12
            shadow-xl
            ">

            <div className="max-w-2xl">

            <p className="uppercase tracking-[4px] text-xs font-bold opacity-80 mb-3">
            WELCOME TO
            </p>

            <h1 className="font-display text-5xl font-bold leading-tight mb-4">
            Ngip Sari-Sari Store
            </h1>

            <p className="text-lg opacity-90 mb-8">
            Everyday essentials, groceries, snacks and beverages delivered right to your doorstep.
            </p>

            <button
            onClick={() =>
            document
            .getElementById("products")
            ?.scrollIntoView({ behavior: "smooth" })
            }
            className="
            bg-ngip-bg
            text-ngip-accent
            px-7
            py-3
            rounded-2xl
            font-semibold
            hover:scale-105
            transition
            "
            >
            Shop Now →
            </button>

          </div>

        </div>
        <div className="bg-white dark:bg-ngip-panel rounded-3xl p-6 shadow border border-gray-200 dark:border-white/5">
          <div className="relative max-w-lg">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
              />
            <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search snacks, groceries, drinks..."
            className="
              w-full
              pl-12
              pr-4
              py-4
              rounded-2xl
              bg-gray-50
              dark:bg-ngip-bg
              border
              border-gray-200
              dark:border-white/10
              focus:ring-2
              focus:ring-ngip-accent
              "
              />
            </div> 
        </div>
        <div className="
            bg-white
            dark:bg-ngip-panel
            rounded-3xl
            p-5
            shadow
            border
            border-gray-200
            dark:border-white/5
            ">

          <div className="flex gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveCategory("")}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === ""
                  ? "bg-ngip-accent text-ngip-bg shadow-lg"
                  : "bg-white dark:bg-ngip-panel text-gray-700 dark:text-ngip-text border border-gray-200 dark:border-white/5 hover:border-ngip-accent hover:text-ngip-accent"
              } `}
            >
              🛒 All
            </button>

            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === c.id
                    ? "bg-ngip-accent text-ngip-bg shadow-lg"
                    : "bg-white dark:bg-ngip-panel border border-gray-200 dark:border-white/5 hover:border-ngip-accent"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
        <div
          id="products"
          className="
            bg-white
            dark:bg-ngip-panel
            rounded-3xl
            border
            border-gray-200
            dark:border-white/5
            shadow
            overflow-hidden
          "
        >
          {/* Fixed Header */}
          <div
            className="
              sticky
              top-0
              z-10
              bg-white
              dark:bg-ngip-panel
              border-b
              border-gray-200
              dark:border-white/5
              px-6
              py-5
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold">
                  Featured Products
                </h2>

                <p className="text-sm text-gray-500 dark:text-ngip-muted mt-1">
                  Browse our latest available products.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-ngip-muted">
                  Showing
                </span>

                <span className="px-4 py-2 rounded-full bg-ngip-accent/15 text-ngip-accent font-semibold">
                  {products.length}
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable Product List */}
          <div className="max-h-[70vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-ngip-accent scrollbar-track-transparent">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAdd={handleAdd}
                />
              ))}

              {products.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="text-6xl mb-4">📦</div>

                  <h3 className="font-semibold text-lg">
                    No products found
                  </h3>

                  <p className="text-gray-500 dark:text-ngip-muted">
                    Try another keyword.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-ngip-accent text-ngip-bg text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
          {toast}
        </div>
      )}
      </div>
  );
}