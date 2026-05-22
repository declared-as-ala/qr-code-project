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
    <nav
      className="flex gap-2 overflow-x-auto py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Categories du menu"
      role="tablist"
    >
      {categories.map((category) => {
        const active = activeCategory === category;
        return (
          <button
            key={category}
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(category)}
            className="min-h-11 shrink-0 whitespace-nowrap rounded-full px-4.5 text-[12.5px] font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a537]/40 active:scale-[0.96]"
            style={
              active
                ? {
                    background: "var(--pm-accent-gradient)",
                    color: "var(--pm-text-on-dark, #09090b)",
                    boxShadow: "0 6px 20px rgba(212, 165, 55, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.35)",
                    border: "1px solid rgba(212, 165, 55, 0.3)",
                  }
                : {
                    background: "rgba(24, 24, 31, 0.5)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    color: "var(--pm-text-muted)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  }
            }
          >
            {category}
          </button>
        );
      })}
    </nav>
  );
}
