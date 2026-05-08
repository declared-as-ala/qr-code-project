"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { MenuWelcome } from "@/components/menu/MenuWelcome";
import { MenuCategoryChips } from "@/components/menu/MenuCategoryChips";
import { MenuProductCard } from "@/components/menu/MenuProductCard";

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
  };
  categories: Category[];
  products: Product[];
}) {
  const fallbackCategories: Category[] = [
    { _id: "pizza", name: "Pizza" },
    { _id: "pasta", name: "Pasta" },
    { _id: "burgers", name: "Burgers" },
    { _id: "cafes", name: "Cafes" },
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
        description: "Sauce tomate douce, burrata cremeuse, basilic frais.",
        price: 24.5,
        image:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=90",
        badge: "Signature",
        isAvailable: true,
      },
      {
        _id: "f2",
        categoryId: effectiveCategories[1]?._id ?? "pasta",
        categoryName: effectiveCategories[1]?.name ?? "Pasta",
        name: "Pasta Cremeuse",
        description: "Parmesan affiné, crème légère, champignons sautés.",
        price: 21,
        image:
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=90",
        badge: "Populaire",
        isAvailable: true,
      },
      {
        _id: "f3",
        categoryId: effectiveCategories[3]?._id ?? "cafes",
        categoryName: effectiveCategories[3]?.name ?? "Cafes",
        name: "Cappuccino Caramel",
        description: "Espresso intense, mousse soyeuse, caramel premium.",
        price: 7.5,
        image:
          "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=90",
        badge: "Nouveau",
        isAvailable: true,
      },
    ],
    [effectiveCategories]
  );

  const effectiveProducts = productsWithCategory.length > 0 ? productsWithCategory : fallbackProducts;

  const filteredProducts = useMemo(() => {
    return effectiveProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        (product.description ?? "").toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [effectiveProducts, search]);

  function goToCategory(categoryName: string) {
    setActiveCategory(categoryName);
    const section = document.getElementById(`category-${categoryName}`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f4ec_0%,#f4efe5_100%)] text-[#19120b] px-3 py-5 sm:px-4 sm:py-6">
      <div className="mx-auto w-full max-w-[430px] rounded-[38px] border border-[#e8decd] bg-[#fffdf8] shadow-[0_22px_60px_rgba(36,28,18,0.18)] overflow-hidden">
        <AnimatePresence mode="wait">
          {!menuVisible ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 1, rotateY: 0 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 78, x: 24 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              style={{ transformOrigin: "left center" }}
            >
              <MenuWelcome
                restaurantName={restaurant.name || "ELGROTTE"}
                subtitle="Cafe & Restaurant"
                coverImage={restaurant.coverImage}
                logo={restaurant.logo}
                onViewMenu={() => setMenuVisible(true)}
              />
            </motion.div>
          ) : null}

          {menuVisible ? (
            <motion.section
              key="book-menu"
              id="menu-content"
              className="px-5 pb-24 pt-5 [perspective:1200px] relative"
              initial={{ opacity: 0, rotateY: -108, x: -34, y: 0, scale: 0.985 }}
              animate={{ opacity: 1, rotateY: 0, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -32, x: -14, y: 0, scale: 0.99 }}
              transition={{ duration: 0.78, ease: [0.19, 1, 0.22, 1] }}
              style={{ transformOrigin: "left center" }}
            >
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 rounded-[28px]"
                initial={{ opacity: 0, rotateY: -90, x: -20 }}
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                transition={{ duration: 0.82, ease: [0.19, 1, 0.22, 1] }}
                style={{
                  transformOrigin: "left center",
                  background:
                    "linear-gradient(90deg, rgba(246,238,225,0.7) 0%, rgba(255,251,244,0.95) 20%, rgba(255,253,248,1) 50%, rgba(251,245,235,1) 100%)",
                  boxShadow:
                    "inset 1px 0 0 rgba(199,161,97,0.28), inset 22px 0 34px rgba(209,184,137,0.18), 0 24px 60px rgba(0,0,0,0.16)",
                }}
              />
              <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={restaurant.logo || "https://api.dicebear.com/9.x/initials/svg?seed=EG"}
              alt={restaurant.name}
              className="mx-auto h-14 w-14 rounded-2xl border border-[#d4a537]/45 bg-white object-cover"
            />
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-[#1b140e] leading-[1.05]">
              Bienvenue chez {restaurant.name || "ELGROTTE"}
            </h2>
            <p className="mt-2 text-[15px] text-neutral-500">Decouvrez notre menu digital</p>
              </div>

              <div className="relative mt-5">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher un article..."
                  className="h-12 w-full rounded-2xl border border-neutral-200 bg-[#faf7f1] pl-11 pr-4 text-[14px] text-[#2a2118] outline-none transition focus:border-[#d4a537] focus:ring-2 focus:ring-[#d4a537]/20"
                />
              </div>

              <div className="sticky top-0 z-30 mt-4 -mx-2 px-2 py-2 bg-[#fffdf8]/96 backdrop-blur-md border-y border-[#ede3d5]">
                <MenuCategoryChips
                  categories={effectiveCategories.map((category) => category.name)}
                  activeCategory={activeCategory}
                  onSelect={goToCategory}
                />
              </div>

              <div className="mt-4 space-y-7">
                {effectiveCategories.map((category) => {
                  const categoryItems = filteredProducts.filter(
                    (product) => product.categoryName === category.name
                  );
                  if (categoryItems.length === 0) return null;

                  return (
                    <section key={category._id} id={`category-${category.name}`} className="scroll-mt-28">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-serif text-[30px] font-semibold tracking-tight text-[#1b140e] leading-none">
                          {category.name}
                        </h3>
                        <span className="text-[11px] font-medium text-neutral-500">{categoryItems.length} articles</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {categoryItems.map((product) => (
                          <MenuProductCard
                            key={product._id}
                            name={product.name}
                            description={product.description || "Recette signature de la maison."}
                            price={`${Number(product.price).toFixed(3)} DT`}
                            image={product.image}
                            badge={product.badge}
                            isAvailable={product.isAvailable}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}
