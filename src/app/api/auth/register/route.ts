import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Inscription publique desactivee. La creation de compte est reservee au Super Admin." },
    { status: 403 }
  );
}
