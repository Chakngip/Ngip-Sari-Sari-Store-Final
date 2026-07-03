import React from "react";

export default function CategoryTabs({
  categories = [],
  selectedCategory,
  onSelect,
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
      {/* All */}
      <button
        onClick={() => onSelect("all")}
        className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm transition ${
          selectedCategory === "all"
            ? "bg-ngip-accent text-ngip-bg font-semibold"
            : "bg-ngip-panel border border-white/10 hover:border-ngip-accent"
        }`}
      >
        All
      </button>

      {(categories || []).map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm transition ${
            selectedCategory === category.id
              ? "bg-ngip-accent text-ngip-bg font-semibold"
              : "bg-ngip-panel border border-white/10 hover:border-ngip-accent"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}