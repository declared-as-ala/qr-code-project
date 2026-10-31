import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock, MessageSquare } from "lucide-react";
import { Navbar } from "@/components/home/Navbar";
import { SiteFooter } from "@/components/home/SiteFooter";
import { COMMERCIAL_PAGES } from "@/lib/commercial-pages";
import { buildWhatsAppUrl, SITE_NAME, SITE_URL } from "@/lib/site";
import { buildNextMetadata, getResolvedBlogArticles } from "@/lib/seo-resolver";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const articles = await getResolvedBlogArticles();
  const article = articles.find((a) => a.slug === slug);

  if (!article || article.status !== "published") {
    return {
      title: "Article introuvable",
      robots: { index: false, follow: false },
    };
  }

  return buildNextMetadata({
    title: article.seoTitle,
    description: article.metaDescription,
    canonical: `${SITE_URL}/blog/${article.slug}`,
    indexable: article.indexable,
    includeInSitemap: article.includeInSitemap,
  });
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = await getResolvedBlogArticles();
  const article = articles.find((a) => a.slug === slug);

  // Publish only articles that are vetted and marked as "published"
  if (!article || article.status !== "published") {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/blog/${article.slug}`;
  const relatedCommercial = COMMERCIAL_PAGES.filter((p) =>
    article.relatedCommercialSlugs.includes(p.slug)
  );
  const otherArticles = articles
    .filter((a) => a.status === "published" && a.slug !== article.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${canonicalUrl}#article`,
        headline: article.title,
        description: article.metaDescription,
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        inLanguage: "fr-TN",
        mainEntityOfPage: canonicalUrl,
        author: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: SITE_NAME,
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: SITE_NAME,
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/logos/clickmenu-mark-512.png`,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: article.title, item: canonicalUrl },
        ],
      },
      ...(article.faqs && article.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${canonicalUrl}#faq`,
              mainEntity: article.faqs.map((f) => ({
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

      <main className="mx-auto max-w-4xl px-5 pt-28 pb-24 sm:px-8 sm:pt-36">
        <nav
          aria-label="Fil d’Ariane"
          className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--h-muted)]"
        >
          <Link href="/" className="hover:text-[var(--h-ink)]">
            Accueil
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[var(--h-ink)]">
            Blog
          </Link>
          <span>/</span>
          <span className="line-clamp-1 text-[var(--h-ink)]">{article.title}</span>
        </nav>

        <article className="rounded-[2rem] border border-[var(--h-line)] bg-white p-6 shadow-[0_18px_50px_-28px_rgba(17,17,17,0.35)] sm:p-12">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[var(--h-muted)]">
            <span className="rounded-full bg-[var(--h-sun)] px-3.5 py-1 text-[var(--h-ink)]">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> Lecture {article.readingTime}
            </span>
            <span>· Marché : Tunisie</span>
          </div>

          <h1 className="mt-5 text-2xl font-extrabold leading-tight tracking-tight text-[var(--h-ink)] sm:text-4xl">
            {article.title}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-[var(--h-muted)] sm:text-lg">
            {article.excerpt}
          </p>

          {/* Key Takeaways Box */}
          {article.keyTakeaways.length > 0 && (
            <div className="mt-8 rounded-2xl bg-[#f6f3ee] p-6">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--h-ink)]">
                L’essentiel à retenir
              </p>
              <ul className="mt-3 space-y-2.5 text-sm font-medium text-[var(--h-ink)]">
                {article.keyTakeaways.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--h-terra)]" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Article Body Sections */}
          <div className="mt-10 space-y-10">
            {article.sections.map((sec) => (
              <section key={sec.h2} className="space-y-4">
                <h2 className="text-xl font-extrabold leading-snug text-[var(--h-ink)] sm:text-2xl">
                  {sec.h2}
                </h2>
                {sec.paragraphs.map((p, idx) => (
                  <p key={idx} className="text-[15px] leading-relaxed text-[var(--h-ink)]/85">
                    {p}
                  </p>
                ))}
                {sec.bullets && sec.bullets.length > 0 && (
                  <ul className="mt-3 space-y-2 pl-1 text-sm text-[var(--h-ink)]/85">
                    {sec.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--h-terra)]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {sec.tip && (
                  <div className="rounded-xl border-l-4 border-[var(--h-sun)] bg-[#fbfaf7] p-4 text-sm font-medium text-[var(--h-ink)]">
                    <strong>Conseil terrain :</strong> {sec.tip}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Article FAQs */}
          {article.faqs && article.faqs.length > 0 && (
            <div className="mt-12 border-t border-[var(--h-line)] pt-8">
              <h2 className="text-xl font-extrabold text-[var(--h-ink)]">
                Questions fréquentes
              </h2>
              <div className="mt-4 space-y-3">
                {article.faqs.map((f) => (
                  <div key={f.q} className="rounded-2xl bg-[#f6f3ee]/70 p-5">
                    <h3 className="text-sm font-extrabold text-[var(--h-ink)]">{f.q}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--h-muted)]">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conversion CTA inside Article */}
          <div className="mt-12 rounded-2xl bg-[#111] p-7 text-white sm:p-9">
            <h2 className="text-xl font-extrabold sm:text-2xl">
              Passez au menu digital QR code en 48 heures avec ClickMenu
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Nous intégrons toute votre carte (catégories, plats, photos et prix en dinars) et vous livrons votre QR code permanent ainsi que vos supports de table partout en Tunisie.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={buildWhatsAppUrl(
                  `Bonjour ClickMenu, j'ai lu votre article "${article.title}" et je souhaite une démo pour mon établissement.`
                )}
                target="_blank"
                rel="noreferrer"
                data-cta-location={`blog_article_cta_${article.slug}`}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--h-sun)] px-6 text-sm font-bold text-[#111]"
              >
                <MessageSquare className="h-4 w-4" />
                Demander ma démo sur WhatsApp
              </a>
              <Link
                href="/menu"
                className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-white/25 px-5 text-sm font-bold text-white hover:bg-white/10"
              >
                Voir les menus partenaires
              </Link>
            </div>
          </div>
        </article>

        {/* Related Commercial Pages */}
        {relatedCommercial.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-extrabold text-[var(--h-ink)]">
              Solutions ClickMenu en lien avec ce sujet
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {relatedCommercial.map((page) => (
                <Link
                  key={page.slug}
                  href={page.path}
                  className="group flex flex-col justify-between rounded-2xl border border-[var(--h-line)] bg-white p-5 transition-colors hover:border-[var(--h-ink)]/40"
                >
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--h-terra)]">
                      {page.badge}
                    </span>
                    <h3 className="mt-1 text-base font-extrabold text-[var(--h-ink)] group-hover:text-[var(--h-terra)]">
                      {page.shortLabel}
                    </h3>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[var(--h-ink)]">
                    Voir la solution <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Other Published Articles */}
        {otherArticles.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-[var(--h-ink)]">
                Autres guides pour votre établissement
              </h2>
              <Link href="/blog" className="inline-flex items-center gap-1 text-xs font-bold text-[var(--h-ink)] hover:text-[var(--h-terra)]">
                <ArrowLeft className="h-3.5 w-3.5" /> Tous les articles
              </Link>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {otherArticles.map((other) => (
                <Link
                  key={other.slug}
                  href={`/blog/${other.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-[var(--h-line)] bg-white p-5 transition-colors hover:border-[var(--h-ink)]/40"
                >
                  <div>
                    <span className="text-[11px] font-bold text-[var(--h-muted)]">{other.category}</span>
                    <h3 className="mt-1.5 text-sm font-extrabold leading-snug text-[var(--h-ink)] group-hover:text-[var(--h-terra)]">
                      {other.title}
                    </h3>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[var(--h-ink)]">
                    Lire <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

