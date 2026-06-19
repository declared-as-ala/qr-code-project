/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * seed-fiesta.js — seeds ONLY the Fiesta+ café.
 * Does NOT touch any existing restaurant, user, or menu data.
 * Run: node scripts/seed-fiesta.js
 */
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const envLocalPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const lines = fs.readFileSync(envLocalPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith("#") || !line.includes("=")) continue;
    const [key, ...rest] = line.split("=");
    const value = rest.join("=");
    if (key && !(key in process.env)) {
      process.env[key.trim()] = value.trim();
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is required. Add it to .env.local or environment.");
}

async function run() {
  const getUpdatedDoc = (result) => result?.value ?? result;

  await mongoose.connect(MONGODB_URI, { dbName: "qr_menu_saas" });

  const db = mongoose.connection.db;
  const users = db.collection("users");
  const restaurants = db.collection("restaurants");
  const categories = db.collection("categories");
  const products = db.collection("products");
  const qrcodes = db.collection("qrcodes");

  const now = new Date();

  // ── Fiesta+ admin user ────────────────────────────────────────────────────────
  const adminEmail = "owner@fiesta-plus.tn";
  const adminPassword = "FiestaPlus@2026";
  const adminHash = await bcrypt.hash(adminPassword, 12);

  const adminResult = await users.findOneAndUpdate(
    { email: adminEmail },
    {
      $set: {
        name: "Fiesta+ Owner",
        email: adminEmail,
        passwordHash: adminHash,
        role: "restaurant_admin",
        mustChangePassword: false,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true, returnDocument: "after" }
  );

  const ownerId = getUpdatedDoc(adminResult)?._id;
  if (!ownerId) throw new Error("Failed to upsert Fiesta+ admin user.");

  // ── Fiesta+ restaurant ─────────────────────────────────────────────────────
  const restaurantResult = await restaurants.findOneAndUpdate(
    { slug: "fiesta-plus" },
    {
      $set: {
        ownerId,
        name: "Fiesta+",
        slug: "fiesta-plus",
        establishmentType: "cafe",
        tagline: "Resto · Café · Pâtisserie",
        description:
          "Un espace chaleureux alliant café de qualité, pâtisseries maison, pizzas artisanales, sandwichs généreux et plats savoureux. Fiesta+, votre pause gourmande au quotidien.",
        phone: "",
        address: "Tunisie",
        instagram: "",
        facebook: "",
        googleMapsUrl: "",
        logo: "https://res.cloudinary.com/do5ui8npg/image/upload/v1780493964/fiesta-plus/logo.png",
        coverImage:
          "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1800&q=90",
        primaryColor: "#1a1a1a",
        secondaryColor: "#f5f0e8",
        currency: "DT",
        isActive: true,
        showPrices: true,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true, returnDocument: "after" }
  );

  const restaurantId = getUpdatedDoc(restaurantResult)?._id;
  if (!restaurantId) throw new Error("Failed to upsert Fiesta+ restaurant.");

  const img = (id) => id; // Cloudinary URLs — id is already the full URL

  // ── Categories ─────────────────────────────────────────────────────────────
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
    const result = await categories.findOneAndUpdate(
      { restaurantId, name: cat.name },
      {
        $set: {
          restaurantId,
          name: cat.name,
          description: "",
          isActive: true,
          sortOrder: cat.sortOrder,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, returnDocument: "after" }
    );
    catIds[cat.key] = getUpdatedDoc(result)?._id;
  }

  // ── Products ───────────────────────────────────────────────────────────────
  const productData = [
    // Petit-déjeuner & Brunch
    { c: "breakfast", n: "Express",                                p: 8.500,  i: "photo-1509042239860-f550ce710b93", b: "" },
    { c: "breakfast", n: "Petit-déjeuner Matinal",                 p: 14.500, i: "photo-1504674900247-0877df9cc836", b: "Populaire" },
    { c: "breakfast", n: "Brunch",                                 p: 47.000, i: "photo-1533089860892-a7c6f0a88666", b: "Signature" },

    // Crêpes Sucrées
    { c: "crepes_sucrees", n: "Crêpe Chocolat",                    p: 6.500,  i: "photo-1519676867240-f03562e64548", b: "" },
    { c: "crepes_sucrees", n: "Crêpe Nutella",                     p: 10.000, i: "photo-1519676867240-f03562e64548", b: "Populaire" },

    // Crêpes Salées
    { c: "crepes_salees", n: "Crêpe Fromage",                      p: 6.500,  i: "photo-1519676867240-f03562e64548", b: "" },
    { c: "crepes_salees", n: "Crêpe Thon",                         p: 7.500,  i: "photo-1567620905732-2d1ec7ab7445", b: "" },
    { c: "crepes_salees", n: "Crêpe Jambon/Salami Fromage",        p: 7.500,  i: "photo-1567620905732-2d1ec7ab7445", b: "" },
    { c: "crepes_salees", n: "Crêpe Thon & Fromage",               p: 9.000,  i: "photo-1567620905732-2d1ec7ab7445", b: "" },
    { c: "crepes_salees", n: "Crêpe Escalope & Fromage",           p: 9.000,  i: "photo-1567620905732-2d1ec7ab7445", b: "Populaire" },

    // Gaufres
    { c: "gaufres", n: "Gaufre Chocolat",                          p: 6.500,  i: "photo-1562376552-0d160a2f238d", b: "" },
    { c: "gaufres", n: "Gaufre Nutella",                           p: 10.000, i: "photo-1562376552-0d160a2f238d", b: "Populaire" },

    // Pizzas
    { c: "pizzas", n: "Margherita",                                p: 12.500, i: "photo-1574071318508-1cdbab80d002", b: "" },
    { c: "pizzas", n: "Pizza Thon",                                p: 16.500, i: "photo-1565299585323-38d6b0865b47", b: "" },
    { c: "pizzas", n: "Pizza Escalope",                            p: 17.000, i: "photo-1513104890138-7c749659a591", b: "Populaire" },
    { c: "pizzas", n: "4 Saisons",                                 p: 18.500, i: "photo-1548369937-47519962c11a", b: "" },
    { c: "pizzas", n: "4 Fromages",                                p: 19.000, i: "photo-1571091718767-18b5b1457add", b: "" },
    { c: "pizzas", n: "Pizza Fruits de Mer",                       p: 22.000, i: "photo-1590947132387-155cc02f3212", b: "Signature" },

    // Sandwichs
    { c: "sandwichs", n: "Libanais / Tabouna",                     p: 10.000, i: "photo-1561651823-d363931a0dd3", b: "" },
    { c: "sandwichs", n: "Makloub / Baguette Farcie",              p: 11.500, i: "photo-1554080353-a576cf803bda", b: "" },
    { c: "sandwichs", n: "Tacos",                                  p: 12.500, i: "photo-1565030851824-9f35aa628b0a", b: "Populaire" },
    { c: "sandwichs", n: "Panozzo",                                p: 13.000, i: "photo-1521390188675-9099e2c2e82d", b: "" },
    { c: "sandwichs", n: "Panini Thon Fromage",                    p: 6.500,  i: "photo-1528735602780-2552fd46c7af", b: "" },
    { c: "sandwichs", n: "Panini Escalope Fromage",                p: 7.500,  i: "photo-1528735602780-2552fd46c7af", b: "" },

    // Plats Principaux
    { c: "plats", n: "Escalope Grillée",                           p: 19.000, i: "photo-1604503468506-a8da13d82791", b: "" },
    { c: "plats", n: "Escalope Panée",                             p: 19.500, i: "photo-1594834749740-74b3f6764be4", b: "Populaire" },
    { c: "plats", n: "Cordon Bleu",                                p: 20.500, i: "photo-1603360946369-dc9bb6258143", b: "" },
    { c: "plats", n: "Dorade / Loup Grillé",                       p: 25.000, i: "photo-1519708227418-c8fd9a32b7a2", b: "Signature" },

    // Pâtes
    { c: "pates", n: "Pâtes Poulet",                               p: 16.500, i: "photo-1608897013039-887f21d8c804", b: "" },
    { c: "pates", n: "Pâtes Putanesca",                            p: 17.000, i: "photo-1563379091339-03b21ab4a4f8", b: "" },
    { c: "pates", n: "Pâtes Bolognaise",                           p: 18.000, i: "photo-1612874742237-6526221588e3", b: "Populaire" },
    { c: "pates", n: "Pâtes Fruits de Mer",                        p: 27.000, i: "photo-1563379971899-660589a01cf3", b: "Signature" },

    // Lasagnes
    { c: "lasagnes", n: "Lasagne Poulet",                          p: 17.000, i: "photo-1574894709920-11b28e7367e3", b: "" },
    { c: "lasagnes", n: "Lasagne Bolognaise",                      p: 19.000, i: "photo-1574894709920-11b28e7367e3", b: "Populaire" },

    // Entrées Froides
    { c: "entrees_froides", n: "Salade Verte",                     p: 9.000,  i: "photo-1540420773420-3366772f4999", b: "" },
    { c: "entrees_froides", n: "Salade Riz",                       p: 9.500,  i: "photo-1546069901-ba9599a7e63c",  b: "" },
    { c: "entrees_froides", n: "Salade César",                     p: 13.000, i: "photo-1550304943-4f24f54ddde9", b: "Populaire" },

    // Entrées Chaudes
    { c: "entrees_chaudes", n: "Omelette Thon & Fromage",          p: 12.500, i: "photo-1510693206972-df098062cb71", b: "" },
    { c: "entrees_chaudes", n: "Ojja Merguez",                     p: 16.000, i: "photo-1590412200988-a436bb7050a7", b: "Populaire" },
    { c: "entrees_chaudes", n: "Ojja Escalope",                    p: 18.000, i: "photo-1534080564583-6be75777b70a", b: "" },
    { c: "entrees_chaudes", n: "Ojja Fruits de Mer",               p: 22.000, i: "photo-1534422298391-e4f8c172dddb", b: "Signature" },

    // Cafés & Boissons Chaudes
    { c: "cafes", n: "Espresso",                                   p: 3.000,  i: "photo-1510591509098-f4fdc6d0ff04", b: "" },
    { c: "cafes", n: "Américain",                                  p: 3.200,  i: "photo-1497515114629-f71d768fd07c", b: "" },
    { c: "cafes", n: "Cappuccino",                                  p: 3.200,  i: "photo-1534040385115-33dcb3acba5b", b: "" },
    { c: "cafes", n: "Café Crème",                                 p: 3.500,  i: "photo-1572442388796-11668a67e53d", b: "" },
    { c: "cafes", n: "Cappuccino Spécial",                         p: 4.500,  i: "photo-1570968915860-54d5c301fa9f", b: "Populaire" },
    { c: "cafes", n: "Café Spéculoos",                             p: 4.500,  i: "photo-1509042239860-f550ce710b93", b: "" },
    { c: "cafes", n: "Café Nutella",                               p: 4.500,  i: "photo-1571091655789-405eb7a3a3a8", b: "Nouveau" },
    { c: "cafes", n: "Chocolat Chaud",                             p: 4.500,  i: "photo-1542815801-33b28b5cc693", b: "" },
    { c: "cafes", n: "Chocolat au Lait",                           p: 2.500,  i: "photo-1554136573-30d49cef27e8", b: "" },
    { c: "cafes", n: "Tasse de Lait",                              p: 1.500,  i: "photo-1550583724-b2692b85b150", b: "" },
    { c: "cafes", n: "Arôme Café",                                p: 1.000,  i: "photo-1510591509098-f4fdc6d0ff04", b: "" },

    // Boissons Froides
    { c: "froides", n: "Ice Coffee",                               p: 5.000,  i: "photo-1461023058943-07fcbe16d735", b: "Populaire" },
    { c: "froides", n: "Thé Infusion",                             p: 2.500,  i: "photo-1576092768241-dec231879fc3", b: "" },

    // Jus Frais
    { c: "jus", n: "Citronnade",                                   p: 4.000,  i: "photo-1513558161293-cdaf765ed2fd", b: "" },
    { c: "jus", n: "Jus d'Orange",                                p: 4.500,  i: "photo-1534353436294-0dbd4bdac845", b: "Populaire" },
    { c: "jus", n: "Jus Fraise",                                   p: 7.000,  i: "photo-1553361371-9b22f78e8b1d", b: "" },
    { c: "jus", n: "Jus Cocktail",                                p: 9.000,  i: "photo-1497534446932-c925b458314e", b: "" },
    { c: "jus", n: "Jwajem",                                       p: 12.000, i: "photo-1512621776951-a57141f2eefd", b: "Signature" },

    // Milkshakes
    { c: "milkshakes", n: "Milkshake Normal",                      p: 6.500,  i: "photo-1572490122747-3968b75cc699", b: "" },

    // Mojitos
    { c: "mojitos", n: "Virgin Mojito",                            p: 7.500,  i: "photo-1551538827-9c037cb4f32a", b: "" },
    { c: "mojitos", n: "Blue Mojito",                              p: 8.500,  i: "photo-1582106245687-cbb466a9f07f", b: "Populaire" },
    { c: "mojitos", n: "Red Mojito",                               p: 8.500,  i: "photo-1551024709-8f23befc6f87", b: "" },

    // Glaces & Frappuccino
    { c: "glaces", n: "Frappuccino (Nutella / Oreo / Spéculoos)", p: 8.500,  i: "photo-1461023058943-07fcbe16d735", b: "Populaire" },
    { c: "glaces", n: "Glace 2 Boules",                            p: 6.000,  i: "photo-1501443721117-39d6e87f1854", b: "" },

    // Autres Boissons
    { c: "autres", n: "Eau 0.5L",                                  p: 1.800,  i: "photo-1548839140-29a749e1cf4d", b: "" },
    { c: "autres", n: "Eau 1L",                                    p: 2.500,  i: "photo-1548839140-29a749e1cf4d", b: "" },
    { c: "autres", n: "Eau Gazeuse",                               p: 3.000,  i: "photo-1523362628745-0c100150b504", b: "" },
    { c: "autres", n: "Canette",                                   p: 3.000,  i: "photo-1621263764928-df1444c5e859", b: "" },
    { c: "autres", n: "Yaourt Glacé",                              p: 6.500,  i: "photo-1488477181946-6428a0291777", b: "" },

    // Gâteaux & Pâtisseries
    { c: "patisseries", n: "Tarte du Jour",                        p: 5.000,  i: "photo-1565958011703-44f9829ba187", b: "" },
    { c: "patisseries", n: "Cookies",                              p: 5.500,  i: "photo-1499636136210-6f4ee915583e", b: "" },
    { c: "patisseries", n: "Brownies",                             p: 5.500,  i: "photo-1578985545062-69928b1d9587", b: "" },
    { c: "patisseries", n: "Fondant au Chocolat",                  p: 5.500,  i: "photo-1606313564200-e75d5e30476c", b: "Populaire" },
    { c: "patisseries", n: "Gâteau du Jour",                      p: 6.500,  i: "photo-1571115177098-24ec42ed204d", b: "" },
    { c: "patisseries", n: "Verrine",                              p: 6.500,  i: "photo-1488477181946-6428a0291777", b: "" },
    { c: "patisseries", n: "Tarte aux Amandes",                    p: 6.500,  i: "photo-1565958011703-44f9829ba187", b: "" },
    { c: "patisseries", n: "Cheesecake",                           p: 7.500,  i: "photo-1533134242443-d4fd215305ad", b: "Populaire" },
    { c: "patisseries", n: "Petit Cake",                           p: 8.000,  i: "photo-1578985545062-69928b1d9587", b: "" },
    { c: "patisseries", n: "Grand Cake",                           p: 11.000, i: "photo-1571115177098-24ec42ed204d", b: "" },
    { c: "patisseries", n: "Cake Rond",                            p: 13.000, i: "photo-1578985545062-69928b1d9587", b: "Signature" },
    { c: "patisseries", n: "Mini-Gâteaux (1 Kg)",                  p: 47.000, i: "photo-1571115177098-24ec42ed204d", b: "" },
    { c: "patisseries", n: "Muffin",                               p: 3.000,  i: "photo-1558961363-fa8fdf82db35", b: "" },
    { c: "patisseries", n: "Tranche de Cake",                      p: 3.000,  i: "photo-1571115177098-24ec42ed204d", b: "" },
  ];

  let sortOrder = 0;
  for (const item of productData) {
    sortOrder += 1;
    await products.findOneAndUpdate(
      { restaurantId, name: item.n },
      {
        $set: {
          restaurantId,
          categoryId: catIds[item.c],
          name: item.n,
          description: item.n,
          price: item.p,
          image: item.i ? img(item.i) : "",
          badge: item.b || "",
          isAvailable: true,
          isFeatured: item.b === "Populaire" || item.b === "Signature",
          sortOrder,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );
  }

  // ── QR code placeholder ────────────────────────────────────────────────────
  await qrcodes.findOneAndUpdate(
    { restaurantId },
    {
      $set: {
        restaurantId,
        targetUrl: "http://localhost:3000/menu/fiesta-plus",
        qrImageUrl: "",
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  );

  console.log("\n✅ Fiesta+ seeded successfully!");
  console.log("─────────────────────────────────────────");
  console.log("Cafe Admin (Fiesta+):");
  console.log(`  Email:    ${adminEmail}`);
  console.log(`  Password: ${adminPassword}`);
  console.log("\nPublic menu:");
  console.log("  http://localhost:3000/menu/fiesta-plus\n");

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
