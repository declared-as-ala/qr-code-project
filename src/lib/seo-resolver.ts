import type { Metadata } from "next";
import { connectDb } from "@/lib/db";
import { SeoPageConfig } from "@/models/SeoPageConfig";
import { BlogPost } from "@/models/BlogPost";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { BLOG_ARTICLES, type BlogArticle } from "@/lib/blog-data";

export interface ResolvedPageSeo {
  title: string;
  description: string;
  canonical: string;
  indexable: boolean;
  includeInSitemap: boolean;
  ogImage?: string;
}

export async function resolvePageSeo(
  path: string,
  defaults: {
    title: string;
    description: string;
    canonical?: string;
    indexable?: boolean;
    includeInSitemap?: boolean;
    ogImage?: string;
  }
): Promise<ResolvedPageSeo> {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  let override: {
    seoTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    indexable?: boolean;
    includeInSitemap?: boolean;
    ogImage?: string;
  } | null = null;

  try {
    await connectDb();
    override = await SeoPageConfig.findOne({ path: cleanPath }).lean();
  } catch {
    // Graceful fallback when DB is unavailable at build time
  }

  return {
    title: override?.seoTitle?.trim() || defaults.title,
    description: override?.metaDescription?.trim() || defaults.description,
    canonical: override?.canonicalUrl?.trim() || defaults.canonical || cleanPath,
    indexable: override?.indexable ?? defaults.indexable ?? true,
    includeInSitemap: override?.includeInSitemap ?? defaults.includeInSitemap ?? true,
    ogImage: override?.ogImage?.trim() || defaults.ogImage,
  };
}

export function buildNextMetadata(seo: ResolvedPageSeo, absoluteTitle = false): Metadata {
  const canonicalUrl = seo.canonical.startsWith("http")
    ? seo.canonical
    : `${SITE_URL}${seo.canonical.startsWith("/") ? seo.canonical : `/${seo.canonical}`}`;

  const images = seo.ogImage
    ? [{ url: seo.ogImage, width: 1200, height: 630, alt: seo.title }]
    : undefined;

  return {
    title: absoluteTitle ? { absolute: seo.title } : seo.title,
    description: seo.description,
    alternates: { canonical: canonicalUrl },
    robots: seo.indexable
      ? {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
        }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "fr_TN",
      siteName: SITE_NAME,
      url: canonicalUrl,
      title: seo.title,
      description: seo.description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      ...(seo.ogImage ? { images: [seo.ogImage] } : {}),
    },
  };
}

// Merge static 30-article editorial plan with any Admin SEO overrides stored in MongoDB
export async function getResolvedBlogArticles(): Promise<BlogArticle[]> {
  try {
    await connectDb();
    const dbPosts = await BlogPost.find().lean();
    if (!dbPosts.length) return BLOG_ARTICLES;

    const map = new Map(dbPosts.map((p: any) => [String(p.slug), p]));
    return BLOG_ARTICLES.map((article) => {
      const db = map.get(article.slug);
      if (!db) return article;
      return {
        ...article,
        title: db.title?.trim() || article.title,
        excerpt: db.excerpt?.trim() || article.excerpt,
        seoTitle: db.seoTitle?.trim() || article.seoTitle,
        metaDescription: db.metaDescription?.trim() || article.metaDescription,
        status: (db.status as "published" | "draft") || article.status,
        indexable: typeof db.indexable === "boolean" ? db.indexable : article.indexable,
        includeInSitemap:
          typeof db.includeInSitemap === "boolean" ? db.includeInSitemap : article.includeInSitemap,
      };
    });
  } catch {
    return BLOG_ARTICLES;
  }
}

