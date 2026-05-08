import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireRestaurant } from "@/lib/permissions";
import { Product } from "@/models/Product";

export async function POST(req: Request) {
  await connectDb();
  await requireRestaurant();
  const { ids } = await req.json();
  await Promise.all(ids.map((id: string, i: number) => Product.findByIdAndUpdate(id, { sortOrder: i })));
  return NextResponse.json({ ok: true });
}
