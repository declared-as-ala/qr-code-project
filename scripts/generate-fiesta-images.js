/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * generate-fiesta-images.js
 * 1. Uploads Fiesta+ logo to Cloudinary
 * 2. Generates every menu item image via DALL-E 3
 * 3. Uploads each generated image to Cloudinary
 * 4. Re-writes seed-fiesta.js with the permanent Cloudinary URLs
 * 5. Re-seeds the database
 *
 * Saves progress to .fiesta-progress.json so it can resume if interrupted.
 * Run: node scripts/generate-fiesta-images.js
 */

const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
const { v2: cloudinary } = require("cloudinary");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ── Load .env.local ──────────────────────────────────────────────────────────
const envLocalPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const lines = fs.readFileSync(envLocalPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith("#") || !line.includes("=")) continue;
    const [key, ...rest] = line.split("=");
    const value = rest.join("=");
    if (key && !(key in process.env)) process.env[key.trim()] = value.trim();
  }
}

// ── Clients ───────────────────────────────────────────────────────────────────
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Progress file (resume support) ───────────────────────────────────────────
const PROGRESS_FILE = path.join(__dirname, ".fiesta-progress.json");
function loadProgress() {
  return fs.existsSync(PROGRESS_FILE)
    ? JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8"))
    : {};
}
function saveProgress(p) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2));
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function toSlug(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uploadToCloudinary(source, publicId) {
  const result = await cloudinary.uploader.upload(source, {
    folder: "fiesta-plus",
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });
  return result.secure_url;
}

async function generateAndUpload(name, prompt, progress) {
  const key = `item:${name}`;
  if (progress[key]) {
    console.log(`  ✓ (cached) ${name}`);
    return progress[key];
  }
  console.log(`  🎨 Generating: ${name}`);
  try {
    const res = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "medium",
    });
    const img = res.data[0];
    let source;
    if (img.url) {
      source = img.url; // temporary OpenAI URL → upload directly to Cloudinary
    } else if (img.b64_json) {
      source = `data:image/png;base64,${img.b64_json}`; // base64 → Cloudinary
    } else {
      throw new Error("No image data in response");
    }
    const cloudUrl = await uploadToCloudinary(source, `items/${toSlug(name)}`);
    progress[key] = cloudUrl;
    saveProgress(progress);
    console.log(`  ✅ ${name} → ${cloudUrl}`);
    await sleep(13000); // ~4.5 img/min — stays under DALL-E 3 rate limit
    return cloudUrl;
  } catch (err) {
    console.error(`  ❌ Failed: ${name} — ${err.message}`);
    return null;
  }
}

// ── DALL-E prompts per menu item ──────────────────────────────────────────────
const PROMPTS = {
  // Petit-déjeuner & Brunch
  "Express": "Professional café food photography, single espresso shot in a small white ceramic cup with golden crema, dark wooden table, natural side lighting, overhead shot",
  "Petit-déjeuner Matinal": "Professional food photography of a morning breakfast tray: small espresso cup, buttered croissant and fresh orange juice on a white marble table, warm natural light, overhead shot",
  "Brunch": "Professional food photography of an abundant brunch spread: avocado toast, poached eggs, pastries, fresh fruit bowl, coffee and juice on a wooden table, bright natural light, overhead flat-lay",

  // Crêpes Sucrées
  "Crêpe Chocolat": "Professional food photography of a thin French crêpe folded into a triangle, filled with dark melted chocolate, dusted with powdered sugar, on a white ceramic plate, overhead shot, natural light",
  "Crêpe Nutella": "Professional food photography of a delicate French crêpe spread with Nutella and crushed hazelnuts, folded into a quarter, on a white plate with a drizzle of Nutella, overhead shot",

  // Crêpes Salées
  "Crêpe Fromage": "Professional food photography of a golden buckwheat galette filled with melted gruyère cheese, folded into a square, steam rising, on a white plate, overhead shot",
  "Crêpe Thon": "Professional food photography of a savory galette filled with tuna flakes, capers and herbs, folded, on a white plate, overhead shot, restaurant quality",
  "Crêpe Jambon/Salami Fromage": "Professional food photography of a savory crêpe filled with ham, salami and melted cheese, golden edges, folded into a rectangle on a white plate, overhead shot",
  "Crêpe Thon & Fromage": "Professional food photography of a savory buckwheat galette filled with tuna and melted Swiss cheese, folded square, on a white plate, overhead shot",
  "Crêpe Escalope & Fromage": "Professional food photography of a savory crêpe filled with sliced grilled chicken and melted cheese, golden and crispy edges, folded on a white plate, overhead shot",

  // Gaufres
  "Gaufre Chocolat": "Professional food photography of golden Belgian waffles with warm dark chocolate sauce drizzled over them, on a white plate, overhead shot, natural light",
  "Gaufre Nutella": "Professional food photography of crispy golden Belgian waffles generously topped with Nutella, crushed hazelnuts and a dusting of icing sugar, white plate, overhead shot",

  // Pizzas
  "Margherita": "Professional food photography of a freshly baked Margherita pizza with tomato sauce, melted mozzarella and fresh basil leaves, on a wooden board, overhead shot, rustic background",
  "Pizza Thon": "Professional food photography of a pizza topped with tomato sauce, mozzarella, tuna flakes, black olives and capers, on a white plate, overhead shot",
  "Pizza Escalope": "Professional food photography of a pizza topped with tomato sauce, grilled chicken escalope slices, onions, peppers and olives, overhead shot, rustic board",
  "4 Saisons": "Professional food photography of a quattro stagioni pizza divided into four quadrants each with different toppings: mushrooms, artichokes, ham and olives, overhead shot",
  "4 Fromages": "Professional food photography of a four cheese pizza with bubbling mozzarella, gorgonzola, parmesan and brie, golden and melting, overhead shot",
  "Pizza Fruits de Mer": "Professional food photography of a seafood pizza with shrimp, mussels, calamari rings and fresh parsley on tomato sauce, overhead shot, wooden board",

  // Sandwichs
  "Libanais / Tabouna": "Professional food photography of a Tunisian tabouna flatbread sandwich stuffed with grilled chicken, salad, tomato and harissa sauce, wrapped in paper and cut in half, overhead shot",
  "Makloub / Baguette Farcie": "Professional food photography of a stuffed French baguette filled with tuna, harissa, olives, boiled egg and salad, cut diagonally on a wooden board, overhead shot",
  "Tacos": "Professional food photography of a French-style tacos wrap filled with chicken, cheese sauce and french fries, cut open to show layers, on white paper, overhead shot",
  "Panozzo": "Professional food photography of an Italian panozzo sandwich on grilled ciabatta filled with grilled meat and roasted vegetables, cut in half showing filling, overhead shot",
  "Panini Thon Fromage": "Professional food photography of a toasted panini with visible grill marks, filled with tuna and melted cheese, cut diagonally on a white plate, overhead shot",
  "Panini Escalope Fromage": "Professional food photography of a golden toasted panini with grill marks, filled with grilled chicken escalope and melted cheese, cut diagonally on a white plate, overhead shot",

  // Plats Principaux
  "Escalope Grillée": "Professional food photography of a grilled chicken escalope on a white plate with roasted vegetables and a lemon wedge, steam rising, restaurant quality, overhead shot",
  "Escalope Panée": "Professional food photography of a golden crispy breaded chicken schnitzel on a white plate with french fries and mixed salad, overhead shot",
  "Cordon Bleu": "Professional food photography of a golden Cordon Bleu cut in half to reveal the ham and melted cheese filling, on a white plate with sides, overhead shot",
  "Dorade / Loup Grillé": "Professional food photography of a whole grilled sea bream with charred skin, herbs and lemon slices, on a white plate, overhead shot, restaurant quality",

  // Pâtes
  "Pâtes Poulet": "Professional food photography of creamy pasta with grilled chicken pieces, fresh parsley and parmesan, in a white bowl, overhead shot, natural light",
  "Pâtes Putanesca": "Professional food photography of penne pasta alla puttanesca with black olives, capers, tomatoes and fresh basil, in a white bowl, overhead shot",
  "Pâtes Bolognaise": "Professional food photography of spaghetti bolognese with rich meat tomato sauce, topped with grated parmesan and fresh basil, in a white bowl, overhead shot",
  "Pâtes Fruits de Mer": "Professional food photography of linguine pasta with mixed seafood — shrimp, mussels, squid — in garlic tomato sauce, in a white bowl, overhead shot",

  // Lasagnes
  "Lasagne Poulet": "Professional food photography of a slice of chicken lasagna with béchamel sauce and golden cheese crust, plated on a white dish showing layers, overhead shot",
  "Lasagne Bolognaise": "Professional food photography of a slice of classic beef bolognese lasagna with visible pasta and meat layers, béchamel and golden cheese top, white plate, overhead shot",

  // Entrées Froides
  "Salade Verte": "Professional food photography of a fresh green garden salad with mixed lettuce leaves, cucumber slices, cherry tomatoes and light vinaigrette, in a white bowl, overhead shot",
  "Salade Riz": "Professional food photography of a Tunisian rice salad with tuna, vegetables, olives and a drizzle of olive oil in a white bowl, overhead flat-lay",
  "Salade César": "Professional food photography of a classic Caesar salad with romaine lettuce, croutons, shaved parmesan and Caesar dressing, in a white bowl, overhead shot",

  // Entrées Chaudes
  "Omelette Thon & Fromage": "Professional food photography of a fluffy golden omelette filled with tuna and melted cheese, folded on a white plate, overhead shot",
  "Ojja Merguez": "Professional food photography of Tunisian ojja — eggs poached in spiced tomato sauce with merguez sausage slices — in a cast iron pan, steam rising, overhead shot",
  "Ojja Escalope": "Professional food photography of Tunisian ojja with eggs in spiced tomato harissa sauce with grilled chicken escalope pieces, in a pan, overhead shot",
  "Ojja Fruits de Mer": "Professional food photography of Tunisian ojja with eggs, shrimp, mussels and calamari in a rich spicy tomato sauce, in a terracotta pan, overhead shot",

  // Cafés & Boissons Chaudes
  "Espresso": "Professional café photography of a perfect espresso in a tiny white ceramic cup with golden crema layer on top, on a white saucer with a sugar cube, overhead shot, dark moody background",
  "Américain": "Professional food photography of a black Americano coffee in a white ceramic mug, steam rising gently, on a wooden café table, overhead shot",
  "Cappuccino": "Professional café photography of a cappuccino with intricate milk foam latte art in a white ceramic cup on a saucer, overhead shot, warm tones",
  "Café Crème": "Professional café photography of a café crème with a thick creamy foam top in a white cup and saucer, marble table background, overhead shot",
  "Cappuccino Spécial": "Professional café photography of a special cappuccino topped with artistic rosetta latte art, dusted with cinnamon, in a large white cup, overhead shot",
  "Café Spéculoos": "Professional food photography of a creamy latte with crushed speculoos biscuit crumble on the foam, in a white cup, speculoos biscuit on the side, overhead shot",
  "Café Nutella": "Professional food photography of a special Nutella latte in a glass mug with visible layers of espresso and milk, Nutella swirl on top with hazelnut crumbles, overhead shot",
  "Chocolat Chaud": "Professional food photography of a rich hot chocolate in a white ceramic mug with steam rising, topped with whipped cream and a dusting of dark cocoa powder, overhead shot",
  "Chocolat au Lait": "Professional food photography of a tall glass of warm creamy chocolate milk, steam rising, cocoa powder sprinkled on top, on a wooden table, overhead shot",
  "Tasse de Lait": "Professional food photography of a simple white ceramic cup of warm whole milk, clean white background, steam rising gently, overhead shot",
  "Arôme Café": "Professional food photography of a small glass of Tunisian café arome, dark strong coffee, on a tray with sugar cubes, overhead shot, café ambiance",

  // Boissons Froides
  "Ice Coffee": "Professional food photography of a tall iced coffee in a clear glass with ice cubes, cold brew coffee and a straw, condensation on the glass, overhead shot",
  "Thé Infusion": "Professional food photography of a glass teapot of herbal infusion with dried flowers and herbs visible, alongside a small cup, on a white marble surface, overhead shot",

  // Jus Frais
  "Citronnade": "Professional food photography of fresh homemade lemonade in a tall glass with lemon slices, ice cubes and a sprig of mint, on a white marble table, overhead shot",
  "Jus d'Orange": "Professional food photography of freshly squeezed orange juice in a tall glass, vibrant orange color, orange halves beside the glass, natural light, overhead shot",
  "Jus Fraise": "Professional food photography of a fresh strawberry juice in a tall glass, bright red color, with fresh strawberries beside the glass, overhead shot",
  "Jus Cocktail": "Professional food photography of a colorful mixed fruit cocktail juice in a tall glass with layers of tropical fruit colors, overhead shot, fresh fruit garnish",
  "Jwajem": "Professional food photography of a Tunisian Jwajem fresh fruit blend in a tall glass — a colorful mix of strawberry, banana and milk — with fresh fruit garnish, overhead shot",

  // Milkshakes
  "Milkshake Normal": "Professional food photography of a thick creamy vanilla milkshake in a tall glass with swirled whipped cream on top, a striped straw, on a wooden table, overhead shot",

  // Mojitos
  "Virgin Mojito": "Professional food photography of a non-alcoholic virgin mojito in a tall glass with fresh mint leaves, lime wedges, ice cubes and sparkling water, overhead shot",
  "Blue Mojito": "Professional food photography of a vibrant blue mocktail mojito in a tall glass with blue syrup, mint leaves, lime slices and ice cubes, overhead shot",
  "Red Mojito": "Professional food photography of a red strawberry mojito mocktail in a tall glass with fresh strawberries, mint leaves, lime and crushed ice, overhead shot",

  // Glaces & Frappuccino
  "Frappuccino (Nutella / Oreo / Spéculoos)": "Professional food photography of a blended frappuccino in a clear plastic cup topped with whipped cream and drizzled with Nutella, crushed Oreo cookies on top, with a wide straw, overhead shot",
  "Glace 2 Boules": "Professional food photography of two generous scoops of ice cream — one vanilla, one chocolate — in a white bowl with a wafer, overhead shot, clean background",

  // Autres Boissons
  "Eau 0.5L": "Professional product photography of a 0.5 liter clear water bottle with label, on a white background, clean and simple, overhead shot",
  "Eau 1L": "Professional product photography of a 1 liter clear water bottle, on a white background, clean and simple, overhead shot",
  "Eau Gazeuse": "Professional food photography of a tall glass of sparkling water with bubbles rising and ice, with a slice of lemon, on a white background, overhead shot",
  "Canette": "Professional product photography of a cold soda can with condensation, colorful, on a white background, overhead shot",
  "Yaourt Glacé": "Professional food photography of a frozen yogurt in a white cup topped with fresh berries and honey drizzle, overhead shot",

  // Gâteaux & Pâtisseries
  "Tarte du Jour": "Professional food photography of a beautiful seasonal fruit tart with glazed berries on custard cream in a pastry shell, on a white plate, overhead shot",
  "Cookies": "Professional food photography of golden chocolate chip cookies, some whole and one broken to show the gooey center, on a white plate, overhead shot",
  "Brownies": "Professional food photography of rich fudgy dark chocolate brownies cut into neat squares, dusted with icing sugar, on a white plate, overhead shot",
  "Fondant au Chocolat": "Professional food photography of a dark chocolate fondant lava cake with liquid chocolate flowing out from the center, vanilla ice cream beside it, on a white plate, overhead shot",
  "Gâteau du Jour": "Professional food photography of an elegant slice of layered cake with cream and fruit filling, decorated with fresh berries on top, on a white plate, overhead shot",
  "Verrine": "Professional food photography of an elegant verrine dessert glass showing layers of cream, fruit coulis and crushed biscuit, on a marble surface, overhead shot",
  "Tarte aux Amandes": "Professional food photography of a golden almond frangipane tart with sliced almonds on top, rustic pastry crust, on a white plate, overhead shot",
  "Cheesecake": "Professional food photography of a creamy New York cheesecake slice with a graham cracker base and fresh strawberry coulis on top, on a white plate, overhead shot",
  "Petit Cake": "Professional food photography of a small individual round cake with smooth frosting, one slice cut to show the moist interior, on a white plate, overhead shot",
  "Grand Cake": "Professional food photography of a large decorated layered cake with cream frosting and fruit decoration, one slice removed to show the layers inside, overhead shot",
  "Cake Rond": "Professional food photography of a round celebration cake with elegant white frosting and delicate floral sugar decorations, on a white cake stand, overhead shot",
  "Mini-Gâteaux (1 Kg)": "Professional food photography of an assortment of small Tunisian and French pastries and petit fours beautifully arranged on a white plate — approximately 1kg — overhead shot, top-down view",
  "Muffin": "Professional food photography of a golden blueberry muffin with a domed top and visible blueberries, in a white paper case, on a white plate, overhead shot",
  "Tranche de Cake": "Professional food photography of a slice of classic vanilla marble pound cake showing moist interior texture, on a white plate with a fork, overhead shot",
};

// ── Menu items list (matches seed-fiesta.js) ──────────────────────────────────
const ITEMS = Object.keys(PROMPTS);

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  const progress = loadProgress();

  // 1. Upload logo
  console.log("\n📦 Uploading Fiesta+ logo to Cloudinary...");
  const logoKey = "logo";
  if (!progress[logoKey]) {
    const logoPath = path.join(process.cwd(), "public", "logos", "image.png");
    const logoUrl = await uploadToCloudinary(logoPath, "logo");
    progress[logoKey] = logoUrl;
    saveProgress(progress);
    console.log(`  ✅ Logo → ${logoUrl}`);
  } else {
    console.log(`  ✓ (cached) logo → ${progress[logoKey]}`);
  }

  // 2. Generate & upload each menu item image
  console.log(`\n🍽  Generating ${ITEMS.length} menu item images via DALL-E 3...\n`);
  let done = 0;
  for (const name of ITEMS) {
    done++;
    process.stdout.write(`[${done}/${ITEMS.length}] `);
    await generateAndUpload(name, PROMPTS[name], progress);
  }

  // 3. Build the updated seed-fiesta.js
  console.log("\n✏️  Updating seed-fiesta.js with Cloudinary URLs...");
  const seedPath = path.join(__dirname, "seed-fiesta.js");
  let seed = fs.readFileSync(seedPath, "utf8");

  // Replace logo
  seed = seed.replace(
    /logo:\s*["']\/logos\/image\.png["']/,
    `logo: "${progress["logo"]}"`
  );

  // Replace cover image with a real café photo from Cloudinary or keep existing
  // (cover image is not in the menu items list, left as-is)

  // Replace each item's image reference
  // The seed has lines like: { c: "...", n: "Item Name", p: 1.0, i: "photo-xxx", b: "" }
  // We need to replace the i: "..." value with the full Cloudinary URL
  // We'll change the img() helper call to a direct URL instead

  // First: change the img() function to be an identity (already full URL)
  seed = seed.replace(
    /const img = \(id\) =>\s*\n\s*`https:\/\/images\.unsplash\.com\/\$\{id\}\?auto=format&fit=crop&w=800&q=80`;/,
    `const img = (id) => id; // Cloudinary URLs — id is already the full URL`
  );

  // Replace each item's i: value
  for (const name of ITEMS) {
    const cloudUrl = progress[`item:${name}`];
    if (!cloudUrl) continue;

    // Escape special regex chars in name
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Match the line for this item and replace the i: "..." part
    const lineRegex = new RegExp(
      `(\\{[^}]*n:\\s*"${escapedName}"[^}]*i:\\s*)"([^"]*)"`,
      "s"
    );
    seed = seed.replace(lineRegex, `$1"${cloudUrl}"`);
  }

  fs.writeFileSync(seedPath, seed, "utf8");
  console.log("  ✅ seed-fiesta.js updated");

  // 4. Re-seed the database
  console.log("\n🌱 Re-seeding database...\n");
  await seedDatabase(progress["logo"], progress);

  // Cleanup progress file
  // fs.unlinkSync(PROGRESS_FILE); // keep for reference

  console.log("\n🎉 All done! Fiesta+ fully seeded with AI-generated images.");
  console.log(`   Public menu: http://localhost:3000/menu/fiesta-plus\n`);
}

// ── Inline seed (mirrors seed-fiesta.js logic but uses progress URLs) ─────────
async function seedDatabase(logoUrl, progress) {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");

  await mongoose.connect(process.env.MONGODB_URI, { dbName: "qr_menu_saas" });
  const db = mongoose.connection.db;
  const users = db.collection("users");
  const restaurants = db.collection("restaurants");
  const categories = db.collection("categories");
  const products = db.collection("products");
  const qrcodes = db.collection("qrcodes");
  const now = new Date();
  const getDoc = (r) => r?.value ?? r;

  const adminEmail = "owner@fiesta-plus.tn";
  const adminHash = await bcrypt.hash("FiestaPlus@2026", 12);
  const adminResult = await users.findOneAndUpdate(
    { email: adminEmail },
    { $set: { name: "Fiesta+ Owner", email: adminEmail, passwordHash: adminHash, role: "restaurant_admin", mustChangePassword: false, updatedAt: now }, $setOnInsert: { createdAt: now } },
    { upsert: true, returnDocument: "after" }
  );
  const ownerId = getDoc(adminResult)?._id;

  const restResult = await restaurants.findOneAndUpdate(
    { slug: "fiesta-plus" },
    {
      $set: {
        ownerId,
        name: "Fiesta+",
        slug: "fiesta-plus",
        establishmentType: "cafe",
        tagline: "Resto · Café · Pâtisserie",
        description: "Un espace chaleureux alliant café de qualité, pâtisseries maison, pizzas artisanales, sandwichs généreux et plats savoureux. Fiesta+, votre pause gourmande au quotidien.",
        phone: "", address: "Tunisie", instagram: "", facebook: "", googleMapsUrl: "",
        logo: logoUrl,
        coverImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1800&q=90",
        primaryColor: "#1a1a1a", secondaryColor: "#f5f0e8", currency: "DT",
        isActive: true, showPrices: true, updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true, returnDocument: "after" }
  );
  const restaurantId = getDoc(restResult)?._id;

  const catData = [
    { key: "breakfast",       name: "Petit-déjeuner & Brunch",    sortOrder: 1  },
    { key: "crepes_sucrees",  name: "Crêpes Sucrées",              sortOrder: 2  },
    { key: "crepes_salees",   name: "Crêpes Salées",               sortOrder: 3  },
    { key: "gaufres",         name: "Gaufres",                     sortOrder: 4  },
    { key: "pizzas",          name: "Pizzas",                      sortOrder: 5  },
    { key: "sandwichs",       name: "Sandwichs",                   sortOrder: 6  },
    { key: "plats",           name: "Plats Principaux",            sortOrder: 7  },
    { key: "pates",           name: "Pâtes",                       sortOrder: 8  },
    { key: "lasagnes",        name: "Lasagnes",                    sortOrder: 9  },
    { key: "entrees_froides", name: "Entrées Froides",             sortOrder: 10 },
    { key: "entrees_chaudes", name: "Entrées Chaudes",             sortOrder: 11 },
    { key: "cafes",           name: "Cafés & Boissons Chaudes",    sortOrder: 12 },
    { key: "froides",         name: "Boissons Froides",            sortOrder: 13 },
    { key: "jus",             name: "Jus Frais",                   sortOrder: 14 },
    { key: "milkshakes",      name: "Milkshakes",                  sortOrder: 15 },
    { key: "mojitos",         name: "Mojitos",                     sortOrder: 16 },
    { key: "glaces",          name: "Glaces & Frappuccino",        sortOrder: 17 },
    { key: "autres",          name: "Autres Boissons",             sortOrder: 18 },
    { key: "patisseries",     name: "Gâteaux & Pâtisseries",       sortOrder: 19 },
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

  // product map: name → { c, p, b }
  const productMeta = {
    "Express":                              { c: "breakfast",       p: 8.500,  b: "" },
    "Petit-déjeuner Matinal":              { c: "breakfast",       p: 14.500, b: "Populaire" },
    "Brunch":                               { c: "breakfast",       p: 47.000, b: "Signature" },
    "Crêpe Chocolat":                       { c: "crepes_sucrees",  p: 6.500,  b: "" },
    "Crêpe Nutella":                        { c: "crepes_sucrees",  p: 10.000, b: "Populaire" },
    "Crêpe Fromage":                        { c: "crepes_salees",   p: 6.500,  b: "" },
    "Crêpe Thon":                           { c: "crepes_salees",   p: 7.500,  b: "" },
    "Crêpe Jambon/Salami Fromage":         { c: "crepes_salees",   p: 7.500,  b: "" },
    "Crêpe Thon & Fromage":               { c: "crepes_salees",   p: 9.000,  b: "" },
    "Crêpe Escalope & Fromage":           { c: "crepes_salees",   p: 9.000,  b: "Populaire" },
    "Gaufre Chocolat":                      { c: "gaufres",         p: 6.500,  b: "" },
    "Gaufre Nutella":                       { c: "gaufres",         p: 10.000, b: "Populaire" },
    "Margherita":                           { c: "pizzas",          p: 12.500, b: "" },
    "Pizza Thon":                           { c: "pizzas",          p: 16.500, b: "" },
    "Pizza Escalope":                       { c: "pizzas",          p: 17.000, b: "Populaire" },
    "4 Saisons":                            { c: "pizzas",          p: 18.500, b: "" },
    "4 Fromages":                           { c: "pizzas",          p: 19.000, b: "" },
    "Pizza Fruits de Mer":                 { c: "pizzas",          p: 22.000, b: "Signature" },
    "Libanais / Tabouna":                  { c: "sandwichs",       p: 10.000, b: "" },
    "Makloub / Baguette Farcie":          { c: "sandwichs",       p: 11.500, b: "" },
    "Tacos":                                { c: "sandwichs",       p: 12.500, b: "Populaire" },
    "Panozzo":                              { c: "sandwichs",       p: 13.000, b: "" },
    "Panini Thon Fromage":                 { c: "sandwichs",       p: 6.500,  b: "" },
    "Panini Escalope Fromage":            { c: "sandwichs",       p: 7.500,  b: "" },
    "Escalope Grillée":                    { c: "plats",           p: 19.000, b: "" },
    "Escalope Panée":                      { c: "plats",           p: 19.500, b: "Populaire" },
    "Cordon Bleu":                          { c: "plats",           p: 20.500, b: "" },
    "Dorade / Loup Grillé":               { c: "plats",           p: 25.000, b: "Signature" },
    "Pâtes Poulet":                         { c: "pates",           p: 16.500, b: "" },
    "Pâtes Putanesca":                      { c: "pates",           p: 17.000, b: "" },
    "Pâtes Bolognaise":                    { c: "pates",           p: 18.000, b: "Populaire" },
    "Pâtes Fruits de Mer":                 { c: "pates",           p: 27.000, b: "Signature" },
    "Lasagne Poulet":                       { c: "lasagnes",        p: 17.000, b: "" },
    "Lasagne Bolognaise":                  { c: "lasagnes",        p: 19.000, b: "Populaire" },
    "Salade Verte":                         { c: "entrees_froides", p: 9.000,  b: "" },
    "Salade Riz":                           { c: "entrees_froides", p: 9.500,  b: "" },
    "Salade César":                         { c: "entrees_froides", p: 13.000, b: "Populaire" },
    "Omelette Thon & Fromage":            { c: "entrees_chaudes", p: 12.500, b: "" },
    "Ojja Merguez":                         { c: "entrees_chaudes", p: 16.000, b: "Populaire" },
    "Ojja Escalope":                        { c: "entrees_chaudes", p: 18.000, b: "" },
    "Ojja Fruits de Mer":                  { c: "entrees_chaudes", p: 22.000, b: "Signature" },
    "Espresso":                             { c: "cafes",           p: 3.000,  b: "" },
    "Américain":                            { c: "cafes",           p: 3.200,  b: "" },
    "Cappuccino":                           { c: "cafes",           p: 3.200,  b: "" },
    "Café Crème":                           { c: "cafes",           p: 3.500,  b: "" },
    "Cappuccino Spécial":                  { c: "cafes",           p: 4.500,  b: "Populaire" },
    "Café Spéculoos":                       { c: "cafes",           p: 4.500,  b: "" },
    "Café Nutella":                         { c: "cafes",           p: 4.500,  b: "Nouveau" },
    "Chocolat Chaud":                       { c: "cafes",           p: 4.500,  b: "" },
    "Chocolat au Lait":                    { c: "cafes",           p: 2.500,  b: "" },
    "Tasse de Lait":                        { c: "cafes",           p: 1.500,  b: "" },
    "Arôme Café":                          { c: "cafes",           p: 1.000,  b: "" },
    "Ice Coffee":                           { c: "froides",         p: 5.000,  b: "Populaire" },
    "Thé Infusion":                         { c: "froides",         p: 2.500,  b: "" },
    "Citronnade":                           { c: "jus",             p: 4.000,  b: "" },
    "Jus d'Orange":                        { c: "jus",             p: 4.500,  b: "Populaire" },
    "Jus Fraise":                           { c: "jus",             p: 7.000,  b: "" },
    "Jus Cocktail":                         { c: "jus",             p: 9.000,  b: "" },
    "Jwajem":                               { c: "jus",             p: 12.000, b: "Signature" },
    "Milkshake Normal":                     { c: "milkshakes",      p: 6.500,  b: "" },
    "Virgin Mojito":                        { c: "mojitos",         p: 7.500,  b: "" },
    "Blue Mojito":                          { c: "mojitos",         p: 8.500,  b: "Populaire" },
    "Red Mojito":                           { c: "mojitos",         p: 8.500,  b: "" },
    "Frappuccino (Nutella / Oreo / Spéculoos)": { c: "glaces", p: 8.500, b: "Populaire" },
    "Glace 2 Boules":                       { c: "glaces",          p: 6.000,  b: "" },
    "Eau 0.5L":                             { c: "autres",          p: 1.800,  b: "" },
    "Eau 1L":                               { c: "autres",          p: 2.500,  b: "" },
    "Eau Gazeuse":                          { c: "autres",          p: 3.000,  b: "" },
    "Canette":                              { c: "autres",          p: 3.000,  b: "" },
    "Yaourt Glacé":                         { c: "autres",          p: 6.500,  b: "" },
    "Tarte du Jour":                        { c: "patisseries",     p: 5.000,  b: "" },
    "Cookies":                              { c: "patisseries",     p: 5.500,  b: "" },
    "Brownies":                             { c: "patisseries",     p: 5.500,  b: "" },
    "Fondant au Chocolat":                 { c: "patisseries",     p: 5.500,  b: "Populaire" },
    "Gâteau du Jour":                      { c: "patisseries",     p: 6.500,  b: "" },
    "Verrine":                              { c: "patisseries",     p: 6.500,  b: "" },
    "Tarte aux Amandes":                   { c: "patisseries",     p: 6.500,  b: "" },
    "Cheesecake":                           { c: "patisseries",     p: 7.500,  b: "Populaire" },
    "Petit Cake":                           { c: "patisseries",     p: 8.000,  b: "" },
    "Grand Cake":                           { c: "patisseries",     p: 11.000, b: "" },
    "Cake Rond":                            { c: "patisseries",     p: 13.000, b: "Signature" },
    "Mini-Gâteaux (1 Kg)":                 { c: "patisseries",     p: 47.000, b: "" },
    "Muffin":                               { c: "patisseries",     p: 3.000,  b: "" },
    "Tranche de Cake":                      { c: "patisseries",     p: 3.000,  b: "" },
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
    { $set: { restaurantId, targetUrl: "http://localhost:3000/menu/fiesta-plus", qrImageUrl: "", updatedAt: now }, $setOnInsert: { createdAt: now } },
    { upsert: true }
  );

  await mongoose.disconnect();
  console.log("  ✅ Database seeded.");
}

run().catch(async (err) => {
  console.error("\n❌ Fatal error:", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
