export type EnseigneType = "cafe" | "restaurant";
export type Badge = "nouveau" | "populaire" | "promo" | "signature";

export interface Owner {
  name: string;
  email: string;
}

export interface Enseigne {
  id: string;
  name: string;
  slug: string;
  type: EnseigneType;
  active: boolean;
  logo: string;
  cover: string;
  phone: string;
  address: string;
  mapsLink: string;
  primaryColor: string;
  secondaryColor: string;
  owner: Owner;
  socials: { instagram?: string; facebook?: string; tiktok?: string; whatsapp?: string };
  scans: number;
  createdAt: string;
  rating: number;
  isOpen: boolean;
}

export interface Category {
  id: string;
  enseigneId: string;
  name: string;
  order: number;
}

export interface Product {
  id: string;
  enseigneId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: Badge;
  available: boolean;
  featured: boolean;
}

const COVER_CAFE =
  "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1600&q=80";
const COVER_RESTO =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80";
const COVER_BISTROT =
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80";

export const enseignes: Enseigne[] = [
  {
    id: "ens_1",
    name: "El Grotte",
    slug: "elgrotte",
    type: "restaurant",
    active: true,
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=EG&backgroundColor=1a1a1a&textColor=c9a24b",
    cover: COVER_RESTO,
    phone: "+212 6 12 34 56 78",
    address: "12 Rue des Oliviers, Marrakech",
    mapsLink: "https://maps.google.com",
    primaryColor: "#1a1a1a",
    secondaryColor: "#c9a24b",
    owner: { name: "Karim Bennani", email: "karim@elgrotte.ma" },
    socials: {
      instagram: "elgrotte",
      facebook: "elgrotte",
      whatsapp: "+212612345678",
    },
    scans: 4823,
    createdAt: "2025-09-12",
    rating: 4.8,
    isOpen: true,
  },
  {
    id: "ens_2",
    name: "Café Lumière",
    slug: "cafelumiere",
    type: "cafe",
    active: true,
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=CL&backgroundColor=1a1a1a&textColor=c9a24b",
    cover: COVER_CAFE,
    phone: "+212 6 22 11 33 44",
    address: "8 Avenue Mohammed V, Casablanca",
    mapsLink: "https://maps.google.com",
    primaryColor: "#2b1d12",
    secondaryColor: "#d4a574",
    owner: { name: "Sofia El Amrani", email: "sofia@cafelumiere.ma" },
    socials: { instagram: "cafelumiere", whatsapp: "+212622113344" },
    scans: 2150,
    createdAt: "2025-10-04",
    rating: 4.6,
    isOpen: true,
  },
  {
    id: "ens_3",
    name: "Le Petit Bistrot",
    slug: "lepetitbistrot",
    type: "restaurant",
    active: true,
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=PB&backgroundColor=1a1a1a&textColor=c9a24b",
    cover: COVER_BISTROT,
    phone: "+212 5 24 33 22 11",
    address: "45 Boulevard Hassan II, Rabat",
    mapsLink: "https://maps.google.com",
    primaryColor: "#1a1a1a",
    secondaryColor: "#b8862f",
    owner: { name: "Yassine Tazi", email: "yassine@petitbistrot.ma" },
    socials: { instagram: "petitbistrot", facebook: "petitbistrot" },
    scans: 1289,
    createdAt: "2026-01-22",
    rating: 4.7,
    isOpen: false,
  },
  {
    id: "ens_4",
    name: "Mocha & Co",
    slug: "mochaco",
    type: "cafe",
    active: false,
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=MC&backgroundColor=1a1a1a&textColor=c9a24b",
    cover: COVER_CAFE,
    phone: "+212 6 99 88 77 66",
    address: "3 Rue de la Liberté, Tanger",
    mapsLink: "https://maps.google.com",
    primaryColor: "#1a1a1a",
    secondaryColor: "#c9a24b",
    owner: { name: "Nadia Benali", email: "nadia@mochaco.ma" },
    socials: {},
    scans: 642,
    createdAt: "2026-02-14",
    rating: 4.4,
    isOpen: false,
  },
  {
    id: "ens_5",
    name: "L'Atelier",
    slug: "latelier",
    type: "restaurant",
    active: true,
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=LA&backgroundColor=1a1a1a&textColor=c9a24b",
    cover: COVER_RESTO,
    phone: "+212 5 22 44 55 66",
    address: "27 Corniche, Casablanca",
    mapsLink: "https://maps.google.com",
    primaryColor: "#1a1a1a",
    secondaryColor: "#d4af37",
    owner: { name: "Mehdi Cherkaoui", email: "mehdi@latelier.ma" },
    socials: { instagram: "latelier", whatsapp: "+212522445566" },
    scans: 3421,
    createdAt: "2026-03-08",
    rating: 4.9,
    isOpen: true,
  },
];

export const categories: Category[] = [
  { id: "cat_1", enseigneId: "ens_1", name: "Entrées", order: 1 },
  { id: "cat_2", enseigneId: "ens_1", name: "Plats principaux", order: 2 },
  { id: "cat_3", enseigneId: "ens_1", name: "Desserts", order: 3 },
  { id: "cat_4", enseigneId: "ens_1", name: "Boissons", order: 4 },
  { id: "cat_5", enseigneId: "ens_1", name: "Cocktails signature", order: 5 },
];

const IMG = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=800&q=80`;

export const products: Product[] = [
  {
    id: "p1", enseigneId: "ens_1", categoryId: "cat_1",
    name: "Tartare de saumon",
    description: "Saumon frais, avocat, citron vert, huile d'olive et coriandre",
    price: 95, image: IMG("photo-1546069901-ba9599a7e63c"),
    badge: "signature", available: true, featured: true,
  },
  {
    id: "p2", enseigneId: "ens_1", categoryId: "cat_1",
    name: "Burrata crémeuse",
    description: "Burrata des Pouilles, tomates anciennes, basilic frais",
    price: 85, image: IMG("photo-1565299624946-b28f40a0ae38"),
    badge: "populaire", available: true, featured: false,
  },
  {
    id: "p3", enseigneId: "ens_1", categoryId: "cat_2",
    name: "Filet de bœuf grillé",
    description: "Filet de bœuf 220g, sauce poivre, pommes grenailles",
    price: 220, image: IMG("photo-1546833999-b9f581a1996d"),
    badge: "signature", available: true, featured: true,
  },
  {
    id: "p4", enseigneId: "ens_1", categoryId: "cat_2",
    name: "Risotto aux truffes",
    description: "Riz Carnaroli, parmesan, huile de truffe, copeaux de truffe noire",
    price: 165, image: IMG("photo-1476124369491-e7addf5db371"),
    badge: "nouveau", available: true, featured: false,
  },
  {
    id: "p5", enseigneId: "ens_1", categoryId: "cat_2",
    name: "Tagine d'agneau",
    description: "Agneau confit, pruneaux, amandes, semoule fine",
    price: 145, image: IMG("photo-1574484284002-952d92456975"),
    available: false, featured: false,
  },
  {
    id: "p6", enseigneId: "ens_1", categoryId: "cat_3",
    name: "Fondant au chocolat",
    description: "Cœur coulant, glace vanille de Madagascar",
    price: 65, image: IMG("photo-1606313564200-e75d5e30476c"),
    badge: "populaire", available: true, featured: false,
  },
  {
    id: "p7", enseigneId: "ens_1", categoryId: "cat_3",
    name: "Tarte au citron meringuée",
    description: "Pâte sablée, crème de citron, meringue italienne flambée",
    price: 55, image: IMG("photo-1519915028121-7d3463d20b13"),
    badge: "promo", available: true, featured: false,
  },
  {
    id: "p8", enseigneId: "ens_1", categoryId: "cat_4",
    name: "Café espresso",
    description: "Espresso italien, grain arabica torréfié maison",
    price: 18, image: IMG("photo-1510707577719-ae7c14805e3a"),
    available: true, featured: false,
  },
  {
    id: "p9", enseigneId: "ens_1", categoryId: "cat_4",
    name: "Thé à la menthe",
    description: "Thé vert, menthe fraîche, sucre de canne",
    price: 25, image: IMG("photo-1576092768241-dec231879fc3"),
    available: true, featured: false,
  },
  {
    id: "p10", enseigneId: "ens_1", categoryId: "cat_5",
    name: "Mojito Royal",
    description: "Rhum blanc, champagne, menthe, citron vert",
    price: 110, image: IMG("photo-1551024709-8f23befc6f87"),
    badge: "nouveau", available: true, featured: true,
  },
  {
    id: "p11", enseigneId: "ens_1", categoryId: "cat_5",
    name: "Old Fashioned",
    description: "Bourbon, sucre, angostura, zeste d'orange",
    price: 120, image: IMG("photo-1514362545857-3bc16c4c7d1b"),
    badge: "signature", available: true, featured: false,
  },
];

export const recentScansData = [
  { day: "Lun", scans: 320 }, { day: "Mar", scans: 480 },
  { day: "Mer", scans: 410 }, { day: "Jeu", scans: 590 },
  { day: "Ven", scans: 720 }, { day: "Sam", scans: 980 },
  { day: "Dim", scans: 850 },
];

export const monthlySignupsData = [
  { month: "Oct", count: 4 }, { month: "Nov", count: 7 },
  { month: "Déc", count: 9 }, { month: "Jan", count: 12 },
  { month: "Fév", count: 15 }, { month: "Mar", count: 18 },
  { month: "Avr", count: 22 }, { month: "Mai", count: 28 },
];

export function findEnseigneBySlug(slug: string) {
  return enseignes.find((e) => e.slug === slug);
}
