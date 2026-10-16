import type { MetadataRoute } from "next";
import { connectDb } from "@/lib/db";
import { Restaurant } from "@/models/Restaurant";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/menu`, changeFrequency: "daily", priority: 0.9 },
  ];

  try {
    await connectDb();
    const restaurants = await Restaurant.find({ isActive: { $ne: false } }, { slug: 1, updatedAt: 1 }).lean();
    for (const r of restaurants) {
      entries.push({
        url: `${SITE_URL}/menu/${r.slug}`,
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
