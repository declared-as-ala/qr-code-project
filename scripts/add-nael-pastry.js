/* eslint-disable @typescript-eslint/no-require-imports */
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

const PROG_PATH = path.join(__dirname, ".nael-img-progress.json");
const progress = fs.existsSync(PROG_PATH) ? JSON.parse(fs.readFileSync(PROG_PATH)) : {};
const img = (name) => progress["item:" + name] || "";

const CATEGORIES = [
  { key: "viennoiseries_sucrees", name: "Viennoiseries sucrées",  sortOrder: 14 },
  { key: "viennoiseries_salees",  name: "Viennoiseries salées",   sortOrder: 15 },
  { key: "biscuits_secs",         name: "Biscuits secs",          sortOrder: 16 },
];

const DESCRIPTIONS = {
  "Biscuit italien":          "55 DT/kg",
  "Biscuit soleil":           "60 DT/kg",
  "Madeleine vanille":        "35 DT/kg",
  "Madeleine chocolat":       "45 DT/kg",
  "Financier vanille amande": "60 DT/kg",
  "Financier pistache":       "92 DT/kg",
};

// [name, catKey, price, badge, imageUrl]
const PRODUCTS = [
  // Viennoiseries sucrées
  ["Croissant nature",            "viennoiseries_sucrees", 3,    "",          img("Croissant nature")            || "https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Chocolatine",                 "viennoiseries_sucrees", 3.8,  "Populaire", img("Chocolatine")                 || "https://images.pexels.com/photos/1756665/pexels-photo-1756665.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Suisse Gourmand",             "viennoiseries_sucrees", 4.3,  "",          img("Suisse Gourmand")             || "https://images.pexels.com/photos/1756665/pexels-photo-1756665.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Pain aux raisins",            "viennoiseries_sucrees", 3.5,  "",          img("Pain aux raisins")            || "https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Nuage Citron",                "viennoiseries_sucrees", 4.5,  "",          img("Nuage Citron")                || "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Rubis pistache",              "viennoiseries_sucrees", 8.5,  "Signature", img("Rubis Pistache")              || "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Amandine",                    "viennoiseries_sucrees", 5.8,  "",          img("Amandine")                    || "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Danish Myrtille",             "viennoiseries_sucrees", 8.5,  "",          img("Danish Myrtille")             || "https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Danish Framboise Elegance",   "viennoiseries_sucrees", 12,   "Signature", img("Danish Framboise Elegance")   || "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Danish Fraise",               "viennoiseries_sucrees", 5.5,  "Populaire", img("Danish Fraise")               || "https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Coeur Cookie",                "viennoiseries_sucrees", 7,    "Nouveau",   img("Coeur Cookie")                || "https://images.pexels.com/photos/8478048/pexels-photo-8478048.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Papillon Caramel Beurre Sale","viennoiseries_sucrees", 6.5,  "Signature", img("Papillon Caramel Beurre Sale")|| "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Papillon Rubis",              "viennoiseries_sucrees", 6.5,  "",          "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800"],

  // Viennoiseries salées
  ["Le Suisse Gourmet",           "viennoiseries_salees",  6.5,  "",          img("Le Suisse Gourmet")           || "https://images.pexels.com/photos/5555754/pexels-photo-5555754.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Danish Forestier",            "viennoiseries_salees",  7.8,  "Populaire", img("Danish Forestier")            || "https://images.pexels.com/photos/5555754/pexels-photo-5555754.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Danish Italien",              "viennoiseries_salees",  9.5,  "Signature", img("Danish Italien")              || "https://images.pexels.com/photos/5555754/pexels-photo-5555754.jpeg?auto=compress&cs=tinysrgb&w=800"],

  // Biscuits secs
  ["Cake marbre",                 "biscuits_secs",         23,   "",          img("Cake marbre")                 || "https://images.pexels.com/photos/36590618/pexels-photo-36590618.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Cake amande sans gluten",     "biscuits_secs",         11,   "",          img("Cake amande sans gluten")     || "https://images.pexels.com/photos/36590618/pexels-photo-36590618.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Biscuit italien",             "biscuits_secs",         55,   "",          img("Biscuit italien")             || "https://images.pexels.com/photos/8478048/pexels-photo-8478048.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Biscuit soleil",              "biscuits_secs",         60,   "",          img("Biscuit soleil")              || "https://images.pexels.com/photos/8478048/pexels-photo-8478048.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Madeleine vanille",           "biscuits_secs",         35,   "Populaire", img("Madeleine vanille")           || "https://images.pexels.com/photos/8478048/pexels-photo-8478048.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Madeleine chocolat",          "biscuits_secs",         45,   "",          img("Madeleine chocolat")          || "https://images.pexels.com/photos/8478048/pexels-photo-8478048.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Financier vanille amande",    "biscuits_secs",         60,   "",          img("Financier vanille amande")    || "https://images.pexels.com/photos/8478048/pexels-photo-8478048.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Financier pistache",          "biscuits_secs",         92,   "Signature", img("Financier pistache")          || "https://images.pexels.com/photos/8478048/pexels-photo-8478048.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Cookies chocolat noisette",   "biscuits_secs",         9.5,  "Populaire", img("Cookies chocolat noisette")   || "https://images.pexels.com/photos/8478048/pexels-photo-8478048.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Cookies pistache chocolat blanc","biscuits_secs",      12.5, "",          img("Cookies pistache chocolat blanc") || "https://images.pexels.com/photos/8478048/pexels-photo-8478048.jpeg?auto=compress&cs=tinysrgb&w=800"],
];

// Display names with proper accents (separate from DB keys)
const DISPLAY_NAMES = {
  "Danish Framboise Elegance":    "Danish Framboise Élégance",
  "Coeur Cookie":                 "Cœur Cookie",
  "Papillon Caramel Beurre Sale": "Papillon Caramel Beurre Salé",
  "Cake marbre":                  "Cake marbré",
};

async function run() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "qr_menu_saas" });
  const db = mongoose.connection.db;
  const categories = db.collection("categories");
  const products   = db.collection("products");
  const now = new Date();

  const restaurant = await db.collection("restaurants").findOne({ slug: "maison-nael" });
  if (!restaurant) throw new Error("MAISON NAEL not found");
  const restaurantId = restaurant._id;

  // Insert categories
  const catIds = {};
  for (const cat of CATEGORIES) {
    const res = await categories.insertOne({
      restaurantId, name: cat.name, description: "", isActive: true,
      sortOrder: cat.sortOrder, createdAt: now, updatedAt: now,
    });
    catIds[cat.key] = res.insertedId;
    console.log("+ Category:", cat.name);
  }

  // Get current max sortOrder
  const maxProd = await products.find({ restaurantId }).sort({ sortOrder: -1 }).limit(1).toArray();
  let sortOrder = maxProd[0]?.sortOrder || 0;

  for (const [nameKey, catKey, price, badge, imageUrl] of PRODUCTS) {
    sortOrder++;
    const displayName = DISPLAY_NAMES[nameKey] || nameKey;
    await products.insertOne({
      restaurantId,
      categoryId:  catIds[catKey],
      name:        displayName,
      description: DESCRIPTIONS[displayName] || displayName,
      price,
      image:       imageUrl || "",
      badge:       badge || "",
      isAvailable: true,
      isFeatured:  badge === "Populaire" || badge === "Signature",
      sortOrder,
      createdAt:   now,
      updatedAt:   now,
    });
    console.log("  +", displayName, price + " DT");
  }

  console.log("\n✅ Done! Added 3 categories,", PRODUCTS.length, "products.");
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("❌", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
