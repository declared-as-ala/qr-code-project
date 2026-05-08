import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireUser } from "@/lib/permissions";
import { User } from "@/models/User";

export async function POST(req: Request) {
  const body = await req.json();

  if (body?.inviteToken !== process.env.SUPER_ADMIN_BOOTSTRAP_TOKEN) {
    return NextResponse.json({ error: "Operation non autorisee." }, { status: 403 });
  }

  await connectDb();
  const existing = await User.findOne({ role: "super_admin" });
  if (existing) return NextResponse.json({ error: "Super Admin deja initialise." }, { status: 409 });

  return NextResponse.json({ error: "Creation super admin manuelle requise via script securise." }, { status: 501 });
}

export async function GET() {
  const user = await requireUser();
  if (user.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectDb();
  return NextResponse.json(await User.find().select("name email role createdAt"));
}
