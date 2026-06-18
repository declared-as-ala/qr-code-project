const fs   = require("fs");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");
const mongoose = require("mongoose");

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

async function run() {
  console.log("Uploading cover image...");
  const result = await cloudinary.uploader.upload(
    path.join(process.cwd(), "public/logos/couverture.png"),
    { folder: "maison-nael", public_id: "cover", overwrite: true, resource_type: "image" }
  );
  console.log("Cover URL:", result.secure_url);

  await mongoose.connect(process.env.MONGODB_URI, { dbName: "qr_menu_saas" });
  await mongoose.connection.db.collection("restaurants").updateOne(
    { slug: "maison-nael" },
    {
      $set: {
        coverImage: result.secure_url,
        instagram:  "https://www.instagram.com/maisonnaelsousse/",
        logoBg:     "#ffffff",
      },
    }
  );
  await mongoose.disconnect();
  console.log("Done!");
}

run().catch(e => { console.error(e); process.exit(1); });
