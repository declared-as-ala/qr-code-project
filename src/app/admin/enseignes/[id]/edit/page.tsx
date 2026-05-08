"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Form = { name: string; slug: string; establishmentType: "cafe" | "restaurant"; phone?: string; address?: string; isActive: boolean };

export default function EditEnseignePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<Form>({ name: "", slug: "", establishmentType: "restaurant", isActive: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/restaurants/${params.id}`).then(async (res) => {
      if (!res.ok) return;
      const item = await res.json();
      setForm({ name: item.name, slug: item.slug, establishmentType: item.establishmentType || "restaurant", phone: item.phone || "", address: item.address || "", isActive: item.isActive ?? true });
    });
  }, [params.id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/admin/restaurants/${params.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (!res.ok) return toast.error("Mise a jour impossible.");
    toast.success("Enseigne mise a jour.");
    router.push("/admin/enseignes");
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <div><h1 className="text-3xl font-semibold">Modifier l enseigne</h1><p className="text-muted-foreground">Ajustez les informations publiques et l etat commercial.</p></div>
      <Card><CardHeader><CardTitle>Parametres principaux</CardTitle><CardDescription>Les modifications sont visibles sur le menu public et le dashboard client.</CardDescription></CardHeader><CardContent className="grid gap-3 md:grid-cols-2">
        <div><Label>Nom</Label><Input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} /></div>
        <div><Label>Slug</Label><Input value={form.slug} onChange={(e)=>setForm({...form,slug:e.target.value})} /></div>
        <div><Label>Type</Label><Select value={form.establishmentType} onValueChange={(v: "cafe" | "restaurant")=>setForm({...form,establishmentType:v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cafe">Cafe</SelectItem><SelectItem value="restaurant">Restaurant</SelectItem></SelectContent></Select></div>
        <div><Label>Telephone</Label><Input value={form.phone ?? ""} onChange={(e)=>setForm({...form,phone:e.target.value})} /></div>
        <div><Label>Adresse</Label><Input value={form.address ?? ""} onChange={(e)=>setForm({...form,address:e.target.value})} /></div>
        <div><Label>Statut</Label><Select value={form.isActive ? "active" : "inactive"} onValueChange={(v)=>setForm({...form,isActive:v === "active"})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Desactivee</SelectItem></SelectContent></Select></div>
      </CardContent></Card>
      <Button disabled={saving} className="bg-primary text-primary-foreground">{saving ? "Enregistrement..." : "Enregistrer les modifications"}</Button>
    </form>
  );
}
