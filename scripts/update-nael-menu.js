/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * update-nael-menu.js
 * Replaces ALL categories & products for MAISON NAËL with the new menu.
 * Run: node scripts/update-nael-menu.js
 */

const fs   = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// ── Load .env.local ──────────────────────────────────────────────────────────
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const [k, ...v] = line.split("=");
    if (k && !(k in process.env)) process.env[k.trim()] = v.join("=").trim();
  }
}

// ── Reuse existing Cloudinary image cache ────────────────────────────────────
const PROG_PATH = path.join(__dirname, ".nael-img-progress.json");
const progress  = fs.existsSync(PROG_PATH) ? JSON.parse(fs.readFileSync(PROG_PATH)) : {};
const img = (name) => progress[`item:${name}`] || "";

// ── New menu data ─────────────────────────────────────────────────────────────
// Categories in display order
const CATEGORIES = [
  { key: "jus_smoothies",   name: "Jus frais & smoothies",      sortOrder: 1  },
  { key: "signature",       name: "Signature",                   sortOrder: 2  },
  { key: "mocktails",       name: "Mocktails",                   sortOrder: 3  },
  { key: "eaux_gazeuses",   name: "Eaux et boissons gazeuses",   sortOrder: 4  },
  { key: "supplements",     name: "Suppléments",                 sortOrder: 5  },
  { key: "boissons_chaudes",name: "Boissons chaudes",            sortOrder: 6  },
  { key: "hot_cold",        name: "Hot & Cold",                  sortOrder: 7  },
  { key: "thes",            name: "Nos thés",                    sortOrder: 8  },
  { key: "cafes_glaces",    name: "Café glacé",                  sortOrder: 9  },
  { key: "matcha",          name: "Nos matchas",                 sortOrder: 10 },
  { key: "milkshakes",      name: "Milkshakes",                  sortOrder: 11 },
  { key: "brunch",          name: "Brunch & salé",               sortOrder: 12 },
  { key: "pains_perdus",    name: "Pains perdus",                sortOrder: 13 },
];

// Products: [name, catKey, price, badge?, description?, imageUrl?]
const PRODUCTS = [
  // Jus frais & smoothies
  ["Citronnade / Orange",   "jus_smoothies",    8,    "", "", img("Citronnade / Orange")   || "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=85"],
  ["Fraise fraîche",        "jus_smoothies",    9,    "", "", img("Fraise fraîche")        || "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=800&q=85"],
  ["Banane crémeuse",       "jus_smoothies",    12,   "", "", img("Banane crémeuse")       || "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Fraise banane",         "jus_smoothies",    14,   "Populaire", "", img("Fraise Banane") || "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=800&q=85"],
  ["Datte banane",          "jus_smoothies",    14,   "", "", img("Datte Banane")          || "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Mangue banane",         "jus_smoothies",    16,   "", "", img("Mangue Banane")         || "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Détox verte",           "jus_smoothies",    12,   "", "", img("Détox verte")           || "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Détox orangée",         "jus_smoothies",    12,   "", "", img("Détox orangée")         || "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=800&q=85"],
  ["Coco mangue",           "jus_smoothies",    16,   "", "", img("Coco Mangue")           || "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Limonade passion",      "jus_smoothies",    16,   "Populaire", "", img("Limonade Passion") || "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=85"],
  ["Pina colada",           "jus_smoothies",    16,   "", "", img("Pina Colada")           || "https://images.pexels.com/photos/8504563/pexels-photo-8504563.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Fruits rouges",         "jus_smoothies",    16,   "", "", img("Fruits Rouges")         || "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=800&q=85"],
  ["Perles tropicale",      "jus_smoothies",    17,   "Signature", "", img("Perles Tropicale") || "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Perles sunset",         "jus_smoothies",    17,   "Signature", "", img("Perles Sunset") || "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Colada fraise",         "jus_smoothies",    17,   "", "", img("Colada Fraise")         || "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=800&q=85"],

  // Signature
  ["Velours d'orge",        "signature",        13,   "Signature", "", img("Velours d'Orge") || "https://images.pexels.com/photos/8504563/pexels-photo-8504563.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Nectar d'orge",         "signature",        15,   "Signature", "", img("Nectar d'Orge") || "https://images.pexels.com/photos/8504563/pexels-photo-8504563.jpeg?auto=compress&cs=tinysrgb&w=800"],

  // Mocktails
  ["Virgin mojito",         "mocktails",        12.5, "", "", img("Virgin Mojito")         || "https://images.pexels.com/photos/7259054/pexels-photo-7259054.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Mojito mangue",         "mocktails",        14,   "", "", img("Mojito Mangue")         || "https://images.pexels.com/photos/7259054/pexels-photo-7259054.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Mojito passion",        "mocktails",        14,   "", "", img("Mojito Passion")        || "https://images.pexels.com/photos/7259054/pexels-photo-7259054.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Mojito ananas basilic", "mocktails",        14.5, "", "", img("Mojito Ananas Basilic") || "https://images.pexels.com/photos/7259054/pexels-photo-7259054.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Océan bleu",            "mocktails",        14,   "Nouveau", "", img("Océan Bleu")     || "https://images.pexels.com/photos/8504563/pexels-photo-8504563.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Limonade à la fraise",  "mocktails",        12.5, "Populaire", "", img("Limonade à la fraise") || "https://images.pexels.com/photos/36630839/pexels-photo-36630839.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Diabolo grenadine",     "mocktails",        12.5, "", "", img("Diabolo Grenadine")     || "https://images.pexels.com/photos/36630839/pexels-photo-36630839.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Glow Up",               "mocktails",        16.5, "Signature", "", img("Glow Up")      || "https://images.pexels.com/photos/36630839/pexels-photo-36630839.jpeg?auto=compress&cs=tinysrgb&w=800"],

  // Eaux et boissons gazeuses
  ["Eau minérale 0,5 L",   "eaux_gazeuses",    3,    "", "", img("Eau minérale 0.5L")     || "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=85"],
  ["Eau minérale 0,75 L",  "eaux_gazeuses",    5,    "", "", img("Eau minérale 0.75L")    || "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=85"],
  ["Eau gazéifiée 1 L",    "eaux_gazeuses",    5.5,  "", "", img("Eau gazéifiée 1L")      || "https://images.pexels.com/photos/18212879/pexels-photo-18212879.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Boisson énergétique",  "eaux_gazeuses",    8,    "", "", img("Boisson énergétique")   || "https://images.pexels.com/photos/5860659/pexels-photo-5860659.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Boissons gazeuses",    "eaux_gazeuses",    5.5,  "", "", img("Boissons gazeuses")     || "https://images.pexels.com/photos/5860659/pexels-photo-5860659.jpeg?auto=compress&cs=tinysrgb&w=800"],

  // Suppléments
  ["Verre de lait",              "supplements",  2.5, "", "", img("Verre de lait")              || "https://images.pexels.com/photos/2198626/pexels-photo-2198626.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Arôme / Lait concentré",    "supplements",  2,   "", "", img("Arôme / Lait concentré")    || "https://images.pexels.com/photos/2198626/pexels-photo-2198626.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Lait sans lactose",          "supplements",  2,   "", "", img("Lait sans lactose")          || "https://images.pexels.com/photos/2198626/pexels-photo-2198626.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Lait d'amande ou d'avoine", "supplements",  3,   "", "", img("Lait d'amande ou d'avoine") || "https://images.pexels.com/photos/2198626/pexels-photo-2198626.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Shot espresso",              "supplements",  2.5, "", "", img("Shot espresso")              || "https://images.pexels.com/photos/11160148/pexels-photo-11160148.jpeg?auto=compress&cs=tinysrgb&w=800"],

  // Boissons chaudes
  ["Espresso",             "boissons_chaudes",  6,    "", "", img("Espresso")              || "https://images.pexels.com/photos/11160148/pexels-photo-11160148.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Americano",            "boissons_chaudes",  7,    "", "", img("Americano")             || "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=800&q=85"],
  ["Cortado",              "boissons_chaudes",  7,    "", "", img("Cortado")               || "https://images.pexels.com/photos/11160148/pexels-photo-11160148.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Café crème",           "boissons_chaudes",  7.5,  "", "", img("Café crème")            || "https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?auto=format&fit=crop&w=800&q=85"],
  ["Cappuccino",           "boissons_chaudes",  8,    "Populaire", "", img("Cappuccino")   || "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=85"],
  ["Spanish Latte",        "boissons_chaudes",  8.5,  "Populaire", "", img("Spanish Latte") || "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=85"],
  ["Latte saveur",         "boissons_chaudes",  9,    "", "Caramel / Noisette / Vanille", img("Latte saveur") || "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=85"],
  ["Latte tiramisu",       "boissons_chaudes",  12,   "Signature", "", img("Latte Tiramisu") || "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?auto=format&fit=crop&w=800&q=85"],
  ["Mocha blanc",          "boissons_chaudes",  10,   "", "", img("Mocha Blanc")           || "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=85"],
  ["Latte pistache",       "boissons_chaudes",  14,   "Signature", "", img("Latte Pistache") || "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?auto=format&fit=crop&w=800&q=85"],
  ["Chocolat laitier",     "boissons_chaudes",  7,    "", "", img("Chocolat laitier")      || "https://images.pexels.com/photos/35210027/pexels-photo-35210027.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Chocolat chaud",       "boissons_chaudes",  10,   "", "", img("Chocolat chaud")        || "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=85"],
  ["Chocolat blanc chaud", "boissons_chaudes",  12,   "", "", img("Chocolat blanc chaud")  || "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=85"],

  // Hot & Cold
  ["Affogato classique",   "hot_cold",          9,    "", "", img("Affogato classique")    || "https://images.pexels.com/photos/36576776/pexels-photo-36576776.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Affogato tiramisu",    "hot_cold",          12.5, "Populaire", "", img("Affogato Tiramisu") || "https://images.pexels.com/photos/36576776/pexels-photo-36576776.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Affogato pistache",    "hot_cold",          14,   "Signature", "", img("Affogato Pistache") || "https://images.pexels.com/photos/36576776/pexels-photo-36576776.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Choco glacier",        "hot_cold",          12,   "", "", img("Choco Glacier")         || "https://images.pexels.com/photos/36576776/pexels-photo-36576776.jpeg?auto=compress&cs=tinysrgb&w=800"],

  // Nos thés
  ["Thé infusion",         "thes",              8,    "", "", img("Thé infusion")          || "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85"],
  ["Thé glacé pêche",      "thes",              10,   "", "", img("Thé glacé pêche")       || "https://images.pexels.com/photos/824201/pexels-photo-824201.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Thé glacé citron",     "thes",              10,   "", "", img("Thé glacé citron")      || "https://images.pexels.com/photos/824201/pexels-photo-824201.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Thé glacé passion",    "thes",              10,   "Populaire", "", img("Thé glacé passion") || "https://images.pexels.com/photos/824201/pexels-photo-824201.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Thé glacé framboise",  "thes",              10,   "", "", img("Thé glacé framboise")   || "https://images.pexels.com/photos/824201/pexels-photo-824201.jpeg?auto=compress&cs=tinysrgb&w=800"],

  // Café glacé
  ["Americano glacé",            "cafes_glaces",  9,    "", "", img("Americano glacé")            || "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Spanish latte glacé",        "cafes_glaces",  12,   "Populaire", "", img("Spanish Latte glacé") || "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Latte glacé caramel",        "cafes_glaces",  13,   "", "", img("Latte glacé caramel")        || "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=85"],
  ["Latte glacé tiramisu",       "cafes_glaces",  14,   "Signature", "", img("Latte glacé tiramisu") || "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Latte glacé pistache",       "cafes_glaces",  15,   "Signature", "", img("Latte glacé pistache") || "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?auto=format&fit=crop&w=800&q=85"],
  ["Frappé noisette chocolat",   "cafes_glaces",  15.5, "", "", img("Frappé noisette chocolat")   || "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Frappé caramel",             "cafes_glaces",  15,   "Populaire", "", img("Frappé caramel")     || "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Frappé chocolat blanc",      "cafes_glaces",  15.5, "", "", img("Frappé chocolat blanc")      || "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Frappé pistache",            "cafes_glaces",  16,   "Signature", "", img("Frappé pistache")    || "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?auto=format&fit=crop&w=800&q=85"],

  // Nos matchas
  ["Matcha Latte",               "matcha",        9,    "", "", img("Matcha Latte")               || "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85"],
  ["Matcha chocolat blanc",      "matcha",        12,   "", "", img("Matcha Chocolat Blanc")      || "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85"],
  ["Matcha latte glacé",         "matcha",        12.5, "Populaire", "", img("Matcha Latte glacé") || "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85"],
  ["Matcha fraise glacée",       "matcha",        15,   "Signature", "", img("Matcha Fraise glacée") || "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85"],
  ["Matcha mangue glacé",        "matcha",        16,   "", "", img("Matcha Mangue glacé")        || "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85"],
  ["Matcha limonade passion",    "matcha",        15,   "Nouveau", "", img("Matcha Limonade Passion") || "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85"],

  // Milkshakes
  ["Chocolat-noisette shake",    "milkshakes",    16,   "", "", img("Chocolat-Noisette Shake")    || "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Fraise shake",               "milkshakes",    15,   "Populaire", "", img("Fraise Shake")       || "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Mangue shake",               "milkshakes",    15,   "", "", img("Mangue Shake")               || "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Pêche shake",                "milkshakes",    16,   "", "", img("Pêche Shake")                || "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Caramel café shake",         "milkshakes",    16,   "", "", img("Caramel Café Shake")         || "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Pistache shake",             "milkshakes",    17,   "Signature", "", img("Pistache Shake")     || "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800"],

  // Brunch & salé (NEW)
  ["Benedict Saumon Fumé",           "brunch",    24,   "Signature", "", "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Benedict Bresaola",              "brunch",    24,   "", "",          "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Omelette Gourmet",               "brunch",    16,   "", "",          "https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Croque Monsieur Truffe",         "brunch",    18,   "", "",          "https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Burrata Toast Signature",        "brunch",    24,   "Signature", "", "https://images.pexels.com/photos/3407777/pexels-photo-3407777.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Tartine Méditerranéenne",        "brunch",    18,   "", "",          "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Gaufre Rösti Poulet Crispy",     "brunch",    20,   "Populaire", "", "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Salade César Croustillante",     "brunch",    19,   "", "",          "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Tuna Bowl",                      "brunch",    22,   "", "",          "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Salade Estivale",                "brunch",    20,   "", "",          "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Focaccia Pesche",                "brunch",    22,   "", "",          "https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Focaccia Bresaola",              "brunch",    30,   "Signature", "", "https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Cubano Chicken Sandwich",        "brunch",    22,   "Populaire", "", "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=800"],

  // Pains perdus (NEW)
  ["Pain Perdu Vanille Caramel",     "pains_perdus", 20, "Populaire", "", "https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ["Pain Perdu Framboise Pistache",  "pains_perdus", 24, "Signature", "", "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800"],
];

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "qr_menu_saas" });
  const db = mongoose.connection.db;

  const restaurants = db.collection("restaurants");
  const categories  = db.collection("categories");
  const products    = db.collection("products");

  // Find MAISON NAËL
  const restaurant = await restaurants.findOne({ slug: "maison-nael" });
  if (!restaurant) throw new Error("MAISON NAËL not found in DB");
  const restaurantId = restaurant._id;
  console.log(`✓ Found MAISON NAËL (${restaurantId})`);

  // Delete all existing categories and products
  const delCats = await categories.deleteMany({ restaurantId });
  const delProds = await products.deleteMany({ restaurantId });
  console.log(`🗑  Deleted ${delCats.deletedCount} categories, ${delProds.deletedCount} products`);

  // Insert new categories
  const now = new Date();
  const catIds = {};
  for (const cat of CATEGORIES) {
    const res = await categories.insertOne({
      restaurantId,
      name:       cat.name,
      description: "",
      isActive:   true,
      sortOrder:  cat.sortOrder,
      createdAt:  now,
      updatedAt:  now,
    });
    catIds[cat.key] = res.insertedId;
    console.log(`  + Category: ${cat.name}`);
  }

  // Insert new products
  let sortOrder = 0;
  for (const [name, catKey, price, badge, desc, imageUrl] of PRODUCTS) {
    sortOrder++;
    await products.insertOne({
      restaurantId,
      categoryId:  catIds[catKey],
      name,
      description: desc || name,
      price,
      image:       imageUrl || "",
      badge:       badge || "",
      isAvailable: true,
      isFeatured:  badge === "Populaire" || badge === "Signature",
      sortOrder,
      createdAt:   now,
      updatedAt:   now,
    });
  }
  console.log(`\n✅ Inserted ${CATEGORIES.length} categories and ${PRODUCTS.length} products.`);

  await mongoose.disconnect();
  console.log("Done!\n");
}

run().catch(async (err) => {
  console.error("❌", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
