/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * upload-nael-real-images.js
 * Uploads real MAISON NAËL photos from local folder to Cloudinary,
 * then updates each product's image in MongoDB.
 * Run: node scripts/upload-nael-real-images.js
 */

const fs       = require("fs");
const path     = require("path");
const mongoose = require("mongoose");
const { v2: cloudinary } = require("cloudinary");

// ── Load .env.local ──────────────────────────────────────────────────────────
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

const IMAGES_DIR = path.join(process.cwd(), "images");

// Mapping: filename → product name (duplicates resolved → last occurrence wins)
const RAW_MAPPING = [
  { filename: "IMG_6640.JPG", product: "Financier pistache" },
  { filename: "IMG_6650.JPG", product: "Papillon Rubis" },
  { filename: "IMG_6653.JPG", product: "Amandine" },
  { filename: "IMG_6666.JPG", product: "Nuage Citron" },
  { filename: "IMG_6669.JPG", product: "Rubis pistache" },
  { filename: "IMG_6673.JPG", product: "Biscuit italien" },
  { filename: "IMG_6676.JPG", product: "Nuage Citron" },
  { filename: "IMG_6679.JPG", product: "Madeleine chocolat" },
  { filename: "IMG_6709.JPG", product: "Danish Framboise Élégance" },
  { filename: "IMG_6713.JPG", product: "Danish Myrtille" },
  { filename: "IMG_6719.JPG", product: "Danish Fraise" },
  { filename: "IMG_6728.JPG", product: "Danish Italien" },
  { filename: "IMG_6731.JPG", product: "Chocolatine" },
  { filename: "IMG_6732.JPG", product: "Suisse Gourmand" },
  { filename: "IMG_6735.JPG", product: "Biscuit soleil" },
  { filename: "IMG_6742.JPG", product: "Cookies pistache chocolat blanc" },
  { filename: "IMG_6747.JPG", product: "Danish Framboise Élégance" },
  { filename: "IMG_6751.JPG", product: "Cake marbré" },
  { filename: "IMG_7112.JPG", product: "Burrata Toast Signature" },
  { filename: "IMG_7123.JPG", product: "Nuage Citron" },
  { filename: "IMG_7128.JPG", product: "Le Suisse Gourmet" },
  { filename: "IMG_7130.JPG", product: "Pain Perdu Framboise Pistache" },
  { filename: "IMG_7134.JPG", product: "Salade Estivale" },
  { filename: "IMG_7143.JPG", product: "Pain Perdu Vanille Caramel" },
  { filename: "IMG_7164.JPG", product: "Le Suisse Gourmet" },
  { filename: "IMG_7167.JPG", product: "Rubis pistache" },
  { filename: "IMG_7175.JPG", product: "Frappé pistache" },
];

// Resolve duplicates: last occurrence wins
const mapping = {};
for (const { filename, product } of RAW_MAPPING) {
  mapping[product] = filename;
}
// mapping is now: product → filename (last one for each product)

const slug = (n) =>
  n.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function run() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "qr_menu_saas" });
  const db = mongoose.connection.db;

  const restaurant = await db.collection("restaurants").findOne({ slug: "maison-nael" });
  if (!restaurant) throw new Error("MAISON NAEL not found");
  const restaurantId = restaurant._id;

  const products = Object.entries(mapping);
  console.log(`\n📸 Uploading ${products.length} real photos to Cloudinary...\n`);

  let uploaded = 0, failed = 0;

  for (const [productName, filename] of products) {
    const filePath = path.join(IMAGES_DIR, filename);

    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠  File not found: ${filename} → skipping`);
      failed++;
      continue;
    }

    const publicId = `items/real-${slug(productName)}`;

    try {
      process.stdout.write(`  ⬆  ${filename} → "${productName}" ... `);

      const result = await cloudinary.uploader.upload(filePath, {
        folder:        "maison-nael",
        public_id:     publicId,
        overwrite:     true,
        resource_type: "image",
        transformation: [
          { width: 800, height: 800, crop: "fill", gravity: "center", quality: "auto:good", fetch_format: "auto" }
        ],
      });

      // Update product in DB
      const update = await db.collection("products").updateOne(
        { restaurantId, name: productName },
        { $set: { image: result.secure_url, updatedAt: new Date() } }
      );

      if (update.matchedCount === 0) {
        console.log(`❌ product not found in DB`);
        failed++;
      } else {
        console.log(`✅`);
        uploaded++;
      }

      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 500));

    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✅ Done! Uploaded & updated: ${uploaded} | Failed: ${failed}\n`);
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("❌", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
