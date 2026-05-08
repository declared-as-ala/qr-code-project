import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import { requireUser } from "@/lib/permissions";
import { User } from "@/models/User";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const currentUser = await requireUser();
  if (currentUser.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { temporaryPassword } = await req.json();
  if (!temporaryPassword || String(temporaryPassword).length < 8) {
    return NextResponse.json({ error: "Le mot de passe temporaire doit contenir au moins 8 caracteres." }, { status: 400 });
  }

  await connectDb();
  const { id } = await params;
  const user = await User.findById(id);
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });

  user.passwordHash = await bcrypt.hash(String(temporaryPassword), 12);
  user.mustChangePassword = true;
  await user.save();

  return NextResponse.json({ message: "Mot de passe reinitialise." });
}
