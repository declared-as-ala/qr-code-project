import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireRestaurant } from "@/lib/permissions";
import { productSchema } from "@/lib/validations/entities";
import { Product } from "@/models/Product";

export async function GET() {
  await connectDb();
  const { restaurant } = await requireRestaurant();
  const items = await Product.find({ restaurantId: restaurant._id }).sort({ sortOrder: 1 });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  await connectDb();
  const { restaurant } = await requireRestaurant();
  const body = productSchema.parse(await req.json());
  const item = await Product.create({ ...body, restaurantId: restaurant._id });
  return NextResponse.json(item, { status: 201 });
}
