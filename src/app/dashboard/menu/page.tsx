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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

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

// ─────────────────────────────────────────────────────────────────────
export default function MenuManagerPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Dialog / Sheet state
  const [catDialog, setCatDialog] = useState<{
    open: boolean;
    mode: "add" | "rename";
    cat?: Category;
    value: string;
    saving: boolean;
  }>({ open: false, mode: "add", value: "", saving: false });

  const [deleteCatDialog, setDeleteCatDialog] = useState<{
    open: boolean;
    cat?: Category;
  }>({ open: false });

  const [deleteProductDialog, setDeleteProductDialog] = useState<{
    open: boolean;
    product?: Product;
  }>({ open: false });

  const [editSheet, setEditSheet] = useState<{
    open: boolean;
    product?: Product;
  }>({ open: false });

  // Cover image states
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetch("/api/restaurants/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.coverImage) setCoverImage(data.coverImage);
      })
      .catch(() => {});
  }, []);

  async function handleUploadCover(file: File) {
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads/image", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const { url } = (await res.json()) as { url: string };
      
      const patchRes = await fetch("/api/restaurants/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverImage: url }),
      });
      
      if (patchRes.ok) {
        setCoverImage(url);
        toast.success("Image de couverture mise à jour");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Échec de l'upload de la couverture");
    } finally {
      setUploadingCover(false);
    }
  }

  // ── Data loading ───────────────────────────────────────────────────
  async function loadAll() {
    const [cRes, pRes] = await Promise.all([
      fetch("/api/categories"),
      fetch("/api/products"),
    ]);
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

  // ── Category operations ────────────────────────────────────────────
  async function saveCategoryDialog() {
    const name = catDialog.value.trim();
    if (!name) return;
    setCatDialog((d) => ({ ...d, saving: true }));

    if (catDialog.mode === "add") {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, sortOrder: categories.length + 1 }),
      });
      if (res.ok) {
        const c = await res.json();
        setCategories((cs) => [...cs, c]);
        setActiveCat(c._id);
        toast.success("Catégorie ajoutée");
      } else {
        toast.error("Erreur lors de l'ajout");
      }
    } else if (catDialog.cat) {
      const res = await fetch(`/api/categories/${catDialog.cat._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        setCategories((cs) =>
          cs.map((x) => (x._id === catDialog.cat!._id ? { ...x, name } : x))
        );
        toast.success("Catégorie renommée");
      } else {
        toast.error("Erreur lors du renommage");
      }
    }

    setCatDialog({ open: false, mode: "add", value: "", saving: false });
  }

  async function confirmDeleteCategory() {
    const c = deleteCatDialog.cat;
    if (!c) return;
    const res = await fetch(`/api/categories/${c._id}`, { method: "DELETE" });
    if (res.ok) {
      const remaining = categories.filter((x) => x._id !== c._id);
      setCategories(remaining);
      setProducts((ps) => ps.filter((p) => p.categoryId !== c._id));
      if (activeCat === c._id) setActiveCat(remaining[0]?._id ?? null);
      toast.success("Catégorie supprimée");
    } else {
      toast.error("Erreur lors de la suppression");
    }
    setDeleteCatDialog({ open: false });
  }

  // ── Product operations ─────────────────────────────────────────────
  async function addProduct() {
    if (!activeCat) return toast.error("Sélectionne d'abord une catégorie");
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
      setEditSheet({ open: true, product: p });
    } else {
      toast.error("Erreur lors de la création");
    }
  }

  async function patchProduct(id: string, patch: Partial<Product>) {
    setProducts((ps) => ps.map((p) => (p._id === id ? { ...p, ...patch } : p)));
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

  async function confirmDeleteProduct() {
    const p = deleteProductDialog.product;
    if (!p) return;
    const res = await fetch(`/api/products/${p._id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((ps) => ps.filter((x) => x._id !== p._id));
      toast.success("Article supprimé");
    } else {
      toast.error("Erreur lors de la suppression");
    }
    setDeleteProductDialog({ open: false });
  }

  // ── Loading state ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-zinc-400">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm">Chargement du menu…</p>
      </div>
    );
  }

  const activeCatName = categories.find((c) => c._id === activeCat)?.name;

  return (
    <>
      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-white">Mon Menu</h1>
          {activeCatName && (
            <p className="text-xs text-zinc-500 mt-0.5">
              {activeCatName} · {filtered.length} article{filtered.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Button
          onClick={addProduct}
          className="bg-primary text-primary-foreground h-10 px-4 gap-1.5 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Ajouter</span>
          <span className="sm:hidden">+</span>
        </Button>
      </div>

      {/* ── Cover image quick banner ───────────────────────────────────── */}
      <div 
        className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden border border-white/5 bg-zinc-950/60 mb-6 flex flex-col justify-end p-6 group"
        style={{
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.37)"
        }}
      >
        {coverImage ? (
          <Image 
            src={coverImage} 
            alt="Restaurant Cover" 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
        )}
        
        {/* Dark radial glow overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
        
        {/* Floating change button */}
        <button
          type="button"
          disabled={uploadingCover}
          onClick={() => coverFileRef.current?.click()}
          className="absolute right-4 top-4 z-25 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold bg-black/75 hover:bg-primary text-white border border-white/10 hover:border-primary hover:text-primary-foreground shadow-lg backdrop-blur-md transition-all duration-300 active:scale-[0.97]"
        >
          {uploadingCover ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ImagePlus className="h-3.5 w-3.5" />
          )}
          <span>{uploadingCover ? "Upload…" : "Changer la couverture"}</span>
        </button>
        
        {/* Banner Title Info */}
        <div className="relative z-20 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-zinc-950 shadow-md">
            <div className="h-full w-full flex items-center justify-center bg-gradient-gold text-black font-extrabold text-[11px] tracking-tight">
              COVER
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-white tracking-wide" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
              Photo de couverture
            </h2>
            <p className="text-[11px] text-zinc-300 font-medium" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
              Affichée en grand format sur l'écran d'accueil de votre menu public
            </p>
          </div>
        </div>
        
        {/* Hidden File Input */}
        <input
          ref={coverFileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUploadCover(f);
            e.target.value = "";
          }}
        />
      </div>

      {/* ── Mobile category scroll (hidden on lg+) ─────────────────────── */}
      <div className="lg:hidden mb-4 -mx-4 px-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((c) => {
            const active = activeCat === c._id;
            const count = products.filter((p) => p.categoryId === c._id).length;
            return (
              <div key={c._id} className="shrink-0 flex items-center gap-1">
                <button
                  onClick={() => setActiveCat(c._id)}
                  className={`flex items-center gap-1.5 h-9 px-4 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-zinc-900 text-zinc-300 border border-white/8 hover:border-white/15"
                  }`}
                >
                  {c.name}
                  <span
                    className={`text-[10px] tabular-nums ${
                      active ? "opacity-75" : "text-zinc-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
                {active && (
                  <>
                    <button
                      onClick={() =>
                        setCatDialog({
                          open: true,
                          mode: "rename",
                          cat: c,
                          value: c.name,
                          saving: false,
                        })
                      }
                      className="h-9 w-9 flex items-center justify-center rounded-full bg-zinc-900 border border-white/8 text-zinc-400"
                      title="Renommer"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteCatDialog({ open: true, cat: c })}
                      className="h-9 w-9 flex items-center justify-center rounded-full bg-zinc-900 border border-white/8 text-zinc-400 hover:text-red-400"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            );
          })}
          {/* Add category button */}
          <button
            onClick={() =>
              setCatDialog({ open: true, mode: "add", value: "", saving: false })
            }
            className="shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-zinc-900 border border-white/8 text-zinc-400"
            title="Ajouter une catégorie"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Search ────────────────────────────────────────────────────── */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
        <Input
          placeholder="Rechercher un article…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-zinc-950/60 border-white/5 h-11"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center text-zinc-500 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* ── Main layout ───────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Desktop category sidebar */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 self-start sticky top-20">
          <div className="rounded-2xl border border-white/5 bg-zinc-950/60 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <h2 className="text-xs font-semibold text-white uppercase tracking-wider">
                Catégories
              </h2>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 hover:bg-primary/20 text-zinc-400 hover:text-white"
                onClick={() =>
                  setCatDialog({ open: true, mode: "add", value: "", saving: false })
                }
                title="Ajouter"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-2 space-y-0.5 max-h-[60vh] overflow-y-auto">
              {categories.map((c) => {
                const count = products.filter((p) => p.categoryId === c._id).length;
                const active = activeCat === c._id;
                return (
                  <div
                    key={c._id}
                    className={`group flex items-center gap-1 rounded-xl px-3 py-2.5 text-sm transition-all cursor-pointer ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-zinc-300 hover:bg-white/5 hover:text-white"
                    }`}
                    onClick={() => setActiveCat(c._id)}
                  >
                    <span className="flex-1 truncate font-medium">{c.name}</span>
                    <span
                      className={`text-[10px] tabular-nums mr-1 ${
                        active ? "text-primary-foreground/70" : "text-zinc-600"
                      }`}
                    >
                      {count}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCatDialog({
                          open: true,
                          mode: "rename",
                          cat: c,
                          value: c.name,
                          saving: false,
                        });
                      }}
                      className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/15 transition-opacity ${
                        active ? "text-primary-foreground" : "text-zinc-400"
                      }`}
                      title="Renommer"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteCatDialog({ open: true, cat: c });
                      }}
                      className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/25 transition-opacity ${
                        active ? "text-primary-foreground/80" : "text-zinc-400"
                      }`}
                      title="Supprimer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
              {categories.length === 0 && (
                <p className="text-xs text-zinc-500 px-3 py-4 text-center">
                  Aucune catégorie.
                  <br />
                  Clique sur + pour commencer.
                </p>
              )}
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <section className="flex-1 min-w-0">
          {categories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-950/40 p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-6 w-6 text-zinc-500" />
              </div>
              <p className="text-white font-medium mb-1">Commencez par créer une catégorie</p>
              <p className="text-zinc-500 text-sm mb-4">
                Organisez votre menu par catégories : Boissons, Plats, Desserts…
              </p>
              <Button
                onClick={() =>
                  setCatDialog({ open: true, mode: "add", value: "", saving: false })
                }
                className="bg-primary text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-1.5" /> Créer une catégorie
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-950/40 p-10 text-center">
              <p className="text-zinc-400 mb-3 text-sm">
                {search
                  ? `Aucun résultat pour "${search}"`
                  : "Aucun article dans cette catégorie."}
              </p>
              {!search && (
                <Button
                  onClick={addProduct}
                  className="bg-primary text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-1.5" /> Créer le premier article
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onEdit={() => setEditSheet({ open: true, product: p })}
                  onDelete={() => setDeleteProductDialog({ open: true, product: p })}
                  onToggleAvailable={(v) => patchProduct(p._id, { isAvailable: v })}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Dialogs ───────────────────────────────────────────────────── */}

      {/* Add / Rename category dialog */}
      <Dialog
        open={catDialog.open}
        onOpenChange={(o) => !o && setCatDialog((d) => ({ ...d, open: false }))}
      >
        <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">
              {catDialog.mode === "add" ? "Nouvelle catégorie" : "Renommer la catégorie"}
            </DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            value={catDialog.value}
            onChange={(e) => setCatDialog((d) => ({ ...d, value: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && saveCategoryDialog()}
            placeholder="ex: Boissons, Plats, Desserts…"
            className="bg-zinc-900 border-white/5 h-11 text-white"
          />
          <DialogFooter className="flex-row gap-2 bg-transparent border-none pt-2">
            <Button
              variant="ghost"
              onClick={() => setCatDialog((d) => ({ ...d, open: false }))}
              className="flex-1 border border-white/10 text-zinc-300"
            >
              Annuler
            </Button>
            <Button
              onClick={saveCategoryDialog}
              disabled={!catDialog.value.trim() || catDialog.saving}
              className="flex-1 bg-primary text-primary-foreground"
            >
              {catDialog.saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : (
                <Check className="h-4 w-4 mr-1.5" />
              )}
              {catDialog.mode === "add" ? "Ajouter" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete category confirm */}
      <AlertDialog
        open={deleteCatDialog.open}
        onOpenChange={(o) => !o && setDeleteCatDialog({ open: false })}
      >
        <AlertDialogContent className="bg-zinc-950 border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Supprimer &ldquo;{deleteCatDialog.cat?.name}&rdquo; ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              {(() => {
                const count = products.filter(
                  (p) => p.categoryId === deleteCatDialog.cat?._id
                ).length;
                return count > 0
                  ? `Cette catégorie contient ${count} article${count > 1 ? "s" : ""}. Ils seront tous supprimés.`
                  : "Cette action est irréversible.";
              })()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-zinc-300 bg-transparent hover:bg-white/5">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCategory}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete product confirm */}
      <AlertDialog
        open={deleteProductDialog.open}
        onOpenChange={(o) => !o && setDeleteProductDialog({ open: false })}
      >
        <AlertDialogContent className="bg-zinc-950 border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Supprimer &ldquo;{deleteProductDialog.product?.name}&rdquo; ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-zinc-300 bg-transparent hover:bg-white/5">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProduct}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Product edit bottom sheet */}
      {editSheet.product && (
        <ProductEditSheet
          key={editSheet.product._id}
          product={editSheet.product}
          open={editSheet.open}
          onClose={() => setEditSheet({ open: false })}
          onSave={(patch) => {
            patchProduct(editSheet.product!._id, patch);
            setEditSheet({ open: false });
            toast.success("Article enregistré");
          }}
        />
      )}
    </>
  );
}

// ── ProductCard ──────────────────────────────────────────────────────
function ProductCard({
  product,
  onEdit,
  onDelete,
  onToggleAvailable,
}: {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailable: (v: boolean) => void;
}) {
  return (
    <div className="group rounded-2xl border border-white/5 bg-zinc-950/60 overflow-hidden hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-black/30">
      {/* Image — tapping opens edit */}
      <button
        type="button"
        onClick={onEdit}
        className="relative block w-full aspect-[4/3] bg-zinc-900 overflow-hidden"
        title="Modifier l'article"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-2">
            <ImagePlus className="h-7 w-7" />
            <span className="text-xs">Ajouter une photo</span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="px-3 py-1.5 rounded-lg bg-white/95 text-zinc-900 text-xs font-semibold flex items-center gap-1.5">
            <Pencil className="h-3.5 w-3.5" /> Modifier
          </span>
        </div>
        {product.badge && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow-sm">
            {product.badge}
          </span>
        )}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-zinc-900/90 text-zinc-300 text-xs font-semibold uppercase tracking-wider">
              Indisponible
            </span>
          </div>
        )}
      </button>

      {/* Card body */}
      <div className="p-3.5 space-y-3">
        {/* Name + price */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate leading-snug">
              {product.name}
            </p>
            {product.description && (
              <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>
          <p className="text-sm font-bold text-primary tabular-nums shrink-0">
            {product.price.toFixed(product.price % 1 === 0 ? 0 : 2)} DT
          </p>
        </div>

        {/* Availability + actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onToggleAvailable(!product.isAvailable)}
            className="flex items-center gap-2 group/toggle"
          >
            <Switch
              checked={product.isAvailable}
              onCheckedChange={onToggleAvailable}
              onClick={(e) => e.stopPropagation()}
            />
            <span className="text-xs text-zinc-500 group-hover/toggle:text-zinc-300 transition-colors">
              {product.isAvailable ? "Disponible" : "Indisponible"}
            </span>
          </button>

          <div className="flex items-center gap-1">
            {/* Edit — always visible, 44×44px touch target */}
            <button
              onClick={onEdit}
              className="h-9 w-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/8 transition-colors"
              title="Modifier"
            >
              <Pencil className="h-4 w-4" />
            </button>
            {/* Delete */}
            <button
              onClick={onDelete}
              className="h-9 w-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ProductEditSheet ─────────────────────────────────────────────────
function ProductEditSheet({
  product,
  open,
  onClose,
  onSave,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
  onSave: (patch: Partial<Product>) => void;
}) {
  const [draft, setDraft] = useState({
    name: product.name,
    description: product.description ?? "",
    price: product.price,
    badge: product.badge ?? "",
    isAvailable: product.isAvailable,
    image: product.image ?? "",
  });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads/image", { method: "POST", body: fd });
      if (!res.ok) throw new Error("upload failed");
      const { url } = (await res.json()) as { url: string };
      setDraft((d) => ({ ...d, image: url }));
      toast.success("Photo mise à jour");
    } catch {
      toast.error("Échec de l'upload");
    } finally {
      setUploading(false);
    }
  }

  function save() {
    onSave({
      name: draft.name.trim() || product.name,
      description: draft.description.trim(),
      price: Number(draft.price) || 0,
      badge: draft.badge,
      isAvailable: draft.isAvailable,
      ...(draft.image !== (product.image ?? "") && { image: draft.image || undefined }),
    });
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        className="bg-zinc-950 border-t border-white/10 rounded-t-3xl p-0 flex flex-col"
        style={{ maxHeight: "93dvh" }}
        showCloseButton={false}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-zinc-700" />
        </div>

        {/* Header */}
        <SheetHeader className="px-5 pt-1 pb-4 border-b border-white/5 shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white text-base">
              {product.name === "Nouvel article" ? "Nouvel article" : "Modifier l'article"}
            </SheetTitle>
            <button
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </SheetHeader>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Photo */}
          <div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Photo
            </p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="relative w-full rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden hover:border-primary/40 transition-colors group"
              style={{ aspectRatio: "16/7" }}
            >
              {draft.image ? (
                <Image
                  src={draft.image}
                  alt={draft.name}
                  fill
                  className="object-cover"
                  unoptimized
                  sizes="600px"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-600">
                  <ImagePlus className="h-8 w-8" />
                  <span className="text-sm">Appuyer pour ajouter une photo</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-white/95 text-zinc-900 text-sm font-semibold flex items-center gap-1.5">
                    <ImagePlus className="h-4 w-4" />
                    {draft.image ? "Changer la photo" : "Ajouter une photo"}
                  </span>
                )}
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
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
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Nom *
            </Label>
            <Input
              id="edit-name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="bg-zinc-900 border-white/5 h-12 text-white text-base"
              placeholder="Nom de l'article"
              autoComplete="off"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-desc" className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Description
            </Label>
            <Textarea
              id="edit-desc"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              className="bg-zinc-900 border-white/5 min-h-[90px] text-white text-sm leading-relaxed"
              placeholder="Description de l'article (optionnel)"
            />
          </div>

          {/* Price + Badge */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-price" className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Prix (DT)
              </Label>
              <Input
                id="edit-price"
                type="number"
                step="0.5"
                min="0"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
                className="bg-zinc-900 border-white/5 h-12 text-white text-base"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Badge
              </p>
              <select
                value={draft.badge}
                onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
                className="w-full h-12 rounded-md bg-zinc-900 border border-white/5 text-zinc-200 px-3 text-sm"
              >
                {BADGES.map((b) => (
                  <option key={b || "none"} value={b}>
                    {b || "Sans badge"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Availability toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-white/5">
            <div>
              <p className="text-sm font-medium text-white">Disponible</p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Visible sur le menu public
              </p>
            </div>
            <Switch
              checked={draft.isAvailable}
              onCheckedChange={(v) => setDraft({ ...draft, isAvailable: v })}
            />
          </div>
        </div>

        {/* Footer buttons */}
        <SheetFooter className="px-5 py-4 border-t border-white/5 shrink-0 flex-row gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12 border-white/10 text-zinc-300 bg-transparent hover:bg-white/5"
          >
            Annuler
          </Button>
          <Button
            onClick={save}
            className="flex-1 h-12 bg-primary text-primary-foreground font-semibold"
          >
            <Check className="h-4 w-4 mr-1.5" />
            Enregistrer
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
