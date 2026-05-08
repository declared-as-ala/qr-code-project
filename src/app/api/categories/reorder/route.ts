import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireRestaurant } from "@/lib/permissions";
import { Category } from "@/models/Category";

export async function POST(req: Request) {
  await connectDb();
  await requireRestaurant();
  const { ids } = await req.json();
  await Promise.all(ids.map((id: string, i: number) => Category.findByIdAndUpdate(id, { sortOrder: i })));
  return NextResponse.json({ ok: true });
}
