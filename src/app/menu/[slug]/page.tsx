import type { Metadata } from "next";
import { connectDb } from "@/lib/db";
import { Restaurant } from "@/models/Restaurant";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { ScanAnalytics } from "@/models/ScanAnalytics";
import { PublicMenuClient } from "@/components/menu/public-menu-client";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  await connectDb();
  const { slug } = await params;
  const restaurant = await Restaurant.findOne({ slug }).lean();
  if (!restaurant) return { title: "Menu" };
  return {
    title: `${restaurant.name} | Menu QR`,
    description: `Menu digital de ${restaurant.name}`,
  };
}

export default async function PublicMenuPage({ params }: { params: Promise<{ slug: string }> }) {
  await connectDb();
  const { slug } = await params;
  const restaurant = await Restaurant.findOne({ slug }).lean();

  if (!restaurant) {
    return <main className="p-8 text-center text-zinc-300">Restaurant introuvable</main>;
  }

  await ScanAnalytics.create({ restaurantId: restaurant._id });

  const categories = await Category.find({ restaurantId: restaurant._id, isActive: true }).sort({ sortOrder: 1 }).lean();
  const products = await Product.find({ restaurantId: restaurant._id }).sort({ sortOrder: 1 }).lean();

  return (
    <PublicMenuClient
      restaurant={{
        name: restaurant.name,
        logo: restaurant.logo,
        coverImage: restaurant.coverImage,
        phone: restaurant.phone,
        address: restaurant.address,
        primaryColor: restaurant.primaryColor,
      }}
      categories={categories.map((c) => ({ _id: String(c._id), name: c.name }))}
      products={products.map((p) => ({
        _id: String(p._id),
        categoryId: String(p.categoryId),
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        badge: p.badge,
        isAvailable: p.isAvailable,
      }))}
    />
  );
}
