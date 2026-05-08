import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireUser } from "@/lib/permissions";
import { restaurantSchema } from "@/lib/validations/entities";
import { Restaurant } from "@/models/Restaurant";

export async function GET() {
  try {
    await connectDb();
    const user = await requireUser();
    const restaurant = await Restaurant.findOne({ ownerId: user.id });
    return NextResponse.json(restaurant);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDb();
    const user = await requireUser();
    const restaurant = await Restaurant.findOne({ ownerId: user.id });
    const body = restaurantSchema.parse(await req.json());

    const result = restaurant
      ? await Restaurant.findByIdAndUpdate(restaurant._id, body, { new: true })
      : await Restaurant.create({ ...body, ownerId: user.id });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
