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

  console.log("\nSeed completed successfully.");
  console.log("Super Admin:");
  console.log(`  Email: ${superAdminEmail}`);
  console.log(`  Password: ${superAdminPassword}`);
  console.log("\nRestaurant Admin:");
  console.log(`  Email: ${restaurantAdminEmail}`);
  console.log(`  Password: ${restaurantAdminPassword}`);
  console.log("\nDemo public menu:");
  console.log("  http://localhost:3000/menu/elgrotte\n");

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
