"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BookOpen,
  Building2,
  CheckCircle2,
  ExternalLink,
  Globe,
  MessageSquare,
  RefreshCcw,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PageSeoItem = {
  path: string;
  label: string;
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  indexable: boolean;
  includeInSitemap: boolean;
  ogImage: string;
};

type RestaurantSeoItem = {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  address: string;
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  indexable: boolean;
  includeInSitemap: boolean;
  ogImage: string;
  isDuplicateAlias: boolean;
  duplicateTarget: string | null;
};

type BlogSeoItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  targetKeyword: string;
  searchIntent: string;
  status: "published" | "draft";
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  indexable: boolean;
  includeInSitemap: boolean;
  ogImage: string;
};

type AuditWarning = {
  id: string;
  severity: "high" | "medium" | "info";
  entityType: "page" | "restaurant" | "blog";
  target: string;
  message: string;
  recommendation: string;
};

type ConversionStats = {
  totalWhatsAppClicks: number;
  byPath: { pathname: string; count: number }[];
};

export default function AdminSeoPage() {
  const [tab, setTab] = useState<"audit" | "pages" | "blog" | "restaurants">("audit");
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<PageSeoItem[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantSeoItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogSeoItem[]>([]);
  const [warnings, setWarnings] = useState<AuditWarning[]>([]);
  const [conversions, setConversions] = useState<ConversionStats>({
    totalWhatsAppClicks: 0,
    byPath: [],
  });
  const [savingKey, setSavingKey] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    const res = await fetch("/api/admin/seo");
    setLoading(false);
    if (!res.ok) {
      toast.error("Impossible de charger les données SEO.");
      return;
    }
    const data = await res.json();
    setPages(data.pages || []);
    setRestaurants(data.restaurants || []);
    setBlogPosts(data.blogPosts || []);
    setWarnings(data.auditWarnings || []);
    setConversions(data.conversionStats || { totalWhatsAppClicks: 0, byPath: [] });
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  async function savePage(item: PageSeoItem) {
    setSavingKey(`page-${item.path}`);
    const res = await fetch("/api/admin/seo", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "page", ...item }),
    });
    setSavingKey(null);
    if (!res.ok) return toast.error("Échec de la sauvegarde.");
    toast.success(`SEO mis à jour pour ${item.path}`);
    loadData();
  }

  async function saveBlog(item: BlogSeoItem) {
    setSavingKey(`blog-${item.slug}`);
    const res = await fetch("/api/admin/seo", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "blog", ...item }),
    });
    setSavingKey(null);
    if (!res.ok) return toast.error("Échec de la sauvegarde de l'article.");
    toast.success(`Article "${item.slug}" mis à jour.`);
    loadData();
  }

  async function saveRestaurant(item: RestaurantSeoItem) {
    setSavingKey(`rest-${item._id}`);
    const res = await fetch("/api/admin/seo", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "restaurant",
        id: item._id,
        seoTitle: item.seoTitle,
        metaDescription: item.metaDescription,
        canonicalUrl: item.canonicalUrl,
        indexable: item.indexable,
        includeInSitemap: item.includeInSitemap,
        ogImage: item.ogImage,
      }),
    });
    setSavingKey(null);
    if (!res.ok) return toast.error("Échec de la mise à jour de l'enseigne.");
    toast.success(`SEO enseigne "${item.name}" enregistré.`);
    loadData();
  }

  const publishedBlogCount = blogPosts.filter((b) => b.status === "published").length;
  const indexablePagesCount = pages.filter((p) => p.indexable).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Pilotage SEO & Conversions
          </p>
          <h1 className="font-display text-3xl font-semibold text-white mt-1">
            Centre de Gestion SEO, Sitemap & Blog
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Contrôlez vos balises meta, URLs canoniques, indexation, Open Graph, articles de blog et alertes d&apos;audit.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={loadData}
            disabled={loading}
            className="border-white/10 text-zinc-200 hover:bg-white/5"
          >
            <RefreshCcw className="h-4 w-4 mr-1.5" />
            Actualiser
          </Button>
          <Button asChild className="bg-gradient-gold text-black font-semibold">
            <Link href="/sitemap.xml" target="_blank">
              Voir sitemap.xml <ExternalLink className="h-4 w-4 ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Pages Commerciales Indexables
            </CardDescription>
            <CardTitle className="text-3xl font-semibold text-white font-display mt-1">
              {indexablePagesCount} / {pages.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Articles Publiés (Plan 30)
            </CardDescription>
            <CardTitle className="text-3xl font-semibold text-white font-display mt-1">
              {publishedBlogCount} / {blogPosts.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Avertissements d&apos;Audit SEO
            </CardDescription>
            <CardTitle className="text-3xl font-semibold text-white font-display mt-1">
              {warnings.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Clics Conversion WhatsApp
            </CardDescription>
            <CardTitle className="text-3xl font-semibold text-white font-display mt-1">
              {conversions.totalWhatsAppClicks}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {[
          { id: "audit", label: `Audit SEO & Conversions (${warnings.length})`, icon: AlertTriangle },
          { id: "pages", label: `Pages Commerciales (${pages.length})`, icon: Globe },
          { id: "blog", label: `Plan Éditorial Blog (${blogPosts.length})`, icon: BookOpen },
          { id: "restaurants", label: `Menus Enseignes (${restaurants.length})`, icon: Building2 },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id as typeof tab)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              tab === t.id
                ? "bg-gradient-gold text-black shadow-gold"
                : "bg-zinc-900/60 text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: AUDIT WARNINGS & WHATSAPP CONVERSIONS */}
      {tab === "audit" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="glass-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white font-display">
                Diagnostic & Alertes d&apos;Audit SEO
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Vérifications automatiques des titres, descriptions, doublons de slugs, indexation et données structurées locales.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {warnings.length === 0 ? (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  Aucune anomalie SEO critique détectée.
                </div>
              ) : (
                warnings.map((w) => (
                  <div
                    key={w.id}
                    className={`rounded-xl border p-4 ${
                      w.severity === "high"
                        ? "border-red-500/30 bg-red-500/10"
                        : w.severity === "medium"
                        ? "border-amber-500/30 bg-amber-500/10"
                        : "border-blue-500/30 bg-blue-500/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-white">{w.target}</span>
                      <span className="rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-200">
                        {w.severity === "high" ? "Priorité Haute" : w.severity === "medium" ? "Avertissement" : "Info"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-zinc-100">{w.message}</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      <strong>Action recommandée :</strong> {w.recommendation}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white font-display">
                <MessageSquare className="h-4 w-4 text-primary" />
                Conversions WhatsApp par Page
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Pages générant le plus de clics vers WhatsApp (+216 97 991 266).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {conversions.byPath.length === 0 ? (
                <p className="text-xs text-zinc-500">
                  Les clics sur les boutons WhatsApp des pages publiques s&apos;afficheront ici automatiquement.
                </p>
              ) : (
                conversions.byPath.map((row) => (
                  <div
                    key={row.pathname}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900/50 px-3.5 py-2.5 text-xs"
                  >
                    <span className="font-mono text-zinc-200 truncate">{row.pathname}</span>
                    <span className="rounded-full bg-primary/20 px-2.5 py-0.5 font-bold text-primary">
                      {row.count} clic{row.count > 1 ? "s" : ""}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: COMMERCIAL & CORE PAGES SEO */}
      {tab === "pages" && (
        <div className="space-y-4">
          {pages.map((p, idx) => (
            <Card key={p.path} className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg text-white font-display">{p.label}</CardTitle>
                    <CardDescription className="font-mono text-xs text-primary">
                      {p.path}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild size="sm" variant="outline" className="border-white/10 text-zinc-300">
                      <Link href={p.path} target="_blank">
                        Ouvrir <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      disabled={savingKey === `page-${p.path}`}
                      onClick={() => savePage(p)}
                      className="bg-gradient-gold text-black font-semibold"
                    >
                      <Save className="h-3.5 w-3.5 mr-1.5" />
                      {savingKey === `page-${p.path}` ? "Sauvegarde..." : "Enregistrer"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label className="text-xs text-zinc-400">
                    Titre SEO ({p.seoTitle.length} caractères)
                  </Label>
                  <Input
                    value={p.seoTitle}
                    onChange={(e) => {
                      const next = [...pages];
                      next[idx] = { ...p, seoTitle: e.target.value };
                      setPages(next);
                    }}
                    className="mt-1 bg-zinc-900/70 border-white/10 text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-xs text-zinc-400">
                    Meta Description ({p.metaDescription.length} caractères)
                  </Label>
                  <Input
                    value={p.metaDescription}
                    onChange={(e) => {
                      const next = [...pages];
                      next[idx] = { ...p, metaDescription: e.target.value };
                      setPages(next);
                    }}
                    className="mt-1 bg-zinc-900/70 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-xs text-zinc-400">URL Canonique</Label>
                  <Input
                    value={p.canonicalUrl}
                    onChange={(e) => {
                      const next = [...pages];
                      next[idx] = { ...p, canonicalUrl: e.target.value };
                      setPages(next);
                    }}
                    className="mt-1 bg-zinc-900/70 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-xs text-zinc-400">Image Open Graph URL (optionnel)</Label>
                  <Input
                    value={p.ogImage}
                    placeholder="https://www.clickmenu.tn/opengraph-image"
                    onChange={(e) => {
                      const next = [...pages];
                      next[idx] = { ...p, ogImage: e.target.value };
                      setPages(next);
                    }}
                    className="mt-1 bg-zinc-900/70 border-white/10 text-white"
                  />
                </div>
                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={p.indexable}
                      onChange={(e) => {
                        const next = [...pages];
                        next[idx] = { ...p, indexable: e.target.checked };
                        setPages(next);
                      }}
                    />
                    Indexable par Google (index, follow)
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={p.includeInSitemap}
                      onChange={(e) => {
                        const next = [...pages];
                        next[idx] = { ...p, includeInSitemap: e.target.checked };
                        setPages(next);
                      }}
                    />
                    Inclure dans sitemap.xml
                  </label>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 3: BLOG & 30-ARTICLE EDITORIAL PLAN */}
      {tab === "blog" && (
        <div className="space-y-4">
          {blogPosts.map((post, idx) => (
            <Card key={post.slug} className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400">#{post.id}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          post.status === "published"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {post.status === "published" ? "Publié" : "Brouillon (Plan Éditorial)"}
                      </span>
                      <span className="text-xs text-primary font-semibold">{post.category}</span>
                    </div>
                    <CardTitle className="text-base text-white font-display mt-1">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-zinc-400">
                      Mot-clé cible : <strong>{post.targetKeyword}</strong> · URL : /blog/{post.slug}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.status === "published" && (
                      <Button asChild size="sm" variant="outline" className="border-white/10 text-zinc-300">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          Voir <ExternalLink className="h-3.5 w-3.5 ml-1" />
                        </Link>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      disabled={savingKey === `blog-${post.slug}`}
                      onClick={() => saveBlog(post)}
                      className="bg-gradient-gold text-black font-semibold"
                    >
                      <Save className="h-3.5 w-3.5 mr-1.5" />
                      {savingKey === `blog-${post.slug}` ? "Sauvegarde..." : "Enregistrer"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-xs text-zinc-400">Titre SEO</Label>
                  <Input
                    value={post.seoTitle}
                    onChange={(e) => {
                      const next = [...blogPosts];
                      next[idx] = { ...post, seoTitle: e.target.value };
                      setBlogPosts(next);
                    }}
                    className="mt-1 bg-zinc-900/70 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-xs text-zinc-400">Meta Description</Label>
                  <Input
                    value={post.metaDescription}
                    onChange={(e) => {
                      const next = [...blogPosts];
                      next[idx] = { ...post, metaDescription: e.target.value };
                      setBlogPosts(next);
                    }}
                    className="mt-1 bg-zinc-900/70 border-white/10 text-white"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-6 md:col-span-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={post.status === "published"}
                      onChange={(e) => {
                        const isPub = e.target.checked;
                        const next = [...blogPosts];
                        next[idx] = {
                          ...post,
                          status: isPub ? "published" : "draft",
                          indexable: isPub,
                          includeInSitemap: isPub,
                        };
                        setBlogPosts(next);
                      }}
                    />
                    Publier l&apos;article sur /blog
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={post.indexable}
                      onChange={(e) => {
                        const next = [...blogPosts];
                        next[idx] = { ...post, indexable: e.target.checked };
                        setBlogPosts(next);
                      }}
                    />
                    Indexable (index, follow)
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={post.includeInSitemap}
                      onChange={(e) => {
                        const next = [...blogPosts];
                        next[idx] = { ...post, includeInSitemap: e.target.checked };
                        setBlogPosts(next);
                      }}
                    />
                    Inclure dans sitemap.xml
                  </label>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 4: RESTAURANT MENUS SEO */}
      {tab === "restaurants" && (
        <div className="space-y-4">
          {restaurants.map((r, idx) => (
            <Card key={r._id} className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg text-white font-display">{r.name}</CardTitle>
                      {r.isDuplicateAlias && (
                        <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                          Alias doublon → /menu/{r.duplicateTarget}
                        </span>
                      )}
                    </div>
                    <CardDescription className="font-mono text-xs text-primary">
                      /menu/{r.slug}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild size="sm" variant="outline" className="border-white/10 text-zinc-300">
                      <Link href={`/menu/${r.slug}`} target="_blank">
                        Menu <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      disabled={savingKey === `rest-${r._id}`}
                      onClick={() => saveRestaurant(r)}
                      className="bg-gradient-gold text-black font-semibold"
                    >
                      <Save className="h-3.5 w-3.5 mr-1.5" />
                      {savingKey === `rest-${r._id}` ? "Sauvegarde..." : "Enregistrer"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-xs text-zinc-400">Titre SEO</Label>
                  <Input
                    value={r.seoTitle}
                    onChange={(e) => {
                      const next = [...restaurants];
                      next[idx] = { ...r, seoTitle: e.target.value };
                      setRestaurants(next);
                    }}
                    className="mt-1 bg-zinc-900/70 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-xs text-zinc-400">Meta Description</Label>
                  <Input
                    value={r.metaDescription}
                    onChange={(e) => {
                      const next = [...restaurants];
                      next[idx] = { ...r, metaDescription: e.target.value };
                      setRestaurants(next);
                    }}
                    className="mt-1 bg-zinc-900/70 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-xs text-zinc-400">URL Canonique</Label>
                  <Input
                    value={r.canonicalUrl}
                    onChange={(e) => {
                      const next = [...restaurants];
                      next[idx] = { ...r, canonicalUrl: e.target.value };
                      setRestaurants(next);
                    }}
                    className="mt-1 bg-zinc-900/70 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-xs text-zinc-400">Image Open Graph URL</Label>
                  <Input
                    value={r.ogImage}
                    onChange={(e) => {
                      const next = [...restaurants];
                      next[idx] = { ...r, ogImage: e.target.value };
                      setRestaurants(next);
                    }}
                    className="mt-1 bg-zinc-900/70 border-white/10 text-white"
                  />
                </div>
                <div className="flex items-center gap-6 md:col-span-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={r.indexable}
                      onChange={(e) => {
                        const next = [...restaurants];
                        next[idx] = { ...r, indexable: e.target.checked };
                        setRestaurants(next);
                      }}
                    />
                    Indexable (index, follow)
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={r.includeInSitemap}
                      onChange={(e) => {
                        const next = [...restaurants];
                        next[idx] = { ...r, includeInSitemap: e.target.checked };
                        setRestaurants(next);
                      }}
                    />
                    Inclure dans sitemap.xml
                  </label>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

