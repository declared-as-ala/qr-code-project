"use client";

import type { CSSProperties } from "react";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, List, Search, X, ShoppingBag, Minus, Plus, Trash2, ChevronRight } from "lucide-react";
import { MenuWelcome } from "@/components/menu/MenuWelcome";
import { MenuCategoryChips } from "@/components/menu/MenuCategoryChips";
import { MenuProductCard } from "@/components/menu/MenuProductCard";
import { MenuProductRow } from "@/components/menu/MenuProductRow";
import { MenuLogoFallback } from "@/components/menu/MenuLogoFallback";
import { thumb } from "@/lib/utils";

type CartItem = {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
};

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

type ViewMode = "grid" | "list";
const VIEW_KEY = "cs.menu.view.v2";

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

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
  restaurantSlug,
}: {
  restaurant: {
    name: string;
    logo?: string;
    coverImage?: string;
    phone?: string;
    address?: string;
    googleMapsUrl?: string;
    primaryColor?: string;
    instagram?: string;
    facebook?: string;
    showPrices?: boolean;
    logoBg?: string;
  };
  categories: Category[];
  products: Product[];
  restaurantSlug?: string;
}) {
  const showPrices = restaurant.showPrices !== false;
  const effectiveCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES;
  const [search, setSearch] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(effectiveCategories[0]?.name ?? "");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const addToCart = useCallback((product: Product) => {
    if (!product.isAvailable) return;
    setCart(prev => {
      const existing = prev.find(i => i.productId === product._id);
      if (existing) return prev.map(i => i.productId === product._id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId: product._id, productName: product.name, price: product.price, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  }, []);

  const changeQty = useCallback((productId: string, delta: number) => {
    setCart(prev => prev
      .map(i => i.productId === productId ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0)
    );
  }, []);

  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.quantity, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);

  const submitOrder = async () => {
    if (!restaurantSlug || cart.length === 0) return;
    setSubmitting(true);
    try {
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantSlug,
          tableNumber,
          customerName,
          notes: orderNotes,
          items: cart,
        }),
      });
      if (r.ok) {
        setOrderSuccess(true);
        setCart([]);
        setTableNumber("");
        setCustomerName("");
        setOrderNotes("");
        setTimeout(() => { setOrderSuccess(false); setShowCart(false); }, 3000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Restore view-mode pref
  useEffect(() => {
    try {
      const saved = localStorage.getItem(VIEW_KEY) as ViewMode | null;
      if (saved === "grid" || saved === "list") setViewMode(saved);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(VIEW_KEY, viewMode);
    } catch {}
  }, [viewMode]);

  const productsWithCategory = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        categoryName:
          effectiveCategories.find((category) => category._id === product.categoryId)?.name ?? "",
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
        description: "Sauce tomate douce, burrata, basilic.",
        price: 24.5,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=85",
        badge: "Signature",
        isAvailable: true,
      },
      {
        _id: "f2",
        categoryId: effectiveCategories[1]?._id ?? "pasta",
        categoryName: effectiveCategories[1]?.name ?? "Pasta",
        name: "Pasta Cremeuse",
        description: "Parmesan, creme legere, champignons.",
        price: 21,
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=85",
        badge: "Populaire",
        isAvailable: true,
      },
    ],
    [effectiveCategories]
  );

  const effectiveProducts = productsWithCategory.length > 0 ? productsWithCategory : fallbackProducts;

  const locationHref =
    restaurant.googleMapsUrl ||
    (restaurant.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`
      : undefined);

  const shellStyle = {
    "--pm-brand-accent": restaurant.primaryColor || "#d4a537",
    fontFamily: "var(--pm-font-sans)",
  } as CSSProperties;


  const deferredSearch = useDeferredValue(search);
  const filteredProducts = useMemo(() => {
    if (!deferredSearch.trim()) return effectiveProducts;
    const q = normalize(deferredSearch);
    return effectiveProducts.filter(
      (product) =>
        normalize(product.name).includes(q) ||
        normalize(product.description ?? "").includes(q)
    );
  }, [effectiveProducts, deferredSearch]);

  // Group once per filter change instead of filtering the whole list per category on every render.
  const itemsByCategory = useMemo(() => {
    const map = new Map<string, typeof filteredProducts>();
    for (const p of filteredProducts) {
      const arr = map.get(p.categoryName);
      if (arr) arr.push(p);
      else map.set(p.categoryName, [p]);
    }
    return map;
  }, [filteredProducts]);

  // Stable add-to-cart handler: keeps memoized cards from re-rendering on every scroll/state change.
  const productById = useMemo(
    () => new Map(effectiveProducts.map((p) => [p._id, p])),
    [effectiveProducts]
  );
  const handleAdd = useCallback(
    (id: string) => {
      const p = productById.get(id);
      if (p) addToCart(p);
    },
    [productById, addToCart]
  );

  function goToCategory(categoryName: string) {
    setActiveCategory(categoryName);
    const section = document.getElementById(`category-${categoryName}`);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Sync activeCategory with scroll position (IntersectionObserver)
  useEffect(() => {
    if (!menuVisible) return;
    const root = scrollRef.current;
    if (!root) return;
    let raf = 0;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        const name = (visible.target as HTMLElement).dataset.categoryName;
        if (!name) return;
        // Coalesce rapid updates during a fast fling into one per frame.
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => setActiveCategory((cur) => (cur === name ? cur : name)));
      },
      { root, rootMargin: "-72px 0px -60% 0px", threshold: 0 }
    );
    root.querySelectorAll<HTMLElement>("[data-category-name]").forEach((el) => obs.observe(el));
    return () => {
      if (raf) cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, [menuVisible, effectiveCategories, filteredProducts]);

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
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.2, ease: "easeIn" }}
            >
              <MenuWelcome
                restaurantName={restaurant.name || "Le Bistrot"}
                subtitle="Pâtisserie de luxe"
                coverImage={restaurant.coverImage}
                logo={restaurant.logo}
                logoBg={restaurant.logoBg}
                onViewMenu={() => setMenuVisible(true)}
              />
            </motion.div>
          )}

          {menuVisible && (
            <motion.section
              key="menu"
              id="menu-content"
              className="relative flex h-full min-h-0 w-full flex-col overflow-hidden"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Single scrollable area: compact hero scrolls away, search+chips stay sticky inside */}
              <div
                ref={scrollRef}
                className="relative min-h-0 flex-1 overflow-y-auto overscroll-y-contain [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
                role="region"
                aria-label="Menu"
              >
                {/* COMPACT HERO (scrolls away) */}
                <div className="px-3 pt-3 sm:px-4 sm:pt-4">
                  <header
                    className="relative overflow-hidden rounded-2xl border px-3 py-3 text-white"
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.06)",
                      background: "rgba(17, 17, 21, 0.6)",
                    }}
                  >
                    {restaurant.coverImage && (
                      <img
                        src={thumb(restaurant.coverImage, 460, 140)}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover opacity-15"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(3, 3, 3, 0.15) 0%, rgba(9, 9, 11, 0.78) 100%)",
                      }}
                    />

                    <div className="relative flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div
                          className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl"
                          style={{
                            background: restaurant.logoBg || "#09090b",
                            boxShadow: "0 8px 22px rgba(0, 0, 0, 0.4)",
                          }}
                        >
                          {restaurant.logo ? (
                            <img
                              src={restaurant.logo}
                              alt={restaurant.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <MenuLogoFallback size={28} />
                          )}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <h2
                            className="text-[19px] font-bold leading-tight text-white [overflow-wrap:anywhere]"
                            style={{ fontFamily: "var(--pm-font-serif)" }}
                          >
                            {restaurant.name || "Le Bistrot"}
                          </h2>
                          <span
                            className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
                            style={{
                              background: "rgba(98, 211, 148, 0.14)",
                              color: "#7eecae",
                              letterSpacing: "0.06em",
                            }}
                            title="Ouvert"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Ouvert
                          </span>
                        </div>
                        {restaurant.address && (
                          <p className="mt-0.5 truncate text-[11px] text-white/65">
                            {restaurant.address}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        {locationHref && (
                          <a
                            href={locationHref}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 active:scale-90 transition-all"
                            aria-label="Itinéraire"
                          >
                            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                            </svg>
                          </a>
                        )}
                        {restaurant.instagram && (
                          <a
                            href={restaurant.instagram}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 active:scale-90 transition-all"
                            aria-label="Instagram"
                          >
                            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                            </svg>
                          </a>
                        )}
                        {restaurant.facebook && (
                          <a
                            href={restaurant.facebook}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 active:scale-90 transition-all"
                            aria-label="Facebook"
                          >
                            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </header>
                </div>

                {/* STICKY: search + view toggle */}
                <div
                  className="sticky top-0 z-30 px-3 pt-3 pb-2 sm:px-4"
                  style={{ background: "var(--pm-bg-card)" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--pm-text-muted)]"
                        aria-hidden="true"
                      />
                      <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher un plat…"
                        className="h-10 w-full rounded-xl pl-9 pr-9 text-[13.5px] font-medium text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-[var(--pm-accent)]/40"
                        style={{
                          background: "rgba(17, 17, 21, 0.85)",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                        }}
                      />
                      {search && (
                        <button
                          onClick={() => setSearch("")}
                          className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[var(--pm-text-muted)] hover:text-white"
                          aria-label="Effacer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <div
                      className="flex shrink-0 rounded-xl p-0.5"
                      style={{
                        background: "rgba(17, 17, 21, 0.85)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                      }}
                    >
                      <button
                        onClick={() => setViewMode("grid")}
                        aria-label="Vue grille"
                        aria-pressed={viewMode === "grid"}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                          viewMode === "grid"
                            ? "bg-[var(--pm-accent)]/20 text-[var(--pm-accent)]"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        aria-label="Vue liste"
                        aria-pressed={viewMode === "list"}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                          viewMode === "list"
                            ? "bg-[var(--pm-accent)]/20 text-[var(--pm-accent)]"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Category chips */}
                  <div className="mt-2 -mx-1 overflow-hidden">
                    <MenuCategoryChips
                      categories={effectiveCategories.map((c) => c.name)}
                      activeCategory={activeCategory}
                      onSelect={goToCategory}
                    />
                  </div>
                </div>

                {/* CONTENT */}
                <div className="px-3 pt-1 pb-6 sm:px-4">
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
                        <Search className="h-6 w-6" style={{ color: "var(--pm-accent)" }} />
                      </div>
                      <p className="text-[15px] font-semibold" style={{ color: "var(--pm-text-heading)" }}>
                        Aucun article trouvé
                      </p>
                      <p className="mt-1 text-[12.5px]" style={{ color: "var(--pm-text-muted)" }}>
                        Essayez un autre mot-clé
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      {effectiveCategories.map((category) => {
                        const items = itemsByCategory.get(category.name) ?? [];
                        if (items.length === 0) return null;

                        return (
                          <section
                            key={category._id}
                            id={`category-${category.name}`}
                            data-category-name={category.name}
                            className="scroll-mt-[120px]"
                            aria-labelledby={`cat-heading-${category._id}`}
                          >
                            {/* Sticky thin band */}
                            <div
                              className="sticky top-[100px] z-20 -mx-3 mb-2 px-3 py-1.5 sm:-mx-4 sm:px-4"
                              style={{
                                background: "var(--pm-bg-card)",
                                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                              }}
                            >
                              <h3
                                id={`cat-heading-${category._id}`}
                                className="text-[13px] font-bold uppercase tracking-[0.08em] text-white"
                              >
                                {category.name}
                                <span className="ml-2 text-[11px] font-medium normal-case tracking-normal text-zinc-500">
                                  · {items.length}
                                </span>
                              </h3>
                            </div>

                            {viewMode === "grid" ? (
                              <div className="grid grid-cols-2 gap-2.5">
                                {items.map((product) => (
                                  <MenuProductCard
                                    key={product._id}
                                    id={product._id}
                                    name={product.name}
                                    description={product.description}
                                    price={`${Number(product.price).toFixed(3)} DT`}
                                    image={product.image}
                                    badge={product.badge}
                                    isAvailable={product.isAvailable}
                                    showPrice={showPrices}
                                  />
                                ))}
                              </div>
                            ) : (
                              <div className="divide-y divide-white/[0.04]">
                                {items.map((product) => (
                                  <MenuProductRow
                                    key={product._id}
                                    id={product._id}
                                    name={product.name}
                                    description={product.description}
                                    price={`${Number(product.price).toFixed(3)} DT`}
                                    image={product.image}
                                    badge={product.badge}
                                    isAvailable={product.isAvailable}
                                    showPrice={showPrices}
                                  />
                                ))}
                              </div>
                            )}
                          </section>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* ── FLOATING CART BAR ─────────────────────────────────── */}
              {restaurantSlug && cart.length > 0 && !showCart && (
                <div className="shrink-0 px-3 pb-3 pt-2 sm:px-4">
                  <button
                    onClick={() => setShowCart(true)}
                    className="w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-stone-950 font-bold shadow-lg active:scale-[0.97] transition-transform"
                    style={{ background: "#c8a46a" }}
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4.5 w-4.5" />
                      <span>{cartCount} article{cartCount > 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>{cartTotal.toFixed(2)} DT</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </button>
                </div>
              )}

              {/* ── CART MODAL ────────────────────────────────────────── */}
              {showCart && (
                <div className="absolute inset-0 z-50 flex flex-col overflow-hidden" style={{ background: "var(--pm-bg-card)" }}>
                  {/* Header */}
                  <div className="shrink-0 flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <h2 className="text-base font-bold text-white">Ma commande</h2>
                    <button onClick={() => setShowCart(false)} className="h-8 w-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Order success */}
                  {orderSuccess ? (
                    <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center px-6">
                      <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <span className="text-3xl">✅</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">Commande envoyée !</h3>
                      <p className="text-sm text-zinc-400">L'équipe a bien reçu votre commande et s'en occupe.</p>
                    </div>
                  ) : (
                    <>
                      {/* Cart items */}
                      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                        {cart.map(item => (
                          <div key={item.productId} className="flex items-center gap-3 py-1">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{item.productName}</p>
                              <p className="text-xs text-zinc-400">{item.price.toFixed(2)} DT / unité</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button onClick={() => changeQty(item.productId, -1)} className="h-7 w-7 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.07)" }}>
                                <Minus className="h-3 w-3 text-zinc-300" />
                              </button>
                              <span className="w-5 text-center text-sm font-bold text-white">{item.quantity}</span>
                              <button onClick={() => changeQty(item.productId, +1)} className="h-7 w-7 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.07)" }}>
                                <Plus className="h-3 w-3 text-zinc-300" />
                              </button>
                              <button onClick={() => removeFromCart(item.productId)} className="h-7 w-7 rounded-full flex items-center justify-center ml-1">
                                <Trash2 className="h-3.5 w-3.5 text-red-400" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Divider */}
                        <div className="h-px my-2" style={{ background: "rgba(255,255,255,0.06)" }} />

                        {/* Info fields */}
                        <div className="space-y-2 pb-2">
                          <input
                            type="text"
                            value={tableNumber}
                            onChange={e => setTableNumber(e.target.value)}
                            placeholder="Numéro de table (ex: 5)"
                            className="w-full h-10 rounded-xl px-3 text-[13px] text-white placeholder:text-zinc-500 outline-none"
                            style={{ background: "rgba(17,17,21,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}
                          />
                          <input
                            type="text"
                            value={customerName}
                            onChange={e => setCustomerName(e.target.value)}
                            placeholder="Votre prénom (optionnel)"
                            className="w-full h-10 rounded-xl px-3 text-[13px] text-white placeholder:text-zinc-500 outline-none"
                            style={{ background: "rgba(17,17,21,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}
                          />
                          <textarea
                            value={orderNotes}
                            onChange={e => setOrderNotes(e.target.value)}
                            placeholder="Notes ou remarques (allergies, cuisson…)"
                            rows={2}
                            className="w-full rounded-xl px-3 py-2.5 text-[13px] text-white placeholder:text-zinc-500 outline-none resize-none"
                            style={{ background: "rgba(17,17,21,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}
                          />
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="shrink-0 px-4 pb-5 pt-3 border-t space-y-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-400">Total</span>
                          <span className="text-xl font-black text-white">{cartTotal.toFixed(2)} DT</span>
                        </div>
                        <button
                          onClick={submitOrder}
                          disabled={submitting || cart.length === 0}
                          className="w-full h-12 rounded-2xl text-sm font-bold text-stone-950 shadow-lg transition-all active:scale-[0.97] disabled:opacity-50"
                          style={{ background: "#c8a46a" }}>
                          {submitting ? "Envoi en cours…" : "Envoyer la commande"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
