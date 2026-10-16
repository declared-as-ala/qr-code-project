import Link from "next/link";
import {
  ArrowRight, BarChart3, Check, Clock, Globe, MessageSquare, QrCode, ScanLine,
  ShoppingBag, Smartphone, Sparkles, Star, TrendingUp, Zap,
} from "lucide-react";
import { Navbar, WHATSAPP } from "@/components/home/Navbar";
import { Reveal } from "@/components/home/Reveal";
import { FAQ, HOME_DESCRIPTION, HOME_TITLE, SITE_NAME, SITE_URL } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: `${HOME_TITLE} | ${SITE_NAME}` },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
};

// Structured data. No aggregateRating on purpose: Google requires verifiable reviews.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logos/clickmenu-mark-512.png`,
      areaServed: { "@type": "Country", name: "Tunisie" },
      contactPoint: { "@type": "ContactPoint", telephone: "+216-97-991-266", contactType: "sales", availableLanguage: ["fr", "ar"] },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "fr-TN",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Service",
      name: "Menu digital QR code pour cafés et restaurants",
      serviceType: "Menu digital / menu QR code",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "Tunisie" },
      description: HOME_DESCRIPTION,
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

const GOLD_TEXT = "bg-[image:var(--pm-accent-gradient)] bg-clip-text text-transparent";
const CARD = "rounded-3xl border border-white/[0.07] bg-[#111115]";
const EYEBROW = "text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--pm-accent)]";
const H2 = "mt-3 text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl";
const BTN_GOLD =
  "group inline-flex h-13 items-center justify-center gap-2 rounded-2xl px-7 text-sm font-bold text-[#09090b] shadow-[0_10px_30px_-8px_rgba(212,165,55,0.55)] transition-transform active:scale-[0.97]";
const BTN_GHOST =
  "inline-flex h-13 items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.04] px-7 text-sm font-bold text-white transition-colors hover:bg-white/[0.08] active:scale-[0.97]";

const CATEGORIES = [
  "Cafés", "Petit-déjeuner", "Smoothies", "Milk Shake", "Pizzas", "Burgers", "Salades",
  "Desserts", "Crêpes", "Sandwichs", "Boissons", "Brunch", "Thés", "Pâtisserie",
];

function PhoneMockup() {
  const items = [
    { n: "Latte Pistache", p: "8.500", tag: "Populaire" },
    { n: "Frappuccino Caramel M", p: "9.500" },
    { n: "Toast saumon", p: "17.000" },
    { n: "Cheesecake", p: "10.000" },
  ];
  return (
    <div className="relative mx-auto w-[230px] sm:w-[260px]">
      <div className="absolute -inset-10 rounded-full bg-[var(--pm-accent)] opacity-[0.12] blur-[70px]" />
      <div
        className="relative overflow-hidden rounded-[40px] border-[6px] border-[#26262d] bg-[#09090b] shadow-[0_40px_90px_-20px_rgba(0,0,0,0.9)]"
        style={{ aspectRatio: "9/18.5" }}
      >
        <div className="absolute left-1/2 top-0 z-10 h-5 w-20 -translate-x-1/2 rounded-b-2xl bg-[#26262d]" />
        <div className="relative h-[34%] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3a2c14] via-[#1d1710] to-[#09090b]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3.5 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--pm-accent)]/40 bg-black/40 text-[8px] font-black text-[var(--pm-accent)]">
              M
            </span>
            <div>
              <p className="text-[11px] font-bold leading-none text-[#f5e6cc]" style={{ fontFamily: "var(--font-display)" }}>
                Métropolitan
              </p>
              <p className="mt-1 text-[7px] font-semibold uppercase tracking-widest text-[var(--pm-accent)]">Café · Restaurant</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1.5 overflow-hidden px-3 py-2">
          {["Tout", "Flavored", "Smoothies", "Toast"].map((c, i) => (
            <span
              key={c}
              className={`shrink-0 rounded-full px-2.5 py-1 text-[8px] font-bold ${
                i === 0 ? "bg-[var(--pm-accent)] text-[#09090b]" : "bg-white/[0.06] text-zinc-400"
              }`}
            >
              {c}
            </span>
          ))}
        </div>
        <div className="space-y-1.5 px-3">
          {items.map((it) => (
            <div key={it.n} className="flex items-center gap-2 rounded-xl bg-white/[0.04] p-1.5">
              <span className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-amber-900/50 to-zinc-800" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[9px] font-bold text-white">{it.n}</p>
                {it.tag && (
                  <span className="text-[6.5px] font-bold uppercase tracking-wider text-[var(--pm-accent)]">✦ {it.tag}</span>
                )}
              </div>
              <span className="rounded-md border border-[var(--pm-accent)]/20 bg-[var(--pm-accent)]/10 px-1.5 py-0.5 text-[8px] font-black tabular-nums text-[var(--pm-accent-light)]">
                {it.p}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -right-6 top-10 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#141418]/90 px-3 py-2 shadow-2xl backdrop-blur sm:-right-14">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--pm-accent)]/15 text-[var(--pm-accent)]">
          <ScanLine className="h-3.5 w-3.5" />
        </span>
        <div>
          <p className="text-[10px] font-bold text-white">Scan instantané</p>
          <p className="text-[9px] text-zinc-500">Aucune app à installer</p>
        </div>
      </div>
      <div className="absolute -left-6 bottom-16 rounded-2xl border border-white/10 bg-[#141418]/90 p-3 shadow-2xl backdrop-blur sm:-left-16">
        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Ce mois</p>
        <div className="mt-1 flex items-end gap-3">
          <div>
            <p className="text-xl font-black leading-none text-white">15 248</p>
            <p className="mt-1 text-[9px] text-zinc-500">scans QR</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-400">↑ 24%</span>
        </div>
        <div className="mt-2 flex h-6 items-end gap-0.5">
          {[45, 62, 50, 78, 64, 92, 74].map((h, i) => (
            <span key={i} className="w-2 rounded-sm" style={{ height: `${h}%`, background: i === 5 ? "var(--pm-accent)" : "rgba(212,165,55,0.22)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#09090b] text-zinc-300 antialiased [font-family:var(--font-body),system-ui,sans-serif]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
      />
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative isolate pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[var(--pm-accent)] opacity-[0.08] blur-[130px]" />
          <div
            className="absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
            }}
          />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--pm-accent)]/25 bg-[var(--pm-accent)]/[0.07] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--pm-accent)]">
                <Sparkles className="h-3.5 w-3.5" />
                Menus QR premium · Tunisie
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1
                className="mt-6 text-[2.6rem] font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[4.4rem]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Le menu digital en Tunisie qui <span className={GOLD_TEXT}>donne envie</span> de commander.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                ClickMenu crée votre menu QR code : cartes élégantes, menus interactifs et tableau de bord simple — pour les cafés,
                restaurants et lounges de Tunisie, sans impression ni application.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/menu" className={BTN_GOLD} style={{ background: "var(--pm-accent-gradient)" }}>
                  Explorer les menus
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a href={WHATSAPP} target="_blank" rel="noreferrer" className={BTN_GHOST}>
                  <MessageSquare className="h-4 w-4 text-emerald-400" />
                  Démo sur WhatsApp
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.32}>
              <div className="mt-10 flex items-center gap-3 border-t border-white/[0.07] pt-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[var(--pm-accent)] stroke-[var(--pm-accent)]" />
                  ))}
                </div>
                <span className="text-sm text-zinc-400">+25 établissements nous font confiance</span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </Reveal>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────────── */}
      <div
        className="relative border-y border-white/[0.06] bg-white/[0.015] py-5"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
        aria-hidden
      >
        <div className="home-marquee flex w-max gap-3">
          {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
            <span key={i} className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-zinc-400">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            ["25+", "Établissements", "partout en Tunisie"],
            ["15k+", "Scans par mois", "en moyenne"],
            ["4.9/5", "Satisfaction", "selon nos clients"],
          ].map(([v, l, s], i) => (
            <Reveal key={l} delay={i * 0.08}>
              <p className={`text-4xl font-black tracking-tight sm:text-6xl ${GOLD_TEXT}`} style={{ fontFamily: "var(--font-display)" }}>
                {v}
              </p>
              <p className="mt-2 text-xs font-semibold text-white sm:text-sm">{l}</p>
              <p className="mt-0.5 hidden text-xs text-zinc-500 sm:block">{s}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONCEPT (BENTO) ──────────────────────────────────────────────── */}
      <section id="concept" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-24 sm:px-8 sm:pb-32">
        <Reveal className="max-w-2xl">
          <p className={EYEBROW}>Le concept</p>
          <h2 className={H2} style={{ fontFamily: "var(--font-display)" }}>
            Zéro friction, <span className={GOLD_TEXT}>100% élégance.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-6">
          <Reveal className={`${CARD} relative overflow-hidden p-8 md:col-span-4`}>
            <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[var(--pm-accent)] opacity-[0.1] blur-3xl" />
            <Smartphone className="h-6 w-6 text-[var(--pm-accent)]" />
            <h3 className="mt-5 text-xl font-bold text-white">Aucune application à installer</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
              Le client scanne avec l’appareil photo, le menu s’ouvre en moins d’une seconde. Pas de compte, pas de
              téléchargement, pas d’attente.
            </p>
          </Reveal>
          <Reveal delay={0.08} className={`${CARD} p-8 md:col-span-2`}>
            <Zap className="h-6 w-6 text-[var(--pm-accent)]" />
            <h3 className="mt-5 text-lg font-bold text-white">Mise à jour instantanée</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">Prix, disponibilité, photos : en quelques secondes.</p>
          </Reveal>
          <Reveal delay={0.04} className={`${CARD} p-8 md:col-span-2`}>
            <Globe className="h-6 w-6 text-[var(--pm-accent)]" />
            <h3 className="mt-5 text-lg font-bold text-white">Votre image de marque</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">Logo, couleurs et photos des plats, pensés pour mettre en appétit.</p>
          </Reveal>
          <Reveal delay={0.12} className={`${CARD} relative overflow-hidden p-8 md:col-span-4`}>
            <BarChart3 className="h-6 w-6 text-[var(--pm-accent)]" />
            <h3 className="mt-5 text-xl font-bold text-white">Statistiques de scans en direct</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
              Suivez la fréquentation de votre menu et vos plats les plus consultés depuis le tableau de bord.
            </p>
            <div className="mt-6 flex h-16 items-end gap-1.5">
              {[30, 44, 38, 60, 52, 78, 64, 90, 72, 100].map((h, i) => (
                <span key={i} className="flex-1 rounded-md" style={{ height: `${h}%`, background: i === 9 ? "var(--pm-accent)" : "rgba(212,165,55,0.18)" }} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── STEPS ────────────────────────────────────────────────────────── */}
      <section id="fonctionnement" className="scroll-mt-24 border-y border-white/[0.06] bg-white/[0.015] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <p className={EYEBROW}>Fonctionnement</p>
            <h2 className={H2} style={{ fontFamily: "var(--font-display)" }}>
              En ligne en <span className={GOLD_TEXT}>48 heures.</span>
            </h2>
            <p className="mt-4 text-zinc-400">Nous gérons toute la mise en place pour que vous restiez concentré sur vos clients.</p>
          </Reveal>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: QrCode, t: "Création du menu", d: "Plats, photos, prix et catégories intégrés, optimisés pour mobile." },
              { icon: ScanLine, t: "QR sur mesure", d: "Cartes de table en bois gravé, acrylique ou autocollants laminés." },
              { icon: Smartphone, t: "Scan instantané", d: "Vos clients scannent et découvrent la carte sans rien télécharger." },
              { icon: TrendingUp, t: "Vous gardez la main", d: "Modifiez tarifs et disponibilités à tout moment, en autonomie." },
            ].map((s, i) => (
              <Reveal key={s.t} delay={i * 0.07} className={`${CARD} relative p-7`}>
                <span className="absolute right-5 top-4 text-5xl font-black text-white/[0.04]" style={{ fontFamily: "var(--font-display)" }}>
                  0{i + 1}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--pm-accent)]/10 text-[var(--pm-accent)]">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-bold text-white">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="max-w-2xl">
          <p className={EYEBROW}>Témoignages</p>
          <h2 className={H2} style={{ fontFamily: "var(--font-display)" }}>
            Ils nous font <span className={GOLD_TEXT}>confiance.</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { q: "Le meilleur investissement pour notre café. Les clients adorent scanner et nous avons arrêté les cartes imprimées.", n: "Sami B.", r: "Café Bab El Bhar · Tunis" },
            { q: "L’équipe a tout configuré en 24h. Notre menu est beau, professionnel et facile à mettre à jour.", n: "Yasmine M.", r: "Le Jardin d’Ariana · Ariana" },
            { q: "Les tables tournent plus vite et les clients commandent plus facilement. Chokran ClickMenu !", n: "Nizar K.", r: "Brik & Co · Sousse" },
          ].map((t, i) => (
            <Reveal key={t.n} delay={i * 0.08} className={`${CARD} flex flex-col gap-5 p-8`}>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-[var(--pm-accent)] stroke-[var(--pm-accent)]" />
                ))}
              </div>
              <p className="flex-1 text-[15px] leading-relaxed text-zinc-200">“{t.q}”</p>
              <div>
                <p className="text-sm font-bold text-white">{t.n}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{t.r}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section id="services" className="scroll-mt-24 border-y border-white/[0.06] bg-white/[0.015] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <p className={EYEBROW}>Services</p>
            <h2 className={H2} style={{ fontFamily: "var(--font-display)" }}>
              Aujourd’hui, et <span className={GOLD_TEXT}>demain.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Smartphone, t: "Menu QR interactif", d: "Navigation fluide par catégories, recherche et design sur mesure.", ok: true },
              { icon: QrCode, t: "Cartes QR imprimées", d: "Supports nobles : bois gravé, acrylique, autocollants haute résistance.", ok: true },
              { icon: Globe, t: "Page web dédiée", d: "Votre propre adresse ClickMenu, prête à partager.", ok: true },
              { icon: ShoppingBag, t: "Commandes digitales", d: "Vos clients commandent depuis la table, vous êtes notifié en temps réel.", ok: true },
              { icon: Clock, t: "Caisse / POS", d: "Commandes, affichage cuisine et paiements centralisés.", ok: false },
              { icon: BarChart3, t: "Analytics avancés", d: "Ventes, plats populaires et comportement des clients.", ok: false },
            ].map((s, i) => (
              <Reveal key={s.t} delay={(i % 3) * 0.07} className={`${CARD} relative p-7 ${s.ok ? "" : "opacity-60"}`}>
                <span
                  className={`absolute right-5 top-5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                    s.ok ? "bg-[var(--pm-accent)]/10 text-[var(--pm-accent)]" : "bg-white/[0.06] text-zinc-500"
                  }`}
                >
                  {s.ok && <Check className="h-2.5 w-2.5" />}
                  {s.ok ? "Disponible" : "Bientôt"}
                </span>
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.ok ? "bg-[var(--pm-accent)]/10 text-[var(--pm-accent)]" : "bg-white/[0.05] text-zinc-500"}`}>
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-bold text-white">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <p className={EYEBROW}>Questions fréquentes</p>
          <h2 className={H2} style={{ fontFamily: "var(--font-display)" }}>
            Tout savoir sur le <span className={GOLD_TEXT}>menu digital.</span>
          </h2>
        </Reveal>
        <div className="mt-10 divide-y divide-white/[0.07] rounded-3xl border border-white/[0.07] bg-[#111115]">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-6 py-5 open:bg-white/[0.02]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-white [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 text-[var(--pm-accent)] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-[var(--pm-accent)]/20 bg-gradient-to-b from-[#17130b] to-[#0d0c0a] px-6 py-16 text-center sm:px-14 sm:py-20">
            <div className="pointer-events-none absolute left-1/2 top-0 h-60 w-[600px] -translate-x-1/2 rounded-full bg-[var(--pm-accent)] opacity-[0.14] blur-[90px]" />
            <h2
              className="relative text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Un café, un restaurant ? <span className={GOLD_TEXT}>Passez au digital.</span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-zinc-400">
              Moins d’impression, des tables qui tournent plus vite, une carte toujours à jour.
            </p>
            <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className={BTN_GOLD} style={{ background: "var(--pm-accent-gradient)" }}>
                <MessageSquare className="h-4 w-4" />
                Nous écrire sur WhatsApp
              </a>
              <Link href="/menu" className={BTN_GHOST}>
                Voir les démos en direct
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-10 text-xs text-zinc-500">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 sm:flex-row sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg text-[#09090b]" style={{ background: "var(--pm-accent-gradient)" }}>
              <QrCode className="h-4 w-4 stroke-[2.5]" />
            </span>
            <span className="text-sm font-bold tracking-tight text-white">ClickMenu</span>
          </Link>
          <p>© {new Date().getFullYear()} ClickMenu · Made in Tunisia</p>
          <div className="flex gap-6">
            <a href={WHATSAPP} className="transition-colors hover:text-white">WhatsApp</a>
            <Link href="/menu" className="transition-colors hover:text-white">Explorer</Link>
            <Link href="/login" className="transition-colors hover:text-white">Connexion</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
