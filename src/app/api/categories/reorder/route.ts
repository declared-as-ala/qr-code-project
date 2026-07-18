import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireRestaurant } from "@/lib/permissions";
import { Category } from "@/models/Category";

export async function POST(req: Request) {
  await connectDb();
  const { restaurant } = await requireRestaurant();
  const { ids } = await req.json();
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "ids doit etre un tableau d'identifiants." }, { status: 400 });
  }
  await Promise.all(
    ids.map((id: string, i: number) =>
      Category.updateOne({ _id: id, restaurantId: restaurant._id }, { $set: { sortOrder: i + 1 } })
    )
  );
  const items = await Category.find({ restaurantId: restaurant._id }).sort({ sortOrder: 1 });
  return NextResponse.json(items);
}
