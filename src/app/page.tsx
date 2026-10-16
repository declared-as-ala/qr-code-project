import Link from "next/link";
import {
  ArrowRight, BarChart3, Check, Clock, Globe, Leaf, MessageSquare, QrCode, ScanLine,
  ShoppingBag, Smartphone, Star, TrendingUp, Zap,
} from "lucide-react";
import { Navbar, WHATSAPP } from "@/components/home/Navbar";
import { Reveal } from "@/components/home/Reveal";
import { PartnersCarousel, type Partner } from "@/components/home/PartnersCarousel";
import { connectDb } from "@/lib/db";
import { thumb } from "@/lib/utils";
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

const CARD = "rounded-[1.75rem] bg-white shadow-[0_18px_50px_-28px_rgba(17,17,17,0.35)]";
const H2 = "text-[1.9rem] font-extrabold leading-[1.12] tracking-tight text-[var(--h-ink)] sm:text-4xl";
const BTN_DARK =
  "group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--h-ink)] px-7 text-[15px] font-bold text-white transition-transform hover:bg-black active:scale-[0.97]";
const BTN_LIGHT =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[var(--h-ink)]/15 bg-white px-7 text-[15px] font-bold text-[var(--h-ink)] transition-colors hover:border-[var(--h-ink)]/40 active:scale-[0.97]";

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 0 C12.8 7.2 16.8 11.2 24 12 C16.8 12.8 12.8 16.8 12 24 C11.2 16.8 7.2 12.8 0 12 C7.2 11.2 11.2 7.2 12 0Z" fill="currentColor" />
    </svg>
  );
}

function Dashed({ d, className = "" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} fill="none" aria-hidden preserveAspectRatio="none">
      <path d={d} stroke="#111" strokeWidth="1.4" strokeDasharray="6 7" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

// Venue photo with a soft fallback so the layout never breaks when a cover is missing.
function Photo({ src, alt, className = "", w = 640, h = 480 }: { src?: string; alt: string; className?: string; w?: number; h?: number }) {
  return (
    <div className={`overflow-hidden bg-gradient-to-br from-[#f2d36b] via-[#f6e7b4] to-[#e6e2ff] ${className}`}>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumb(src, w, h)} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      )}
    </div>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative isolate inline-block px-3 sm:px-5">
      <span className="absolute inset-y-[6%] left-0 right-0 -z-10 rounded-[999px] bg-[var(--h-sun)]" />
      {children}
    </span>
  );
}

export const revalidate = 3600;

async function getPartners(): Promise<Partner[]> {
  try {
    await connectDb();
    const rows = await Restaurant.find({ isActive: { $ne: false } }, { slug: 1, name: 1, logo: 1, coverImage: 1, establishmentType: 1 })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();
    return rows.map((r) => ({
      slug: String(r.slug),
      name: String(r.name),
      logo: r.logo || undefined,
      cover: r.coverImage || undefined,
      type: r.establishmentType,
    }));
  } catch {
    return []; // DB unreachable: render the page without partner content
  }
}

export default async function HomePage() {
  const partners = await getPartners();
  const covers = partners.map((p) => p.cover).filter(Boolean) as string[];
  const cover = (i: number) => (covers.length ? covers[i % covers.length] : undefined);

  return (
    <div className="home-root home-bg relative min-h-screen overflow-x-clip text-[var(--h-ink)] antialiased [font-family:var(--font-body),system-ui,sans-serif]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
      />
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 sm:pt-36">
        <Sparkle className="absolute right-[12%] top-40 hidden h-5 w-5 text-[var(--h-ink)] sm:block" />
        <Dashed d="M10 280 C60 200 40 90 160 20" className="absolute left-[8%] top-44 hidden h-40 w-40 lg:block" />
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <Reveal>
            <h1 className="text-[2.6rem] font-extrabold leading-[1.12] tracking-tight sm:text-6xl lg:text-[4.4rem]">
              Le <Highlight>menu digital</Highlight>
              <br />
              en Tunisie
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-[var(--h-ink)]/80 sm:text-lg">
              Digitalisez votre carte : vos clients scannent, consultent et commandent — sans application, sans impression.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className={BTN_DARK}>
                Demander une démo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <Link href="/menu" className={BTN_LIGHT}>
                Voir les menus
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25}>
          <div className="relative mx-auto mt-14 grid max-w-6xl grid-cols-2 items-start gap-4 px-5 sm:mt-20 sm:grid-cols-3 sm:gap-8 sm:px-8">
            <Dashed d="M0 150 C120 40 200 260 400 120" className="pointer-events-none absolute inset-x-0 top-1/4 hidden h-48 w-full opacity-60 sm:block" />
            <Photo src={cover(0)} alt="Menu digital d’un café partenaire" className="aspect-[4/3] -rotate-2 rounded-3xl shadow-xl" />
            <div className="relative col-span-2 row-start-2 mx-auto w-3/4 sm:col-span-1 sm:row-start-auto sm:mt-10 sm:w-full">
              <Photo src={cover(1)} alt="Restaurant partenaire ClickMenu" className="aspect-[4/3] rotate-2 rounded-3xl shadow-xl" />
              <div className="absolute -bottom-9 left-1/2 h-24 w-24 -translate-x-1/2 sm:-bottom-10 sm:h-28 sm:w-28">
                <div className="absolute inset-0 rounded-full bg-[var(--h-ink)]" />
                <svg viewBox="0 0 100 100" className="home-spin absolute inset-0 h-full w-full" aria-hidden>
                  <defs>
                    <path id="home-circ" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
                  </defs>
                  <text fontSize="9.5" fontWeight="700" fill="#fff" textLength="224" lengthAdjust="spacing">
                    <textPath href="#home-circ">SANS CONTACT • MENU DIGITAL • </textPath>
                  </text>
                </svg>
                <Sparkle className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-white" />
              </div>
            </div>
            <Photo src={cover(2)} alt="Café utilisant un menu QR code" className="aspect-[4/3] rotate-[-1.5deg] rounded-3xl shadow-xl" />
          </div>
        </Reveal>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-5 pb-6 pt-24 sm:px-8 sm:pt-28">
        <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
          {[
            ["+25", "Établissements"],
            ["+15K", "Scans par mois"],
            ["48h", "Mise en ligne"],
            ["4.9/5", "Satisfaction"],
          ].map(([v, l], i) => (
            <Reveal key={l} delay={i * 0.06}>
              <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">{v}</p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--h-muted)]">{l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <PartnersCarousel partners={partners} />

      {/* ── 3 AXES ───────────────────────────────────────────────────────── */}
      <section id="concept" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-2 md:items-end">
            <h2 className={H2}>
              Le menu QR ClickMenu
              <br className="hidden sm:block" /> se concentre sur 3 axes
            </h2>
            <p className="text-[15px] leading-relaxed text-[var(--h-ink)]/75">
              Simplifiez votre service, dépassez les attentes de vos clients et réduisez le papier. Le restaurant de
              demain est simple, intelligent et durable.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3 md:items-start">
          {[
            { icon: Zap, bg: "bg-[var(--h-sun)]", t: "Efficacité opérationnelle", pts: ["Moins de temps de service grâce au choix en amont.", "Fini les cartes papier à réimprimer.", "Prix et plats modifiés en temps réel."], off: "" },
            { icon: Smartphone, bg: "bg-[#dfe6ff]", t: "Meilleure expérience client", pts: ["Accès immédiat à la carte par simple scan.", "Le client choisit à son rythme.", "Promotions et nouveautés mises en avant."], off: "md:mt-10" },
            { icon: Leaf, bg: "bg-[#def3e6]", t: "Moins de papier, plus durable", pts: ["Moins de papier et d’encre utilisés.", "Plus de menus jetables à remplacer.", "Un geste concret pour l’environnement."], off: "md:mt-20" },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.08} className={c.off}>
              <div className={`${CARD} h-full p-8`}>
                <span className={`flex h-12 w-12 items-center justify-center rounded-full ${c.bg}`}>
                  <c.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 text-lg font-bold leading-snug">{c.t}</h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--h-muted)]">
                  {c.pts.map((p) => (
                    <li key={p} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--h-ink)]/50" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── POURQUOI ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <div className="relative mx-auto h-[360px] w-full max-w-md sm:h-[420px]">
              <Photo src={cover(3)} alt="Menu QR sur une table de café" className="absolute left-0 top-0 h-[55%] w-[62%] rounded-3xl shadow-xl" w={520} h={420} />
              <Photo src={cover(4)} alt="Client scannant un menu QR" className="absolute bottom-0 right-0 h-[62%] w-[66%] rounded-3xl shadow-xl" w={560} h={460} />
              <Dashed d="M20 20 C100 120 60 200 220 260" className="pointer-events-none absolute left-[10%] top-[48%] h-24 w-28 opacity-70" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className={H2}>Pourquoi choisir un menu QR code ?</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--h-ink)]/75">
              Adoptez une expérience moderne : zéro contact, une carte toujours juste, et des clients qui commandent
              plus facilement. C’est le choix malin pour un café ou un restaurant qui veut avancer.
            </p>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 border-b-2 border-[var(--h-ink)] pb-1 text-sm font-bold">
              Parler à l’équipe <ArrowRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── RÉVOLUTION (BLACK) ───────────────────────────────────────────── */}
      <section id="fonctionnement" className="scroll-mt-24 bg-[#111] py-24 text-white sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="text-center">
            <Sparkle className="mx-auto h-5 w-5 text-[var(--h-sun)]" />
            <h2 className="mt-4 text-[1.9rem] font-extrabold leading-[1.12] tracking-tight sm:text-5xl">La révolution du menu QR code</h2>
            <p className="mt-4 text-white/60">Votre carte, votre table, votre moment.</p>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {[
              { t: "Sécurité et efficacité", d: "Un service sans manipulation de cartes : vos équipes gagnent du temps et la carte reste toujours propre.", pts: ["Hygiène : plus de cartes qui passent de main en main", "Gain de temps pour vos équipes", "Souplesse pour changer et promouvoir"], img: cover(5) },
              { t: "Menu digital instantané", d: "Vos clients accèdent à la carte depuis n’importe où, d’un simple scan, sans rien installer.", pts: ["Aucune attente pour consulter la carte", "Moins de papier, moins d’encre", "Mises à jour instantanées"], img: cover(6) },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 0.1}>
                <div className="flex h-full flex-col rounded-[1.75rem] bg-[#f6f6fb] p-8 text-[var(--h-ink)]">
                  <h3 className="text-xl font-bold">{c.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--h-muted)]">{c.d}</p>
                  <p className="mt-5 text-sm font-bold">Avantages :</p>
                  <ul className="mt-2 space-y-2 text-sm text-[var(--h-muted)]">
                    {c.pts.map((p) => (
                      <li key={p} className="flex gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--h-terra)]" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Photo src={c.img} alt={c.t} className="mt-7 aspect-[16/9] rounded-2xl" w={720} h={405} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="text-center">
          <h2 className={H2}>
            En ligne en <Highlight>48 heures</Highlight>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[var(--h-muted)]">Nous gérons toute la mise en place pour que vous restiez concentré sur vos clients.</p>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: QrCode, t: "Création du menu", d: "Plats, photos, prix et catégories intégrés, optimisés pour mobile." },
            { icon: ScanLine, t: "QR sur mesure", d: "Cartes de table en bois gravé, acrylique ou autocollants laminés." },
            { icon: Smartphone, t: "Scan instantané", d: "Vos clients scannent et découvrent la carte sans rien télécharger." },
            { icon: TrendingUp, t: "Vous gardez la main", d: "Modifiez tarifs et disponibilités à tout moment, en autonomie." },
          ].map((s, i) => (
            <Reveal key={s.t} delay={i * 0.07}>
              <div className={`${CARD} h-full p-7`}>
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--h-sun)]">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="text-3xl font-extrabold text-[var(--h-ink)]/15">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-base font-bold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--h-muted)]">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-32">
        <Reveal className="text-center">
          <h2 className={H2}>Ils nous font confiance</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { q: "Le meilleur investissement pour notre café. Les clients adorent scanner et nous avons arrêté les cartes imprimées.", n: "Sami B.", r: "Café Bab El Bhar · Tunis" },
            { q: "L’équipe a tout configuré en 24h. Notre menu est beau, professionnel et facile à mettre à jour.", n: "Yasmine M.", r: "Le Jardin d’Ariana · Ariana" },
            { q: "Les tables tournent plus vite et les clients commandent plus facilement. Chokran ClickMenu !", n: "Nizar K.", r: "Brik & Co · Sousse" },
          ].map((t, i) => (
            <Reveal key={t.n} delay={i * 0.08}>
              <div className={`${CARD} flex h-full flex-col gap-5 p-8`}>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-[var(--h-sun)] stroke-[var(--h-sun)]" />
                  ))}
                </div>
                <p className="flex-1 text-[15px] italic leading-relaxed">“{t.q}”</p>
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
      <section id="services" className="scroll-mt-24 bg-white/60 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="text-center">
            <h2 className={H2}>Aujourd’hui, et demain</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Smartphone, t: "Menu QR interactif", d: "Navigation fluide par catégories, recherche et design sur mesure.", ok: true },
              { icon: QrCode, t: "Cartes QR imprimées", d: "Supports nobles : bois gravé, acrylique, autocollants haute résistance.", ok: true },
              { icon: Globe, t: "Page web dédiée", d: "Votre propre adresse ClickMenu, prête à partager.", ok: true },
              { icon: ShoppingBag, t: "Commandes digitales", d: "Vos clients commandent depuis la table, vous êtes notifié en temps réel.", ok: true },
              { icon: Clock, t: "Caisse / POS", d: "Commandes, affichage cuisine et paiements centralisés.", ok: false },
              { icon: BarChart3, t: "Analytics avancés", d: "Ventes, plats populaires et comportement des clients.", ok: false },
            ].map((s, i) => (
              <Reveal key={s.t} delay={(i % 3) * 0.07}>
                <div className={`${CARD} relative h-full p-7 ${s.ok ? "" : "opacity-70"}`}>
                  <span className={`absolute right-5 top-5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${s.ok ? "bg-[var(--h-sun)]/60" : "bg-[var(--h-sand-2)] text-[var(--h-muted)]"}`}>
                    {s.ok ? "Disponible" : "Bientôt"}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1efe9]">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-base font-bold">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--h-muted)]">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="text-center">
          <h2 className={H2}>Tout savoir sur le menu digital</h2>
        </Reveal>
        <div className="mt-10 space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className={`group ${CARD} px-6 py-5`}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--h-sun)] text-lg leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--h-muted)]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="px-5 pb-24 sm:px-8 sm:pb-32">
        <Reveal>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-[#111] px-6 py-16 text-center text-white sm:px-14 sm:py-20">
            <Sparkle className="absolute left-[10%] top-10 h-5 w-5 text-[var(--h-sun)]" />
            <Sparkle className="absolute bottom-12 right-[12%] h-4 w-4 text-[var(--h-sun)]" />
            <h2 className="text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl">
              Un café, un restaurant ?
              <br />
              Passez au <span className="rounded-full bg-[var(--h-sun)] px-4 text-[#111]">digital</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-white/65">Moins d’impression, des tables qui tournent plus vite, une carte toujours à jour.</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-[15px] font-bold text-[#111] transition-transform active:scale-[0.97]">
                <MessageSquare className="h-4 w-4" />
                Nous écrire sur WhatsApp
              </a>
              <Link href="/menu" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/25 px-7 text-[15px] font-bold text-white transition-colors hover:bg-white/10 active:scale-[0.97]">
                Voir les démos en direct
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--h-line)] py-10 text-xs text-[var(--h-muted)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 sm:flex-row sm:px-8">
          <Link href="/" className="flex items-baseline gap-0.5">
            <span className="text-lg font-extrabold tracking-[-0.04em] text-[var(--h-ink)]">click</span>
            <span className="text-lg font-extrabold tracking-[-0.04em] text-[var(--h-terra)]">menu</span>
            <span className="ml-0.5 text-[10px] font-bold">.tn</span>
          </Link>
          <p>© {new Date().getFullYear()} ClickMenu · Made in Tunisia</p>
          <div className="flex gap-6 font-semibold">
            <a href={WHATSAPP} className="transition-colors hover:text-[var(--h-ink)]">WhatsApp</a>
            <Link href="/menu" className="transition-colors hover:text-[var(--h-ink)]">Partenaires</Link>
            <Link href="/login" className="transition-colors hover:text-[var(--h-ink)]">Connexion</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
