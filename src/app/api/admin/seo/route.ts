import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDb } from "@/lib/db";
import { requireUser } from "@/lib/permissions";
import { Restaurant } from "@/models/Restaurant";
import { SeoPageConfig } from "@/models/SeoPageConfig";
import { BlogPost } from "@/models/BlogPost";
import { ConversionEvent } from "@/models/ConversionEvent";
import { COMMERCIAL_PAGES } from "@/lib/commercial-pages";
import { BLOG_ARTICLES } from "@/lib/blog-data";
import {
  DUPLICATE_SLUG_CANONICALS,
  HOME_DESCRIPTION,
  HOME_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export interface SeoAuditWarning {
  id: string;
  severity: "high" | "medium" | "info";
  entityType: "page" | "restaurant" | "blog";
  target: string;
  message: string;
  recommendation: string;
}

const CORE_PAGES = [
  {
    path: "/",
    label: "Page d'accueil principale",
    defaultTitle: `${HOME_TITLE} | ${SITE_NAME}`,
    defaultDescription: HOME_DESCRIPTION,
  },
  {
    path: "/solutions",
    label: "Hub Solutions Commerciales",
    defaultTitle: "Solutions Menu Digital & QR Code pour Cafés et Restaurants en Tunisie",
    defaultDescription:
      "Découvrez toutes les solutions ClickMenu en Tunisie : menu QR code sans application, carte digitale restaurant et café, menu multilingue, supports bois gravé et tarifs en DT.",
  },
  {
    path: "/menu",
    label: "Annuaire Menus Partenaires",
    defaultTitle: "Menus digitaux des cafés et restaurants en Tunisie",
    defaultDescription:
      "Explorez les menus digitaux (QR code) des cafés, restaurants, salons de thé, pâtisseries et fast-foods partenaires de ClickMenu en Tunisie.",
  },
  {
    path: "/blog",
    label: "Index du Blog",
    defaultTitle: "Blog & Guides Menu Digital pour Cafés et Restaurants en Tunisie",
    defaultDescription:
      "Conseils pratiques, études de rentabilité en dinars (DT), ingénierie de menu et guides sur le menu QR code pour les cafés, salons de thé et restaurants en Tunisie.",
  },
  ...COMMERCIAL_PAGES.map((p) => ({
    path: p.path,
    label: p.shortLabel,
    defaultTitle: p.seoTitle,
    defaultDescription: p.metaDescription,
  })),
];

export async function GET() {
  try {
    const currentUser = await requireUser();
    if (currentUser.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDb();

  const [pageOverrides, restaurants, blogOverrides, totalConversions, conversionsByPath] =
    await Promise.all([
      SeoPageConfig.find().lean(),
      Restaurant.find().sort({ createdAt: -1 }).lean(),
      BlogPost.find().lean(),
      ConversionEvent.countDocuments(),
      ConversionEvent.aggregate([
        { $group: { _id: "$pathname", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

  const pageMap = new Map(pageOverrides.map((p: any) => [String(p.path), p]));
  const pages = CORE_PAGES.map((cp) => {
    const ov = pageMap.get(cp.path);
    return {
      path: cp.path,
      label: cp.label,
      seoTitle: ov?.seoTitle || cp.defaultTitle,
      metaDescription: ov?.metaDescription || cp.defaultDescription,
      canonicalUrl: ov?.canonicalUrl || `${SITE_URL}${cp.path === "/" ? "/" : cp.path}`,
      indexable: ov?.indexable ?? true,
      includeInSitemap: ov?.includeInSitemap ?? true,
      ogImage: ov?.ogImage || "",
    };
  });

  const blogMap = new Map(blogOverrides.map((b: any) => [String(b.slug), b]));
  const blogPosts = BLOG_ARTICLES.map((art) => {
    const ov = blogMap.get(art.slug);
    const status = (ov?.status as "published" | "draft") || art.status;
    return {
      id: art.id,
      slug: art.slug,
      title: ov?.title || art.title,
      excerpt: ov?.excerpt || art.excerpt,
      category: art.category,
      targetKeyword: art.targetKeyword,
      searchIntent: art.searchIntent,
      status,
      seoTitle: ov?.seoTitle || art.seoTitle,
      metaDescription: ov?.metaDescription || art.metaDescription,
      canonicalUrl: ov?.canonicalUrl || `${SITE_URL}/blog/${art.slug}`,
      indexable: ov?.indexable ?? (status === "published" ? art.indexable : false),
      includeInSitemap:
        ov?.includeInSitemap ?? (status === "published" ? art.includeInSitemap : false),
      ogImage: ov?.ogImage || "",
    };
  });

  const mappedRestaurants = restaurants.map((r: any) => {
    const slug = String(r.slug);
    const dupTarget = DUPLICATE_SLUG_CANONICALS[slug];
    const where = r.address ? ` à ${r.address}` : " en Tunisie";
    return {
      _id: String(r._id),
      name: String(r.name),
      slug,
      isActive: r.isActive !== false,
      address: r.address || "",
      logo: r.logo || "",
      coverImage: r.coverImage || "",
      seoTitle: r.seoTitle || `Menu ${r.name} : carte, prix et produits`,
      metaDescription:
        r.metaDescription ||
        `Menu digital de ${r.name}${where} : carte complète, produits et prix en dinars à jour. Consultez le menu en ligne sur votre téléphone.`,
      canonicalUrl: r.canonicalUrl || `${SITE_URL}/menu/${dupTarget || slug}`,
      indexable: dupTarget ? false : r.indexable ?? true,
      includeInSitemap: dupTarget ? false : r.includeInSitemap ?? true,
      ogImage: r.ogImage || r.coverImage || r.logo || "",
      isDuplicateAlias: Boolean(dupTarget),
      duplicateTarget: dupTarget || null,
    };
  });

  // ── AUTOMATED SEO AUDIT WARNINGS ────────────────────────────────────────
  const warnings: SeoAuditWarning[] = [];
  const seenTitles = new Map<string, string>();

  for (const p of pages) {
    if (p.seoTitle.length < 30 || p.seoTitle.length > 70) {
      warnings.push({
        id: `page-title-len-${p.path}`,
        severity: "medium",
        entityType: "page",
        target: p.path,
        message: `Longueur du titre SEO (${p.seoTitle.length} caractères) hors de la plage optimale (30–70).`,
        recommendation: "Ajustez le titre SEO pour éviter la troncature dans les résultats Google.",
      });
    }
    if (p.metaDescription.length < 70 || p.metaDescription.length > 170) {
      warnings.push({
        id: `page-desc-len-${p.path}`,
        severity: "medium",
        entityType: "page",
        target: p.path,
        message: `Longueur de la meta description (${p.metaDescription.length} caractères) hors de la plage optimale (70–170).`,
        recommendation: "Rédigez une meta description comprise entre 110 et 160 caractères.",
      });
    }
    if (!p.indexable && p.includeInSitemap) {
      warnings.push({
        id: `page-noindex-sitemap-${p.path}`,
        severity: "high",
        entityType: "page",
        target: p.path,
        message: "La page est configurée en 'noindex' mais reste incluse dans sitemap.xml.",
        recommendation: "Désactivez l'inclusion dans le sitemap pour les pages noindex.",
      });
    }
    const prev = seenTitles.get(p.seoTitle.toLowerCase());
    if (prev) {
      warnings.push({
        id: `page-dup-title-${p.path}`,
        severity: "high",
        entityType: "page",
        target: p.path,
        message: `Titre SEO dupliqué avec ${prev}.`,
        recommendation: "Attribuez un titre unique ciblant une intention de recherche distincte.",
      });
    }
    seenTitles.set(p.seoTitle.toLowerCase(), p.path);
  }

  for (const r of mappedRestaurants) {
    if (r.isDuplicateAlias) {
      warnings.push({
        id: `rest-dup-alias-${r.slug}`,
        severity: "info",
        entityType: "restaurant",
        target: `/menu/${r.slug}`,
        message: `Slug doublon détecté (${r.slug}) : automatiquement canonicalisé vers /menu/${r.duplicateTarget} et exclu du sitemap.`,
        recommendation:
          "Le lien reste actif pour ne jamais casser les QR codes imprimés, tout en protégeant Google du contenu dupliqué.",
      });
    }
    if (r.isActive && !r.isDuplicateAlias && !r.address) {
      warnings.push({
        id: `rest-no-address-${r.slug}`,
        severity: "medium",
        entityType: "restaurant",
        target: `/menu/${r.slug}`,
        message: `L'enseigne "${r.name}" n'a pas d'adresse renseignée pour le SEO local (Schema.org PostalAddress).`,
        recommendation: "Ajoutez la ville et le quartier de l'établissement dans la fiche enseigne.",
      });
    }
    if (r.isActive && !r.isDuplicateAlias && !r.coverImage && !r.logo && !r.ogImage) {
      warnings.push({
        id: `rest-no-image-${r.slug}`,
        severity: "medium",
        entityType: "restaurant",
        target: `/menu/${r.slug}`,
        message: `L'enseigne "${r.name}" ne possède ni image de couverture, ni logo, ni image Open Graph.`,
        recommendation: "Ajoutez une photo de couverture ou une image Open Graph pour les partages WhatsApp/Facebook.",
      });
    }
  }

  for (const b of blogPosts) {
    if (b.status === "published" && !b.indexable) {
      warnings.push({
        id: `blog-pub-noindex-${b.slug}`,
        severity: "medium",
        entityType: "blog",
        target: `/blog/${b.slug}`,
        message: `L'article publié "${b.title}" est marqué en 'noindex'.`,
        recommendation: "Activez l'indexation si l'article a été vérifié et validé pour Google.",
      });
    }
  }

  return NextResponse.json({
    pages,
    restaurants: mappedRestaurants,
    blogPosts,
    auditWarnings: warnings,
    conversionStats: {
      totalWhatsAppClicks: totalConversions,
      byPath: conversionsByPath.map((c: any) => ({
        pathname: String(c._id || "/"),
        count: Number(c.count || 0),
      })),
    },
  });
}

export async function PATCH(req: Request) {
  try {
    const currentUser = await requireUser();
    if (currentUser.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDb();
  const body = await req.json();

  if (body.type === "page") {
    const path = String(body.path || "/");
    const updated = await SeoPageConfig.findOneAndUpdate(
      { path },
      {
        path,
        seoTitle: body.seoTitle ?? "",
        metaDescription: body.metaDescription ?? "",
        canonicalUrl: body.canonicalUrl ?? "",
        indexable: Boolean(body.indexable),
        includeInSitemap: Boolean(body.includeInSitemap),
        ogImage: body.ogImage ?? "",
      },
      { upsert: true, new: true }
    );
    revalidatePath(path);
    revalidatePath("/sitemap.xml");
    return NextResponse.json({ message: "SEO de la page mis à jour.", item: updated });
  }

  if (body.type === "restaurant") {
    const updated = await Restaurant.findByIdAndUpdate(
      body.id,
      {
        seoTitle: body.seoTitle ?? "",
        metaDescription: body.metaDescription ?? "",
        canonicalUrl: body.canonicalUrl ?? "",
        indexable: Boolean(body.indexable),
        includeInSitemap: Boolean(body.includeInSitemap),
        ogImage: body.ogImage ?? "",
      },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "Enseigne introuvable." }, { status: 404 });
    }
    revalidatePath(`/menu/${updated.slug}`);
    revalidatePath("/sitemap.xml");
    return NextResponse.json({ message: "SEO de l'enseigne mis à jour.", item: updated });
  }

  if (body.type === "blog") {
    const slug = String(body.slug || "");
    const status = body.status === "published" ? "published" : "draft";
    const updated = await BlogPost.findOneAndUpdate(
      { slug },
      {
        slug,
        title: body.title ?? "",
        excerpt: body.excerpt ?? "",
        status,
        seoTitle: body.seoTitle ?? "",
        metaDescription: body.metaDescription ?? "",
        canonicalUrl: body.canonicalUrl ?? "",
        indexable: Boolean(body.indexable),
        includeInSitemap: Boolean(body.includeInSitemap),
        ogImage: body.ogImage ?? "",
        ...(status === "published" ? { publishedAt: new Date() } : {}),
      },
      { upsert: true, new: true }
    );
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/sitemap.xml");
    return NextResponse.json({ message: "Article de blog mis à jour.", item: updated });
  }

  return NextResponse.json({ error: "Type de mise à jour invalide." }, { status: 400 });
}

