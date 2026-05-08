import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { ScanAnalytics } from "@/models/ScanAnalytics";

export async function POST(req: Request) {
  await connectDb();
  const body = await req.json();
  await ScanAnalytics.create({
    restaurantId: body.restaurantId,
    productId: body.productId,
    ipAddress: req.headers.get("x-forwarded-for") ?? "unknown",
    userAgent: req.headers.get("user-agent") ?? "unknown",
  });
  return NextResponse.json({ ok: true });
}
