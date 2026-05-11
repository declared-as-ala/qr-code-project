"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { MenuWelcome } from "@/components/menu/MenuWelcome";
import { MenuCategoryChips } from "@/components/menu/MenuCategoryChips";
import { MenuProductCard } from "@/components/menu/MenuProductCard";
import { MenuLogoFallback } from "@/components/menu/MenuLogoFallback";

type Product = {
  _id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  badge?: string;
  isAvailable: boolean;
};

type Category = { _id: string; name: string };

export function PublicMenuClient({
  restaurant,
  categories,
  products,
}: {
  restaurant: {
    name: string;
    logo?: string;
    coverImage?: string;
    phone?: string;
    address?: string;
    googleMapsUrl?: string;
    primaryColor?: string;
  };
  categories: Category[];
  products: Product[];
}) {
  const fallbackCategories: Category[] = [
    { _id: "pizza", name: "Pizza" },
    { _id: "pasta", name: "Pasta" },
    { _id: "burgers", name: "Burgers" },
    { _id: "cafes", name: "Cafés" },
    { _id: "desserts", name: "Desserts" },
    { _id: "boissons", name: "Boissons" },
  ];

  const effectiveCategories = categories.length > 0 ? categories : fallbackCategories;
  const [search, setSearch] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(effectiveCategories[0]?.name ?? "");

  const productsWithCategory = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        categoryName:
          effectiveCategories.find((c) => c._id === product.categoryId)?.name ?? "",
      })),
    [products, effectiveCategories]
  );

  const fallbackProducts = useMemo(
    () => [
      {
        _id: "f1",
        categoryId: effectiveCategories[0]?._id ?? "pizza",
        categoryName: effectiveCategories[0]?.name ?? "Pizza",
        name: "Pizza Burrata",
        description: "Sauce tomate douce, burrata crémeuse, basilic frais, huile d'olive.",
        price: 24.5,
        image:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=85",
        badge: "Signature",
        isAvailable: true,
      },
      {
        _id: "f2",
        categoryId: effectiveCategories[1]?._id ?? "pasta",
        categoryName: effectiveCategories[1]?.name ?? "Pasta",
        name: "Pasta Crémeuse",
        description: "Parmesan affiné 24 mois, crème légère, champignons sautés.",
        price: 21,
        image:
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=85",
        badge: "Populaire",
        isAvailable: true,
      },
      {
        _id: "f3",
        categoryId: effectiveCategories[3]?._id ?? "cafes",
        categoryName: effectiveCategories[3]?.name ?? "Cafés",
        name: "Cappuccino Caramel",
        description: "Espresso intense, mousse soyeuse, caramel premium infusé.",
        price: 7.5,
        image:
          "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=85",
        badge: "Nouveau",
        isAvailable: true,
      },
      {
        _id: "f4",
        categoryId: effectiveCategories[0]?._id ?? "pizza",
        categoryName: effectiveCategories[0]?.name ?? "Pizza",
        name: "Pizza Truffe Noire",
        description: "Base crème, mozzarella di bufala, copeaux de truffe noire.",
        price: 32,
        image:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=85",
        badge: "Promo",
        isAvailable: true,
      },
    ],
    [effectiveCategories]
  );

  const effectiveProducts = productsWithCategory.length > 0 ? productsWithCategory : fallbackProducts;

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return effectiveProducts;
    const q = search.toLowerCase();
    return effectiveProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
    );
  }, [effectiveProducts, search]);

  function goToCategory(categoryName: string) {
    setActiveCategory(categoryName);
    const section = document.getElementById(`category-${categoryName}`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <main
      className="public-menu box-border flex h-svh flex-col overflow-hidden overscroll-none bg-[var(--pm-bg-page)] p-2 text-[var(--pm-text-body)] sm:p-3"
      style={{ fontFamily: "var(--pm-font-sans)" }}
    >
      {/* Phone shell */}
      <div
        className="mx-auto flex h-full min-h-0 w-full max-w-[430px] flex-col overflow-hidden"
        style={{
          borderRadius: "var(--pm-radius-shell)",
          border: "1px solid var(--pm-border-medium)",
          background: "var(--pm-bg-card)",
          boxShadow: "var(--pm-shadow-shell)",
        }}
      >
        <AnimatePresence mode="wait">
          {/* ── Welcome screen ── */}
          {!menuVisible && (
            <motion.div
              key="welcome"
              className="flex h-full min-h-0 w-full flex-col"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, rotateY: 70, x: 20 }}
              transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
              style={{ transformOrigin: "left center" }}
            >
              <MenuWelcome
                restaurantName={restaurant.name || "Le Bistrot"}
                subtitle="Café & Restaurant"
                coverImage={restaurant.coverImage}
                logo={restaurant.logo}
                onViewMenu={() => setMenuVisible(true)}
              />
            </motion.div>
          )}

          {/* ── Menu content ── */}
          {menuVisible && (
            <motion.section
              key="menu"
              id="menu-content"
              className="relative flex h-full min-h-0 w-full flex-col overflow-hidden"
              initial={{ opacity: 0, rotateY: -100, x: -28, scale: 0.97 }}
              animate={{ opacity: 1, rotateY: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -28, x: -12, scale: 0.99 }}
              transition={{ duration: 0.72, ease: [0.19, 1, 0.22, 1] }}
              style={{ transformOrigin: "left center", perspective: "1200px" }}
            >
              {/* ── Sticky top area ── */}
              <div className="shrink-0 px-4 pt-4 pb-0">
                {/* Header row */}
                <header className="mb-4 flex items-center gap-3">
                  <div
                    className="relative shrink-0"
                  >
                    {/* Gold ring — thin, visible only when no real logo */}
                    {!restaurant.logo && (
                      <div
                        className="absolute inset-[-1.5px] rounded-[14px]"
                        style={{
                          background:
                            "linear-gradient(145deg, #F5D78A 0%, #C9881A 50%, #7A4C0A 100%)",
                        }}
                      />
                    )}
                    <div
                      className="relative flex h-[38px] w-[38px] items-center justify-center overflow-hidden rounded-[12px]"
                      style={{
                        border: restaurant.logo
                          ? "1.5px solid var(--pm-border-medium)"
                          : "none",
                        background: "#FFF8EE",
                      }}
                    >
                      {restaurant.logo ? (
                        <img
                          src={restaurant.logo}
                          alt={restaurant.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <MenuLogoFallback size={26} />
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2
                      className="truncate text-[20px] font-bold leading-tight tracking-tight text-[var(--pm-text-heading)]"
                      style={{ fontFamily: "var(--pm-font-serif)" }}
                    >
                      {restaurant.name || "Le Bistrot"}
                    </h2>
                    <p className="text-[11px] text-[var(--pm-text-muted)]">
                      Notre menu
                    </p>
                  </div>
                </header>

                {/* Search input */}
                <div className="relative mb-3">
                  <label htmlFor="menu-search" className="sr-only">
                    Rechercher un article
                  </label>
                  <Search
                    className="absolute left-3.5 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[var(--pm-text-muted)]"
                    aria-hidden="true"
                  />
                  <input
                    id="menu-search"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher…"
                    className="h-11 w-full rounded-[var(--pm-radius-search)] pl-10 pr-9 text-[13.5px] text-[var(--pm-text-body)] placeholder:text-[var(--pm-text-muted)] outline-none transition-all duration-200"
                    style={{
                      background: "var(--pm-bg-card-elevated)",
                      border: "1px solid var(--pm-border-subtle)",
                      boxShadow: "var(--pm-shadow-chip-inactive)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(201, 136, 26, 0.45)";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(201, 136, 26, 0.1), var(--pm-shadow-chip-inactive)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--pm-border-subtle)";
                      e.target.style.boxShadow = "var(--pm-shadow-chip-inactive)";
                    }}
                  />
                  {search && (
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[var(--pm-text-muted)] transition-colors hover:text-[var(--pm-text-body)]"
                      onClick={() => setSearch("")}
                      aria-label="Effacer la recherche"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Category chips */}
                <div className="mb-3 overflow-hidden">
                  <MenuCategoryChips
                    categories={effectiveCategories.map((c) => c.name)}
                    activeCategory={activeCategory}
                    onSelect={goToCategory}
                  />
                </div>

                {/* Hairline separator */}
                <div
                  className="mb-0 h-px"
                  style={{ background: "var(--pm-border-subtle)" }}
                />
              </div>

              {/* ── Scrollable product list ── */}
              <div
                className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pt-4 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
                role="region"
                aria-label="Menu"
              >
                {filteredProducts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                    role="status"
                    aria-live="polite"
                  >
                    <div
                      className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{ background: "var(--pm-accent-pale)" }}
                    >
                      <Search
                        className="h-6 w-6"
                        style={{ color: "var(--pm-accent)" }}
                        aria-hidden="true"
                      />
                    </div>
                    <p
                      className="text-[15px] font-semibold"
                      style={{ color: "var(--pm-text-heading)" }}
                    >
                      Aucun article trouvé
                    </p>
                    <p
                      className="mt-1 text-[12.5px]"
                      style={{ color: "var(--pm-text-muted)" }}
                    >
                      Essayez un autre mot-clé
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-8">
                    {effectiveCategories.map((category) => {
                      const items = filteredProducts.filter(
                        (p) => p.categoryName === category.name
                      );
                      if (items.length === 0) return null;

                      return (
                        <section
                          key={category._id}
                          id={`category-${category.name}`}
                          className="scroll-mt-4"
                          aria-labelledby={`cat-heading-${category._id}`}
                        >
                          {/* Category heading */}
                          <div className="mb-3 flex items-baseline justify-between gap-2">
                            <div className="flex items-baseline gap-2">
                              <h3
                                id={`cat-heading-${category._id}`}
                                className="text-[23px] font-bold leading-none tracking-tight text-[var(--pm-text-heading)]"
                                style={{ fontFamily: "var(--pm-font-serif)" }}
                              >
                                {category.name}
                              </h3>
                              <span
                                className="text-[10.5px] font-medium"
                                style={{ color: "var(--pm-text-muted)" }}
                              >
                                {items.length}{" "}
                                {items.length === 1 ? "article" : "articles"}
                              </span>
                            </div>
                            {/* Decorative rule */}
                            <div
                              className="flex-1"
                              style={{
                                height: "1px",
                                background:
                                  "linear-gradient(to right, var(--pm-border-subtle), transparent)",
                                marginBottom: "2px",
                                maxWidth: "80px",
                              }}
                            />
                          </div>

                          {/* 2-column product grid */}
                          <div className="grid grid-cols-2 gap-3">
                            {items.map((product, i) => (
                              <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: i * 0.04,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                              >
                                <MenuProductCard
                                  name={product.name}
                                  description={
                                    product.description ||
                                    "Recette signature de la maison."
                                  }
                                  price={`${Number(product.price).toFixed(3)} DT`}
                                  image={product.image}
                                  badge={product.badge}
                                  isAvailable={product.isAvailable}
                                />
                              </motion.div>
                            ))}
                          </div>
                        </section>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
