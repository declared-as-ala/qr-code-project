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
      <Card className="border-primary/20 bg-gradient-to-b from-background to-card">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm text-muted-foreground">Scans totaux</CardTitle>
          <ScanLine className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-primary">{totalScans}</p>
          <Badge className="mt-2 border border-primary/30 bg-primary/10 text-primary">Performance</Badge>
        </CardContent>
      </Card>
      <Card className="border-primary/20 bg-gradient-to-b from-background to-card">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm text-muted-foreground">Produits</CardTitle>
          <QrCode className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{products}</p>
          <p className="mt-2 text-sm text-muted-foreground">Articles geres dans votre menu.</p>
        </CardContent>
      </Card>
      <Card className="border-primary/20 bg-gradient-to-b from-background to-card">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm text-muted-foreground">Categories</CardTitle>
          <Shapes className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{categories}</p>
          <p className="mt-2 text-sm text-muted-foreground">Structure de navigation client.</p>
        </CardContent>
      </Card>
    </div>
  );
}
