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
            className="min-h-11 shrink-0 whitespace-nowrap rounded-full px-4 text-[12.5px] font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 active:scale-[0.96]"
            style={
              active
                ? {
                    background: "var(--pm-accent-gradient)",
                    color: "white",
                    boxShadow: "var(--pm-shadow-chip-active)",
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
