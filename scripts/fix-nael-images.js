/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");
const path     = require("path");
const fs       = require("fs");
const { v2: cloudinary } = require("cloudinary");

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const [k, ...v] = line.split("=");
    if (k && !(k in process.env)) process.env[k.trim()] = v.join("=").trim();
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const slug = (n) =>
  n.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const IMAGES_DIR = path.join(process.cwd(), "images");

// What to fix
const FIXES = [
  // Clear wrong assignments
  { file: "IMG_7134.JPG", product: "Salade César Croustillante" },

  // Mango fruit concept shot → Mangue banane smoothie
  { file: "IMG_6666.JPG", product: "Mangue banane" },

  // Danish with dark red cherries → Danish Forestier (forest fruits)
  { file: "IMG_6709.JPG", product: "Danish Forestier" },

  // Salade Estivale lost its real photo (was wrongly IMG_7134 — give it a summer salad stock image)
  {
    product: "Salade Estivale",
    pexelsUrl: "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

async function uploadAndUpdate(db, restaurantId, productName, source, isUrl) {
  const publicId = `items/real-${slug(productName)}-fix`;
  let uploadResult;

  if (isUrl) {
    uploadResult = await cloudinary.uploader.upload(source, {
      folder: "maison-nael", public_id: publicId, overwrite: true,
      transformation: [{ width: 800, height: 800, crop: "fill", gravity: "center", quality: "auto:good" }],
    });
  } else {
    const filePath = path.join(IMAGES_DIR, source);
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠  File not found: ${source}`);
      return false;
    }
    uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "maison-nael", public_id: publicId, overwrite: true,
      transformation: [{ width: 800, height: 800, crop: "fill", gravity: "center", quality: "auto:good" }],
    });
  }

  const result = await db.collection("products").updateOne(
    { restaurantId, name: productName },
    { $set: { image: uploadResult.secure_url, updatedAt: new Date() } }
  );

  if (result.matchedCount === 0) {
    console.log(`  ❌ Product not found in DB: "${productName}"`);
    return false;
  }
  console.log(`  ✅ ${productName} → ${uploadResult.secure_url}`);
  return true;
}

async function run() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "qr_menu_saas" });
  const db = mongoose.connection.db;

  const restaurant = await db.collection("restaurants").findOne({ slug: "maison-nael" });
  if (!restaurant) throw new Error("MAISON NAEL not found");
  const restaurantId = restaurant._id;

  console.log("\n🔧 Applying image fixes...\n");

  for (const fix of FIXES) {
    process.stdout.write(`  ⬆  "${fix.product}" ... `);
    if (fix.pexelsUrl) {
      await uploadAndUpdate(db, restaurantId, fix.product, fix.pexelsUrl, true);
    } else {
      await uploadAndUpdate(db, restaurantId, fix.product, fix.file, false);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("\n✅ All fixes applied.\n");
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("❌", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
