import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message:
      "Demande enregistree. Contactez votre Super Admin pour recevoir un nouveau mot de passe temporaire.",
  });
}
