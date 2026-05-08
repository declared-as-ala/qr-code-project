import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Category } from "@/models/Category";
import { requireRestaurant } from "@/lib/permissions";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDb();
  const { restaurant } = await requireRestaurant();
  const body = await req.json();
  const { id } = await params;
  const item = await Category.findOneAndUpdate({ _id: id, restaurantId: restaurant._id }, body, { new: true });
  if (!item) return NextResponse.json({ error: "Categorie introuvable ou non autorisee." }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDb();
  const { restaurant } = await requireRestaurant();
  const { id } = await params;
  const deleted = await Category.findOneAndDelete({ _id: id, restaurantId: restaurant._id });
  if (!deleted) return NextResponse.json({ error: "Categorie introuvable ou non autorisee." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
