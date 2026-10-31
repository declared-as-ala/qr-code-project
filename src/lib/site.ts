const rawSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.clickmenu.tn").replace(/\/+$/, "");

// Always normalize bare https://clickmenu.tn to https://www.clickmenu.tn because Vercel
// serves the production site on www.clickmenu.tn and 308-redirects the apex domain.
export const SITE_URL =
  rawSiteUrl === "https://clickmenu.tn" || rawSiteUrl === "http://clickmenu.tn"
    ? "https://www.clickmenu.tn"
    : rawSiteUrl;

export const SITE_NAME = "ClickMenu";
export const WHATSAPP_NUMBER = "21697991266";
export const WHATSAPP_DISPLAY = "+216 97 991 266";
export const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

export function buildWhatsAppUrl(message?: string): string {
  if (!message) return WHATSAPP_BASE;
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
}

export const HOME_TITLE = "Menu digital en Tunisie : QR code pour café & restaurant";
export const HOME_DESCRIPTION =
  "ClickMenu crée votre menu digital en Tunisie : menu QR code pour café, restaurant et salon de thé, mis à jour en temps réel, sans application. En ligne en 48h.";

// Known duplicate/alias slugs in the database that should remain functional for physical QR scans
// but canonicalize to the primary establishment slug and stay out of sitemap.xml.
export const DUPLICATE_SLUG_CANONICALS: Record<string, string> = {
  elgrotte: "coffee-elgrotte",
  "coffe-elgrotte": "coffee-elgrotte",
};

export interface VerifiedClientExample {
  slug: string;
  name: string;
  type: "Café & Lounge" | "Restaurant" | "Fast-Food & Burger" | "Pâtisserie & Brunch";
  city: string;
  highlight: string;
  logo?: string;
}

// Verified live partner menus hosted on ClickMenu (no invented ratings or fictional venues).
export const VERIFIED_PARTNER_EXAMPLES: VerifiedClientExample[] = [
  {
    slug: "metropolitan",
    name: "Metropolitan",
    type: "Café & Lounge",
    city: "Tunisie",
    highlight: "Carte complète petit-déjeuner, cafés, boissons fraîches, crêpes et plats avec navigation rapide par catégories.",
  },
  {
    slug: "oliva-nera",
    name: "Oliva Nera",
    type: "Restaurant",
    city: "Tunisie",
    highlight: "Menu digital gastronomique avec antipasti, pizzas, pâtes fraîches, viandes et poissons présentés avec photos HD.",
    logo: "/logos/olivera.jpeg",
  },
  {
    slug: "big-a-food",
    name: "Big A Food",
    type: "Fast-Food & Burger",
    city: "Tunisie",
    highlight: "Carte street-food et burgers avec suppléments, formules, boissons et visuels appétissants optimisés sur mobile.",
  },
  {
    slug: "maison-nael",
    name: "Maison Nael",
    type: "Pâtisserie & Brunch",
    city: "Tunisie",
    highlight: "Menu digital raffiné mettant en valeur pâtisseries fines, viennoiseries, brunchs et boissons chaudes.",
    logo: "/logos/manel.png",
  },
  {
    slug: "douja-lounge",
    name: "Douja Lounge",
    type: "Café & Lounge",
    city: "Tunisie",
    highlight: "Carte digitale pensée pour le service en salle et en terrasse : cocktails sans alcool, cafés, douceurs et chicha.",
  },
  {
    slug: "maliks-restolounge",
    name: "Malik's RestoLounge",
    type: "Restaurant",
    city: "Tunisie",
    highlight: "Menu resto-lounge structuré pour accélérer la prise de commande aux heures de pointe du déjeuner et du dîner.",
    logo: "/logos/maliks.jpg",
  },
  {
    slug: "cheese-steak",
    name: "Cheese Steak",
    type: "Fast-Food & Burger",
    city: "Tunisie",
    highlight: "Carte digitale rapide à consulter sur smartphone avec personnalisation des sandwichs, tailles et accompagnements.",
    logo: "/logos/cheese-steak.svg",
  },
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Qu’est-ce qu’un menu digital QR code pour restaurant ou café ?",
    a: "Un menu digital est une carte interactive consultable sur smartphone. Le client scanne un QR code posé sur la table avec l’appareil photo de son téléphone et votre carte s’ouvre immédiatement dans son navigateur web, sans télécharger d’application.",
  },
  {
    q: "Comment créer un menu digital en Tunisie avec ClickMenu ?",
    a: "Envoyez-nous simplement votre carte actuelle (photo, PDF ou liste Excel) sur WhatsApp au +216 97 991 266. Notre équipe crée vos catégories, intègre vos plats, prix en dinars (DT) et photos, puis vous livre votre lien dédié et vos QR codes en 48 heures.",
  },
  {
    q: "Combien coûte un menu digital en Tunisie par rapport aux menus papier ?",
    a: "Réimprimer 30 à 50 cartes papier plastifiées à chaque changement de prix coûte plusieurs centaines de dinars. Avec ClickMenu, vous disposez d’une formule claire adaptée à la taille de votre établissement et vous modifiez vos prix en dinars gratuitement et à l’infini depuis votre téléphone.",
  },
  {
    q: "Mes clients doivent-ils télécharger une application mobile ?",
    a: "Non, jamais. Le menu s’ouvre directement dans Safari ou Chrome dès que le client pointe l’appareil photo de son iPhone ou smartphone Android vers le QR code. Le chargement est optimisé pour les réseaux 4G et Wi-Fi en Tunisie.",
  },
  {
    q: "Puis-je modifier mes prix ou masquer un plat en rupture de stock moi-même ?",
    a: "Oui. Depuis votre tableau de bord ClickMenu (accessible sur téléphone ou ordinateur), vous changez un tarif en DT, ajoutez un plat du jour ou désactivez un produit en rupture de stock en 5 secondes. La mise à jour est immédiate sur toutes vos tables.",
  },
  {
    q: "Proposez-vous les supports QR code imprimés (bois, acrylique, stickers) ?",
    a: "Oui. Nous concevons et livrons partout en Tunisie des supports de table durables : chevalets en bois gravé au laser, plaques en acrylique avec votre logo, ou autocollants laminés résistants à l’eau, au nettoyage quotidien et au soleil en terrasse.",
  },
  {
    q: "Comment faire pour les clients qui préfèrent encore demander au serveur ?",
    a: "Le menu QR code ne remplace pas l’hospitalité tunisienne : il libère vos serveurs des allers-retours pour distribuer les cartes. Vous pouvez conserver 2 ou 3 cartes papier de secours tout en digitalisant 95 % des consultations à table.",
  },
  {
    q: "Peut-on avoir un menu digital multilingue (Français, Arabe, Anglais) ?",
    a: "Oui. Pour les établissements situés dans des zones touristiques ou d’affaires (Tunis, La Marsa, Gammarth, Hammamet, Sousse, Monastir, Djerba), nous structurons votre carte pour accueillir aussi bien la clientèle locale qu’internationale.",
  },
];
