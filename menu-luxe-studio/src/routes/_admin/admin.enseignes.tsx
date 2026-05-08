import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, QrCode, Pencil, Power, Copy, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { enseignes as initial } from "@/lib/mock-data";
import type { Enseigne } from "@/lib/mock-data";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/enseignes")({
  component: EnseignesList,
});

function EnseignesList() {
  const [list, setList] = useState<Enseigne[]>(initial);
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [qrTarget, setQrTarget] = useState<Enseigne | null>(null);

  const filtered = list.filter((e) => {
    if (q && !e.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (type !== "all" && e.type !== type) return false;
    if (status !== "all" && (status === "active" ? !e.active : e.active)) return false;
    return true;
  });

  const toggle = (id: string) => {
    setList(list.map((e) => (e.id === id ? { ...e, active: !e.active } : e)));
    toast.success("Statut mis à jour");
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/menu/${slug}`);
    toast.success("Lien copié dans le presse-papier");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Toutes vos enseignes</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-1">Enseignes</h1>
        </div>
        <Button asChild className="bg-gradient-gold text-noir font-semibold shadow-gold hover:opacity-90">
          <Link to="/admin/enseignes/new">
            <Plus className="h-4 w-4 mr-1" /> Créer une enseigne
          </Link>
        </Button>
      </div>

      <Card className="p-4 shadow-soft">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une enseigne..." className="pl-10" />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[160px]"><Filter className="h-4 w-4 mr-1" /><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="cafe">Café</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Enseigne</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Propriétaire</th>
                <th className="text-left px-4 py-3 font-medium">Lien menu</th>
                <th className="text-left px-4 py-3 font-medium">Statut</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={e.logo} alt={e.name} className="h-10 w-10 rounded-xl bg-noir" />
                      <div>
                        <p className="font-medium">{e.name}</p>
                        <p className="text-xs text-muted-foreground">{e.address.split(",")[1]?.trim() ?? "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium capitalize">{e.type === "cafe" ? "Café" : "Restaurant"}</span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium">{e.owner.name}</p>
                    <p className="text-xs text-muted-foreground">{e.owner.email}</p>
                  </td>
                  <td className="px-4 py-4">
                    <button onClick={() => copyLink(e.slug)} className="inline-flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-md bg-muted hover:bg-muted/70">
                      /menu/{e.slug} <Copy className="h-3 w-3" />
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${e.active ? "bg-emerald-500/15 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                      {e.active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setQrTarget(e)}>
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to="/admin/enseignes/new"><Pencil className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toggle(e.id)}>
                        <Power className={`h-4 w-4 ${e.active ? "text-emerald-600" : "text-muted-foreground"}`} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-16 text-muted-foreground">Aucune enseigne ne correspond à vos critères.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!qrTarget} onOpenChange={(o) => !o && setQrTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>QR Code — {qrTarget?.name}</DialogTitle>
            <DialogDescription>Imprimez ce QR sur la plaque de table.</DialogDescription>
          </DialogHeader>
          {qrTarget && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="p-4 rounded-2xl bg-white border-4 border-gold/30">
                <QRCodeCanvas value={`${typeof window !== "undefined" ? window.location.origin : ""}/menu/${qrTarget.slug}`} size={220} fgColor="#1a1a1a" />
              </div>
              <p className="font-mono text-xs text-muted-foreground">/menu/{qrTarget.slug}</p>
              <Button className="w-full bg-gradient-gold text-noir font-semibold">Télécharger le QR code</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
