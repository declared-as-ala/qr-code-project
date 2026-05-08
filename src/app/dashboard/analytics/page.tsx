"use client";

import { useEffect, useState } from "react";
import { BarChart3, Eye, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Summary = {
  totalScans: number;
  visitorsToday: number;
  mostViewedProducts: { name: string }[];
};

export default function AnalyticsPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/analytics/summary")
      .then(async (res) => {
        if (!res.ok) throw new Error("Erreur analytics");
        setData(await res.json());
      })
      .catch(() => setError("Impossible de charger les analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Analytics</h1>
        <p className="text-muted-foreground">Mesurez les scans et les performances des produits.</p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm">Scans totaux</CardTitle>
            <BarChart3 className="size-4 text-primary" />
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-primary">{data?.totalScans ?? 0}</CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm">Visiteurs aujourd hui</CardTitle>
            <Users className="size-4 text-primary" />
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{data?.visitorsToday ?? 0}</CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm">Top produits</CardTitle>
            <Eye className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {(data?.mostViewedProducts ?? []).length ? (
                data?.mostViewedProducts.map((item) => <li key={item.name}>- {item.name}</li>)
              ) : (
                <li>Aucune donnee pour le moment.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
