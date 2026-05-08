"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialForm = { name: "", slug: "", establishmentType: "restaurant", phone: "", address: "", logo: "", coverImage: "", instagram: "", facebook: "", googleMapsUrl: "", ownerName: "", ownerEmail: "", temporaryPassword: "" };

export default function NewEnseignePage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/restaurants", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const payload = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) return toast.error(payload.error || "Creation impossible.");
    toast.success("Enseigne creee. Le compte admin est pret.");
    router.push("/admin/enseignes");
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div><h1 className="text-3xl font-semibold">Creer une enseigne</h1><p className="text-muted-foreground">Provisionnement complet: etablissement + compte restaurant_admin + mot de passe temporaire.</p></div>
      <Card><CardHeader><CardTitle>Informations enseigne</CardTitle><CardDescription>Renseignez la vitrine publique et les coordonnees de contact.</CardDescription></CardHeader><CardContent className="grid gap-3 md:grid-cols-2">
        <div><Label>Nom de l enseigne</Label><Input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required /></div>
        <div><Label>Slug public</Label><Input value={form.slug} onChange={(e)=>setForm({...form,slug:e.target.value})} required /></div>
        <div><Label>Type</Label><Select value={form.establishmentType} onValueChange={(v)=>setForm({...form,establishmentType:v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cafe">Cafe</SelectItem><SelectItem value="restaurant">Restaurant</SelectItem></SelectContent></Select></div>
        <div><Label>Telephone</Label><Input value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} /></div>
        <div><Label>Adresse</Label><Input value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})} /></div>
        <div><Label>Logo URL</Label><Input value={form.logo} onChange={(e)=>setForm({...form,logo:e.target.value})} /></div>
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Compte proprietaire</CardTitle><CardDescription>Ces acces seront envoyes au responsable de l enseigne.</CardDescription></CardHeader><CardContent className="grid gap-3 md:grid-cols-2">
        <div><Label>Nom admin</Label><Input value={form.ownerName} onChange={(e)=>setForm({...form,ownerName:e.target.value})} required /></div>
        <div><Label>Email admin</Label><Input type="email" value={form.ownerEmail} onChange={(e)=>setForm({...form,ownerEmail:e.target.value})} required /></div>
        <div className="md:col-span-2"><Label>Mot de passe temporaire</Label><Input type="password" value={form.temporaryPassword} onChange={(e)=>setForm({...form,temporaryPassword:e.target.value})} required /></div>
      </CardContent></Card>
      <Button disabled={saving} className="bg-primary text-primary-foreground">{saving ? "Creation en cours..." : "Creer l enseigne"}</Button>
    </form>
  );
}
