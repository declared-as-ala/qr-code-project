import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BookOpen,
  Check,
  ExternalLink,
  MessageSquare,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Navbar } from "@/components/home/Navbar";
import { QuoteConfigurator } from "@/components/home/QuoteConfigurator";
import { SiteFooter } from "@/components/home/SiteFooter";
import {
  COMMERCIAL_PAGES,
  getCommercialPageBySlug,
  type CommercialPageData,
} from "@/lib/commercial-pages";
import { getBlogArticleBySlug } from "@/lib/blog-data";
import {
  buildWhatsAppUrl,
  SITE_NAME,
  SITE_URL,
  VERIFIED_PARTNER_EXAMPLES,
} from "@/lib/site";
import { buildNextMetadata, resolvePageSeo } from "@/lib/seo-resolver";

export async function generateCommercialPageMetadata(slug: string): Promise<Metadata> {
  const page = getCommercialPageBySlug(slug);
  if (!page) return { title: SITE_NAME };

  const seo = await resolvePageSeo(page.path, {
    title: page.seoTitle,
    description: page.metaDescription,
    canonical: `${SITE_URL}${page.path}`,
  });

  return buildNextMetadata(seo);
}

export function CommercialLandingTemplate({ page }: { page: CommercialPageData }) {
  const canonicalUrl = `${SITE_URL}${page.path}`;
  const whatsappUrl = buildWhatsAppUrl(page.whatsappPrefill);

  const featuredPartners = VERIFIED_PARTNER_EXAMPLES.filter((p) =>
    page.featuredPartners.includes(p.slug)
  );
  const relatedPages = COMMERCIAL_PAGES.filter((p) =>
    page.relatedPageSlugs.includes(p.slug)
  );
  const relatedBlogs = page.relatedBlogSlugs
    .map((s) => getBlogArticleBySlug(s))
    .filter((b): b is NonNullable<typeof b> => Boolean(b && b.status === "published"));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${canonicalUrl}#service`,
        name: page.seoTitle,
        serviceType: page.primaryKeyword,
        description: page.metaDescription,
        url: canonicalUrl,
        provider: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: SITE_NAME,
          url: SITE_URL,
        },
        areaServed: {
          "@type": "Country",
          name: "Tunisie",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/solutions` },
          { "@type": "ListItem", position: 3, name: page.shortLabel, item: canonicalUrl },
        ],
      },
      ...(page.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${canonicalUrl}#faq`,
              mainEntity: page.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <div className="home-root home-bg relative min-h-screen overflow-x-clip text-[var(--h-ink)] antialiased [font-family:var(--font-body),system-ui,sans-serif]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <header className="mx-auto max-w-4xl px-5 pt-28 pb-16 text-center sm:px-8 sm:pt-36 sm:pb-20">
        <nav
          aria-label="Fil d’Ariane"
          className="mb-5 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-[var(--h-muted)]"
        >
          <Link href="/" className="hover:text-[var(--h-ink)]">
            Accueil
          </Link>
          <span>/</span>
          <Link href="/solutions" className="hover:text-[var(--h-ink)]">
            Solutions
          </Link>
          <span>/</span>
          <span className="text-[var(--h-ink)]">{page.shortLabel}</span>
        </nav>

        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--h-line)] bg-white px-4 py-1.5 text-xs font-bold text-[var(--h-ink)] shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-[var(--h-terra)]" />
          {page.badge}
        </span>

        <h1 className="mt-5 text-[2.2rem] font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.5rem]">
          <span className="relative isolate inline-block px-3 sm:px-4">
            <span className="absolute inset-y-[6%] left-0 right-0 -z-10 rounded-[999px] bg-[var(--h-sun)]" />
            {page.h1Highlight}
          </span>{" "}
          {page.h1Rest}
        </h1>

        {page.arabicSubtitle && (
          <p className="mt-3 text-sm font-semibold text-[var(--h-muted)]" dir="rtl" lang="ar">
            {page.arabicSubtitle}
          </p>
        )}

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--h-ink)]/80 sm:text-lg">
          {page.heroLead}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            data-cta-location={`commercial_hero_${page.slug}`}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--h-ink)] px-7 text-[15px] font-bold text-white transition-transform hover:bg-black active:scale-[0.97]"
          >
            <MessageSquare className="h-4 w-4 text-[var(--h-sun)]" />
            Demander une démo sur WhatsApp
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <Link
            href="/menu"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[var(--h-ink)]/15 bg-white px-7 text-[15px] font-bold text-[var(--h-ink)] transition-colors hover:border-[var(--h-ink)]/40"
          >
            Voir les menus clients en direct
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-24 px-5 pb-24 sm:px-8">
        {/* ── 3 KEY BENEFITS ─────────────────────────────────────────────── */}
        <section aria-label="Avantages principaux">
          <div className="grid gap-6 md:grid-cols-3">
            {page.keyBenefits.map((b, idx) => (
              <div
                key={b.title}
                className="rounded-[1.75rem] border border-[var(--h-line)] bg-white p-7 shadow-[0_18px_50px_-28px_rgba(17,17,17,0.35)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--h-sun)] text-sm font-extrabold">
                  0{idx + 1}
                </span>
                <h2 className="mt-5 text-lg font-extrabold leading-snug text-[var(--h-ink)]">
                  {b.title}
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--h-muted)]">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── DETAILED H2 / H3 CONTENT SECTIONS ──────────────────────────── */}
        {page.sections.map((sec) => (
          <section
            key={sec.h2}
            className="rounded-[2rem] border border-[var(--h-line)] bg-white p-7 shadow-[0_18px_50px_-28px_rgba(17,17,17,0.3)] sm:p-11"
          >
            <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-[var(--h-ink)] sm:text-3xl">
              {sec.h2}
            </h2>
            <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[var(--h-ink)]/80">
              {sec.intro}
            </p>

            {sec.bullets && sec.bullets.length > 0 && (
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {sec.bullets.map((item) => (
                  <div key={item.title} className="rounded-2xl bg-[#f6f3ee]/80 p-5">
                    <h3 className="flex items-start gap-2 text-base font-extrabold text-[var(--h-ink)]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--h-terra)]" />
                      <span>{item.title}</span>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--h-muted)]">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {sec.callout && (
              <div className="mt-8 rounded-2xl bg-[#111] p-6 text-white sm:p-8">
                <h3 className="text-lg font-extrabold text-[var(--h-sun)]">
                  {sec.callout.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  {sec.callout.text}
                </p>
                {sec.callout.arabicNote && (
                  <p className="mt-3 text-xs font-semibold text-white/70" dir="rtl" lang="ar">
                    {sec.callout.arabicNote}
                  </p>
                )}
              </div>
            )}
          </section>
        ))}

        {/* ── COMPARISON TABLE ───────────────────────────────────────────── */}
        <section className="rounded-[2rem] bg-[#111] p-7 text-white sm:p-11">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {page.comparisonTitle}
          </h2>
          <p className="mt-2 text-sm text-white/65">
            Comparatif concret pour les cafés, salons de thé et restaurants en Tunisie.
          </p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/15 text-xs font-extrabold uppercase tracking-wider text-white/60">
                  <th className="py-3.5 pr-4">Critère</th>
                  <th className="py-3.5 px-4">Carte Papier / PDF classique</th>
                  <th className="py-3.5 pl-4 text-[var(--h-sun)]">Avec ClickMenu.tn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {page.comparisonRows.map((row) => (
                  <tr key={row.criterion}>
                    <td className="py-4 pr-4 font-bold text-white">{row.criterion}</td>
                    <td className="py-4 px-4 text-white/70">
                      <span className="inline-flex items-start gap-2">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                        <span>{row.paperOrPdf}</span>
                      </span>
                    </td>
                    <td className="py-4 pl-4 font-semibold text-white">
                      <span className="inline-flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--h-sun)]" />
                        <span>{row.clickMenu}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── REAL VERIFIED CLIENT EXAMPLES ──────────────────────────────── */}
        {featuredPartners.length > 0 && (
          <section aria-labelledby="verified-examples-heading">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--h-terra)]">
                  Exemples réels en ligne
                </span>
                <h2 id="verified-examples-heading" className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Testez ces menus digitaux partenaires sur votre téléphone
                </h2>
              </div>
              <Link
                href="/menu"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--h-ink)] hover:text-[var(--h-terra)]"
              >
                Voir tout l’annuaire <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPartners.map((partner) => (
                <Link
                  key={partner.slug}
                  href={`/menu/${partner.slug}`}
                  className="group flex flex-col justify-between rounded-[1.75rem] border border-[var(--h-line)] bg-white p-6 shadow-sm transition-transform hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#f6f3ee] px-3 py-1 text-[11px] font-bold">
                        {partner.type}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--h-terra)]">
                        Tester en direct <ExternalLink className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-extrabold">{partner.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--h-muted)]">
                      {partner.highlight}
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[var(--h-ink)]">
                    Ouvrir /menu/{partner.slug} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── QUOTE CONFIGURATOR ─────────────────────────────────────────── */}
        <section aria-label="Demande de devis et démo">
          <QuoteConfigurator />
        </section>

        {/* ── FAQ ────────────────────────────────────────────────────────── */}
        {page.faqs.length > 0 && (
          <section className="mx-auto max-w-3xl" aria-labelledby="page-faq-heading">
            <h2 id="page-faq-heading" className="text-center text-2xl font-extrabold tracking-tight sm:text-3xl">
              Questions fréquentes — {page.shortLabel}
            </h2>
            <div className="mt-8 space-y-3">
              {page.faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-[1.5rem] border border-[var(--h-line)] bg-white px-6 py-5 shadow-sm"
                >
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
        )}

        {/* ── INTERNAL LINKS: RELATED COMMERCIAL PAGES & BLOG ARTICLES ──── */}
        <section className="grid gap-8 border-t border-[var(--h-line)] pt-12 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--h-ink)]">
              Solutions complémentaires ClickMenu
            </h2>
            <div className="mt-4 grid gap-3">
              {relatedPages.map((rp) => (
                <Link
                  key={rp.slug}
                  href={rp.path}
                  className="group flex items-center justify-between rounded-2xl border border-[var(--h-line)] bg-white p-4 transition-colors hover:border-[var(--h-ink)]/40"
                >
                  <div>
                    <p className="text-sm font-extrabold text-[var(--h-ink)] group-hover:text-[var(--h-terra)]">
                      {rp.shortLabel}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-[var(--h-muted)]">
                      {rp.metaDescription}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[var(--h-muted)] group-hover:translate-x-0.5 group-hover:text-[var(--h-ink)]" />
                </Link>
              ))}
            </div>
          </div>

          {relatedBlogs.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-[var(--h-ink)]">
                <BookOpen className="h-4 w-4 text-[var(--h-terra)]" />
                Guides & articles associés
              </h2>
              <div className="mt-4 grid gap-3">
                {relatedBlogs.map((blog) => (
                  <Link
                    key={blog.slug}
                    href={`/blog/${blog.slug}`}
                    className="group flex items-center justify-between rounded-2xl border border-[var(--h-line)] bg-white p-4 transition-colors hover:border-[var(--h-ink)]/40"
                  >
                    <div>
                      <p className="text-sm font-extrabold text-[var(--h-ink)] group-hover:text-[var(--h-terra)]">
                        {blog.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--h-muted)]">
                        {blog.category} · Lecture {blog.readingTime}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[var(--h-muted)] group-hover:translate-x-0.5 group-hover:text-[var(--h-ink)]" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

