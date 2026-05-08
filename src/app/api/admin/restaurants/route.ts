import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import { requireUser } from "@/lib/permissions";
import { Restaurant } from "@/models/Restaurant";
import { User } from "@/models/User";

export async function GET() {
  const user = await requireUser();
  if (user.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectDb();
  const items = await Restaurant.find().populate("ownerId", "name email").sort({ createdAt: -1 });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const currentUser = await requireUser();
  if (currentUser.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const required = ["name", "slug", "ownerName", "ownerEmail", "temporaryPassword"];
  const missing = required.find((k) => !body[k]);
  if (missing) return NextResponse.json({ error: `Champ requis manquant: ${missing}` }, { status: 400 });

  await connectDb();

  const existingUser = await User.findOne({ email: body.ownerEmail });
  if (existingUser) return NextResponse.json({ error: "Email proprietaire deja utilise." }, { status: 409 });

  const existingRestaurant = await Restaurant.findOne({ slug: body.slug });
  if (existingRestaurant) return NextResponse.json({ error: "Slug deja utilise." }, { status: 409 });

  const passwordHash = await bcrypt.hash(String(body.temporaryPassword), 12);
  const owner = await User.create({
    name: body.ownerName,
    email: body.ownerEmail,
    passwordHash,
    role: "restaurant_admin",
    mustChangePassword: true,
  });

  const restaurant = await Restaurant.create({
    ownerId: owner._id,
    name: body.name,
    slug: body.slug,
    establishmentType: body.establishmentType || "restaurant",
    logo: body.logo || "",
    coverImage: body.coverImage || "",
    address: body.address || "",
    phone: body.phone || "",
    instagram: body.instagram || "",
    facebook: body.facebook || "",
    googleMapsUrl: body.googleMapsUrl || "",
    isActive: body.isActive ?? true,
  });

  return NextResponse.json({
    message: "Enseigne creee avec succes.",
    restaurant,
    owner: { id: owner._id, name: owner.name, email: owner.email },
  }, { status: 201 });
}
