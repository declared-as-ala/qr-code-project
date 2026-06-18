import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireRestaurant } from "@/lib/permissions";
import { StockItem } from "@/models/StockItem";
import { StockMovement } from "@/models/StockMovement";

export async function GET() {
  try {
    await connectDb();
    const { restaurant } = await requireRestaurant();
    const movements = await StockMovement.find({ restaurantId: restaurant!._id })
      .sort({ createdAt: -1 })
      .limit(300)
      .lean();
    return NextResponse.json(movements);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDb();
    const { restaurant } = await requireRestaurant();
    const { stockItemId, type, quantity, note } = await req.json();

    const item = await StockItem.findOne({ _id: stockItemId, restaurantId: restaurant!._id });
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    const prevQty = item.quantity;
    let newQty: number;
    let recordedQty: number;

    if (type === "entree") {
      newQty = prevQty + quantity;
      recordedQty = quantity;
    } else if (type === "sortie" || type === "perte") {
      newQty = Math.max(0, prevQty - quantity);
      recordedQty = quantity;
    } else {
      // ajustement: quantity is the new absolute value
      newQty = quantity;
      recordedQty = Math.abs(newQty - prevQty);
    }

    item.quantity = newQty;
    await item.save();

    const movement = await StockMovement.create({
      restaurantId:     restaurant!._id,
      stockItemId:      item._id,
      stockItemName:    item.name,
      type,
      quantity:         recordedQty,
      previousQuantity: prevQty,
      newQuantity:      newQty,
      unit:             item.unit,
      note,
    });

    return NextResponse.json({ item, movement }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
