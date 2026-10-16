import Link from "next/link";
import {
  ArrowRight, BarChart3, Check, Clock, Globe, MessageSquare, QrCode, ScanLine,
  ShoppingBag, Smartphone, Sparkles, Star, TrendingUp, Zap,
} from "lucide-react";
import { Navbar, WHATSAPP } from "@/components/home/Navbar";
import { Reveal } from "@/components/home/Reveal";
import { PartnersCarousel, type Partner } from "@/components/home/PartnersCarousel";
import { connectDb } from "@/lib/db";
import { Restaurant } from "@/models/Restaurant";
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

const CARD = "rounded-[1.75rem] border border-[var(--h-line)] bg-white shadow-[0_1px_0_rgba(16,35,31,0.04)]";
const EYEBROW = "inline-flex items-center gap-2 rounded-full bg-[var(--h-terra-soft)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--h-terra-2)]";
const H2 = "mt-4 text-[2rem] font-extrabold leading-[1.08] tracking-tight text-[var(--h-ink)] sm:text-5xl";
const BTN_PRIMARY =
  "group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--h-terra)] px-8 text-[15px] font-bold text-white shadow-[0_12px_28px_-10px_rgba(224,103,58,0.7)] transition-colors hover:bg-[var(--h-terra-2)] active:scale-[0.97]";
const BTN_SECONDARY =
  "inline-flex h-14 items-center justify-center gap-2 rounded-full border border-[var(--h-ink)]/15 bg-white px-8 text-[15px] font-bold text-[var(--h-ink)] transition-colors hover:border-[var(--h-ink)]/40 active:scale-[0.97]";

function PhoneMockup() {
  const items = [
    { n: "Latte Pistache", p: "8.500", tag: "Populaire" },
    { n: "Frappuccino Caramel M", p: "9.500" },
    { n: "Toast saumon", p: "17.000" },
    { n: "Cheesecake", p: "10.000" },
  ];
  return (
    <div className="relative mx-auto w-[230px] sm:w-[250px]">
      <div
        className="relative overflow-hidden rounded-[38px] border-[6px] border-[#10231f] bg-[#09090b] shadow-[0_40px_70px_-20px_rgba(0,0,0,0.6)]"
        style={{ aspectRatio: "9/18.5" }}
      >
        <div className="absolute left-1/2 top-0 z-10 h-5 w-20 -translate-x-1/2 rounded-b-2xl bg-[#10231f]" />
        <div className="relative h-[34%] overflow-hidden bg-gradient-to-br from-[#4a3818] via-[#1d1710] to-[#09090b]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent" />
          <div className="absolute bottom-3 left-3.5 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d4a537]/50 bg-black/40 text-[9px] font-black text-[#d4a537]">M</span>
            <div>
              <p className="text-[11px] font-bold leading-none text-[#f5e6cc]" style={{ fontFamily: "var(--font-display)" }}>Métropolitan</p>
              <p className="mt-1 text-[7px] font-semibold uppercase tracking-widest text-[#d4a537]">Café · Restaurant</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1.5 overflow-hidden px-3 py-2">
          {["Tout", "Flavored", "Smoothies", "Toast"].map((c, i) => (
            <span key={c} className={`shrink-0 rounded-full px-2.5 py-1 text-[8px] font-bold ${i === 0 ? "bg-[#d4a537] text-[#09090b]" : "bg-white/10 text-zinc-400"}`}>{c}</span>
          ))}
        </div>
        <div className="space-y-1.5 px-3">
          {items.map((it) => (
            <div key={it.n} className="flex items-center gap-2 rounded-xl bg-white/[0.06] p-1.5">
              <span className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-amber-800/60 to-zinc-800" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[9px] font-bold text-white">{it.n}</p>
                {it.tag && <span className="text-[6.5px] font-bold uppercase tracking-wider text-[#d4a537]">✦ {it.tag}</span>}
              </div>
              <span className="rounded-md bg-[#d4a537]/15 px-1.5 py-0.5 text-[8px] font-black tabular-nums text-[#efc360]">{it.p}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -right-4 top-12 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-xl sm:-right-12">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--h-terra-soft)] text-[var(--h-terra)]">
          <ScanLine className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[11px] font-bold text-[var(--h-ink)]">Scan instantané</p>
          <p className="text-[10px] text-[var(--h-muted)]">Aucune app à installer</p>
        </div>
      </div>
      <div className="absolute -bottom-6 -left-4 rounded-2xl bg-white p-3 shadow-xl sm:-left-14">
        <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--h-muted)]">Ce mois</p>
        <div className="mt-1 flex items-end gap-3">
          <div>
            <p className="text-xl font-black leading-none text-[var(--h-ink)]">15 248</p>
            <p className="mt-1 text-[10px] text-[var(--h-muted)]">scans QR</p>
          </div>
          <span className="text-[11px] font-bold text-emerald-600">↑ 24%</span>
        </div>
        <div className="mt-2 flex h-6 items-end gap-0.5">
          {[45, 62, 50, 78, 64, 92, 74].map((h, i) => (
            <span key={i} className="w-2 rounded-sm" style={{ height: `${h}%`, background: i === 5 ? "var(--h-terra)" : "var(--h-terra-soft)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600;

async function getPartners(): Promise<Partner[]> {
  try {
    await connectDb();
    const rows = await Restaurant.find({ isActive: { $ne: false } }, { slug: 1, name: 1, logo: 1, establishmentType: 1 })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();
    return rows.map((r) => ({ slug: String(r.slug), name: String(r.name), logo: r.logo || undefined, type: r.establishmentType }));
  } catch {
    return []; // DB unreachable: render the page without the carousel
  }
}

export default async function HomePage() {
  const partners = await getPartners();
  return (
    <div className="home-root relative min-h-screen overflow-x-clip bg-[var(--h-sand)] text-[var(--h-ink)] antialiased [font-family:var(--font-body),system-ui,sans-serif]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
      />
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <span className={EYEBROW}>
                <Sparkles className="h-3.5 w-3.5" />
                Menus QR · Cafés &amp; restaurants · Tunisie
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1
                className="mt-6 text-[2.6rem] font-extrabold leading-[1.02] tracking-tight text-[var(--h-ink)] sm:text-6xl lg:text-[4.2rem]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Le menu digital en Tunisie qui{" "}
                <span className="relative text-[var(--h-terra)] sm:whitespace-nowrap">
                  donne envie
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 10" preserveAspectRatio="none" height="8" aria-hidden>
                    <path d="M2 7 Q50 1 100 6 T198 4" stroke="#f4c65a" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </svg>
                </span>{" "}
                de commander.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--h-muted)] sm:text-lg">
                ClickMenu crée votre menu QR code : une carte élégante, toujours à jour, que vos clients ouvrent d’un scan.
                Pensé pour les cafés, restaurants et lounges de Tunisie — sans impression, sans application.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={WHATSAPP} target="_blank" rel="noreferrer" className={BTN_PRIMARY}>
                  <MessageSquare className="h-4 w-4" />
                  Demander une démo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <Link href="/menu" className={BTN_SECONDARY}>
                  Explorer les menus
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.32}>
              <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-[var(--h-ink)]">
                {["En ligne en 48h", "Sans application", "Mise à jour instantanée"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--h-teal)] text-white">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="relative mx-auto max-w-md rounded-[2.5rem] bg-[var(--h-teal)] px-6 pb-12 pt-14 sm:px-10">
              <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-[var(--h-sun)]" />
              <div className="absolute -left-4 bottom-10 h-14 w-14 rounded-full bg-[var(--h-terra)]" />
              <div
                className="absolute inset-0 rounded-[2.5rem] opacity-[0.12]"
                style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "18px 18px" }}
              />
              <div className="relative">
                <PhoneMockup />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <PartnersCarousel partners={partners} />

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["25+", "Établissements partenaires", "partout en Tunisie"],
            ["15k+", "Scans par mois", "en moyenne"],
            ["4.9/5", "Satisfaction client", "selon nos clients"],
          ].map(([v, l, s], i) => (
            <Reveal key={l} delay={i * 0.08} className={`${CARD} p-8 text-center`}>
              <p className="text-5xl font-black tracking-tight text-[var(--h-teal)] sm:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
                {v}
              </p>
              <p className="mt-3 text-sm font-bold text-[var(--h-ink)]">{l}</p>
              <p className="mt-0.5 text-xs text-[var(--h-muted)]">{s}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONCEPT ──────────────────────────────────────────────────────── */}
      <section id="concept" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-24 sm:px-8 sm:pb-32">
        <Reveal className="max-w-2xl">
          <span className={EYEBROW}>Le concept</span>
          <h2 className={H2} style={{ fontFamily: "var(--font-display)" }}>
            Zéro friction, <span className="text-[var(--h-terra)]">100% élégance.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-6">
          <Reveal className="relative overflow-hidden rounded-[1.75rem] bg-[var(--h-teal)] p-8 text-white md:col-span-4">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[var(--h-sun)]/90" />
            <Smartphone className="relative h-7 w-7 text-[var(--h-sun)]" />
            <h3 className="relative mt-6 text-2xl font-bold">Aucune application à installer</h3>
            <p className="relative mt-2 max-w-md text-[15px] leading-relaxed text-white/75">
              Le client scanne avec l’appareil photo, le menu s’ouvre en moins d’une seconde. Pas de compte, pas de
              téléchargement, pas d’attente.
            </p>
          </Reveal>
          <Reveal delay={0.08} className={`${CARD} p-8 md:col-span-2`}>
            <Zap className="h-7 w-7 text-[var(--h-terra)]" />
            <h3 className="mt-6 text-lg font-bold">Mise à jour instantanée</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--h-muted)]">Prix, disponibilité, photos : en quelques secondes.</p>
          </Reveal>
          <Reveal delay={0.04} className="rounded-[1.75rem] bg-[var(--h-terra-soft)] p-8 md:col-span-2">
            <Globe className="h-7 w-7 text-[var(--h-terra-2)]" />
            <h3 className="mt-6 text-lg font-bold">Votre image de marque</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--h-ink)]/70">Logo, couleurs et photos des plats, pensés pour mettre en appétit.</p>
          </Reveal>
          <Reveal delay={0.12} className={`${CARD} p-8 md:col-span-4`}>
            <BarChart3 className="h-7 w-7 text-[var(--h-teal)]" />
            <h3 className="mt-6 text-2xl font-bold">Statistiques de scans en direct</h3>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[var(--h-muted)]">
              Suivez la fréquentation de votre menu et vos plats les plus consultés depuis le tableau de bord.
            </p>
            <div className="mt-6 flex h-16 items-end gap-1.5">
              {[30, 44, 38, 60, 52, 78, 64, 90, 72, 100].map((h, i) => (
                <span key={i} className="flex-1 rounded-md" style={{ height: `${h}%`, background: i === 9 ? "var(--h-terra)" : "var(--h-sand-2)" }} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── STEPS ────────────────────────────────────────────────────────── */}
      <section id="fonctionnement" className="scroll-mt-24 bg-[var(--h-teal-2)] py-24 text-white sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--h-sun)]">Fonctionnement</span>
            <h2 className="mt-4 text-[2rem] font-extrabold leading-[1.08] tracking-tight sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              En ligne en <span className="text-[var(--h-sun)]">48 heures.</span>
            </h2>
            <p className="mt-4 text-white/70">Nous gérons toute la mise en place pour que vous restiez concentré sur vos clients.</p>
          </Reveal>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: QrCode, t: "Création du menu", d: "Plats, photos, prix et catégories intégrés, optimisés pour mobile." },
              { icon: ScanLine, t: "QR sur mesure", d: "Cartes de table en bois gravé, acrylique ou autocollants laminés." },
              { icon: Smartphone, t: "Scan instantané", d: "Vos clients scannent et découvrent la carte sans rien télécharger." },
              { icon: TrendingUp, t: "Vous gardez la main", d: "Modifiez tarifs et disponibilités à tout moment, en autonomie." },
            ].map((s, i) => (
              <Reveal key={s.t} delay={i * 0.07} className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-7">
                <span className="text-5xl font-black text-[var(--h-sun)]" style={{ fontFamily: "var(--font-display)" }}>0{i + 1}</span>
                <span className="mt-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="max-w-2xl">
          <span className={EYEBROW}>Témoignages</span>
          <h2 className={H2} style={{ fontFamily: "var(--font-display)" }}>
            Ils nous font <span className="text-[var(--h-terra)]">confiance.</span>
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
                  <Star key={j} className="h-4 w-4 fill-[var(--h-sun)] stroke-[var(--h-sun)]" />
                ))}
              </div>
              <p className="flex-1 text-[15px] leading-relaxed">“{t.q}”</p>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--h-teal)] text-sm font-bold text-white">{t.n.charAt(0)}</span>
                <div>
                  <p className="text-sm font-bold">{t.n}</p>
                  <p className="text-xs text-[var(--h-muted)]">{t.r}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section id="services" className="scroll-mt-24 bg-[var(--h-sand-2)]/60 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <span className={EYEBROW}>Services</span>
            <h2 className={H2} style={{ fontFamily: "var(--font-display)" }}>
              Aujourd’hui, et <span className="text-[var(--h-terra)]">demain.</span>
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
              <Reveal key={s.t} delay={(i % 3) * 0.07} className={`${CARD} relative p-7 ${s.ok ? "" : "bg-white/60"}`}>
                <span
                  className={`absolute right-5 top-5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    s.ok ? "bg-[var(--h-teal)]/10 text-[var(--h-teal)]" : "bg-[var(--h-sand-2)] text-[var(--h-muted)]"
                  }`}
                >
                  {s.ok && <Check className="h-3 w-3" />}
                  {s.ok ? "Disponible" : "Bientôt"}
                </span>
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.ok ? "bg-[var(--h-terra-soft)] text-[var(--h-terra-2)]" : "bg-[var(--h-sand)] text-[var(--h-muted)]"}`}>
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-bold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--h-muted)]">{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <span className={EYEBROW}>Questions fréquentes</span>
          <h2 className={H2} style={{ fontFamily: "var(--font-display)" }}>
            Tout savoir sur le <span className="text-[var(--h-terra)]">menu digital.</span>
          </h2>
        </Reveal>
        <div className="mt-10 space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className={`group ${CARD} px-6 py-5 open:border-[var(--h-terra)]/40`}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--h-terra-soft)] text-lg leading-none text-[var(--h-terra-2)] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--h-muted)]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="px-5 pb-24 sm:px-8 sm:pb-32">
        <Reveal>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-[var(--h-teal)] px-6 py-16 text-center text-white sm:px-14 sm:py-20">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[var(--h-sun)]" />
            <div className="absolute -bottom-12 -right-8 h-48 w-48 rounded-full bg-[var(--h-terra)]" />
            <h2 className="relative text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              Un café, un restaurant ? <span className="text-[var(--h-sun)]">Passez au digital.</span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-white/75">
              Moins d’impression, des tables qui tournent plus vite, une carte toujours à jour.
            </p>
            <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className={BTN_PRIMARY}>
                <MessageSquare className="h-4 w-4" />
                Nous écrire sur WhatsApp
              </a>
              <Link href="/menu" className="inline-flex h-14 items-center justify-center rounded-full border border-white/30 px-8 text-[15px] font-bold text-white transition-colors hover:bg-white/10 active:scale-[0.97]">
                Voir les démos en direct
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--h-line)] py-10 text-xs text-[var(--h-muted)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 sm:flex-row sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--h-teal)] text-white">
              <QrCode className="h-4 w-4 stroke-[2.25]" />
            </span>
            <span className="text-sm font-extrabold tracking-tight text-[var(--h-ink)]">Click<span className="text-[var(--h-terra)]">Menu</span></span>
          </Link>
          <p>© {new Date().getFullYear()} ClickMenu · Made in Tunisia</p>
          <div className="flex gap-6 font-semibold">
            <a href={WHATSAPP} className="transition-colors hover:text-[var(--h-ink)]">WhatsApp</a>
            <Link href="/menu" className="transition-colors hover:text-[var(--h-ink)]">Explorer</Link>
            <Link href="/login" className="transition-colors hover:text-[var(--h-ink)]">Connexion</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
