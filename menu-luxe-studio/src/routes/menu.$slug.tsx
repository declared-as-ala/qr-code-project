import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Star, Clock, MapPin, MessageCircle, Instagram, Facebook } from "lucide-react";
import { findEnseigneBySlug, categories as allCats, products as allProds } from "@/lib/mock-data";
import { BadgePill } from "@/components/BadgePill";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/menu/$slug")({
  component: PublicMenu,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center text-center p-6">
      <div>
        <h1 className="font-display text-3xl">Menu introuvable</h1>
        <p className="text-muted-foreground mt-2">Ce restaurant n'existe pas ou n'est plus actif.</p>
      </div>
    </div>
  ),
  loader: ({ params }) => {
    const e = findEnseigneBySlug(params.slug);
    if (!e) throw notFound();
    return { enseigne: e };
  },
});

function PublicMenu() {
  const { slug } = Route.useParams();
  const enseigne = findEnseigneBySlug(slug)!;
  const cats = useMemo(() => allCats.filter((c) => c.enseigneId === enseigne.id), [enseigne.id]);
  const prods = useMemo(() => allProds.filter((p) => p.enseigneId === enseigne.id), [enseigne.id]);

  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string>(cats[0]?.id ?? "");

  useEffect(() => {
    const onScroll = () => {
      for (const c of cats) {
        const el = document.getElementById(`cat-${c.id}`);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom > 140) {
          setActiveCat(c.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [cats]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(`cat-${id}`);
    if (el) window.scrollTo({ top: el.offsetTop - 130, behavior: "smooth" });
  };

  const filtered = (catId: string) =>
    prods.filter((p) => p.categoryId === catId && (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="min-h-screen bg-cream text-noir pb-32">
      <div className="mx-auto max-w-md bg-cream relative">
        {/* Hero */}
        <div className="relative h-72 overflow-hidden">
          <img src={enseigne.cover} alt={enseigne.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-noir/30 via-noir/40 to-noir" />
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="absolute inset-x-0 bottom-0 p-6 text-cream"
          >
            <div className="flex items-end gap-4">
              <img src={enseigne.logo} alt="" className="h-16 w-16 rounded-2xl border-2 border-gold shadow-gold bg-noir" />
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-3xl font-semibold">{enseigne.name}</h1>
                <div className="flex items-center gap-3 text-xs mt-1 text-cream/80">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3 w-3 text-gold fill-gold" /> {enseigne.rating}
                  </span>
                  <span className={cn("inline-flex items-center gap-1", enseigne.isOpen ? "text-emerald-300" : "text-rose-300")}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", enseigne.isOpen ? "bg-emerald-400" : "bg-rose-400")} />
                    {enseigne.isOpen ? "Ouvert" : "Fermé"}
                  </span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> 09h–23h</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search */}
        <div className="px-4 -mt-5 relative z-10">
          <div className="bg-card rounded-2xl shadow-elegant flex items-center gap-2 px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un plat..."
              className="bg-transparent outline-none flex-1 text-sm"
            />
          </div>
        </div>

        {/* Sticky cat nav */}
        <div className="sticky top-0 z-20 bg-cream/95 backdrop-blur-md mt-6 border-b border-noir/10">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 px-4 py-3 w-max">
              {cats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => scrollTo(c.id)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                    activeCat === c.id
                      ? "bg-noir text-cream"
                      : "bg-cream border border-noir/15 text-noir/70 hover:border-gold"
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="px-4 pt-6 space-y-10">
          {cats.map((c) => {
            const items = filtered(c.id);
            if (items.length === 0) return null;
            return (
              <section key={c.id} id={`cat-${c.id}`}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="font-display text-2xl font-semibold">{c.name}</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-gold/40 to-transparent" />
                </div>
                <div className="space-y-3">
                  {items.map((p, i) => (
                    <motion.article
                      key={p.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className={cn(
                        "rounded-2xl bg-card shadow-soft overflow-hidden flex gap-3 p-3",
                        !p.available && "opacity-60"
                      )}
                    >
                      <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-muted">
                        <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                        {!p.available && (
                          <div className="absolute inset-0 bg-noir/70 flex items-center justify-center text-cream text-[9px] font-bold uppercase tracking-wider">
                            Indispo.
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium leading-snug">{p.name}</h3>
                          <p className="font-display text-base font-semibold text-gold whitespace-nowrap">{p.price} DH</p>
                        </div>
                        <p className="mt-1 text-xs text-noir/60 line-clamp-2">{p.description}</p>
                        {p.badge && <div className="mt-2"><BadgePill badge={p.badge} /></div>}
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 px-4 text-center text-xs text-noir/50">
          <div className="flex justify-center gap-3 mb-3">
            {enseigne.socials.instagram && <a href="#" className="h-9 w-9 rounded-full bg-noir text-cream flex items-center justify-center"><Instagram className="h-4 w-4" /></a>}
            {enseigne.socials.facebook && <a href="#" className="h-9 w-9 rounded-full bg-noir text-cream flex items-center justify-center"><Facebook className="h-4 w-4" /></a>}
          </div>
          <p>{enseigne.address}</p>
          <p className="mt-1">{enseigne.phone}</p>
          <p className="mt-4 text-[10px] uppercase tracking-widest text-gold">Powered by QR Menu</p>
        </div>

        {/* Floating actions */}
        <div className="fixed bottom-6 inset-x-0 z-30 flex justify-center gap-3 px-4 pointer-events-none">
          <div className="pointer-events-auto flex gap-2 bg-noir/95 backdrop-blur rounded-full p-1.5 shadow-elegant">
            {enseigne.socials.whatsapp && (
              <a
                href={`https://wa.me/${enseigne.socials.whatsapp.replace(/\D/g, "")}`}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 text-white text-sm font-semibold px-4 py-2.5 rounded-full"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            )}
            <a
              href={enseigne.mapsLink}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-gold text-noir text-sm font-semibold px-4 py-2.5 rounded-full"
            >
              <MapPin className="h-4 w-4" /> Itinéraire
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
