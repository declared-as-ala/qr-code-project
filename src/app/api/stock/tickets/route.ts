import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireRestaurant } from "@/lib/permissions";
import { StockItem } from "@/models/StockItem";
import { StockMovement } from "@/models/StockMovement";
import { StockTicket } from "@/models/StockTicket";

export async function GET() {
  try {
    await connectDb();
    const { restaurant } = await requireRestaurant();
    const tickets = await StockTicket.find({ restaurantId: restaurant!._id })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return NextResponse.json(tickets);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDb();
    const { restaurant } = await requireRestaurant();
    const { items, note } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    const count     = await StockTicket.countDocuments({ restaurantId: restaurant!._id });
    const reference = `TK-${String(count + 1).padStart(3, "0")}`;

    const ticketItems = [];

    for (const { stockItemId, quantity } of items) {
      const item = await StockItem.findOne({ _id: stockItemId, restaurantId: restaurant!._id });
      if (!item) continue;

      const prevQty = item.quantity;
      const newQty  = Math.max(0, prevQty - quantity);
      item.quantity  = newQty;
      await item.save();

      await StockMovement.create({
        restaurantId:     restaurant!._id,
        stockItemId:      item._id,
        stockItemName:    item.name,
        type:             "sortie",
        quantity,
        previousQuantity: prevQty,
        newQuantity:      newQty,
        unit:             item.unit,
        note:             `Commande ${reference}`,
      });

      ticketItems.push({ stockItemId: item._id, name: item.name, quantity, unit: item.unit });
    }

    const ticket = await StockTicket.create({
      restaurantId: restaurant!._id,
      reference,
      items: ticketItems,
      note,
    });

    return NextResponse.json({ ticket, reference }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
