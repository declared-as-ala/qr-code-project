import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireRestaurant } from "@/lib/permissions";
import { StockItem } from "@/models/StockItem";
import { StockMovement } from "@/models/StockMovement";

export async function GET() {
  try {
    await connectDb();
    const { restaurant } = await requireRestaurant();
    const rid = restaurant!._id;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [items, monthMovements] = await Promise.all([
      StockItem.find({ restaurantId: rid, isActive: true }).lean(),
      StockMovement.countDocuments({ restaurantId: rid, createdAt: { $gte: startOfMonth } }),
    ]);

    const totalValue   = items.reduce((s, i) => s + i.quantity * (i.costPerUnit ?? 0), 0);
    const lowStock     = items.filter(i => i.minThreshold > 0 && i.quantity > 0 && i.quantity <= i.minThreshold).length;
    const outOfStock   = items.filter(i => i.quantity === 0).length;

    return NextResponse.json({
      total: items.length,
      lowStock,
      outOfStock,
      totalValue,
      monthMovements,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
