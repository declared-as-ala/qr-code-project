/* eslint-disable @typescript-eslint/no-require-imports */
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

  const superAdminEmail = "superadmin@qrmenu.tn";
  const superAdminPassword = "SuperAdmin@123";
  const restaurantAdminEmail = "admin@elgrotte.tn";
  const restaurantAdminPassword = "Elgrotte@123";

  const superAdminHash = await bcrypt.hash(superAdminPassword, 12);
  const restaurantAdminHash = await bcrypt.hash(restaurantAdminPassword, 12);

  await users.findOneAndUpdate(
    { email: superAdminEmail },
    {
      $set: {
        name: "Super Admin",
        email: superAdminEmail,
        passwordHash: superAdminHash,
        role: "super_admin",
        mustChangePassword: false,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true, returnDocument: "after" }
  );

  const restaurantAdminResult = await users.findOneAndUpdate(
    { email: restaurantAdminEmail },
    {
      $set: {
        name: "Elgrotte Owner",
        email: restaurantAdminEmail,
        passwordHash: restaurantAdminHash,
        role: "restaurant_admin",
        mustChangePassword: false,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true, returnDocument: "after" }
  );

  const ownerId = getUpdatedDoc(restaurantAdminResult)?._id;
  if (!ownerId) throw new Error("Failed to upsert restaurant admin user.");

  const restaurantResult = await restaurants.findOneAndUpdate(
    { slug: "elgrotte" },
    {
      $set: {
        ownerId,
        name: "Elgrotte",
        slug: "elgrotte",
        establishmentType: "cafe",
        phone: "+21697991266",
        address: "Monastir, Tunisie",
        instagram: "https://instagram.com/elgrotte",
        facebook: "https://facebook.com/elgrotte",
        googleMapsUrl: "https://maps.google.com/?q=Monastir+Tunisie",
        logo: "",
        coverImage: "",
        primaryColor: "#B08D57",
        secondaryColor: "#F5E6CC",
        isActive: true,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true, returnDocument: "after" }
  );

  const restaurantId = getUpdatedDoc(restaurantResult)?._id;
  if (!restaurantId) throw new Error("Failed to upsert demo restaurant.");

  const categoryData = [
    { key: "entrees", name: "Entrees", sortOrder: 1 },
    { key: "plats", name: "Plats principaux", sortOrder: 2 },
    { key: "desserts", name: "Desserts", sortOrder: 3 },
    { key: "boissons", name: "Boissons", sortOrder: 4 },
    { key: "cocktails", name: "Cocktails signature", sortOrder: 5 },
  ];

  const categoryIds = {};
  for (const item of categoryData) {
    const result = await categories.findOneAndUpdate(
      { restaurantId, name: item.name },
      {
        $set: {
          restaurantId,
          name: item.name,
          description: "",
          sortOrder: item.sortOrder,
          isActive: true,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, returnDocument: "after" }
    );
    const categoryId = getUpdatedDoc(result)?._id;
    if (!categoryId) throw new Error(`Failed to upsert category: ${item.name}`);
    categoryIds[item.key] = categoryId;
  }

  const productData = [
    {
      name: "Tartare de saumon",
      categoryKey: "entrees",
      description: "Saumon frais, avocat, citron vert, huile d olive et coriandre.",
      price: 95,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      badge: "Signature",
      isAvailable: true,
      sortOrder: 1,
    },
    {
      name: "Burrata cremeuse",
      categoryKey: "entrees",
      description: "Burrata des Pouilles, tomates anciennes, basilic frais.",
      price: 85,
      image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      isAvailable: true,
      sortOrder: 2,
    },
    {
      name: "Filet de boeuf grille",
      categoryKey: "plats",
      description: "Sauce poivre maison, legumes sautes et puree truffee.",
      price: 145,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      badge: "Signature",
      isAvailable: true,
      sortOrder: 3,
    },
    {
      name: "Risotto aux champignons",
      categoryKey: "plats",
      description: "Risotto cremoso, parmesan affine, champignons saisis.",
      price: 98,
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80",
      badge: "Nouveau",
      isAvailable: true,
      sortOrder: 4,
    },
    {
      name: "Fondant chocolat",
      categoryKey: "desserts",
      description: "Coeur coulant, glace vanille et eclats de noisette.",
      price: 42,
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
      badge: "",
      isAvailable: true,
      sortOrder: 5,
    },
    {
      name: "Cheesecake fruits rouges",
      categoryKey: "desserts",
      description: "Cremes legeres et coulis maison de fruits rouges.",
      price: 38,
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      isAvailable: true,
      sortOrder: 6,
    },
    {
      name: "Cappuccino maison",
      categoryKey: "boissons",
      description: "Cafe intense, lait mousseux et touche cacao.",
      price: 12,
      image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
      badge: "",
      isAvailable: true,
      sortOrder: 7,
    },
    {
      name: "Iced latte vanille",
      categoryKey: "boissons",
      description: "Latte glace, vanille douce et creme fouettee.",
      price: 16,
      image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
      badge: "Nouveau",
      isAvailable: true,
      sortOrder: 8,
    },
    {
      name: "Mojito fraise",
      categoryKey: "cocktails",
      description: "Menthe fraiche, citron vert, fraise et eau petillante.",
      price: 24,
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
      badge: "Promo",
      isAvailable: true,
      sortOrder: 9,
    },
    {
      name: "Sunset Elgrotte",
      categoryKey: "cocktails",
      description: "Cocktail signature agrumes et fruits exotiques.",
      price: 28,
      image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80",
      badge: "",
      isAvailable: true,
      sortOrder: 10,
    },
  ];

  for (const item of productData) {
    await products.findOneAndUpdate(
      { restaurantId, name: item.name },
      {
        $set: {
          restaurantId,
          categoryId: categoryIds[item.categoryKey],
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image || "",
          badge: item.badge,
          isAvailable: item.isAvailable,
          isFeatured: item.badge === "Populaire",
          sortOrder: item.sortOrder,
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
      $set: {
        restaurantId,
        targetUrl: "http://localhost:3000/menu/elgrotte",
        qrImageUrl: "",
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  );

  // ── coffe-elgrotte ──────────────────────────────────────────────────────────
  const coffeAdminEmail = "admin@coffee-elgrotte.tn";
  const coffeAdminPassword = "CoffeeElgrotte@123";
  const coffeAdminHash = await bcrypt.hash(coffeAdminPassword, 12);

  const coffeAdminResult = await users.findOneAndUpdate(
    { email: coffeAdminEmail },
    {
      $set: {
        name: "Coffee Elgrotte Owner",
        email: coffeAdminEmail,
        passwordHash: coffeAdminHash,
        role: "restaurant_admin",
        mustChangePassword: false,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true, returnDocument: "after" }
  );

  const coffeOwnerId = getUpdatedDoc(coffeAdminResult)?._id;
  if (!coffeOwnerId) throw new Error("Failed to upsert coffee-elgrotte admin user.");

  const coffeRestaurantResult = await restaurants.findOneAndUpdate(
    { slug: "coffee-elgrotte" },
    {
      $set: {
        ownerId: coffeOwnerId,
        name: "Coffee Elgrotte",
        slug: "coffee-elgrotte",
        establishmentType: "cafe",
        phone: "+21698765432",
        address: "Monastir, Tunisie",
        instagram: "https://instagram.com/coffee.elgrotte",
        facebook: "https://facebook.com/coffeeelgrotte",
        googleMapsUrl: "https://maps.google.com/?q=Monastir+Tunisie",
        logo: "",
        coverImage: "",
        primaryColor: "#4A2C2A",
        secondaryColor: "#F9F3EE",
        isActive: true,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true, returnDocument: "after" }
  );

  const coffeRestaurantId = getUpdatedDoc(coffeRestaurantResult)?._id;
  if (!coffeRestaurantId) throw new Error("Failed to upsert coffee-elgrotte restaurant.");

  const coffeCategoryData = [
    { key: "cafes_chauds",    name: "Cafés Chauds",          sortOrder: 1 },
    { key: "cafes_glaces",    name: "Cafés Glacés",           sortOrder: 2 },
    { key: "thes",            name: "Thés & Infusions",       sortOrder: 3 },
    { key: "smoothies",       name: "Smoothies & Jus",        sortOrder: 4 },
    { key: "viennoiseries",   name: "Viennoiseries",          sortOrder: 5 },
    { key: "sandwichs",       name: "Sandwichs & Wraps",      sortOrder: 6 },
    { key: "patisseries",     name: "Pâtisseries & Gâteaux",  sortOrder: 7 },
    { key: "formules",        name: "Formules du Jour",        sortOrder: 8 },
  ];

  const coffeCategoryIds = {};
  for (const item of coffeCategoryData) {
    const result = await categories.findOneAndUpdate(
      { restaurantId: coffeRestaurantId, name: item.name },
      {
        $set: {
          restaurantId: coffeRestaurantId,
          name: item.name,
          description: "",
          sortOrder: item.sortOrder,
          isActive: true,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, returnDocument: "after" }
    );
    const catId = getUpdatedDoc(result)?._id;
    if (!catId) throw new Error(`Failed to upsert coffee-elgrotte category: ${item.name}`);
    coffeCategoryIds[item.key] = catId;
  }

  const coffeProductData = [
    // Cafés Chauds
    {
      name: "Espresso Classique",
      categoryKey: "cafes_chauds",
      description: "Ristretto corsé, crème veloutée, grain arabica sélectionné.",
      price: 5,
      image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80",
      badge: "Signature",
      sortOrder: 1,
    },
    {
      name: "Cappuccino Maison",
      categoryKey: "cafes_chauds",
      description: "Double espresso, lait mousseux onctueux et poudre de cacao.",
      price: 9,
      image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 2,
    },
    {
      name: "Latte Art",
      categoryKey: "cafes_chauds",
      description: "Espresso doux noyé dans un lait soyeux, rosetta dessinée à la main.",
      price: 11,
      image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
      badge: "",
      sortOrder: 3,
    },
    {
      name: "Flat White",
      categoryKey: "cafes_chauds",
      description: "Double ristretto intense avec micro-mousse crémeuse.",
      price: 12,
      image: "https://images.unsplash.com/photo-1585527048634-55e8cb5ae3a3?auto=format&fit=crop&w=800&q=80",
      badge: "Nouveau",
      sortOrder: 4,
    },
    {
      name: "Café Viennois",
      categoryKey: "cafes_chauds",
      description: "Espresso allongé surmonté de chantilly maison et copeaux de chocolat.",
      price: 13,
      image: "https://images.unsplash.com/photo-1572286258217-40f8f19b0de2?auto=format&fit=crop&w=800&q=80",
      badge: "",
      sortOrder: 5,
    },
    {
      name: "Macchiato Caramel",
      categoryKey: "cafes_chauds",
      description: "Latte chaud avec filet de caramel pur et espresso corsé.",
      price: 14,
      image: "https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 6,
    },
    // Cafés Glacés
    {
      name: "Cold Brew",
      categoryKey: "cafes_glaces",
      description: "Infusion lente 12h, notes chocolatées, servi sur glaçons.",
      price: 16,
      image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
      badge: "Signature",
      sortOrder: 7,
    },
    {
      name: "Iced Latte Vanille",
      categoryKey: "cafes_glaces",
      description: "Latte glacé, sirop vanille de Madagascar et crème fouettée.",
      price: 16,
      image: "https://images.unsplash.com/photo-1531256379416-9f000e90aacc?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 8,
    },
    {
      name: "Affogato",
      categoryKey: "cafes_glaces",
      description: "Boule de glace vanille noyée dans un espresso brûlant.",
      price: 18,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
      badge: "Nouveau",
      sortOrder: 9,
    },
    {
      name: "Frappé Caramel Noisette",
      categoryKey: "cafes_glaces",
      description: "Café mixé, glace pillée, caramel et noisette torréfiée.",
      price: 19,
      image: "https://images.unsplash.com/photo-1568031813264-d394c5d474b9?auto=format&fit=crop&w=800&q=80",
      badge: "Promo",
      sortOrder: 10,
    },
    {
      name: "Nitro Coffee",
      categoryKey: "cafes_glaces",
      description: "Cold brew infusé à l azote, mousse crémeuse sans lait.",
      price: 22,
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
      badge: "Nouveau",
      sortOrder: 11,
    },
    // Thés & Infusions
    {
      name: "Thé Vert Menthe Fraîche",
      categoryKey: "thes",
      description: "Gunpowder traditionnel, menthe du jardin et sucre de canne.",
      price: 7,
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 12,
    },
    {
      name: "Matcha Latte",
      categoryKey: "thes",
      description: "Matcha cérémonial japonais fouetté avec lait d avoine chaud.",
      price: 15,
      image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
      badge: "Nouveau",
      sortOrder: 13,
    },
    {
      name: "Infusion Hibiscus Gingembre",
      categoryKey: "thes",
      description: "Hibiscus séché, gingembre frais, miel et citron.",
      price: 8,
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
      badge: "",
      sortOrder: 14,
    },
    {
      name: "Chai Latte Épicé",
      categoryKey: "thes",
      description: "Thé noir, cannelle, cardamome, gingembre et lait chaud.",
      price: 13,
      image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 15,
    },
    // Smoothies & Jus
    {
      name: "Smoothie Tropical",
      categoryKey: "smoothies",
      description: "Mangue, ananas, banane, lait de coco et glaçons.",
      price: 17,
      image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 16,
    },
    {
      name: "Jus Détox Vert",
      categoryKey: "smoothies",
      description: "Épinard, concombre, pomme verte, citron et gingembre.",
      price: 15,
      image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=800&q=80",
      badge: "Nouveau",
      sortOrder: 17,
    },
    {
      name: "Smoothie Bowl Fraises",
      categoryKey: "smoothies",
      description: "Fraises mixées, granola croustillant, graines de chia et miel.",
      price: 19,
      image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80",
      badge: "",
      sortOrder: 18,
    },
    {
      name: "Limonade Maison",
      categoryKey: "smoothies",
      description: "Citrons pressés, menthe, eau pétillante et sirop de canne.",
      price: 10,
      image: "https://images.unsplash.com/photo-1557006021-b85faa2bc47d?auto=format&fit=crop&w=800&q=80",
      badge: "Promo",
      sortOrder: 19,
    },
    // Viennoiseries
    {
      name: "Croissant Beurre",
      categoryKey: "viennoiseries",
      description: "Feuilletage pur beurre, doré au four, croustillant et fondant.",
      price: 6,
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 20,
    },
    {
      name: "Pain au Chocolat",
      categoryKey: "viennoiseries",
      description: "Deux barres de chocolat noir enveloppées dans une pâte feuilletée.",
      price: 7,
      image: "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=800&q=80",
      badge: "",
      sortOrder: 21,
    },
    {
      name: "Muffin Myrtilles",
      categoryKey: "viennoiseries",
      description: "Muffin moelleux, myrtilles fraîches et zeste de citron.",
      price: 8,
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
      badge: "Nouveau",
      sortOrder: 22,
    },
    {
      name: "Cinnamon Roll",
      categoryKey: "viennoiseries",
      description: "Brioche roulée à la cannelle, glaçage cream cheese maison.",
      price: 11,
      image: "https://images.unsplash.com/photo-1583338917451-face2751d8d5?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 23,
    },
    {
      name: "Tresse Pistache",
      categoryKey: "viennoiseries",
      description: "Pâte tressée à la crème de pistache et sirop de fleur d oranger.",
      price: 12,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      badge: "Signature",
      sortOrder: 24,
    },
    // Sandwichs & Wraps
    {
      name: "Club Sandwich Poulet",
      categoryKey: "sandwichs",
      description: "Poulet grillé, bacon croustillant, tomate, salade et mayo maison.",
      price: 22,
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 25,
    },
    {
      name: "Wrap Thon Avocat",
      categoryKey: "sandwichs",
      description: "Thon albacore, avocat crémeux, capres et mesclun.",
      price: 19,
      image: "https://images.unsplash.com/photo-1464093515883-ec948246accb?auto=format&fit=crop&w=800&q=80",
      badge: "",
      sortOrder: 26,
    },
    {
      name: "Panini Chèvre Miel",
      categoryKey: "sandwichs",
      description: "Fromage de chèvre fondu, miel de thym, noix et roquette.",
      price: 18,
      image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80",
      badge: "Nouveau",
      sortOrder: 27,
    },
    {
      name: "Toast Avocat Oeuf Poché",
      categoryKey: "sandwichs",
      description: "Pain de campagne grillé, avocat écrasé, oeuf poché et graines.",
      price: 21,
      image: "https://images.unsplash.com/photo-1603046891744-76e6300f82ef?auto=format&fit=crop&w=800&q=80",
      badge: "Signature",
      sortOrder: 28,
    },
    {
      name: "Croque Monsieur Élgrotte",
      categoryKey: "sandwichs",
      description: "Pain de mie, jambon de qualité, béchamel et fromage gratiné.",
      price: 17,
      image: "https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 29,
    },
    // Pâtisseries & Gâteaux
    {
      name: "Fondant Chocolat Noir",
      categoryKey: "patisseries",
      description: "Coeur coulant 70% cacao, glace vanille bourbon et caramel beurre salé.",
      price: 16,
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 30,
    },
    {
      name: "Tiramisu Maison",
      categoryKey: "patisseries",
      description: "Mascarpone crémeux, biscuits imbibés espresso et cacao amer.",
      price: 14,
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
      badge: "Signature",
      sortOrder: 31,
    },
    {
      name: "Cheesecake Fruits Rouges",
      categoryKey: "patisseries",
      description: "Cream cheese léger, coulis fraise-framboise et crumble beurré.",
      price: 13,
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 32,
    },
    {
      name: "Tarte Citron Meringuée",
      categoryKey: "patisseries",
      description: "Lemon curd acidulé, meringue italienne dorée au chalumeau.",
      price: 12,
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80",
      badge: "",
      sortOrder: 33,
    },
    {
      name: "Éclair Café Pistache",
      categoryKey: "patisseries",
      description: "Pâte à choux, crème café et glaçage pistache de Bronte.",
      price: 11,
      image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=800&q=80",
      badge: "Nouveau",
      sortOrder: 34,
    },
    // Formules du Jour
    {
      name: "Formule Petit-Déjeuner",
      categoryKey: "formules",
      description: "Café au choix + croissant beurre + jus d orange pressé.",
      price: 18,
      image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 35,
    },
    {
      name: "Formule Déjeuner",
      categoryKey: "formules",
      description: "Sandwich + boisson chaude ou froide + pâtisserie du jour.",
      price: 35,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      badge: "Promo",
      sortOrder: 36,
    },
    {
      name: "Formule Brunch Weekend",
      categoryKey: "formules",
      description: "Toast avocat + smoothie + viennoiserie + café ou thé.",
      price: 45,
      image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80",
      badge: "Signature",
      sortOrder: 37,
    },
    {
      name: "Formule Goûter",
      categoryKey: "formules",
      description: "Café ou thé + deux pâtisseries au choix.",
      price: 22,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
      badge: "Nouveau",
      sortOrder: 38,
    },
  ];

  for (const item of coffeProductData) {
    await products.findOneAndUpdate(
      { restaurantId: coffeRestaurantId, name: item.name },
      {
        $set: {
          restaurantId: coffeRestaurantId,
          categoryId: coffeCategoryIds[item.categoryKey],
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image || "",
          badge: item.badge,
          isAvailable: true,
          isFeatured: item.badge === "Populaire",
          sortOrder: item.sortOrder,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );
  }

  await qrcodes.findOneAndUpdate(
    { restaurantId: coffeRestaurantId },
    {
      $set: {
        restaurantId: coffeRestaurantId,
        targetUrl: "http://localhost:3000/menu/coffee-elgrotte",
        qrImageUrl: "",
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  );

  console.log("\nSeed completed successfully.");
  console.log("Super Admin:");
  console.log(`  Email: ${superAdminEmail}`);
  console.log(`  Password: ${superAdminPassword}`);
  console.log("\nRestaurant Admin (Elgrotte):");
  console.log(`  Email: ${restaurantAdminEmail}`);
  console.log(`  Password: ${restaurantAdminPassword}`);
  console.log("\nRestaurant Admin (Coffee Elgrotte):");
  console.log(`  Email: ${coffeAdminEmail}`);
  console.log(`  Password: ${coffeAdminPassword}`);
  console.log("\nDemo public menus:");
  console.log("  http://localhost:3000/menu/elgrotte");
  console.log("  http://localhost:3000/menu/coffee-elgrotte\n");

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
