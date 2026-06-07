import { connectDb } from "@/lib/db";
import { Restaurant } from "@/models/Restaurant";
import { RestaurantDirectoryClient } from "@/components/menu/restaurant-directory-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nos Établissements Partenaires | ClickMenu",
  description: "Explorez et accédez aux cartes et menus digitaux des meilleurs cafés, restaurants et fast-foods en Tunisie.",
};

export default async function RestaurantDirectoryPage() {
  await connectDb();
  
  // Fetch active restaurants from MongoDB
  const rawRestaurants = await Restaurant.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean();

  // Standardize types to serialize nicely into Client Component props
  const restaurants = rawRestaurants.map((res: any) => ({
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

  return <RestaurantDirectoryClient initialRestaurants={restaurants} />;
}
