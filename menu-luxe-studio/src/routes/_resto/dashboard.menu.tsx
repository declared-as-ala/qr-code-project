import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Pencil, Trash2, GripVertical, ImagePlus, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { categories as initialCats, products as initialProds } from "@/lib/mock-data";
import type { Product, Category, Badge } from "@/lib/mock-data";
import { BadgePill } from "@/components/BadgePill";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/_resto/dashboard/menu")({
  component: MenuManager,
});

function MenuManager() {
  const enseigneId = useAuth((s) => s.enseigneId) ?? "ens_1";
  const [cats, setCats] = useState<Category[]>(initialCats.filter((c) => c.enseigneId === enseigneId));
  const [prods, setProds] = useState<Product[]>(initialProds.filter((p) => p.enseigneId === enseigneId));
  const [activeCat, setActiveCat] = useState<string | "all">(cats[0]?.id ?? "all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [newCatOpen, setNewCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [confirmDel, setConfirmDel] = useState<Product | null>(null);

  const visibleProducts = prods.filter((p) => {
    if (activeCat !== "all" && p.categoryId !== activeCat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const addCategory = () => {
    if (!newCatName.trim()) return;
    setCats([...cats, { id: `cat_${Date.now()}`, enseigneId, name: newCatName.trim(), order: cats.length + 1 }]);
    setNewCatName("");
    setNewCatOpen(false);
    toast.success("Catégorie ajoutée");
  };

  const saveProduct = (p: Product) => {
    if (prods.find((x) => x.id === p.id)) {
      setProds(prods.map((x) => (x.id === p.id ? p : x)));
      toast.success("Article mis à jour");
    } else {
      setProds([...prods, p]);
      toast.success("Article ajouté");
    }
    setEditing(null);
    setCreating(false);
  };

  const deleteProduct = (id: string) => {
    setProds(prods.filter((p) => p.id !== id));
    toast.success("Article supprimé");
    setConfirmDel(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Gérez votre menu digital</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-1">Articles du menu</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setNewCatOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Catégorie
          </Button>
          <Button onClick={() => { setCreating(true); setEditing({
            id: `p_${Date.now()}`, enseigneId, categoryId: activeCat === "all" ? cats[0]?.id ?? "" : activeCat,
            name: "", description: "", price: 0, image: "", available: true, featured: false,
          }); }} className="bg-gradient-gold text-noir font-semibold shadow-gold hover:opacity-90">
            <Plus className="h-4 w-4 mr-1" /> Ajouter un article
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Categories */}
        <Card className="p-3 shadow-soft h-fit lg:sticky lg:top-20">
          <div className="px-2 py-2 text-xs uppercase tracking-wider text-muted-foreground font-medium">Catégories</div>
          <div className="space-y-1">
            <button
              onClick={() => setActiveCat("all")}
              className={cn("w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors",
                activeCat === "all" ? "bg-gradient-gold text-noir font-semibold" : "hover:bg-muted")}
            >
              <span>Tous les articles</span>
              <span className="text-xs opacity-70">{prods.length}</span>
            </button>
            {cats.map((c) => {
              const count = prods.filter((p) => p.categoryId === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.id)}
                  className={cn("group w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors",
                    activeCat === c.id ? "bg-gradient-gold text-noir font-semibold" : "hover:bg-muted")}
                >
                  <GripVertical className="h-3.5 w-3.5 opacity-40 group-hover:opacity-70" />
                  <span className="flex-1">{c.name}</span>
                  <span className="text-xs opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Products */}
        <div className="space-y-4">
          <Card className="p-3 shadow-soft">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un article..." className="pl-10 border-0 bg-transparent focus-visible:ring-0" />
            </div>
          </Card>

          {visibleProducts.length === 0 ? (
            <Card className="p-12 text-center shadow-soft">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-gold/10 text-gold flex items-center justify-center mb-4">
                <ImagePlus className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-semibold">Aucun article ajouté pour le moment</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                Ajoutez vos premiers produits pour publier votre menu digital.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence>
                {visibleProducts.map((p) => (
                  <motion.div key={p.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="overflow-hidden shadow-soft hover:shadow-elegant transition-all group">
                      <div className="relative aspect-[4/3] bg-muted">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            <ImagePlus className="h-8 w-8" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2 flex gap-1.5">
                          {p.badge && <BadgePill badge={p.badge} />}
                          {p.featured && (
                            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-noir/80 text-gold">
                              <Star className="h-2.5 w-2.5 mr-1" /> Mis en avant
                            </span>
                          )}
                        </div>
                        {!p.available && (
                          <div className="absolute inset-0 bg-noir/70 flex items-center justify-center">
                            <span className="text-cream text-xs font-semibold uppercase tracking-wider">Indisponible</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium leading-snug">{p.name}</h4>
                          <p className="font-display text-lg font-semibold text-gold whitespace-nowrap">{p.price} DH</p>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                        <div className="mt-4 flex gap-1 -mb-1">
                          <Button variant="ghost" size="sm" onClick={() => setEditing(p)}>
                            <Pencil className="h-3.5 w-3.5 mr-1" /> Modifier
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setConfirmDel(p)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Product editor */}
      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) { setEditing(null); setCreating(false); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{creating ? "Ajouter un article" : "Modifier l'article"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <ProductForm
              product={editing}
              categories={cats}
              onSave={saveProduct}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add category */}
      <Dialog open={newCatOpen} onOpenChange={setNewCatOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Nouvelle catégorie</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <Label>Nom de la catégorie</Label>
            <Input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Ex: Desserts" autoFocus />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewCatOpen(false)}>Annuler</Button>
            <Button onClick={addCategory} className="bg-gradient-gold text-noir font-semibold">Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm delete */}
      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet article ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. « {confirmDel?.name} » sera définitivement retiré du menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDel && deleteProduct(confirmDel.id)} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ProductForm({ product, categories, onSave }: {
  product: Product; categories: Category[]; onSave: (p: Product) => void;
}) {
  const [p, setP] = useState(product);
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Nom de l'article</Label>
        <Input value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} placeholder="Ex: Tartare de saumon" />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea rows={2} value={p.description} onChange={(e) => setP({ ...p, description: e.target.value })} placeholder="Description courte..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Prix (DH)</Label>
          <Input type="number" value={p.price} onChange={(e) => setP({ ...p, price: Number(e.target.value) })} />
        </div>
        <div className="space-y-2">
          <Label>Catégorie</Label>
          <Select value={p.categoryId} onValueChange={(v) => setP({ ...p, categoryId: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>URL de l'image</Label>
        <Input value={p.image} onChange={(e) => setP({ ...p, image: e.target.value })} placeholder="https://..." />
      </div>
      <div className="space-y-2">
        <Label>Badge</Label>
        <Select value={p.badge ?? "none"} onValueChange={(v) => setP({ ...p, badge: v === "none" ? undefined : (v as Badge) })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucun</SelectItem>
            <SelectItem value="nouveau">Nouveau</SelectItem>
            <SelectItem value="populaire">Populaire</SelectItem>
            <SelectItem value="promo">Promo</SelectItem>
            <SelectItem value="signature">Signature</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <div>
          <p className="text-sm font-medium">Disponible</p>
          <p className="text-xs text-muted-foreground">Affiché aux clients</p>
        </div>
        <Switch checked={p.available} onCheckedChange={(v) => setP({ ...p, available: v })} />
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <div>
          <p className="text-sm font-medium">Mis en avant</p>
          <p className="text-xs text-muted-foreground">Affiché dans la section vedette</p>
        </div>
        <Switch checked={p.featured} onCheckedChange={(v) => setP({ ...p, featured: v })} />
      </div>
      <DialogFooter>
        <Button onClick={() => onSave(p)} className="bg-gradient-gold text-noir font-semibold w-full">
          Enregistrer
        </Button>
      </DialogFooter>
    </div>
  );
}
