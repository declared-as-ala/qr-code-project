/* eslint-disable @typescript-eslint/no-require-imports */
// Snapshots Maison Naël's categories + products to a timestamped JSON file
// before any sync/migration touches the collections.
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

  const restaurant = await db.collection("restaurants").findOne({ slug: "maison-nael" });
  if (!restaurant) throw new Error("MAISON NAEL not found");

  const categories = await db.collection("categories").find({ restaurantId: restaurant._id }).toArray();
  const products = await db.collection("products").find({ restaurantId: restaurant._id }).toArray();

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = path.join(process.cwd(), "scripts", "backups");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `nael-menu-backup-${stamp}.json`);

  fs.writeFileSync(
    outFile,
    JSON.stringify({ restaurantId: restaurant._id, takenAt: new Date().toISOString(), categories, products }, null, 2)
  );

  console.log(`✅ Backup written: ${outFile}`);
  console.log(`   categories: ${categories.length}, products: ${products.length}`);
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("❌", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
