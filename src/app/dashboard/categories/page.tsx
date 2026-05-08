"use client";

import { useEffect, useState } from "react";
import { Plus, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";

type Category = { _id: string; name: string; description?: string; isActive: boolean };

export default function CategoriesPage() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/categories");
    if (res.ok) setCategories(await res.json());
  }

  useEffect(() => {
    fetch("/api/categories").then(async (res) => {
      if (res.ok) setCategories(await res.json());
      setLoading(false);
    });
  }, []);

  async function create() {
    if (!name.trim()) return;
    await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, isActive: true }) });
    toast.success("Categorie ajoutee");
    setName("");
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Categories</h1>
          <p className="text-muted-foreground">Organisez votre menu avec une structure claire et elegante.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="size-4" />
              Nouvelle categorie
            </Button>
          </DialogTrigger>
          <DialogContent className="border-primary/20">
            <DialogHeader>
              <DialogTitle>Ajouter une categorie</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Cafes froids" />
              <Button onClick={create} className="w-full bg-primary text-primary-foreground">
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-primary/15">
        <CardHeader>
          <CardTitle>Liste des categories</CardTitle>
          <CardDescription>Affichage admin pour gerer activation et ordre.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : categories.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Tag className="size-4" />
                </EmptyMedia>
                <EmptyTitle>Aucune categorie</EmptyTitle>
                <EmptyDescription>Commencez par creer votre premiere categorie.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Etat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>
                      <Badge className={c.isActive ? "bg-emerald-500/15 text-emerald-300" : "bg-zinc-500/15 text-zinc-300"}>
                        {c.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
