import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireUser } from "@/lib/permissions";
import { Restaurant } from "@/models/Restaurant";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const currentUser = await requireUser();
  if (currentUser.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectDb();
  const { id } = await params;
  const restaurant = await Restaurant.findById(id).populate("ownerId", "name email");
  if (!restaurant) return NextResponse.json({ error: "Enseigne introuvable." }, { status: 404 });
  return NextResponse.json(restaurant);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const currentUser = await requireUser();
  if (currentUser.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectDb();
  const { id } = await params;
  const body = await req.json();
  const restaurant = await Restaurant.findByIdAndUpdate(id, body, { new: true });
  if (!restaurant) return NextResponse.json({ error: "Enseigne introuvable." }, { status: 404 });
  return NextResponse.json({ message: "Enseigne mise a jour.", restaurant });
}
