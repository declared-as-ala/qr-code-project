/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const [k, ...v] = line.split("=");
    if (k && !(k in process.env)) process.env[k.trim()] = v.join("=").trim();
  }
}

const IMAGES = [
  { name: "Citronnade / Orange", image: "https://images.pexels.com/photos/8679581/pexels-photo-8679581.jpeg" },
  { name: "Fraise fraîche", image: "https://images.pexels.com/photos/11410545/pexels-photo-11410545.jpeg" },
  { name: "Banane crémeuse", image: "https://images.pexels.com/photos/4051764/pexels-photo-4051764.jpeg" },
  { name: "Fraise banane", image: "https://images.pexels.com/photos/8805423/pexels-photo-8805423.jpeg" },
  { name: "Datte banane", image: "https://images.pexels.com/photos/8712901/pexels-photo-8712901.jpeg" },
  { name: "Mangue banane", image: "https://images.pexels.com/photos/6493405/pexels-photo-6493405.jpeg" },
  { name: "Détox verte", image: "https://images.pexels.com/photos/35670362/pexels-photo-35670362.jpeg" },
  { name: "Détox orangée", image: "https://images.pexels.com/photos/10277954/pexels-photo-10277954.jpeg" },
  { name: "Coco mangue", image: "https://images.pexels.com/photos/10047619/pexels-photo-10047619.jpeg" },
  { name: "Limonade passion", image: "https://images.pexels.com/photos/18142613/pexels-photo-18142613.jpeg" },
  { name: "Pina colada", image: "https://images.pexels.com/photos/12591350/pexels-photo-12591350.jpeg" },
  { name: "Fruits rouges", image: "https://images.pexels.com/photos/20473743/pexels-photo-20473743.jpeg" },
  { name: "Perles tropicale", image: "https://images.pexels.com/photos/6493405/pexels-photo-6493405.jpeg" },
  { name: "Perles sunset", image: "https://images.pexels.com/photos/8679365/pexels-photo-8679365.jpeg" },
  { name: "Colada fraise", image: "https://images.pexels.com/photos/25409673/pexels-photo-25409673.jpeg" },
  { name: "Velours d'orge", image: "https://images.pexels.com/photos/33640921/pexels-photo-33640921.jpeg" },
  { name: "Nectar d'orge", image: "https://images.pexels.com/photos/30216065/pexels-photo-30216065.jpeg" },
  { name: "Virgin mojito", image: "https://images.pexels.com/photos/37914794/pexels-photo-37914794.jpeg" },
  { name: "Mojito mangue", image: "https://images.pexels.com/photos/12591350/pexels-photo-12591350.jpeg" },
  { name: "Mojito passion", image: "https://images.pexels.com/photos/1083353/pexels-photo-1083353.jpeg" },
  { name: "Mojito ananas basilic", image: "https://images.pexels.com/photos/8805353/pexels-photo-8805353.jpeg" },
  { name: "Océan bleu", image: "https://images.pexels.com/photos/24334860/pexels-photo-24334860.jpeg" },
  { name: "Limonade à la fraise", image: "https://images.pexels.com/photos/5946719/pexels-photo-5946719.jpeg" },
  { name: "Diabolo grenadine", image: "https://images.pexels.com/photos/11410545/pexels-photo-11410545.jpeg" },
  { name: "Glow Up", image: "https://images.pexels.com/photos/35380296/pexels-photo-35380296.jpeg" },
  { name: "Eau minérale 0,5 L", image: "https://images.pexels.com/photos/30743603/pexels-photo-30743603.jpeg" },
  { name: "Eau minérale 0,75 L", image: "https://images.pexels.com/photos/113734/pexels-photo-113734.jpeg" },
  { name: "Eau gazéifiée 1 L", image: "https://images.pexels.com/photos/11560362/pexels-photo-11560362.jpeg" },
  { name: "Boisson énergétique", image: "https://images.pexels.com/photos/33640921/pexels-photo-33640921.jpeg" },
  { name: "Boissons gazeuses", image: "https://images.pexels.com/photos/5947064/pexels-photo-5947064.jpeg" },
  { name: "Verre de lait", image: "https://images.pexels.com/photos/16748187/pexels-photo-16748187.jpeg" },
  { name: "Arôme / Lait concentré", image: "https://images.pexels.com/photos/8758351/pexels-photo-8758351.jpeg" },
  { name: "Lait sans lactose", image: "https://images.pexels.com/photos/4187716/pexels-photo-4187716.jpeg" },
  { name: "Lait d'amande ou d'avoine", image: "https://images.pexels.com/photos/6804187/pexels-photo-6804187.jpeg" },
  { name: "Shot espresso", image: "https://images.pexels.com/photos/32972496/pexels-photo-32972496.jpeg" },
  { name: "Espresso", image: "https://images.pexels.com/photos/14704659/pexels-photo-14704659.jpeg" },
  { name: "Americano", image: "https://images.pexels.com/photos/30428205/pexels-photo-30428205.jpeg" },
  { name: "Cortado", image: "https://images.pexels.com/photos/16615598/pexels-photo-16615598.jpeg" },
  { name: "Café crème", image: "https://images.pexels.com/photos/30629898/pexels-photo-30629898.jpeg" },
  { name: "Cappuccino", image: "https://images.pexels.com/photos/36954567/pexels-photo-36954567.jpeg" },
  { name: "Spanish Latte", image: "https://images.pexels.com/photos/16615598/pexels-photo-16615598.jpeg" },
  { name: "Latte saveur", image: "https://images.pexels.com/photos/30428205/pexels-photo-30428205.jpeg" },
  { name: "Latte tiramisu", image: "https://images.pexels.com/photos/30629898/pexels-photo-30629898.jpeg" },
  { name: "Mocha blanc", image: "https://images.pexels.com/photos/15533457/pexels-photo-15533457.jpeg" },
  { name: "Latte pistache", image: "https://images.pexels.com/photos/35672623/pexels-photo-35672623.jpeg" },
  { name: "Chocolat laitier", image: "https://images.pexels.com/photos/14829098/pexels-photo-14829098.jpeg" },
  { name: "Chocolat chaud", image: "https://images.pexels.com/photos/15533457/pexels-photo-15533457.jpeg" },
  { name: "Chocolat blanc chaud", image: "https://images.pexels.com/photos/14829098/pexels-photo-14829098.jpeg" },
  { name: "Affogato classique", image: "https://images.pexels.com/photos/32972496/pexels-photo-32972496.jpeg" },
  { name: "Affogato tiramisu", image: "https://images.pexels.com/photos/36579971/pexels-photo-36579971.jpeg" },
  { name: "Affogato pistache", image: "https://images.pexels.com/photos/12914800/pexels-photo-12914800.jpeg" },
  { name: "Choco glacier", image: "https://images.pexels.com/photos/8161427/pexels-photo-8161427.jpeg" },
  { name: "Thé infusion", image: "https://images.pexels.com/photos/5947064/pexels-photo-5947064.jpeg" },
  { name: "Thé glacé pêche", image: "https://images.pexels.com/photos/11009224/pexels-photo-11009224.jpeg" },
  { name: "Thé glacé citron", image: "https://images.pexels.com/photos/11009224/pexels-photo-11009224.jpeg" },
  { name: "Thé glacé passion", image: "https://images.pexels.com/photos/18142613/pexels-photo-18142613.jpeg" },
  { name: "Thé glacé framboise", image: "https://images.pexels.com/photos/11410545/pexels-photo-11410545.jpeg" },
  { name: "Americano glacé", image: "https://images.pexels.com/photos/11136849/pexels-photo-11136849.jpeg" },
  { name: "Spanish latte glacé", image: "https://images.pexels.com/photos/20220698/pexels-photo-20220698.jpeg" },
  { name: "Latte glacé caramel", image: "https://images.pexels.com/photos/7487382/pexels-photo-7487382.jpeg" },
  { name: "Latte glacé tiramisu", image: "https://images.pexels.com/photos/8472242/pexels-photo-8472242.jpeg" },
  { name: "Latte glacé pistache", image: "https://images.pexels.com/photos/35240179/pexels-photo-35240179.jpeg" },
  { name: "Frappé noisette chocolat", image: "https://images.pexels.com/photos/31569964/pexels-photo-31569964.jpeg" },
  { name: "Frappé caramel", image: "https://images.pexels.com/photos/5946982/pexels-photo-5946982.jpeg" },
  { name: "Frappé chocolat blanc", image: "https://images.pexels.com/photos/8161427/pexels-photo-8161427.jpeg" },
  { name: "Frappé pistache", image: "https://images.pexels.com/photos/35672623/pexels-photo-35672623.jpeg" },
  { name: "Matcha Latte", image: "https://images.pexels.com/photos/8329675/pexels-photo-8329675.jpeg" },
  { name: "Matcha chocolat blanc", image: "https://images.pexels.com/photos/32713602/pexels-photo-32713602.jpeg" },
  { name: "Matcha latte glacé", image: "https://images.pexels.com/photos/29156485/pexels-photo-29156485.jpeg" },
  { name: "Matcha fraise glacée", image: "https://images.pexels.com/photos/33371820/pexels-photo-33371820.jpeg" },
  { name: "Matcha mangue glacé", image: "https://images.pexels.com/photos/36517077/pexels-photo-36517077.jpeg" },
  { name: "Matcha limonade passion", image: "https://images.pexels.com/photos/37119337/pexels-photo-37119337.jpeg" },
  { name: "Chocolat-noisette shake", image: "https://images.pexels.com/photos/8743859/pexels-photo-8743859.jpeg" },
  { name: "Fraise shake", image: "https://images.pexels.com/photos/25409673/pexels-photo-25409673.jpeg" },
  { name: "Mangue shake", image: "https://images.pexels.com/photos/10047619/pexels-photo-10047619.jpeg" },
  { name: "Pêche shake", image: "https://images.pexels.com/photos/6188312/pexels-photo-6188312.jpeg" },
  { name: "Caramel café shake", image: "https://images.pexels.com/photos/31569964/pexels-photo-31569964.jpeg" },
  { name: "Pistache shake", image: "https://images.pexels.com/photos/8329675/pexels-photo-8329675.jpeg" },
  { name: "Benedict Saumon Fumé", image: "https://images.pexels.com/photos/30642083/pexels-photo-30642083.jpeg" },
  { name: "Benedict Bresaola", image: "https://images.pexels.com/photos/28879288/pexels-photo-28879288.jpeg" },
  { name: "Omelette Gourmet", image: "https://images.pexels.com/photos/8072541/pexels-photo-8072541.jpeg" },
  { name: "Croque Monsieur Truffe", image: "https://images.pexels.com/photos/29285138/pexels-photo-29285138.jpeg" },
  { name: "Burrata Toast Signature", image: "https://images.pexels.com/photos/36061355/pexels-photo-36061355.jpeg" },
  { name: "Tartine Méditerranéenne", image: "https://images.pexels.com/photos/10745969/pexels-photo-10745969.jpeg" },
  { name: "Gaufre Rösti Poulet Crispy", image: "https://images.pexels.com/photos/19585047/pexels-photo-19585047.jpeg" },
  { name: "Salade César Croustillante", image: "https://images.pexels.com/photos/28933155/pexels-photo-28933155.jpeg" },
  { name: "Tuna Bowl", image: "https://images.pexels.com/photos/20802554/pexels-photo-20802554.jpeg" },
  { name: "Salade Estivale", image: "https://images.pexels.com/photos/6107787/pexels-photo-6107787.jpeg" },
  { name: "Focaccia Pesche", image: "https://images.pexels.com/photos/33014398/pexels-photo-33014398.jpeg" },
  { name: "Focaccia Bresaola", image: "https://images.pexels.com/photos/29285138/pexels-photo-29285138.jpeg" },
  { name: "Cubano Chicken Sandwich", image: "https://images.pexels.com/photos/19585047/pexels-photo-19585047.jpeg" },
  { name: "Pain Perdu Vanille Caramel", image: "https://images.pexels.com/photos/37389022/pexels-photo-37389022.jpeg" },
  { name: "Pain Perdu Framboise Pistache", image: "https://images.pexels.com/photos/31960618/pexels-photo-31960618.jpeg" },
  { name: "Croissant nature", image: "https://images.pexels.com/photos/4828337/pexels-photo-4828337.jpeg" },
  { name: "Chocolatine", image: "https://images.pexels.com/photos/34517072/pexels-photo-34517072.jpeg" },
  { name: "Suisse Gourmand", image: "https://images.pexels.com/photos/30667032/pexels-photo-30667032.jpeg" },
  { name: "Pain aux raisins", image: "https://images.pexels.com/photos/30214406/pexels-photo-30214406.jpeg" },
  { name: "Nuage Citron", image: "https://images.pexels.com/photos/35134576/pexels-photo-35134576.jpeg" },
  { name: "Rubis pistache", image: "https://images.pexels.com/photos/32099670/pexels-photo-32099670.jpeg" },
  { name: "Amandine", image: "https://images.pexels.com/photos/4828337/pexels-photo-4828337.jpeg" },
  { name: "Danish Myrtille", image: "https://images.pexels.com/photos/37347559/pexels-photo-37347559.jpeg" },
  { name: "Danish Framboise Élégance", image: "https://images.pexels.com/photos/35134576/pexels-photo-35134576.jpeg" },
  { name: "Danish Fraise", image: "https://images.pexels.com/photos/30214406/pexels-photo-30214406.jpeg" },
  { name: "Cœur Cookie", image: "https://images.pexels.com/photos/11127418/pexels-photo-11127418.jpeg" },
  { name: "Papillon Caramel Beurre Salé", image: "https://images.pexels.com/photos/33424926/pexels-photo-33424926.jpeg" },
  { name: "Papillon Rubis", image: "https://images.pexels.com/photos/5897454/pexels-photo-5897454.jpeg" },
  { name: "Le Suisse Gourmet", image: "https://images.pexels.com/photos/30667032/pexels-photo-30667032.jpeg" },
  { name: "Danish Forestier", image: "https://images.pexels.com/photos/32745112/pexels-photo-32745112.jpeg" },
  { name: "Danish Italien", image: "https://images.pexels.com/photos/30206963/pexels-photo-30206963.jpeg" },
  { name: "Cake marbré", image: "https://images.pexels.com/photos/34427812/pexels-photo-34427812.jpeg" },
  { name: "Cake amande sans gluten", image: "https://images.pexels.com/photos/5848128/pexels-photo-5848128.jpeg" },
  { name: "Biscuit italien", image: "https://images.pexels.com/photos/17255894/pexels-photo-17255894.jpeg" },
  { name: "Biscuit soleil", image: "https://images.pexels.com/photos/25067703/pexels-photo-25067703.jpeg" },
  { name: "Madeleine vanille", image: "https://images.pexels.com/photos/25067703/pexels-photo-25067703.jpeg" },
  { name: "Madeleine chocolat", image: "https://images.pexels.com/photos/13428096/pexels-photo-13428096.jpeg" },
  { name: "Financier vanille amande", image: "https://images.pexels.com/photos/5848128/pexels-photo-5848128.jpeg" },
  { name: "Financier pistache", image: "https://images.pexels.com/photos/32099670/pexels-photo-32099670.jpeg" },
  { name: "Cookies chocolat noisette", image: "https://images.pexels.com/photos/11127418/pexels-photo-11127418.jpeg" },
  { name: "Cookies pistache chocolat blanc", image: "https://images.pexels.com/photos/17255894/pexels-photo-17255894.jpeg" },
];

async function run() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "qr_menu_saas" });
  const db = mongoose.connection.db;

  const restaurant = await db.collection("restaurants").findOne({ slug: "maison-nael" });
  if (!restaurant) throw new Error("MAISON NAEL not found");
  const restaurantId = restaurant._id;

  let updated = 0, notFound = 0;
  for (const { name, image } of IMAGES) {
    const result = await db.collection("products").updateOne(
      { restaurantId, name },
      { $set: { image, updatedAt: new Date() } }
    );
    if (result.matchedCount > 0) {
      updated++;
      process.stdout.write(".");
    } else {
      notFound++;
      console.log("\n  ⚠ not found: " + name);
    }
  }

  console.log(`\n\n✅ Updated ${updated} products. Not found: ${notFound}.`);
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("❌", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
