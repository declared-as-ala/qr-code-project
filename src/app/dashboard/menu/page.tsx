"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Pencil,
  ImagePlus,
  Loader2,
  Check,
  X,
  Search,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type Category = { _id: string; name: string; sortOrder?: number };
type Product = {
  _id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  badge?: string;
  isAvailable: boolean;
  sortOrder?: number;
};

const BADGES = ["", "Nouveau", "Populaire", "Promo", "Signature", "Royal", "Ambiance"];

export default function MenuManagerPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    const [cRes, pRes] = await Promise.all([fetch("/api/categories"), fetch("/api/products")]);
    if (cRes.ok) {
      const cats: Category[] = await cRes.json();
      setCategories(cats);
      setActiveCat((cur) => cur ?? cats[0]?._id ?? null);
    }
    if (pRes.ok) setProducts(await pRes.json());
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCat) list = list.filter((p) => p.categoryId === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [products, activeCat, search]);

  // ── category ops ───────────────────────────────────────────────────
  async function addCategory() {
    const name = prompt("Nom de la nouvelle catégorie ?");
    if (!name?.trim()) return;
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), sortOrder: categories.length + 1 }),
    });
    if (res.ok) {
      const c = await res.json();
      setCategories((cs) => [...cs, c]);
      setActiveCat(c._id);
      toast.success("Catégorie ajoutée");
    } else toast.error("Erreur");
  }

  async function renameCategory(c: Category) {
    const name = prompt("Renommer la catégorie", c.name);
    if (!name?.trim() || name === c.name) return;
    const res = await fetch(`/api/categories/${c._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (res.ok) {
      setCategories((cs) => cs.map((x) => (x._id === c._id ? { ...x, name: name.trim() } : x)));
      toast.success("Renommée");
    } else toast.error("Erreur");
  }

  async function deleteCategory(c: Category) {
    const count = products.filter((p) => p.categoryId === c._id).length;
    if (!confirm(`Supprimer "${c.name}"${count ? ` et ses ${count} articles ?` : " ?"}`)) return;
    const res = await fetch(`/api/categories/${c._id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((cs) => cs.filter((x) => x._id !== c._id));
      setProducts((ps) => ps.filter((p) => p.categoryId !== c._id));
      if (activeCat === c._id) setActiveCat(categories[0]?._id ?? null);
      toast.success("Supprimée");
    } else toast.error("Erreur");
  }

  // ── product ops ────────────────────────────────────────────────────
  async function addProduct() {
    if (!activeCat) return toast.error("Choisis d'abord une catégorie");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: activeCat,
        name: "Nouvel article",
        price: 0,
        sortOrder: products.filter((p) => p.categoryId === activeCat).length + 1,
      }),
    });
    if (res.ok) {
      const p = await res.json();
      setProducts((ps) => [...ps, p]);
      toast.success("Article ajouté — clique pour éditer");
    } else toast.error("Erreur");
  }

  function patchLocal(id: string, patch: Partial<Product>) {
    setProducts((ps) => ps.map((p) => (p._id === id ? { ...p, ...patch } : p)));
  }

  async function patchProduct(id: string, patch: Partial<Product>) {
    patchLocal(id, patch);
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      toast.error("Échec de l'enregistrement");
      loadAll();
    }
  }

  async function deleteProduct(p: Product) {
    if (!confirm(`Supprimer "${p.name}" ?`)) return;
    const res = await fetch(`/api/products/${p._id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((ps) => ps.filter((x) => x._id !== p._id));
      toast.success("Supprimé");
    } else toast.error("Erreur");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Chargement du menu…
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 -mt-2">
      {/* ── Categories rail ───────────────────────────────────────────── */}
      <aside className="lg:w-64 shrink-0">
        <div className="rounded-2xl border border-white/5 bg-zinc-950/60 p-3">
          <div className="flex items-center justify-between px-2 pb-3">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Catégories</h2>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-primary/20" onClick={addCategory}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
            {categories.map((c) => {
              const count = products.filter((p) => p.categoryId === c._id).length;
              const active = activeCat === c._id;
              return (
                <div
                  key={c._id}
                  className={`group flex items-center gap-1 rounded-xl px-2 py-2 text-sm transition-colors ${
                    active ? "bg-primary text-primary-foreground" : "text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  <button onClick={() => setActiveCat(c._id)} className="flex-1 text-left truncate">
                    {c.name}
                  </button>
                  <span className={`text-[10px] tabular-nums ${active ? "text-primary-foreground/80" : "text-zinc-500"}`}>
                    {count}
                  </span>
                  <button
                    onClick={() => renameCategory(c)}
                    className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 ${
                      active ? "text-primary-foreground" : "text-zinc-400"
                    }`}
                    title="Renommer"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => deleteCategory(c)}
                    className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 ${
                      active ? "text-primary-foreground" : "text-zinc-400"
                    }`}
                    title="Supprimer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
            {categories.length === 0 && (
              <p className="text-xs text-zinc-500 px-2 py-4">Aucune catégorie. Clique sur +.</p>
            )}
          </div>
        </div>
      </aside>

      {/* ── Product grid ───────────────────────────────────────────────── */}
      <section className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Rechercher un article…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-zinc-950/60 border-white/5"
            />
          </div>
          <Button onClick={addProduct} className="bg-primary text-primary-foreground shrink-0">
            <Plus className="h-4 w-4 mr-1" /> Ajouter
          </Button>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-950/40 p-12 text-center">
            <p className="text-zinc-400 mb-3">Aucun article dans cette catégorie.</p>
            <Button onClick={addProduct} className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-1" /> Créer le premier
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onPatch={(patch) => patchProduct(p._id, patch)}
                onDelete={() => deleteProduct(p)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
function ProductCard({
  product,
  onPatch,
  onDelete,
}: {
  product: Product;
  onPatch: (p: Partial<Product>) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: product.name,
    description: product.description ?? "",
    price: product.price,
    badge: product.badge ?? "",
  });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  function startEdit() {
    setDraft({
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      badge: product.badge ?? "",
    });
    setEditing(true);
  }

  function save() {
    onPatch({
      name: draft.name.trim() || product.name,
      description: draft.description.trim(),
      price: Number(draft.price) || 0,
      badge: draft.badge,
    });
    setEditing(false);
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads/image", { method: "POST", body: fd });
      if (!res.ok) throw new Error("upload failed");
      const { url } = (await res.json()) as { url: string };
      onPatch({ image: url });
      toast.success("Image mise à jour");
    } catch {
      toast.error("Échec de l'upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="group rounded-2xl border border-white/5 bg-zinc-950/60 overflow-hidden hover:border-primary/30 transition-colors">
      {/* image */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="relative block w-full aspect-[4/3] bg-zinc-900 overflow-hidden"
        title="Cliquer pour changer l'image"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-600">
            <ImagePlus className="h-8 w-8" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="px-3 py-1.5 rounded-lg bg-white/95 text-zinc-900 text-xs font-semibold flex items-center gap-1.5">
            {uploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Upload…
              </>
            ) : (
              <>
                <ImagePlus className="h-3.5 w-3.5" /> Changer la photo
              </>
            )}
          </span>
        </div>
        {product.badge ? (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
            {product.badge}
          </span>
        ) : null}
        {!product.isAvailable && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-zinc-900/90 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
            Indisponible
          </span>
        )}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadImage(f);
          e.target.value = "";
        }}
      />

      {/* body */}
      <div className="p-3 space-y-2">
        {editing ? (
          <>
            <Input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="bg-zinc-900 border-white/5 text-sm font-medium"
              placeholder="Nom"
            />
            <Textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              className="bg-zinc-900 border-white/5 text-xs min-h-[60px]"
              placeholder="Description (optionnel)"
            />
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.5"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
                className="bg-zinc-900 border-white/5 text-sm w-24"
              />
              <span className="text-xs text-zinc-500">DT</span>
              <select
                value={draft.badge}
                onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
                className="flex-1 h-9 rounded-md bg-zinc-900 border border-white/5 text-xs text-zinc-200 px-2"
              >
                {BADGES.map((b) => (
                  <option key={b || "none"} value={b}>
                    {b || "Sans badge"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-1.5 pt-1">
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)} className="h-8">
                <X className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" onClick={save} className="bg-primary text-primary-foreground h-8">
                <Check className="h-3.5 w-3.5 mr-1" /> OK
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{product.name}</p>
                {product.description ? (
                  <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{product.description}</p>
                ) : null}
              </div>
              <p className="text-sm font-bold text-primary tabular-nums shrink-0">{product.price} DT</p>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Switch
                  checked={product.isAvailable}
                  onCheckedChange={(v) => onPatch({ isAvailable: v })}
                />
                <span className="text-[11px] text-zinc-500">
                  {product.isAvailable ? "Disponible" : "Indisponible"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" onClick={startEdit} className="h-7 w-7 p-0 text-zinc-400 hover:text-white">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="ghost" onClick={onDelete} className="h-7 w-7 p-0 text-zinc-400 hover:text-red-400 hover:bg-red-500/10">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
