import type { MetadataRoute } from "next";
import { connectDb } from "@/lib/db";
import { Restaurant } from "@/models/Restaurant";
import { SeoPageConfig } from "@/models/SeoPageConfig";
import { DUPLICATE_SLUG_CANONICALS, SITE_URL } from "@/lib/site";
import { COMMERCIAL_PAGES } from "@/lib/commercial-pages";
import { getResolvedBlogArticles } from "@/lib/seo-resolver";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pageConfigMap = new Map<string, { indexable?: boolean; includeInSitemap?: boolean }>();

  try {
    await connectDb();
    const configs = await SeoPageConfig.find().lean();
    for (const c of configs) {
      pageConfigMap.set(String(c.path), {
        indexable: c.indexable,
        includeInSitemap: c.includeInSitemap,
      });
    }
  } catch {
    // DB unreachable at build time: fall back to static configuration
  }

  const shouldIncludePath = (path: string) => {
    const cfg = pageConfigMap.get(path);
    if (!cfg) return true;
    return cfg.indexable !== false && cfg.includeInSitemap !== false;
  };

  const entries: MetadataRoute.Sitemap = [];

  if (shouldIncludePath("/")) {
    entries.push({ url: SITE_URL, changeFrequency: "weekly", priority: 1.0 });
  }

  if (shouldIncludePath("/solutions")) {
    entries.push({ url: `${SITE_URL}/solutions`, changeFrequency: "weekly", priority: 0.9 });
  }

  for (const page of COMMERCIAL_PAGES) {
    if (shouldIncludePath(page.path)) {
      entries.push({
        url: `${SITE_URL}${page.path}`,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
  }

  if (shouldIncludePath("/menu")) {
    entries.push({ url: `${SITE_URL}/menu`, changeFrequency: "daily", priority: 0.85 });
  }

  if (shouldIncludePath("/blog")) {
    entries.push({ url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.85 });
  }

  // Published & indexable blog articles
  const blogArticles = await getResolvedBlogArticles();
  for (const article of blogArticles) {
    if (article.status === "published" && article.indexable && article.includeInSitemap) {
      entries.push({
        url: `${SITE_URL}/blog/${article.slug}`,
        lastModified: new Date(article.publishedAt),
        changeFrequency: "monthly",
        priority: 0.75,
      });
    }
  }

  // Active & indexable partner restaurants (excluding duplicate test slugs)
  try {
    await connectDb();
    const restaurants = await Restaurant.find(
      { isActive: { $ne: false } },
      { slug: 1, updatedAt: 1, indexable: 1, includeInSitemap: 1 }
    ).lean();

    for (const r of restaurants) {
      const slug = String(r.slug);
      if (DUPLICATE_SLUG_CANONICALS[slug]) continue;
      if ((r as any).indexable === false || (r as any).includeInSitemap === false) continue;

      entries.push({
        url: `${SITE_URL}/menu/${slug}`,
        lastModified: r.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch {
    // DB unreachable at build time: ship the static entries rather than failing the build.
  }

  return entries;
}
