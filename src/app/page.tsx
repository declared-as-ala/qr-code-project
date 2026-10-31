import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  Clock,
  ExternalLink,
  Globe,
  Leaf,
  MessageSquare,
  QrCode,
  ScanLine,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/home/Navbar";
import { Reveal } from "@/components/home/Reveal";
import { PartnersCarousel, type Partner } from "@/components/home/PartnersCarousel";
import { QuoteConfigurator } from "@/components/home/QuoteConfigurator";
import { SiteFooter } from "@/components/home/SiteFooter";
import { connectDb } from "@/lib/db";
import { thumb } from "@/lib/utils";
import { Restaurant } from "@/models/Restaurant";
import {
  buildWhatsAppUrl,
  DUPLICATE_SLUG_CANONICALS,
  FAQ,
  HOME_DESCRIPTION,
  HOME_TITLE,
  SITE_NAME,
  SITE_URL,
  VERIFIED_PARTNER_EXAMPLES,
  WHATSAPP_BASE,
} from "@/lib/site";
import { COMMERCIAL_PAGES } from "@/lib/commercial-pages";
import { getPublishedBlogArticles } from "@/lib/blog-data";
import { buildNextMetadata, resolvePageSeo } from "@/lib/seo-resolver";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await resolvePageSeo("/", {
    title: `${HOME_TITLE} | ${SITE_NAME}`,
    description: HOME_DESCRIPTION,
    canonical: `${SITE_URL}/`,
  });
  return buildNextMetadata(seo, true);
}

// Structured data: Organization, WebSite, Service, BreadcrumbList, FAQPage.
// Strictly no invented aggregateRating or fake customer reviews.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logos/clickmenu-mark-512.png`,
        width: 512,
        height: 512,
      },
      areaServed: { "@type": "Country", name: "Tunisie" },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+216-97-991-266",
        contactType: "sales",
        areaServed: "TN",
        availableLanguage: ["fr", "ar"],
      },
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
      "@id": `${SITE_URL}/#service`,
      name: "Menu digital QR code pour cafés et restaurants en Tunisie",
      serviceType: "Menu digital / Menu QR code restaurant & café",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "Tunisie" },
      description: HOME_DESCRIPTION,
      url: SITE_URL,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil — Menu digital Tunisie",
          item: SITE_URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
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
      <path
        d="M12 0 C12.8 7.2 16.8 11.2 24 12 C16.8 12.8 12.8 16.8 12 24 C11.2 16.8 7.2 12.8 0 12 C7.2 11.2 11.2 7.2 12 0Z"
        fill="currentColor"
      />
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

function Photo({
  src,
  alt,
  className = "",
  w = 640,
  h = 480,
  eager = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  w?: number;
  h?: number;
  eager?: boolean;
}) {
  return (
    <div className={`overflow-hidden bg-gradient-to-br from-[#f2d36b] via-[#f6e7b4] to-[#e6e2ff] ${className}`}>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumb(src, w, h)}
          alt={alt}
          width={w}
          height={h}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
          className="h-full w-full object-cover"
        />
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
    const rows = await Restaurant.find(
      { isActive: { $ne: false } },
      { slug: 1, name: 1, logo: 1, coverImage: 1, establishmentType: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();
    return rows
      .filter((r) => !DUPLICATE_SLUG_CANONICALS[String(r.slug)])
      .map((r) => ({
        slug: String(r.slug),
        name: String(r.name),
        logo: r.logo || undefined,
        cover: r.coverImage || undefined,
        type: r.establishmentType,
      }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const partners = await getPartners();
  const covers = partners.map((p) => p.cover).filter(Boolean) as string[];
  const cover = (i: number) => (covers.length ? covers[i % covers.length] : "/logos/couverture.png");
  const featuredArticles = getPublishedBlogArticles().slice(0, 3);

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
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--h-line)] bg-white/90 px-4 py-1.5 text-xs font-bold text-[var(--h-ink)] shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[var(--h-terra)]" />
              Solution QR Code pour Cafés, Salons de Thé & Restaurants en Tunisie
            </span>
            <h1 className="mt-5 text-[2.5rem] font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-[4.25rem]">
              Le <Highlight>menu digital</Highlight>
              <br />
              en Tunisie
            </h1>
            <p className="mt-3 text-sm font-semibold text-[var(--h-muted)]" dir="rtl" lang="ar">
              منيو رقمي تفاعلي عبر رمز QR للمقاهي والمطاعم في تونس — جاهز في 48 ساعة وبدون تطبيق
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[var(--h-ink)]/80 sm:text-lg">
              Digitalisez la carte de votre café ou restaurant : vos clients scannent le QR code sur la table et consultent vos plats, photos et prix en dinars — <strong>sans application à télécharger</strong> et <strong>sans frais de réimpression</strong>.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={buildWhatsAppUrl(
                  "Bonjour ClickMenu, je souhaite demander une démonstration pour créer le menu digital de mon établissement en Tunisie."
                )}
                target="_blank"
                rel="noreferrer"
                data-cta-location="hero_primary"
                className={BTN_DARK}
              >
                Demander une démo sur WhatsApp
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <Link href="/menu" className={BTN_LIGHT}>
                Tester les menus clients en direct
              </Link>
            </div>
            <p className="mt-3 text-xs font-medium text-[var(--h-muted)]">
              Intégration complète de votre carte en 48h · Modifications de prix en DT illimitées · Supports bois & acrylique
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="relative mx-auto mt-14 grid max-w-6xl grid-cols-2 items-start gap-4 px-5 sm:mt-20 sm:grid-cols-3 sm:gap-8 sm:px-8">
            <Dashed
              d="M0 150 C120 40 200 260 400 120"
              className="pointer-events-none absolute inset-x-0 top-1/4 hidden h-48 w-full opacity-60 sm:block"
            />
            <Photo
              src={cover(0)}
              alt="Menu digital QR code d’un café partenaire en Tunisie"
              className="aspect-[4/3] -rotate-2 rounded-3xl shadow-xl"
              eager
            />
            <div className="relative col-span-2 row-start-2 mx-auto w-3/4 sm:col-span-1 sm:row-start-auto sm:mt-10 sm:w-full">
              <Photo
                src={cover(1)}
                alt="Carte digitale d’un restaurant partenaire ClickMenu en Tunisie"
                className="aspect-[4/3] rotate-2 rounded-3xl shadow-xl"
                eager
              />
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
            <Photo
              src={cover(2)}
              alt="Consultation d’un menu QR code sur smartphone sans application"
              className="aspect-[4/3] rotate-[-1.5deg] rounded-3xl shadow-xl"
            />
          </div>
        </Reveal>
      </section>

      {/* ── VERIFIED FACTS (NO INVENTED STATS) ───────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 pb-6 pt-24 sm:px-8 sm:pt-28" aria-label="Engagements vérifiés ClickMenu">
        <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
          {[
            ["48h", "Mise en ligne clé en main"],
            ["0 App", "Ouverture directe navigateur"],
            ["0 DT", "Par modification de prix"],
            ["24/7", "Autonomie tableau de bord"],
          ].map(([v, l], i) => (
            <Reveal key={l} delay={i * 0.05}>
              <div className="rounded-2xl border border-[var(--h-line)] bg-white/80 px-4 py-6 shadow-sm">
                <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">{v}</p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--h-muted)]">{l}</p>
              </div>
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
              Pourquoi adopter un menu digital QR code en Tunisie ?
            </h2>
            <p className="text-[15px] leading-relaxed text-[var(--h-ink)]/75">
              Pensé pour la réalité terrain des cafés, salons de thé, pizzerias et restaurants tunisiens : un service plus rapide aux heures de pointe, une carte toujours exacte en dinars et zéro gaspillage papier.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3 md:items-start">
          {[
            {
              icon: Zap,
              bg: "bg-[var(--h-sun)]",
              t: "Efficacité opérationnelle en salle",
              pts: [
                "Les clients consultent la carte dès qu’ils s’assoient, sans attendre un serveur.",
                "Fini les cartes papier à réimprimer à chaque hausse des coûts matières.",
                "Prix en dinars (DT) et ruptures de stock modifiés en 5 secondes.",
              ],
              off: "",
            },
            {
              icon: Smartphone,
              bg: "bg-[#dfe6ff]",
              t: "Expérience mobile sans application",
              pts: [
                "Ouverture immédiate dans Safari ou Chrome par simple scan de l’appareil photo.",
                "Photos HD, filtres par catégorie et recherche instantanée de plats.",
                "Mise en avant de vos spécialités, formules brunch et suppléments.",
              ],
              off: "md:mt-10",
            },
            {
              icon: Leaf,
              bg: "bg-[#def3e6]",
              t: "Supports durables & image soignée",
              pts: [
                "Chevalets en bois gravé au laser, plaques acrylique ou stickers laminés.",
                "Plus de menus plastifiés cornés ou tachés sur vos tables.",
                "Un seul QR code permanent qui ne change jamais, même après 100 mises à jour.",
              ],
              off: "md:mt-20",
            },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.06} className={c.off}>
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

      {/* ── REAL VERIFIED CLIENT EXAMPLES (LIVE INTERACTIVE DEMOS) ──────── */}
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-32" aria-labelledby="exemples-clients-heading">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--h-terra)]">
                Références vérifiées en ligne
              </span>
              <h2 id="exemples-clients-heading" className={`${H2} mt-2`}>
                Exemples réels de menus digitaux ClickMenu
              </h2>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--h-ink)] hover:text-[var(--h-terra)]"
            >
              Voir tous les établissements partenaires <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--h-muted)]">
            Pas de fausses promesses : cliquez sur l’un de nos établissements partenaires ci-dessous pour tester en direct la rapidité et le design de nos menus QR code sur votre propre téléphone.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VERIFIED_PARTNER_EXAMPLES.slice(0, 6).map((client, i) => (
            <Reveal key={client.slug} delay={(i % 3) * 0.06}>
              <Link
                href={`/menu/${client.slug}`}
                className={`${CARD} group flex h-full flex-col justify-between p-7 transition-transform duration-300 hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex rounded-full bg-[#f6f3ee] px-3 py-1 text-[11px] font-bold text-[var(--h-ink)]">
                      {client.type}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--h-terra)]">
                      Menu en direct <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold tracking-tight text-[var(--h-ink)]">
                    {client.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--h-muted)]">
                    {client.highlight}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-[var(--h-line)] pt-4 text-xs font-bold text-[var(--h-ink)]">
                  <span className="font-mono text-[var(--h-muted)]">/menu/{client.slug}</span>
                  <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Ouvrir la carte <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── RÉVOLUTION (BLACK) ───────────────────────────────────────────── */}
      <section id="fonctionnement" className="scroll-mt-24 bg-[#111] py-24 text-white sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="text-center">
            <Sparkle className="mx-auto h-5 w-5 text-[var(--h-sun)]" />
            <h2 className="mt-4 text-[1.9rem] font-extrabold leading-[1.12] tracking-tight sm:text-5xl">
              Comment fonctionne votre menu QR code au quotidien ?
            </h2>
            <p className="mt-4 text-white/65">
              Une expérience fluide pour vos clients à table, un contrôle total pour vous en coulisses.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {[
              {
                t: "Côté client : consultation et commande sans attente",
                d: "Dès qu’il s’installe en salle ou en terrasse, votre client scanne le QR code avec l’appareil photo de son iPhone ou Android.",
                pts: [
                  "Ouverture immédiate dans le navigateur web (0 téléchargement)",
                  "Navigation par catégories, recherche rapide et photos en haute définition",
                  "Option d’envoi de commande à table avec numéro de table",
                ],
                img: cover(3),
              },
              {
                t: "Côté gérant : votre carte pilotée depuis votre smartphone",
                d: "Vous ne dépendez plus d’un imprimeur ou d’un graphiste pour faire vivre votre carte.",
                pts: [
                  "Changement des prix en dinars (DT) visible à la seconde",
                  "Désactivation en 1 clic d’un plat en rupture de stock en cuisine",
                  "Suivi des scans QR, des commandes et de l’état des stocks",
                ],
                img: cover(4),
              },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 0.08}>
                <div className="flex h-full flex-col rounded-[1.75rem] bg-[#f6f6fb] p-8 text-[var(--h-ink)]">
                  <h3 className="text-xl font-bold">{c.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--h-muted)]">{c.d}</p>
                  <p className="mt-5 text-sm font-bold">Points clés :</p>
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

      {/* ── STEPS (48 HEURES) ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="text-center">
          <h2 className={H2}>
            Votre menu en ligne en <Highlight>48 heures</Highlight>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[var(--h-muted)]">
            Nous gérons toute la saisie et la configuration initiale pour que vous restiez concentré sur vos clients.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: QrCode,
              t: "1. Envoi de votre carte",
              d: "Envoyez-nous la photo ou le PDF de votre menu actuel et votre logo sur WhatsApp.",
            },
            {
              icon: Smartphone,
              t: "2. Création sur mesure",
              d: "Nous intégrons vos catégories, plats, suppléments, photos et tarifs en DT.",
            },
            {
              icon: ScanLine,
              t: "3. Supports QR de table",
              d: "Livraison de votre QR code permanent et de vos supports bois gravé, acrylique ou stickers.",
            },
            {
              icon: TrendingUp,
              t: "4. Autonomie totale",
              d: "Vous recevez vos accès au tableau de bord pour modifier vos prix et disponibilités 24h/24.",
            },
          ].map((s, i) => (
            <Reveal key={s.t} delay={i * 0.06}>
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

      {/* ── TRANSPARENT PRICING & QUOTE CONFIGURATOR ─────────────────────── */}
      <section id="tarifs" className="scroll-mt-24 bg-white/60 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="text-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--h-terra)]">
              Tarifs en Dinars Tunisiens · Sans Frais Cachés
            </span>
            <h2 className={`${H2} mt-2`}>
              Des formules claires adaptées à votre établissement
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--h-muted)]">
              Rentabilisé dès votre première mise à jour de prix : plus jamais de facture d’imprimerie pour corriger vos tarifs ou lancer votre carte d’été et de Ramadan.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                badge: "Essentiel",
                name: "Menu Digital Clé en Main",
                desc: "Idéal pour les cafés, fast-foods et salons de thé qui souhaitent mettre leur carte en ligne rapidement.",
                features: [
                  "Intégration complète de vos catégories, plats & prix en DT",
                  "Lien web dédié clickmenu.tn/menu/votre-enseigne",
                  "QR code dynamique permanent en haute définition",
                  "Tableau de bord mobile & PC (modifications illimitées)",
                  "Boutons Instagram, Facebook & Google Maps intégrés",
                ],
                cta: "Demander le tarif Essentiel",
                msg: "Bonjour ClickMenu, je souhaite connaître le tarif en DT de la formule Menu Digital Essentiel.",
                featured: false,
              },
              {
                badge: "Le plus choisi en Tunisie",
                name: "Menu Digital + Supports Table",
                desc: "La solution complète livrée prête à poser sur vos tables en salle et en terrasse partout en Tunisie.",
                features: [
                  "Tout le pack Menu Digital Clé en Main inclus",
                  "Conception graphique personnalisée avec votre logo",
                  "Chevalets en bois gravé au laser, plaques acrylique ou stickers laminés",
                  "Numérotation des tables sur mesure sur demande",
                  "Accompagnement prioritaire sur WhatsApp",
                ],
                cta: "Obtenir un devis avec supports",
                msg: "Bonjour ClickMenu, je souhaite un devis pour le Menu Digital + Supports QR de table (bois/acrylique/stickers).",
                featured: true,
              },
              {
                badge: "Gestion Avancée",
                name: "Menu + Commandes & Stock",
                desc: "Pour les restaurants et enseignes souhaitant digitaliser la prise de commande et le suivi d’inventaire.",
                features: [
                  "Tout le pack Menu Digital interactif",
                  "Panier client & envoi des commandes par numéro de table",
                  "Module de gestion de stock, achats et mouvements",
                  "Alertes de seuil critique sur vos ingrédients",
                  "Statistiques de scans QR et suivi d’activité",
                ],
                cta: "Demander une démo Pro",
                msg: "Bonjour ClickMenu, je souhaite une démonstration de la formule Pro (Menu + Commandes à table & Stock).",
                featured: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col justify-between rounded-[2rem] p-8 ${
                  plan.featured
                    ? "border-2 border-[var(--h-ink)] bg-[#111] text-white shadow-2xl"
                    : "border border-[var(--h-line)] bg-white text-[var(--h-ink)] shadow-[0_18px_50px_-28px_rgba(17,17,17,0.35)]"
                }`}
              >
                <div>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider ${
                      plan.featured ? "bg-[var(--h-sun)] text-[#111]" : "bg-[#f6f3ee] text-[var(--h-ink)]"
                    }`}
                  >
                    {plan.badge}
                  </span>
                  <h3 className="mt-4 text-2xl font-extrabold">{plan.name}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${plan.featured ? "text-white/75" : "text-[var(--h-muted)]"}`}>
                    {plan.desc}
                  </p>
                  <ul className="mt-6 space-y-3 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            plan.featured ? "text-[var(--h-sun)]" : "text-[var(--h-terra)]"
                          }`}
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <a
                    href={buildWhatsAppUrl(plan.msg)}
                    target="_blank"
                    rel="noreferrer"
                    data-cta-location={`pricing_card_${plan.badge.toLowerCase().replace(/\s+/g, "_")}`}
                    className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-transform active:scale-[0.98] ${
                      plan.featured
                        ? "bg-[var(--h-sun)] text-[#111] hover:bg-[#f7dc7c]"
                        : "bg-[var(--h-ink)] text-white hover:bg-black"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    {plan.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <QuoteConfigurator />
          </div>
        </div>
      </section>

      {/* ── 10 COMMERCIAL SOLUTIONS HUB (INTERNAL LINKING ARCHITECTURE) ──── */}
      <section id="services" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--h-terra)]">
                Solutions Spécialisées par Métier
              </span>
              <h2 className={`${H2} mt-2`}>
                Explorez nos solutions de digitalisation en Tunisie
              </h2>
            </div>
            <Link
              href="/solutions"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--h-ink)] hover:text-[var(--h-terra)]"
            >
              Comparer toutes nos solutions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMMERCIAL_PAGES.map((page) => (
            <Link
              key={page.slug}
              href={page.path}
              className={`${CARD} group flex flex-col justify-between p-6 transition-all hover:-translate-y-0.5 hover:border-[var(--h-ink)]/20`}
            >
              <div>
                <span className="inline-block rounded-full bg-[var(--h-sun)]/50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[var(--h-ink)]">
                  {page.badge}
                </span>
                <h3 className="mt-3 text-lg font-extrabold text-[var(--h-ink)] group-hover:text-[var(--h-terra)]">
                  {page.shortLabel}
                </h3>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--h-muted)]">
                  {page.metaDescription}
                </p>
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--h-ink)]">
                Découvrir la solution <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BLOG GUIDES PREVIEW ──────────────────────────────────────────── */}
      <section className="bg-white/60 py-20 sm:py-24" aria-labelledby="home-blog-heading">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[var(--h-terra)]">
                <BookOpen className="h-3.5 w-3.5" /> Guides & Conseils Restauration Tunisie
              </span>
              <h2 id="home-blog-heading" className={`${H2} mt-2`}>
                Nos derniers guides pour cafés et restaurants
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--h-ink)] hover:text-[var(--h-terra)]"
            >
              Lire tous les articles du blog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className={`${CARD} group flex flex-col justify-between p-7 transition-transform hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--h-muted)]">
                    <span className="rounded-full bg-[#f6f3ee] px-2.5 py-0.5 text-[var(--h-ink)]">
                      {article.category}
                    </span>
                    <span>· {article.readingTime}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-extrabold leading-snug text-[var(--h-ink)] group-hover:text-[var(--h-terra)]">
                    {article.title}
                  </h3>
                  <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-[var(--h-muted)]">
                    {article.excerpt}
                  </p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--h-ink)]">
                  Lire le guide complet <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="text-center">
          <h2 className={H2}>Questions fréquentes sur le menu digital en Tunisie</h2>
          <p className="mt-3 text-sm text-[var(--h-muted)]">
            Tout savoir avant d’équiper votre café, salon de thé ou restaurant.
          </p>
        </Reveal>
        <div className="mt-10 space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className={`group ${CARD} px-6 py-5`}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--h-sun)] text-lg leading-none transition-transform group-open:rotate-45">
                  +
                </span>
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
              Prêt à moderniser la carte de votre
              <br />
              établissement en <span className="rounded-full bg-[var(--h-sun)] px-4 text-[#111]">48 heures</span> ?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-white/70">
              Envoyez-nous un message sur WhatsApp : notre équipe vous prépare une démonstration personnalisée et répond à toutes vos questions.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={WHATSAPP_BASE}
                target="_blank"
                rel="noreferrer"
                data-cta-location="home_bottom_banner"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-[15px] font-bold text-[#111] transition-transform active:scale-[0.97]"
              >
                <MessageSquare className="h-4 w-4" />
                Nous écrire sur WhatsApp (+216 97 991 266)
              </a>
              <Link
                href="/menu"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/25 px-7 text-[15px] font-bold text-white transition-colors hover:bg-white/10 active:scale-[0.97]"
              >
                Voir les démos en direct
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
