import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireRestaurant } from "@/lib/permissions";
import { StockItem } from "@/models/StockItem";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const { restaurant } = await requireRestaurant();
    const { id } = await params;
    const body = await req.json();
    const item = await StockItem.findOneAndUpdate(
      { _id: id, restaurantId: restaurant!._id },
      body,
      { new: true }
    );
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const { restaurant } = await requireRestaurant();
    const { id } = await params;
    await StockItem.findOneAndUpdate(
      { _id: id, restaurantId: restaurant!._id },
      { isActive: false }
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
