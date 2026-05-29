"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImagePlus, Loader2, Save, Lock, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Restaurant = {
  name?: string;
  slug?: string;
  phone?: string;
  address?: string;
  tagline?: string;
  description?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  whatsapp?: string;
  googleMapsUrl?: string;
  logo?: string;
  coverImage?: string;
  primaryColor?: string;
  secondaryColor?: string;
};

const empty: Restaurant = {
  name: "",
  slug: "",
  primaryColor: "#B5121B",
  secondaryColor: "#1A1A1A",
};

export default function SettingsPage() {
  const [data, setData] = useState<Restaurant>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/restaurants/me").then(async (r) => {
      if (r.ok) {
        const d = await r.json();
        if (d) setData({ ...empty, ...d });
      }
      setLoading(false);
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/restaurants/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) toast.success("Réglages enregistrés");
    else toast.error("Erreur lors de l'enregistrement");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Chargement…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Réglages</h1>
        <p className="text-sm text-zinc-400">Informations de l'enseigne, images et mot de passe.</p>
      </div>

      <form onSubmit={save} className="space-y-6">
        {/* Branding images */}
        <Card className="border-white/5 bg-zinc-950/60">
          <CardHeader>
            <CardTitle className="text-white text-base">Images de marque</CardTitle>
            <CardDescription>Logo et photo de couverture affichés sur le menu public.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <ImageField
              label="Logo"
              value={data.logo}
              ratio="aspect-square"
              onChange={(url) => setData({ ...data, logo: url })}
            />
            <ImageField
              label="Couverture"
              value={data.coverImage}
              ratio="aspect-[16/9]"
              onChange={(url) => setData({ ...data, coverImage: url })}
            />
          </CardContent>
        </Card>

        {/* Main info */}
        <Card className="border-white/5 bg-zinc-950/60">
          <CardHeader>
            <CardTitle className="text-white text-base">Informations</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field id="name" label="Nom de l'enseigne" value={data.name} onChange={(v) => setData({ ...data, name: v })} />
            <Field id="slug" label="Slug (URL)" value={data.slug} onChange={(v) => setData({ ...data, slug: v })} hint="ex: cheese-steak → /menu/cheese-steak" />
            <Field id="phone" label="Téléphone" value={data.phone} onChange={(v) => setData({ ...data, phone: v })} />
            <Field id="address" label="Adresse" value={data.address} onChange={(v) => setData({ ...data, address: v })} />
            <Field id="tagline" label="Tagline" value={data.tagline} onChange={(v) => setData({ ...data, tagline: v })} className="md:col-span-2" />
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description" className="text-zinc-300 text-xs uppercase tracking-wider">Description</Label>
              <Textarea
                id="description"
                value={data.description ?? ""}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                className="bg-zinc-900 border-white/5 min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social */}
        <Card className="border-white/5 bg-zinc-950/60">
          <CardHeader>
            <CardTitle className="text-white text-base">Réseaux sociaux & carte</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field id="instagram" label="Instagram URL" value={data.instagram} onChange={(v) => setData({ ...data, instagram: v })} placeholder="https://instagram.com/…" />
            <Field id="facebook" label="Facebook URL" value={data.facebook} onChange={(v) => setData({ ...data, facebook: v })} placeholder="https://facebook.com/…" />
            <Field id="tiktok" label="TikTok URL" value={data.tiktok} onChange={(v) => setData({ ...data, tiktok: v })} placeholder="https://tiktok.com/@…" />
            <Field id="whatsapp" label="WhatsApp URL" value={data.whatsapp} onChange={(v) => setData({ ...data, whatsapp: v })} placeholder="https://wa.me/…" />
            <Field id="googleMapsUrl" label="Google Maps URL" value={data.googleMapsUrl} onChange={(v) => setData({ ...data, googleMapsUrl: v })} className="md:col-span-2" placeholder="https://maps.google.com/?q=…" />
          </CardContent>
        </Card>

        {/* Colors */}
        <Card className="border-white/5 bg-zinc-950/60">
          <CardHeader>
            <CardTitle className="text-white text-base">Couleurs de marque</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <ColorField label="Couleur primaire" value={data.primaryColor ?? "#B5121B"} onChange={(v) => setData({ ...data, primaryColor: v })} />
            <ColorField label="Couleur secondaire" value={data.secondaryColor ?? "#1A1A1A"} onChange={(v) => setData({ ...data, secondaryColor: v })} />
          </CardContent>
        </Card>

        <div className="sticky bottom-4 z-10 flex justify-end">
          <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground shadow-lg">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {saving ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </div>
      </form>

      <PasswordSection />
    </div>
  );
}

// ── helpers ─────────────────────────────────────────────────────────
function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  className = "",
}: {
  id: string;
  label: string;
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-zinc-300 text-xs uppercase tracking-wider">{label}</Label>
      <Input
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-zinc-900 border-white/5"
      />
      {hint ? <p className="text-[11px] text-zinc-500">{hint}</p> : null}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-zinc-300 text-xs uppercase tracking-wider">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 rounded border border-white/10 bg-zinc-900 cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-zinc-900 border-white/5 font-mono text-sm"
        />
      </div>
    </div>
  );
}

function ImageField({
  label,
  value,
  ratio,
  onChange,
}: {
  label: string;
  value?: string;
  ratio: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function handle(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads/image", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const { url } = (await res.json()) as { url: string };
      onChange(url);
      toast.success(`${label} mis à jour`);
    } catch {
      toast.error("Échec de l'upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-zinc-300 text-xs uppercase tracking-wider">{label}</Label>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={`relative ${ratio} w-32 rounded-xl border border-white/10 bg-zinc-900 overflow-hidden hover:border-primary/40 transition-colors group`}
        >
          {value ? (
            <Image src={value} alt={label} fill className="object-cover" unoptimized sizes="128px" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
              <ImagePlus className="h-6 w-6" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {uploading ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : <ImagePlus className="h-5 w-5 text-white" />}
          </div>
        </button>
        <div className="flex flex-col gap-2 justify-center">
          <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="border-white/10">
            <ImagePlus className="h-3.5 w-3.5 mr-1" /> Changer
          </Button>
          {value ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")} className="text-zinc-400 hover:text-red-400">
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Retirer
            </Button>
          ) : null}
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function PasswordSection() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 8) return toast.error("8 caractères minimum.");
    setLoading(true);
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    const payload = await res.json();
    setLoading(false);
    if (!res.ok) toast.error(payload.error || "Échec.");
    else {
      toast.success("Mot de passe mis à jour");
      setCurrent("");
      setNext("");
    }
  }

  return (
    <Card className="border-white/5 bg-zinc-950/60">
      <CardHeader>
        <CardTitle className="text-white text-base flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" /> Mot de passe
        </CardTitle>
        <CardDescription>Mettez à jour le mot de passe de connexion.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-3 items-end">
          <div className="space-y-2">
            <Label className="text-zinc-300 text-xs uppercase tracking-wider">Actuel</Label>
            <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} className="bg-zinc-900 border-white/5" />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300 text-xs uppercase tracking-wider">Nouveau (8+ car.)</Label>
            <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} className="bg-zinc-900 border-white/5" />
          </div>
          <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground">
            {loading ? "Mise à jour…" : "Mettre à jour"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
