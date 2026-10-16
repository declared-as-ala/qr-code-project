import { SITE_URL } from "@/lib/site";

type R = {
  name: string;
  slug: string;
  establishmentType?: string;
  logo?: string;
  coverImage?: string;
  phone?: string;
  address?: string;
  instagram?: string;
  facebook?: string;
  googleMapsUrl?: string;
};
type C = { _id: string; name: string; description?: string };
type P = { _id: string; categoryId: string; name: string; description?: string; price: number; image?: string; isAvailable?: boolean };

// Plain, unavailable-filtered view of the menu shared by the JSON-LD and the crawlable text list.
export function groupMenu(categories: C[], products: P[]) {
  return categories
    .map((c) => ({ ...c, items: products.filter((p) => p.categoryId === c._id && p.isAvailable !== false) }))
    .filter((c) => c.items.length > 0);
}

export function buildRestaurantJsonLd(r: R, categories: C[], products: P[]) {
  const url = `${SITE_URL}/menu/${r.slug}`;
  const images = [r.coverImage, r.logo].filter(Boolean) as string[];
  const sameAs = [r.instagram, r.facebook].filter(Boolean) as string[];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": r.establishmentType === "cafe" ? "CafeOrCoffeeShop" : "Restaurant",
        "@id": `${url}#place`,
        name: r.name,
        url,
        ...(images.length ? { image: images } : {}),
        ...(r.logo ? { logo: r.logo } : {}),
        ...(r.phone ? { telephone: r.phone } : {}),
        ...(r.address ? { address: { "@type": "PostalAddress", streetAddress: r.address, addressCountry: "TN" } } : { address: { "@type": "PostalAddress", addressCountry: "TN" } }),
        ...(r.googleMapsUrl ? { hasMap: r.googleMapsUrl } : {}),
        ...(sameAs.length ? { sameAs } : {}),
        hasMenu: {
          "@type": "Menu",
          name: `Menu ${r.name}`,
          url,
          inLanguage: "fr",
          hasMenuSection: groupMenu(categories, products).map((c) => ({
            "@type": "MenuSection",
            name: c.name,
            ...(c.description ? { description: c.description } : {}),
            hasMenuItem: c.items.map((p) => ({
              "@type": "MenuItem",
              name: p.name,
              ...(p.description ? { description: p.description } : {}),
              ...(p.image ? { image: p.image } : {}),
              offers: { "@type": "Offer", price: Number(p.price).toFixed(3), priceCurrency: "TND" },
            })),
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ClickMenu", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Menus", item: `${SITE_URL}/menu` },
          { "@type": "ListItem", position: 3, name: r.name, item: url },
        ],
      },
    ],
  };
}
