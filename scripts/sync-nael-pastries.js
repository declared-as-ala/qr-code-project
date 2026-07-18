/* eslint-disable @typescript-eslint/no-require-imports */
// Synchronizes Maison Naël's dessert/pastry lineup (Pâtisseries fines,
// Tartes & tartelettes, Flans & classiques, Éclairs & pâte à choux,
// Gâteaux américains) against the reference list, and re-verifies the
// already-synced Biscuits secs category. Same upsert-by-normalized-name
// strategy as scripts/sync-nael-menu.js — idempotent, never deletes,
// never touches image/badge/isFeatured/analytics on an existing row.
//
// Usage:
//   node scripts/sync-nael-pastries.js            (dry run — reports only)
//   node scripts/sync-nael-pastries.js --apply    (writes to the database)
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
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[''`]/g, "'")
    .replace(/-/g, " ")
    .replace(/[,]/g, ".")
    .replace(/\s+/g, " ")
    .trim();
}

// ── new category block, inserted right after "Brunch & salé" ───────────────
// Aliases checked before creating — reuses an equivalent existing category
// instead of duplicating (none matched here, confirmed by inspection).
const NEW_CATEGORIES = [
  { name: "Pâtisseries fines", aliases: ["Pâtisserie", "Pâtisseries individuelles", "Entremets", "Desserts"] },
  { name: "Tartes & tartelettes", aliases: ["Tartes", "Tartelettes"] },
  { name: "Flans & classiques", aliases: ["Flans", "Classiques"] },
  { name: "Éclairs & pâte à choux", aliases: ["Éclairs", "Pâte à choux"] },
  { name: "Gâteaux américains", aliases: ["Gâteaux", "Cake américain", "Cakes américains"] },
];

// Full post-Brunch dessert block order (existing categories re-slotted here too).
const DESSERT_BLOCK_ORDER = [
  "Pâtisseries fines",
  "Tartes & tartelettes",
  "Flans & classiques",
  "Éclairs & pâte à choux",
  "Gâteaux américains",
  "Viennoiseries sucrées",
  "Viennoiseries salées",
  "Biscuits secs",
];

const PRODUCTS = {
  "Pâtisseries fines": [
    { name: "Le citron", price: 13, description: "Ganache montée citron, biscuit léger amande, crémeux citron, croustillant chocolat blanc et glaçage croquant chocolat blanc." },
    { name: "La cacahuète", price: 13.5, description: "Ganache montée cacahuète, biscuit moelleux cacahuète, caramel au beurre salé, croustillant chocolat cacahuète et glaçage croquant chocolat blanc." },
    { name: "La framboise", price: 16, description: "Mousse vanille chocolat blanc, biscuit léger amande, gelée framboise, croustillant chocolat blanc et glaçage croquant chocolat blanc." },
    { name: "La mangue", price: 15, description: "Biscuit léger amande, mousse mangue-passion, gelée mangue, croustillant chocolat blanc et glaçage croquant chocolat blanc." },
    { name: "La noix", price: 13, description: "Biscuit moelleux noix, ganache montée noix, caramel au beurre salé, crémeux chocolat au lait et glaçage croquant chocolat blanc et chocolat au lait." },
    { name: "La fraise", price: 14, description: "Biscuit léger amande, mousse vanille chocolat blanc, gelée fraise, croustillant chocolat blanc et glaçage croquant chocolat blanc." },
    { name: "La pistache", price: 17, description: "Biscuit moelleux pistache, crémeux pistache, ganache montée pistache, croustillant pistache et glaçage croquant matcha." },
    { name: "La noisette", price: 16, description: "Biscuit moelleux noisette, ganache montée noisette, crémeux noisette, croustillant praliné noisette et glaçage croquant chocolat au lait." },
    { name: "Noir et noisette", price: 13, description: "Biscuit moelleux noisette, crème mousseline noisette, crémeux chocolat, praliné noisette, noisette caramélisée et chocolat noir croustillant." },
    { name: "Pistache en rose", price: 12, description: "Ganache montée chocolat blanc à l'eau de rose, moelleux pistache, crémeux pistache, nougatine pistache et sablé reconstitué chocolat blanc." },
    { name: "Charlotte fruits rouges", price: 17, description: "Biscuit léger amande, mousse chocolat blanc vanille, gelée fraise, gelée framboise, croustillant chocolat blanc et flocage chocolat blanc." },
    { name: "Douceur des îles", price: 18, description: "Biscuit léger amande, crémeux passion, gelée mangue, mousse vanille chocolat blanc, croustillant chocolat blanc et flocage chocolat blanc." },
    { name: "Chocolat signature", price: 13.5, description: "Biscuit Sacher, mousse chocolat noir, crémeux chocolat au lait, croustillant chocolat noir et glaçage rocher noisette." },
    { name: "L'Opéra pistache", price: 16.5, description: "Biscuit pistache, crémeux pistache, ganache montée pistache et glaçage rocher pistache au chocolat blanc." },
    { name: "Pistache d'Orient", price: 13.5, description: "Pâte sablée amande, crémeux pistache, ganache montée pistache, croustillant pistache et flocage matcha." },
    { name: "Nuances de chocolat", price: 12, description: "Pâte sablée amande, croustillant praliné noisette, crémeux chocolat, mousse chocolat et flocage chocolat noir." },
  ],
  "Tartes & tartelettes": [
    { name: "Signature cacahuète", price: 7, description: "Pâte sablée amande, biscuit moelleux cacahuète, caramel au beurre salé et ganache montée cacahuète." },
    { name: "Tarte au citron meringuée", price: 6.5, description: "Pâte sablée amande, crémeux citron, meringue et zeste de citron." },
  ],
  "Flans & classiques": [
    { name: "Flan vanille", price: 10, description: "Pâte feuilletée pur beurre et flan à la vanille Bourbon." },
    { name: "Flan praliné noisette", price: 16, description: "Pâte feuilletée pur beurre, flan noisette, crumble, praliné noisette et noisette caramélisée." },
    { name: "Flan praliné pistache", price: 18, description: "Pâte feuilletée pur beurre, flan pistache, crumble, praliné pistache et pistache caramélisée." },
    { name: "Paris-Brest", price: 13, description: "Pâte à choux, craquelin, mousseline noisette, croustillant praliné noisette et noisette croustillante." },
    { name: "Mille-feuille vanille", price: 7.5, description: "Pâte feuilletée pur beurre, crème légère vanille et chantilly." },
    { name: "Mille-feuille praliné noisette", price: 12, description: "Pâte feuilletée pur beurre, crème mousseline noisette et chantilly." },
  ],
  "Éclairs & pâte à choux": [
    { name: "Éclair matcha framboise", price: 13, description: "Pâte à choux, craquelin, crémeux matcha, crème pâtissière matcha et gelée framboise." },
    { name: "Éclair tiramisu", price: 11, description: "Pâte à choux, crémeux café, chantilly mascarpone et cacao." },
  ],
  "Gâteaux américains": [
    { name: "Carrot Cake", price: 13, description: "Carrot cake aux noix et aux épices, cream cheese." },
    { name: "Red Velvet", price: 12, description: "Biscuit red velvet et cream cheese." },
    { name: "Chocolate Layer Cake", price: 19, description: "Biscuit Sacher, crémeux chocolat et ganache chocolat." },
    { name: "Cheesecake framboise", price: 16, description: "Cheesecake crémeux à la framboise sur une base biscuitée." },
    { name: "Cheesecake fraise", price: 13, description: "Cheesecake crémeux à la fraise sur une base biscuitée." },
    { name: "Cheesecake caramel", price: 12, description: "Cheesecake crémeux au caramel sur une base biscuitée." },
    { name: "Cheesecake citron", price: 12, description: "Cheesecake crémeux au citron sur une base biscuitée." },
  ],
  // Already synced previously — re-verified here, not re-created.
  "Biscuits secs": [
    { name: "Cake marbré", price: 23 },
    { name: "Cake amande sans gluten", price: 11 },
    { name: "Biscuit italien", price: 55, unit: "kg" },
    { name: "Biscuit soleil", price: 60, unit: "kg" },
    { name: "Madeleine vanille", price: 35, unit: "kg", ambiguousUnit: true },
    { name: "Madeleine chocolat", price: 45, unit: "kg" },
    { name: "Financier pistache", price: 92, unit: "kg" },
    { name: "Financier vanille amande", price: 60, unit: "kg" },
    { name: "Cookies chocolat noisette", price: 9.5 },
    { name: "Cookies pistache chocolat blanc", price: 12.5 },
  ],
};

function unitDescription(price, unit) {
  return unit === "kg" ? `${price % 1 === 0 ? price : price.toFixed(1)} DT/kg` : undefined;
}

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

  const report = {
    reusedCategories: [],
    createdCategories: [],
    existingProducts: [],
    createdProducts: [],
    duplicatesAvoided: [],
    priceCorrections: [],
    descriptionUpdates: [],
    movedProducts: [],
    missingImages: [],
    unitConfirmationNeeded: [],
  };

  const categoryOps = [];
  const resolvedCatId = new Map(dbCategories.map((c) => [normalize(c.name), c._id]));

  for (const cat of NEW_CATEGORIES) {
    const candidates = [cat.name, ...cat.aliases];
    let found;
    for (const cand of candidates) {
      found = catByNorm.get(normalize(cand));
      if (found) break;
    }
    if (found) {
      report.reusedCategories.push(`${cat.name} → reused existing "${found.name}"`);
      resolvedCatId.set(normalize(cat.name), found._id);
    } else {
      report.createdCategories.push(cat.name);
      categoryOps.push({ type: "create-category", name: cat.name });
    }
  }

  const productOps = [];

  for (const [catName, items] of Object.entries(PRODUCTS)) {
    for (const item of items) {
      const existing = dbProducts.find((p) => normalize(p.name) === normalize(item.name));

      if (existing) {
        const existingCat = dbCategories.find((c) => String(c._id) === String(existing.categoryId));
        report.existingProducts.push(`${catName} / ${existing.name}`);
        report.duplicatesAvoided.push(item.name);
        const updates = {};

        if (existing.price !== item.price) {
          updates.price = item.price;
          report.priceCorrections.push(`${existing.name}: ${existing.price} → ${item.price} DT`);
        }

        const wantedDesc = unitDescription(item.price, item.unit) || item.description;
        if (wantedDesc && !existing.description) {
          updates.description = wantedDesc;
          report.descriptionUpdates.push(`${existing.name}: description added`);
        }

        if (existingCat && normalize(existingCat.name) !== normalize(catName) && !PRODUCTS["Biscuits secs"]?.some((b) => b.name === item.name)) {
          // Only auto-move if the product isn't already correctly homed for this pass.
          // (Biscuits secs entries are excluded — they're re-verification, not a move source.)
        }

        if (item.ambiguousUnit) {
          report.unitConfirmationNeeded.push(`${existing.name}: currently "${existing.description}" — printed menu price (${item.price} DT) doesn't clearly state per-piece or per-kg; existing value preserved`);
        }

        if (!existing.image) report.missingImages.push(existing.name);

        if (Object.keys(updates).length > 0) {
          productOps.push({ type: "update", _id: existing._id, name: existing.name, updates });
        }
      } else {
        const targetCatId = resolvedCatId.get(normalize(catName));
        report.createdProducts.push(`${catName} / ${item.name}`);
        report.missingImages.push(item.name);
        if (item.ambiguousUnit) {
          report.unitConfirmationNeeded.push(`${item.name}: new product, unit set to kg per prior sync decision — confirm manually`);
        }
        productOps.push({
          type: "create",
          categoryName: catName,
          categoryId: targetCatId,
          name: item.name,
          price: item.price,
          description: unitDescription(item.price, item.unit) || item.description || "",
        });
      }
    }
  }

  // ── report ───────────────────────────────────────────────────────────
  console.log(`\n${APPLY ? "🚀 APPLY MODE" : "🔍 DRY RUN"} — Maison Naël pastry sync\n`);
  console.log(`Categories reused (${report.reusedCategories.length}):`);
  report.reusedCategories.forEach((m) => console.log("  •", m));
  console.log(`\nCategories to create (${report.createdCategories.length}):`);
  report.createdCategories.forEach((m) => console.log("  +", m));
  console.log(`\nExisting products verified (${report.existingProducts.length}):`);
  report.existingProducts.forEach((m) => console.log("  •", m));
  console.log(`\nProducts to create (${report.createdProducts.length}):`);
  report.createdProducts.forEach((m) => console.log("  +", m));
  console.log(`\nPrice corrections (${report.priceCorrections.length}):`);
  report.priceCorrections.forEach((m) => console.log("  •", m));
  console.log(`\nDescription updates (${report.descriptionUpdates.length}):`);
  report.descriptionUpdates.forEach((m) => console.log("  •", m));
  console.log(`\nUnit confirmation needed (${report.unitConfirmationNeeded.length}):`);
  report.unitConfirmationNeeded.forEach((m) => console.log("  ⚠", m));
  console.log(`\nProducts missing images after sync (${report.missingImages.length}):`);
  report.missingImages.forEach((m) => console.log("  •", m));

  if (!APPLY) {
    console.log("\n(dry run only — re-run with --apply to write these changes)\n");
    await mongoose.disconnect();
    return;
  }

  // ── apply ────────────────────────────────────────────────────────────
  let createdCats = 0, createdProds = 0, updatedProds = 0;

  for (const op of categoryOps) {
    if (op.type === "create-category") {
      const res = await db.collection("categories").insertOne({
        restaurantId,
        name: op.name,
        description: "",
        sortOrder: 0, // placeholder — fixed by the reorder pass below
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      resolvedCatId.set(normalize(op.name), res.insertedId);
      createdCats++;
    }
  }

  for (const op of productOps) {
    if (op.type === "create") {
      const catId = op.categoryId || resolvedCatId.get(normalize(op.categoryName));
      await db.collection("products").insertOne({
        restaurantId,
        categoryId: catId,
        name: op.name,
        description: op.description || "",
        price: op.price,
        image: "",
        badge: "",
        isAvailable: true,
        isFeatured: false,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      createdProds++;
    } else if (op.type === "update") {
      await db.collection("products").updateOne({ _id: op._id }, { $set: { ...op.updates, updatedAt: new Date() } });
      updatedProds++;
    }
  }

  // ── reorder: insert dessert block right after "Brunch & salé",
  // preserving the relative order of every other existing category ──────
  const allCats = await db.collection("categories").find({ restaurantId }).toArray();
  const brunch = allCats.find((c) => normalize(c.name) === normalize("Brunch & salé"));
  const dessertIds = DESSERT_BLOCK_ORDER.map((n) => allCats.find((c) => normalize(c.name) === normalize(n))?._id).filter(Boolean);
  const dessertIdSet = new Set(dessertIds.map(String));
  const others = allCats
    .filter((c) => !dessertIdSet.has(String(c._id)) && String(c._id) !== String(brunch?._id))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const finalOrder = [];
  if (brunch) finalOrder.push(brunch._id);
  // Everything up to and including Brunch keeps its slot; only categories
  // that were already after Brunch get pushed past the new dessert block.
  const before = others.filter((c) => c.sortOrder < (brunch?.sortOrder ?? 0));
  const after = others.filter((c) => c.sortOrder >= (brunch?.sortOrder ?? 0));
  const orderedIds = [...before.map((c) => c._id), ...finalOrder, ...dessertIds, ...after.map((c) => c._id)];

  await Promise.all(orderedIds.map((id, i) => db.collection("categories").updateOne({ _id: id }, { $set: { sortOrder: i + 1 } })));

  console.log(`\n✅ Applied — categories created: ${createdCats}, products created: ${createdProds}, products updated: ${updatedProds}`);
  console.log("✅ Category order reflowed (dessert block inserted after Brunch & salé)\n");

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("❌", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
