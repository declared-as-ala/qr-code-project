"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Palette, Phone, Store } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Restaurant = {
  name: string;
  slug: string;
  phone?: string;
  address?: string;
  instagram?: string;
  facebook?: string;
  googleMapsUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
};

const initial: Restaurant = { name: "", slug: "", primaryColor: "#B08D57", secondaryColor: "#F5E6CC" };

export default function RestaurantPage() {
  const [data, setData] = useState<Restaurant>(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/restaurants/me").then(async (r) => {
      if (r.ok) setData((await r.json()) ?? initial);
      setLoading(false);
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/restaurants/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaving(false);
    toast.success("Profil enregistre");
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">Profil restaurant</h1>
        <p className="text-muted-foreground">Personnalisez votre branding et vos informations publiques.</p>
      </div>

      <Card className="border-primary/15">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="size-4 text-primary" />
            Informations principales
          </CardTitle>
          <CardDescription>Nom, slug et coordonnees de votre etablissement.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" placeholder="Cafe Medina" value={data.name ?? ""} onChange={(e) => setData({ ...data, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" placeholder="cafe-medina" value={data.slug ?? ""} onChange={(e) => setData({ ...data, slug: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telephone</Label>
            <Input id="phone" placeholder="+216..." value={data.phone ?? ""} onChange={(e) => setData({ ...data, phone: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input id="address" placeholder="Tunis, Tunisie" value={data.address ?? ""} onChange={(e) => setData({ ...data, address: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/15">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="size-4 text-primary" />
            Couleurs de marque
          </CardTitle>
          <CardDescription>Utilisees sur votre menu public.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Couleur primaire</Label>
            <Input id="primaryColor" value={data.primaryColor ?? "#B08D57"} onChange={(e) => setData({ ...data, primaryColor: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Couleur secondaire</Label>
            <Input id="secondaryColor" value={data.secondaryColor ?? "#F5E6CC"} onChange={(e) => setData({ ...data, secondaryColor: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Button className="h-10 bg-primary text-primary-foreground hover:bg-primary/90" disabled={saving}>
        <Phone className="size-4" />
        {saving ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
