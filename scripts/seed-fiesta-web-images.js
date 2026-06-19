/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * seed-fiesta-web-images.js
 * Uploads each item photo to Cloudinary then seeds the database.
 * Run: node scripts/seed-fiesta-web-images.js
 */

const fs   = require("fs");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

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

// ── Progress (resume support) ─────────────────────────────────────────────────
const PROG = path.join(__dirname, ".fiesta-img-progress.json");
const load = () => fs.existsSync(PROG) ? JSON.parse(fs.readFileSync(PROG)) : {};
const save = (p) => fs.writeFileSync(PROG, JSON.stringify(p, null, 2));
const slug = (n) => n.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ── Item image URLs ───────────────────────────────────────────────────────────
const ITEMS = {
  "__logo__": "LOCAL:public/logos/image.png",

  // ── Pizzas ──────────────────────────────────────────────────────────────────
  "Margherita":          "https://images.unsplash.com/photo-1751110314750-4bd0746ae118?auto=format&fit=crop&w=800&q=85",
  "Pizza Thon":          "https://images.unsplash.com/photo-1639397753197-bab733459943?auto=format&fit=crop&w=800&q=85",
  "4 Saisons":           "https://images.unsplash.com/photo-1652036315072-fd8af2d0a684?auto=format&fit=crop&w=800&q=85",
  "4 Fromages":          "https://images.unsplash.com/photo-1762631179015-e8e8239f0ecf?auto=format&fit=crop&w=800&q=85",
  "Pizza Fruits de Mer": "https://images.unsplash.com/photo-1677643612263-49e89efd5345?auto=format&fit=crop&w=800&q=85",
  "Pizza Escalope":      "https://images.unsplash.com/photo-1652036315072-fd8af2d0a684?auto=format&fit=crop&w=800&q=85",

  // ── Sandwichs ───────────────────────────────────────────────────────────────
  "Libanais / Tabouna — Thon":                     "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?auto=format&fit=crop&w=800&q=85",
  "Libanais / Tabouna — Chawarma":                 "https://images.unsplash.com/photo-1561651823-d363931a0dd3?auto=format&fit=crop&w=800&q=85",
  "Libanais / Tabouna — Escalope grillée":         "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?auto=format&fit=crop&w=800&q=85",
  "Libanais / Tabouna — Escalope panée":           "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?auto=format&fit=crop&w=800&q=85",
  "Libanais / Tabouna — Cordon bleu":              "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?auto=format&fit=crop&w=800&q=85",
  "Makloub / Baguette farcie — Thon":              "https://images.pexels.com/photos/34593400/pexels-photo-34593400.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Makloub / Baguette farcie — Chawarma":          "https://images.pexels.com/photos/34593400/pexels-photo-34593400.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Makloub / Baguette farcie — Escalope grillée":  "https://images.pexels.com/photos/34593400/pexels-photo-34593400.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Makloub / Baguette farcie — Escalope panée":    "https://images.pexels.com/photos/34593400/pexels-photo-34593400.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Makloub / Baguette farcie — Cordon bleu":       "https://images.pexels.com/photos/34593400/pexels-photo-34593400.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Tacos — Thon":                                  "https://images.unsplash.com/photo-1565030851824-9f35aa628b0a?auto=format&fit=crop&w=800&q=85",
  "Tacos — Chawarma":                              "https://images.unsplash.com/photo-1565030851824-9f35aa628b0a?auto=format&fit=crop&w=800&q=85",
  "Tacos — Escalope grillée":                      "https://images.unsplash.com/photo-1565030851824-9f35aa628b0a?auto=format&fit=crop&w=800&q=85",
  "Tacos — Escalope panée":                        "https://images.unsplash.com/photo-1565030851824-9f35aa628b0a?auto=format&fit=crop&w=800&q=85",
  "Tacos — Cordon bleu":                           "https://images.unsplash.com/photo-1565030851824-9f35aa628b0a?auto=format&fit=crop&w=800&q=85",
  "Panozzo — Thon":                                "https://images.pexels.com/photos/5555754/pexels-photo-5555754.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Panozzo — Chawarma":                            "https://images.pexels.com/photos/5555754/pexels-photo-5555754.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Panozzo — Escalope grillée":                    "https://images.pexels.com/photos/5555754/pexels-photo-5555754.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Panozzo — Escalope panée":                      "https://images.pexels.com/photos/5555754/pexels-photo-5555754.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Panozzo — Cordon bleu":                         "https://images.pexels.com/photos/5555754/pexels-photo-5555754.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Paninis ─────────────────────────────────────────────────────────────────
  "Panini Thon fromage":     "https://images.pexels.com/photos/5555754/pexels-photo-5555754.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Panini Escalope fromage": "https://images.pexels.com/photos/5555754/pexels-photo-5555754.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Petit-déjeuner & Brunch ─────────────────────────────────────────────────
  "Petit-déjeuner express": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=85",
  "Petit-déjeuner matinal": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=85",
  "Brunch":                 "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=85",

  // ── Café chaud ───────────────────────────────────────────────────────────────
  "Espresso":           "https://images.pexels.com/photos/11160148/pexels-photo-11160148.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Américain":          "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=800&q=85",
  "Cappucin":           "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=85",
  "Café crème":         "https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?auto=format&fit=crop&w=800&q=85",
  "Cappuccino spécial": "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=85",
  "Chocolat au lait":   "https://images.pexels.com/photos/35210027/pexels-photo-35210027.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Tasse de lait":      "https://images.pexels.com/photos/2198626/pexels-photo-2198626.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Arôme café":         "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=85",
  "Café spéculoos":     "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=85",
  "Café Nutella":       "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?auto=format&fit=crop&w=800&q=85",
  "Chocolat chaud":     "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=85",

  // ── Boissons froides ─────────────────────────────────────────────────────────
  "Ice Coffee":   "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Thé infusion": "https://images.pexels.com/photos/824201/pexels-photo-824201.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Jus frais ────────────────────────────────────────────────────────────────
  "Jus citronnade": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=85",
  "Jus d'orange":   "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=800&q=85",
  "Jus fraise":     "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=800&q=85",
  "Jus cocktail":   "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Jwajem":         "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Autres boissons ──────────────────────────────────────────────────────────
  "Eau 0,5 L":   "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=85",
  "Eau 1 L":     "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=85",
  "Eau gazeuse": "https://images.pexels.com/photos/18212879/pexels-photo-18212879.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Canette":     "https://images.pexels.com/photos/5860659/pexels-photo-5860659.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Yaourt glacé":"https://images.pexels.com/photos/1591242/pexels-photo-1591242.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Supplément":  "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=85",

  // ── Milkshakes ───────────────────────────────────────────────────────────────
  "Milkshake Nutella":    "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Milkshake Oreo":       "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Milkshake Spéculoos":  "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Milkshake Supplément": "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Mojitos ──────────────────────────────────────────────────────────────────
  "Virgin Mojito": "https://images.pexels.com/photos/7259054/pexels-photo-7259054.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Blue Mojito":   "https://images.pexels.com/photos/8504563/pexels-photo-8504563.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Red Mojito":    "https://images.pexels.com/photos/36630839/pexels-photo-36630839.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Glaces & Frappuccino ─────────────────────────────────────────────────────
  "Frappuccino Nutella":   "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Frappuccino Oreo":      "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Frappuccino Spéculoos": "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Glace 2 boules":        "https://images.pexels.com/photos/36576776/pexels-photo-36576776.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Plats ────────────────────────────────────────────────────────────────────
  "Escalope grillée": "https://images.pexels.com/photos/10394213/pexels-photo-10394213.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Escalope panée":   "https://images.pexels.com/photos/6419716/pexels-photo-6419716.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Cordon bleu":      "https://images.pexels.com/photos/12349437/pexels-photo-12349437.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Dorade grillée":   "https://images.pexels.com/photos/19615790/pexels-photo-19615790.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Loup grillé":      "https://images.pexels.com/photos/19615790/pexels-photo-19615790.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Pâtes ────────────────────────────────────────────────────────────────────
  "Pâtes Poulet":        "https://images.pexels.com/photos/116738/pexels-photo-116738.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Pâtes Putanesca":     "https://images.pexels.com/photos/116738/pexels-photo-116738.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Pâtes Bolognaise":    "https://images.pexels.com/photos/116738/pexels-photo-116738.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Pâtes Fruits de mer": "https://images.pexels.com/photos/31235404/pexels-photo-31235404.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Lasagnes ─────────────────────────────────────────────────────────────────
  "Lasagnes Poulet":     "https://images.pexels.com/photos/16845653/pexels-photo-16845653.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Lasagnes Bolognaise": "https://images.pexels.com/photos/16845653/pexels-photo-16845653.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Entrées froides ──────────────────────────────────────────────────────────
  "Salade verte": "https://images.pexels.com/photos/8879386/pexels-photo-8879386.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Salade riz":   "https://images.pexels.com/photos/6169446/pexels-photo-6169446.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Salade césar": "https://images.pexels.com/photos/5639372/pexels-photo-5639372.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Entrées chaudes ──────────────────────────────────────────────────────────
  "Omelette thon fromage": "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=85",
  "Supplément fromage":    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=85",
  "Supplément jambon":     "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=85",
  "Supplément salami":     "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=85",
  "Supplément champignon": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=85",
  "Ojja mergez":           "https://images.pexels.com/photos/30144276/pexels-photo-30144276.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Ojja Escalope":         "https://images.pexels.com/photos/30144276/pexels-photo-30144276.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Ojja fruit de mer":     "https://images.pexels.com/photos/30144276/pexels-photo-30144276.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Gâteaux et tartes ────────────────────────────────────────────────────────
  "Gâteaux du jour":     "https://images.pexels.com/photos/36590618/pexels-photo-36590618.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Tarte du jour":       "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Cheesecake":          "https://images.pexels.com/photos/28835214/pexels-photo-28835214.jpeg?auto=compress&cs=tinysrgb&w=800",
  "1 kg de mini-gâteaux":"https://images.pexels.com/photos/36590618/pexels-photo-36590618.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Verrine":             "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Tarte aux amandes":   "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Cookies":             "https://images.pexels.com/photos/8478048/pexels-photo-8478048.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Brownies":            "https://images.pexels.com/photos/15033468/pexels-photo-15033468.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Fondant au chocolat": "https://images.pexels.com/photos/27819688/pexels-photo-27819688.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Muffin":              "https://images.pexels.com/photos/34275127/pexels-photo-34275127.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Grand cake":          "https://images.pexels.com/photos/36590618/pexels-photo-36590618.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Petit cake":          "https://images.pexels.com/photos/36590618/pexels-photo-36590618.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Cake rond":           "https://images.pexels.com/photos/36590618/pexels-photo-36590618.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Tranche de cake":     "https://images.pexels.com/photos/36590618/pexels-photo-36590618.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Viennoiseries & Snacks ───────────────────────────────────────────────────
  "Croissant nature":       "https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Pain au chocolat":       "https://images.pexels.com/photos/1756665/pexels-photo-1756665.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Chnack aux raisins":     "https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Croissant aux amandes":  "https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Croissont Spécial":      "https://images.pexels.com/photos/1756665/pexels-photo-1756665.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Pain suisse":            "https://images.pexels.com/photos/1756665/pexels-photo-1756665.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Danish aux fruits":      "https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Muffin Viennoiserie":    "https://images.pexels.com/photos/34275127/pexels-photo-34275127.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Millefeuille":           "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Spécial Millefeuille":   "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800",
};

// ── Upload one item ───────────────────────────────────────────────────────────
async function uploadItem(name, srcQuery, progress) {
  const key = name === "__logo__" ? "logo" : `item:${name}`;
  if (progress[key]) {
    console.log(`  ✓ (cached) ${name}`);
    return progress[key];
  }

  const srcUrl   = srcQuery.startsWith("LOCAL:")
    ? path.join(process.cwd(), srcQuery.slice(6))
    : srcQuery;
  const publicId = name === "__logo__" ? "logo" : `items/${slug(name)}`;

  try {
    console.log(`  ⬇  ${name}`);
    const result = await cloudinary.uploader.upload(srcUrl, {
      folder:        "fiesta-plus",
      public_id:     publicId,
      overwrite:     true,
      resource_type: "image",
    });
    progress[key] = result.secure_url;
    save(progress);
    console.log(`  ✅ ${name} → ${result.secure_url}`);
    await sleep(600);
    return result.secure_url;
  } catch (err) {
    console.error(`  ❌ ${name} — ${err.message}`);
    return null;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  const progress = load();
  const names    = Object.keys(ITEMS);

  console.log(`\n🖼  Uploading ${names.length} images to Cloudinary...\n`);
  let i = 0;
  for (const name of names) {
    i++;
    process.stdout.write(`[${i}/${names.length}] `);
    await uploadItem(name, ITEMS[name], progress);
  }

  // ── Seed database ───────────────────────────────────────────────────────────
  console.log("\n🌱 Seeding database...\n");
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "qr_menu_saas" });
  const db          = mongoose.connection.db;
  const users       = db.collection("users");
  const restaurants = db.collection("restaurants");
  const categories  = db.collection("categories");
  const products    = db.collection("products");
  const qrcodes     = db.collection("qrcodes");
  const now = new Date();
  const getDoc = (r) => r?.value ?? r;

  const adminEmail = "owner@fiesta-plus.tn";
  const adminHash  = await bcrypt.hash("FiestaPlus@2026", 12);
  const adminRes   = await users.findOneAndUpdate(
    { email: adminEmail },
    {
      $set: { name: "Fiesta+ Owner", email: adminEmail, passwordHash: adminHash, role: "restaurant_admin", mustChangePassword: false, updatedAt: now },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true, returnDocument: "after" }
  );
  const ownerId = getDoc(adminRes)?._id;

  const restRes = await restaurants.findOneAndUpdate(
    { slug: "fiesta-plus" },
    {
      $set: {
        ownerId,
        name: "Fiesta+", slug: "fiesta-plus", establishmentType: "cafe",
        tagline: "Resto · Café · Pâtisserie",
        description: "Un espace chaleureux alliant café de qualité, pâtisseries maison, pizzas artisanales, sandwichs généreux et plats savoureux.",
        phone: "", address: "Tunisie", instagram: "", facebook: "", googleMapsUrl: "",
        logo: progress["logo"] || "/logos/image.png",
        coverImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1800&q=90",
        primaryColor: "#1a1a1a", secondaryColor: "#f5f0e8", currency: "DT",
        isActive: true, showPrices: true, updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true, returnDocument: "after" }
  );
  const restaurantId = getDoc(restRes)?._id;

  // ── Categories ──────────────────────────────────────────────────────────────
  const catData = [
    { key: "breakfast",       name: "Petit-déjeuner & Brunch", sortOrder: 1  },
    { key: "pizzas",          name: "Pizzas",                   sortOrder: 2  },
    { key: "sandwichs",       name: "Sandwich",                 sortOrder: 3  },
    { key: "paninis",         name: "Panini",                   sortOrder: 4  },
    { key: "plats",           name: "Plats",                    sortOrder: 5  },
    { key: "pates",           name: "Pâtes",                    sortOrder: 6  },
    { key: "lasagnes",        name: "Lasagnes",                 sortOrder: 7  },
    { key: "entrees_froides", name: "Entrées froides",          sortOrder: 8  },
    { key: "entrees_chaudes", name: "Entrées chaudes",          sortOrder: 9  },
    { key: "cafes",           name: "Café chaud",               sortOrder: 10 },
    { key: "froides",         name: "Boissons froides",         sortOrder: 11 },
    { key: "jus",             name: "Jus frais",                sortOrder: 12 },
    { key: "milkshakes",      name: "Milkshake",                sortOrder: 13 },
    { key: "mojitos",         name: "Mojito",                   sortOrder: 14 },
    { key: "glaces",          name: "Glaces & Frappuccino",     sortOrder: 15 },
    { key: "autres",          name: "Autres boissons",          sortOrder: 16 },
    { key: "patisseries",     name: "Gâteaux et tartes",        sortOrder: 17 },
    { key: "viennoiseries",   name: "Viennoiseries & Snacks",   sortOrder: 18 },
  ];

  const catIds = {};
  for (const cat of catData) {
    const r = await categories.findOneAndUpdate(
      { restaurantId, name: cat.name },
      { $set: { restaurantId, name: cat.name, description: "", isActive: true, sortOrder: cat.sortOrder, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true, returnDocument: "after" }
    );
    catIds[cat.key] = getDoc(r)?._id;
  }

  // ── Products ────────────────────────────────────────────────────────────────
  const productMeta = {
    // Petit-déjeuner & Brunch
    "Petit-déjeuner express":  { c: "breakfast",       p: 8.5,  b: "" },
    "Petit-déjeuner matinal":  { c: "breakfast",       p: 14.5, b: "Populaire" },
    "Brunch":                  { c: "breakfast",       p: 47,   b: "Signature" },

    // Pizzas
    "Margherita":              { c: "pizzas",          p: 12.5, b: "" },
    "Pizza Thon":              { c: "pizzas",          p: 16.5, b: "Populaire" },
    "Pizza Escalope":          { c: "pizzas",          p: 17,   b: "" },
    "4 Saisons":               { c: "pizzas",          p: 18.5, b: "" },
    "4 Fromages":              { c: "pizzas",          p: 19,   b: "" },
    "Pizza Fruits de Mer":     { c: "pizzas",          p: 22,   b: "Signature" },

    // Sandwichs
    "Libanais / Tabouna — Thon":                    { c: "sandwichs", p: 10,   b: "" },
    "Libanais / Tabouna — Chawarma":                { c: "sandwichs", p: 10,   b: "Populaire" },
    "Libanais / Tabouna — Escalope grillée":        { c: "sandwichs", p: 10,   b: "" },
    "Libanais / Tabouna — Escalope panée":          { c: "sandwichs", p: 10,   b: "" },
    "Libanais / Tabouna — Cordon bleu":             { c: "sandwichs", p: 10,   b: "" },
    "Makloub / Baguette farcie — Thon":             { c: "sandwichs", p: 11.5, b: "" },
    "Makloub / Baguette farcie — Chawarma":         { c: "sandwichs", p: 11.5, b: "" },
    "Makloub / Baguette farcie — Escalope grillée": { c: "sandwichs", p: 11.5, b: "" },
    "Makloub / Baguette farcie — Escalope panée":   { c: "sandwichs", p: 11.5, b: "" },
    "Makloub / Baguette farcie — Cordon bleu":      { c: "sandwichs", p: 11.5, b: "" },
    "Tacos — Thon":                                 { c: "sandwichs", p: 12.5, b: "" },
    "Tacos — Chawarma":                             { c: "sandwichs", p: 12.5, b: "Populaire" },
    "Tacos — Escalope grillée":                     { c: "sandwichs", p: 12.5, b: "" },
    "Tacos — Escalope panée":                       { c: "sandwichs", p: 12.5, b: "" },
    "Tacos — Cordon bleu":                          { c: "sandwichs", p: 12.5, b: "" },
    "Panozzo — Thon":                               { c: "sandwichs", p: 13,   b: "" },
    "Panozzo — Chawarma":                           { c: "sandwichs", p: 13,   b: "" },
    "Panozzo — Escalope grillée":                   { c: "sandwichs", p: 13,   b: "" },
    "Panozzo — Escalope panée":                     { c: "sandwichs", p: 13,   b: "" },
    "Panozzo — Cordon bleu":                        { c: "sandwichs", p: 13,   b: "" },

    // Paninis
    "Panini Thon fromage":     { c: "paninis", p: 6.5, b: "" },
    "Panini Escalope fromage": { c: "paninis", p: 7.5, b: "Populaire" },

    // Plats
    "Escalope grillée": { c: "plats", p: 19,   b: "" },
    "Escalope panée":   { c: "plats", p: 19.5, b: "Populaire" },
    "Cordon bleu":      { c: "plats", p: 20.5, b: "Signature" },
    "Dorade grillée":   { c: "plats", p: 25,   b: "" },
    "Loup grillé":      { c: "plats", p: 25,   b: "" },

    // Pâtes
    "Pâtes Poulet":        { c: "pates", p: 16.5, b: "" },
    "Pâtes Putanesca":     { c: "pates", p: 17,   b: "" },
    "Pâtes Bolognaise":    { c: "pates", p: 18,   b: "Populaire" },
    "Pâtes Fruits de mer": { c: "pates", p: 27,   b: "Signature" },

    // Lasagnes
    "Lasagnes Poulet":     { c: "lasagnes", p: 17, b: "" },
    "Lasagnes Bolognaise": { c: "lasagnes", p: 19, b: "Populaire" },

    // Entrées froides
    "Salade verte": { c: "entrees_froides", p: 9,    b: "" },
    "Salade riz":   { c: "entrees_froides", p: 9.5,  b: "" },
    "Salade césar": { c: "entrees_froides", p: 13,   b: "Populaire" },

    // Entrées chaudes
    "Omelette thon fromage": { c: "entrees_chaudes", p: 12.5, b: "" },
    "Ojja mergez":           { c: "entrees_chaudes", p: 16,   b: "Populaire" },
    "Ojja Escalope":         { c: "entrees_chaudes", p: 18,   b: "" },
    "Ojja fruit de mer":     { c: "entrees_chaudes", p: 22,   b: "Signature" },
    "Supplément fromage":    { c: "entrees_chaudes", p: 2,    b: "" },
    "Supplément jambon":     { c: "entrees_chaudes", p: 2,    b: "" },
    "Supplément salami":     { c: "entrees_chaudes", p: 2,    b: "" },
    "Supplément champignon": { c: "entrees_chaudes", p: 2,    b: "" },

    // Café chaud
    "Espresso":           { c: "cafes", p: 3,   b: "" },
    "Américain":          { c: "cafes", p: 3.2, b: "" },
    "Cappucin":           { c: "cafes", p: 3.2, b: "" },
    "Café crème":         { c: "cafes", p: 3.5, b: "" },
    "Cappuccino spécial": { c: "cafes", p: 4.5, b: "Populaire" },
    "Café spéculoos":     { c: "cafes", p: 4.5, b: "" },
    "Café Nutella":       { c: "cafes", p: 4.5, b: "Nouveau" },
    "Chocolat au lait":   { c: "cafes", p: 2.5, b: "" },
    "Chocolat chaud":     { c: "cafes", p: 4.5, b: "" },
    "Tasse de lait":      { c: "cafes", p: 1.5, b: "" },
    "Arôme café":         { c: "cafes", p: 1,   b: "" },

    // Boissons froides
    "Ice Coffee":   { c: "froides", p: 5,   b: "Populaire" },
    "Thé infusion": { c: "froides", p: 2.5, b: "" },

    // Jus frais
    "Jus citronnade": { c: "jus", p: 4,    b: "" },
    "Jus d'orange":   { c: "jus", p: 4.5,  b: "Populaire" },
    "Jus fraise":     { c: "jus", p: 7,    b: "" },
    "Jus cocktail":   { c: "jus", p: 9,    b: "" },
    "Jwajem":         { c: "jus", p: 12,   b: "Signature" },

    // Milkshakes
    "Milkshake Nutella":    { c: "milkshakes", p: 6.5, b: "Populaire" },
    "Milkshake Oreo":       { c: "milkshakes", p: 6.5, b: "" },
    "Milkshake Spéculoos":  { c: "milkshakes", p: 6.5, b: "" },
    "Milkshake Supplément": { c: "milkshakes", p: 1.5, b: "" },

    // Mojitos
    "Virgin Mojito": { c: "mojitos", p: 7.5, b: "" },
    "Blue Mojito":   { c: "mojitos", p: 8.5, b: "Populaire" },
    "Red Mojito":    { c: "mojitos", p: 8.5, b: "" },

    // Glaces & Frappuccino
    "Frappuccino Nutella":   { c: "glaces", p: 8.5, b: "Populaire" },
    "Frappuccino Oreo":      { c: "glaces", p: 8.5, b: "" },
    "Frappuccino Spéculoos": { c: "glaces", p: 8.5, b: "" },
    "Glace 2 boules":        { c: "glaces", p: 6,   b: "" },

    // Autres boissons
    "Eau 0,5 L":   { c: "autres", p: 1.8, b: "" },
    "Eau 1 L":     { c: "autres", p: 2.5, b: "" },
    "Eau gazeuse": { c: "autres", p: 3,   b: "" },
    "Canette":     { c: "autres", p: 3,   b: "" },
    "Yaourt glacé":{ c: "autres", p: 6.5, b: "" },
    "Supplément":  { c: "autres", p: 1.5, b: "" },

    // Gâteaux et tartes
    "Tarte du jour":       { c: "patisseries", p: 5,    b: "" },
    "Tarte aux amandes":   { c: "patisseries", p: 5.5,  b: "" },
    "Cookies":             { c: "patisseries", p: 5.5,  b: "" },
    "Brownies":            { c: "patisseries", p: 5.5,  b: "" },
    "Fondant au chocolat": { c: "patisseries", p: 5.5,  b: "Populaire" },
    "Muffin":              { c: "patisseries", p: 3,    b: "" },
    "Gâteaux du jour":     { c: "patisseries", p: 6.5,  b: "" },
    "Verrine":             { c: "patisseries", p: 6.5,  b: "" },
    "Cheesecake":          { c: "patisseries", p: 7.5,  b: "Populaire" },
    "Petit cake":          { c: "patisseries", p: 8,    b: "" },
    "Grand cake":          { c: "patisseries", p: 11,   b: "" },
    "Cake rond":           { c: "patisseries", p: 13,   b: "Signature" },
    "1 kg de mini-gâteaux":{ c: "patisseries", p: 47,   b: "" },
    "Tranche de cake":     { c: "patisseries", p: 3,    b: "" },

    // Viennoiseries & Snacks
    "Croissant nature":      { c: "viennoiseries", p: 1.7, b: "" },
    "Pain au chocolat":      { c: "viennoiseries", p: 2,   b: "Populaire" },
    "Chnack aux raisins":    { c: "viennoiseries", p: 2,   b: "" },
    "Croissant aux amandes": { c: "viennoiseries", p: 2.5, b: "" },
    "Croissont Spécial":     { c: "viennoiseries", p: 3,   b: "Signature" },
    "Pain suisse":           { c: "viennoiseries", p: 2.5, b: "" },
    "Danish aux fruits":     { c: "viennoiseries", p: 3,   b: "" },
    "Muffin Viennoiserie":   { c: "viennoiseries", p: 3,   b: "" },
    "Millefeuille":          { c: "viennoiseries", p: 2,   b: "" },
    "Spécial Millefeuille":  { c: "viennoiseries", p: 2.7, b: "Populaire" },
  };

  let sortOrder = 0;
  for (const [name, meta] of Object.entries(productMeta)) {
    sortOrder++;
    const imageUrl = progress[`item:${name}`] || "";
    await products.findOneAndUpdate(
      { restaurantId, name },
      {
        $set: {
          restaurantId,
          categoryId: catIds[meta.c],
          name,
          description: name,
          price: meta.p,
          image: imageUrl,
          badge: meta.b || "",
          isAvailable: true,
          isFeatured: meta.b === "Populaire" || meta.b === "Signature",
          sortOrder,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );
  }

  await qrcodes.findOneAndUpdate(
    { restaurantId },
    {
      $set: { restaurantId, targetUrl: "http://localhost:3000/menu/fiesta-plus", qrImageUrl: "", updatedAt: now },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  );

  await mongoose.disconnect();
  console.log("\n✅ Done! Fiesta+ seeded with real images.");
  console.log("   Login:  owner@fiesta-plus.tn / FiestaPlus@2026");
  console.log("   Menu:   http://localhost:3000/menu/fiesta-plus\n");
}

run().catch(async (err) => {
  console.error("❌", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
