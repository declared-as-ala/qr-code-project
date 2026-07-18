/* eslint-disable @typescript-eslint/no-require-imports */
// Extracts the 10 "Biscuits secs" products out of the "Vitrine" category
// into a new (or existing) "Biscuits secs" category, in the given order.
// Products are MOVED (categoryId + sortOrder updated), never recreated —
// _id, image, badge, analytics all preserved. Idempotent.
//
// Usage:
//   node scripts/extract-biscuits-secs.js            (dry run)
//   node scripts/extract-biscuits-secs.js --apply    (writes to the database)
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

const APPLY = process.argv.includes("--apply");

function normalize(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[''`]/g, "'")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const BISCUITS_ORDER = [
  "Cake marbré",
  "Cake amande sans gluten",
  "Biscuit italien",
  "Biscuit soleil",
  "Madeleine vanille",
  "Madeleine chocolat",
  "Financier pistache",
  "Financier vanille amande",
  "Cookies chocolat noisette",
  "Cookies pistache chocolat blanc",
];

async function run() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "qr_menu_saas" });
  const db = mongoose.connection.db;

  const restaurant = await db.collection("restaurants").findOne({ slug: "maison-nael" });
  if (!restaurant) throw new Error("MAISON NAEL not found");
  const restaurantId = restaurant._id;

  const dbCategories = await db.collection("categories").find({ restaurantId }).toArray();
  const dbProducts = await db.collection("products").find({ restaurantId }).toArray();
  const catByNorm = new Map(dbCategories.map((c) => [normalize(c.name), c]));

  const vitrine = catByNorm.get(normalize("Vitrine"));
  const biscuits = catByNorm.get(normalize("Biscuits secs"));

  const report = { alreadyCorrect: [], toMove: [], notFound: [] };
  const moveOps = [];

  BISCUITS_ORDER.forEach((name, index) => {
    const p = dbProducts.find((pr) => normalize(pr.name) === normalize(name));
    if (!p) {
      report.notFound.push(name);
      return;
    }
    const inBiscuits = biscuits && String(p.categoryId) === String(biscuits._id);
    if (inBiscuits && p.sortOrder === index + 1) {
      report.alreadyCorrect.push(name);
    } else {
      report.toMove.push(`${name} (sortOrder → ${index + 1})`);
      moveOps.push({ _id: p._id, name, sortOrder: index + 1 });
    }
  });

  console.log(`\n${APPLY ? "🚀 APPLY MODE" : "🔍 DRY RUN"} — Extract Biscuits secs from Vitrine\n`);
  console.log(`Biscuits secs category: ${biscuits ? `exists (${biscuits._id})` : "will be created"}`);
  console.log(`\nAlready correctly in Biscuits secs (${report.alreadyCorrect.length})`);
  console.log(`\nTo move/reorder (${report.toMove.length}):`);
  report.toMove.forEach((m) => console.log("  ~", m));
  console.log(`\nNot found (${report.notFound.length}):`);
  report.notFound.forEach((m) => console.log("  ⚠", m));

  if (!APPLY) {
    console.log("\n(dry run only — re-run with --apply to write these changes)\n");
    await mongoose.disconnect();
    return;
  }

  let biscuitsId = biscuits?._id;
  if (!biscuitsId) {
    // Slot the new category right after Vitrine.
    const sortOrder = (vitrine?.sortOrder ?? dbCategories.length) + 1;
    const res = await db.collection("categories").insertOne({
      restaurantId,
      name: "Biscuits secs",
      description: "",
      sortOrder,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    biscuitsId = res.insertedId;
    console.log(`\n✅ Created category "Biscuits secs" (${biscuitsId})`);
  }

  for (const op of moveOps) {
    await db.collection("products").updateOne(
      { _id: op._id },
      { $set: { categoryId: biscuitsId, sortOrder: op.sortOrder, updatedAt: new Date() } }
    );
  }
  console.log(`✅ Moved/reordered ${moveOps.length} products into Biscuits secs`);

  // Compact sortOrder across all remaining categories, preserving relative order.
  const allCats = await db.collection("categories").find({ restaurantId }).sort({ sortOrder: 1 }).toArray();
  await Promise.all(allCats.map((c, i) => db.collection("categories").updateOne({ _id: c._id }, { $set: { sortOrder: i + 1 } })));
  console.log(`✅ Compacted category order (${allCats.length} categories)\n`);

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("❌", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
