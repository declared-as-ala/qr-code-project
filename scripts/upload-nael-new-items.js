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

const IMG_DIR = path.join(process.cwd(), "src", "components", "menu");

const slug = (n) =>
  n.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function upload(file, publicId) {
  const filePath = path.join(IMG_DIR, file);
  const result = await cloudinary.uploader.upload(filePath, {
    folder:     "maison-nael",
    public_id:  `items/${publicId}`,
    overwrite:  true,
    transformation: [{ width: 800, height: 800, crop: "fill", gravity: "center", quality: "auto:good" }],
  });
  return result.secure_url;
}

async function run() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "qr_menu_saas" });
  const db = mongoose.connection.db;

  const restaurant = await db.collection("restaurants").findOne({ slug: "maison-nael" });
  if (!restaurant) throw new Error("MAISON NAEL not found");
  const restaurantId = restaurant._id;

  // ── 1. UPDATE OMELETTE GOURMET ─────────────────────────────────────────────
  console.log("\n📸 Uploading images...\n");

  process.stdout.write('  ⬆  Omelette gourmet.png → "Omelette Gourmet" ... ');
  const omelette_url = await upload("Omelette gourmet.png", "real-omelette-gourmet");
  await db.collection("products").updateOne(
    { restaurantId, name: "Omelette Gourmet" },
    { $set: { image: omelette_url, updatedAt: new Date() } }
  );
  console.log("✅");

  // ── 2. NEW PRODUCTS - find or create "Gâteaux" category ───────────────────
  let gateauxCat = await db.collection("categories").findOne({ restaurantId, name: "Gâteaux" });
  if (!gateauxCat) {
    const res = await db.collection("categories").insertOne({
      restaurantId,
      name: "Gâteaux",
      description: "",
      isActive: true,
      sortOrder: 17,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    gateauxCat = { _id: res.insertedId };
    console.log("\n+ Created category: Gâteaux (sort 17)\n");
  }

  const maxProd = await db.collection("products").find({ restaurantId }).sort({ sortOrder: -1 }).limit(1).toArray();
  let sortOrder = (maxProd[0]?.sortOrder || 200) + 1;

  // New products: [file(s), productName, price]
  const NEW_PRODUCTS = [
    { files: ["gateau.png", "gateau2.png", "gateau 4.png"], name: "Gâteau Magique",        price: 0, badge: "Signature" },
    { files: ["trompe a leuil.png"],                        name: "Trompe-l'œil",           price: 0, badge: "Signature" },
    { files: ["cheese cake .png"],                          name: "Cheesecake",              price: 0, badge: "" },
    { files: ["carreau de cake .png"],                      name: "Carreau de cake",         price: 0, badge: "" },
    { files: ["Flan praliné pistache.png"],                 name: "Flan praliné pistache",   price: 0, badge: "Nouveau" },
  ];

  for (const item of NEW_PRODUCTS) {
    process.stdout.write(`  ⬆  ${item.files[0]} → "${item.name}" ... `);
    const url = await upload(item.files[0], `real-${slug(item.name)}`);

    // Check if product already exists
    const existing = await db.collection("products").findOne({ restaurantId, name: item.name });
    if (existing) {
      await db.collection("products").updateOne(
        { _id: existing._id },
        { $set: { image: url, updatedAt: new Date() } }
      );
      console.log("✅ (updated existing)");
    } else {
      await db.collection("products").insertOne({
        restaurantId,
        categoryId:  gateauxCat._id,
        name:        item.name,
        description: item.name,
        price:       item.price,
        image:       url,
        badge:       item.badge,
        isAvailable: true,
        isFeatured:  item.badge === "Signature" || item.badge === "Nouveau",
        sortOrder:   sortOrder++,
        createdAt:   new Date(),
        updatedAt:   new Date(),
      });
      console.log("✅ (new product)");
    }

    // Upload extra images for gâteau (gateau2, gateau4) but don't assign
    if (item.files.length > 1) {
      for (let i = 1; i < item.files.length; i++) {
        process.stdout.write(`     ⬆  ${item.files[i]} (extra) ... `);
        await upload(item.files[i], `real-${slug(item.name)}-v${i + 1}`);
        console.log("✅");
      }
    }

    await new Promise(r => setTimeout(r, 500));
  }

  console.log("\n✅ Done! All images uploaded and products updated/created.\n");
  console.log("⚠️  Note: New products have price = 0 DT — update prices in your dashboard.\n");
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("❌", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
