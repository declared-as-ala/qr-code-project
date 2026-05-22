import Link from "next/link";
import { connectDb } from "@/lib/db";
import { Restaurant } from "@/models/Restaurant";
import { User } from "@/models/User";
import { ScanAnalytics } from "@/models/ScanAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Activity, ScanLine, UserPlus, ArrowUpRight, Plus } from "lucide-react";

export default async function AdminPage() {
  await connectDb();
  const [restaurants, users, scans, recent] = await Promise.all([
    Restaurant.countDocuments(),
    User.countDocuments({ role: "restaurant_admin" }),
    ScanAnalytics.countDocuments(),
    Restaurant.find().populate("ownerId", "name email").sort({ createdAt: -1 }).limit(4).lean(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Aperçu général</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-1 text-white">Tableau de bord Super Admin</h1>
        </div>
        <Button asChild className="bg-gradient-gold text-black font-semibold shadow-gold hover:opacity-90 transition-all duration-300 rounded-xl px-5 h-11">
          <Link href="/admin/enseignes/new">
            <Plus className="h-5 w-5 mr-1" />Créer une enseigne
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total enseignes</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Store className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-4xl font-semibold text-white font-display">{restaurants}</p>
            <p className="text-xs text-zinc-500 mt-1">Établissements enregistrés</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">Menus actifs</CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-4xl font-semibold text-white font-display">{restaurants}</p>
            <p className="text-xs text-zinc-500 mt-1">Menus publiés en direct</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">Scans QR</CardTitle>
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <ScanLine className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-4xl font-semibold text-white font-display">{scans}</p>
            <p className="text-xs text-zinc-500 mt-1">Flashs QR cumulés</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">Admins enseigne</CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <UserPlus className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-4xl font-semibold text-white font-display">{users}</p>
            <p className="text-xs text-zinc-500 mt-1">Comptes gestionnaires</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-6 glass-card hover:translate-y-0 hover:border-white/5 hover:box-shadow-none">
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Enseignes récentes</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Derniers établissements créés sur la plateforme</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="hover:bg-white/5 text-primary hover:text-primary">
            <Link href="/admin/enseignes">
              Voir tout <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="divide-y divide-white/5">
          {recent.map((e) => {
            const owner = typeof e.ownerId === "object" && e.ownerId ? (e.ownerId as { name?: string; email?: string }) : null;
            return (
              <div key={String(e._id)} className="py-4 flex items-center gap-4 hover:bg-white/[0.01] px-2 rounded-xl transition-all duration-200">
                <div className="h-11 w-11 rounded-xl bg-gradient-gold flex items-center justify-center font-bold text-black shadow-gold font-display text-sm">
                  {e.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{e.name}</p>
                  <p className="text-xs text-zinc-400 truncate">{owner?.name || "Admin"} · {owner?.email || "-"}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium border ${
                  e.isActive 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" 
                    : "bg-zinc-800/50 text-zinc-400 border-zinc-700/50"
                }`}>
                  {e.isActive ? "Actif" : "Inactif"}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
