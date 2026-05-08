import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { ScanAnalytics } from "@/models/ScanAnalytics";
import { Product } from "@/models/Product";
import { requireRestaurant } from "@/lib/permissions";

export async function GET() {
  await connectDb();
  const { restaurant } = await requireRestaurant();

  const totalScans = await ScanAnalytics.countDocuments({ restaurantId: restaurant._id });
  const visitorsToday = await ScanAnalytics.countDocuments({
    restaurantId: restaurant._id,
    scannedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
  });
  const mostViewedProducts = await Product.find({ restaurantId: restaurant._id, isFeatured: true })
    .select("name")
    .limit(5)
    .lean();

  return NextResponse.json({ totalScans, visitorsToday, mostViewedProducts });
}
