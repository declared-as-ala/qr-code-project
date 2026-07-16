"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Phone,
  Utensils,
  Coffee,
  ArrowRight,
  Sparkles,
  Store,
  ChevronRight,
  SlidersHorizontal,
  Home
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

interface RestaurantDirectoryClientProps {
  initialRestaurants: RestaurantItem[];
}

export function RestaurantDirectoryClient({ initialRestaurants }: RestaurantDirectoryClientProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "cafe" | "restaurant">("all");

  // Premium fallbacks for restaurant cover images based on culinary styles
  const defaultCovers: Record<string, string> = {
    cafe: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=85",
    restaurant: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85",
  };

  // Real-time filtering and searching of establishments
  const filteredRestaurants = useMemo(() => {
    return initialRestaurants.filter((res) => {
      const matchesSearch =
        res.name.toLowerCase().includes(search.toLowerCase()) ||
        (res.address ?? "").toLowerCase().includes(search.toLowerCase());
      
      const matchesFilter =
        activeFilter === "all" || res.establishmentType === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [initialRestaurants, search, activeFilter]);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500/20 selection:text-amber-300 pb-20">
      
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[450px] bg-gradient-to-b from-amber-500/[0.04] via-transparent to-transparent" />
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-amber-500/[0.02] blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-yellow-500/[0.02] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />

      {/* Floating Mini Navigation Bar */}
      <header className="border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-600 shadow-md">
              <Store className="h-4 w-4 text-zinc-950 stroke-[2.5]" />
            </div>
            <span className="text-base font-bold text-white transition-colors group-hover:text-amber-400">
              Click<span className="text-amber-500 font-medium">Menu</span>
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Retour Accueil</span>
          </Link>
        </div>
      </header>

      {/* Banner / Title Header */}
      <section className="relative mx-auto max-w-7xl px-6 pt-12 pb-8 lg:px-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 mb-4 text-[10px] font-extrabold tracking-widest text-amber-400 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>ClickMenu Partners</span>
            </div>
            <h1 
              className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Nos Établissements Partenaires
            </h1>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Explorez les cartes interactives et les menus digitaux des meilleures adresses gastronomiques. Scannez, découvrez les spécialités et dégustez !
            </p>
          </div>
        </div>

        {/* Search and Filters Segment */}
        <div className="mt-12 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, emplacement, ville..."
              className="h-12 w-full rounded-xl border border-zinc-900 bg-zinc-900/50 pl-11 pr-4 text-sm font-medium text-white placeholder:text-zinc-500 outline-none transition-all focus:border-amber-500/30 focus:bg-zinc-900 focus:ring-4 focus:ring-amber-500/5"
            />
          </div>

          {/* Category Chips Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveFilter("all")}
              className={`flex h-11 items-center gap-1.5 rounded-xl px-5 text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === "all"
                  ? "bg-gradient-to-tr from-amber-500 to-yellow-600 text-zinc-950 font-black shadow-lg shadow-amber-500/10"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setActiveFilter("cafe")}
              className={`flex h-11 items-center gap-1.5 rounded-xl px-5 text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === "cafe"
                  ? "bg-gradient-to-tr from-amber-500 to-yellow-600 text-zinc-950 font-black shadow-lg shadow-amber-500/10"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              <Coffee className="h-4 w-4" />
              Cafés & Lounges
            </button>
            <button
              onClick={() => setActiveFilter("restaurant")}
              className={`flex h-11 items-center gap-1.5 rounded-xl px-5 text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === "restaurant"
                  ? "bg-gradient-to-tr from-amber-500 to-yellow-600 text-zinc-950 font-black shadow-lg shadow-amber-500/10"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              <Utensils className="h-4 w-4" />
              Restaurants & Fast-foods
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <main className="mx-auto max-w-7xl px-6 lg:px-8 mt-6">
        <AnimatePresence mode="wait">
          {filteredRestaurants.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-zinc-900 bg-zinc-950/40 p-8 shadow-xl"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-500 mb-6">
                <Store className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Aucun établissement trouvé</h2>
              <p className="mt-2 text-sm text-zinc-500 max-w-md">
                Nous n’avons trouvé aucun partenaire correspondant à vos critères de recherche. Essayez un autre mot-clé ou filtrez par type.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveFilter("all");
                }}
                className="mt-6 flex h-11 items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-6 text-xs font-bold text-amber-400 hover:bg-zinc-800 transition-all active:scale-[0.98]"
              >
                Réinitialiser la recherche
              </button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredRestaurants.map((res, idx) => (
                <motion.div
                  key={res._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group"
                >
                  <Card className="h-full rounded-2xl border border-zinc-900 bg-zinc-950 overflow-hidden shadow-xl transition-all duration-300 hover:border-amber-500/20 hover:shadow-2xl hover:shadow-black/60 relative">
                    
                    {/* Header Image Background banner */}
                    <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
                      <img
                        src={res.coverImage || defaultCovers[res.establishmentType] || defaultCovers.restaurant}
                        alt={res.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                      
                      {/* Logo badge overlay */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-3">
                        <div 
                          className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg border-2 border-zinc-950 shrink-0"
                          style={{ borderColor: res.primaryColor }}
                        >
                          {res.logo ? (
                            <img src={res.logo} alt={res.name} className="h-full w-full object-cover" />
                          ) : (
                            <span 
                              className="text-xs font-black uppercase text-zinc-900 select-none"
                              style={{ color: res.primaryColor }}
                            >
                              {res.name.substring(0, 2)}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h2 className="text-lg font-black text-white truncate drop-shadow-md leading-tight">
                            {res.name}
                          </h2>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {res.establishmentType === "cafe" ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/10 px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-amber-400">
                                <Coffee className="h-2.5 w-2.5" />
                                Café
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 border border-yellow-500/5 px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-yellow-300">
                                <Utensils className="h-2.5 w-2.5" />
                                Restaurant
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-5 flex flex-col gap-4">
                      
                      {/* Details specs */}
                      <div className="flex flex-col gap-2.5 text-xs text-zinc-400">
                        {res.address && (
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 shrink-0 text-zinc-600 mt-0.5" />
                            <span className="truncate">{res.address}</span>
                          </div>
                        )}
                        {res.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 shrink-0 text-zinc-600" />
                            <span>{res.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Card Button */}
                      <Link
                        href={`/menu/${res.slug}`}
                        className="group/btn flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-white transition-all hover:bg-zinc-850 hover:border-zinc-700 active:scale-[0.985] mt-2 shadow-inner"
                      >
                        Voir le menu
                        <ArrowRight className="h-3.5 w-3.5 text-amber-500 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </Link>

                    </CardContent>

                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}
