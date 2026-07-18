"use client";

import { memo, useEffect, useRef } from "react";

export type ChipCategory = { id: string; name: string };

function MenuCategoryChipsBase({
  categories,
  activeId,
  onSelect,
}: {
  categories: ChipCategory[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const navRef = useRef<HTMLElement | null>(null);
  const btnRefs = useRef(new Map<string, HTMLButtonElement>());

  // Keep the active pill visible: center it horizontally without ever
  // touching the page's vertical scroll (manual scrollTo on the nav only).
  useEffect(() => {
    const nav = navRef.current;
    const btn = btnRefs.current.get(activeId);
    if (!nav || !btn) return;
    const target = btn.offsetLeft - (nav.clientWidth - btn.offsetWidth) / 2;
    const left = Math.max(0, Math.min(target, nav.scrollWidth - nav.clientWidth));
    if (Math.abs(nav.scrollLeft - left) < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    nav.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
  }, [activeId]);

  return (
    <nav
      ref={navRef}
      className="flex gap-2 overflow-x-auto py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Catégories du menu"
      role="tablist"
    >
      {categories.map((category) => {
        const active = activeId === category.id;
        return (
          <button
            key={category.id}
            ref={(el) => {
              if (el) btnRefs.current.set(category.id, el);
              else btnRefs.current.delete(category.id);
            }}
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(category.id)}
            className="min-h-11 shrink-0 whitespace-nowrap rounded-full px-4.5 text-[12.5px] font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a537]/40 active:scale-[0.96]"
            style={
              active
                ? {
                    background: "var(--pm-accent-gradient)",
                    color: "var(--pm-text-on-dark, #09090b)",
                    boxShadow: "0 6px 20px rgba(212, 165, 55, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.35)",
                    border: "1px solid rgba(212, 165, 55, 0.3)",
                  }
                : {
                    background: "rgba(28, 28, 35, 0.9)",
                    color: "var(--pm-text-muted)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }
            }
          >
            {category.name}
          </button>
        );
      })}
    </nav>
  );
}

export const MenuCategoryChips = memo(MenuCategoryChipsBase);
