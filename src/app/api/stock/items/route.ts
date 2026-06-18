import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireRestaurant } from "@/lib/permissions";
import { StockItem } from "@/models/StockItem";

export async function GET() {
  try {
    await connectDb();
    const { restaurant } = await requireRestaurant();
    const items = await StockItem.find({ restaurantId: restaurant!._id, isActive: true })
      .sort({ category: 1, name: 1 })
      .lean();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDb();
    const { restaurant } = await requireRestaurant();
    const body = await req.json();
    const item = await StockItem.create({ ...body, restaurantId: restaurant!._id });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
