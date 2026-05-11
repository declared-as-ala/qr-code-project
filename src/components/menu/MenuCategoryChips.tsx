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
      className="flex gap-2 overflow-x-auto py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Catégories du menu"
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
            className="shrink-0 whitespace-nowrap rounded-full px-4 py-[9px] text-[12.5px] font-medium tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 active:scale-[0.95]"
            style={
              active
                ? {
                    background: "var(--pm-bg-card-chip-active)",
                    color: "var(--pm-text-on-dark)",
                    boxShadow: "var(--pm-shadow-chip-active)",
                    fontWeight: "600",
                  }
                : {
                    background: "var(--pm-bg-card-elevated)",
                    color: "var(--pm-text-body)",
                    border: "1px solid var(--pm-border-subtle)",
                    boxShadow: "var(--pm-shadow-chip-inactive)",
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
