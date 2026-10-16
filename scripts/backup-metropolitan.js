/* eslint-disable @typescript-eslint/no-require-imports */
// Snapshot taken BEFORE seed-metropolitan.js: the full restaurants collection
// plus any existing Métropolitan categories/products.
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const [k, ...v] = line.split("=");
    if (k && !(k in process.env)) process.env[k.trim()] = v.join("=").trim();
  }
}

async function run() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "qr_menu_saas" });
  const db = mongoose.connection.db;

  const restaurants = await db.collection("restaurants").find({}).toArray();
  const metro = restaurants.find(
    (r) => r.slug === "metropolitan" || /m[eé]tropolitan/i.test(r.name || "")
  );
  const categories = metro
    ? await db.collection("categories").find({ restaurantId: metro._id }).toArray()
    : [];
  const products = metro
    ? await db.collection("products").find({ restaurantId: metro._id }).toArray()
    : [];

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = path.join(process.cwd(), "scripts", "backups");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `metropolitan-backup-${stamp}.json`);
  fs.writeFileSync(
    outFile,
    JSON.stringify({ takenAt: new Date().toISOString(), restaurants, categories, products }, null, 2)
  );

  console.log(`✅ Backup written: ${outFile}`);
  console.log(`   restaurants: ${restaurants.length}`);
  console.log(
    metro
      ? `   Métropolitan already exists (${metro.slug}): ${categories.length} categories, ${products.length} products`
      : "   Métropolitan does not exist yet"
  );
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("❌", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
