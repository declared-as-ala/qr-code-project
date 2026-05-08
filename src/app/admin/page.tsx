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
          <p className="text-sm text-muted-foreground">Apercu general</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-1">Tableau de bord Super Admin</h1>
        </div>
        <Button asChild className="bg-gradient-gold text-black font-semibold shadow-gold hover:opacity-90">
          <Link href="/admin/enseignes/new"><Plus className="h-4 w-4 mr-1" />Creer une enseigne</Link>
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="shadow-soft"><CardHeader className="flex-row items-center justify-between"><CardTitle className="text-sm text-muted-foreground">Total enseignes</CardTitle><Store className="h-4 w-4 text-primary" /></CardHeader><CardContent className="text-3xl font-semibold">{restaurants}</CardContent></Card>
        <Card className="shadow-soft"><CardHeader className="flex-row items-center justify-between"><CardTitle className="text-sm text-muted-foreground">Menus actifs</CardTitle><Activity className="h-4 w-4 text-primary" /></CardHeader><CardContent className="text-3xl font-semibold">{restaurants}</CardContent></Card>
        <Card className="shadow-soft"><CardHeader className="flex-row items-center justify-between"><CardTitle className="text-sm text-muted-foreground">Scans QR</CardTitle><ScanLine className="h-4 w-4 text-primary" /></CardHeader><CardContent className="text-3xl font-semibold">{scans}</CardContent></Card>
        <Card className="shadow-soft"><CardHeader className="flex-row items-center justify-between"><CardTitle className="text-sm text-muted-foreground">Admins enseigne</CardTitle><UserPlus className="h-4 w-4 text-primary" /></CardHeader><CardContent className="text-3xl font-semibold">{users}</CardContent></Card>
      </div>

      <Card className="p-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-lg font-semibold">Enseignes recentes</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Derniers etablissements crees sur la plateforme</p>
          </div>
          <Button asChild variant="ghost" size="sm"><Link href="/admin/enseignes">Voir tout <ArrowUpRight className="h-4 w-4 ml-1" /></Link></Button>
        </div>
        <div className="divide-y divide-border">
          {recent.map((e) => {
            const owner = typeof e.ownerId === "object" && e.ownerId ? (e.ownerId as { name?: string; email?: string }) : null;
            return (
              <div key={String(e._id)} className="py-4 flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-gradient-gold" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{e.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{owner?.name || "Admin"} · {owner?.email || "-"}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${e.isActive ? "bg-emerald-500/15 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
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
