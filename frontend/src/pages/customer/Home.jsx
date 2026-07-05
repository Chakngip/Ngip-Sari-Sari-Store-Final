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
      <div className="mb-8 rounded-3xl overflow-hidden bg-gradient-to-r from-ngip-accent to-yellow-500 text-ngip-bg p-8 shadow-xl">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold mb-1">
            Shop the Store
          </h1>
          <p className="text-ngip-muted text-sm">
            Everyday essentials, straight from Ngip Sari-Sari Store.
          </p>
        </div>
        <p className="uppercase tracking-widest text-xs font-semibold mb-2">
          Welcome to
        </p>

        <h1 className="font-display text-4xl font-bold mb-3">
          Ngip Sari-Sari Store
        </h1>

        <p className="max-w-xl opacity-90 mb-6">
          Everyday essentials, snacks, beverages, groceries and household
          products delivered quickly to your doorstep.
        </p>

        <button
          onClick={() =>
            document
              .getElementById("products")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="bg-ngip-bg text-ngip-accent px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
        >
          Shop Now →
        </button>
        <div className="relative mb-6 max-w-lg">
          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-ngip-muted"
            size={18}
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search snacks, groceries, drinks..."
            className=" w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-ngip-panel border border-gray-200 dark:border-white/5 shadow-sm outline-none transition-all focus:ring-2 focus:ring-ngip-accent focus:border-ngip-accent "
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 mb-8 scrollbar-hide">
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

        <div className="flex flex-col h-[70vh]">
          <div
            id="products"
            className="flex justify-between items-center mb-6"
          ></div>

          <div>
            <h2 className="font-display text-2xl font-bold">
              Featured Products
            </h2>

            <p className="text-sm text-ngip-muted">
              Browse our latest available products.
            </p>
          </div>

          <span className="text-sm text-ngip-muted">
            {products.length} products
          </span>
          <div className=" flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-ngip-accent scrollbar-track-transparent ">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={handleAdd} />
              ))}
              {products.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="text-6xl mb-4">📦</div>

                  <h3 className="font-semibold text-lg">No products found</h3>

                  <p className="text-ngip-muted">Try another keyword.</p>
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
