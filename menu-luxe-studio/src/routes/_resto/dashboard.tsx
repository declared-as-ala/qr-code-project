import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Eye, Download, FolderTree, Utensils, ScanLine, Clock, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { useAuth } from "@/lib/auth-store";
import { categories, products, enseignes } from "@/lib/mock-data";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_resto/dashboard")({
  component: RestoDashboard,
});

function RestoDashboard() {
  const enseigneId = useAuth((s) => s.enseigneId) ?? "ens_1";
  const enseigne = enseignes.find((e) => e.id === enseigneId)!;
  const cats = categories.filter((c) => c.enseigneId === enseigneId);
  const prods = products.filter((p) => p.enseigneId === enseigneId);

  return (
    <div className="space-y-8">
      <Card className="relative overflow-hidden p-8 sm:p-10 bg-gradient-noir text-cream border-transparent shadow-elegant">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-gold">Bienvenue</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold">
            Bonjour, {enseigne.owner.name.split(" ")[0]} ✦
          </h1>
          <p className="mt-2 text-cream/70 max-w-xl">
            Votre menu digital de <span className="text-gold font-medium">{enseigne.name}</span> est en ligne et prêt à être scanné.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-gradient-gold text-noir font-semibold shadow-gold hover:opacity-90">
              <Link to="/menu/$slug" params={{ slug: enseigne.slug }}>
                <Eye className="h-4 w-4 mr-1" /> Voir le menu public
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent border-cream/30 text-cream hover:bg-cream/10 hover:text-cream">
              <Link to="/dashboard/qr-code"><Download className="h-4 w-4 mr-1" /> Télécharger le QR code</Link>
            </Button>
          </div>
        </div>
      </Card>

      <motion.div
        initial="hidden" animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          { label: "Catégories", value: cats.length, icon: FolderTree },
          { label: "Articles", value: prods.length, icon: Utensils },
          { label: "Scans QR (mois)", value: enseigne.scans.toLocaleString("fr-FR"), delta: { value: "+18%", positive: true }, icon: ScanLine, accent: true },
          { label: "Dernière mise à jour", value: "Il y a 2 h", icon: Clock },
        ].map((s, i) => (
          <motion.div key={i} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
            <StatCard {...(s as any)} />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 shadow-soft">
          <h3 className="font-display text-lg font-semibold">Actions rapides</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Gérez votre menu en quelques clics</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              { to: "/dashboard/menu", label: "Ajouter une catégorie", icon: FolderTree },
              { to: "/dashboard/menu", label: "Ajouter un article", icon: Plus },
              { to: "/menu/$slug", label: "Voir le menu public", icon: Eye, slug: enseigne.slug },
              { to: "/dashboard/qr-code", label: "Télécharger le QR", icon: Download },
            ].map((a, i) => (
              <Link
                key={i}
                to={a.to}
                params={a.slug ? { slug: a.slug } : undefined as any}
                className="group rounded-xl border border-border p-4 hover:border-gold hover:bg-gold/5 transition-all"
              >
                <a.icon className="h-5 w-5 text-gold" />
                <p className="mt-3 text-sm font-medium">{a.label}</p>
                <ArrowUpRight className="h-4 w-4 mt-2 text-muted-foreground group-hover:text-gold transition-colors" />
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Statut du menu</h3>
              <p className="text-xs text-muted-foreground mt-0.5">État de votre menu digital</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 font-semibold">Publié</span>
          </div>
          <div className="mt-6 space-y-3">
            {[
              { label: "Logo configuré", done: true },
              { label: "Image de couverture", done: true },
              { label: "Au moins 1 catégorie", done: cats.length > 0 },
              { label: "Au moins 5 articles", done: prods.length >= 5 },
              { label: "Numéro WhatsApp", done: !!enseigne.socials.whatsapp },
            ].map((c) => (
              <div key={c.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{c.label}</span>
                <span className={c.done ? "text-emerald-600 font-medium" : "text-muted-foreground"}>
                  {c.done ? "✓ OK" : "À compléter"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
