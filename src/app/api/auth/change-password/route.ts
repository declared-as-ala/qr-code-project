import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorise" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!newPassword || String(newPassword).length < 8) {
    return NextResponse.json({ error: "Le nouveau mot de passe doit contenir au moins 8 caracteres." }, { status: 400 });
  }

  await connectDb();
  const user = await User.findById(session.user.id);
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });

  const valid = await bcrypt.compare(String(currentPassword || ""), user.passwordHash);
  if (!valid) return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 400 });

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  user.mustChangePassword = false;
  await user.save();

  return NextResponse.json({ message: "Mot de passe mis a jour avec succes." });
}
