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

  await mongoose.connect(MONGODB_URI, { dbName: "QR" });

  const db = mongoose.connection.db;
  const users = db.collection("users");
  const restaurants = db.collection("restaurants");
  const categories = db.collection("categories");
  const products = db.collection("products");
  const qrcodes = db.collection("qrcodes");

  const now = new Date();

  const superAdminEmail = "superadmin@qrmenu.tn";
  const superAdminPassword = "SuperAdmin@123";
  const restaurantAdminEmail = "admin@cafeblue.tn";
  const restaurantAdminPassword = "CafeAdmin@123";

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
        name: "Blue Cafe Owner",
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
    { slug: "cafe-blue" },
    {
      $set: {
        ownerId,
        name: "Cafe Blue Tunis",
        slug: "cafe-blue",
        establishmentType: "cafe",
        phone: "+21650111222",
        address: "Lac 2, Tunis, Tunisie",
        instagram: "https://instagram.com/cafeblue",
        facebook: "https://facebook.com/cafeblue",
        googleMapsUrl: "https://maps.google.com/?q=Lac+2+Tunis",
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
    { key: "hot-drinks", name: "Boissons chaudes", sortOrder: 1 },
    { key: "cold-drinks", name: "Boissons froides", sortOrder: 2 },
    { key: "desserts", name: "Desserts", sortOrder: 3 },
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
      name: "Cappuccino Signature",
      categoryKey: "hot-drinks",
      description: "Mousse onctueuse, grains selectionnes.",
      price: 8.5,
      badge: "Populaire",
      isAvailable: true,
      sortOrder: 1,
    },
    {
      name: "Latte Vanille",
      categoryKey: "hot-drinks",
      description: "Lait cremeux, touche vanille delicate.",
      price: 9.0,
      badge: "Nouveau",
      isAvailable: true,
      sortOrder: 2,
    },
    {
      name: "Iced Caramel",
      categoryKey: "cold-drinks",
      description: "Cafe froid caramel, ideal en ete.",
      price: 10.0,
      badge: "Promo",
      isAvailable: true,
      sortOrder: 3,
    },
    {
      name: "Cheesecake Maison",
      categoryKey: "desserts",
      description: "Texture fondante, coulis fruits rouges.",
      price: 12.0,
      badge: "",
      isAvailable: true,
      sortOrder: 4,
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
          image: "",
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
        targetUrl: "http://localhost:3000/menu/cafe-blue",
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
  console.log("  http://localhost:3000/menu/cafe-blue\n");

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
