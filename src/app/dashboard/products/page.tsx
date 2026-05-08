"use client";

import { useEffect, useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

type Product = { _id: string; name: string; price: number; isAvailable: boolean; badge?: string };
type Category = { _id: string; name: string };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", price: 0, categoryId: "", badge: "", isAvailable: true });
  const [loading, setLoading] = useState(true);

  async function load() {
    const [p, c] = await Promise.all([fetch("/api/products"), fetch("/api/categories")]);
    if (p.ok) setProducts(await p.json());
    if (c.ok) {
      const list = await c.json();
      setCategories(list);
      if (!form.categoryId && list[0]) setForm((s) => ({ ...s, categoryId: list[0]._id }));
    }
  }

  useEffect(() => {
    Promise.all([fetch("/api/products"), fetch("/api/categories")]).then(async ([p, c]) => {
      if (p.ok) setProducts(await p.json());
      if (c.ok) {
        const list = await c.json();
        setCategories(list);
        if (list[0]) setForm((s) => ({ ...s, categoryId: s.categoryId || list[0]._id }));
      }
      setLoading(false);
    });
  }, []);

  async function create() {
    if (!form.name.trim() || !form.categoryId) return;
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, badge: form.badge === "none" ? "" : form.badge }),
    });
    toast.success("Produit ajoute");
    setForm({ ...form, name: "", price: 0 });
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Produits</h1>
          <p className="text-muted-foreground">Managez vos plats, badges et disponibilites.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground">
              <Plus className="size-4" />
              Ajouter un produit
            </Button>
          </DialogTrigger>
          <DialogContent className="border-primary/20">
            <DialogHeader>
              <DialogTitle>Nouveau produit</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <Input placeholder="Nom produit" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Prix" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              <Select value={form.categoryId} onValueChange={(value) => setForm({ ...form, categoryId: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir categorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={form.badge} onValueChange={(value) => setForm({ ...form, badge: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Badge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun badge</SelectItem>
                  <SelectItem value="Nouveau">Nouveau</SelectItem>
                  <SelectItem value="Populaire">Populaire</SelectItem>
                  <SelectItem value="Promo">Promo</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={create} className="bg-primary text-primary-foreground">
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="table">
        <TabsList className="grid w-full max-w-sm grid-cols-2">
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <Card className="border-primary/15">
            <CardHeader>
              <CardTitle>Inventaire produits</CardTitle>
              <CardDescription>Vue compacte pour gestion rapide.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Badge</TableHead>
                      <TableHead>Etat</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p._id}>
                        <TableCell>{p.name}</TableCell>
                        <TableCell>{p.price} TND</TableCell>
                        <TableCell>
                          {p.badge ? <Badge className="bg-primary/10 text-primary">{p.badge}</Badge> : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge className={p.isAvailable ? "bg-emerald-500/15 text-emerald-300" : "bg-zinc-500/15 text-zinc-300"}>
                            {p.isAvailable ? "Disponible" : "Indisponible"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cards">
          <div className="grid gap-3 md:grid-cols-2">
            {products.map((p) => (
              <Card key={p._id} className="border-primary/15 bg-gradient-to-b from-background to-card">
                <CardHeader>
                  <CardTitle className="text-base">{p.name}</CardTitle>
                  <CardDescription>{p.price} TND</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Badge className={p.badge ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}>{p.badge || "Sans badge"}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Sparkles className="size-3.5 text-primary" />
                    {p.isAvailable ? "Disponible" : "Indisponible"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
