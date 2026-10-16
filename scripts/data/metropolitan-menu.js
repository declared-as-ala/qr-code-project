// Métropolitan menu data. Source: owner-provided list (names already cleaned).
// p(name, prices, imageId?, description?)
//   prices: number            -> single plain price
//           [[size, price],…] -> one product per size, named "<name> <size>"
const BASE = "https://backendv2.e-shkoon.com/uploads/menu_details/";
const p = (name, prices, img, description) => ({
  name,
  prices: typeof prices === "number" ? [["Standard", prices]] : prices,
  image: img ? `${BASE}${img}.png` : "",
  description: description || "",
});

const RESTAURANT = {
  name: "Métropolitan",
  slug: "metropolitan",
  establishmentType: "cafe",
  logo: "https://backendv2.e-shkoon.com/uploads/menus/1713524321969.png",
  logoAlt: "https://backendv2.e-shkoon.com/uploads/menus/1725457819193.png",
  coverImage: "https://backendv2.e-shkoon.com/uploads/menus/1714517920112.png",
};

const categories = [
  { order: 1, name: "Classics", products: [
    p("Espresso", 3.5, "1714551947713"),
    p("Latte", 4.5, "1714551551299"),
    p("Espresso machiato", 4.0, "1714551877896"),
    p("Americano", 4.5, "1714551670182"),
    p("Eau", 1.5, "1714552097473"),
  ]},
  { order: 2, name: "Petit-déjeuner", products: [
    p("Petit Dejeuner Express", 8.5, "1714551502728", "café classics/viennoiserie/jus ou eau"),
    p("Petit déjeuner Sweet", 9.5, "1714577363810", "café classics/cake ou brownie ou cookies/ jus ou eau"),
    p("Petit déjeuner Tonic", 12.5, "1714577772500", "Café classics/Granola/jus ou eau"),
    p("Petit déjeuner Salé", 10.5, "1714634595926", "café classics/croissant salé/jus ou eau"),
    p("Petit déjeuner Gourmand", 13.0, "1714578009245", "Café classics/viennoiserie/omelette/jus ou eau"),
    p("Granola", 8.0, "1714578983237"),
    p("Petit dejeuner pancakes", 14.0, null, "café+jus+pancakes"),
    p("Petit déjeuner protéiné", 16.0, null, "café + jus +toast protéiné"),
  ]},
  { order: 3, name: "Illy", products: [
    p("Latte illy", 6.5, "1714551970145"),
    p("Espresso illy", 5.5, "1714551897529"),
    p("Espresso machiato illy", 6.5, "1714584026767"),
    p("Americano illy", 6.5, "1714551931521"),
  ]},
  { order: 4, name: "Teas", products: [
    p("Thé infusion", 5.0),
    p("Ice tea", [["M", 6.0], ["L", 8.0]], "1714572019348"),
  ]},
  { order: 5, name: "Flavored Coffee", products: [
    p("Nutty Latte", 7.0, "1714572127665"),
    p("Latte Pistache", 8.5, "1714572165258"),
    p("Latte double chocolat", 7.5, "1714572188970"),
    p("Latte noisettes", 8.5, "1714572215642"),
    p("Latte speculos", 8.5, "1714572233239"),
    p("Caramel machiato", 7.0, "1714572083931"),
    p("Cookies latte", 7.0, "1714572102615"),
  ]},
  { order: 6, name: "Frappuccino", products: [
    p("Frappuccino Caramel", [["M", 9.5], ["L", 11.5]], "1714661901686"),
    p("Frappuccino Cookies mocha", [["M", 10.0], ["L", 12.0]], "1714508609980"),
    p("Frappuccino mocha", [["M", 9.5], ["L", 11.5]], "1714572408877"),
  ]},
  { order: 7, name: "JUS", products: [
    p("Fraise", 5.5),
    p("Citronnade", 4.0),
    p("JUS D ORANGE", 5.5, "1714572428166"),
    p("Tekiwi", 9.0),
    p("Pina colada", 9.0),
  ]},
  { order: 8, name: "Smoothies", products: [
    p("Smoothie pomme menthe citron", 9.0, "1714634409977"),
    p("Smoothie pèche abricot ananas", 9.0, "1714661241289"),
    p("Smoothie fraise orange banane", 9.0, "1714661420144"),
    p("Smoothie ananas menthe citron gingembre", 9.0, "1714661399307"),
    p("Smoothie pomme fraise banane", 9.0, "1714572680101"),
    p("Smoothie fruits rouge hibiscus cerise", 10.0, "1714572718674"),
    p("Smoothie pèche banane mangue", 10.0, "1714661183844"),
  ]},
  { order: 9, name: "Milk Shake", products: [
    p("Milkshake Vanille fraise banane", [["M", 9.0], ["L", 10.5]], "1714661489581"),
    p("Milkshake Vanille banane", [["M", 9.5], ["L", 11.5]], "1714572606352"),
    p("Milkshake Toffee banane", [["M", 9.5], ["L", 11.5]], "1714572539386"),
    p("Milkshake Vanille", [["M", 8.0], ["L", 9.5]], "1714572566553"),
    p("Milkshake Oreo", [["M", 9.0], ["L", 11.0]], "1714579667442"),
    p("Milkshake Spéculos", [["M", 9.0], ["L", 11.0]], "1714579722498"),
  ]},
  { order: 10, name: "Iced Lemonade", products: [
    p("Blue Lemonade", [["M", 8.5], ["L", 10.0]], "1714551647447"),
    p("Pink Lemonade", [["M", 8.5], ["L", 10.0]], "1714572284194"),
  ]},
  { order: 11, name: "Hot Chocolate", products: [
    p("Chocolat chaud", 6.5, "1714572254469"),
  ]},
  { order: 12, name: "ICED", products: [
    p("Ice latte", 5.5, "1714661546015"),
    p("Ice americano", [["S", 6.0], ["M", 7.0], ["L", 8.0]], "1714661571576"),
    p("Ice latte caramel", [["S", 7.5], ["M", 9.0], ["L", 10.5]], "1714661597026"),
    p("Ice latte Noisette", [["S", 7.5], ["M", 9.0], ["L", 10.5]], "1714661620091"),
    p("Ice latte cookie", [["S", 7.5], ["M", 9.0], ["L", 10.5]], "1714661632646"),
    p("Ice latte Mocha", [["S", 7.5], ["M", 9.0], ["L", 10.5]], "1714661653842"),
    p("Ice latte Cookies Mocha", [["S", 7.5], ["M", 9.0], ["L", 10.5]], "1714661667897"),
    p("Ice latte double chocolat", [["S", 7.5], ["M", 9.0], ["L", 10.5]], "1714661684627"),
    p("Iced latte matcha", 8.5, null, "matcha"),
  ]},
  { order: 13, name: "Choco Sake", products: [
    p("Chocolat", [["M", 10.0], ["L", 12.0]], "1714572311271"),
    p("Fraise chocolat", [["M", 10.5], ["L", 12.5]], "1714572342521"),
    p("Chocolat banane", [["M", 11.0], ["L", 13.0]], "1714572363883"),
    p("Chocolat vanille", [["M", 10.0], ["L", 12.0]], "1714572384301"),
    p("Shake hyper protéiné", 15.0, null, "whey, banane ,amande , graine de courge,avoine, beurre de cacahouète"),
  ]},
  { order: 14, name: "Refreshers", products: [
    p("Mangue", [["M", 9.0], ["L", 11.0]], "1714661298912"),
    p("Fraise", [["M", 8.0], ["L", 10.0]], "1714661720016"),
    p("Fruit de la passion", [["M", 9.0], ["L", 11.0]], "1714661736430"),
  ]},
  { order: 15, name: "Cannette", products: [
    p("Coca cola zero", 3.5, "1714552178043"),
    p("Coca cola", 3.5, "1714552051704"),
    p("Orangina", 3.5, "1714552233269"),
    p("Shweppes lemon", 3.5, "1714552314393"),
    p("Shweppes tonic", 3.5, "1714552336078"),
    p("Fanta", 3.5, "1714552404603"),
    p("Boga", 3.5, "1714552480316"),
    p("Heineken sans alcool", 6.0, "1714572447505"),
    p("Boga cidre", 3.5, "1714552255107"),
    p("Apla", 3.5, "1714552448084"),
  ]},
  { order: 16, name: "Oeufs", products: [
    p("Omelette nature", 7.5, "1714552525987"),
    p("Oeufs Brouilles", 7.5, "1714582119646"),
    p("Oeufs Bendicte", 7.5, "1714584476806"),
    p("Oeufs au plat", 7.5, "1714751959493"),
  ]},
  { order: 17, name: "Salades", products: [
    p("Salade Cesar", 14.0, "1714552558347"),
    p("Salade Italienne", 15.0, "1714552582085"),
    p("Niçoise", 17.0, "1714552701776"),
  ]},
  { order: 18, name: "Sandwichs", products: [
    p("Sandwich Thon", 7.0, "1714552626353"),
    p("Club Sandwich", 8.0, "1714552816300"),
    p("Hot dog", 3.0, "1714552643682"),
    p("Sandwich jambon", 7.0, "1714552672190"),
    p("Sandwich poulet", 7.0, "1714552606758"),
    p("Wrap poulet", 8.0, "1714552723740"),
    p("Panini viande hachée", 11.0, "1714552784199"),
    p("Croissant salé", 5.0, "1714552804860"),
    p("Wrap Jambon", 8.0, "1714552845073"),
    p("Panini poulet/Thon/jambon", 8.0, "1714553078538"),
  ]},
  { order: 19, name: "Toast", products: [
    p("Bruschetta new-yorkaise", 11.5, "1714552825182"),
    p("Toast protéine", 11.5, "1731670561598", "Pain de campagne,fromage blanc,Des œufs brouillés bacon ou poulet"),
    p("Toast mexicaine", 12.0, "1731686336665", "pain complet ,mélange poulet ,grana ,roquette, sauce italienne"),
    p("Toast avocat bacon", 13.0, null, "pain complet crème d'avocat bacon œuf poche"),
    p("Toast saumon", 17.0, "1731686051157", "pain complet crème d'avocat saumon œuf poche roquette"),
    p("Toast protéiné boutargue", 12.0, null, "pain complet œuf brouilles boutargue"),
  ]},
  { order: 20, name: "Crépes /pancakes", products: [
    p("Crépe Nutella Banane", 13.5),
    p("Crépe Caramel spéculos", 12.0),
    p("Pancake Nutella", 10.5),
    p("Pancake caramel", 10.0),
    p("Pancake Sirop d'erable", 10.0),
    p("Crépe jambon Fromage", 10.5, "1714553491581"),
    p("Crépes Nutella", 10.5, "1714553467453"),
    p("Crépe Thon fromage", 10.5, "1714553479145"),
  ]},
  { order: 21, name: "Recettes Sucrées", products: [
    p("Orange cake", 3.0, "1714553132449"),
    p("Gateaux Cookies", 8.0),
    p("Tarte citron", 6.0, "1714552884794"),
    p("Tiramisu", 11.0, "1714552898288"),
    p("Gateau snickers", 8.0, "1714552919060"),
    p("Cheesecake", 10.0, "1714552871782"),
    p("Fondant chocolat", 5.0, "1714553051628"),
    p("Cookies", 5.0, "1714553108696"),
    p("Gateau Grand-mére", 8.0, "1714553145411"),
    p("Fondant snickers", 6.0, "1714553159661"),
    p("Courant d'air", 5.0, "1714553179922"),
    p("Cinnamon Rolls", 6.0, "1714553344426"),
    p("Brownie", 5.0, "1714553319547"),
    p("Carrot cake", 5.0, "1714553407539"),
    p("Amandine", 5.0, "1714553444356"),
    p("Donuts", 5.0, "1714577125565"),
    p("Beignet", 5.0),
  ]},
];

// Supplements are NOT products: they are attached to the products they apply to
// and shown as small "+ extra" lines under them.
// category -> { targets: product names, items: [label, price] }[]
const supplements = {
  "Classics": [{ targets: ["Espresso", "Latte", "Espresso machiato", "Americano"], items: [["Shot", 1.5], ["Arôme", 1.0]] }],
  "Illy": [{ targets: ["Latte illy", "Espresso illy", "Espresso machiato illy", "Americano illy"], items: [["Shot", 2.5], ["Arôme", 2.0]] }],
  "Petit-déjeuner": [{ targets: ["Petit Dejeuner Express", "Petit déjeuner Gourmand"], items: [["Cake au lieu de viennoiserie", 2.0]] }],
  "Hot Chocolate": [{ targets: ["Chocolat chaud"], items: [["Caramel", 2.0], ["Orange", 2.0], ["Noisette", 2.0], ["Cannelle", 2.0]] }],
  "Oeufs": [{ targets: ["Omelette nature", "Oeufs Brouilles", "Oeufs Bendicte", "Oeufs au plat"], items: [["Champignons", 3.0], ["Thon", 3.0], ["Jambon", 2.0], ["Bacon/poulet", 3.0]] }],
};

module.exports = { RESTAURANT, categories, supplements };
