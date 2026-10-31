import { connectDb } from "@/lib/db";
import { Restaurant } from "@/models/Restaurant";
import { RestaurantDirectoryClient } from "@/components/menu/restaurant-directory-client";
import { DUPLICATE_SLUG_CANONICALS, SITE_NAME, SITE_URL } from "@/lib/site";
import { buildNextMetadata, resolvePageSeo } from "@/lib/seo-resolver";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await resolvePageSeo("/menu", {
    title: "Menus digitaux des cafés et restaurants en Tunisie",
    description:
      "Explorez les menus digitaux (QR code) des cafés, restaurants, salons de thé, pâtisseries et fast-foods partenaires de ClickMenu en Tunisie.",
    canonical: `${SITE_URL}/menu`,
  });
  return buildNextMetadata(seo);
}

export default async function RestaurantDirectoryPage() {
  let restaurants: {
    _id: string;
    name: string;
    slug: string;
    establishmentType: string;
    logo?: string;
    coverImage?: string;
    phone?: string;
    address?: string;
    primaryColor: string;
  }[] = [];

  try {
    await connectDb();
    const rawRestaurants = await Restaurant.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    restaurants = rawRestaurants
      .filter((res: any) => !DUPLICATE_SLUG_CANONICALS[String(res.slug)])
      .map((res: any) => ({
        _id: String(res._id),
        name: String(res.name),
        slug: String(res.slug),
        establishmentType: String(res.establishmentType || "restaurant"),
        logo: res.logo ? String(res.logo) : undefined,
        coverImage: res.coverImage ? String(res.coverImage) : undefined,
        phone: res.phone ? String(res.phone) : undefined,
        address: res.address ? String(res.address) : undefined,
        primaryColor: String(res.primaryColor || "#B08D57"),
      }));
  } catch {
    restaurants = [];
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/menu#collection`,
        name: "Menus digitaux des cafés et restaurants partenaires en Tunisie",
        description:
          "Annuaire des établissements partenaires utilisant le menu digital QR code ClickMenu en Tunisie.",
        url: `${SITE_URL}/menu`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: restaurants.map((r, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: r.name,
            url: `${SITE_URL}/menu/${r.slug}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Menus Partenaires", item: `${SITE_URL}/menu` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <RestaurantDirectoryClient initialRestaurants={restaurants} />
    </>
  );
}
