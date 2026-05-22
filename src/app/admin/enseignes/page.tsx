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
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold text-white">Enseignes clientes</h1>
          <p className="text-muted-foreground">Supervisez vos cafés et restaurants, leur statut, et leurs accès administrateurs.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-white/5 hover:bg-white/5 text-zinc-300 hover:text-white" onClick={load}>
            <RefreshCcw className="size-4 mr-1" />Actualiser
          </Button>
          <Button asChild className="bg-gradient-gold text-black font-semibold shadow-gold hover:opacity-90 transition-all rounded-xl px-4">
            <Link href="/admin/enseignes/new">
              <Plus className="size-4 mr-1" />Créer une enseigne
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total enseignes</CardDescription>
            <CardTitle className="text-3xl font-semibold text-white font-display mt-1">{items.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-emerald-400">Actives</CardDescription>
            <CardTitle className="text-3xl font-semibold text-white font-display mt-1">{activeCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-zinc-500">Désactivées</CardDescription>
            <CardTitle className="text-3xl font-semibold text-white font-display mt-1">{items.length - activeCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="glass-card overflow-hidden">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-white font-display">
            <Building2 className="size-5 text-primary" />Portefeuille enseignes
          </CardTitle>
          <CardDescription className="text-zinc-400 text-xs">Accès rapides : édition, activation/désactivation, lien menu public.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-950/40">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs py-4 px-6">Enseigne</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs py-4">Propriétaire</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs py-4">Type</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs py-4">Menu Public</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs py-4">État</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs py-4 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((r) => (
                <TableRow key={r._id} className="border-white/5 hover:bg-white/[0.01] transition-colors">
                  <TableCell className="font-semibold text-white py-4 px-6">{r.name}</TableCell>
                  <TableCell className="text-zinc-300 py-4">{r.ownerId?.email || "-"}</TableCell>
                  <TableCell className="text-zinc-300 py-4">
                    <span className={`px-2 py-0.5 rounded text-xs ${r.establishmentType === "cafe" ? "bg-amber-500/10 text-amber-300" : "bg-blue-500/10 text-blue-300"}`}>
                      {r.establishmentType === "cafe" ? "Café" : "Restaurant"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <Link href={`/menu/${r.slug}`} target="_blank" className="text-primary hover:underline font-mono text-xs hover:text-primary-foreground">
                      /menu/{r.slug}
                    </Link>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                      r.isActive 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" 
                        : "bg-zinc-800/50 text-zinc-400 border-zinc-700/50"
                    }`}>
                      {r.isActive ? "Active" : "Désactivée"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-right pr-6">
                    <div className="flex gap-2 justify-end">
                      <Button asChild size="sm" variant="outline" className="border-white/5 hover:bg-white/5 text-zinc-300 hover:text-white rounded-lg">
                        <Link href={`/admin/enseignes/${r._id}/edit`}>Modifier</Link>
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/5 hover:bg-white/5 text-zinc-300 hover:text-white rounded-lg" onClick={() => toggle(r)}>
                        {r.isActive ? "Désactiver" : "Activer"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                    Aucune enseigne disponible.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
