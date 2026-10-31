export interface CommercialPageSection {
  h2: string;
  intro: string;
  bullets?: { title: string; text: string }[];
  callout?: { title: string; text: string; arabicNote?: string };
}

export interface CommercialComparisonRow {
  criterion: string;
  paperOrPdf: string;
  clickMenu: string;
}

export interface CommercialPageData {
  slug: string;
  path: string;
  shortLabel: string;
  badge: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  seoTitle: string;
  metaDescription: string;
  h1Highlight: string;
  h1Rest: string;
  arabicSubtitle?: string;
  heroLead: string;
  whatsappPrefill: string;
  keyBenefits: { title: string; description: string }[];
  sections: CommercialPageSection[];
  comparisonTitle: string;
  comparisonRows: CommercialComparisonRow[];
  featuredPartners: string[]; // slugs from VERIFIED_PARTNER_EXAMPLES
  relatedPageSlugs: string[];
  relatedBlogSlugs: string[];
  faqs: { q: string; a: string }[];
}

export const COMMERCIAL_PAGES: CommercialPageData[] = [
  {
    slug: "menu-qr-code-tunisie",
    path: "/menu-qr-code-tunisie",
    shortLabel: "Menu QR Code Tunisie",
    badge: "Solution QR Code #1 en Tunisie",
    primaryKeyword: "menu QR code tunisie",
    secondaryKeywords: [
      "qr code menu tunisie",
      "menu qr code tunis",
      "qr code table restaurant tunisie",
      "menu par scan qr tunisie",
    ],
    searchIntent: "Commercial / Recherche de fournisseur local de menu QR code en Tunisie",
    seoTitle: "Menu QR Code en Tunisie : Solution Clé en Main Cafés & Restaurants",
    metaDescription:
      "Passez au menu QR code en Tunisie avec ClickMenu. Carte interactive sur mobile sans application, supports bois ou acrylique et mise à jour des prix en DT en temps réel.",
    h1Highlight: "Menu QR code",
    h1Rest: "en Tunisie pour cafés et restaurants",
    arabicSubtitle: "منيو رقمي عبر رمز QR للمقاهي والمطاعم في تونس — بدون تطبيق وفي 48 ساعة",
    heroLead:
      "Offrez à vos clients à Tunis, Sousse, Sfax, Hammamet ou Djerba un accès instantané à votre carte par simple scan. Fini les menus papier usés et les réimpressions coûteuses à chaque changement de tarif.",
    whatsappPrefill:
      "Bonjour ClickMenu, je souhaite avoir une démo et un devis pour un menu QR code pour mon établissement en Tunisie.",
    keyBenefits: [
      {
        title: "Ouverture en moins d’une seconde sur 4G & Wi-Fi",
        description:
          "Contrairement aux fichiers PDF lourds, nos menus QR sont compressés et optimisés pour les réseaux mobiles tunisiens (Ooredoo, Orange, Tunisie Télécom).",
      },
      {
        title: "Modification des prix en Dinars (DT) à la seconde",
        description:
          "Ajustez vos tarifs au millime près, ajoutez un plat du jour ou masquez un produit épuisé directement depuis votre smartphone.",
      },
      {
        title: "Supports QR physiques livrés en Tunisie",
        description:
          "Chevalets en bois gravé, plaques acrylique personnalisées ou stickers laminés haute résistance pour vos tables en salle et en terrasse.",
      },
    ],
    sections: [
      {
        h2: "Pourquoi les établissements tunisiens adoptent le menu QR code",
        intro:
          "En Tunisie, la restauration et les cafés connaissent des heures de pointe intenses — le matin pour le café, à midi pour les déjeuners professionnels et le soir en terrasse. Attendre 10 minutes qu’un serveur apporte la carte freine la rotation des tables et réduit les commandes additionnelles.",
        bullets: [
          {
            title: "Consultation immédiate dès l’installation à table",
            text: "Le client scanne le QR code posé devant lui et choisit ses boissons ou ses plats avant même l’arrivée du serveur.",
          },
          {
            title: "Zéro frais de réimpression en imprimerie",
            text: "Lorsque le coût des matières premières évolue, vous mettez à jour vos prix en dinars tunisiens sans jeter vos cartes.",
          },
          {
            title: "Image moderne et hygiénique",
            text: "Plus de menus plastifiés cornés, tachés ou incomplets qui circulent de main en main toute la journée.",
          },
        ],
        callout: {
          title: "Service clé en main en 48 heures partout en Tunisie",
          text: "Que vous soyez au Lac, à La Marsa, Ennasr, Sousse, Monastir, Sfax ou Bizerte, notre équipe intègre l’intégralité de votre carte pour vous.",
          arabicNote: "فريقنا يتكفل بإدخال كافة الأطباق والأسعار والصور في أقل من 48 ساعة.",
        },
      },
      {
        h2: "Comment fonctionne le système de menu QR code ClickMenu ?",
        intro:
          "Nous avons conçu ClickMenu pour qu’il ne demande aucune compétence technique au gérant ni à l’équipe en salle.",
        bullets: [
          {
            title: "1. Intégration complète de votre carte",
            text: "Envoyez-nous la photo de votre ancien menu sur WhatsApp. Nous structurons vos catégories, descriptions, suppléments et visuels.",
          },
          {
            title: "2. Génération du QR code permanent",
            text: "Votre QR code est lié à votre adresse web dédiée. Même si vous changez 100 fois vos plats ou vos prix, le QR code imprimé sur vos tables ne change jamais.",
          },
          {
            title: "3. Tableau de bord gérant sur mobile",
            text: "Connectez-vous à votre espace sécurisé pour activer/désactiver un plat, changer une photo ou suivre le nombre de scans mensuels.",
          },
        ],
      },
    ],
    comparisonTitle: "Menu QR Code ClickMenu vs Menu PDF ou Carte Papier",
    comparisonRows: [
      {
        criterion: "Lecture sur smartphone",
        paperOrPdf: "Zoom difficile sur PDF, téléchargement lent sur 4G",
        clickMenu: "Interface mobile fluide avec recherche et filtres par catégorie",
      },
      {
        criterion: "Changement de prix en DT",
        paperOrPdf: "Réimpression obligatoire ou ratures au stylo",
        clickMenu: "Modification en 5 secondes depuis votre téléphone, visible tout de suite",
      },
      {
        criterion: "Gestion des ruptures de stock",
        paperOrPdf: "Le client commande puis le serveur annonce que le plat manque",
        clickMenu: "Bouton « Indisponible » en un clic pour éviter toute frustration",
      },
      {
        criterion: "Pérennité du QR code imprimé",
        paperOrPdf: "Le QR code change souvent si vous remplacez le fichier PDF",
        clickMenu: "QR code dynamique permanent : vos supports de table durent des années",
      },
    ],
    featuredPartners: ["metropolitan", "oliva-nera", "big-a-food"],
    relatedPageSlugs: ["prix-menu-digital-tunisie", "support-qr-code-restaurant", "menu-qr-code-sans-application"],
    relatedBlogSlugs: [
      "guide-complet-menu-digital-qr-code-tunisie",
      "pourquoi-eviter-menu-pdf-qr-code-restaurant",
      "combien-coute-menu-digital-tunisie-comparatif",
    ],
    faqs: [
      {
        q: "Est-ce que le QR code change quand je modifie mes prix ?",
        a: "Non, jamais. Votre QR code pointe vers votre adresse ClickMenu permanente. Toutes vos modifications de prix, de photos ou de plats sont immédiatement visibles sans toucher aux supports posés sur vos tables.",
      },
      {
        q: "Livrez-vous les supports QR code dans tous les gouvernorats de Tunisie ?",
        a: "Oui. Nous expédions vos chevalets en bois gravé, supports acrylique et autocollants laminés dans toute la Tunisie (Grand Tunis, Sahel, Sfax, Cap Bon, Nord et Sud).",
      },
      {
        q: "Combien de temps faut-il pour mettre mon menu QR code en ligne ?",
        a: "Votre menu digital est prêt et vérifié en 48 heures après réception de votre carte actuelle sur WhatsApp.",
      },
      {
        q: "Mes clients ont-ils besoin d’installer une application pour lire le QR code ?",
        a: "Aucune application n’est requise. L’appareil photo natif des iPhone et smartphones Android reconnaît automatiquement le QR code et ouvre le menu dans le navigateur.",
      },
      {
        q: "Puis-je afficher les prix en dinars tunisiens avec 3 décimales (millimes) ?",
        a: "Oui, ClickMenu gère nativement le format monétaire tunisien (DT / TND) ainsi que les variantes de taille, suppléments et formules.",
      },
    ],
  },
  {
    slug: "menu-restaurant-qr-code",
    path: "/menu-restaurant-qr-code",
    shortLabel: "Menu Restaurant QR Code",
    badge: "Spécial Restaurants & Pizzerias",
    primaryKeyword: "menu restaurant QR code",
    secondaryKeywords: [
      "qr code pour restaurant",
      "menu qr restaurant tunisie",
      "carte qr code pizzeria grillade",
      "menu interactif restaurant",
    ],
    searchIntent: "Commercial / Restaurateurs cherchant un menu QR adapté au service à table et aux plats cuisinés",
    seoTitle: "Menu Restaurant QR Code : Augmentez votre Ticket Moyen à Table",
    metaDescription:
      "équipez votre restaurant d’un menu QR code pensé pour la restauration en Tunisie : photos HD des plats, gestion des suppléments, ruptures en direct et commande à table.",
    h1Highlight: "Menu restaurant QR code",
    h1Rest: "conçu pour le service à table",
    arabicSubtitle: "قائمة طعام رقمية للمطاعم تبرز أطباقكم بالصور وتزيد من سرعة الخدمة",
    heroLead:
      "En restauration, on mange d’abord avec les yeux. Présentez vos entrées, grillades, pizzas, pâtes et desserts avec des photos appétissantes, des descriptions claires et vos suppléments, directement sur le téléphone de vos convives.",
    whatsappPrefill:
      "Bonjour ClickMenu, je gère un restaurant et je voudrais voir une démo du menu restaurant QR code.",
    keyBenefits: [
      {
        title: "Mise en valeur visuelle des plats signatures",
        description:
          "Chaque plat peut afficher une photo haute définition, ses ingrédients, ses allergènes et un badge (« Spécialité du Chef », « Nouveau », « Populaire »).",
      },
      {
        title: "Gestion des tailles, cuissons et suppléments",
        description:
          "Affichez clairement les suppléments fromage, sauces, accompagnements ou tailles de pizzas pour stimuler les ventes additionnelles.",
      },
      {
        title: "Rotation des tables accélérée au déjeuner et au dîner",
        description:
          "Les convives consultent la carte ensemble dès qu’ils s’assoient, sans attendre qu’un exemplaire papier se libère d’une autre table.",
      },
    ],
    sections: [
      {
        h2: "Comment un menu QR code augmente le panier moyen de votre restaurant",
        intro:
          "Sur une carte papier classique, l’espace est limité : il est impossible de mettre une photo pour chaque entrée, plat ou dessert sans transformer le menu en catalogue encombrant. Avec un menu restaurant QR code, chaque plat bénéficie d’une présentation soignée.",
        bullets: [
          {
            title: "Vente incitative naturelle (Upselling)",
            text: "Lorsque le client voit la photo d’un fondant au chocolat, d’une burrata ou d’un cocktail maison, la tentation de commander une entrée ou un dessert augmente immédiatement.",
          },
          {
            title: "Clarté sur les suppléments et formules",
            text: "Fini les oublis de suppléments par les serveurs pendant le coup de feu : toutes les options payantes sont affichées sous le plat.",
          },
          {
            title: "Zéro déception liée aux plats épuisés",
            text: "Un poisson du jour ou un plat mijoté est terminé à 21h30 ? Désactivez-le en un clic depuis la cuisine ou la caisse.",
          },
        ],
      },
      {
        h2: "Adapté à tous les concepts de restauration en Tunisie",
        intro:
          "Que vous dirigiez un restaurant gastronomique, une pizzeria au feu de bois, un resto-lounge, un fast-casual de burgers ou un restaurant de poissons, l’interface s’adapte à votre identité visuelle.",
        bullets: [
          {
            title: "Restaurants traditionnels & gastronomiques",
            text: "Design sobre et élégant, typographie soignée, mise en avant des plats du jour et des suggestions du chef.",
          },
          {
            title: "Pizzerias, Burgers & Fast-Casual",
            text: "Navigation ultra-rapide par puces de catégories, recherche instantanée et option de commande directe à table.",
          },
          {
            title: "Resto-Lounges & Terrasses",
            text: "Thème sombre haute lisibilité parfait pour les ambiances tamisées en soirée.",
          },
        ],
      },
    ],
    comparisonTitle: "Impact en salle : Carte Papier vs Menu Restaurant QR Code",
    comparisonRows: [
      {
        criterion: "Temps d’attente avant de voir la carte",
        paperOrPdf: "3 à 8 minutes aux heures de pointe",
        clickMenu: "0 seconde : le QR code est déjà sur la table",
      },
      {
        criterion: "Commande d’un dessert ou d’une boisson en cours de repas",
        paperOrPdf: "Le client doit redemander la carte au serveur",
        clickMenu: "Le client re-scanne à tout moment et commande immédiatement",
      },
      {
        criterion: "Présentation des plats",
        paperOrPdf: "Texte seul sur 80 % des plats",
        clickMenu: "Photos HD appétissantes sur chaque plat et dessert",
      },
    ],
    featuredPartners: ["oliva-nera", "maliks-restolounge", "big-a-food", "cheese-steak"],
    relatedPageSlugs: ["menu-digital-restaurant", "carte-restaurant-digitale", "prix-menu-digital-tunisie"],
    relatedBlogSlugs: [
      "augmenter-ticket-moyen-restaurant-tunisie-menu-digital",
      "psychologie-des-prix-menu-engineering-tunisie",
      "reduire-attente-service-restaurant-heures-de-pointe",
    ],
    faqs: [
      {
        q: "Puis-je organiser ma carte en Entrées, Plats, Pizzas, Grillades, Desserts et Boissons ?",
        a: "Oui. Vous créez autant de catégories que nécessaire et vous pouvez les réordonner par simple glisser-déposer depuis votre tableau de bord.",
      },
      {
        q: "Est-il possible de masquer temporairement les prix sur un menu d’événement ou de réception ?",
        a: "Oui, votre espace ClickMenu comporte une option permettant d’afficher ou de masquer les prix en un clic selon vos besoins.",
      },
      {
        q: "Le menu est-il lisible dans un restaurant à éclairage tamisé le soir ?",
        a: "Absolument. Notre interface publique utilise un contraste étudié qui offre une lecture confortable aussi bien en plein soleil sur une terrasse qu’en soirée en salle.",
      },
      {
        q: "Peut-on ajouter des suppléments (ex. supplément fromage, sauce, frites) ?",
        a: "Oui, chaque produit peut comporter sa propre liste de suppléments avec leur prix précis en dinars.",
      },
    ],
  },
  {
    slug: "menu-digital-cafe",
    path: "/menu-digital-cafe",
    shortLabel: "Menu Digital Café & Lounge",
    badge: "Spécial Cafés, Salons de Thé & Lounges",
    primaryKeyword: "menu digital café",
    secondaryKeywords: [
      "menu qr code café",
      "menu digital salon de thé tunisie",
      "carte digitale lounge chicha",
      "menu qr patisserie brunch",
    ],
    searchIntent: "Commercial / Propriétaires de cafés, salons de thé, lounges et pâtisseries en Tunisie",
    seoTitle: "Menu Digital Café & Salon de Thé en Tunisie : Carte QR Interactive",
    metaDescription:
      "Valorisez vos cafés, brunchs, crêpes, smoothies, pâtisseries et chichas avec un menu digital pour café et salon de thé en Tunisie. Démo gratuite sur WhatsApp.",
    h1Highlight: "Menu digital café",
    h1Rest: ", salon de thé et lounge en Tunisie",
    arabicSubtitle: "منيو رقمي عصري للمقاهي وقاعات الشاي واللاونج في تونس",
    heroLead:
      "En Tunisie, le café et le salon de thé sont des lieux de vie où la carte est vaste : expressos, cafés glacés, smoothies, mojitos, crêpes sucrées/salées, gaufres, petits-déjeuners et chichas. Affichez toute votre offre avec élégance sur smartphone.",
    whatsappPrefill:
      "Bonjour ClickMenu, j'ai un café / salon de thé et je souhaite une démonstration du menu digital.",
    keyBenefits: [
      {
        title: "Parfait pour les cartes riches (50 à 150+ articles)",
        description:
          "Grâce aux filtres rapides par catégorie et à la barre de recherche intégrée, vos clients trouvent leur boisson ou leur crêpe en 2 secondes.",
      },
      {
        title: "Mise en avant des formules Petit-Déjeuner & Brunch",
        description:
          "Détaillez clairement la composition de vos petits-déjeuners solo, duo ou gourmands avec photos pour booster vos matinées et week-ends.",
      },
      {
        title: "Résistant au service intensif en terrasse",
        description:
          "Plus de menus papier qui s’envolent au vent, prennent l’humidité ou s’abîment au soleil : vos supports QR restent impeccables sur chaque table.",
      },
    ],
    sections: [
      {
        h2: "Pourquoi les cafés et salons de thé tunisiens gagnent du temps avec ClickMenu",
        intro:
          "Dans un café ou un lounge de 40 à 100 tables, les serveurs parcourent des kilomètres chaque jour uniquement pour apporter la carte puis revenir prendre la commande. Avec le menu digital sur table, le premier passage du serveur est directement consacré à la prise de commande.",
        bullets: [
          {
            title: "Plus de commandes de gourmandises l’après-midi et le soir",
            text: "Un client venu pour un simple café découvre en photo vos cheesecakes, gaufres au chocolat, glaces artisanales ou cocktails frais.",
          },
          {
            title: "Adaptation facile entre la carte d’été et la carte d’hiver",
            text: "Mettez en avant les boissons glacées, granités et mojitos dès le printemps, puis remontez les chocolats chauds et thés aux pignons en hiver.",
          },
          {
            title: "Lancement instantané des soirées Ramadan",
            text: "Activez une catégorie spéciale « Soirées Ramadan / Shour / Ftayer & Hlou » en quelques clics sans réimprimer un seul support.",
          },
        ],
      },
      {
        h2: "Une présentation haut de gamme pour votre établissement",
        intro:
          "Votre menu digital porte votre logo, vos couleurs et vos photos de couverture pour refléter l’atmosphère unique de votre café ou salon de thé.",
        bullets: [
          {
            title: "Écran d’accueil personnalisé",
            text: "Dès le scan, votre client est accueilli par l’identité visuelle de votre enseigne ainsi que vos liens Instagram, Facebook et Google Maps.",
          },
          {
            title: "Navigation fluide à une main",
            text: "Pensé à 100 % pour l’usage mobile : catégories épinglées en haut de l’écran et mode liste ou grille au choix du client.",
          },
        ],
      },
    ],
    comparisonTitle: "Gestion d’un Café / Salon de Thé : Avant vs Après ClickMenu",
    comparisonRows: [
      {
        criterion: "Service aux heures de pointe (matin, 17h-23h)",
        paperOrPdf: "Clients qui attendent la carte en terrasse",
        clickMenu: "Consultation autonome dès que le client s’installe",
      },
      {
        criterion: "Formules Petit-Déjeuner, Ramadan ou Été",
        paperOrPdf: "Impression de flyers ou d’encarts supplémentaires",
        clickMenu: "Catégorie dédiée activable et modifiable gratuitement",
      },
      {
        criterion: "Vente de pâtisseries, crêpes et smoothies",
        paperOrPdf: "Faible visibilité en fin de carte",
        clickMenu: "Photos lumineuses qui déclenchent l’envie immédiate",
      },
    ],
    featuredPartners: ["metropolitan", "douja-lounge", "maison-nael"],
    relatedPageSlugs: ["menu-qr-code-tunisie", "support-qr-code-restaurant", "carte-restaurant-digitale"],
    relatedBlogSlugs: [
      "digitaliser-cafe-salon-de-the-tunisie",
      "optimiser-carte-petit-dejeuner-brunch-tunisie",
      "preparer-menu-digital-ramadan-saison-estivale-tunisie",
    ],
    faqs: [
      {
        q: "Peut-on détailler le contenu complet des formules petit-déjeuner (express, duo, royal) ?",
        a: "Oui. Chaque formule dispose d’un champ description complet pour lister cafés, jus frais, viennoiseries, œufs, charcuterie, fromages et accompagnements.",
      },
      {
        q: "Quel support QR code recommandez-vous pour une terrasse de café ?",
        a: "Pour les terrasses exposées au soleil et au vent, nous recommandons nos autocollants laminés haute adhérence collés sur un coin de table, ou nos chevalets lourds en bois gravé.",
      },
      {
        q: "Puis-je ajouter mes comptes Instagram et TikTok sur mon menu digital ?",
        a: "Oui, vos réseaux sociaux, votre numéro de téléphone et votre localisation Google Maps sont accessibles directement depuis l’en-tête du menu.",
      },
      {
        q: "Combien d’articles et de catégories peut-on mettre dans un menu de salon de thé ?",
        a: "Il n’y a aucune limite : vous pouvez créer autant de catégories (Cafés, Thés, Jus frais, Smoothies, Crêpes, Gaufres, Glaces, Chicha…) et de produits que vous le souhaitez.",
      },
    ],
  },
  {
    slug: "creer-menu-qr-code",
    path: "/creer-menu-qr-code",
    shortLabel: "Créer un Menu QR Code",
    badge: "Mise en ligne en 48h",
    primaryKeyword: "créer menu QR code",
    secondaryKeywords: [
      "comment créer un menu qr code",
      "création menu digital restaurant",
      "faire un menu qr code pour restaurant",
      "générateur menu qr code tunisie",
    ],
    searchIntent: "Transactionnel & Pratique / Restaurateur cherchant comment créer son menu QR code rapidement et sans erreur",
    seoTitle: "Créer un Menu QR Code pour Restaurant & Café en 48h | ClickMenu",
    metaDescription:
      "Vous voulez créer un menu QR code professionnel pour votre restaurant ou café en Tunisie ? Évitez les pièges du PDF : ClickMenu crée et livre votre carte digitale en 48h.",
    h1Highlight: "Créer un menu QR code",
    h1Rest: "professionnel en 48 heures",
    arabicSubtitle: "إنشاء منيو QR احترافي لمطعمك أو مقهاك في 48 ساعة دون أي تعقيد تقني",
    heroLead:
      "Pas besoin de passer vos soirées sur un logiciel compliqué ni de bricoler un fichier PDF illisible sur téléphone. Confiez-nous votre carte actuelle : notre équipe crée votre menu QR code interactif, votre tableau de bord et vos supports de table.",
    whatsappPrefill:
      "Bonjour ClickMenu, je souhaite créer un menu QR code pour mon établissement. Voici mes informations :",
    keyBenefits: [
      {
        title: "Zéro saisie manuelle au démarrage",
        description:
          "Envoyez simplement une photo ou un document de votre carte actuelle sur WhatsApp. Notre équipe saisit tous vos plats, catégories et prix pour vous.",
      },
      {
        title: "Un vrai site menu interactif, pas un simple PDF",
        description:
          "Vos clients profitent d’une navigation rapide par catégories, d’une recherche instantanée et d’images qui chargent immédiatement.",
      },
      {
        title: "Formation express de 10 minutes incluse",
        description:
          "Une fois votre menu en ligne, vous recevez vos accès personnels pour modifier vos prix ou vos plats en toute autonomie.",
      },
    ],
    sections: [
      {
        h2: "Les 3 erreurs à éviter quand on veut créer un menu QR code soi-même",
        intro:
          "De nombreux restaurateurs tentent d’abord de générer un QR code gratuit pointant vers un fichier PDF sur Google Drive ou vers une photo Facebook. En pratique, cela crée 3 problèmes majeurs en salle :",
        bullets: [
          {
            title: "Erreur n°1 : Le fichier PDF de 15 Mo qui ne s’ouvre pas sur la 4G",
            text: "Le client attend 30 secondes devant un écran blanc, puis doit zoomer et dézoomer dans tous les sens pour lire les prix.",
          },
          {
            title: "Erreur n°2 : Les générateurs « gratuits » qui expirent au bout de 14 jours",
            text: "Après avoir imprimé vos chevalets de table, le générateur bloque le QR code et réclame un abonnement en euros par carte bancaire internationale.",
          },
          {
            title: "Erreur n°3 : L’obligation de réimprimer le QR code à chaque modification",
            text: "Avec un QR code statique lié à un fichier, changer un prix oblige souvent à recréer un nouveau lien et à jeter vos supports de table.",
          },
        ],
      },
      {
        h2: "Les 4 étapes pour créer votre menu QR code avec ClickMenu",
        intro:
          "Un accompagnement local, humain et rapide en Tunisie :",
        bullets: [
          {
            title: "Étape 1 : Envoi de votre carte sur WhatsApp (+216 97 991 266)",
            text: "Photo de votre menu papier, fichier Word/Excel/PDF, logo et couleurs de votre enseigne.",
          },
          {
            title: "Étape 2 : Structuration & optimisation visuelle (sous 24h à 48h)",
            text: "Création de vos catégories, intégration des produits, prix en DT, suppléments et optimisation des photos.",
          },
          {
            title: "Étape 3 : Validation & remise de votre QR code haute définition",
            text: "Vous testez votre menu en direct sur votre téléphone. Dès validation, vous recevez votre QR code officiel (PNG/SVG) et votre lien web.",
          },
          {
            title: "Étape 4 : Livraison des supports de table & prise en main",
            text: "Si vous avez opté pour nos supports en bois, acrylique ou stickers, nous les fabriquons et vous les livrons prêts à poser.",
          },
        ],
      },
    ],
    comparisonTitle: "Bricoler un QR Code PDF vs Créer son Menu avec ClickMenu",
    comparisonRows: [
      {
        criterion: "Temps passé par le restaurateur",
        paperOrPdf: "Plusieurs jours de mise en page et de tests",
        clickMenu: "5 minutes (vous nous envoyez votre carte sur WhatsApp)",
      },
      {
        criterion: "Paiement & Facturation",
        paperOrPdf: "Outils étrangers payables uniquement en devises (€/$)",
        clickMenu: "Entreprise tunisienne, paiement et facturation en Dinars (TND)",
      },
      {
        criterion: "Expérience du client à table",
        paperOrPdf: "Téléchargement de fichier PDF peu lisible",
        clickMenu: "Application web fluide aux couleurs de votre restaurant",
      },
    ],
    featuredPartners: ["metropolitan", "big-a-food", "maison-nael"],
    relatedPageSlugs: ["menu-qr-code-tunisie", "prix-menu-digital-tunisie", "menu-qr-code-sans-application"],
    relatedBlogSlugs: [
      "comment-creer-menu-qr-code-restaurant-etape-par-etape",
      "pourquoi-eviter-menu-pdf-qr-code-restaurant",
      "ou-placer-qr-code-table-restaurant-maximiser-scans",
    ],
    faqs: [
      {
        q: "Que dois-je vous fournir pour créer mon menu QR code ?",
        a: "Uniquement la liste de vos plats et boissons avec leurs prix (même en photo de votre carte papier actuelle) ainsi que le logo de votre établissement. Si vous avez des photos de vos plats, nous les intégrons également.",
      },
      {
        q: "Et si je n’ai pas encore de photos professionnelles de tous mes plats ?",
        a: "Aucun problème. Notre interface est conçue pour être élégante aussi bien en mode liste épurée (sans photo sur certains articles) qu’en mode grille illustrée. Vous pourrez ajouter ou remplacer vos photos à tout moment.",
      },
      {
        q: "Puis-je télécharger mon QR code pour l’imprimer aussi sur mes flyers ou sacs à emporter ?",
        a: "Oui ! Depuis votre tableau de bord ClickMenu, vous téléchargez votre QR code en haute résolution en un clic pour l’utiliser sur vos sacs de livraison, boîtes à pizza, flyers ou vitrine.",
      },
      {
        q: "Le paiement se fait-il en dinars tunisiens ?",
        a: "Oui, ClickMenu est une solution 100 % tunisienne. Tous nos tarifs et notre accompagnement sont locaux, sans besoin de carte bancaire internationale.",
      },
    ],
  },
  {
    slug: "prix-menu-digital-tunisie",
    path: "/prix-menu-digital-tunisie",
    shortLabel: "Prix & Tarifs Tunisie",
    badge: "Tarifs Transparents en TND",
    primaryKeyword: "prix menu digital tunisie",
    secondaryKeywords: [
      "tarif menu qr code tunisie",
      "cout menu digital restaurant",
      "devis menu qr code tunisie",
      "abonnement menu digital tunisie",
    ],
    searchIntent: "Transactionnel / Comparaison des coûts et demande de devis en dinars tunisiens",
    seoTitle: "Prix Menu Digital en Tunisie : Tarifs, Rentabilité & Devis en DT",
    metaDescription:
      "Quel est le prix d’un menu digital QR code en Tunisie ? Découvrez nos formules transparentes en dinars (TND), comparez avec le coût d’impression papier et demandez votre devis.",
    h1Highlight: "Prix d’un menu digital",
    h1Rest: "en Tunisie : un investissement rentabilisé dès la 1ère mise à jour",
    arabicSubtitle: "أسعار المنيو الرقمي في تونس بالدينار التونسي — عروض واضحة تناسب حجم مؤسستك",
    heroLead:
      "Combien dépensez-vous chaque année en réimpression de cartes papier plastifiées ? Avec ClickMenu, vous bénéficiez d’un tarif clair en dinars tunisiens incluant la création initiale de votre carte, l’hébergement rapide et les modifications illimitées.",
    whatsappPrefill:
      "Bonjour ClickMenu, je souhaite connaître vos tarifs en DT pour équiper mon établissement d'un menu digital.",
    keyBenefits: [
      {
        title: "Intégration initiale de votre carte incluse",
        description:
          "Pas de frais cachés pour la saisie de vos produits au démarrage : notre équipe configure l’ensemble de votre menu initial.",
      },
      {
        title: "Modifications de prix et de plats 100 % gratuites",
        description:
          "Changez vos tarifs en DT, ajoutez des formules ou mettez à jour vos photos autant de fois que vous le souhaitez dans l’année.",
      },
      {
        title: "Supports QR à la carte selon votre budget",
        description:
          "Choisissez entre le QR code numérique seul, les stickers laminés économiques ou les chevalets en bois gravé et acrylique sur mesure.",
      },
    ],
    sections: [
      {
        h2: "Le vrai coût des menus papier en Tunisie vs le menu digital",
        intro:
          "Faisons un calcul réel pour un café ou un restaurant tunisien moyen disposant de 25 tables :",
        bullets: [
          {
            title: "Coût d’une impression papier / plastifiée de qualité",
            text: "Imprimer 30 à 40 livrets multi-pages avec pelliculage coûte généralement entre 250 DT et 600 DT chez un imprimeur.",
          },
          {
            title: "2 à 3 réimpressions par an (inflation, saison d’été, Ramadan)",
            text: "Au moindre ajustement des prix fournisseurs ou changement de carte saisonnière, il faut soit coller des étiquettes peu esthétiques, soit repasser à l’imprimerie — soit 500 DT à 1 500 DT par an.",
          },
          {
            title: "Avec ClickMenu : budget maîtrisé et carte toujours impeccable",
            text: "Une seule mise en place vous permet de modifier vos prix en temps réel toute l’année pour 0 DT de réimpression.",
          },
        ],
      },
      {
        h2: "Nos 3 formules adaptées aux cafés et restaurants en Tunisie",
        intro:
          "Parce qu’un coffee-shop de 8 tables n’a pas les mêmes besoins qu’un restaurant-lounge de 60 tables avec gestion de stock, nous adaptons votre devis :",
        bullets: [
          {
            title: "1. Formule Menu Digital Essentiel",
            text: "Création complète de votre menu interactif, lien dédié clickmenu.tn/menu/votre-nom, QR code haute définition, tableau de bord gérant et mises à jour illimitées.",
          },
          {
            title: "2. Formule Menu Digital + Pack Supports de Table",
            text: "Tout le pack Essentiel + fabrication et livraison de vos supports de table personnalisés avec votre logo (stickers laminés, plaques acrylique ou chevalets bois gravé).",
          },
          {
            title: "3. Formule Pro : Menu + Commandes à Table & Stock",
            text: "Réception des commandes table directement sur votre espace, gestion des mouvements de stock, alertes de seuil critique et statistiques détaillées.",
          },
        ],
      },
    ],
    comparisonTitle: "Comparatif Budgétaire Annuel (en Dinars Tunisiens)",
    comparisonRows: [
      {
        criterion: "Création & mise en page initiale",
        paperOrPdf: "Graphiste + Imprimeur à payer à chaque édition",
        clickMenu: "Intégration clé en main en 48h incluse",
      },
      {
        criterion: "Coût pour modifier 10 prix ou ajouter 3 nouveaux plats",
        paperOrPdf: "250 DT à 600 DT de réimpression (ou ratures)",
        clickMenu: "0 DT — gratuit et instantané depuis votre tableau de bord",
      },
      {
        criterion: "Durée de vie des supports sur table",
        paperOrPdf: "3 à 6 mois (usure, taches, pages déchirées)",
        clickMenu: "Supports bois / acrylique durables pendant plusieurs années",
      },
    ],
    featuredPartners: ["metropolitan", "oliva-nera", "big-a-food"],
    relatedPageSlugs: ["creer-menu-qr-code", "support-qr-code-restaurant", "menu-qr-code-tunisie"],
    relatedBlogSlugs: [
      "combien-coute-menu-digital-tunisie-comparatif",
      "psychologie-des-prix-menu-engineering-tunisie",
      "augmenter-ticket-moyen-restaurant-tunisie-menu-digital",
    ],
    faqs: [
      {
        q: "Comment obtenir un devis exact pour mon établissement ?",
        a: "Cliquez sur le bouton WhatsApp de cette page et indiquez-nous simplement le type de votre établissement (café, restaurant, fast-food) et le nombre de tables si vous souhaitez des supports imprimés. Nous vous répondons en quelques minutes.",
      },
      {
        q: "Y a-t-il des frais supplémentaires à chaque fois que je modifie mon menu ?",
        a: "Aucun. Vous avez un accès illimité à votre tableau de bord pour changer vos prix, vos textes, vos catégories et vos photos sans aucun surcoût.",
      },
      {
        q: "Puis-je commencer par le menu digital seul et commander les supports en bois plus tard ?",
        a: "Oui, tout à fait. Comme votre QR code est permanent, vous pouvez l’imprimer provisoirement dès sa livraison en 48h puis commander vos chevalets en bois ou acrylique quand vous le souhaitez.",
      },
      {
        q: "Proposez-vous des tarifs dégressifs pour les chaînes ou multi-enseignes ?",
        a: "Oui, si vous gérez plusieurs points de vente ou franchises en Tunisie, nous appliquons un tarif préférentiel multi-établissements.",
      },
    ],
  },
  {
    slug: "menu-digital-restaurant",
    path: "/menu-digital-restaurant",
    shortLabel: "Menu Digital Restaurant",
    badge: "Gestion Complète Enseigne",
    primaryKeyword: "menu digital restaurant",
    secondaryKeywords: [
      "logiciel menu digital restaurant",
      "gestion menu restaurant en ligne",
      "système menu digital restaurant tunisie",
      "digitalisation restaurant tunisie",
    ],
    searchIntent: "Commercial / Restaurateurs cherchant un outil complet de gestion de carte, commandes et stock",
    seoTitle: "Menu Digital Restaurant : Gestion en Temps Réel, Commandes & Stock",
    metaDescription:
      "Bien plus qu’un simple QR code : ClickMenu est une plateforme complète de menu digital pour restaurant avec gestion des prix en direct, commandes à table et suivi de stock.",
    h1Highlight: "Menu digital restaurant",
    h1Rest: "avec pilotage en temps réel",
    arabicSubtitle: "نظام متكامل لإدارة قائمة الطعام الرقمية والطلبات والمخزون للمطاعم",
    heroLead:
      "Reprenez le contrôle total sur votre carte, vos disponibilités, vos commandes à table et vos stocks depuis une seule interface pensée pour les restaurateurs exigeants.",
    whatsappPrefill:
      "Bonjour ClickMenu, je cherche une solution complète de menu digital restaurant avec tableau de bord.",
    keyBenefits: [
      {
        title: "Tableau de bord ultra-intuitif sur mobile et PC",
        description:
          "Gérez vos catégories, réordonnez vos plats, modifiez vos prix et basculez un article en rupture de stock en un seul geste.",
      },
      {
        title: "Module de commande à table intégré",
        description:
          "Vos clients peuvent composer leur panier en indiquant leur numéro de table, et vous suivez le statut des commandes en direct.",
      },
      {
        title: "Suivi des stocks et fiches d’inventaire",
        description:
          "Surveillez vos ingrédients, enregistrez vos entrées/sorties de stock et recevez des alertes sur les articles sous le seuil minimum.",
      },
    ],
    sections: [
      {
        h2: "Un tableau de bord pensé pour le rythme réel d’un restaurant",
        intro:
          "En plein service du midi ou du samedi soir, un gérant de restaurant n’a pas 20 minutes à consacrer à l’informatique. Chaque fonction du dashboard ClickMenu a été simplifiée à l’extrême :",
        bullets: [
          {
            title: "Interrupteur de disponibilité en 1 clic",
            text: "Un plat est épuisé en cuisine ? Un simple switch le retire instantanément de l’affichage client sans supprimer sa fiche produit.",
          },
          {
            title: "Statistiques de scans QR et performance de la carte",
            text: "Visualisez combien de clients consultent votre menu chaque jour et identifiez vos périodes de forte affluence.",
          },
          {
            title: "Upload photo simplifié avec recadrage automatique",
            text: "Prenez un plat en photo ou importez votre visuel : notre système l’optimise automatiquement au format WebP/AVIF ultra-léger.",
          },
        ],
      },
      {
        h2: "Du menu consultatif à la prise de commande et au stock",
        intro:
          "ClickMenu évolue avec votre établissement : utilisez-le comme carte de consultation élégante ou activez les fonctionnalités opérationnelles avancées.",
        bullets: [
          {
            title: "Panier client & numéro de table",
            text: "Le client sélectionne ses plats, précise son numéro de table et ses remarques éventuelles (cuisson, sans oignon…).",
          },
          {
            title: "Gestion des achats, pertes et bons de stock",
            text: "Suivez la valeur de votre stock en dinars et gardez une traçabilité claire des entrées fournisseurs et de la consommation cuisine.",
          },
        ],
      },
    ],
    comparisonTitle: "Menu Statique vs Plateforme Menu Digital Restaurant ClickMenu",
    comparisonRows: [
      {
        criterion: "Autonomie du restaurateur",
        paperOrPdf: "Dépendance totale envers un graphiste ou imprimeur",
        clickMenu: "Autonomie à 100 % depuis votre téléphone 24h/24",
      },
      {
        criterion: "Gestion des ruptures en plein service",
        paperOrPdf: "Impossible à signaler sur la carte",
        clickMenu: "Désactivation en temps réel en 1 clic",
      },
      {
        criterion: "Outils de gestion inclus",
        paperOrPdf: "Aucun",
        clickMenu: "Statistiques de scans, commandes à table et suivi de stock",
      },
    ],
    featuredPartners: ["oliva-nera", "big-a-food", "maliks-restolounge"],
    relatedPageSlugs: ["menu-restaurant-qr-code", "carte-restaurant-digitale", "prix-menu-digital-tunisie"],
    relatedBlogSlugs: [
      "gerer-ruptures-de-stock-menu-restaurant-temps-reel",
      "maitriser-food-cost-inventaire-restaurant-tunisie",
      "commande-a-table-qr-code-comment-ca-marche",
    ],
    faqs: [
      {
        q: "Puis-je gérer mon menu digital depuis mon téléphone quand je ne suis pas au restaurant ?",
        a: "Oui. Votre tableau de bord est une application web sécurisée accessible depuis n’importe quel smartphone, tablette ou ordinateur connecté à Internet.",
      },
      {
        q: "Si je désactive un plat épuisé ce soir, dois-je le recréer demain ?",
        a: "Non ! Le plat reste enregistré avec sa photo, sa description et son prix. Demain matin, il vous suffit de réactiver le bouton « Disponible » en un clic.",
      },
      {
        q: "L’accès au tableau de bord est-il sécurisé ?",
        a: "Oui, chaque enseigne dispose d’un compte propriétaire protégé par identifiant et mot de passe chiffré.",
      },
    ],
  },
  {
    slug: "menu-qr-code-sans-application",
    path: "/menu-qr-code-sans-application",
    shortLabel: "Menu QR Sans Application",
    badge: "0 Téléchargement Requis",
    primaryKeyword: "menu QR code sans application",
    secondaryKeywords: [
      "menu qr sans telechargement",
      "menu digital navigateur mobile",
      "scan qr code appareil photo iphone android",
      "menu web instantané restaurant",
    ],
    searchIntent: "Commercial / Rassurer sur la simplicité d’utilisation pour les clients finaux en salle",
    seoTitle: "Menu QR Code Sans Application : Scan Instantané sur iPhone & Android",
    metaDescription:
      "Vos clients ne veulent pas installer d’application à table ! Avec ClickMenu, votre menu QR code s’ouvre directement dans le navigateur en moins d’une seconde.",
    h1Highlight: "Menu QR code sans application",
    h1Rest: " : 1 scan et la carte s’ouvre",
    arabicSubtitle: "يفتح المنيو مباشرة من كاميرا الهاتف دون تحميل أي تطبيق أو تسجيل حساب",
    heroLead:
      "La règle d’or à table est simple : si un client doit télécharger une application sur l’App Store ou Google Play ou créer un compte pour lire votre carte, il abandonne. ClickMenu fonctionne à 100 % dans le navigateur natif du téléphone.",
    whatsappPrefill:
      "Bonjour ClickMenu, je souhaite tester votre menu QR code sans application pour mon établissement.",
    keyBenefits: [
      {
        title: "Compatible avec 100 % des iPhone et smartphones Android",
        description:
          "Il suffit d’ouvrir l’appareil photo standard du téléphone et de viser le QR code : le lien s’affiche et la carte s’ouvre.",
      },
      {
        title: "Aucune inscription ni demande de données personnelles",
        description:
          "Votre client n’a ni e-mail, ni mot de passe, ni numéro à saisir pour consulter vos plats et vos prix.",
      },
      {
        title: "Chargement ultra-léger même avec une connexion 4G moyenne",
        description:
          "Nos images sont servies au format WebP/AVIF redimensionné pour l’écran mobile, garantissant une fluidité exemplaire.",
      },
    ],
    sections: [
      {
        h2: "Pourquoi le « zéro application » est indispensable pour vos clients",
        intro:
          "À table, vos clients veulent commander un café, une pizza ou un plat en quelques secondes. Leur imposer le téléchargement d’une application de 80 Mo consomme leur forfait 4G, sature la mémoire de leur téléphone et ralentit votre service.",
        bullets: [
          {
            title: "Ouverture native dans Safari, Chrome et Samsung Internet",
            text: "Notre technologie Web-App offre la fluidité d’une application mobile tout en s’exécutant directement dans le navigateur.",
          },
          {
            title: "Partageable en un clic sur WhatsApp et Instagram",
            text: "Puisque votre menu est une véritable page web (clickmenu.tn/menu/votre-enseigne), vous pouvez aussi mettre le lien dans votre bio Instagram ou sur votre fiche Google Maps !",
          },
          {
            title: "Fonctionne aussi avant la visite au restaurant",
            text: "Un groupe d’amis ou d’employés de bureau peut consulter votre carte depuis le bureau avant même de venir déjeuner chez vous.",
          },
        ],
      },
      {
        h2: "Optimisé pour la vitesse mobile en Tunisie",
        intro:
          "Nous avons accordé une attention particulière à la performance technique sur les smartphones utilisés en Tunisie :",
        bullets: [
          {
            title: "Compression intelligente des photos",
            text: "Chaque miniature de plat pèse quelques dizaines de kilo-octets au lieu de plusieurs méga-octets.",
          },
          {
            title: "Recherche instantanée sans rechargement de page",
            text: "Tapez « escalope », « mojito » ou « nutella » dans la barre de recherche : les plats correspondants s’affichent à la milliseconde.",
          },
        ],
      },
    ],
    comparisonTitle: "Application à Télécharger vs Menu Web Sans Application ClickMenu",
    comparisonRows: [
      {
        criterion: "Nombre d’étapes pour voir la carte",
        paperOrPdf: "5 étapes (Store, téléchargement, ouverture, inscription…)",
        clickMenu: "1 étape : viser le QR code avec l’appareil photo",
      },
      {
        criterion: "Taux d’adoption par les clients à table",
        paperOrPdf: "Moins de 15 % (la majorité refuse d’installer une app)",
        clickMenu: "Plus de 95 % des clients utilisent le menu immédiatement",
      },
      {
        criterion: "Lien utilisable sur Instagram & Google Maps",
        paperOrPdf: "Non",
        clickMenu: "Oui, un lien direct universel partageable partout",
      },
    ],
    featuredPartners: ["metropolitan", "cheese-steak", "douja-lounge"],
    relatedPageSlugs: ["menu-qr-code-tunisie", "creer-menu-qr-code", "carte-restaurant-digitale"],
    relatedBlogSlugs: [
      "menu-qr-code-sans-application-pourquoi-indispensable",
      "optimiser-fiche-google-business-profile-restaurant-tunisie",
      "comment-attirer-clients-instagram-tiktok-restaurant-tunisie",
    ],
    faqs: [
      {
        q: "Est-ce que tous les téléphones récents lisent les QR codes sans application tierce ?",
        a: "Oui. Tous les iPhone (depuis iOS 11) et la quasi-totalité des téléphones Android (Samsung, Xiaomi, Oppo, Realme, Huawei…) intègrent un lecteur QR directement dans l’appareil photo d’origine.",
      },
      {
        q: "Puis-je mettre le lien de mon menu dans ma bio Instagram et Facebook ?",
        a: "Oui, et nous vous le recommandons vivement ! Vos abonnés peuvent ainsi consulter vos plats et vos prix directement depuis Instagram sans rien télécharger.",
      },
      {
        q: "Le menu consomme-t-il beaucoup de forfait Internet 4G pour le client ?",
        a: "Non. Grâce à notre optimisation d’images, consulter un menu ClickMenu consomme moins de données qu’ouvrir deux stories sur Instagram.",
      },
    ],
  },
  {
    slug: "menu-digital-multilingue",
    path: "/menu-digital-multilingue",
    shortLabel: "Menu Digital Multilingue",
    badge: "Tourisme & Clientèle Internationale",
    primaryKeyword: "menu digital multilingue",
    secondaryKeywords: [
      "menu restaurant français arabe anglais",
      "carte restaurant touristique tunisie",
      "menu qr code multilingue hammamet sousse djerba",
      "traduire menu restaurant qr code",
    ],
    searchIntent: "Commercial / Restaurants situés en zones touristiques ou quartiers d’affaires en Tunisie",
    seoTitle: "Menu Digital Multilingue en Tunisie (FR / AR / EN) pour Restaurants",
    metaDescription:
      "Accueillez touristes et clientèle locale avec un menu digital multilingue en Tunisie (Français, Arabe, Anglais, Italien). Idéal à Tunis, Hammamet, Sousse et Djerba.",
    h1Highlight: "Menu digital multilingue",
    h1Rest: "pour la clientèle locale et internationale en Tunisie",
    arabicSubtitle: "منيو رقمي متعدد اللغات (فرنسية، عربية، إنجليزية) للمطاعم السياحية والمهنية في تونس",
    heroLead:
      "Que votre établissement soit situé aux Berges du Lac, à La Marsa, Gammarth, Sidi Bou Saïd, Hammamet, Sousse, Monastir ou Djerba, accueillez chaque client avec une carte claire, illustrée et compréhensible.",
    whatsappPrefill:
      "Bonjour ClickMenu, je souhaite mettre en place un menu digital multilingue pour mon établissement.",
    keyBenefits: [
      {
        title: "Descriptions claires + photos explicites pour chaque plat",
        description:
          "Même pour un visiteur étranger qui découvre la gastronomie tunisienne ou méditerranéenne, la photo HD et la description détaillée lèvent toute hésitation.",
      },
      {
        title: "Fini les cartes papier en 4 langues illisibles",
        description:
          "Sur papier, superposer 3 ou 4 langues sur chaque ligne rend la carte confuse. Le support digital structure l’information proprement.",
      },
      {
        title: "Gain de temps précieux pour vos serveurs en haute saison",
        description:
          "Vos serveurs n’ont plus besoin de traduire oralement chaque ingrédient à table pendant le coup de feu estival.",
      },
    ],
    sections: [
      {
        h2: "Un atout décisif pour les zones touristiques et d’affaires en Tunisie",
        intro:
          "La Tunisie accueille chaque année des millions de visiteurs européens, maghrébins (Algérie, Libye) et internationaux, ainsi qu’une clientèle d’expatriés et de voyageurs d’affaires dans le Grand Tunis.",
        bullets: [
          {
            title: "Clientèle maghrébine et arabophone",
            text: "Des intitulés et descriptions accessibles en arabe ou bilingues rassurent les familles et augmentent le montant moyen des commandes.",
          },
          {
            title: "Touristes européens (Anglais, Français, Italien…)",
            text: "Les voyageurs comprennent immédiatement la composition des spécialités (brik, couscous, grillades, poissons, pâtisseries) et osent commander davantage.",
          },
          {
            title: "Indication claire des ingrédients et particularités",
            text: "Précisez facilement si un plat est épicé (harissa), végétarien, sans gluten ou préparé au poisson frais.",
          },
        ],
      },
      {
        h2: "Comment nous structurons votre carte pour les touristes et locaux",
        intro:
          "Notre équipe vous accompagne pour organiser vos intitulés et descriptions de manière lisible et harmonieuse sur mobile :",
        bullets: [
          {
            title: "Intitulés bilingues ou descriptions multilingues",
            text: "Affichez le nom du plat et sa composition en français, anglais ou arabe avec une hiérarchie typographique claire.",
          },
          {
            title: "Photographies haute définition des spécialités",
            text: "La photo reste le langage universel numéro 1 en restauration : elle rassure instantanément le client étranger.",
          },
        ],
      },
    ],
    comparisonTitle: "Carte Papier Multi-Langues vs Menu Digital Multilingue",
    comparisonRows: [
      {
        criterion: "Lisibilité de la carte",
        paperOrPdf: "Texte minuscule surchargé en 3 ou 4 colonnes",
        clickMenu: "Présentation aérée avec photos et recherche rapide",
      },
      {
        criterion: "Temps passé par le serveur à expliquer les plats",
        paperOrPdf: "5 à 10 minutes par table touristique",
        clickMenu: "Le client voit la photo et la composition dans sa langue",
      },
      {
        criterion: "Mise à jour pour la haute saison estivale",
        paperOrPdf: "Réimpression complète avant chaque été",
        clickMenu: "Mise à jour instantanée des tarifs et spécialités d’été",
      },
    ],
    featuredPartners: ["oliva-nera", "metropolitan", "maison-nael"],
    relatedPageSlugs: ["menu-restaurant-qr-code", "carte-restaurant-digitale", "menu-qr-code-tunisie"],
    relatedBlogSlugs: [
      "menu-digital-multilingue-atout-restaurants-touristiques-tunisie",
      "preparer-menu-digital-ramadan-saison-estivale-tunisie",
      "reussir-photos-culinaires-menu-digital-smartphone",
    ],
    faqs: [
      {
        q: "Quelles langues peut-on afficher sur un menu ClickMenu ?",
        a: "Notre plateforme prend en charge tous les alphabets (latin et arabe) : vous pouvez afficher vos intitulés et descriptions en français, arabe, anglais, italien, allemand ou russe.",
      },
      {
        q: "Est-ce utile pour les restaurants d’hôtels, de plage ou de zones touristiques ?",
        a: "Oui, c’est l’un des cas d’usage les plus rentables : sur une plage privée, au bord d’une piscine ou en terrasse à Hammamet, Sousse ou Djerba, les clients scannent le QR code sur leur transat ou leur table.",
      },
      {
        q: "Les navigateurs mobiles proposent-ils aussi la traduction automatique sur votre menu ?",
        a: "Oui ! Parce que ClickMenu génère du vrai texte HTML (et non une image ou un PDF verrouillé), Chrome et Safari permettent également aux touristes d’utiliser la traduction native de leur téléphone en un clic.",
      },
    ],
  },
  {
    slug: "carte-restaurant-digitale",
    path: "/carte-restaurant-digitale",
    shortLabel: "Carte Restaurant Digitale",
    badge: "Design & Expérience Client",
    primaryKeyword: "carte restaurant digitale",
    secondaryKeywords: [
      "carte numérique restaurant",
      "moderniser carte restaurant",
      "carte interactive restaurant tunisie",
      "design menu digital",
    ],
    searchIntent: "Commercial / Restaurateurs attentifs au design, à l’image de marque et au merchandising de leur carte",
    seoTitle: "Carte Restaurant Digitale : Sublimez vos Plats et Votre Image",
    metaDescription:
      "Transformez votre carte papier en une carte restaurant digitale élégante et interactive. Design personnalisé, photos HD, badges et navigation fluide avec ClickMenu.",
    h1Highlight: "Carte restaurant digitale",
    h1Rest: " : l’élégance au service de votre table",
    arabicSubtitle: "قائمة طعام رقمية بتصميم راقٍ يعكس هوية مطعمك ويبرز جودة أطباقك",
    heroLead:
      "Votre carte est le premier ambassadeur de votre cuisine. Remplacez les menus plastifiés abîmés par une carte restaurant digitale sur mesure qui valorise votre savoir-faire culinaire et donne envie de tout goûter.",
    whatsappPrefill:
      "Bonjour ClickMenu, je souhaite moderniser ma carte avec une carte restaurant digitale aux couleurs de mon établissement.",
    keyBenefits: [
      {
        title: "Identité visuelle aux couleurs de votre enseigne",
        description:
          "Logo, image de couverture, couleur principale sur mesure et typographie gastronomique : votre carte digitale ressemble à votre établissement.",
      },
      {
        title: "Double affichage : Mode Liste épuré ou Mode Grille photo",
        description:
          "Vos clients passent librement d’une vue liste rapide à une vue galerie mettant vos photographies culinaires au premier plan.",
      },
      {
        title: "Badges d’appel visuel sur vos produits à forte marge",
        description:
          "Attirez le regard sur vos spécialités rentables grâce aux badges personnalisés (« Coup de cœur », « Nouveau », « Chef »).",
      },
    ],
    sections: [
      {
        h2: "Quand le design de votre carte digitale fait vendre vos meilleurs plats",
        intro:
          "En ingénierie de menu (Menu Engineering), la façon dont un plat est présenté influence directement jusqu’à 30 % des choix des clients. Une carte restaurant digitale bien structurée guide naturellement le regard :",
        bullets: [
          {
            title: "Hiérarchie visuelle étudiée",
            text: "Les catégories s’affichent sous forme d’onglets fluides en haut de l’écran : le client passe des entrées aux desserts sans jamais se perdre.",
          },
          {
            title: "Fiches produits détaillées au clic",
            text: "En touchant un plat, le client ouvre une fiche élégante avec la photo en grand format, la description complète et les suppléments proposés.",
          },
          {
            title: "Mise en avant de votre présence digitale",
            text: "Vos boutons Instagram, Facebook, appel téléphonique et itinéraire Google Maps sont intégrés avec finesse pour fidéliser vos clients après leur repas.",
          },
        ],
      },
      {
        h2: "Une carte toujours propre, toujours exacte, 365 jours par an",
        intro:
          "Un client juge souvent le soin apporté en cuisine à l’état de la carte qu’on lui tend en salle. Avec une carte digitale :",
        bullets: [
          {
            title: "Zéro rature, zéro faute figée sur papier",
            text: "Une coquille dans un intitulé ou une nouvelle recette ? Vous la corrigez en 10 secondes.",
          },
          {
            title: "Photographies toujours à jour",
            text: "Vous venez de refaire le dressage d’une assiette ? Mettez la nouvelle photo en ligne immédiatement.",
          },
        ],
      },
    ],
    comparisonTitle: "Carte Papier Classique vs Carte Restaurant Digitale ClickMenu",
    comparisonRows: [
      {
        criterion: "Première impression du client",
        paperOrPdf: "Carte souvent usée aux coins ou collante",
        clickMenu: "Écran d’accueil immersif avec le logo et l’univers du lieu",
      },
      {
        criterion: "Mise en valeur des spécialités à forte marge",
        paperOrPdf: "Noyées au milieu d’une liste de texte",
        clickMenu: "Mises en tête de catégorie avec badge et photo HD",
      },
      {
        criterion: "Fidélisation sur Instagram & Google Maps",
        paperOrPdf: "Le client doit chercher votre page manuellement",
        clickMenu: "Boutons directs intégrés en un clic sur la carte",
      },
    ],
    featuredPartners: ["oliva-nera", "maison-nael", "metropolitan", "douja-lounge"],
    relatedPageSlugs: ["menu-restaurant-qr-code", "menu-digital-cafe", "support-qr-code-restaurant"],
    relatedBlogSlugs: [
      "psychologie-des-prix-menu-engineering-tunisie",
      "reussir-photos-culinaires-menu-digital-smartphone",
      "erreurs-courantes-creation-carte-restaurant",
    ],
    faqs: [
      {
        q: "Puis-je personnaliser les couleurs de ma carte digitale selon ma charte graphique ?",
        a: "Oui. Depuis vos paramètres, vous choisissez votre couleur d’accentuation, votre logo, le fond de votre logo et votre photo de couverture.",
      },
      {
        q: "Est-ce que mes clients peuvent voir les photos en grand format ?",
        a: "Oui, lorsqu’un client touche un plat disposant d’une photo, une fenêtre dédiée affiche le visuel en grand format avec tous les détails du plat.",
      },
      {
        q: "Peut-on réorganiser l’ordre des catégories et des plats facilement ?",
        a: "Oui, vous pouvez placer vos catégories et vos plats les plus rentables en première position à tout moment depuis votre tableau de bord.",
      },
    ],
  },
  {
    slug: "support-qr-code-restaurant",
    path: "/support-qr-code-restaurant",
    shortLabel: "Supports QR Bois & Acrylique",
    badge: "Fabrication Sur Mesure en Tunisie",
    primaryKeyword: "support QR code restaurant",
    secondaryKeywords: [
      "chevalet qr code bois gravé tunisie",
      "plaque acrylique qr code table",
      "autocollant qr code table restaurant",
      "impression qr code menu tunisie",
    ],
    searchIntent: "Transactionnel / Achat de supports physiques de table pour menu QR code en Tunisie",
    seoTitle: "Supports QR Code Restaurant en Tunisie : Bois Gravé, Acrylique & Stickers",
    metaDescription:
      "Commandez vos supports QR code de table personnalisés en Tunisie : chevalets en bois gravé au laser, plaques acrylique et autocollants laminés résistants à l’eau.",
    h1Highlight: "Supports QR code de table",
    h1Rest: "en bois gravé, acrylique et stickers laminés",
    arabicSubtitle: "حوامل رمز QR للطاولات من الخشب المحفور أو الأكريليك أو الملصقات المقاومة للماء",
    heroLead:
      "Un beau menu digital mérite un support de table à la hauteur de votre décoration. Nous fabriquons en Tunisie vos supports QR personnalisés avec votre logo, conçus pour résister à un usage quotidien intensif en salle comme en terrasse.",
    whatsappPrefill:
      "Bonjour ClickMenu, je souhaite voir vos modèles et tarifs de supports QR code de table (bois, acrylique ou stickers).",
    keyBenefits: [
      {
        title: "Gravure laser de précision & impression haute contraste",
        description:
          "Chaque QR code est testé avant expédition pour garantir un scan instantané même sous un éclairage faible ou en plein soleil.",
      },
      {
        title: "Matériaux durables résistants à l’eau et au nettoyage",
        description:
          "Nos supports supportent les coups d’éponge quotidiens, les éclaboussures de café et la chaleur estivale en terrasse.",
      },
      {
        title: "Personnalisation complète avec le logo de votre enseigne",
        description:
          "Votre logo, un appel à l’action clair (« Scannez le menu ») et éventuellement le numéro de table sont intégrés au design.",
      },
    ],
    sections: [
      {
        h2: "Quel support QR code choisir selon le style de votre établissement ?",
        intro:
          "Nous proposons 3 gammes de supports physiques fabriqués sur mesure en Tunisie :",
        bullets: [
          {
            title: "1. Chevalets en bois gravé au laser (Chaleureux & Authentique)",
            text: "Idéal pour les restaurants, pizzerias, salons de thé chaleureux et coffee-shops. Le bois naturel verni apporte une touche noble sur chaque table.",
          },
          {
            title: "2. Supports et plaques en acrylique / plexiglas (Moderne & Chic)",
            text: "Parfait pour les lounges, rooftops, pâtisseries modernes et restaurants gastronomiques. Finition brillante ou noire/dorée très élégante.",
          },
          {
            title: "3. Autocollants de table laminés haute résistance (Pratique & Anti-Vol)",
            text: "Recommandé pour les fast-foods, grandes terrasses de cafés et plages privées : collé directement sur la table, il ne tombe pas au vent et ne peut pas être déplacé.",
          },
        ],
      },
      {
        h2: "Conseils d’emplacement pour maximiser le taux de scan à table",
        intro:
          "Pour que 100 % de vos clients scannent naturellement le QR code sans hésiter :",
        bullets: [
          {
            title: "Un support visible dès que le client s’assoit",
            text: "Placez le chevalet au centre ou au bord extérieur de la table, ou collez le sticker dans le coin supérieur droit.",
          },
          {
            title: "Une consigne courte et claire",
            text: "Nos supports incluent toujours la mention explicite « Scannez pour voir le menu » avec une icône d’appareil photo.",
          },
        ],
      },
    ],
    comparisonTitle: "Comparatif de nos 3 Gammes de Supports QR de Table",
    comparisonRows: [
      {
        criterion: "Chevalet Bois Gravé",
        paperOrPdf: "Aspect artisanal et chaleureux, posé debout sur table",
        clickMenu: "Recommandé pour restaurants, bistros, salons de thé et cafés cosy",
      },
      {
        criterion: "Support Acrylique Premium",
        paperOrPdf: "Finition moderne et lumineuse, nettoyage ultra-rapide",
        clickMenu: "Recommandé pour lounges, rooftops, hôtels et pâtisseries fines",
      },
      {
        criterion: "Sticker Laminé Haute Adhérence",
        paperOrPdf: "Fixé à plat sur la table, insensible au vent et à l’eau",
        clickMenu: "Recommandé pour grandes terrasses de cafés, fast-foods et plages",
      },
    ],
    featuredPartners: ["metropolitan", "oliva-nera", "douja-lounge", "big-a-food"],
    relatedPageSlugs: ["menu-qr-code-tunisie", "prix-menu-digital-tunisie", "creer-menu-qr-code"],
    relatedBlogSlugs: [
      "bois-acrylique-ou-sticker-choisir-support-qr-code-table",
      "ou-placer-qr-code-table-restaurant-maximiser-scans",
      "guide-complet-menu-digital-qr-code-tunisie",
    ],
    faqs: [
      {
        q: "Puis-je numéroter chaque support par numéro de table (Table 1, Table 2…) ?",
        a: "Oui ! Nous pouvons graver ou imprimer le numéro de table sur chaque support, ce qui facilite grandement le repérage lors des commandes à table.",
      },
      {
        q: "Les autocollants QR code résistent-ils aux produits nettoyants et au soleil ?",
        a: "Oui, nos stickers reçoivent un pelliculage de protection anti-UV et imperméable spécialement conçu pour les tables de cafés et terrasses en Tunisie.",
      },
      {
        q: "Quel est le délai de fabrication des supports personnalisés ?",
        a: "Votre menu digital est en ligne en 48h, et la fabrication de vos supports personnalisés en bois ou acrylique prend généralement entre 3 et 5 jours ouvrés.",
      },
    ],
  },
];

export function getCommercialPageBySlug(slug: string): CommercialPageData | undefined {
  return COMMERCIAL_PAGES.find((p) => p.slug === slug);
}

