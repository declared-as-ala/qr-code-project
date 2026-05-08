"use client";

export function MenuCategoryChips({
  categories,
  activeCategory,
  onSelect,
}: {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => {
        const active = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`shrink-0 rounded-full border px-4 py-2.5 text-[13px] font-semibold tracking-tight transition-all ${
              active
                ? "border-[#111116] bg-[#111116] text-white shadow-[0_8px_20px_rgba(0,0,0,0.2)]"
                : "border-neutral-200 bg-white text-neutral-700 hover:-translate-y-0.5 hover:border-[#d4a537]/55 hover:shadow-md"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
