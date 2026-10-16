/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Métropolitan additive seed.
 *
 *   node scripts/seed-metropolitan.js           # DRY RUN (read-only, default)
 *   node scripts/seed-metropolitan.js --apply   # writes
 *
 * Additive only: never deletes or deactivates anything, never overwrites an
 * existing field (all fields are $setOnInsert; an image is filled in only if
 * the existing product has none).
 *
 * Size variants: the Product model has a single price, so each size becomes
 * its own product named "<name> <size>" (e.g. "Ice tea M", "Ice tea L").
 *
 * Env (.env.local): MONGODB_URI, CLOUDINARY_*; on --apply when the owner must
 * be created: METROPOLITAN_ADMIN_PASSWORD (+ optional METROPOLITAN_ADMIN_EMAIL).
 */
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v2: cloudinary } = require("cloudinary");
const { RESTAURANT, categories, supplements } = require("./data/metropolitan-menu");

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const [k, ...v] = line.split("=");
    if (k && !(k in process.env)) process.env[k.trim()] = v.join("=").trim();
  }
}

const APPLY = process.argv.includes("--apply");
const DB_NAME = "qr_menu_saas";
const ROOT = `qr-menu/${RESTAURANT.slug}`;
const ADMIN_EMAIL = (process.env.METROPOLITAN_ADMIN_EMAIL || "admin@metropolitan.tn").toLowerCase();

const slugify = (s) =>
  String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/œ/g, "oe").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);

// Flatten: one entry per product-or-size, in the order given.
function suppsFor(cat, productName) {
  const out = [];
  for (const g of supplements[cat] || [])
    if (g.targets.includes(productName)) for (const [name, price] of g.items) out.push({ name, price });
  return out;
}

function buildMenu() {
  return categories.map((c) => ({
    order: c.order,
    name: c.name,
    items: c.products.flatMap((pr) =>
      pr.prices.length === 1
        ? [{ name: pr.name, price: pr.prices[0][1], image: pr.image, description: pr.description, supplements: suppsFor(c.name, pr.name) }]
        : pr.prices.map(([size, price]) => ({
            name: `${pr.name} ${size}`, price, image: pr.image, description: pr.description, supplements: suppsFor(c.name, pr.name),
          }))
    ),
  }));
}

function validate(menu) {
  for (const c of menu) {
    const seen = new Set();
    for (const it of c.items) {
      const key = it.name.toLowerCase();
      if (seen.has(key)) throw new Error(`Duplicate product in "${c.name}": ${it.name}`);
      seen.add(key);
      if (!Number.isFinite(it.price) || it.price < 0) throw new Error(`Bad price: ${it.name}`);
    }
  }
}

const uploadCache = new Map(); // source url -> result (sizes share one image)
async function upload(url, publicId) {
  if (!url) return null;
  if (uploadCache.has(url)) return uploadCache.get(url);
  let res = null;
  try {
    const r = await cloudinary.uploader.upload(url, {
      public_id: publicId, overwrite: false, resource_type: "image", unique_filename: false,
    });
    res = r.secure_url;
  } catch (e) {
    console.warn(`   ⚠ upload failed ${publicId}: ${e.message}`);
  }
  uploadCache.set(url, res);
  return res;
}

async function run() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
  const menu = buildMenu();
  validate(menu);

  const totalItems = menu.reduce((n, c) => n + c.items.length, 0);
  const uniqueImages = new Set(menu.flatMap((c) => c.items.map((i) => i.image).filter(Boolean))).size;
  console.log(`${APPLY ? "APPLY" : "DRY RUN"} — ${menu.length} categories, ${totalItems} products (sizes expanded), ${uniqueImages} unique images`);

  if (APPLY) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  await mongoose.connect(process.env.MONGODB_URI, { dbName: DB_NAME });
  const db = mongoose.connection.db;
  const restaurants = db.collection("restaurants");
  const cats = db.collection("categories");
  const prods = db.collection("products");
  const users = db.collection("users");
  const now = new Date();
  const stats = { catNew: 0, catExisting: 0, prodNew: 0, prodExisting: 0, imgFilled: 0, imgUploaded: 0, imgFailed: 0 };

  try {
    // ── Restaurant ─────────────────────────────────────────────────────────
    let restaurant = await restaurants.findOne({
      $or: [{ slug: RESTAURANT.slug }, { name: /m[eé]tropolitan/i }],
    });
    console.log(restaurant ? `Restaurant exists: ${restaurant.slug} (will be left untouched)` : "Restaurant will be CREATED");

    if (!restaurant && APPLY) {
      let owner = await users.findOne({ email: ADMIN_EMAIL });
      if (!owner) {
        const pw = process.env.METROPOLITAN_ADMIN_PASSWORD;
        if (!pw) throw new Error("METROPOLITAN_ADMIN_PASSWORD required to create the owner user");
        const ins = await users.insertOne({
          name: "Métropolitan Owner", email: ADMIN_EMAIL,
          passwordHash: await bcrypt.hash(pw, 12), role: "restaurant_admin",
          mustChangePassword: true, createdAt: now, updatedAt: now,
        });
        owner = { _id: ins.insertedId };
        console.log(`   created owner ${ADMIN_EMAIL}`);
      } else console.log(`   reusing existing user ${ADMIN_EMAIL}`);
      const logo = (await upload(RESTAURANT.logo, `${ROOT}/logo`)) || RESTAURANT.logo;
      const cover = (await upload(RESTAURANT.coverImage, `${ROOT}/cover`)) || RESTAURANT.coverImage;
      const ins = await restaurants.insertOne({
        ownerId: owner._id, name: RESTAURANT.name, slug: RESTAURANT.slug,
        establishmentType: RESTAURANT.establishmentType, logo, coverImage: cover,
        primaryColor: "#B08D57", secondaryColor: "#F5E6CC",
        isActive: true, showPrices: true, createdAt: now, updatedAt: now,
      });
      restaurant = { _id: ins.insertedId, slug: RESTAURANT.slug };
    }

    // ── Categories + products ──────────────────────────────────────────────
    let sort = 0;
    for (const c of menu) {
      let cat = restaurant ? await cats.findOne({ restaurantId: restaurant._id, name: c.name }) : null;
      if (cat) stats.catExisting++;
      else {
        stats.catNew++;
        if (APPLY) {
          const ins = await cats.insertOne({
            restaurantId: restaurant._id, name: c.name, description: "",
            sortOrder: c.order, isActive: true, createdAt: now, updatedAt: now,
          });
          cat = { _id: ins.insertedId };
        }
      }

      for (const it of c.items) {
        sort++;
        const existing = cat && restaurant
          ? await prods.findOne({ restaurantId: restaurant._id, categoryId: cat._id, name: it.name })
          : null;

        let imageUrl = "";
        if (APPLY && it.image && !(existing && existing.image)) {
          imageUrl = (await upload(it.image, `${ROOT}/products/${slugify(c.name)}/${slugify(it.name.replace(/ (S|M|L)$/, ""))}`)) || "";
          if (imageUrl) stats.imgUploaded++; else stats.imgFailed++;
        }

        if (existing) {
          stats.prodExisting++;
          if (APPLY && it.supplements.length && !(existing.supplements && existing.supplements.length)) {
            await prods.updateOne({ _id: existing._id }, { $set: { supplements: it.supplements, updatedAt: now } });
          }
          if (APPLY && imageUrl) {
            await prods.updateOne({ _id: existing._id, $or: [{ image: { $exists: false } }, { image: "" }, { image: null }] },
              { $set: { image: imageUrl, updatedAt: now } });
            stats.imgFilled++;
          }
        } else {
          stats.prodNew++;
          if (APPLY) {
            await prods.insertOne({
              restaurantId: restaurant._id, categoryId: cat._id, name: it.name,
              description: it.description, price: it.price, supplements: it.supplements, image: imageUrl,
              badge: "", isAvailable: true, isFeatured: false, sortOrder: sort,
              createdAt: now, updatedAt: now,
            });
          }
        }
      }
    }

    console.log(stats);

    // ── Verification (apply only) ──────────────────────────────────────────
    if (APPLY) {
      const rid = restaurant._id;
      console.log("DB now →",
        "categories:", await cats.countDocuments({ restaurantId: rid }),
        "| products:", await prods.countDocuments({ restaurantId: rid }),
        "| with image:", await prods.countDocuments({ restaurantId: rid, image: { $nin: ["", null] } }));
      console.log(`Menu: ${(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "")}/menu/${RESTAURANT.slug}`);
    }
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

run().catch((e) => { console.error("❌ Seed failed:", e.message); process.exitCode = 1; });
