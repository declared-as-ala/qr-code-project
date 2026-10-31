"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Coffee, MapPin, Phone, Search, Store, Utensils } from "lucide-react";
import { Navbar, WHATSAPP } from "@/components/home/Navbar";
import { SiteFooter } from "@/components/home/SiteFooter";
import { thumb } from "@/lib/utils";

interface RestaurantItem {
  _id: string;
  name: string;
  slug: string;
  establishmentType: string;
  logo?: string;
  coverImage?: string;
  phone?: string;
  address?: string;
  primaryColor: string;
}

const FILTERS = [
  { id: "all", label: "Tous", icon: null },
  { id: "cafe", label: "Cafés & Lounges", icon: Coffee },
  { id: "restaurant", label: "Restaurants & Fast-foods", icon: Utensils },
] as const;

type Filter = (typeof FILTERS)[number]["id"];

export function RestaurantDirectoryClient({ initialRestaurants }: { initialRestaurants: RestaurantItem[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return initialRestaurants.filter((r) => {
      const matchesSearch = !q || r.name.toLowerCase().includes(q) || (r.address ?? "").toLowerCase().includes(q);
      return matchesSearch && (filter === "all" || r.establishmentType === filter);
    });
  }, [initialRestaurants, search, filter]);

  return (
    <div className="home-root home-bg relative min-h-screen overflow-x-clip text-[var(--h-ink)] antialiased [font-family:var(--font-body),system-ui,sans-serif]">
      <Navbar />

      {/* Header */}
      <section className="mx-auto max-w-4xl px-5 pt-28 text-center sm:px-8 sm:pt-36">
        <nav aria-label="Fil d’Ariane" className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold text-[var(--h-muted)]">
          <Link href="/" className="hover:text-[var(--h-ink)]">Accueil</Link>
          <span>/</span>
          <span className="text-[var(--h-ink)]">Menus Partenaires</span>
        </nav>
        <h1 className="text-[2.3rem] font-extrabold leading-[1.12] tracking-tight sm:text-6xl">
          Nos{" "}
          <span className="relative isolate inline-block px-3 sm:px-5">
            <span className="absolute inset-y-[6%] left-0 right-0 -z-10 rounded-[999px] bg-[var(--h-sun)]" />
            établissements
          </span>
          <br />
          partenaires en Tunisie
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--h-ink)]/75 sm:text-lg">
          Explorez et testez en direct les menus digitaux des cafés, restaurants, pâtisseries et lounges équipés par ClickMenu.
        </p>

        {/* Search + filters */}
        <div className="mx-auto mt-10 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--h-muted)]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un café, un restaurant, une ville…"
              aria-label="Rechercher un établissement"
              className="h-14 w-full rounded-full border border-[var(--h-line)] bg-white pl-12 pr-5 text-[15px] font-medium text-[var(--h-ink)] shadow-[0_12px_30px_-20px_rgba(17,17,17,0.4)] outline-none transition-shadow placeholder:text-[var(--h-muted)] focus:border-[var(--h-ink)]/40"
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={`inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-[13px] font-bold transition-colors ${
                  filter === f.id
                    ? "bg-[var(--h-ink)] text-white"
                    : "border border-[var(--h-line)] bg-white text-[var(--h-ink)] hover:border-[var(--h-ink)]/40"
                }`}
              >
                {f.icon && <f.icon className="h-4 w-4" />}
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-14 sm:px-8 sm:pt-16">
        <AnimatePresence mode="wait">
          {list.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-auto flex max-w-lg flex-col items-center rounded-[1.75rem] bg-white p-10 text-center shadow-[0_18px_50px_-28px_rgba(17,17,17,0.35)]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--h-sun)]">
                <Store className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-xl font-bold">Aucun établissement trouvé</h2>
              <p className="mt-2 text-sm text-[var(--h-muted)]">Essayez un autre mot-clé ou changez de filtre.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="mt-6 inline-flex h-11 items-center rounded-xl bg-[var(--h-ink)] px-6 text-sm font-bold text-white active:scale-[0.97]"
              >
                Réinitialiser
              </button>
            </motion.div>
          ) : (
            <motion.ul key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((r, i) => (
                <motion.li
                  key={r._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.05 }}
                >
                  <Link
                    href={`/menu/${r.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_50px_-28px_rgba(17,17,17,0.35)] transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#f2d36b] via-[#f6e7b4] to-[#e6e2ff]">
                      {r.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumb(r.coverImage, 640, 400)}
                          alt={`Menu digital ${r.name}`}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold backdrop-blur">
                        {r.establishmentType === "cafe" ? <Coffee className="h-3.5 w-3.5" /> : <Utensils className="h-3.5 w-3.5" />}
                        {r.establishmentType === "cafe" ? "Café" : "Restaurant"}
                      </span>
                    </div>

                    <div className="relative flex flex-1 flex-col px-6 pb-6 pt-9">
                      <span className="absolute -top-7 left-6 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#f1efe9] shadow-md">
                        {r.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={thumb(r.logo, 112, 112)}
                            alt={`Logo ${r.name}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-sm font-black uppercase">{r.name.substring(0, 2)}</span>
                        )}
                      </span>

                      <h2 className="truncate text-lg font-extrabold leading-tight">{r.name}</h2>
                      <div className="mt-3 space-y-2 text-[13px] text-[var(--h-muted)]">
                        {r.address && (
                          <p className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                            <span className="line-clamp-2">{r.address}</span>
                          </p>
                        )}
                        {r.phone && (
                          <p className="flex items-center gap-2">
                            <Phone className="h-4 w-4 shrink-0" />
                            {r.phone}
                          </p>
                        )}
                      </div>

                      <span className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--h-ink)] text-sm font-bold text-white transition-colors group-hover:bg-black">
                        Voir le menu
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <div className="mt-16 rounded-[2rem] bg-[#111] px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-extrabold leading-tight sm:text-4xl">
            Votre établissement ici en 48h ?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/65">
            Rejoignez les cafés et restaurants en Tunisie qui ont digitalisé leur carte avec ClickMenu.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              data-cta-location="menu_directory_cta"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-[15px] font-bold text-[#111] active:scale-[0.97]"
            >
              Devenir partenaire <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/prix-menu-digital-tunisie"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/25 px-6 text-[15px] font-bold text-white hover:bg-white/10"
            >
              Voir nos formules & tarifs
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
