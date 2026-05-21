"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock3, MapPin, Phone, Search, Sparkles, X } from "lucide-react";
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

const FALLBACK_CATEGORIES: Category[] = [
  { _id: "pizza", name: "Pizza" },
  { _id: "pasta", name: "Pasta" },
  { _id: "burgers", name: "Burgers" },
  { _id: "cafes", name: "Cafes" },
  { _id: "desserts", name: "Desserts" },
  { _id: "boissons", name: "Boissons" },
];

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
  const effectiveCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES;
  const [search, setSearch] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(effectiveCategories[0]?.name ?? "");

  const productsWithCategory = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        categoryName:
          effectiveCategories.find((category) => category._id === product.categoryId)
            ?.name ?? "",
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
        description: "Sauce tomate douce, burrata cremeuse, basilic frais, huile d'olive.",
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
        name: "Pasta Cremeuse",
        description: "Parmesan affine 24 mois, creme legere, champignons sautes.",
        price: 21,
        image:
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=85",
        badge: "Populaire",
        isAvailable: true,
      },
      {
        _id: "f3",
        categoryId: effectiveCategories[3]?._id ?? "cafes",
        categoryName: effectiveCategories[3]?.name ?? "Cafes",
        name: "Cappuccino Caramel",
        description: "Espresso intense, mousse soyeuse, caramel premium infuse.",
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
        description: "Base creme, mozzarella di bufala, copeaux de truffe noire.",
        price: 32,
        image:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=85",
        badge: "Promo",
        isAvailable: true,
      },
    ],
    [effectiveCategories]
  );

  const effectiveProducts =
    productsWithCategory.length > 0 ? productsWithCategory : fallbackProducts;
  const availableProducts = effectiveProducts.filter((product) => product.isAvailable);
  const locationHref =
    restaurant.googleMapsUrl ||
    (restaurant.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          restaurant.address
        )}`
      : undefined);
  const phoneHref = restaurant.phone
    ? `tel:${restaurant.phone.replace(/[^\d+]/g, "")}`
    : undefined;
  const shellStyle = {
    "--pm-brand-accent": restaurant.primaryColor || "#B91C1C",
    fontFamily: "var(--pm-font-sans)",
  } as CSSProperties;

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return effectiveProducts;
    const q = search.toLowerCase();
    return effectiveProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        (product.description ?? "").toLowerCase().includes(q)
    );
  }, [effectiveProducts, search]);

  function goToCategory(categoryName: string) {
    setActiveCategory(categoryName);
    const section = document.getElementById(`category-${categoryName}`);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main
      className="public-menu box-border flex h-svh flex-col overflow-hidden overscroll-none bg-[var(--pm-bg-page)] p-2 text-[var(--pm-text-body)] sm:p-3"
      style={shellStyle}
    >
      <div
        className="mx-auto flex h-full min-h-0 w-full max-w-[460px] flex-col overflow-hidden"
        style={{
          borderRadius: "var(--pm-radius-shell)",
          border: "1px solid var(--pm-border-medium)",
          background: "var(--pm-bg-card)",
          boxShadow: "var(--pm-shadow-shell)",
        }}
      >
        <AnimatePresence mode="wait">
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
                subtitle="Cafe & Restaurant"
                coverImage={restaurant.coverImage}
                logo={restaurant.logo}
                onViewMenu={() => setMenuVisible(true)}
              />
            </motion.div>
          )}

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
              <div className="shrink-0 px-3 pt-3 pb-0 sm:px-4 sm:pt-4">
                <header
                  className="relative overflow-hidden rounded-[28px] border px-4 pb-5 pt-4 text-[var(--pm-text-on-dark)]"
                  style={{
                    borderColor: "rgba(255, 244, 220, 0.18)",
                    background:
                      "linear-gradient(145deg, rgba(44, 14, 10, 0.96), rgba(17, 11, 7, 0.97) 58%, rgba(112, 27, 17, 0.9))",
                    boxShadow: "var(--pm-shadow-hero)",
                  }}
                >
                  {restaurant.coverImage && (
                    <img
                      src={restaurant.coverImage}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover opacity-30"
                    />
                  )}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(8, 5, 3, 0.18), rgba(8, 5, 3, 0.82))",
                    }}
                  />

                  <div className="relative flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div
                        className="absolute inset-[-2px] rounded-[18px]"
                        style={{ background: "var(--pm-accent-gradient)" }}
                      />
                      <div
                        className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl"
                        style={{
                          background: "#FFF8EE",
                          boxShadow: "0 12px 28px rgba(0, 0, 0, 0.24)",
                        }}
                      >
                        {restaurant.logo ? (
                          <img
                            src={restaurant.logo}
                            alt={restaurant.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <MenuLogoFallback size={34} />
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 pt-0.5">
                      <span
                        className="inline-flex min-h-7 items-center gap-1.5 rounded-full px-2.5 text-[10px] font-bold uppercase"
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          border: "1px solid rgba(255, 244, 220, 0.14)",
                          color: "var(--pm-gold-soft)",
                          letterSpacing: "0.08em",
                        }}
                      >
                        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                        Ouvert
                      </span>
                      <h2
                        className="mt-2 truncate text-[30px] font-bold leading-none text-white"
                        style={{ fontFamily: "var(--pm-font-serif)" }}
                      >
                        {restaurant.name || "Le Bistrot"}
                      </h2>
                      <p className="mt-1 truncate text-[12.5px] font-medium text-white/70">
                        {restaurant.address || "Cuisine maison & service chaleureux"}
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2">
                      <p className="text-[17px] font-black leading-none tabular-nums text-white">
                        {availableProducts.length}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold uppercase text-white/60">
                        plats
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2">
                      <p className="text-[17px] font-black leading-none tabular-nums text-white">
                        {effectiveCategories.length}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold uppercase text-white/60">
                        categories
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2">
                      <p className="flex items-center gap-1 text-[17px] font-black leading-none text-white">
                        <Sparkles
                          className="h-4 w-4 text-[var(--pm-gold-soft)]"
                          aria-hidden="true"
                        />
                        Chef
                      </p>
                      <p className="mt-1 text-[10px] font-semibold uppercase text-white/60">
                        selection
                      </p>
                    </div>
                  </div>
                </header>

                <div className="relative z-10 mx-1 -mt-5 mb-3">
                  <label htmlFor="menu-search" className="sr-only">
                    Rechercher un article
                  </label>
                  <Search
                    className="absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[var(--pm-text-muted)]"
                    aria-hidden="true"
                  />
                  <input
                    id="menu-search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Rechercher un plat, un ingredient..."
                    className="h-12 w-full rounded-[var(--pm-radius-search)] pl-11 pr-11 text-[14px] font-medium text-[var(--pm-text-body)] placeholder:text-[var(--pm-text-muted)] outline-none transition-all duration-200"
                    style={{
                      background: "var(--pm-bg-card-elevated)",
                      border: "1px solid var(--pm-border-subtle)",
                      boxShadow: "var(--pm-shadow-search)",
                    }}
                    onFocus={(event) => {
                      event.target.style.borderColor = "rgba(185, 28, 28, 0.32)";
                      event.target.style.boxShadow =
                        "0 0 0 4px rgba(185, 28, 28, 0.1), var(--pm-shadow-search)";
                    }}
                    onBlur={(event) => {
                      event.target.style.borderColor = "var(--pm-border-subtle)";
                      event.target.style.boxShadow = "var(--pm-shadow-search)";
                    }}
                  />
                  {search && (
                    <button
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[var(--pm-text-muted)] transition-colors hover:text-[var(--pm-text-body)] focus-visible:outline-none focus-visible:ring-2"
                      onClick={() => setSearch("")}
                      aria-label="Effacer la recherche"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>

                <div className="mb-3 overflow-hidden px-0.5">
                  <MenuCategoryChips
                    categories={effectiveCategories.map((category) => category.name)}
                    activeCategory={activeCategory}
                    onSelect={goToCategory}
                  />
                </div>

                <div className="h-px" style={{ background: "var(--pm-border-subtle)" }} />
              </div>

              <div
                className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 pt-4 pb-6 sm:px-4 [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
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
                      Aucun article trouve
                    </p>
                    <p
                      className="mt-1 text-[12.5px]"
                      style={{ color: "var(--pm-text-muted)" }}
                    >
                      Essayez un autre mot-cle
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-8">
                    {effectiveCategories.map((category) => {
                      const items = filteredProducts.filter(
                        (product) => product.categoryName === category.name
                      );
                      if (items.length === 0) return null;

                      return (
                        <section
                          key={category._id}
                          id={`category-${category.name}`}
                          className="scroll-mt-4"
                          aria-labelledby={`cat-heading-${category._id}`}
                        >
                          <div className="mb-3 flex items-end justify-between gap-2 px-1">
                            <div className="min-w-0">
                              <p
                                className="mb-1 text-[10px] font-bold uppercase"
                                style={{
                                  color: "var(--pm-accent)",
                                  letterSpacing: "0.12em",
                                }}
                              >
                                La carte
                              </p>
                              <h3
                                id={`cat-heading-${category._id}`}
                                className="truncate text-[26px] font-bold leading-none text-[var(--pm-text-heading)]"
                                style={{ fontFamily: "var(--pm-font-serif)" }}
                              >
                                {category.name}
                              </h3>
                            </div>
                            <span
                              className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold"
                              style={{
                                background: "var(--pm-accent-pale)",
                                color: "var(--pm-accent-strong)",
                              }}
                            >
                              {items.length} {items.length === 1 ? "article" : "articles"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            {items.map((product, index) => (
                              <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: index * 0.04,
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

              {(phoneHref || locationHref) && (
                <div
                  className="shrink-0 border-t px-4 py-3"
                  style={{
                    borderColor: "var(--pm-border-subtle)",
                    background: "rgba(255, 253, 248, 0.92)",
                  }}
                >
                  <div className="flex gap-2">
                    {phoneHref && (
                      <a
                        href={phoneHref}
                        className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-4 text-[13px] font-bold transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2"
                        style={{
                          background: "var(--pm-bg-card-elevated)",
                          border: "1px solid var(--pm-border-medium)",
                          color: "var(--pm-text-heading)",
                        }}
                      >
                        <Phone className="h-4 w-4" aria-hidden="true" />
                        Appeler
                      </a>
                    )}
                    {locationHref && (
                      <a
                        href={locationHref}
                        target="_blank"
                        rel="noreferrer"
                        className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-4 text-[13px] font-bold text-white transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2"
                        style={{
                          background: "var(--pm-accent-gradient)",
                          boxShadow: "var(--pm-shadow-action)",
                        }}
                      >
                        <MapPin className="h-4 w-4" aria-hidden="true" />
                        Itineraire
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
