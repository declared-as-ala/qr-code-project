/* eslint-disable @typescript-eslint/no-require-imports */
// Merges 6 existing categories (Pâtisseries fines, Tartes & tartelettes,
// Flans & classiques, Éclairs & pâte à choux, Gâteaux américains,
// Biscuits secs) into a single new "Vitrine" category, in the exact
// product order supplied. Products are MOVED (categoryId + sortOrder
// updated), never recreated — _id, image, badge, isFeatured, analytics
// all preserved. The 6 source categories are deleted once emptied.
// Idempotent: re-running finds everything already in "Vitrine" and does
// nothing.
//
// Usage:
//   node scripts/merge-nael-vitrine.js            (dry run — reports only)
//   node scripts/merge-nael-vitrine.js --apply    (writes to the database)
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

const SOURCE_CATEGORIES = [
  "Pâtisseries fines",
  "Tartes & tartelettes",
  "Flans & classiques",
  "Éclairs & pâte à choux",
  "Gâteaux américains",
  "Biscuits secs",
];

// Exact display order requested for the "Vitrine" category.
const VITRINE_ORDER = [
  "Le citron",
  "La cacahuète",
  "La framboise",
  "La mangue",
  "La noix",
  "La fraise",
  "La pistache",
  "La noisette",
  "Signature cacahuète",
  "Noir et noisette",
  "Tarte au citron meringuée",
  "Pistache en rose",
  "Charlotte fruits rouges",
  "Douceur des îles",
  "Flan vanille",
  "Flan praliné noisette",
  "Flan praliné pistache",
  "Paris-Brest",
  "Chocolat signature",
  "L'Opéra pistache",
  "Éclair matcha framboise",
  "Éclair tiramisu",
  "Pistache d'Orient",
  "Nuances de chocolat",
  "Mille-feuille vanille",
  "Mille-feuille praliné noisette",
  "Carrot Cake",
  "Red Velvet",
  "Chocolate Layer Cake",
  "Cheesecake framboise",
  "Cheesecake fraise",
  "Cheesecake caramel",
  "Cheesecake citron",
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
  const sourceCats = SOURCE_CATEGORIES.map((n) => catByNorm.get(normalize(n))).filter(Boolean);
  const sourceCatIdSet = new Set(sourceCats.map((c) => String(c._id)));

  const report = { alreadyInVitrine: [], toMove: [], notFound: [], categoriesToDelete: [] };

  const moveOps = [];
  VITRINE_ORDER.forEach((name, index) => {
    const p = dbProducts.find((pr) => normalize(pr.name) === normalize(name));
    if (!p) {
      report.notFound.push(name);
      return;
    }
    const inVitrine = vitrine && String(p.categoryId) === String(vitrine._id);
    if (inVitrine && p.sortOrder === index + 1) {
      report.alreadyInVitrine.push(name);
    } else {
      report.toMove.push(`${name} (sortOrder → ${index + 1})`);
      moveOps.push({ _id: p._id, name, sortOrder: index + 1 });
    }
  });

  for (const c of sourceCats) {
    if (normalize(c.name) !== normalize("Vitrine")) report.categoriesToDelete.push(c.name);
  }

  console.log(`\n${APPLY ? "🚀 APPLY MODE" : "🔍 DRY RUN"} — Maison Naël Vitrine merge\n`);
  console.log(`Vitrine category: ${vitrine ? `exists (${vitrine._id})` : "will be created"}`);
  console.log(`\nAlready correctly in Vitrine (${report.alreadyInVitrine.length})`);
  console.log(`\nTo move/reorder into Vitrine (${report.toMove.length}):`);
  report.toMove.forEach((m) => console.log("  ~", m));
  console.log(`\nNot found in DB (${report.notFound.length}):`);
  report.notFound.forEach((m) => console.log("  ⚠", m));
  console.log(`\nSource categories to delete once emptied (${report.categoriesToDelete.length}):`);
  report.categoriesToDelete.forEach((m) => console.log("  -", m));

  if (!APPLY) {
    console.log("\n(dry run only — re-run with --apply to write these changes)\n");
    await mongoose.disconnect();
    return;
  }

  let vitrineId = vitrine?._id;
  if (!vitrineId) {
    // Slot Vitrine where the first source category currently sits.
    const anchor = sourceCats.slice().sort((a, b) => a.sortOrder - b.sortOrder)[0];
    const res = await db.collection("categories").insertOne({
      restaurantId,
      name: "Vitrine",
      description: "",
      sortOrder: anchor ? anchor.sortOrder : 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vitrineId = res.insertedId;
    console.log(`\n✅ Created category "Vitrine" (${vitrineId})`);
  }

  for (const op of moveOps) {
    await db.collection("products").updateOne(
      { _id: op._id },
      { $set: { categoryId: vitrineId, sortOrder: op.sortOrder, updatedAt: new Date() } }
    );
  }
  console.log(`✅ Moved/reordered ${moveOps.length} products into Vitrine`);

  // Delete source categories once they're empty (skip Vitrine itself if it was one of the names).
  let deletedCats = 0;
  for (const c of sourceCats) {
    if (String(c._id) === String(vitrineId)) continue;
    const remaining = await db.collection("products").countDocuments({ restaurantId, categoryId: c._id });
    if (remaining === 0) {
      await db.collection("categories").deleteOne({ _id: c._id });
      deletedCats++;
    } else {
      console.log(`⚠ Category "${c.name}" still has ${remaining} product(s) — not deleted`);
    }
  }
  console.log(`✅ Deleted ${deletedCats} now-empty source categories`);

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
