export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://clickmenu.tn").replace(/\/+$/, "");
export const SITE_NAME = "ClickMenu";

export const HOME_TITLE = "Menu digital en Tunisie : QR code pour café & restaurant";
export const HOME_DESCRIPTION =
  "ClickMenu crée votre menu digital en Tunisie : menu QR code pour café et restaurant, mis à jour en temps réel, sans application. En ligne en 48h. Demandez une démo.";

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Qu’est-ce qu’un menu digital ?",
    a: "Un menu digital est une carte de café ou de restaurant consultable sur smartphone. Le client scanne un QR code posé sur la table et la carte s’ouvre dans son navigateur, sans application ni inscription.",
  },
  {
    q: "Comment avoir un menu digital en Tunisie avec ClickMenu ?",
    a: "Contactez-nous sur WhatsApp. Nous intégrons vos catégories, plats, photos et prix, puis nous vous remettons votre lien et votre QR code. Votre menu est en ligne en 48 heures.",
  },
  {
    q: "Mes clients doivent-ils installer une application ?",
    a: "Non. Le menu s’ouvre directement depuis l’appareil photo du téléphone, sur n’importe quel smartphone.",
  },
  {
    q: "Puis-je modifier mes prix et mes plats moi-même ?",
    a: "Oui. Depuis votre tableau de bord, vous modifiez prix, photos, catégories et disponibilité des produits, et le changement est visible immédiatement pour vos clients.",
  },
  {
    q: "Le menu QR convient-il aux cafés et aux restaurants ?",
    a: "Oui. ClickMenu est pensé pour les cafés, restaurants, salons de thé, lounges et pâtisseries en Tunisie, avec des catégories, des tailles de boissons et des suppléments.",
  },
  {
    q: "Proposez-vous des supports QR imprimés ?",
    a: "Oui : cartes de table en bois gravé, acrylique ou autocollants laminés, avec le QR code de votre menu.",
  },
];
