import { NextResponse } from "next/server";
import QRCodePkg from "qrcode";
import { connectDb } from "@/lib/db";
import { requireUser } from "@/lib/permissions";
import { QRCode } from "@/models/QRCode";
import { Restaurant } from "@/models/Restaurant";

export async function POST() {
  try {
    await connectDb();
    const user = await requireUser();
    const restaurant = await Restaurant.findOne({ ownerId: user.id });
    if (!restaurant) {
      return NextResponse.json({ error: "Create your restaurant profile first." }, { status: 400 });
    }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const targetUrl = `${appUrl}/menu/${restaurant.slug}`;
  const qrImageUrl = await QRCodePkg.toDataURL(targetUrl, { width: 720, margin: 1 });

  const saved = await QRCode.findOneAndUpdate(
    { restaurantId: restaurant._id },
    { restaurantId: restaurant._id, targetUrl, qrImageUrl },
    { upsert: true, new: true }
  );

    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "Unable to generate QR code." }, { status: 500 });
  }
}
