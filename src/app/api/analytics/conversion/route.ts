import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { ConversionEvent } from "@/models/ConversionEvent";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDb();
    await ConversionEvent.create({
      eventType: body.eventType || "whatsapp_click",
      pathname: String(body.pathname || "/").slice(0, 200),
      ctaLocation: String(body.ctaLocation || "page").slice(0, 100),
      ctaLabel: String(body.ctaLabel || "").slice(0, 160),
      href: String(body.href || "").slice(0, 500),
      referrer: String(body.referrer || req.headers.get("referer") || "").slice(0, 300),
      userAgent: String(req.headers.get("user-agent") || "unknown").slice(0, 300),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

