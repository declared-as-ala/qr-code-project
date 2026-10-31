"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Form = {
  name: string;
  slug: string;
  establishmentType: "cafe" | "restaurant";
  phone?: string;
  address?: string;
  isActive: boolean;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  indexable: boolean;
  includeInSitemap: boolean;
};

export default function EditEnseignePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<Form>({
    name: "",
    slug: "",
    establishmentType: "restaurant",
    isActive: true,
    seoTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    ogImage: "",
    indexable: true,
    includeInSitemap: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/restaurants/${params.id}`).then(async (res) => {
      if (!res.ok) return;
      const item = await res.json();
      setForm({
        name: item.name || "",
        slug: item.slug || "",
        establishmentType: item.establishmentType || "restaurant",
        phone: item.phone || "",
        address: item.address || "",
        isActive: item.isActive ?? true,
        seoTitle: item.seoTitle || "",
        metaDescription: item.metaDescription || "",
        canonicalUrl: item.canonicalUrl || "",
        ogImage: item.ogImage || "",
        indexable: item.indexable ?? true,
        includeInSitemap: item.includeInSitemap ?? true,
      });
    });
  }, [params.id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/admin/restaurants/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) return toast.error("Mise à jour impossible.");
    toast.success("Enseigne et paramètres SEO mis à jour.");
    router.push("/admin/enseignes");
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Modifier l&apos;enseigne</h1>
        <p className="text-muted-foreground">Ajustez les informations publiques, l&apos;état commercial et le référencement Google (SEO).</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres principaux</CardTitle>
          <CardDescription>Les modifications sont visibles sur le menu public et le dashboard client.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Nom</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <Label>Type</Label>
            <Select
              value={form.establishmentType}
              onValueChange={(v: "cafe" | "restaurant") => setForm({ ...form, establishmentType: v })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cafe">Café</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Téléphone</Label>
            <Input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <Label>Adresse (Ville / Quartier)</Label>
            <Input value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <Label>Statut</Label>
            <Select
              value={form.isActive ? "active" : "inactive"}
              onValueChange={(v) => setForm({ ...form, isActive: v === "active" })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Désactivée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Référencement Google (SEO) & Open Graph</CardTitle>
          <CardDescription>
            Personnalisez le titre, la description, l&apos;URL canonique et l&apos;indexation de la page /menu/{form.slug}.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>Titre SEO personnalisé (laisser vide pour le titre automatique)</Label>
            <Input
              placeholder={`Menu ${form.name} : carte, prix et produits`}
              value={form.seoTitle ?? ""}
              onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Meta Description personnalisée</Label>
            <Input
              placeholder={`Menu digital de ${form.name} en Tunisie : carte complète, produits et prix à jour.`}
              value={form.metaDescription ?? ""}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
            />
          </div>
          <div>
            <Label>URL Canonique (optionnel)</Label>
            <Input
              placeholder={`https://www.clickmenu.tn/menu/${form.slug}`}
              value={form.canonicalUrl ?? ""}
              onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })}
            />
          </div>
          <div>
            <Label>Image Open Graph URL (optionnel)</Label>
            <Input
              placeholder="https://..."
              value={form.ogImage ?? ""}
              onChange={(e) => setForm({ ...form, ogImage: e.target.value })}
            />
          </div>
          <div>
            <Label>Indexation moteurs de recherche</Label>
            <Select
              value={form.indexable ? "index" : "noindex"}
              onValueChange={(v) => setForm({ ...form, indexable: v === "index" })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="index">Indexable (index, follow)</SelectItem>
                <SelectItem value="noindex">Exclure de Google (noindex)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Inclusion dans sitemap.xml</Label>
            <Select
              value={form.includeInSitemap ? "yes" : "no"}
              onValueChange={(v) => setForm({ ...form, includeInSitemap: v === "yes" })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Inclure dans le Sitemap</SelectItem>
                <SelectItem value="no">Exclure du Sitemap</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button disabled={saving} className="bg-primary text-primary-foreground">
        {saving ? "Enregistrement..." : "Enregistrer les modifications"}
      </Button>
    </form>
  );
}
