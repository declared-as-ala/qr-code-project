import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireUser } from "@/lib/permissions";
import { Order } from "@/models/Order";
import { Restaurant } from "@/models/Restaurant";

const VALID_STATUSES = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();
    const user = await requireUser();
    const { id } = await params;
    const { status } = await req.json();

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await Order.findById(id);
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Non-super-admins can only update their own restaurant's orders
    if (user.role !== "super_admin") {
      const restaurant = await Restaurant.findOne({ ownerId: user.id });
      if (!restaurant || !order.restaurantId.equals(restaurant._id)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    order.status = status;
    await order.save();

    return NextResponse.json({ success: true, order });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();
    const user = await requireUser();
    const { id } = await params;

    const order = await Order.findById(id);
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (user.role !== "super_admin") {
      const restaurant = await Restaurant.findOne({ ownerId: user.id });
      if (!restaurant || !order.restaurantId.equals(restaurant._id)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    await order.deleteOne();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
