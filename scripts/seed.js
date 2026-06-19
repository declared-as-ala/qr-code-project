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
        logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80",
        coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=90",
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
      image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80",
      badge: "Signature",
      isAvailable: true,
      sortOrder: 1,
    },
    {
      name: "Burrata cremeuse",
      categoryKey: "entrees",
      description: "Burrata des Pouilles, tomates anciennes, basilic frais.",
      price: 85,
      image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1524351199679-46cddf530c04?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      isAvailable: true,
      sortOrder: 6,
    },
    {
      name: "Cappuccino maison",
      categoryKey: "boissons",
      description: "Cafe intense, lait mousseux et touche cacao.",
      price: 12,
      image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80",
      badge: "",
      isAvailable: true,
      sortOrder: 7,
    },
    {
      name: "Iced latte vanille",
      categoryKey: "boissons",
      description: "Latte glace, vanille douce et creme fouettee.",
      price: 16,
      image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
      badge: "Nouveau",
      isAvailable: true,
      sortOrder: 8,
    },
    {
      name: "Mojito fraise",
      categoryKey: "cocktails",
      description: "Menthe fraiche, citron vert, fraise et eau petillante.",
      price: 24,
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
      badge: "Promo",
      isAvailable: true,
      sortOrder: 9,
    },
    {
      name: "Sunset Elgrotte",
      categoryKey: "cocktails",
      description: "Cocktail signature agrumes et fruits exotiques.",
      price: 28,
      image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80",
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
        logo: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=200&q=80",
        coverImage: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1800&q=90",
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
      image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 2,
    },
    {
      name: "Latte Art",
      categoryKey: "cafes_chauds",
      description: "Espresso doux noyé dans un lait soyeux, rosetta dessinée à la main.",
      price: 11,
      image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80",
      badge: "",
      sortOrder: 3,
    },
    {
      name: "Flat White",
      categoryKey: "cafes_chauds",
      description: "Double ristretto intense avec micro-mousse crémeuse.",
      price: 12,
      image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80",
      badge: "Nouveau",
      sortOrder: 4,
    },
    {
      name: "Café Viennois",
      categoryKey: "cafes_chauds",
      description: "Espresso allongé surmonté de chantilly maison et copeaux de chocolat.",
      price: 13,
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
      badge: "",
      sortOrder: 5,
    },
    {
      name: "Macchiato Caramel",
      categoryKey: "cafes_chauds",
      description: "Latte chaud avec filet de caramel pur et espresso corsé.",
      price: 14,
      image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 6,
    },
    // Cafés Glacés
    {
      name: "Cold Brew",
      categoryKey: "cafes_glaces",
      description: "Infusion lente 12h, notes chocolatées, servi sur glaçons.",
      price: 16,
      image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80",
      badge: "Signature",
      sortOrder: 7,
    },
    {
      name: "Iced Latte Vanille",
      categoryKey: "cafes_glaces",
      description: "Latte glacé, sirop vanille de Madagascar et crème fouettée.",
      price: 16,
      image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 8,
    },
    {
      name: "Affogato",
      categoryKey: "cafes_glaces",
      description: "Boule de glace vanille noyée dans un espresso brûlant.",
      price: 18,
      image: "https://images.unsplash.com/photo-1594911774802-8822a707cbb3?auto=format&fit=crop&w=800&q=80",
      badge: "Nouveau",
      sortOrder: 9,
    },
    {
      name: "Frappé Caramel Noisette",
      categoryKey: "cafes_glaces",
      description: "Café mixé, glace pillée, caramel et noisette torréfiée.",
      price: 19,
      image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
      badge: "Promo",
      sortOrder: 10,
    },
    {
      name: "Nitro Coffee",
      categoryKey: "cafes_glaces",
      description: "Cold brew infusé à l azote, mousse crémeuse sans lait.",
      price: 22,
      image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80",
      badge: "Nouveau",
      sortOrder: 11,
    },
    // Thés & Infusions
    {
      name: "Thé Vert Menthe Fraîche",
      categoryKey: "thes",
      description: "Gunpowder traditionnel, menthe du jardin et sucre de canne.",
      price: 7,
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=800&q=80",
      badge: "",
      sortOrder: 14,
    },
    {
      name: "Chai Latte Épicé",
      categoryKey: "thes",
      description: "Thé noir, cannelle, cardamome, gingembre et lait chaud.",
      price: 13,
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 15,
    },
    // Smoothies & Jus
    {
      name: "Smoothie Tropical",
      categoryKey: "smoothies",
      description: "Mangue, ananas, banane, lait de coco et glaçons.",
      price: 17,
      image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 16,
    },
    {
      name: "Jus Détox Vert",
      categoryKey: "smoothies",
      description: "Épinard, concombre, pomme verte, citron et gingembre.",
      price: 15,
      image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=800&q=80",
      badge: "Nouveau",
      sortOrder: 17,
    },
    {
      name: "Smoothie Bowl Fraises",
      categoryKey: "smoothies",
      description: "Fraises mixées, granola croustillant, graines de chia et miel.",
      price: 19,
      image: "https://images.unsplash.com/photo-1626256561276-c56a81b373fa?auto=format&fit=crop&w=800&q=80",
      badge: "",
      sortOrder: 18,
      sortOrder: 18,
    },
    {
      name: "Limonade Maison",
      categoryKey: "smoothies",
      description: "Citrons pressés, menthe, eau pétillante et sirop de canne.",
      price: 10,
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80",
      badge: "",
      sortOrder: 21,
    },
    {
      name: "Muffin Myrtilles",
      categoryKey: "viennoiseries",
      description: "Muffin moelleux, myrtilles fraîches et zeste de citron.",
      price: 8,
      image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80",
      badge: "Nouveau",
      sortOrder: 22,
    },
    {
      name: "Cinnamon Roll",
      categoryKey: "viennoiseries",
      description: "Brioche roulée à la cannelle, glaçage cream cheese maison.",
      price: 11,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 23,
    },
    {
      name: "Tresse Pistache",
      categoryKey: "viennoiseries",
      description: "Pâte tressée à la crème de pistache et sirop de fleur d oranger.",
      price: 12,
      image: "https://images.unsplash.com/photo-1619860860774-1e2e17343432?auto=format&fit=crop&w=800&q=80",
      badge: "Signature",
      sortOrder: 24,
    },
    // Sandwichs & Wraps
    {
      name: "Club Sandwich Poulet",
      categoryKey: "sandwichs",
      description: "Poulet grillé, bacon croustillant, tomate, salade et mayo maison.",
      price: 22,
      image: "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?auto=format&fit=crop&w=800&q=80",
      badge: "Populaire",
      sortOrder: 25,
    },
    {
      name: "Wrap Thon Avocat",
      categoryKey: "sandwichs",
      description: "Thon albacore, avocat crémeux, capres et mesclun.",
      price: 19,
      image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=800&q=80",
      badge: "",
      sortOrder: 26,
    },
    {
      name: "Panini Chèvre Miel",
      categoryKey: "sandwichs",
      description: "Fromage de chèvre fondu, miel de thym, noix et roquette.",
      price: 18,
      image: "https://images.unsplash.com/photo-1481070414801-51fd732d7484?auto=format&fit=crop&w=800&q=80",
      badge: "Nouveau",
      sortOrder: 27,
    },
    {
      name: "Toast Avocat Oeuf Poché",
      categoryKey: "sandwichs",
      description: "Pain de campagne grillé, avocat écrasé, oeuf poché et graines.",
      price: 21,
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
      badge: "Signature",
      sortOrder: 28,
    },
    {
      name: "Croque Monsieur Élgrotte",
      categoryKey: "sandwichs",
      description: "Pain de mie, jambon de qualité, béchamel et fromage gratiné.",
      price: 17,
      image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80",
      badge: "",
      sortOrder: 33,
    },
    {
      name: "Éclair Café Pistache",
      categoryKey: "patisseries",
      description: "Pâte à choux, crème café et glaçage pistache de Bronte.",
      price: 11,
      image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&w=800&q=80",
      badge: "Nouveau",
      sortOrder: 34,
    },
    // Formules du Jour
    {
      name: "Formule Petit-Déjeuner",
      categoryKey: "formules",
      description: "Café au choix + croissant beurre + jus d orange pressé.",
      price: 18,
      image: "https://images.unsplash.com/photo-1496048970039-6a4c36bd0d2b?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80",
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

  // ── cheese-steak (Yasmine Hammamet) ────────────────────────────────────────
  const csAdminEmail = "owner@cheesesteak.tn";
  const csAdminPassword = "CheeseSteak@2026";
  const csAdminHash = await bcrypt.hash(csAdminPassword, 12);

  const csAdminResult = await users.findOneAndUpdate(
    { email: csAdminEmail },
    {
      $set: {
        name: "Cheese Steak Owner",
        email: csAdminEmail,
        passwordHash: csAdminHash,
        role: "restaurant_admin",
        mustChangePassword: false,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true, returnDocument: "after" }
  );

  const csOwnerId = getUpdatedDoc(csAdminResult)?._id;
  if (!csOwnerId) throw new Error("Failed to upsert cheese-steak admin user.");

  const csRestaurantResult = await restaurants.findOneAndUpdate(
    { slug: "cheese-steak" },
    {
      $set: {
        ownerId: csOwnerId,
        name: "Cheese Steak",
        slug: "cheese-steak",
        establishmentType: "restaurant",
        tagline: "Bold Flavors - Melty Cheese - Perfect Steaks",
        description:
          "Resto - Bar - Cafe à Yasmine Hammamet. Viandes grillées, fruits de mer, pâtes, pizzas et cocktails dans une ambiance chaleureuse.",
        email: "cheeseandsteak@outlook.fr",
        phone: "+216 70 240 240",
        address: "Entrée Carthage Land, Yasmine Hammamet, Tunisie",
        instagram: "https://instagram.com/cheesesteak.hammamet",
        facebook: "https://facebook.com/cheesesteak.hammamet",
        tiktok: "https://tiktok.com/@cheesesteak.hammamet",
        whatsapp: "https://wa.me/21670240240",
        googleMapsUrl: "https://maps.google.com/?q=Carthage+Land+Yasmine+Hammamet",
        logo: "/logos/cheese-steak.svg",
        coverImage:
          "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1800&q=90",
        primaryColor: "#B5121B",
        secondaryColor: "#1A1A1A",
        currency: "DT",
        isActive: true,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true, returnDocument: "after" }
  );

  const csRestaurantId = getUpdatedDoc(csRestaurantResult)?._id;
  if (!csRestaurantId) throw new Error("Failed to upsert cheese-steak restaurant.");

  const csCategoryData = [
    { key: "cold_starters",   name: "Entrées Froides",        sortOrder: 1 },
    { key: "hot_starters",    name: "Entrées Chaudes",         sortOrder: 2 },
    { key: "meats",           name: "Les Viandes",             sortOrder: 3 },
    { key: "fish",            name: "Les Poissons",            sortOrder: 4 },
    { key: "pasta",           name: "Les Pâtes",               sortOrder: 5 },
    { key: "chef",            name: "Spécialité du Chef",      sortOrder: 6 },
    { key: "pizzas",          name: "Les Pizzas",              sortOrder: 7 },
    { key: "kids",            name: "Menu Kids",               sortOrder: 8 },
    { key: "cold_drinks",     name: "Boissons Froides",        sortOrder: 9 },
    { key: "juices",          name: "Les Jus",                 sortOrder: 10 },
    { key: "coffees",         name: "Les Cafés",               sortOrder: 11 },
    { key: "teas",            name: "Les Thés",                sortOrder: 12 },
    { key: "breakfast",       name: "Petit Déjeuner",          sortOrder: 13 },
    { key: "mocktails",       name: "Cocktails sans Alcool",   sortOrder: 14 },
    { key: "cocktails",       name: "Cocktails avec Alcool",   sortOrder: 15 },
    { key: "milkshakes",      name: "Milkshakes",              sortOrder: 16 },
    { key: "smoothies",       name: "Smoothies",               sortOrder: 17 },
    { key: "ice_desserts",    name: "Desserts Glacés",         sortOrder: 18 },
    { key: "desserts",        name: "Les Desserts",            sortOrder: 19 },
    { key: "liqueurs",        name: "Liqueurs",                sortOrder: 20 },
    { key: "beers",           name: "Bières",                  sortOrder: 21 },
    { key: "wines",           name: "Les Vins",                sortOrder: 22 },
  ];

  const csCategoryIds = {};
  for (const item of csCategoryData) {
    const result = await categories.findOneAndUpdate(
      { restaurantId: csRestaurantId, name: item.name },
      {
        $set: {
          restaurantId: csRestaurantId,
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
    if (!catId) throw new Error(`Failed to upsert cheese-steak category: ${item.name}`);
    csCategoryIds[item.key] = catId;
  }

  // helper for image picks
  const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

  const csProductData = [
    // Entrées Froides
    { c: "cold_starters", n: "Salade Tunisienne",         en: "Tunisian salad",            p: 12,    i: "photo-1540420773420-3366772f4999" },
    { c: "cold_starters", n: "Salade Mechouia",            en: "Mechouia salad",            p: 13.5,  i: "photo-1505253716362-afaea1d3d1af" },
    { c: "cold_starters", n: "Duo de Salade Tunisienne",   en: "Duo of Tunisian salad",     p: 18,    i: "photo-1540420773420-3366772f4999" },
    { c: "cold_starters", n: "Salade César",               en: "Caesar Salad",              p: 28,    i: "photo-1550304943-4f24f54ddde9", b: "Populaire" },

    // Entrées Chaudes
    { c: "hot_starters",  n: "Assiette de Frites",         en: "Plate of fries",            p: 6.5,   i: "photo-1573080496219-bb080dd4f877" },
    { c: "hot_starters",  n: "Brik au Thon",                en: "Brik with tuna",            p: 8.5,   i: "photo-1601050690597-df0568f70950", b: "Signature" },
    { c: "hot_starters",  n: "Brik aux Chevrettes",         en: "Brik with shrimp",          p: 13.5,  i: "photo-1625944525533-473f1b3d9684" },
    { c: "hot_starters",  n: "Soupe au Poulet",             en: "Chicken soup",              p: 9,     i: "photo-1547592180-85f173990554" },
    { c: "hot_starters",  n: "Soupe au Poisson",            en: "Fish soup",                 p: 12,    i: "photo-1547592166-23ac45744acd" },
    { c: "hot_starters",  n: "Crème de Légumes",            en: "Vegetable cream",           p: 11,    i: "photo-1547308283-b941e0f7d54a" },
    { c: "hot_starters",  n: "Assiette de Mini Brik",       en: "Plate of mini brik",        p: 12,    i: "photo-1601050690597-df0568f70950" },
    { c: "hot_starters",  n: "Ojja au Merguez",             en: "Ojja with merguez",         p: 28,    i: "photo-1604908554049-29795f1d1c6e" },
    { c: "hot_starters",  n: "Ojja Fruits de Mer",          en: "Ojja with seafood",         p: 38,    i: "photo-1559847844-1ff4d5bcd28e" },
    { c: "hot_starters",  n: "Moule Marinière",             en: "Marine mussel",             p: 36,    i: "photo-1565680018434-b513d5e5fd47" },
    { c: "hot_starters",  n: "Chevrettes Sautées",          en: "Shrimp sauteed",            p: 36.5,  i: "photo-1625944525533-473f1b3d9684" },
    { c: "hot_starters",  n: "Calamars Dorés",              en: "Golden squid",              p: 38,    i: "photo-1599487488170-d11ec9c172f0" },
    { c: "hot_starters",  n: "Chevrette Panée",             en: "Breaded shrimp",            p: 39,    i: "photo-1625944525533-473f1b3d9684" },
    { c: "hot_starters",  n: "Gratin de Fruits de Mer",     en: "Seafood gratin",            p: 44,    i: "photo-1559847844-1ff4d5bcd28e" },

    // Les Viandes
    { c: "meats", n: "Poulet Grillé",                       en: "Grilled chicken",                          p: 26, i: "photo-1532550907401-a500c9a57435" },
    { c: "meats", n: "Escalope de Dinde Grillée",            en: "Grilled turkey escalope",                   p: 28, i: "photo-1432139509613-5c4255815697" },
    { c: "meats", n: "Plat Chawarma",                        en: "Chicken shawarma plate",                    p: 29, i: "photo-1633321702518-7feccafb94d5", b: "Populaire" },
    { c: "meats", n: "Brochette de Poulet",                  en: "Chicken kebab",                             p: 29, i: "photo-1599487488170-d11ec9c172f0" },
    { c: "meats", n: "Cordon Bleu",                          en: "Cordon bleu",                               p: 31, i: "photo-1562967914-608f82629710" },
    { c: "meats", n: "Escalope de Dinde Panée",              en: "Breaded turkey escalope",                   p: 32, i: "photo-1432139509613-5c4255815697" },
    { c: "meats", n: "Merguez Grillée",                      en: "Grilled merguez sausages",                  p: 32, i: "photo-1529193591184-b1d58069ecdd" },
    { c: "meats", n: "Émincé de Dinde Sauce Champignon",     en: "Sliced turkey with mushroom sauce",         p: 37, i: "photo-1432139509613-5c4255815697" },
    { c: "meats", n: "Suprême de Poulet Sauce Champignons",  en: "Chicken supreme with mushroom sauce",       p: 38, i: "photo-1532550907401-a500c9a57435" },
    { c: "meats", n: "Côtelette d'Agneau Grillée",           en: "Grilled lamb chops",                        p: 57, i: "photo-1607330289024-1535c6b4e1c1", b: "Signature" },
    { c: "meats", n: "Entrecôte Grillée",                    en: "Grilled steak",                             p: 58, i: "photo-1546964124-0cce460f38ef" },
    { c: "meats", n: "Grillade Mixte",                       en: "Mixed grill",                               p: 59, i: "photo-1544025162-d76694265947" },
    { c: "meats", n: "Côte de Bœuf Grillée",                 en: "Grilled rib of beef",                       p: 61, i: "photo-1558030006-450675393462" },
    { c: "meats", n: "Émincé de Veau Sauce Champignons",     en: "Sliced veal with mushroom sauce",           p: 61, i: "photo-1544025162-d76694265947" },
    { c: "meats", n: "Filet Grillé, Sauce au Choix",         en: "Grilled beef fillet with sauce of choice",  p: 64, i: "photo-1546964124-0cce460f38ef" },
    { c: "meats", n: "T-Bone Steak",                         en: "T-Bone steak",                              p: 69, i: "photo-1558030006-450675393462", b: "Signature" },
    { c: "meats", n: "Supplément Sauce",                     en: "Extra sauce (pepper / blue cheese / mushrooms)", p: 12, i: "photo-1607330289024-1535c6b4e1c1" },

    // Les Poissons
    { c: "fish", n: "Dorade Grillée (100gr)",                en: "Grilled sea bream (100g)",                  p: 12.5, i: "photo-1599084993091-1cb5c0721cc6" },
    { c: "fish", n: "Loup Grillé (100gr)",                    en: "Grilled sea bass (100g)",                   p: 14,   i: "photo-1535140728325-a4d3707eee94" },
    { c: "fish", n: "Poisson du Jour (100gr)",                en: "Fish of the day (100g)",                    p: 15,   i: "photo-1535140728325-a4d3707eee94" },
    { c: "fish", n: "Seiche Grillée",                          en: "Grilled cuttlefish",                        p: 39,   i: "photo-1599084993091-1cb5c0721cc6" },
    { c: "fish", n: "Espadon Grillé",                          en: "Grilled swordfish",                         p: 42,   i: "photo-1535140728325-a4d3707eee94" },
    { c: "fish", n: "Langouste (100gr)",                       en: "Lobster (100g)",                            p: 42,   i: "photo-1559737558-2f5a35f4523b" },
    { c: "fish", n: "Calamar Grillé",                          en: "Grilled squid",                             p: 45,   i: "photo-1599487488170-d11ec9c172f0" },
    { c: "fish", n: "Mérou Grillé",                            en: "Grilled grouper",                           p: 56,   i: "photo-1535140728325-a4d3707eee94" },
    { c: "fish", n: "Crevette Royale Grillée/Sautée",          en: "Grilled prawns",                            p: 78,   i: "photo-1625944525533-473f1b3d9684" },
    { c: "fish", n: "Assiette de Délice de la Mer",            en: "Dish of seafood delicacies",                p: 125,  i: "photo-1559847844-1ff4d5bcd28e", b: "Signature" },
    { c: "fish", n: "Symphonie Fruit de Mer (2 pax)",          en: "Seafood symphony (2 pax)",                  p: 199,  i: "photo-1559847844-1ff4d5bcd28e", b: "Royal" },

    // Les Pâtes
    { c: "pasta", n: "Penne à la Puttanesca",                 en: "Penne puttanesca",                          p: 26,   i: "photo-1551183053-bf91a1d81141" },
    { c: "pasta", n: "Penne Carbonara",                        en: "Penne carbonara",                           p: 29,   i: "photo-1612874742237-6526221588e3" },
    { c: "pasta", n: "Penne 4 Fromages",                       en: "Penne 4 cheese",                            p: 32,   i: "photo-1473093295043-cdd812d0e601" },
    { c: "pasta", n: "Macaroni au Poulet",                     en: "Chicken makaroni",                          p: 29,   i: "photo-1612874742237-6526221588e3" },
    { c: "pasta", n: "Macaroni à l'Escalope",                  en: "Macaroni with cutlet",                      p: 29.5, i: "photo-1612874742237-6526221588e3" },
    { c: "pasta", n: "Macaroni au Poisson",                    en: "Fish makaroni",                             p: 35,   i: "photo-1473093295043-cdd812d0e601" },
    { c: "pasta", n: "Macaroni à l'Espadon",                   en: "Macaroni with swordfish",                   p: 42,   i: "photo-1473093295043-cdd812d0e601" },
    { c: "pasta", n: "Spaghetti à l'Escalope Sauce Blanche",   en: "Chicken spaghetti with white sauce",        p: 32,   i: "photo-1473093295043-cdd812d0e601" },
    { c: "pasta", n: "Spaghetti Bolognaise",                    en: "Spaghetti bolognese",                       p: 36,   i: "photo-1551183053-bf91a1d81141", b: "Populaire" },
    { c: "pasta", n: "Spaghetti aux Fruits de Mer",             en: "Spaghetti with seafood",                    p: 43,   i: "photo-1563379926898-05f4575a45d8" },
    { c: "pasta", n: "Farfalle aux Chevrettes et Champignons",  en: "Farfalle with shrimp and mushrooms",        p: 41,   i: "photo-1473093295043-cdd812d0e601" },
    { c: "pasta", n: "Lasagne Bolognaise",                      en: "Bolognese lasagna",                         p: 37,   i: "photo-1619895092538-128f4f29b1bb" },
    { c: "pasta", n: "Lasagne Fruits de Mer",                   en: "Seafood lasagna",                           p: 44,   i: "photo-1619895092538-128f4f29b1bb" },

    // Spécialité du Chef
    { c: "chef", n: "Couscous Végétarien",                     en: "Vegetarian couscous",                       p: 26,   i: "photo-1568901346375-23c9450c58cd" },
    { c: "chef", n: "Couscous au Poulet",                       en: "Chicken couscous",                          p: 32,   i: "photo-1568901346375-23c9450c58cd" },
    { c: "chef", n: "Couscous au Merguez",                      en: "Red sausage couscous",                      p: 36,   i: "photo-1568901346375-23c9450c58cd" },
    { c: "chef", n: "Couscous à l'Agneau",                      en: "Lamb couscous",                             p: 42,   i: "photo-1568901346375-23c9450c58cd" },
    { c: "chef", n: "Couscous à l'Espadon",                     en: "Fish couscous",                             p: 44,   i: "photo-1568901346375-23c9450c58cd" },
    { c: "chef", n: "Couscous Royal",                            en: "Royal couscous",                            p: 49,   i: "photo-1568901346375-23c9450c58cd", b: "Royal" },
    { c: "chef", n: "Couscous au Mérou",                         en: "Couscous with grouper",                     p: 56,   i: "photo-1568901346375-23c9450c58cd" },
    { c: "chef", n: "Riz au Poulet",                              en: "Chicken rice",                              p: 32,   i: "photo-1603133872878-684f208fb84b" },
    { c: "chef", n: "Riz aux Fruits de Mer",                      en: "Seafood rice",                              p: 43,   i: "photo-1603133872878-684f208fb84b" },
    { c: "chef", n: "Kamounia Fruits de Mer",                     en: "Seafood kamounia",                          p: 39,   i: "photo-1604908554049-29795f1d1c6e" },
    { c: "chef", n: "Symphonie Fruits de Terre (1 pax)",          en: "Land Meat Symphony (1 pax)",                p: 90,   i: "photo-1544025162-d76694265947", b: "Signature" },
    { c: "chef", n: "Symphonie Fruits de Terre (2 pax)",          en: "Land Meat Symphony (2 pax)",                p: 172,  i: "photo-1544025162-d76694265947", b: "Signature" },
    { c: "chef", n: "Mezza Royale (2 pax)",                       en: "Royal Mezza (2 pax)",                       p: 150,  i: "photo-1559847844-1ff4d5bcd28e", b: "Royal" },

    // Les Pizzas
    { c: "pizzas", n: "Pizza Margherita",        en: "Margherita pizza (tomato, cheese, olives, capers)",                                     p: 21, i: "photo-1604068549290-dea0e4a305ca" },
    { c: "pizzas", n: "Pizza 4 Saisons",          en: "4 seasons pizza (tomato, chilli, fresh tomato, onion, capers, olives, mushroom)",       p: 25, i: "photo-1574071318508-1cdbab80d002" },
    { c: "pizzas", n: "Pizza Neptune",            en: "Neptune pizza (tomato, cheese, olives, capers, tuna)",                                  p: 28, i: "photo-1565299624946-b28f40a0ae38" },
    { c: "pizzas", n: "Pizza Escalope",           en: "Escalope pizza (tomato, onion, pepper, olives, escalope)",                              p: 29, i: "photo-1565299624946-b28f40a0ae38" },
    { c: "pizzas", n: "Pizza 4 Fromages",         en: "Pizza 4 cheese (tomato sauce, 4 cheeses)",                                              p: 34, i: "photo-1513104890138-7c749659a591", b: "Populaire" },
    { c: "pizzas", n: "Pizza Orientale",          en: "Oriental pizza (tomato, mozzarella, egg, minced meat)",                                 p: 36, i: "photo-1513104890138-7c749659a591" },
    { c: "pizzas", n: "Pizza Fruits de Mer",      en: "Seafood pizza",                                                                          p: 39, i: "photo-1574071318508-1cdbab80d002", b: "Signature" },

    // Menu Kids
    { c: "kids", n: "Pâtes au Beurre + Frites + Jus",         en: "Butter pasta + fries + juice",      p: 12.5, i: "photo-1473093295043-cdd812d0e601" },
    { c: "kids", n: "Pâte à la Crème + Frites + Jus",          en: "Cream pasta + fries + juice",       p: 15,   i: "photo-1473093295043-cdd812d0e601" },
    { c: "kids", n: "Nugget de Poulet + Frites + Jus",         en: "Chicken nuggets + fries + juice",   p: 15.5, i: "photo-1562967914-608f82629710", b: "Populaire" },
    { c: "kids", n: "Mini Pizza Margherita + Jus",             en: "Mini Margherita pizza + juice",     p: 12.5, i: "photo-1604068549290-dea0e4a305ca" },
    { c: "kids", n: "Mini Pizza au Thon + Jus",                en: "Mini tuna pizza + juice",           p: 14.5, i: "photo-1565299624946-b28f40a0ae38" },

    // Boissons Froides
    { c: "cold_drinks", n: "Eau 0.5L",          en: "Water",                p: 2.5, i: "photo-1559839734-2b71ea197ec2" },
    { c: "cold_drinks", n: "Eau Plate",          en: "Still water",          p: 4.5, i: "photo-1559839734-2b71ea197ec2" },
    { c: "cold_drinks", n: "Soda (Coca/Boga/Fanta)", en: "Soda",            p: 4.5, i: "photo-1554866585-cd94860890b7" },
    { c: "cold_drinks", n: "Eau Gazéifiée",      en: "Sparkling water",      p: 4.9, i: "photo-1559839734-2b71ea197ec2" },
    { c: "cold_drinks", n: "Schweppes",          en: "Schweppes",            p: 5.5, i: "photo-1554866585-cd94860890b7" },
    { c: "cold_drinks", n: "Shark",              en: "Energy drink",         p: 12,  i: "photo-1622543925917-763c34d1a86e" },
    { c: "cold_drinks", n: "Dose Menthe",         en: "Mint shot",            p: 3,   i: "photo-1602938616030-fdee47ae8aaa" },
    { c: "cold_drinks", n: "Dose Grenadine",      en: "Grenadine shot",       p: 3,   i: "photo-1602938616030-fdee47ae8aaa" },

    // Les Jus
    { c: "juices", n: "Jus d'Orange",         en: "Orange juice",                p: 7.5,  i: "photo-1613478223719-2ab802602423", b: "Populaire" },
    { c: "juices", n: "Citronnade",            en: "Lemonade",                    p: 8,    i: "photo-1513558161293-cdaf765ed2fd" },
    { c: "juices", n: "Jus de Fraise",         en: "Strawberry juice",            p: 9,    i: "photo-1546173159-315724a31696" },
    { c: "juices", n: "Jus de Pomme",          en: "Apple juice",                 p: 9,    i: "photo-1622597467836-f3285f2131b8" },
    { c: "juices", n: "Jus d'Ananas",          en: "Pineapple juice",             p: 9.5,  i: "photo-1546173159-315724a31696" },
    { c: "juices", n: "Jus de Banane",         en: "Banana juice",                p: 9.5,  i: "photo-1622597467836-f3285f2131b8" },
    { c: "juices", n: "Jus Orange Banane",     en: "Orange and banana juice",     p: 12,   i: "photo-1613478223719-2ab802602423" },
    { c: "juices", n: "Jus de Fraise Banane",  en: "Strawberry and banana juice", p: 12.5, i: "photo-1546173159-315724a31696" },
    { c: "juices", n: "Jus de Fruits",          en: "Fruits juice",                p: 15,   i: "photo-1546173159-315724a31696", b: "Signature" },

    // Les Cafés
    { c: "coffees", n: "Express",        en: "Espresso",       p: 4,   i: "photo-1510591509098-f4fdc6d0ff04" },
    { c: "coffees", n: "Capucin",         en: "Capuchin coffee", p: 4.5, i: "photo-1572442388796-11668a67e53d" },
    { c: "coffees", n: "Américain",       en: "Americano",       p: 5,   i: "photo-1495474472287-4d71bcdd2085" },
    { c: "coffees", n: "Café Direct",     en: "Milk coffee",     p: 5.5, i: "photo-1541167760496-1628856ab772" },
    { c: "coffees", n: "Cappuccino",       en: "Cappuccino",      p: 7.5, i: "photo-1572442388796-11668a67e53d", b: "Populaire" },
    { c: "coffees", n: "Café Glacé",       en: "Iced coffee",     p: 9.5, i: "photo-1517701550927-30cf4ba1dba5" },

    // Les Thés
    { c: "teas", n: "Thé à la Menthe",  en: "Fresh mint tea",   p: 4,   i: "photo-1576092768241-dec231879fc3", b: "Populaire" },
    { c: "teas", n: "Infusion",          en: "Tea infusion",     p: 4.5, i: "photo-1576092768241-dec231879fc3" },
    { c: "teas", n: "Verveine",          en: "Verbena",          p: 4.9, i: "photo-1576092768241-dec231879fc3" },
    { c: "teas", n: "Thé aux Amandes",   en: "Almond tea",       p: 9,   i: "photo-1576092768241-dec231879fc3" },
    { c: "teas", n: "Thé aux Pignons",   en: "Tea with pine nuts", p: 11, i: "photo-1576092768241-dec231879fc3", b: "Signature" },

    // Petit Déjeuner
    { c: "breakfast", n: "Petit Déjeuner à la Française", en: "French breakfast (coffee, cake, juice)",                                    p: 15, i: "photo-1496048970039-6a4c36bd0d2b" },
    { c: "breakfast", n: "Petit Déjeuner Cheese Steak",   en: "Cheese steak breakfast (coffee, cake, juice, omelette, butter, chocolate, half water)", p: 27, i: "photo-1533089860892-a7c6f0a88666", b: "Signature" },

    // Cocktails sans Alcool
    { c: "mocktails", n: "Cocktail Caraïbes",  en: "Caribbean cocktail (pineapple juice, grenadine)",                            p: 14,   i: "photo-1551024709-8f23befc6f87" },
    { c: "mocktails", n: "Blue Sky",            en: "Blue Sky (blue curacao, orange, pineapple, coconut + sprite)",                p: 14.5, i: "photo-1582106245687-cbb466a9f07f" },
    { c: "mocktails", n: "Cocktail Bella Luna", en: "Bella Luna cocktail (orange, pineapple, lime juice)",                        p: 15.5, i: "photo-1551024709-8f23befc6f87" },
    { c: "mocktails", n: "Lemon Mint",          en: "Lemon Mint (lemon juice, mint syrup, fresh mint leaves)",                    p: 15.5, i: "photo-1513558161293-cdaf765ed2fd", b: "Populaire" },
    { c: "mocktails", n: "Mojito sans Alcool",  en: "Non-alcoholic Mojito (fresh mint, lime, sparkling water, lemon slice)",       p: 16,   i: "photo-1551538827-9c037cb4f32a", b: "Populaire" },
    { c: "mocktails", n: "Piña Colada",         en: "Piña Colada (pineapple juice, coconut cream)",                                p: 19,   i: "photo-1502740479091-635887520276", b: "Signature" },

    // Cocktails avec Alcool
    { c: "cocktails", n: "Gin Fizz",         en: "Gin Fizz (gin, lemon juice, sugar syrup, sparkling water)",            p: 22, i: "photo-1551024709-8f23befc6f87" },
    { c: "cocktails", n: "Sex on the Beach", en: "Sex on the Beach (vodka, peach cream, orange juice, grenadine)",        p: 24, i: "photo-1571950006418-f226dc106482", b: "Populaire" },
    { c: "cocktails", n: "Mojito",            en: "Mojito (rum, fresh mint, lime, sugar, sparkling water)",                p: 25, i: "photo-1551538827-9c037cb4f32a", b: "Populaire" },
    { c: "cocktails", n: "Piña Colada",       en: "Piña Colada (rum, pineapple juice, coconut cream)",                     p: 28, i: "photo-1502740479091-635887520276", b: "Signature" },

    // Milkshakes
    { c: "milkshakes", n: "Milkshake Vanille",   en: "Milkshake vanilla",     p: 12.5, i: "photo-1572490122747-3968b75cc699" },
    { c: "milkshakes", n: "Milkshake Fraise",     en: "Milkshake strawberry",  p: 12.5, i: "photo-1572490122747-3968b75cc699", b: "Populaire" },
    { c: "milkshakes", n: "Milkshake Banane",     en: "Milkshake banana",      p: 12.5, i: "photo-1572490122747-3968b75cc699" },
    { c: "milkshakes", n: "Milkshake Pistache",   en: "Milkshake pistachio",   p: 12.5, i: "photo-1572490122747-3968b75cc699" },
    { c: "milkshakes", n: "Milkshake Chocolat",   en: "Milkshake chocolate",   p: 12.5, i: "photo-1572490122747-3968b75cc699" },

    // Smoothies
    { c: "smoothies", n: "Pêche",  en: "Peach (peach, orange juice, vanilla scoop)",   p: 15, i: "photo-1553530666-ba11a7da3888" },
    { c: "smoothies", n: "Melon",  en: "Melon (melon, vanilla scoop)",                  p: 15, i: "photo-1553530666-ba11a7da3888" },
    { c: "smoothies", n: "Pomme",  en: "Apple (apple juice, vanilla scoop)",            p: 15, i: "photo-1553530666-ba11a7da3888" },
    { c: "smoothies", n: "Citron", en: "Lemon (lemonade, vanilla scoop)",                p: 15, i: "photo-1553530666-ba11a7da3888" },

    // Desserts Glacés
    { c: "ice_desserts", n: "Sorbet au Citron",         en: "Lemon sorbet",            p: 7,    i: "photo-1488900128323-21503983a07e" },
    { c: "ice_desserts", n: "Coupe Glace Sicilienne",    en: "Sicilian ice cream cup",  p: 9,    i: "photo-1488900128323-21503983a07e" },
    { c: "ice_desserts", n: "Chocolat Liégeois",          en: "Liège chocolate",         p: 11.5, i: "photo-1497034825429-c343d7c6a68f" },
    { c: "ice_desserts", n: "Café Liégeois",              en: "Liège coffee",            p: 12,   i: "photo-1594911774802-8822a707cbb3" },
    { c: "ice_desserts", n: "Coupe Glace Pepito",         en: "Pepito ice cream cup",    p: 15,   i: "photo-1497034825429-c343d7c6a68f" },
    { c: "ice_desserts", n: "Coupe Glace Banana Split",   en: "Banana split ice cream cup", p: 17, i: "photo-1497034825429-c343d7c6a68f", b: "Populaire" },
    { c: "ice_desserts", n: "Assortiment de Glaces Maison", en: "Selection of homemade ice cream", p: 21, i: "photo-1497034825429-c343d7c6a68f", b: "Signature" },

    // Les Desserts
    { c: "desserts", n: "Fondant au Chocolat",        en: "Chocolate fondant",                  p: 12, i: "photo-1606313564200-e75d5e30476c", b: "Populaire" },
    { c: "desserts", n: "Mini Assiette de Fruits",     en: "Mini seasonal fruit plate",          p: 18, i: "photo-1490474418585-ba9bad8fd0ea" },
    { c: "desserts", n: "Plat de Fruits Royale",       en: "Royal fruit platter",                p: 34, i: "photo-1490474418585-ba9bad8fd0ea", b: "Royal" },
    { c: "desserts", n: "Chicha au Choix + Thé Menthe", en: "Hookah of your choice + fresh mint tea", p: 28, i: "photo-1601493700750-58b6c4b6b6f3", b: "Ambiance" },

    // Liqueurs
    { c: "liqueurs", n: "J&B",            en: "Whisky J&B",          p: 23,   i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "J.Walker Red",    en: "Whisky JW Red",       p: 24,   i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Baileys",         en: "Baileys",             p: 25,   i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Jack Daniel",     en: "Jack Daniel's",       p: 28,   i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "J.Walker Black",  en: "Whisky JW Black",     p: 31,   i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Chivas Régal",    en: "Chivas Regal",        p: 32,   i: "photo-1527281400683-1aae777175f8", b: "Signature" },
    { c: "liqueurs", n: "Anisette",        en: "Anisette",            p: 12,   i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Pastis",          en: "Pastis",              p: 15,   i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Capris",          en: "Capris",              p: 15,   i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Ricard",          en: "Ricard",              p: 15,   i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Martini Blanc",   en: "Martini Bianco",      p: 16,   i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Martini Rouge",   en: "Martini Rosso",       p: 16,   i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Cognac",          en: "Cognac",              p: 16,   i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Get 27",           en: "Get 27",              p: 17,   i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Malibu",           en: "Malibu",              p: 18,   i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Boukhas",          en: "Boukha",              p: 15.5, i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Thibarine",        en: "Thibarine",           p: 16,   i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Rhum Rouge",       en: "Red rum",             p: 18,   i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Rhum Blanc",       en: "White rum",           p: 18,   i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Gin Mayfer",       en: "Gin Mayfer",          p: 18.5, i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Gin Gordon",       en: "Gin Gordon's",        p: 19.5, i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Smirnoff Red",     en: "Vodka Smirnoff Red",  p: 21,   i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Vodka Orloff",     en: "Vodka Orloff",        p: 21,   i: "photo-1527281400683-1aae777175f8" },
    { c: "liqueurs", n: "Vodka Absolut",    en: "Vodka Absolut",       p: 24,   i: "photo-1527281400683-1aae777175f8", b: "Populaire" },
    { c: "liqueurs", n: "Vodka Reservi",     en: "Vodka Reservi",       p: 24,   i: "photo-1527281400683-1aae777175f8" },

    // Bières
    { c: "beers", n: "Celtia (bouteille)",   en: "Celtia bottle",       p: 7.5,  i: "photo-1535958636474-b021ee887b13" },
    { c: "beers", n: "Amstel",                en: "Amstel",              p: 7.5,  i: "photo-1535958636474-b021ee887b13" },
    { c: "beers", n: "Heineken",              en: "Heineken",            p: 8.5,  i: "photo-1535958636474-b021ee887b13", b: "Populaire" },
    { c: "beers", n: "Beck's",                en: "Beck's",              p: 8.5,  i: "photo-1535958636474-b021ee887b13" },
    { c: "beers", n: "Celtia 33cl (pression)", en: "Celtia 33cl draft", p: 7.5,  i: "photo-1535958636474-b021ee887b13" },
    { c: "beers", n: "Celtia 50cl (pression)", en: "Celtia 50cl draft", p: 11,   i: "photo-1535958636474-b021ee887b13" },
    { c: "beers", n: "Heineken 33cl (pression)", en: "Heineken 33cl draft", p: 8.5, i: "photo-1535958636474-b021ee887b13" },
    { c: "beers", n: "Heineken 50cl (pression)", en: "Heineken 50cl draft", p: 12.5, i: "photo-1535958636474-b021ee887b13" },

    // Les Vins
    { c: "wines", n: "Ugni Blanc (75cl)",                 en: "Ugni Blanc",                  p: 33, i: "photo-1510812431401-41d2bd2722f3" },
    { c: "wines", n: "Château Rosé/Rouge (75cl)",          en: "Château Rosé / Red",          p: 39, i: "photo-1510812431401-41d2bd2722f3" },
    { c: "wines", n: "Vin Gris (75cl)",                    en: "Gris wine",                   p: 42, i: "photo-1510812431401-41d2bd2722f3" },
    { c: "wines", n: "Magon Rouge/Rosé/Blanc (75cl)",      en: "Magon Red / Rosé / White",    p: 47, i: "photo-1510812431401-41d2bd2722f3" },
    { c: "wines", n: "Désir Rouge/Rosé/Blanc (75cl)",      en: "Désir Red / Rosé / White",    p: 61, i: "photo-1510812431401-41d2bd2722f3" },
    { c: "wines", n: "Chardonnay (75cl)",                  en: "Chardonnay",                   p: 61, i: "photo-1510812431401-41d2bd2722f3" },
    { c: "wines", n: "Selian Rouge/Rosé/Blanc (75cl)",     en: "Selian Red / Rosé / White",   p: 63, i: "photo-1510812431401-41d2bd2722f3" },
    { c: "wines", n: "Magnifique Rouge/Rosé/Blanc (75cl)", en: "Magnifique Red / Rosé / White", p: 65, i: "photo-1510812431401-41d2bd2722f3", b: "Signature" },
    { c: "wines", n: "Jour et Nuit Rouge/Rosé/Blanc (75cl)", en: "Jour et Nuit", p: 65, i: "photo-1510812431401-41d2bd2722f3" },
    { c: "wines", n: "Vieux Magon (75cl)",                 en: "Vieux Magon",                 p: 69, i: "photo-1510812431401-41d2bd2722f3", b: "Royal" },
  ];

  let csSort = 0;
  for (const item of csProductData) {
    csSort += 1;
    await products.findOneAndUpdate(
      { restaurantId: csRestaurantId, name: item.n },
      {
        $set: {
          restaurantId: csRestaurantId,
          categoryId: csCategoryIds[item.c],
          name: item.n,
          nameEn: item.en,
          description: item.en,
          price: item.p,
          image: item.i ? img(item.i) : "",
          badge: item.b || "",
          isAvailable: true,
          isFeatured: item.b === "Populaire" || item.b === "Signature",
          sortOrder: csSort,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );
  }

  await qrcodes.findOneAndUpdate(
    { restaurantId: csRestaurantId },
    {
      $set: {
        restaurantId: csRestaurantId,
        targetUrl: "http://localhost:3000/menu/cheese-steak",
        qrImageUrl: "",
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  );

  // ── maliks-restolounge ──────────────────────────────────────────────────────
  const maliksAdminEmail = "owner@maliks-restolounge.tn";
  const maliksAdminPassword = "MaliksLounge@2026";
  const maliksAdminHash = await bcrypt.hash(maliksAdminPassword, 12);

  const maliksAdminResult = await users.findOneAndUpdate(
    { email: maliksAdminEmail },
    {
      $set: {
        name: "Malik's Resto Lounge Owner",
        email: maliksAdminEmail,
        passwordHash: maliksAdminHash,
        role: "restaurant_admin",
        mustChangePassword: false,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true, returnDocument: "after" }
  );

  const maliksOwnerId = getUpdatedDoc(maliksAdminResult)?._id;
  if (!maliksOwnerId) throw new Error("Failed to upsert maliks admin user.");

  const maliksRestaurantResult = await restaurants.findOneAndUpdate(
    { slug: "maliks-restolounge" },
    {
      $set: {
        ownerId: maliksOwnerId,
        name: "Malik's Resto Lounge",
        slug: "maliks-restolounge",
        establishmentType: "restaurant",
        tagline: "Fine Food - Luxury Lounge - Magical Atmosphere",
        description:
          "Restaurant Lounge de luxe à la Marina de Yasmine Hammamet. Découvrez notre cuisine raffinée, nos fruits de mer frais, nos grillades d'exception et nos spécialités tunisiennes authentiques dans un cadre somptueux.",
        email: "maliks.restolounge@gmail.com",
        phone: "+216 55 312 915",
        address: "La Marina, Yasmine Hammamet, Tunisie",
        instagram: "https://www.instagram.com/maliks_restolounge",
        facebook: "https://facebook.com/maliks.restolounge",
        googleMapsUrl: "https://maps.google.com/?q=Malik's+Resto+Lounge+Marina+Yasmine+Hammamet",
        logo: "/logos/maliks.jpg",
        coverImage:
          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1800&q=90",
        primaryColor: "#B08D57",
        secondaryColor: "#0F0F10",
        currency: "DT",
        isActive: true,
        showPrices: false,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true, returnDocument: "after" }
  );

  const maliksRestaurantId = getUpdatedDoc(maliksRestaurantResult)?._id;
  if (!maliksRestaurantId) throw new Error("Failed to upsert maliks restaurant.");

  const maliksCategoryData = [
    { key: "cold_starters", name: "Entrées Froides", sortOrder: 1 },
    { key: "hot_starters", name: "Entrées Chaudes", sortOrder: 2 },
    { key: "pasta", name: "Nos Plats", sortOrder: 3 },
    { key: "poultry", name: "Volailles", sortOrder: 4 },
    { key: "meats", name: "Viandes", sortOrder: 5 },
    { key: "seafood", name: "Fruits de Mer", sortOrder: 6 },
    { key: "tunisian", name: "Spécialités Tunisiennes", sortOrder: 7 },
    { key: "desserts", name: "Desserts", sortOrder: 8 },
  ];

  const maliksCategoryIds = {};
  for (const item of maliksCategoryData) {
    const result = await categories.findOneAndUpdate(
      { restaurantId: maliksRestaurantId, name: item.name },
      {
        $set: {
          restaurantId: maliksRestaurantId,
          name: item.name,
          description: "",
          isActive: true,
          sortOrder: item.sortOrder,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, returnDocument: "after" }
    );
    maliksCategoryIds[item.key] = getUpdatedDoc(result)?._id;
  }

  const maliksProductData = [
    // Entrées Froides
    { c: "cold_starters", n: "Salade verte / Mechouia / Tunisienne", p: 16, i: "photo-1540420773420-3366772f4999", b: "Nouveau" },
    { c: "cold_starters", n: "Salade Niçoise", p: 22, i: "photo-1546069901-ba9599a7e63c" },
    { c: "cold_starters", n: "Salade César", p: 25, i: "photo-1550304943-4f24f54ddde9", b: "Populaire" },
    { c: "cold_starters", n: "Salade de fruits de mer", p: 30, i: "photo-1565557623262-b51c2513a641" },
    { c: "cold_starters", n: "Salade de poulpe", p: 45, i: "photo-1599084993091-1cb5c0721cc6" },

    // Entrées Chaudes
    { c: "hot_starters", n: "Brick au thon / Brick aux crevettes", p: 15, i: "photo-1608897013039-887f21d8c804", b: "Signature" },
    { c: "hot_starters", n: "Ojja aux Merguez", p: 25, i: "photo-1590412200988-a436bb7050a7" },
    { c: "hot_starters", n: "Friture de rouget", p: 24, i: "photo-1534604973900-c43ab4c2e0ab" },
    { c: "hot_starters", n: "Moule à la marinière", p: 25, i: "photo-1534422298391-e4f8c172dddb" },
    { c: "hot_starters", n: "Ojja aux fruits de mer", p: 30, i: "photo-1534080564583-6be75777b70a" },
    { c: "hot_starters", n: "Clovisses à la marinière", p: 35, i: "photo-1553618551-fba689030290" },

    // Nos Plats
    { c: "pasta", n: "Spaghetti tomate et basilic", p: 22, i: "photo-1546549032-9571cd6b27df" },
    { c: "pasta", n: "Pâtes à la carbonara", p: 28, i: "photo-1612874742237-6526221588e3" },
    { c: "pasta", n: "Pâtes bolognaise", p: 32, i: "photo-1563379091339-03b21ab4a4f8" },
    { c: "pasta", n: "Pâtes émincé de poulet", p: 40, i: "photo-1608897013039-887f21d8c804" },
    { c: "pasta", n: "Pâtes aux fruits de mer", p: 45, i: "photo-1563379971899-660589a01cf3" },
    { c: "pasta", n: "Paella royale aux fruits de mer", p: 48, i: "photo-1534080564583-6be75777b70a", b: "Populaire" },

    // Volailles
    { c: "poultry", n: "Escalope grillée", p: 25, i: "photo-1604503468506-a8da13d82791" },
    { c: "poultry", n: "Escalope Panée", p: 28, i: "photo-1594834749740-74b3f6764be4" },
    { c: "poultry", n: "Escalope sauce champignons", p: 32, i: "photo-1603360946369-dc9bb6258143" },

    // Viandes
    { c: "meats", n: "Côte à l'os", p: 48, i: "photo-1544025162-d76694265947", b: "Populaire" },
    { c: "meats", n: "Grillade mixte", p: 50, i: "photo-1555939594-58d7cb561ad1" },
    { c: "meats", n: "Filet de boeuf grillé", p: 65, i: "photo-1546964124-0cce460f38ef" },
    { c: "meats", n: "Filet de boeuf sauce champignons", p: 65, i: "photo-1600891964599-f61ba0e24092" },
    { c: "meats", n: "Filet de boeuf au poivre", p: 65, i: "photo-1558030006-450675393462" },
    { c: "meats", n: "Filet de boeuf sauce roquefort", p: 65, i: "photo-1544025162-d76694265947" },
    { c: "meats", n: "Merguez grillées", p: 25, i: "photo-1580959375944-abd7e990f585" },
    { c: "meats", n: "Osso buco", p: 58, i: "photo-1608248597279-f99d160bfcbc", b: "Signature" },
    { c: "meats", n: "Souris d'agneau", p: 60, i: "photo-1602881917760-7379db593981" },

    // Fruits de Mer
    { c: "seafood", n: "Loup / Daurade grillé", p: 40, i: "photo-1519708227418-c8fd9a32b7a2" },
    { c: "seafood", n: "Poissons du jour (100g)", p: 16, i: "photo-1534604973900-c43ab4c2e0ab" },
    { c: "seafood", n: "Seiche grillée", p: 40, i: "photo-1599084993091-1cb5c0721cc6" },
    { c: "seafood", n: "Crevettes royales grillées (100g)", p: 27, i: "photo-1565557623262-b51c2513a641", b: "Populaire" },
    { c: "seafood", n: "Chevrette sautée / panée", p: 42, i: "photo-1559737607-966b52f372c3" },
    { c: "seafood", n: "Calamars grillés", p: 45, i: "photo-1599084993091-1cb5c0721cc6" },
    { c: "seafood", n: "Poulpe grillé", p: 47, i: "photo-1565557623262-b51c2513a641", b: "Signature" },
    { c: "seafood", n: "Plateau fruits de mer (2 pax)", p: 170, i: "photo-1540189549336-e6e99c3679fe" },
    { c: "seafood", n: "Plateau fruits de mer (4 pax)", p: 270, i: "photo-1534080564583-6be75777b70a" },

    // Spécialités Tunisiennes
    { c: "tunisian", n: "Fell à l'agneau", p: 50, i: "photo-1568901346375-23c9450c58cd", b: "Nouveau" },
    { c: "tunisian", n: "Koucha d'agneau", p: 55, i: "photo-1602881917760-7379db593981", b: "Populaire" },
    { c: "tunisian", n: "Mloukhia traditionnelle", p: 40, i: "photo-1541832676-9b763b0239ab" },
    { c: "tunisian", n: "Madfouna", p: 38, i: "photo-1574484284002-952d92456975" },
    { c: "tunisian", n: "Couscous à l'agneau", p: 55, i: "photo-1541832676-9b763b0239ab" },
    { c: "tunisian", n: "Couscous au poisson", p: 50, i: "photo-1540189549336-e6e99c3679fe", b: "Signature" },
    { c: "tunisian", n: "Bnadek (Boulettes de viande)", p: 45, i: "photo-1529042410759-befb1204b468" },
    { c: "tunisian", n: "Golla d'agneau", p: 58, i: "photo-1608248597279-f99d160bfcbc", b: "Signature" },

    // Desserts
    { c: "desserts", n: "Coupe de glace", p: 12, i: "photo-1501443721117-39d6e87f1854" },
    { c: "desserts", n: "Fondant au chocolat", p: 15, i: "photo-1606313564200-e75d5e30476c", b: "Populaire" },
    { c: "desserts", n: "Fruits de saison", p: 15, i: "photo-1498837167922-ddd27525d352" },
    { c: "desserts", n: "Plateau de fruits de saison", p: 28, i: "photo-1519996529931-28324d5a630e" },
  ];

  let maliksSort = 0;
  for (const item of maliksProductData) {
    maliksSort += 1;
    await products.findOneAndUpdate(
      { restaurantId: maliksRestaurantId, name: item.n },
      {
        $set: {
          restaurantId: maliksRestaurantId,
          categoryId: maliksCategoryIds[item.c],
          name: item.n,
          nameEn: item.n,
          description: item.n,
          price: item.p,
          image: item.i ? img(item.i) : "",
          badge: item.b || "",
          isAvailable: true,
          isFeatured: item.b === "Populaire" || item.b === "Signature",
          sortOrder: maliksSort,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );
  }

  await qrcodes.findOneAndUpdate(
    { restaurantId: maliksRestaurantId },
    {
      $set: {
        restaurantId: maliksRestaurantId,
        targetUrl: "http://localhost:3000/menu/maliks-restolounge",
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
  console.log("\nRestaurant Admin (Cheese Steak - Yasmine Hammamet):");
  console.log(`  Email: ${csAdminEmail}`);
  console.log(`  Password: ${csAdminPassword}`);
  console.log("\nRestaurant Admin (Malik's Resto Lounge - Yasmine Hammamet):");
  console.log(`  Email: ${maliksAdminEmail}`);
  console.log(`  Password: ${maliksAdminPassword}`);
  console.log("\nDemo public menus:");
  console.log("  http://localhost:3000/menu/elgrotte");
  console.log("  http://localhost:3000/menu/coffee-elgrotte");
  console.log("  http://localhost:3000/menu/cheese-steak");
  console.log("  http://localhost:3000/menu/maliks-restolounge\n");

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
