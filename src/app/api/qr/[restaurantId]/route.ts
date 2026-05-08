import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { QRCode } from "@/models/QRCode";
import { requireUser } from "@/lib/permissions";
import { Restaurant } from "@/models/Restaurant";

export async function GET() {
  try {
    await connectDb();
    const user = await requireUser();
    const restaurant = await Restaurant.findOne({ ownerId: user.id });
    if (!restaurant) {
      return NextResponse.json({ error: "Create your restaurant profile first." }, { status: 400 });
    }
    const code = await QRCode.findOne({ restaurantId: restaurant._id });
    return NextResponse.json(code);
  } catch {
    return NextResponse.json({ error: "Unable to load QR code." }, { status: 500 });
  }
}
