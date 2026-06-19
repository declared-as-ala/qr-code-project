/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * seed-douja.js — seeds Douja Lounge with Cloudinary-hosted images.
 * Run: node scripts/seed-douja.js
 *
 * Logo: douja.png (project root)
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
const PROG = path.join(__dirname, ".douja-img-progress.json");
const load = () => fs.existsSync(PROG) ? JSON.parse(fs.readFileSync(PROG)) : {};
const save = (p) => fs.writeFileSync(PROG, JSON.stringify(p, null, 2));
const slug = (n) => n.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ── Item image URLs ───────────────────────────────────────────────────────────
const ITEMS = {
  "__logo__": "LOCAL:douja.png",

  // ── Café (regular) ───────────────────────────────────────────────────────────
  "Express":              "https://images.pexels.com/photos/11160148/pexels-photo-11160148.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Café américain":       "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=800&q=85",
  "Capucin":              "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=85",
  "Direct":               "https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?auto=format&fit=crop&w=800&q=85",
  "Direct spécial":       "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=85",
  "Cappuccino":           "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=85",
  "Cappuccino spécial":   "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=85",
  "Café turc":            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=85",
  "Chocolat au lait":     "https://images.pexels.com/photos/35210027/pexels-photo-35210027.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Nescafé au lait":      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=85",

  // ── Italian Coffee (Nespresso) ────────────────────────────────────────────────
  "Nespresso Expresso":           "https://images.pexels.com/photos/11160148/pexels-photo-11160148.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Nespresso Expresso macchiato": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=85",
  "Nespresso Direct":             "https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?auto=format&fit=crop&w=800&q=85",
  "Nespresso Cappuccino":         "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=85",

  // ── Thé ──────────────────────────────────────────────────────────────────────
  "Thé vert":          "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85",
  "Thé à la menthe":   "https://images.pexels.com/photos/824201/pexels-photo-824201.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Thé Lipton":        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85",
  "Thé aux amandes":   "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85",
  "Thé aux pignons":   "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85",
  "Thé elbey":         "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85",

  // ── Choco chaud ──────────────────────────────────────────────────────────────
  "Choco latte":                   "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=85",
  "Choco banane":                  "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=85",
  "Chocolat chaud aux fruits secs":"https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=85",
  "Chocolat chaud":                "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=85",
  "Chocolat glacé":                "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Ice Coffee ───────────────────────────────────────────────────────────────
  "Café frappé":              "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Frappuccino":              "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Frappuccino speculos":     "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=85",
  "Frappuccino oreo":         "https://images.pexels.com/photos/27658446/pexels-photo-27658446.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Frappuccino nutella":      "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?auto=format&fit=crop&w=800&q=85",
  "Frappuccino nutella banane":"https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?auto=format&fit=crop&w=800&q=85",
  "Café latte caramel":       "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=85",
  "Biscoff latte":            "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=85",
  "Café pistacho":            "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?auto=format&fit=crop&w=800&q=85",

  // ── Jus frais ────────────────────────────────────────────────────────────────
  "Citronnade":                   "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=85",
  "Citronnade aux amandes":       "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=85",
  "Citronnade à la menthe frais": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=85",
  "Citronnade + boule de glace":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=85",
  "Jus d'orange":                 "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=800&q=85",
  "Jus de fraise frais":          "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=800&q=85",
  "Jus de kiwi":                  "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Jus de mangue frais":          "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Jus ananas":                   "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Lait de poule":                "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=85",

  // ── Mixture Juice ────────────────────────────────────────────────────────────
  "Jus banane datte":   "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Jus fraise banane":  "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=800&q=85",
  "Jus kiwi fraise":    "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Jus orange banane":  "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=800&q=85",
  "Jus fraise citron":  "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=800&q=85",
  "Jus kiwi banane":    "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Cocktail douja":     "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Smoothie ─────────────────────────────────────────────────────────────────
  "Smoothie fruits bois":         "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Smoothie fraise banane":       "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=800&q=85",
  "Smoothie fruits exotique":     "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Glaces ───────────────────────────────────────────────────────────────────
  "Glaces 2 boules":             "https://images.pexels.com/photos/36576776/pexels-photo-36576776.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Glaces 2 boules fruits secs": "https://images.pexels.com/photos/36576776/pexels-photo-36576776.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Glaces 3 boules":             "https://images.pexels.com/photos/36576776/pexels-photo-36576776.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Glaces 3 boules fruits secs": "https://images.pexels.com/photos/36576776/pexels-photo-36576776.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Banana split":                "https://images.pexels.com/photos/36576776/pexels-photo-36576776.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Banana split spécial":        "https://images.pexels.com/photos/36576776/pexels-photo-36576776.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Banana split fruits secs":    "https://images.pexels.com/photos/36576776/pexels-photo-36576776.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Milk Shake ───────────────────────────────────────────────────────────────
  "Milk shake kinder":    "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Milk shake oreo":      "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Milk shake nutella":   "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Milk shake banane":    "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Milk shake aux fruits":"https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Milk shake spéculoos": "https://images.pexels.com/photos/14662100/pexels-photo-14662100.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Fresh Drink ──────────────────────────────────────────────────────────────
  "Indien":      "https://images.pexels.com/photos/8504563/pexels-photo-8504563.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Hawaï":       "https://images.pexels.com/photos/8504563/pexels-photo-8504563.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Malibu":      "https://images.pexels.com/photos/8504563/pexels-photo-8504563.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Mimosa":      "https://images.pexels.com/photos/8504563/pexels-photo-8504563.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Caraïbes":    "https://images.pexels.com/photos/8504563/pexels-photo-8504563.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Blue drink":  "https://images.pexels.com/photos/8504563/pexels-photo-8504563.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Cinderella":  "https://images.pexels.com/photos/8504563/pexels-photo-8504563.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Blue planet": "https://images.pexels.com/photos/8504563/pexels-photo-8504563.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Maldiva":     "https://images.pexels.com/photos/8504563/pexels-photo-8504563.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Mojito ───────────────────────────────────────────────────────────────────
  "Mojito Coca":        "https://images.pexels.com/photos/7259054/pexels-photo-7259054.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Mojito Fraise":      "https://images.pexels.com/photos/36630839/pexels-photo-36630839.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Mojito Apple":       "https://images.pexels.com/photos/7259054/pexels-photo-7259054.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Mojito Virgin":      "https://images.pexels.com/photos/7259054/pexels-photo-7259054.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Mojito Piña Colada": "https://images.pexels.com/photos/8504563/pexels-photo-8504563.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Mojito Kiwi":        "https://images.pexels.com/photos/7259054/pexels-photo-7259054.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Mojito Framboise":   "https://images.pexels.com/photos/36630839/pexels-photo-36630839.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Mojito Melon":       "https://images.pexels.com/photos/7259054/pexels-photo-7259054.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Mojito Cerise":      "https://images.pexels.com/photos/36630839/pexels-photo-36630839.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Mojito Énergisant":  "https://images.pexels.com/photos/36630839/pexels-photo-36630839.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Crêpe Sucrée ─────────────────────────────────────────────────────────────
  "Crêpe Chocolat":                  "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=85",
  "Crêpe Chocolat fruits secs":      "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=85",
  "Crêpe Chocolat banane":           "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=85",
  "Crêpe Chocolat Oreo":             "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=85",
  "Crêpe Chocolat banane fruits secs":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=85",
  "Crêpe Chocolat spéculoos":        "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=85",
  "Crêpe Chocolat Gaucho":           "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=85",
  "Crêpe pistacho":                  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=85",
  "Crêpe Makis":                     "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=85",

  // ── Crêpe Salée ──────────────────────────────────────────────────────────────
  "Crêpe thon fromage":     "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=85",
  "Crêpe jambon fromage":   "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=85",
  "Crêpe thon œuf fromage": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=85",
  "Crêpe poulet":           "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=85",
  "Crêpe pizza":            "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=85",
  "Crêpe texas":            "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=85",

  // ── Gaufre ───────────────────────────────────────────────────────────────────
  "Gaufre chocolat":                  "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=85",
  "Gaufre chocolat fruits secs":      "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=85",
  "Gaufre chocolat banane":           "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=85",
  "Gaufre chocolat banane fruits secs":"https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=85",
  "Gaufre douja":                     "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=85",

  // ── Pancake ──────────────────────────────────────────────────────────────────
  "Pancake chocolat":             "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Pancake chocolat banane":      "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Pancake chocolat fruits secs": "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Pancake chocolat spécial":     "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Pain Perdu ───────────────────────────────────────────────────────────────
  "Pain perdu caramel": "https://images.unsplash.com/photo-1484723091739-30990093a517?auto=format&fit=crop&w=800&q=85",
  "Pain perdu banana":  "https://images.unsplash.com/photo-1484723091739-30990093a517?auto=format&fit=crop&w=800&q=85",
  "Pain perdu choco":   "https://images.unsplash.com/photo-1484723091739-30990093a517?auto=format&fit=crop&w=800&q=85",

  // ── Panini ───────────────────────────────────────────────────────────────────
  "Panini thon fromage":   "https://images.pexels.com/photos/5555754/pexels-photo-5555754.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Panini jambon fromage": "https://images.pexels.com/photos/5555754/pexels-photo-5555754.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Croque ───────────────────────────────────────────────────────────────────
  "Croque monsieur": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=85",
  "Croque madame":   "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=85",

  // ── Open Toast ───────────────────────────────────────────────────────────────
  "Planche avocat": "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?auto=format&fit=crop&w=800&q=85",
  "Planche saumon": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=85",

  // ── Sandwich ─────────────────────────────────────────────────────────────────
  "Libanais escalope / thon": "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?auto=format&fit=crop&w=800&q=85",
  "Libanais kabeb":           "https://images.unsplash.com/photo-1561651823-d363931a0dd3?auto=format&fit=crop&w=800&q=85",
  "Baguette farcie":          "https://images.pexels.com/photos/34593400/pexels-photo-34593400.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Makloub escalope":         "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?auto=format&fit=crop&w=800&q=85",

  // ── Omelette ─────────────────────────────────────────────────────────────────
  "Omelette":           "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=85",
  "Omelette chevrette": "https://images.pexels.com/photos/19615790/pexels-photo-19615790.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Hamburger ────────────────────────────────────────────────────────────────
  "Cheeseburger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85",
  "Big cheese":   "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85",

  // ── Menus Enfants ─────────────────────────────────────────────────────────────
  "Kids 1":      "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=85",
  "Kids 2":      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=85",
  "Kids 3":      "https://images.pexels.com/photos/116738/pexels-photo-116738.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Kids Food 1": "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=85",
  "Kids Food 2": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85",
  "Box Food":    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85",

  // ── Pizza ─────────────────────────────────────────────────────────────────────
  "Pizza Végétarienne": "https://images.unsplash.com/photo-1548369937-47519962c11a?auto=format&fit=crop&w=800&q=85",
  "Pizza Neptune":      "https://images.unsplash.com/photo-1639397753197-bab733459943?auto=format&fit=crop&w=800&q=85",
  "Pizza Pepperoni":    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=85",
  "Pizza Mexicaine":    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=85",
  "Pizza 4 Saisons":    "https://images.unsplash.com/photo-1652036315072-fd8af2d0a684?auto=format&fit=crop&w=800&q=85",
  "Pizza 4 Fromages":   "https://images.unsplash.com/photo-1762631179015-e8e8239f0ecf?auto=format&fit=crop&w=800&q=85",
  "Pizza Fruits de Mer":"https://images.unsplash.com/photo-1677643612263-49e89efd5345?auto=format&fit=crop&w=800&q=85",
  "Pizza Burrata":      "https://images.unsplash.com/photo-1548369937-47519962c11a?auto=format&fit=crop&w=800&q=85",

  // ── Salades ──────────────────────────────────────────────────────────────────
  "Salade burrata":    "https://images.pexels.com/photos/8879386/pexels-photo-8879386.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Salade césar":      "https://images.pexels.com/photos/5639372/pexels-photo-5639372.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Salade fruits de mer":"https://images.pexels.com/photos/19615790/pexels-photo-19615790.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Salade mechouia":   "https://images.pexels.com/photos/6169446/pexels-photo-6169446.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Salade asiatique":  "https://images.pexels.com/photos/5639372/pexels-photo-5639372.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Pasta ─────────────────────────────────────────────────────────────────────
  "Spaghetti carbonara":    "https://images.pexels.com/photos/116738/pexels-photo-116738.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Spaghetti fruits de mer":"https://images.pexels.com/photos/31235404/pexels-photo-31235404.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Spaghetti puttanesca":   "https://images.pexels.com/photos/116738/pexels-photo-116738.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Pasta 4 fromages":       "https://images.pexels.com/photos/116738/pexels-photo-116738.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Penne pesto":            "https://images.pexels.com/photos/116738/pexels-photo-116738.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Spaghetti bolognaise":   "https://images.pexels.com/photos/116738/pexels-photo-116738.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Lasagne bolognaise":     "https://images.pexels.com/photos/16845653/pexels-photo-16845653.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Penne sauce blanche":    "https://images.pexels.com/photos/31235404/pexels-photo-31235404.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Penne poulet":           "https://images.pexels.com/photos/116738/pexels-photo-116738.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Riz fruit de mer":       "https://images.pexels.com/photos/31235404/pexels-photo-31235404.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Les Grillées ─────────────────────────────────────────────────────────────
  "Chich taouk":           "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Plat oriental":         "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Kebab royale":          "https://images.unsplash.com/photo-1561651823-d363931a0dd3?auto=format&fit=crop&w=800&q=85",
  "Grillade mixte":        "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Grillade fruits de mer":"https://images.pexels.com/photos/19615790/pexels-photo-19615790.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Saveurs de l'océan":    "https://images.pexels.com/photos/19615790/pexels-photo-19615790.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Le royal oriental":     "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Plats ─────────────────────────────────────────────────────────────────────
  "Escalope grillé":              "https://images.pexels.com/photos/10394213/pexels-photo-10394213.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Escalope panée":               "https://images.pexels.com/photos/6419716/pexels-photo-6419716.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Escalope cordon bleu":         "https://images.pexels.com/photos/12349437/pexels-photo-12349437.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Escalope sauce champignon":    "https://images.pexels.com/photos/10394213/pexels-photo-10394213.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Émincés de poulet":            "https://images.pexels.com/photos/10394213/pexels-photo-10394213.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Chevrette sautée à l'ail":     "https://images.pexels.com/photos/19615790/pexels-photo-19615790.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Escalope 4 fromages":          "https://images.pexels.com/photos/10394213/pexels-photo-10394213.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Poulet Farcie":                "https://images.pexels.com/photos/10394213/pexels-photo-10394213.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Souris d'agneau":              "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Filet grillé":                 "https://images.pexels.com/photos/10394213/pexels-photo-10394213.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Filet sauce champignons":      "https://images.pexels.com/photos/10394213/pexels-photo-10394213.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Filet mignon aux crevettes":   "https://images.pexels.com/photos/19615790/pexels-photo-19615790.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Tounsi TN ────────────────────────────────────────────────────────────────
  "Sandwich thon":         "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?auto=format&fit=crop&w=800&q=85",
  "Kefteji tunisien":      "https://images.pexels.com/photos/30144276/pexels-photo-30144276.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Makrouna fel au viande":"https://images.pexels.com/photos/116738/pexels-photo-116738.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Poisson grillé":        "https://images.pexels.com/photos/19615790/pexels-photo-19615790.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Eja mergaz / escalope": "https://images.pexels.com/photos/30144276/pexels-photo-30144276.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Mokli mergaz":          "https://images.pexels.com/photos/30144276/pexels-photo-30144276.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Eja fruit de mer":      "https://images.pexels.com/photos/30144276/pexels-photo-30144276.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Dessert ───────────────────────────────────────────────────────────────────
  "Tiramisu":           "https://images.pexels.com/photos/28835214/pexels-photo-28835214.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Gâteaux":            "https://images.pexels.com/photos/36590618/pexels-photo-36590618.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Cheesecake":         "https://images.pexels.com/photos/28835214/pexels-photo-28835214.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Fondant au chocolat":"https://images.pexels.com/photos/27819688/pexels-photo-27819688.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Jwajem":             "https://images.pexels.com/photos/11182255/pexels-photo-11182255.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Assiette de fruits": "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Boissons ─────────────────────────────────────────────────────────────────
  "Soda":            "https://images.pexels.com/photos/5860659/pexels-photo-5860659.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Boga menthe":     "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=85",
  "Eau minérale":    "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=85",
  "Eau plate":       "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=85",
  "Eau gazéifiée":   "https://images.pexels.com/photos/18212879/pexels-photo-18212879.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Shark / Redbull": "https://images.pexels.com/photos/5860659/pexels-photo-5860659.jpeg?auto=compress&cs=tinysrgb&w=800",

  // ── Chicha ───────────────────────────────────────────────────────────────────
  "Chicha Pomme":       "https://images.unsplash.com/photo-1566207474742-de921626ad0c?auto=format&fit=crop&w=800&q=85",
  "Chicha Cerise":      "https://images.unsplash.com/photo-1566207474742-de921626ad0c?auto=format&fit=crop&w=800&q=85",
  "Chicha Menthe":      "https://images.unsplash.com/photo-1566207474742-de921626ad0c?auto=format&fit=crop&w=800&q=85",
  "Chicha Prestige":    "https://images.unsplash.com/photo-1566207474742-de921626ad0c?auto=format&fit=crop&w=800&q=85",
  "Chicha Bonbon":      "https://images.unsplash.com/photo-1566207474742-de921626ad0c?auto=format&fit=crop&w=800&q=85",
  "Chicha Raisin":      "https://images.unsplash.com/photo-1566207474742-de921626ad0c?auto=format&fit=crop&w=800&q=85",
  "Chicha Love":        "https://images.unsplash.com/photo-1566207474742-de921626ad0c?auto=format&fit=crop&w=800&q=85",
  "Chicha Sheik Money": "https://images.unsplash.com/photo-1566207474742-de921626ad0c?auto=format&fit=crop&w=800&q=85",
  "Jebbed":             "https://images.unsplash.com/photo-1566207474742-de921626ad0c?auto=format&fit=crop&w=800&q=85",
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
      folder:        "douja-lounge",
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

  const adminEmail = "owner@douja-lounge.tn";
  const adminHash  = await bcrypt.hash("DoujaLounge@2026", 12);
  const adminRes   = await users.findOneAndUpdate(
    { email: adminEmail },
    {
      $set: {
        name: "Douja Lounge Owner",
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
    { slug: "douja-lounge" },
    {
      $set: {
        ownerId,
        name:              "Douja Lounge",
        slug:              "douja-lounge",
        establishmentType: "restaurant",
        tagline:           "L'art de recevoir",
        description:       "Douja Lounge — un espace élégant où saveurs du monde se rencontrent dans une atmosphère chaleureuse. Café, cuisine internationale, grillades, chicha et bien plus.",
        phone:             "21787000",
        address:           "Tunisie",
        instagram:         "https://www.instagram.com/douja_lounge/",
        facebook:          "https://www.facebook.com/DOUJALounge",
        tiktok:            "https://www.tiktok.com/@doujalounge",
        googleMapsUrl:     "",
        logo:              progress["logo"] || "",
        coverImage:        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=90",
        primaryColor:      "#1a0a00",
        secondaryColor:    "#c9a96e",
        currency:          "DT",
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
    { key: "cafe",         name: "Café",             sortOrder: 1  },
    { key: "nespresso",    name: "Italian Coffee",   sortOrder: 2  },
    { key: "the",          name: "Thé",              sortOrder: 3  },
    { key: "choco",        name: "Choco chaud",      sortOrder: 4  },
    { key: "ice_coffee",   name: "Ice Coffee",       sortOrder: 5  },
    { key: "jus",          name: "Jus frais",        sortOrder: 6  },
    { key: "mix_jus",      name: "Mixture Juice",    sortOrder: 7  },
    { key: "smoothie",     name: "Smoothie",         sortOrder: 8  },
    { key: "glaces",       name: "Glaces",           sortOrder: 9  },
    { key: "milkshake",    name: "Milk Shake",       sortOrder: 10 },
    { key: "fresh_drink",  name: "Fresh Drink",      sortOrder: 11 },
    { key: "mojito",       name: "Mojito",           sortOrder: 12 },
    { key: "crepe_sucree", name: "Crêpe Sucrée",     sortOrder: 13 },
    { key: "crepe_salee",  name: "Crêpe Salée",      sortOrder: 14 },
    { key: "gaufre",       name: "Gaufre",           sortOrder: 15 },
    { key: "pancake",      name: "Pancake",          sortOrder: 16 },
    { key: "pain_perdu",   name: "Pain Perdu",       sortOrder: 17 },
    { key: "panini",       name: "Panini",           sortOrder: 18 },
    { key: "croque",       name: "Croque",           sortOrder: 19 },
    { key: "open_toast",   name: "Open Toast",       sortOrder: 20 },
    { key: "sandwich",     name: "Sandwich",         sortOrder: 21 },
    { key: "omelette",     name: "Omelette",         sortOrder: 22 },
    { key: "hamburger",    name: "Hamburger",        sortOrder: 23 },
    { key: "kids",         name: "Menus Enfants",    sortOrder: 24 },
    { key: "pizza",        name: "Pizza",            sortOrder: 25 },
    { key: "salades",      name: "Salades",          sortOrder: 26 },
    { key: "pasta",        name: "Pasta",            sortOrder: 27 },
    { key: "grillees",     name: "Les Grillées",     sortOrder: 28 },
    { key: "plats",        name: "Plats",            sortOrder: 29 },
    { key: "tounsi",       name: "Tounsi TN",        sortOrder: 30 },
    { key: "dessert",      name: "Dessert",          sortOrder: 31 },
    { key: "boissons",     name: "Boissons",         sortOrder: 32 },
    { key: "chicha",       name: "Chicha",           sortOrder: 33 },
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
    // Café (regular)
    "Express":            { c: "cafe", p: 4.5,  b: "",          d: "Expresso classique" },
    "Café américain":     { c: "cafe", p: 5,    b: "",          d: "Café long, doux et équilibré" },
    "Capucin":            { c: "cafe", p: 5,    b: "",          d: "Expresso allongé au lait chaud" },
    "Direct":             { c: "cafe", p: 6,    b: "",          d: "Café fort servi directement" },
    "Direct spécial":     { c: "cafe", p: 8,    b: "",          d: "Direct enrichi, préparation maison" },
    "Cappuccino":         { c: "cafe", p: 10,   b: "Populaire", d: "Expresso, lait vapeur, mousse onctueuse" },
    "Cappuccino spécial": { c: "cafe", p: 12,   b: "",          d: "Cappuccino maison avec garniture" },
    "Café turc":          { c: "cafe", p: 10,   b: "Signature", d: "Café turc traditionnel préparé à la cezve" },
    "Chocolat au lait":   { c: "cafe", p: 5,    b: "",          d: "Lait chaud au chocolat" },
    "Nescafé au lait":    { c: "cafe", p: 6,    b: "",          d: "Nescafé au lait chaud" },

    // Italian Coffee (Nespresso)
    "Nespresso Expresso":           { c: "nespresso", p: 6,  b: "",          d: "Expresso Nespresso intense" },
    "Nespresso Expresso macchiato": { c: "nespresso", p: 7,  b: "",          d: "Expresso Nespresso, nuage de mousse" },
    "Nespresso Direct":             { c: "nespresso", p: 8,  b: "",          d: "Café long Nespresso" },
    "Nespresso Cappuccino":         { c: "nespresso", p: 11, b: "Populaire", d: "Cappuccino Nespresso, mousse veloutée" },

    // Thé
    "Thé vert":        { c: "the", p: 4,  b: "",          d: "Thé vert nature" },
    "Thé à la menthe": { c: "the", p: 5,  b: "Populaire", d: "Thé à la menthe fraîche" },
    "Thé Lipton":      { c: "the", p: 5,  b: "",          d: "Thé Lipton à l'eau minérale" },
    "Thé aux amandes": { c: "the", p: 9,  b: "",          d: "Thé aux amandes grillées" },
    "Thé aux pignons": { c: "the", p: 12, b: "Signature", d: "Thé aux pignons de pin" },
    "Thé elbey":       { c: "the", p: 15, b: "Signature", d: "Thé elbey aux fruits secs" },

    // Choco chaud
    "Choco latte":                   { c: "choco", p: 12, b: "Populaire", d: "Chocolat chaud, lait, mousse, chantilly" },
    "Choco banane":                  { c: "choco", p: 15, b: "",          d: "Chocolat chaud, banane, chantilly" },
    "Chocolat chaud aux fruits secs":{ c: "choco", p: 15, b: "",          d: "Chocolat chaud garni de fruits secs" },
    "Chocolat chaud":                { c: "choco", p: 10, b: "",          d: "Chocolat chaud onctueux" },
    "Chocolat glacé":                { c: "choco", p: 12, b: "",          d: "Chocolat froid avec glace" },

    // Ice Coffee
    "Café frappé":              { c: "ice_coffee", p: 10, b: "",          d: "Expresso, boule de glace, caramel" },
    "Frappuccino":              { c: "ice_coffee", p: 12, b: "Populaire", d: "Expresso, boule de glace, caramel, chantilly" },
    "Frappuccino speculos":     { c: "ice_coffee", p: 15, b: "",          d: "Expresso, boule de glace, caramel, spéculoos, chantilly" },
    "Frappuccino oreo":         { c: "ice_coffee", p: 15, b: "",          d: "Expresso, boule de glace, oreo, chantilly" },
    "Frappuccino nutella":      { c: "ice_coffee", p: 15, b: "",          d: "Expresso, boule de glace, nutella, chantilly" },
    "Frappuccino nutella banane":{ c: "ice_coffee", p: 18, b: "Signature", d: "Expresso, boule de glace, nutella, banane, chantilly" },
    "Café latte caramel":       { c: "ice_coffee", p: 10, b: "",          d: "Expresso, mousse de lait, sauce caramel" },
    "Biscoff latte":            { c: "ice_coffee", p: 15, b: "Nouveau",   d: "Lotos, lait, expresso, mousse de lait" },
    "Café pistacho":            { c: "ice_coffee", p: 15, b: "Nouveau",   d: "Pâte pistache, café, lait" },

    // Jus frais
    "Citronnade":                   { c: "jus", p: 9,  b: "",          d: "Citron pressé maison" },
    "Citronnade aux amandes":       { c: "jus", p: 14, b: "",          d: "Citronnade enrichie d'amandes" },
    "Citronnade à la menthe frais": { c: "jus", p: 12, b: "Populaire", d: "Citronnade à la menthe fraîche" },
    "Citronnade + boule de glace":  { c: "jus", p: 12, b: "",          d: "Citronnade avec boule de glace" },
    "Jus d'orange":                 { c: "jus", p: 10, b: "",          d: "Oranges pressées fraîches" },
    "Jus de fraise frais":          { c: "jus", p: 12, b: "Populaire", d: "Fraises fraîches mixées" },
    "Jus de kiwi":                  { c: "jus", p: 14, b: "",          d: "Kiwis frais" },
    "Jus de mangue frais":          { c: "jus", p: 14, b: "",          d: "Mangue fraîche" },
    "Jus ananas":                   { c: "jus", p: 14, b: "",          d: "Ananas frais" },
    "Lait de poule":                { c: "jus", p: 15, b: "Signature", d: "Lait de poule maison" },

    // Mixture Juice
    "Jus banane datte":  { c: "mix_jus", p: 17, b: "",          d: "Banane et datte mixés" },
    "Jus fraise banane": { c: "mix_jus", p: 17, b: "Populaire", d: "Fraise et banane" },
    "Jus kiwi fraise":   { c: "mix_jus", p: 17, b: "",          d: "Kiwi et fraise" },
    "Jus orange banane": { c: "mix_jus", p: 17, b: "",          d: "Orange et banane" },
    "Jus fraise citron": { c: "mix_jus", p: 17, b: "",          d: "Fraise et citron" },
    "Jus kiwi banane":   { c: "mix_jus", p: 17, b: "",          d: "Kiwi et banane" },
    "Cocktail douja":    { c: "mix_jus", p: 20, b: "Signature", d: "Banane, datte, fruits secs, chantilly" },

    // Smoothie
    "Smoothie fruits bois":   { c: "smoothie", p: 16, b: "",          d: "Fruits des bois mixés" },
    "Smoothie fraise banane": { c: "smoothie", p: 16, b: "Populaire", d: "Fraise et banane" },
    "Smoothie fruits exotique":{ c: "smoothie", p: 16, b: "",         d: "Fruits exotiques mixés" },

    // Glaces
    "Glaces 2 boules":             { c: "glaces", p: 9,  b: "",          d: "2 boules au choix" },
    "Glaces 2 boules fruits secs": { c: "glaces", p: 12, b: "",          d: "2 boules garnies de fruits secs" },
    "Glaces 3 boules":             { c: "glaces", p: 11, b: "Populaire", d: "3 boules au choix" },
    "Glaces 3 boules fruits secs": { c: "glaces", p: 14, b: "",          d: "3 boules garnies de fruits secs" },
    "Banana split":                { c: "glaces", p: 14, b: "",          d: "Banane, 3 boules au choix, chantilly" },
    "Banana split spécial":        { c: "glaces", p: 16, b: "Signature", d: "Banana split avec toppings maison" },
    "Banana split fruits secs":    { c: "glaces", p: 20, b: "",          d: "Banana split, 3 boules aux fruits secs" },

    // Milk Shake
    "Milk shake kinder":    { c: "milkshake", p: 16, b: "",          d: "Milkshake au Kinder" },
    "Milk shake oreo":      { c: "milkshake", p: 16, b: "Populaire", d: "Milkshake aux biscuits Oreo" },
    "Milk shake nutella":   { c: "milkshake", p: 16, b: "",          d: "Milkshake au Nutella" },
    "Milk shake banane":    { c: "milkshake", p: 16, b: "",          d: "Milkshake à la banane" },
    "Milk shake aux fruits":{ c: "milkshake", p: 16, b: "",          d: "Milkshake aux fruits de saison" },
    "Milk shake spéculoos": { c: "milkshake", p: 16, b: "",          d: "Milkshake au spéculoos" },

    // Fresh Drink
    "Indien":      { c: "fresh_drink", p: 15, b: "",          d: "Citronnade, grenadine, arôme, glaçon" },
    "Hawaï":       { c: "fresh_drink", p: 15, b: "Populaire", d: "Limonade, jus ananas, sirop grenadine" },
    "Malibu":      { c: "fresh_drink", p: 15, b: "",          d: "Jus d'ananas, menthe verte, glaçon" },
    "Mimosa":      { c: "fresh_drink", p: 15, b: "",          d: "Ananas, banane, menthe verte" },
    "Caraïbes":    { c: "fresh_drink", p: 15, b: "",          d: "Banane, citron, menthe verte" },
    "Blue drink":  { c: "fresh_drink", p: 15, b: "Nouveau",   d: "Schweppes agrume, limonade, colorant bleu, menthe" },
    "Cinderella":  { c: "fresh_drink", p: 15, b: "",          d: "Orange, ananas, goutte de limonade" },
    "Blue planet": { c: "fresh_drink", p: 15, b: "",          d: "Sprite, citron, noix de coco, arôme bleu" },
    "Maldiva":     { c: "fresh_drink", p: 15, b: "",          d: "Pastèque, menthe verte" },

    // Mojito
    "Mojito Coca":        { c: "mojito", p: 15, b: "",          d: "Citron, menthe verte, arôme, glaçon, coca" },
    "Mojito Fraise":      { c: "mojito", p: 15, b: "Populaire", d: "Fraise, menthe verte, arôme, glaçon" },
    "Mojito Apple":       { c: "mojito", p: 15, b: "",          d: "Pomme, menthe verte, arôme, glaçon" },
    "Mojito Virgin":      { c: "mojito", p: 15, b: "",          d: "Sprite, menthe, citron" },
    "Mojito Piña Colada": { c: "mojito", p: 17, b: "Signature", d: "Menthe verte, citron, ananas" },
    "Mojito Kiwi":        { c: "mojito", p: 15, b: "",          d: "Kiwi, menthe verte, glaçon" },
    "Mojito Framboise":   { c: "mojito", p: 17, b: "",          d: "Menthe verte, citron, sprite, arôme framboise" },
    "Mojito Melon":       { c: "mojito", p: 15, b: "",          d: "Melon, menthe verte, citron" },
    "Mojito Cerise":      { c: "mojito", p: 15, b: "",          d: "Menthe verte, citron, sprite, arôme cerise" },
    "Mojito Énergisant":  { c: "mojito", p: 20, b: "Signature", d: "Red Bull, menthe verte, arôme, glaçon" },

    // Crêpe Sucrée
    "Crêpe Chocolat":                  { c: "crepe_sucree", p: 10, b: "",          d: "Crêpe au chocolat" },
    "Crêpe Chocolat fruits secs":      { c: "crepe_sucree", p: 14, b: "",          d: "Chocolat et fruits secs" },
    "Crêpe Chocolat banane":           { c: "crepe_sucree", p: 15, b: "Populaire", d: "Chocolat et banane fraîche" },
    "Crêpe Chocolat Oreo":             { c: "crepe_sucree", p: 14, b: "",          d: "Chocolat et biscuits Oreo" },
    "Crêpe Chocolat banane fruits secs":{ c: "crepe_sucree", p: 18, b: "Signature", d: "Chocolat, banane et fruits secs" },
    "Crêpe Chocolat spéculoos":        { c: "crepe_sucree", p: 14, b: "",          d: "Chocolat et spéculoos" },
    "Crêpe Chocolat Gaucho":           { c: "crepe_sucree", p: 14, b: "",          d: "Crêpe Chocolat Gaucho maison" },
    "Crêpe pistacho":                  { c: "crepe_sucree", p: 20, b: "Nouveau",   d: "Beurre de pistache, Nutella" },
    "Crêpe Makis":                     { c: "crepe_sucree", p: 20, b: "Signature", d: "Banane, Nutella, pistache roulés" },

    // Crêpe Salée
    "Crêpe thon fromage":     { c: "crepe_salee", p: 15, b: "",          d: "Thon et fromage fondu" },
    "Crêpe jambon fromage":   { c: "crepe_salee", p: 15, b: "",          d: "Jambon et fromage fondu" },
    "Crêpe thon œuf fromage": { c: "crepe_salee", p: 17, b: "Populaire", d: "Thon, œuf et fromage fondu" },
    "Crêpe poulet":           { c: "crepe_salee", p: 18, b: "",          d: "Sauce blanche, fromage, poulet grillé" },
    "Crêpe pizza":            { c: "crepe_salee", p: 18, b: "",          d: "Sauce tomate, thon, olive, mozzarella" },
    "Crêpe texas":            { c: "crepe_salee", p: 18, b: "Signature", d: "Viande hachée, fromage, piment vert caramélisé" },

    // Gaufre
    "Gaufre chocolat":                   { c: "gaufre", p: 12, b: "",          d: "Gaufre au chocolat" },
    "Gaufre chocolat fruits secs":       { c: "gaufre", p: 15, b: "",          d: "Chocolat et fruits secs" },
    "Gaufre chocolat banane":            { c: "gaufre", p: 15, b: "Populaire", d: "Chocolat et banane fraîche" },
    "Gaufre chocolat banane fruits secs":{ c: "gaufre", p: 17, b: "",          d: "Chocolat, banane et fruits secs" },
    "Gaufre douja":                      { c: "gaufre", p: 20, b: "Signature", d: "Fruits frais, fruits secs, boule de glace" },

    // Pancake
    "Pancake chocolat":             { c: "pancake", p: 12, b: "",          d: "Pancake moelleux au chocolat" },
    "Pancake chocolat banane":      { c: "pancake", p: 15, b: "Populaire", d: "Chocolat et banane" },
    "Pancake chocolat fruits secs": { c: "pancake", p: 15, b: "",          d: "Chocolat et fruits secs" },
    "Pancake chocolat spécial":     { c: "pancake", p: 18, b: "Signature", d: "Pancake spécial maison" },

    // Pain Perdu
    "Pain perdu caramel": { c: "pain_perdu", p: 12, b: "",          d: "Caramel, miel, glace" },
    "Pain perdu banana":  { c: "pain_perdu", p: 16, b: "Populaire", d: "Caramel, miel, banane, glace" },
    "Pain perdu choco":   { c: "pain_perdu", p: 20, b: "Signature", d: "Caramel, Nutella, banane, glace" },

    // Panini
    "Panini thon fromage":   { c: "panini", p: 12, b: "",          d: "Panini au thon et fromage fondu" },
    "Panini jambon fromage": { c: "panini", p: 12, b: "Populaire", d: "Panini au jambon et fromage fondu" },

    // Croque
    "Croque monsieur": { c: "croque", p: 12, b: "",          d: "Sauce fromage, laitue, jambon, mozzarella" },
    "Croque madame":   { c: "croque", p: 12, b: "Populaire", d: "Sauce fromage, laitue, thon, mozzarella" },

    // Open Toast
    "Planche avocat": { c: "open_toast", p: 29, b: "Signature", d: "Toast œufs brouillés, toast champignon goûta, toast avocat tomate cerise" },
    "Planche saumon": { c: "open_toast", p: 29, b: "Signature", d: "Toast fromage œuf dur, toast goûta saumon, toast tomate basilic roquette" },

    // Sandwich
    "Libanais escalope / thon": { c: "sandwich", p: 14, b: "",          d: "Pain libanais, escalope ou thon" },
    "Libanais kabeb":           { c: "sandwich", p: 16, b: "Populaire", d: "Pain libanais au kebab" },
    "Baguette farcie":          { c: "sandwich", p: 17, b: "",          d: "Baguette farcie garnie" },
    "Makloub escalope":         { c: "sandwich", p: 15, b: "",          d: "Pain makloub à l'escalope" },

    // Omelette
    "Omelette":           { c: "omelette", p: 18, b: "Populaire", d: "Thon, fromage, frite" },
    "Omelette chevrette": { c: "omelette", p: 24, b: "Signature", d: "Omelette aux crevettes" },

    // Hamburger
    "Cheeseburger": { c: "hamburger", p: 14, b: "",          d: "Burger classique au fromage" },
    "Big cheese":   { c: "hamburger", p: 18, b: "Populaire", d: "Double burger au fromage" },

    // Menus Enfants
    "Kids 1":      { c: "kids", p: 14, b: "",          d: "Nuggets + frite + soda" },
    "Kids 2":      { c: "kids", p: 16, b: "Populaire", d: "Mini pizza + frite + soda" },
    "Kids 3":      { c: "kids", p: 18, b: "",          d: "Penne au poulet sauce rouge + frite + soda" },
    "Kids Food 1": { c: "kids", p: 27, b: "",          d: "Cheeseburger + nuggets + 2 frites + 2 sodas (2 enfants)" },
    "Kids Food 2": { c: "kids", p: 30, b: "",          d: "2 Cheeseburger + 2 frites + 2 sodas (2 enfants)" },
    "Box Food":    { c: "kids", p: 60, b: "Signature", d: "2 Big cheese + 2 Libanais escalope + soda 1L (4 personnes)" },

    // Pizza
    "Pizza Végétarienne": { c: "pizza", p: 20, b: "",          d: "Fromage, légumes frais" },
    "Pizza Neptune":      { c: "pizza", p: 20, b: "Populaire", d: "Sauce tomate, thon, fromage, olive" },
    "Pizza Pepperoni":    { c: "pizza", p: 20, b: "",          d: "Sauce tomate, fromage, pepperoni" },
    "Pizza Mexicaine":    { c: "pizza", p: 30, b: "",          d: "Viande hachée, légumes, mozzarella" },
    "Pizza 4 Saisons":    { c: "pizza", p: 22, b: "",          d: "Sauce tomate, fromage, jambon, olive, champignon" },
    "Pizza 4 Fromages":   { c: "pizza", p: 27, b: "Signature", d: "Crème fraîche, mozzarella, gruyère, roquefort, scilien" },
    "Pizza Fruits de Mer":{ c: "pizza", p: 30, b: "Signature", d: "Pizza aux fruits de mer" },
    "Pizza Burrata":      { c: "pizza", p: 27, b: "Nouveau",   d: "Légumes, burrata, basilic" },

    // Salades
    "Salade burrata":    { c: "salades", p: 25, b: "Signature", d: "Laitue, tomate, burrata, basilic" },
    "Salade césar":      { c: "salades", p: 20, b: "Populaire", d: "Salade césar classique" },
    "Salade fruits de mer":{ c: "salades", p: 30, b: "Signature", d: "Fruits de mer sur lit de salade" },
    "Salade mechouia":   { c: "salades", p: 15, b: "",          d: "Salade tunisienne mechouia" },
    "Salade asiatique":  { c: "salades", p: 30, b: "",          d: "Fruits, crevettes, tomate, laitue" },

    // Pasta
    "Spaghetti carbonara":    { c: "pasta", p: 27, b: "Populaire", d: "Spaghetti à la carbonara" },
    "Spaghetti fruits de mer":{ c: "pasta", p: 35, b: "Signature", d: "Spaghetti aux fruits de mer" },
    "Spaghetti puttanesca":   { c: "pasta", p: 27, b: "",          d: "Spaghetti puttanesca" },
    "Pasta 4 fromages":       { c: "pasta", p: 27, b: "",          d: "Pasta aux 4 fromages" },
    "Penne pesto":            { c: "pasta", p: 35, b: "Nouveau",   d: "Penne au pesto" },
    "Spaghetti bolognaise":   { c: "pasta", p: 27, b: "",          d: "Spaghetti bolognaise" },
    "Lasagne bolognaise":     { c: "pasta", p: 27, b: "",          d: "Lasagne à la bolognaise" },
    "Penne sauce blanche":    { c: "pasta", p: 35, b: "Signature", d: "Penne sauce blanche, saumon et crevettes" },
    "Penne poulet":           { c: "pasta", p: 27, b: "",          d: "Penne au poulet, sauce rosée ou rouge" },
    "Riz fruit de mer":       { c: "pasta", p: 35, b: "Signature", d: "Riz aux fruits de mer" },

    // Les Grillées
    "Chich taouk":           { c: "grillees", p: 27, b: "Populaire", d: "Brochettes de poulet mariné" },
    "Plat oriental":         { c: "grillees", p: 29, b: "",          d: "Assortiment de grillades orientales" },
    "Kebab royale":          { c: "grillees", p: 35, b: "Signature", d: "Kebab à la pistache et fromage" },
    "Grillade mixte":        { c: "grillees", p: 50, b: "Signature", d: "Assortiment de viandes grillées" },
    "Grillade fruits de mer":{ c: "grillees", p: 59, b: "Signature", d: "Fruits de mer grillés" },
    "Saveurs de l'océan":    { c: "grillees", p: 95, b: "Signature", d: "Variétés de fruits de mer + riz (2 personnes)" },
    "Le royal oriental":     { c: "grillees", p: 95, b: "Signature", d: "Variétés de grillades orientales (2 personnes)" },

    // Plats
    "Escalope grillé":           { c: "plats", p: 25, b: "",          d: "Escalope de poulet grillée" },
    "Escalope panée":            { c: "plats", p: 27, b: "Populaire", d: "Escalope panée dorée" },
    "Escalope cordon bleu":      { c: "plats", p: 29, b: "",          d: "Escalope cordon bleu farcie" },
    "Escalope sauce champignon": { c: "plats", p: 32, b: "",          d: "Escalope en sauce champignon" },
    "Émincés de poulet":         { c: "plats", p: 32, b: "",          d: "Émincés de poulet à l'orientale" },
    "Chevrette sautée à l'ail":  { c: "plats", p: 32, b: "Signature", d: "Crevettes sautées à l'ail" },
    "Escalope 4 fromages":       { c: "plats", p: 40, b: "Signature", d: "Escalope sauce champignon aux 4 fromages" },
    "Poulet Farcie":             { c: "plats", p: 40, b: "",          d: "Poulet farci riz, goûta, épinard" },
    "Souris d'agneau":           { c: "plats", p: 60, b: "Signature", d: "Souris d'agneau mijotée" },
    "Filet grillé":              { c: "plats", p: 45, b: "",          d: "Filet de bœuf grillé" },
    "Filet sauce champignons":   { c: "plats", p: 55, b: "Signature", d: "Filet en sauce champignon, roquefort ou poivre" },
    "Filet mignon aux crevettes":{ c: "plats", p: 60, b: "Signature", d: "Filet mignon aux crevettes" },

    // Tounsi TN
    "Sandwich thon":          { c: "tounsi", p: 14, b: "",          d: "كسكروت تن — sandwich au thon tunisien" },
    "Kefteji tunisien":       { c: "tounsi", p: 20, b: "Populaire", d: "كفتاجي تونسي — kebda, mergez" },
    "Makrouna fel au viande": { c: "tounsi", p: 29, b: "",          d: "مقرونة فل باللحم — pasta tunisienne" },
    "Poisson grillé":         { c: "tounsi", p: 29, b: "",          d: "حوت مشوي — daurade ou loup grillé" },
    "Eja mergaz / escalope":  { c: "tounsi", p: 25, b: "Signature", d: "عجة مرقاز/سكالوب — omelette merguez" },
    "Mokli mergaz":           { c: "tounsi", p: 25, b: "",          d: "Mokli aux merguez frits" },
    "Eja fruit de mer":       { c: "tounsi", p: 35, b: "Signature", d: "عجة غلال البحر — omelette fruits de mer" },

    // Dessert
    "Tiramisu":           { c: "dessert", p: 15, b: "Populaire", d: "Tiramisu maison" },
    "Gâteaux":            { c: "dessert", p: 15, b: "",          d: "Gâteaux du jour" },
    "Cheesecake":         { c: "dessert", p: 15, b: "Populaire", d: "Cheesecake maison" },
    "Fondant au chocolat":{ c: "dessert", p: 15, b: "Signature", d: "Fondant au chocolat coulant" },
    "Jwajem":             { c: "dessert", p: 20, b: "Signature", d: "Jwajem aux fruits secs" },
    "Assiette de fruits": { c: "dessert", p: 35, b: "",          d: "Assiette de fruits frais de saison (2 personnes)" },

    // Boissons
    "Soda":            { c: "boissons", p: 5,   b: "",          d: "Soda au choix" },
    "Boga menthe":     { c: "boissons", p: 8,   b: "",          d: "Boga à la menthe" },
    "Eau minérale":    { c: "boissons", p: 2.5, b: "",          d: "Eau minérale 0,5 L" },
    "Eau plate":       { c: "boissons", p: 5,   b: "",          d: "Eau plate 1 L" },
    "Eau gazéifiée":   { c: "boissons", p: 5,   b: "",          d: "Eau pétillante" },
    "Shark / Redbull": { c: "boissons", p: 12,  b: "",          d: "Shark ou Red Bull énergisant" },

    // Chicha
    "Chicha Pomme":       { c: "chicha", p: 15, b: "",          d: "Chicha fekher goût pomme" },
    "Chicha Cerise":      { c: "chicha", p: 15, b: "",          d: "Chicha fekher goût cerise" },
    "Chicha Menthe":      { c: "chicha", p: 15, b: "",          d: "Chicha fekher goût menthe" },
    "Chicha Bonbon":      { c: "chicha", p: 15, b: "",          d: "Chicha fekher goût bonbon" },
    "Chicha Raisin":      { c: "chicha", p: 15, b: "",          d: "Chicha fekher goût raisin" },
    "Chicha Prestige":    { c: "chicha", p: 25, b: "Signature", d: "Chicha prestige avec assiette de fruits" },
    "Chicha Love":        { c: "chicha", p: 15, b: "",          d: "Chicha Love" },
    "Chicha Sheik Money": { c: "chicha", p: 15, b: "",          d: "Chicha Sheik Money" },
    "Jebbed":             { c: "chicha", p: 15, b: "",          d: "Jebbed traditionnel" },
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
      $set: { restaurantId, targetUrl: "http://localhost:3000/menu/douja-lounge", qrImageUrl: "", updatedAt: now },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  );

  await mongoose.disconnect();
  console.log("\n✅ Done! Douja Lounge seeded with real images.");
  console.log("   Login:     owner@douja-lounge.tn / DoujaLounge@2026");
  console.log("   Menu:      http://localhost:3000/menu/douja-lounge");
  console.log("   Instagram: https://www.instagram.com/douja_lounge/");
  console.log("   Facebook:  https://www.facebook.com/DOUJALounge");
  console.log("   TikTok:    https://www.tiktok.com/@doujalounge\n");
}

run().catch(async (err) => {
  console.error("❌", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
