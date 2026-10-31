import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Navbar } from "@/components/home/Navbar";
import { QuoteConfigurator } from "@/components/home/QuoteConfigurator";
import { SiteFooter } from "@/components/home/SiteFooter";
import { COMMERCIAL_PAGES } from "@/lib/commercial-pages";
import { SITE_NAME, SITE_URL, WHATSAPP_BASE } from "@/lib/site";
import { buildNextMetadata, resolvePageSeo } from "@/lib/seo-resolver";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await resolvePageSeo("/solutions", {
    title: "Solutions Menu Digital & QR Code pour Cafés et Restaurants en Tunisie",
    description:
      "Découvrez toutes les solutions ClickMenu en Tunisie : menu QR code sans application, carte digitale restaurant et café, menu multilingue, supports bois gravé et tarifs en DT.",
    canonical: `${SITE_URL}/solutions`,
  });
  return buildNextMetadata(seo);
}

export default function SolutionsHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/solutions#collection`,
        name: "Solutions Menu Digital & QR Code en Tunisie",
        url: `${SITE_URL}/solutions`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: COMMERCIAL_PAGES.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.seoTitle,
            url: `${SITE_URL}${p.path}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/solutions` },
        ],
      },
    ],
  };

  return (
    <div className="home-root home-bg relative min-h-screen overflow-x-clip text-[var(--h-ink)] antialiased [font-family:var(--font-body),system-ui,sans-serif]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar />

      <header className="mx-auto max-w-4xl px-5 pt-28 pb-16 text-center sm:px-8 sm:pt-36">
        <nav aria-label="Fil d’Ariane" className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold text-[var(--h-muted)]">
          <Link href="/" className="hover:text-[var(--h-ink)]">Accueil</Link>
          <span>/</span>
          <span className="text-[var(--h-ink)]">Solutions</span>
        </nav>
        <h1 className="text-[2.3rem] font-extrabold leading-[1.12] tracking-tight sm:text-5xl">
          Toutes nos solutions de{" "}
          <span className="relative isolate inline-block px-3 sm:px-4">
            <span className="absolute inset-y-[6%] left-0 right-0 -z-10 rounded-[999px] bg-[var(--h-sun)]" />
            menu digital
          </span>{" "}
          en Tunisie
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[var(--h-ink)]/80 sm:text-lg">
          Que vous dirigiez un café, un salon de thé, une pizzeria, un restaurant gastronomique ou un lounge touristique, explorez la solution adaptée à votre activité.
        </p>
      </header>

      <main className="mx-auto max-w-6xl space-y-20 px-5 pb-24 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COMMERCIAL_PAGES.map((page) => (
            <Link
              key={page.slug}
              href={page.path}
              className="group flex flex-col justify-between rounded-[1.75rem] border border-[var(--h-line)] bg-white p-7 shadow-[0_18px_50px_-28px_rgba(17,17,17,0.35)] transition-transform hover:-translate-y-1"
            >
              <div>
                <span className="inline-block rounded-full bg-[var(--h-sun)]/60 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[var(--h-ink)]">
                  {page.badge}
                </span>
                <h2 className="mt-4 text-xl font-extrabold leading-snug text-[var(--h-ink)] group-hover:text-[var(--h-terra)]">
                  {page.shortLabel}
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--h-muted)]">
                  {page.metaDescription}
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--h-ink)]">
                Consulter la page détaillée <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <QuoteConfigurator />

        <div className="rounded-[2rem] bg-[#111] p-8 text-center text-white sm:p-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Besoin d’un conseil personnalisé pour votre établissement ?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70">
            Écrivez-nous directement sur WhatsApp pour recevoir une démonstration en direct et un devis adapté à votre carte.
          </p>
          <a
            href={WHATSAPP_BASE}
            target="_blank"
            rel="noreferrer"
            data-cta-location="solutions_hub_bottom"
            className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-bold text-[#111]"
          >
            <MessageSquare className="h-4 w-4" />
            Discuter sur WhatsApp
          </a>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

