import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDb } from "@/lib/db";
import { Restaurant } from "@/models/Restaurant";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { ScanAnalytics } from "@/models/ScanAnalytics";
import { PublicMenuClient } from "@/components/menu/public-menu-client";
import { buildRestaurantJsonLd, groupMenu } from "@/lib/menu-seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  await connectDb();
  const { slug } = await params;
  const restaurant = await Restaurant.findOne({ slug }).lean();
  if (!restaurant) return { title: "Menu introuvable", robots: { index: false, follow: false } };
  const image = restaurant.coverImage || restaurant.logo;
  const title = `Menu ${restaurant.name} : carte, prix et produits`;
  const where = restaurant.address ? ` à ${restaurant.address}` : " en Tunisie";
  const description = `Menu digital de ${restaurant.name}${where} : carte complète, produits et prix à jour. Consultez le menu en ligne sur votre téléphone.`;
  return {
    title,
    description,
    robots: restaurant.isActive === false ? { index: false, follow: false } : undefined,
    alternates: { canonical: `/menu/${slug}` },
    openGraph: { type: "website", locale: "fr_TN", title, description, url: `/menu/${slug}`, ...(image ? { images: [{ url: image }] } : {}) },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, ...(image ? { images: [image] } : {}) },
  };
}

export default async function PublicMenuPage({ params }: { params: Promise<{ slug: string }> }) {
  await connectDb();
  const { slug } = await params;
  const restaurant = await Restaurant.findOne({ slug }).lean();

  if (!restaurant) notFound();

  await ScanAnalytics.create({ restaurantId: restaurant._id });

  const categories = await Category.find({ restaurantId: restaurant._id, isActive: true }).sort({ sortOrder: 1 }).lean();
  const products = await Product.find({ restaurantId: restaurant._id }).sort({ sortOrder: 1 }).lean();

  const categoryList = categories.map((c) => ({ _id: String(c._id), name: c.name, description: c.description }));
  const productList = products.map((p) => ({
    _id: String(p._id),
    categoryId: String(p.categoryId),
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.image,
    badge: p.badge,
    supplements: (p.supplements ?? []).map((s: { name: string; price: number }) => ({ name: s.name, price: s.price })),
    isAvailable: p.isAvailable,
  }));
  const showPrices = restaurant.showPrices !== false;
  const jsonLd = buildRestaurantJsonLd(
    {
      name: restaurant.name,
      slug,
      establishmentType: restaurant.establishmentType,
      logo: restaurant.logo,
      coverImage: restaurant.coverImage,
      phone: restaurant.phone,
      address: restaurant.address,
      instagram: restaurant.instagram,
      facebook: restaurant.facebook,
      googleMapsUrl: restaurant.googleMapsUrl,
    },
    categoryList,
    productList,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PublicMenuClient
        restaurantSlug={slug}
        restaurant={{
          name: restaurant.name,
          logo: restaurant.logo,
          coverImage: restaurant.coverImage,
          phone: restaurant.phone,
          address: restaurant.address,
          googleMapsUrl: restaurant.googleMapsUrl,
          primaryColor: restaurant.primaryColor,
          instagram: restaurant.instagram,
          facebook: restaurant.facebook,
          showPrices,
          logoBg: (restaurant as any).logoBg,
        }}
        categories={categoryList}
        products={productList}
      />
      {/* Crawlable, text-only copy of the menu. The visual menu opens behind a welcome screen, so
          without this a search engine would only see the welcome page. Mirrors the visible menu. */}
      <section className="sr-only" aria-label={`Menu de ${restaurant.name}`}>
        <h1>Menu {restaurant.name}</h1>
        {groupMenu(categoryList, productList).map((c) => (
          <div key={c._id}>
            <h2>{c.name}</h2>
            <ul>
              {c.items.map((p) => (
                <li key={p._id}>
                  {p.name}
                  {p.description ? ` — ${p.description}` : ""}
                  {showPrices ? ` : ${Number(p.price).toFixed(3)} DT` : ""}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}
