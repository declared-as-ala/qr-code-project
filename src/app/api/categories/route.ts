import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireRestaurant } from "@/lib/permissions";
import { categorySchema } from "@/lib/validations/entities";
import { Category } from "@/models/Category";

export async function GET() {
  await connectDb();
  const { restaurant } = await requireRestaurant();
  const items = await Category.find({ restaurantId: restaurant._id }).sort({ sortOrder: 1 });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  await connectDb();
  const { restaurant } = await requireRestaurant();
  const body = categorySchema.parse(await req.json());
  const item = await Category.create({ ...body, restaurantId: restaurant._id });
  return NextResponse.json(item, { status: 201 });
}
