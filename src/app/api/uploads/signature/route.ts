import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { requireRestaurant } from "@/lib/permissions";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Issues a short-lived signature for a direct browser → Cloudinary upload.
// The image bytes never pass through our serverless function, so large
// phone photos never hit Vercel's request-body size limit.
export async function POST() {
  await requireRestaurant();
  const timestamp = Math.round(Date.now() / 1000);
  const folder = "qr-menu";
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET as string
  );
  return NextResponse.json({
    signature,
    timestamp,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
}
