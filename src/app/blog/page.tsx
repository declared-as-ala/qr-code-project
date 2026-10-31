import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Clock, MessageSquare } from "lucide-react";
import { Navbar } from "@/components/home/Navbar";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SITE_NAME, SITE_URL, WHATSAPP_BASE } from "@/lib/site";
import { buildNextMetadata, getResolvedBlogArticles, resolvePageSeo } from "@/lib/seo-resolver";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await resolvePageSeo("/blog", {
    title: "Blog & Guides Menu Digital pour Cafés et Restaurants en Tunisie",
    description:
      "Conseils pratiques, études de rentabilité en dinars (DT), ingénierie de menu et guides sur le menu QR code pour les cafés, salons de thé et restaurants en Tunisie.",
    canonical: `${SITE_URL}/blog`,
  });
  return buildNextMetadata(seo);
}

export default async function BlogIndexPage() {
  const allArticles = await getResolvedBlogArticles();
  const published = allArticles.filter((a) => a.status === "published");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${SITE_URL}/blog#blog`,
        name: "Blog ClickMenu — Digitalisation des Cafés & Restaurants en Tunisie",
        description:
          "Ressources et guides pratiques sur les menus digitaux QR code, la gestion de carte et la rentabilité des restaurants en Tunisie.",
        url: `${SITE_URL}/blog`,
        inLanguage: "fr-TN",
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: SITE_NAME,
          url: SITE_URL,
        },
        blogPost: published.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          url: `${SITE_URL}/blog/${post.slug}`,
          datePublished: post.publishedAt,
          description: post.excerpt,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
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

      <header className="mx-auto max-w-4xl px-5 pt-28 pb-14 text-center sm:px-8 sm:pt-36">
        <nav aria-label="Fil d’Ariane" className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold text-[var(--h-muted)]">
          <Link href="/" className="hover:text-[var(--h-ink)]">Accueil</Link>
          <span>/</span>
          <span className="text-[var(--h-ink)]">Blog</span>
        </nav>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--h-line)] bg-white px-4 py-1.5 text-xs font-bold text-[var(--h-ink)]">
          <BookOpen className="h-3.5 w-3.5 text-[var(--h-terra)]" />
          Guides Pratiques Restauration & Cafés en Tunisie
        </span>

        <h1 className="mt-5 text-[2.3rem] font-extrabold leading-[1.12] tracking-tight sm:text-5xl">
          Le Blog{" "}
          <span className="relative isolate inline-block px-3 sm:px-4">
            <span className="absolute inset-y-[6%] left-0 right-0 -z-10 rounded-[999px] bg-[var(--h-sun)]" />
            ClickMenu
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[var(--h-ink)]/80 sm:text-lg">
          Analyses concrètes en dinars tunisiens, conseils d’ingénierie de carte, choix des supports QR de table et bonnes pratiques pour développer le chiffre d’affaires de votre établissement.
        </p>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {published.map((article) => (
            <article
              key={article.slug}
              className="group flex flex-col justify-between rounded-[1.75rem] border border-[var(--h-line)] bg-white p-7 shadow-[0_18px_50px_-28px_rgba(17,17,17,0.35)] transition-transform hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs font-bold text-[var(--h-muted)]">
                  <span className="rounded-full bg-[#f6f3ee] px-3 py-1 text-[11px] text-[var(--h-ink)]">
                    {article.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {article.readingTime}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-extrabold leading-snug text-[var(--h-ink)] group-hover:text-[var(--h-terra)]">
                  <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-[var(--h-muted)]">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-6 border-t border-[var(--h-line)] pt-4">
                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[var(--h-ink)] group-hover:text-[var(--h-terra)]"
                >
                  Lire l’article complet <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-[2rem] bg-[#111] p-8 text-center text-white sm:p-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Vous souhaitez lancer le menu digital de votre établissement en 48h ?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70">
            Contactez notre équipe en Tunisie sur WhatsApp pour obtenir une démo personnalisée et votre devis en dinars.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={WHATSAPP_BASE}
              target="_blank"
              rel="noreferrer"
              data-cta-location="blog_index_bottom"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-bold text-[#111]"
            >
              <MessageSquare className="h-4 w-4" />
              Demander une démo sur WhatsApp
            </a>
            <Link
              href="/prix-menu-digital-tunisie"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/25 px-6 text-sm font-bold text-white hover:bg-white/10"
            >
              Consulter nos tarifs en DT
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

