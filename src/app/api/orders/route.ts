import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireUser } from "@/lib/permissions";
import { Order } from "@/models/Order";
import { Restaurant } from "@/models/Restaurant";
import mongoose from "mongoose";

// POST — public (customers create orders from the menu)
export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();
    const { restaurantSlug, tableNumber, customerName, customerPhone, items, notes } = body;

    if (!restaurantSlug || !items?.length) {
      return NextResponse.json({ error: "restaurantSlug and items required" }, { status: 400 });
    }

    const restaurant = await Restaurant.findOne({ slug: restaurantSlug });
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const totalAmount = items.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      restaurantId: restaurant._id,
      tableNumber: tableNumber || "",
      customerName: customerName || "",
      customerPhone: customerPhone || "",
      items,
      totalAmount,
      notes: notes || "",
      status: "pending",
    });

    return NextResponse.json({ success: true, orderId: order._id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/orders", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET — admin only (list orders for this restaurant, or all if super_admin)
export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const user = await requireUser();
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const since = url.searchParams.get("since");

    let restaurantId: mongoose.Types.ObjectId | undefined;

    if (user.role !== "super_admin") {
      const restaurant = await Restaurant.findOne({ ownerId: user.id });
      if (!restaurant) return NextResponse.json({ orders: [] });
      restaurantId = restaurant._id as mongoose.Types.ObjectId;
    } else {
      const rid = url.searchParams.get("restaurantId");
      if (rid) restaurantId = new mongoose.Types.ObjectId(rid);
    }

    const filter: Record<string, unknown> = {};
    if (restaurantId) filter.restaurantId = restaurantId;
    if (status && status !== "all") filter.status = status;
    if (since) filter.createdAt = { $gt: new Date(since) };

    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(200).lean();

    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
