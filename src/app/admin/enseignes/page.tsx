"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Plus, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motionPreset } from "@/lib/motion/presets";

type Restaurant = {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  establishmentType?: "cafe" | "restaurant";
  ownerId?: { name?: string; email?: string };
};

export default function AdminEnseignesPage() {
  const [items, setItems] = useState<Restaurant[]>([]);

  async function load() {
    const res = await fetch("/api/admin/restaurants");
    if (!res.ok) return toast.error("Impossible de charger les enseignes.");
    setItems(await res.json());
  }

  async function toggle(restaurant: Restaurant) {
    const res = await fetch(`/api/admin/restaurants/${restaurant._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !restaurant.isActive }),
    });
    if (!res.ok) return toast.error("Mise a jour impossible.");
    toast.success("Statut de l enseigne mis a jour.");
    load();
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const activeCount = useMemo(() => items.filter((i) => i.isActive).length, [items]);

  return (
    <motion.div {...motionPreset} className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Enseignes clientes</h1>
          <p className="text-muted-foreground">Supervisez vos cafes et restaurants, leur statut, et leurs acces administrateurs.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={load}><RefreshCcw className="size-4" />Actualiser</Button>
          <Button asChild className="bg-primary text-primary-foreground"><Link href="/admin/enseignes/new"><Plus className="size-4" />Creer une enseigne</Link></Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card><CardHeader><CardDescription>Total enseignes</CardDescription><CardTitle>{items.length}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription>Actives</CardDescription><CardTitle>{activeCount}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription>Desactivees</CardDescription><CardTitle>{items.length - activeCount}</CardTitle></CardHeader></Card>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building2 className="size-4 text-primary" />Portefeuille enseignes</CardTitle>
          <CardDescription>Acces rapides: edition, activation/desactivation, lien menu public.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Enseigne</TableHead><TableHead>Proprietaire</TableHead><TableHead>Type</TableHead><TableHead>Menu</TableHead><TableHead>Etat</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {items.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.ownerId?.email || "-"}</TableCell>
                  <TableCell>{r.establishmentType === "cafe" ? "Cafe" : "Restaurant"}</TableCell>
                  <TableCell>/menu/{r.slug}</TableCell>
                  <TableCell><Badge className={r.isActive ? "bg-emerald-500/15 text-emerald-300" : "bg-zinc-500/15 text-zinc-300"}>{r.isActive ? "Active" : "Desactivee"}</Badge></TableCell>
                  <TableCell className="flex gap-2">
                    <Button asChild size="sm" variant="outline"><Link href={`/admin/enseignes/${r._id}/edit`}>Modifier</Link></Button>
                    <Button size="sm" variant="outline" onClick={() => toggle(r)}>{r.isActive ? "Desactiver" : "Activer"}</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
