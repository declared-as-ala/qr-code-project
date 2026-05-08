import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { requireRestaurant } from "@/lib/permissions";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  await requireRestaurant();
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const result = await cloudinary.uploader.upload(`data:${file.type};base64,${base64}`, {
    folder: "qr-menu",
    resource_type: "image",
  });
  return NextResponse.json({ url: result.secure_url });
}
