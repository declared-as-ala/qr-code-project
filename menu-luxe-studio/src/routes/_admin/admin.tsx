import { createFileRoute, Link } from "@tanstack/react-router";
import { Store, Activity, ScanLine, UserPlus, BadgeDollarSign, ArrowUpRight, Plus } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { enseignes, recentScansData, monthlySignupsData } from "@/lib/mock-data";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_admin/admin")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const total = enseignes.length;
  const active = enseignes.filter((e) => e.active).length;
  const totalScans = enseignes.reduce((acc, e) => acc + e.scans, 0);
  const newThisMonth = 4;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Aperçu général</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-1">Tableau de bord</h1>
        </div>
        <Button asChild className="bg-gradient-gold text-noir font-semibold shadow-gold hover:opacity-90">
          <Link to="/admin/enseignes/new">
            <Plus className="h-4 w-4 mr-1" /> Créer une enseigne
          </Link>
        </Button>
      </div>

      <motion.div
        initial="hidden" animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          { label: "Total enseignes", value: total, delta: { value: "+12% ce mois", positive: true }, icon: Store },
          { label: "Menus actifs", value: active, delta: { value: "+2 cette semaine", positive: true }, icon: Activity },
          { label: "Scans QR (total)", value: totalScans.toLocaleString("fr-FR"), delta: { value: "+24% vs mois dernier", positive: true }, icon: ScanLine, accent: true },
          { label: "Nouveaux clients (mois)", value: newThisMonth, delta: { value: "+1 vs mois précédent", positive: true }, icon: UserPlus },
        ].map((s, i) => (
          <motion.div key={i} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
            <StatCard {...(s as any)} />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-semibold">Scans QR — 7 derniers jours</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Activité globale toutes enseignes</p>
            </div>
            <div className="text-xs px-2.5 py-1 rounded-full bg-gold/15 text-gold font-semibold">+18%</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recentScansData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="scans" stroke="var(--gold)" strokeWidth={2.5} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-semibold">Revenus</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Mois en cours</p>
            </div>
            <BadgeDollarSign className="h-5 w-5 text-gold" />
          </div>
          <p className="font-display text-4xl font-semibold">14 280 <span className="text-base text-muted-foreground">€</span></p>
          <p className="mt-1 text-sm text-emerald-600">+22% vs mois dernier</p>
          <div className="h-32 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySignupsData}>
                <Bar dataKey="count" fill="var(--gold)" radius={[6, 6, 0, 0]} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-lg font-semibold">Enseignes récentes</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Les dernières enseignes créées</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/enseignes">Voir tout <ArrowUpRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </div>
        <div className="divide-y divide-border">
          {enseignes.slice(0, 4).map((e) => (
            <div key={e.id} className="py-4 flex items-center gap-4">
              <img src={e.logo} alt={e.name} className="h-11 w-11 rounded-xl bg-noir object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{e.name}</p>
                <p className="text-xs text-muted-foreground truncate">{e.owner.name} · {e.owner.email}</p>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-xs text-muted-foreground">Scans</p>
                <p className="font-semibold text-sm">{e.scans.toLocaleString("fr-FR")}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${e.active ? "bg-emerald-500/15 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                {e.active ? "Actif" : "Inactif"}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
