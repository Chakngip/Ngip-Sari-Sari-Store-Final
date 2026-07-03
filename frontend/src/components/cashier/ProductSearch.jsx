import { useEffect, useState } from "react";
import CategoryTabs from "./CategoryTabs";

export default function ProductSearch({
  search,
  setSearch,
  categories,
  selectedCategory,
  setSelectedCategory,
}) {
  const [keyword, setKeyword] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(keyword);
    }, 200);

    return () => clearTimeout(timer);
  }, [keyword, setSearch]);

  useEffect(() => {
    setKeyword(search);
  }, [search]);

  return (
    <div className="space-y-4 mb-5">
      {/* Search */}
      <input
        autoFocus
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search product or scan barcode..."
        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-3 text-sm outline-none focus:border-ngip-accent"
      />
    </div>
  );
}