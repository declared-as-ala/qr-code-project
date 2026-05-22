import { connectDb } from "@/lib/db";
import { ScanAnalytics } from "@/models/ScanAnalytics";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { requireRestaurant } from "@/lib/permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, ScanLine, Shapes } from "lucide-react";
import Link from "next/link";

export async function DashboardStats() {
  await connectDb();
  let restaurant: { _id?: string } | null = null;
  try {
    const context = await requireRestaurant();
    restaurant = context.restaurant;
  } catch {
    restaurant = null;
  }

  if (!restaurant?._id) {
    return (
      <Card className="border-primary/20 bg-gradient-to-b from-background to-card">
        <CardHeader>
          <CardTitle className="text-lg">Bienvenue sur votre dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Creez d abord votre fiche restaurant pour activer categories, produits, QR et analytics.
          </p>
          <Link href="/dashboard/restaurant" className="inline-flex rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20">
            Configurer mon restaurant
          </Link>
        </CardContent>
      </Card>
    );
  }

  const rid = restaurant?._id;
  const totalScans = await ScanAnalytics.countDocuments({ restaurantId: rid });
  const products = await Product.countDocuments({ restaurantId: rid });
  const categories = await Category.countDocuments({ restaurantId: rid });

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="glass-card">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">Scans totaux</CardTitle>
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <ScanLine className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-4xl font-semibold text-white font-display">{totalScans}</p>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-primary/10 text-primary border border-primary/20">
            Performance
          </span>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">Produits</CardTitle>
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <QrCode className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-4xl font-semibold text-white font-display">{products}</p>
          <p className="mt-2 text-xs text-zinc-500">Articles gérés dans votre menu.</p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">Catégories</CardTitle>
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Shapes className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-4xl font-semibold text-white font-display">{categories}</p>
          <p className="mt-2 text-xs text-zinc-500">Structure de navigation client.</p>
        </CardContent>
      </Card>
    </div>
  );
}
