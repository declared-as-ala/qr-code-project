import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Product } from "@/models/Product";
import { requireRestaurant } from "@/lib/permissions";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDb();
  const { restaurant } = await requireRestaurant();
  const { id } = await params;
  const item = await Product.findOneAndUpdate({ _id: id, restaurantId: restaurant._id }, await req.json(), { new: true });
  if (!item) return NextResponse.json({ error: "Article introuvable ou non autorise." }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDb();
  const { restaurant } = await requireRestaurant();
  const { id } = await params;
  const deleted = await Product.findOneAndDelete({ _id: id, restaurantId: restaurant._id });
  if (!deleted) return NextResponse.json({ error: "Article introuvable ou non autorise." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
