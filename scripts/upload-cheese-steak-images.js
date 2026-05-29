/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Uploads logo, cover, and per-product images to Cloudinary
 * for the cheese-steak restaurant, then updates MongoDB.
 *
 * Idempotent: re-running re-uses existing public_ids (overwrite: true).
 */
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { v2: cloudinary } = require("cloudinary");

// ── env ────────────────────────────────────────────────────────────────
const envLocalPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  for (const line of fs.readFileSync(envLocalPath, "utf8").split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#") || !line.includes("=")) continue;
    const [k, ...r] = line.split("=");
    if (k && !(k in process.env)) process.env[k.trim()] = r.join("=").trim();
  }
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI missing");
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error("Cloudinary env vars missing");
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

// ── helpers ────────────────────────────────────────────────────────────
const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);

const UNSPLASH = (id) => `https://images.unsplash.com/${id}?w=1200&q=80&auto=format`;

// Verified Unsplash photo IDs (food photography, public CDN)
const CATEGORY_FALLBACK = {
  "Entrées Froides":         "photo-1540420773420-3366772f4999", // salad
  "Entrées Chaudes":          "photo-1547592180-85f173990554",   // soup
  "Les Viandes":              "photo-1546964124-0cce460f38ef",   // steak
  "Les Poissons":             "photo-1535140728325-a4d3707eee94", // fish
  "Les Pâtes":                "photo-1551183053-bf91a1d81141",   // pasta
  "Spécialité du Chef":       "photo-1568901346375-23c9450c58cd", // couscous
  "Les Pizzas":               "photo-1565299624946-b28f40a0ae38", // pizza
  "Menu Kids":                "photo-1562967914-608f82629710",   // nuggets
  "Boissons Froides":         "photo-1554866585-cd94860890b7",   // soda
  "Les Jus":                  "photo-1613478223719-2ab802602423", // orange juice
  "Les Cafés":                "photo-1510591509098-f4fdc6d0ff04", // espresso
  "Les Thés":                 "photo-1576092768241-dec231879fc3", // tea
  "Petit Déjeuner":           "photo-1533089860892-a7c6f0a88666", // breakfast
  "Cocktails sans Alcool":    "photo-1551024709-8f23befc6f87",   // mocktail
  "Cocktails avec Alcool":    "photo-1551538827-9c037cb4f32a",   // mojito
  "Milkshakes":               "photo-1572490122747-3968b75cc699", // milkshake
  "Smoothies":                "photo-1553530666-ba11a7da3888",   // smoothie
  "Desserts Glacés":          "photo-1497034825429-c343d7c6a68f", // ice cream
  "Les Desserts":             "photo-1606313564200-e75d5e30476c", // chocolate
  "Liqueurs":                 "photo-1527281400683-1aae777175f8", // whisky
  "Bières":                   "photo-1535958636474-b021ee887b13", // beer
  "Les Vins":                 "photo-1510812431401-41d2bd2722f3", // wine
};

// Per-product overrides (keyword in product name → photo id)
const NAME_KEYWORDS = [
  // meats
  [/c[oô]telette.*agneau|lamb/i,            "photo-1607330289024-1535c6b4e1c1"],
  [/t-?bone|filet.*b[oeu]uf|entrec[oô]te|c[oô]te.*b[oeu]uf|grilled.*steak|veal/i, "photo-1546964124-0cce460f38ef"],
  [/grillade.*mixte|mixed grill|symphonie.*terre|land meat/i, "photo-1544025162-d76694265947"],
  [/merguez|sausage/i,                       "photo-1529193591184-b1d58069ecdd"],
  [/shawarma|chawarma/i,                     "photo-1633321702518-7feccafb94d5"],
  [/brochette|kebab|skewer/i,                "photo-1633237308525-cd587cf71926"],
  [/poulet|chicken/i,                        "photo-1532550907401-a500c9a57435"],
  [/dinde|turkey/i,                          "photo-1432139509613-5c4255815697"],
  [/cordon bleu/i,                           "photo-1562967914-608f82629710"],

  // fish & seafood
  [/dorade|sea bream|loup|sea bass|poisson|fish of/i, "photo-1535140728325-a4d3707eee94"],
  [/espadon|swordfish/i,                     "photo-1535140728325-a4d3707eee94"],
  [/langouste|lobster/i,                     "photo-1559737558-2f5a35f4523b"],
  [/m[eé]rou|grouper/i,                       "photo-1565680018434-b513d5e5fd47"],
  [/crevette|chevrette|shrimp|prawn/i,        "photo-1625944525533-473f1b3d9684"],
  [/calamar|squid|seiche|cuttlefish/i,        "photo-1599487488170-d11ec9c172f0"],
  [/moule|mussel/i,                           "photo-1565680018434-b513d5e5fd47"],
  [/fruits? de mer|seafood|sympho.*mer/i,    "photo-1559847844-1ff4d5bcd28e"],
  [/ojja/i,                                   "photo-1604908554049-29795f1d1c6e"],
  [/gratin/i,                                 "photo-1559847844-1ff4d5bcd28e"],
  [/kamounia/i,                               "photo-1604908554049-29795f1d1c6e"],

  // salads & soups
  [/salade.*tunisienne|tunisian salad|mechouia/i, "photo-1505253716362-afaea1d3d1af"],
  [/salade.*c[eé]sar|caesar/i,                "photo-1550304943-4f24f54ddde9"],
  [/soupe.*poulet|chicken soup/i,             "photo-1547592180-85f173990554"],
  [/soupe.*poisson|fish soup/i,               "photo-1547592166-23ac45744acd"],
  [/cr[eè]me.*l[eé]gume|vegetable cream/i,    "photo-1547308283-b941e0f7d54a"],
  [/brik/i,                                   "photo-1601050690597-df0568f70950"],
  [/frite|fries/i,                             "photo-1573080496219-bb080dd4f877"],

  // pasta & pizza
  [/lasagne|lasagna/i,                        "photo-1619895092538-128f4f29b1bb"],
  [/carbonara/i,                              "photo-1612874742237-6526221588e3"],
  [/spaghetti.*bolognaise|bolognese/i,        "photo-1551183053-bf91a1d81141"],
  [/spaghetti.*fruits? de mer|spaghetti.*seafood/i, "photo-1563379926898-05f4575a45d8"],
  [/penne|farfalle|macaroni|p[aâ]tes au beurre|cream pasta/i, "photo-1473093295043-cdd812d0e601"],
  [/pizza margherita/i,                       "photo-1604068549290-dea0e4a305ca"],
  [/pizza 4 fromages|4 cheese|fruits? de mer.*pizza|pizza.*neptune/i, "photo-1513104890138-7c749659a591"],
  [/pizza/i,                                  "photo-1565299624946-b28f40a0ae38"],
  [/nugget/i,                                 "photo-1562967914-608f82629710"],

  // chef / couscous / rice
  [/couscous/i,                               "photo-1568901346375-23c9450c58cd"],
  [/riz/i,                                    "photo-1603133872878-684f208fb84b"],
  [/mezza/i,                                  "photo-1547573854-74d2a71d0826"],

  // drinks
  [/eau plate|still water|eau 0\.5/i,         "photo-1559839734-2b71ea197ec2"],
  [/eau gaz|sparkling/i,                       "photo-1559839734-2b71ea197ec2"],
  [/soda|coca|fanta|boga|schweppes/i,         "photo-1554866585-cd94860890b7"],
  [/shark|energy/i,                            "photo-1622543925917-763c34d1a86e"],
  [/dose|shot/i,                                "photo-1602938616030-fdee47ae8aaa"],
  [/orange/i,                                   "photo-1613478223719-2ab802602423"],
  [/citronnade|lemonade|lemon mint/i,          "photo-1513558161293-cdaf765ed2fd"],
  [/fraise|strawberry/i,                       "photo-1546173159-315724a31696"],
  [/pomme|apple/i,                              "photo-1622597467836-f3285f2131b8"],
  [/banane|banana/i,                            "photo-1607478900766-efe13248b125"],
  [/ananas|pineapple|pi[nñ]a colada/i,          "photo-1502740479091-635887520276"],
  [/p[eê]che|peach/i,                           "photo-1591287083773-9a5b6f3a8b1d"],
  [/melon/i,                                    "photo-1571575173700-afb9492e6a50"],
  [/cocktail|mojito|gin fizz|sex on the beach|blue sky|bella luna/i, "photo-1551024709-8f23befc6f87"],
  [/express|espresso/i,                         "photo-1510591509098-f4fdc6d0ff04"],
  [/cappuccino|capucin/i,                       "photo-1572442388796-11668a67e53d"],
  [/am[eé]ricain|americano/i,                   "photo-1495474472287-4d71bcdd2085"],
  [/caf[eé] direct|milk coffee/i,               "photo-1541167760496-1628856ab772"],
  [/caf[eé] glac[eé]|iced coffee/i,             "photo-1517701550927-30cf4ba1dba5"],
  [/th[eé]|tea|infusion|verveine/i,             "photo-1576092768241-dec231879fc3"],
  [/petit d[eé]jeuner|breakfast/i,              "photo-1533089860892-a7c6f0a88666"],
  [/milkshake/i,                                "photo-1572490122747-3968b75cc699"],
  [/smoothie/i,                                 "photo-1553530666-ba11a7da3888"],

  // desserts
  [/fondant|chocolate fondant/i,                "photo-1606313564200-e75d5e30476c"],
  [/sorbet/i,                                    "photo-1488900128323-21503983a07e"],
  [/banana split|coupe.*glace|glace|ice cream/i, "photo-1497034825429-c343d7c6a68f"],
  [/li[eé]geois/i,                              "photo-1594911774802-8822a707cbb3"],
  [/fruit.*saison|fruit.*royale|fruits?/i,      "photo-1490474418585-ba9bad8fd0ea"],
  [/chicha|hookah/i,                             "photo-1601493700750-58b6c4b6b6f3"],

  // alcohol
  [/whisky|j&b|baileys|chivas|jack daniel|j\.walker|walker/i, "photo-1527281400683-1aae777175f8"],
  [/vodka|smirnoff|absolut|orloff|reservi/i,    "photo-1592842232655-e5d345cbc2c1"],
  [/gin/i,                                       "photo-1620055376147-9c30ddd3fad8"],
  [/rhum|rum/i,                                  "photo-1569529465841-dfecdab7503b"],
  [/martini|cognac|get 27|malibu|anisette|pastis|capris|ricard|boukha|thibarine/i, "photo-1527281400683-1aae777175f8"],
  [/celtia|amstel|heineken|beck|bi[eè]re|beer/i, "photo-1535958636474-b021ee887b13"],
  [/vin|wine|magon|chardonnay|selian|d[eé]sir|magnifique|ugni|ch[aâ]teau|jour et nuit/i, "photo-1510812431401-41d2bd2722f3"],
];

function pickImageForProduct(name, categoryName) {
  for (const [re, id] of NAME_KEYWORDS) if (re.test(name)) return id;
  return CATEGORY_FALLBACK[categoryName] || "photo-1546069901-ba9599a7e63c";
}

async function uploadRemote(remoteUrl, publicId, opts = {}) {
  try {
    const result = await cloudinary.uploader.upload(remoteUrl, {
      public_id: publicId,
      folder: undefined, // public_id already includes folder
      overwrite: true,
      resource_type: "image",
      transformation: [{ width: 1200, height: 900, crop: "fill", quality: "auto", fetch_format: "auto" }],
      ...opts,
    });
    return result.secure_url;
  } catch (e) {
    console.warn(`  ! upload failed for ${publicId}: ${e.message}`);
    return null;
  }
}

async function uploadLocal(filePath, publicId, opts = {}) {
  const result = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
    ...opts,
  });
  return result.secure_url;
}

// ── main ───────────────────────────────────────────────────────────────
(async () => {
  await mongoose.connect(MONGODB_URI, { dbName: "qr_menu_saas" });
  const db = mongoose.connection.db;
  const restaurants = db.collection("restaurants");
  const categories = db.collection("categories");
  const products = db.collection("products");

  const restaurant = await restaurants.findOne({ slug: "cheese-steak" });
  if (!restaurant) throw new Error("cheese-steak restaurant not found. Run npm run seed first.");

  console.log("Uploading logo + cover…");

  const logoPath = path.join(process.cwd(), "public", "logos", "cheese-steak.svg");
  const logoUrl = await uploadLocal(logoPath, "qr-menu/cheese-steak/logo");
  console.log("  logo →", logoUrl);

  const coverUrl = await uploadRemote(
    UNSPLASH("photo-1558030006-450675393462"),
    "qr-menu/cheese-steak/cover",
    { transformation: [{ width: 1920, height: 1080, crop: "fill", quality: "auto", fetch_format: "auto" }] }
  );
  console.log("  cover →", coverUrl);

  await restaurants.updateOne(
    { _id: restaurant._id },
    { $set: { logo: logoUrl, coverImage: coverUrl || restaurant.coverImage, updatedAt: new Date() } }
  );

  // Build categoryId → categoryName map
  const cats = await categories.find({ restaurantId: restaurant._id }).toArray();
  const catNameById = Object.fromEntries(cats.map((c) => [String(c._id), c.name]));

  const items = await products.find({ restaurantId: restaurant._id }).toArray();
  console.log(`Uploading ${items.length} product images…`);

  let ok = 0, fail = 0;
  for (const p of items) {
    const catName = catNameById[String(p.categoryId)] || "";
    const photoId = pickImageForProduct(p.name, catName);
    const publicId = `qr-menu/cheese-steak/products/${slugify(p.name)}`;
    const url = await uploadRemote(UNSPLASH(photoId), publicId);
    const finalUrl =
      url ||
      (await uploadRemote(UNSPLASH(CATEGORY_FALLBACK[catName] || "photo-1546069901-ba9599a7e63c"), publicId));
    if (finalUrl) {
      await products.updateOne({ _id: p._id }, { $set: { image: finalUrl, updatedAt: new Date() } });
      ok += 1;
      console.log(`  ✓ ${p.name}`);
    } else {
      fail += 1;
      console.log(`  ✗ ${p.name} (no image)`);
    }
  }

  console.log(`\nDone. ${ok} ok, ${fail} failed.`);
  await mongoose.disconnect();
})().catch(async (e) => {
  console.error(e);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
