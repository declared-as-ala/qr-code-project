/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * seed-nael.js — seeds MAISON NAËL Patisserie Fine.
 * Run: node scripts/seed-nael.js
 * Logo: public/logos/manel.png
 */

const fs   = require("fs");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

// ── Load .env.local ──────────────────────────────────────────────────────────
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

// ── Progress (resume support) ─────────────────────────────────────────────────
const PROG = path.join(__dirname, ".nael-img-progress.json");
const load = () => fs.existsSync(PROG) ? JSON.parse(fs.readFileSync(PROG)) : {};
const save = (p) => fs.writeFileSync(PROG, JSON.stringify(p, null, 2));
const slug = (n) => n.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ── Item image URLs ───────────────────────────────────────────────────────────
const ITEMS = {
  "__logo__": "LOCAL:public/logos/manel.png",

  // ── Boissons Chaudes ─────────────────────────────────────────────────────────
  "Espresso":                           "https://images.pexels.com/photos/11160148/pexels-photo-11160148.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Americano":                          "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=800&q=85",
  "Cortado":                            "https://images.pexels.com/photos/11160148/pexels-photo-11160148.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Café crème":                         "https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?auto=format&fit=crop&w=800&q=85",
  "Cappuccino":                         "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=85",
  "Spanish Latte":                      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=85",
  "Latte saveur":                       "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=85",
  "Latte Tiramisu":                     "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?auto=format&fit=crop&w=800&q=85",
  "Mocha Blanc":                        "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=85",
  "Latte Pistache":                     "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?auto=format&fit=crop&w=800&q=85",
  "Chocolat laitier":                   "https://images.pexels.com/photos/35210027/pexels-photo-35210027.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Chocolat chaud":                     "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=85",
  "Chocolat blanc chaud":               "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=85",

  // ── Cafés Glacés ─────────────────────────────────────────────────────────────
  "Americano glacé":                    "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Spanish Latte glacé":                "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Latte glacé caramel":               "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=85",
  "Latte glacé tiramisu":              "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Latte glacé pistache":              "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?auto=format&fit=crop&w=800&q=85",
  "Frappé caramel":                    "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Frappé noisette chocolat":          "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Frappé chocolat blanc":             "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Frappé pistache":                   "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?auto=format&fit=crop&w=800&q=85",

  // ── Matcha ───────────────────────────────────────────────────────────────────
  "Matcha Latte":                       "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85",
  "Matcha Chocolat Blanc":              "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85",
  "Matcha Latte glacé":                "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85",
  "Matcha Fraise glacée":              "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85",
  "Matcha Mangue glacé":               "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85",
  "Matcha Limonade Passion":            "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85",

  // ── Milkshakes ───────────────────────────────────────────────────────────────
  "Chocolat-Noisette Shake":            "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Fraise Shake":                       "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Mangue Shake":                       "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Pêche Shake":                        "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Caramel Café Shake":                 "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Pistache Shake":                     "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Hot & Cold ───────────────────────────────────────────────────────────────
  "Affogato classique":                 "https://images.pexels.com/photos/36576776/pexels-photo-36576776.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Affogato Tiramisu":                  "https://images.pexels.com/photos/36576776/pexels-photo-36576776.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Affogato Pistache":                  "https://images.pexels.com/photos/36576776/pexels-photo-36576776.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Choco Glacier":                      "https://images.pexels.com/photos/36576776/pexels-photo-36576776.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Jus Frais & Smoothies ────────────────────────────────────────────────────
  "Citronnade / Orange":                "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=85",
  "Fraise fraîche":                    "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=800&q=85",
  "Banane crémeuse":                   "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Fraise Banane":                      "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=800&q=85",
  "Datte Banane":                       "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Mangue Banane":                      "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Détox verte":                       "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Détox orangée":                     "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=800&q=85",
  "Coco Mangue":                        "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Limonade Passion":                   "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=85",
  "Pina Colada":                        "https://images.pexels.com/photos/8504563/pexels-photo-8504563.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Fruits Rouges":                      "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=800&q=85",
  "Perles Tropicale":                   "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Perles Sunset":                      "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Colada Fraise":                      "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=800&q=85",

  // ── Mocktails ────────────────────────────────────────────────────────────────
  "Virgin Mojito":                      "https://images.pexels.com/photos/7259054/pexels-photo-7259054.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Limonade à la fraise":              "https://images.pexels.com/photos/36630839/pexels-photo-36630839.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Diabolo Grenadine":                  "https://images.pexels.com/photos/36630839/pexels-photo-36630839.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Mojito Mangue":                      "https://images.pexels.com/photos/7259054/pexels-photo-7259054.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Mojito Passion":                     "https://images.pexels.com/photos/7259054/pexels-photo-7259054.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Océan Bleu":                        "https://images.pexels.com/photos/8504563/pexels-photo-8504563.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Mojito Ananas Basilic":              "https://images.pexels.com/photos/7259054/pexels-photo-7259054.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Glow Up":                            "https://images.pexels.com/photos/36630839/pexels-photo-36630839.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Signatures ───────────────────────────────────────────────────────────────
  "Velours d'Orge":                    "https://images.pexels.com/photos/8504563/pexels-photo-8504563.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Nectar d'Orge":                     "https://images.pexels.com/photos/8504563/pexels-photo-8504563.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Thés ─────────────────────────────────────────────────────────────────────
  "Thé infusion":                      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85",
  "Thé glacé pêche":                   "https://images.pexels.com/photos/824201/pexels-photo-824201.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Thé glacé citron":                  "https://images.pexels.com/photos/824201/pexels-photo-824201.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Thé glacé passion":                 "https://images.pexels.com/photos/824201/pexels-photo-824201.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Thé glacé framboise":               "https://images.pexels.com/photos/824201/pexels-photo-824201.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Eaux & Boissons Gazeuses ─────────────────────────────────────────────────
  "Eau minérale 0.5L":                 "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=85",
  "Eau minérale 0.75L":                "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=85",
  "Eau gazéifiée 1L":                  "https://images.pexels.com/photos/18212879/pexels-photo-18212879.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Boissons gazeuses":                  "https://images.pexels.com/photos/5860659/pexels-photo-5860659.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Boisson énergétique":               "https://images.pexels.com/photos/5860659/pexels-photo-5860659.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Suppléments ──────────────────────────────────────────────────────────────
  "Arôme / Lait concentré":            "https://images.pexels.com/photos/2198626/pexels-photo-2198626.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Lait sans lactose":                  "https://images.pexels.com/photos/2198626/pexels-photo-2198626.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Verre de lait":                      "https://images.pexels.com/photos/2198626/pexels-photo-2198626.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Shot espresso":                      "https://images.pexels.com/photos/11160148/pexels-photo-11160148.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Lait d'amande ou d'avoine":         "https://images.pexels.com/photos/2198626/pexels-photo-2198626.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Viennoiseries Sucrées ────────────────────────────────────────────────────
  "Croissant nature":                   "https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Chocolatine":                        "https://images.pexels.com/photos/1756665/pexels-photo-1756665.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Pain aux raisins":                   "https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Suisse Gourmand":                    "https://images.pexels.com/photos/1756665/pexels-photo-1756665.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Nuage Citron":                       "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Danish Fraise":                      "https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Rubis Pistache":                     "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Papillon Caramel Beurre Salé":      "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Amandine":                           "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Danish Myrtille":                    "https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Danish Framboise Élégance":         "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Cœur Cookie":                       "https://images.pexels.com/photos/8478048/pexels-photo-8478048.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Viennoiseries Salées ─────────────────────────────────────────────────────
  "Le Suisse Gourmet":                  "https://images.pexels.com/photos/5555754/pexels-photo-5555754.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Danish Forestier":                   "https://images.pexels.com/photos/5555754/pexels-photo-5555754.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Danish Italien":                     "https://images.pexels.com/photos/5555754/pexels-photo-5555754.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Biscuits Secs ────────────────────────────────────────────────────────────
  "Cake marbré":                       "https://images.pexels.com/photos/36590618/pexels-photo-36590618.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Cake amande sans gluten":            "https://images.pexels.com/photos/36590618/pexels-photo-36590618.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Biscuit italien":                    "https://images.pexels.com/photos/8478048/pexels-photo-8478048.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Biscuit soleil":                     "https://images.pexels.com/photos/8478048/pexels-photo-8478048.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Madeleine vanille":                  "https://images.pexels.com/photos/8478048/pexels-photo-8478048.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Madeleine chocolat":                 "https://images.pexels.com/photos/8478048/pexels-photo-8478048.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Financier vanille amande":           "https://images.pexels.com/photos/8478048/pexels-photo-8478048.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Financier pistache":                 "https://images.pexels.com/photos/8478048/pexels-photo-8478048.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Cookies chocolat noisette":          "https://images.pexels.com/photos/8478048/pexels-photo-8478048.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Cookies pistache chocolat blanc":    "https://images.pexels.com/photos/8478048/pexels-photo-8478048.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Pâtisseries Individuelles ────────────────────────────────────────────────
  "Signature Cacahuète":               "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Tarte au citron meringuée":         "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Mille-feuille Vanille":             "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Flan Vanille":                       "https://images.pexels.com/photos/28835214/pexels-photo-28835214.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Éclair Tiramisu":                   "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Cheesecake Caramel":                 "https://images.pexels.com/photos/28835214/pexels-photo-28835214.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Cheesecake Citron":                  "https://images.pexels.com/photos/28835214/pexels-photo-28835214.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Pistache en Rose":                   "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Nuances de Chocolat":               "https://images.pexels.com/photos/27819688/pexels-photo-27819688.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Red Velvet":                         "https://images.pexels.com/photos/36590618/pexels-photo-36590618.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Le Citron":                          "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800",
  "La Noix":                            "https://images.pexels.com/photos/36590618/pexels-photo-36590618.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Noir et Noisette":                   "https://images.pexels.com/photos/27819688/pexels-photo-27819688.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Paris Brest":                        "https://images.pexels.com/photos/36590618/pexels-photo-36590618.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Éclair Matcha Framboise":           "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Cheesecake Fraise":                  "https://images.pexels.com/photos/28835214/pexels-photo-28835214.jpeg?auto=compress&cs=tinysrgb&w=800",
  "La Cacahuète":                       "https://images.pexels.com/photos/36590618/pexels-photo-36590618.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Chocolat Signature":                 "https://images.pexels.com/photos/27819688/pexels-photo-27819688.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Pistache d'Orient":                 "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800",
  "La Fraise":                          "https://images.pexels.com/photos/36590618/pexels-photo-36590618.jpeg?auto=compress&cs=tinysrgb&w=800",
  "La Mangue":                          "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800",
  "La Framboise":                       "https://images.pexels.com/photos/36590618/pexels-photo-36590618.jpeg?auto=compress&cs=tinysrgb&w=800",
  "La Noisette":                        "https://images.pexels.com/photos/36590618/pexels-photo-36590618.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Flan Praliné Noisette":             "https://images.pexels.com/photos/28835214/pexels-photo-28835214.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Cheesecake Framboise":               "https://images.pexels.com/photos/28835214/pexels-photo-28835214.jpeg?auto=compress&cs=tinysrgb&w=800",
  "L'Opéra Pistache":                  "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800",
  "La Pistache":                        "https://images.pexels.com/photos/17322388/pexels-photo-17322388.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Charlotte Fruits Rouges":            "https://images.pexels.com/photos/36590618/pexels-photo-36590618.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Douceur des Îles":                  "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Flan Praliné Pistache":             "https://images.pexels.com/photos/28835214/pexels-photo-28835214.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Chocolate Layer Cake":               "https://images.pexels.com/photos/27819688/pexels-photo-27819688.jpeg?auto=compress&cs=tinysrgb&w=800",
};

// ── Upload one item ───────────────────────────────────────────────────────────
async function uploadItem(name, srcQuery, progress) {
  const key      = name === "__logo__" ? "logo" : `item:${name}`;
  if (progress[key]) {
    console.log(`  ✓ (cached) ${name}`);
    return progress[key];
  }

  const srcUrl   = srcQuery.startsWith("LOCAL:")
    ? path.join(process.cwd(), srcQuery.slice(6))
    : srcQuery;
  const publicId = name === "__logo__" ? "logo" : `items/${slug(name)}`;

  try {
    console.log(`  ⬇  ${name}`);
    const result = await cloudinary.uploader.upload(srcUrl, {
      folder:        "maison-nael",
      public_id:     publicId,
      overwrite:     true,
      resource_type: "image",
    });
    progress[key] = result.secure_url;
    save(progress);
    console.log(`  ✅ ${name} → ${result.secure_url}`);
    await sleep(600);
    return result.secure_url;
  } catch (err) {
    console.error(`  ❌ ${name} — ${err.message}`);
    return null;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  const progress = load();
  const names    = Object.keys(ITEMS);

  console.log(`\n🖼  Uploading ${names.length} images to Cloudinary...\n`);
  let i = 0;
  for (const name of names) {
    i++;
    process.stdout.write(`[${i}/${names.length}] `);
    await uploadItem(name, ITEMS[name], progress);
  }

  // ── Seed database ───────────────────────────────────────────────────────────
  console.log("\n🌱 Seeding database...\n");
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "qr_menu_saas" });
  const db          = mongoose.connection.db;
  const users       = db.collection("users");
  const restaurants = db.collection("restaurants");
  const categories  = db.collection("categories");
  const products    = db.collection("products");
  const qrcodes     = db.collection("qrcodes");
  const now = new Date();
  const getDoc = (r) => r?.value ?? r;

  const adminEmail = "owner@maison-nael.tn";
  const adminHash  = await bcrypt.hash("MaisonNael@2026", 12);
  const adminRes   = await users.findOneAndUpdate(
    { email: adminEmail },
    {
      $set: {
        name: "Maison Naël Owner",
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
  const ownerId = getDoc(adminRes)?._id;

  const restRes = await restaurants.findOneAndUpdate(
    { slug: "maison-nael" },
    {
      $set: {
        ownerId,
        name:              "MAISON NAËL",
        slug:              "maison-nael",
        establishmentType: "cafe",
        tagline:           "Patisserie Fine",
        description:       "MAISON NAËL — Patisserie Fine. Viennoiseries artisanales, pâtisseries individuelles de caractère, cafés de spécialité et boissons créatives dans un cadre raffiné.",
        phone:             "",
        address:           "Tunisie",
        instagram:         "",
        facebook:          "",
        googleMapsUrl:     "",
        logo:              progress["logo"] || "",
        coverImage:        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1800&q=90",
        primaryColor:      "#1a0a0a",
        secondaryColor:    "#d4a96e",
        currency:          "TND",
        isActive:          true,
        showPrices:        true,
        updatedAt:         now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true, returnDocument: "after" }
  );
  const restaurantId = getDoc(restRes)?._id;

  // ── Categories ──────────────────────────────────────────────────────────────
  const catData = [
    { key: "boissons_chaudes",    name: "Boissons Chaudes",         sortOrder: 1  },
    { key: "cafes_glaces",        name: "Cafés Glacés",             sortOrder: 2  },
    { key: "matcha",              name: "Matcha",                   sortOrder: 3  },
    { key: "milkshakes",          name: "Milkshakes",               sortOrder: 4  },
    { key: "hot_cold",            name: "Hot & Cold",               sortOrder: 5  },
    { key: "jus_smoothies",       name: "Jus Frais & Smoothies",    sortOrder: 6  },
    { key: "mocktails",           name: "Mocktails",                sortOrder: 7  },
    { key: "signatures",          name: "Signatures",               sortOrder: 8  },
    { key: "thes",                name: "Thés",                     sortOrder: 9  },
    { key: "eaux_gazeuses",       name: "Eaux & Boissons Gazeuses", sortOrder: 10 },
    { key: "supplements",         name: "Suppléments",              sortOrder: 11 },
    { key: "viennoiseries_sucrees",name: "Viennoiseries Sucrées",   sortOrder: 12 },
    { key: "viennoiseries_salees", name: "Viennoiseries Salées",    sortOrder: 13 },
    { key: "biscuits_secs",       name: "Biscuits Secs",            sortOrder: 14 },
    { key: "patisseries",         name: "Pâtisseries Individuelles",sortOrder: 15 },
  ];

  const catIds = {};
  for (const cat of catData) {
    const r = await categories.findOneAndUpdate(
      { restaurantId, name: cat.name },
      {
        $set: { restaurantId, name: cat.name, description: "", isActive: true, sortOrder: cat.sortOrder, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, returnDocument: "after" }
    );
    catIds[cat.key] = getDoc(r)?._id;
  }

  // ── Products ────────────────────────────────────────────────────────────────
  const productMeta = {
    // Boissons Chaudes
    "Espresso":                        { c: "boissons_chaudes",  p: 6,    b: ""          },
    "Americano":                       { c: "boissons_chaudes",  p: 7,    b: ""          },
    "Cortado":                         { c: "boissons_chaudes",  p: 7,    b: ""          },
    "Café crème":                      { c: "boissons_chaudes",  p: 7.5,  b: ""          },
    "Cappuccino":                      { c: "boissons_chaudes",  p: 8,    b: "Populaire" },
    "Spanish Latte":                   { c: "boissons_chaudes",  p: 8.5,  b: "Populaire" },
    "Latte saveur":                    { c: "boissons_chaudes",  p: 9,    b: "",          d: "Caramel / Noisette / Vanille" },
    "Latte Tiramisu":                  { c: "boissons_chaudes",  p: 12,   b: "Signature" },
    "Mocha Blanc":                     { c: "boissons_chaudes",  p: 10,   b: ""          },
    "Latte Pistache":                  { c: "boissons_chaudes",  p: 14,   b: "Signature" },
    "Chocolat laitier":                { c: "boissons_chaudes",  p: 7,    b: ""          },
    "Chocolat chaud":                  { c: "boissons_chaudes",  p: 10,   b: ""          },
    "Chocolat blanc chaud":            { c: "boissons_chaudes",  p: 12,   b: ""          },

    // Cafés Glacés
    "Americano glacé":                 { c: "cafes_glaces",      p: 9,    b: ""          },
    "Spanish Latte glacé":             { c: "cafes_glaces",      p: 12,   b: "Populaire" },
    "Latte glacé caramel":            { c: "cafes_glaces",      p: 13,   b: ""          },
    "Latte glacé tiramisu":           { c: "cafes_glaces",      p: 14,   b: "Signature" },
    "Latte glacé pistache":           { c: "cafes_glaces",      p: 15,   b: "Signature" },
    "Frappé caramel":                 { c: "cafes_glaces",      p: 15,   b: "Populaire" },
    "Frappé noisette chocolat":       { c: "cafes_glaces",      p: 15.5, b: ""          },
    "Frappé chocolat blanc":          { c: "cafes_glaces",      p: 15.5, b: ""          },
    "Frappé pistache":                { c: "cafes_glaces",      p: 16,   b: "Signature" },

    // Matcha
    "Matcha Latte":                    { c: "matcha",            p: 9,    b: ""          },
    "Matcha Chocolat Blanc":           { c: "matcha",            p: 12,   b: ""          },
    "Matcha Latte glacé":             { c: "matcha",            p: 12.5, b: "Populaire" },
    "Matcha Fraise glacée":           { c: "matcha",            p: 15,   b: "Signature" },
    "Matcha Mangue glacé":            { c: "matcha",            p: 15,   b: ""          },
    "Matcha Limonade Passion":         { c: "matcha",            p: 15,   b: "Nouveau"   },

    // Milkshakes
    "Chocolat-Noisette Shake":         { c: "milkshakes",        p: 15,   b: ""          },
    "Fraise Shake":                    { c: "milkshakes",        p: 15,   b: "Populaire" },
    "Mangue Shake":                    { c: "milkshakes",        p: 15,   b: ""          },
    "Pêche Shake":                     { c: "milkshakes",        p: 15,   b: ""          },
    "Caramel Café Shake":              { c: "milkshakes",        p: 16,   b: ""          },
    "Pistache Shake":                  { c: "milkshakes",        p: 17,   b: "Signature" },

    // Hot & Cold
    "Affogato classique":              { c: "hot_cold",          p: 9,    b: ""          },
    "Affogato Tiramisu":               { c: "hot_cold",          p: 12.5, b: "Populaire" },
    "Affogato Pistache":               { c: "hot_cold",          p: 14,   b: "Signature" },
    "Choco Glacier":                   { c: "hot_cold",          p: 12,   b: ""          },

    // Jus Frais & Smoothies
    "Citronnade / Orange":             { c: "jus_smoothies",     p: 8,    b: ""          },
    "Fraise fraîche":                 { c: "jus_smoothies",     p: 9,    b: ""          },
    "Banane crémeuse":                { c: "jus_smoothies",     p: 12,   b: ""          },
    "Fraise Banane":                   { c: "jus_smoothies",     p: 14,   b: "Populaire" },
    "Datte Banane":                    { c: "jus_smoothies",     p: 14,   b: ""          },
    "Mangue Banane":                   { c: "jus_smoothies",     p: 15,   b: ""          },
    "Détox verte":                    { c: "jus_smoothies",     p: 12,   b: ""          },
    "Détox orangée":                  { c: "jus_smoothies",     p: 12,   b: ""          },
    "Coco Mangue":                     { c: "jus_smoothies",     p: 16,   b: ""          },
    "Limonade Passion":                { c: "jus_smoothies",     p: 16,   b: "Populaire" },
    "Pina Colada":                     { c: "jus_smoothies",     p: 16,   b: ""          },
    "Fruits Rouges":                   { c: "jus_smoothies",     p: 16,   b: ""          },
    "Perles Tropicale":                { c: "jus_smoothies",     p: 17,   b: "Signature" },
    "Perles Sunset":                   { c: "jus_smoothies",     p: 17,   b: "Signature" },
    "Colada Fraise":                   { c: "jus_smoothies",     p: 17,   b: ""          },

    // Mocktails
    "Virgin Mojito":                   { c: "mocktails",         p: 12.5, b: ""          },
    "Limonade à la fraise":           { c: "mocktails",         p: 12.5, b: "Populaire" },
    "Diabolo Grenadine":               { c: "mocktails",         p: 12.5, b: ""          },
    "Mojito Mangue":                   { c: "mocktails",         p: 14,   b: ""          },
    "Mojito Passion":                  { c: "mocktails",         p: 14,   b: ""          },
    "Océan Bleu":                     { c: "mocktails",         p: 14,   b: "Nouveau"   },
    "Mojito Ananas Basilic":           { c: "mocktails",         p: 14.5, b: ""          },
    "Glow Up":                         { c: "mocktails",         p: 16.5, b: "Signature" },

    // Signatures
    "Velours d'Orge":                 { c: "signatures",        p: 13,   b: "Signature" },
    "Nectar d'Orge":                  { c: "signatures",        p: 15,   b: "Signature" },

    // Thés
    "Thé infusion":                   { c: "thes",              p: 8,    b: ""          },
    "Thé glacé pêche":                { c: "thes",              p: 10,   b: ""          },
    "Thé glacé citron":               { c: "thes",              p: 10,   b: ""          },
    "Thé glacé passion":              { c: "thes",              p: 10,   b: "Populaire" },
    "Thé glacé framboise":            { c: "thes",              p: 10,   b: ""          },

    // Eaux & Boissons Gazeuses
    "Eau minérale 0.5L":              { c: "eaux_gazeuses",     p: 3,    b: ""          },
    "Eau minérale 0.75L":             { c: "eaux_gazeuses",     p: 5,    b: ""          },
    "Eau gazéifiée 1L":               { c: "eaux_gazeuses",     p: 5.5,  b: ""          },
    "Boissons gazeuses":               { c: "eaux_gazeuses",     p: 5.5,  b: ""          },
    "Boisson énergétique":            { c: "eaux_gazeuses",     p: 8,    b: ""          },

    // Suppléments
    "Arôme / Lait concentré":         { c: "supplements",       p: 2,    b: ""          },
    "Lait sans lactose":               { c: "supplements",       p: 2,    b: ""          },
    "Verre de lait":                   { c: "supplements",       p: 2.5,  b: ""          },
    "Shot espresso":                   { c: "supplements",       p: 2.5,  b: ""          },
    "Lait d'amande ou d'avoine":      { c: "supplements",       p: 3,    b: ""          },

    // Viennoiseries Sucrées
    "Croissant nature":                { c: "viennoiseries_sucrees", p: 3,    b: ""          },
    "Chocolatine":                     { c: "viennoiseries_sucrees", p: 3.5,  b: "Populaire" },
    "Pain aux raisins":                { c: "viennoiseries_sucrees", p: 3.5,  b: ""          },
    "Suisse Gourmand":                 { c: "viennoiseries_sucrees", p: 4.3,  b: ""          },
    "Nuage Citron":                    { c: "viennoiseries_sucrees", p: 4.5,  b: ""          },
    "Danish Fraise":                   { c: "viennoiseries_sucrees", p: 5.5,  b: "Populaire" },
    "Rubis Pistache":                  { c: "viennoiseries_sucrees", p: 6.5,  b: "Signature" },
    "Papillon Caramel Beurre Salé":   { c: "viennoiseries_sucrees", p: 6.5,  b: "Signature" },
    "Amandine":                        { c: "viennoiseries_sucrees", p: 5.8,  b: ""          },
    "Danish Myrtille":                 { c: "viennoiseries_sucrees", p: 8.5,  b: ""          },
    "Danish Framboise Élégance":      { c: "viennoiseries_sucrees", p: 12,   b: "Signature" },
    "Cœur Cookie":                    { c: "viennoiseries_sucrees", p: 8.5,  b: "Nouveau"   },

    // Viennoiseries Salées
    "Le Suisse Gourmet":               { c: "viennoiseries_salees", p: 6.5,  b: ""          },
    "Danish Forestier":                { c: "viennoiseries_salees", p: 7.8,  b: "Populaire" },
    "Danish Italien":                  { c: "viennoiseries_salees", p: 9.5,  b: "Signature" },

    // Biscuits Secs
    "Cake marbré":                    { c: "biscuits_secs",     p: 23,   b: ""          },
    "Cake amande sans gluten":         { c: "biscuits_secs",     p: 11,   b: ""          },
    "Biscuit italien":                 { c: "biscuits_secs",     p: 55,   b: "",          d: "55 TND/kg" },
    "Biscuit soleil":                  { c: "biscuits_secs",     p: 60,   b: "",          d: "60 TND/kg" },
    "Madeleine vanille":               { c: "biscuits_secs",     p: 35,   b: "Populaire" },
    "Madeleine chocolat":              { c: "biscuits_secs",     p: 45,   b: "",          d: "45 TND/kg" },
    "Financier vanille amande":        { c: "biscuits_secs",     p: 60,   b: "",          d: "60 TND/kg" },
    "Financier pistache":              { c: "biscuits_secs",     p: 92,   b: "Signature", d: "92 TND/kg" },
    "Cookies chocolat noisette":       { c: "biscuits_secs",     p: 9.5,  b: "Populaire" },
    "Cookies pistache chocolat blanc": { c: "biscuits_secs",     p: 12.5, b: ""          },

    // Pâtisseries Individuelles
    "Signature Cacahuète":            { c: "patisseries",       p: 7,    b: ""          },
    "Tarte au citron meringuée":      { c: "patisseries",       p: 6.5,  b: "Populaire" },
    "Mille-feuille Vanille":          { c: "patisseries",       p: 7.5,  b: ""          },
    "Flan Vanille":                    { c: "patisseries",       p: 10,   b: ""          },
    "Éclair Tiramisu":                { c: "patisseries",       p: 11,   b: ""          },
    "Cheesecake Caramel":              { c: "patisseries",       p: 12,   b: "Populaire" },
    "Cheesecake Citron":               { c: "patisseries",       p: 12,   b: ""          },
    "Pistache en Rose":                { c: "patisseries",       p: 12,   b: "Nouveau"   },
    "Nuances de Chocolat":            { c: "patisseries",       p: 12,   b: ""          },
    "Red Velvet":                      { c: "patisseries",       p: 12,   b: "Populaire" },
    "Le Citron":                       { c: "patisseries",       p: 13,   b: ""          },
    "La Noix":                         { c: "patisseries",       p: 13,   b: ""          },
    "Noir et Noisette":               { c: "patisseries",       p: 13,   b: ""          },
    "Paris Brest":                     { c: "patisseries",       p: 13,   b: "Signature" },
    "Éclair Matcha Framboise":        { c: "patisseries",       p: 13,   b: "Nouveau"   },
    "Cheesecake Fraise":               { c: "patisseries",       p: 13,   b: "Populaire" },
    "La Cacahuète":                    { c: "patisseries",       p: 13.5, b: ""          },
    "Chocolat Signature":              { c: "patisseries",       p: 13.5, b: "Signature" },
    "Pistache d'Orient":              { c: "patisseries",       p: 13.5, b: "Signature" },
    "La Fraise":                       { c: "patisseries",       p: 14,   b: "Populaire" },
    "La Mangue":                       { c: "patisseries",       p: 15,   b: ""          },
    "La Framboise":                    { c: "patisseries",       p: 16,   b: "Signature" },
    "La Noisette":                     { c: "patisseries",       p: 16,   b: "Signature" },
    "Flan Praliné Noisette":          { c: "patisseries",       p: 16,   b: ""          },
    "Cheesecake Framboise":            { c: "patisseries",       p: 16,   b: ""          },
    "L'Opéra Pistache":               { c: "patisseries",       p: 16.5, b: "Signature" },
    "La Pistache":                     { c: "patisseries",       p: 17,   b: "Signature" },
    "Charlotte Fruits Rouges":         { c: "patisseries",       p: 17,   b: ""          },
    "Douceur des Îles":               { c: "patisseries",       p: 18,   b: "Signature" },
    "Flan Praliné Pistache":          { c: "patisseries",       p: 18,   b: "Signature" },
    "Chocolate Layer Cake":            { c: "patisseries",       p: 19,   b: "Signature" },
  };

  let sortOrder = 0;
  for (const [name, meta] of Object.entries(productMeta)) {
    sortOrder++;
    const imageUrl = progress[`item:${name}`] || "";
    await products.findOneAndUpdate(
      { restaurantId, name },
      {
        $set: {
          restaurantId,
          categoryId:  catIds[meta.c],
          name,
          description: meta.d || name,
          price:       meta.p,
          image:       imageUrl,
          badge:       meta.b || "",
          isAvailable: true,
          isFeatured:  meta.b === "Populaire" || meta.b === "Signature",
          sortOrder,
          updatedAt:   now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );
  }

  await qrcodes.findOneAndUpdate(
    { restaurantId },
    {
      $set: { restaurantId, targetUrl: "http://localhost:3000/menu/maison-nael", qrImageUrl: "", updatedAt: now },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  );

  await mongoose.disconnect();
  console.log("\n✅ Done! MAISON NAËL seeded.");
  console.log("   Login: owner@maison-nael.tn / MaisonNael@2026");
  console.log("   Menu:  http://localhost:3000/menu/maison-nael\n");
}

run().catch(async (err) => {
  console.error("❌", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
