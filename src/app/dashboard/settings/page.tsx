"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  ImagePlus, Loader2, Save, Lock, Trash2,
  Building2, Globe, Palette, KeyRound,
} from "lucide-react";
import { uploadImageDirect } from "@/lib/upload-image";

const GOLD = "#c8a46a";
const inputCls = "w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all";
const labelCls = "block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5";

type Restaurant = {
  name?: string; slug?: string; phone?: string; address?: string;
  tagline?: string; description?: string;
  instagram?: string; facebook?: string; tiktok?: string;
  whatsapp?: string; googleMapsUrl?: string;
  logo?: string; coverImage?: string;
  primaryColor?: string; secondaryColor?: string;
};
const empty: Restaurant = { name:"", slug:"", primaryColor:"#B5121B", secondaryColor:"#1A1A1A" };

function SectionCard({ icon, title, description, children }: {
  icon: React.ReactNode; title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-stone-100 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-stone-100 text-stone-600 shrink-0">{icon}</div>
        <div>
          <h2 className="text-sm font-semibold text-stone-900">{title}</h2>
          {description && <p className="text-xs text-stone-400 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Field({ id, label, value, onChange, placeholder, hint, className="", type="text" }: {
  id: string; label: string; value?: string; onChange: (v:string)=>void;
  placeholder?: string; hint?: string; className?: string; type?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={id} className={labelCls}>{label}</label>
      <input id={id} type={type} value={value??""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
      {hint && <p className="text-[11px] text-stone-400">{hint}</p>}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label:string; value:string; onChange:(v:string)=>void }) {
  return (
    <div className="space-y-1.5">
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-stone-200 shadow-sm shrink-0">
          <input type="color" value={value} onChange={e=>onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
          <div className="h-full w-full rounded-xl" style={{background:value}} />
        </div>
        <input value={value} onChange={e=>onChange(e.target.value)} placeholder="#000000"
          className={`flex-1 font-mono uppercase ${inputCls}`} maxLength={7} />
      </div>
    </div>
  );
}

function ImageField({ label, value, ratio, onChange }: {
  label:string; value?:string; ratio:string; onChange:(url:string)=>void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement|null>(null);

  async function handle(file: File) {
    setUploading(true);
    try {
      const url = await uploadImageDirect(file);
      onChange(url);
      toast.success(`${label} mis à jour`);
    } catch { toast.error("Échec de l'upload"); }
    finally { setUploading(false); }
  }

  return (
    <div className="space-y-2">
      <label className={labelCls}>{label}</label>
      <div className="flex gap-4 items-start">
        <button type="button" onClick={()=>fileRef.current?.click()}
          className={`relative ${ratio} w-32 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 overflow-hidden hover:border-amber-300 transition-all group shrink-0`}>
          {value ? (
            <Image src={value} alt={label} fill className="object-cover" unoptimized sizes="128px" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-stone-300">
              <ImagePlus className="h-6 w-6" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {uploading ? <Loader2 className="h-5 w-5 animate-spin text-white"/> : <ImagePlus className="h-5 w-5 text-white"/>}
          </div>
        </button>
        <div className="flex flex-col gap-2 justify-center pt-1">
          <button type="button" onClick={()=>fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-600 hover:bg-stone-50 transition-colors">
            <ImagePlus className="h-3.5 w-3.5"/> Changer
          </button>
          {value && (
            <button type="button" onClick={()=>onChange("")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors">
              <Trash2 className="h-3.5 w-3.5"/> Retirer
            </button>
          )}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={e=>{ const f=e.target.files?.[0]; if(f) handle(f); e.target.value=""; }} />
    </div>
  );
}

function PasswordSection() {
  const [current, setCurrent] = useState("");
  const [next, setNext]       = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 8) return toast.error("8 caractères minimum.");
    setLoading(true);
    const res = await fetch("/api/auth/change-password", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ currentPassword:current, newPassword:next }),
    });
    const payload = await res.json();
    setLoading(false);
    if (!res.ok) toast.error(payload.error || "Échec.");
    else { toast.success("Mot de passe mis à jour"); setCurrent(""); setNext(""); }
  }

  return (
    <SectionCard icon={<KeyRound className="h-4.5 w-4.5"/>} title="Mot de passe" description="Mettez à jour le mot de passe de connexion.">
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-3 items-end">
        <Field id="current-pw" label="Actuel" value={current} onChange={setCurrent} type="password" />
        <Field id="new-pw" label="Nouveau (8+ car.)" value={next} onChange={setNext} type="password" />
        <button type="submit" disabled={loading}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 h-[42px] active:scale-[0.97] transition-all"
          style={{background:loading?"#d4b896":GOLD}}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Lock className="h-4 w-4"/>}
          {loading ? "Mise à jour…" : "Mettre à jour"}
        </button>
      </form>
    </SectionCard>
  );
}

export default function SettingsPage() {
  const [data, setData]     = useState<Restaurant>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const set = (patch: Partial<Restaurant>) => setData(p => ({...p, ...patch}));

  useEffect(() => {
    fetch("/api/restaurants/me").then(async r => {
      if (r.ok) { const d = await r.json(); if (d) setData({...empty,...d}); }
      setLoading(false);
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/restaurants/me", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
    setSaving(false);
    if (res.ok) toast.success("Réglages enregistrés");
    else toast.error("Erreur lors de l'enregistrement");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-stone-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2"/> Chargement…
      </div>
    );
  }

  return (
    <div className="-mx-4 sm:-mx-6 -mt-6 min-h-[calc(100dvh-56px)] bg-[#fafaf8] px-4 sm:px-8 pt-8 pb-28 lg:pb-10">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center gap-2.5 mb-8">
          <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{background:GOLD}}>
            <Building2 className="h-4 w-4 text-white"/>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Réglages</h1>
            <p className="text-sm text-stone-500">Informations de l'enseigne, images et accès.</p>
          </div>
        </div>

        <form onSubmit={save} className="space-y-5">

          <SectionCard icon={<ImagePlus className="h-4 w-4"/>} title="Images de marque" description="Logo et photo de couverture affichés sur le menu public.">
            <div className="grid gap-6 md:grid-cols-2">
              <ImageField label="Logo" value={data.logo} ratio="aspect-square" onChange={url=>set({logo:url})}/>
              <ImageField label="Couverture" value={data.coverImage} ratio="aspect-[16/9]" onChange={url=>set({coverImage:url})}/>
            </div>
          </SectionCard>

          <SectionCard icon={<Building2 className="h-4 w-4"/>} title="Informations" description="Détails de votre établissement.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field id="name"    label="Nom de l'enseigne" value={data.name}    onChange={v=>set({name:v})} />
              <Field id="slug"    label="Slug (URL)"        value={data.slug}    onChange={v=>set({slug:v})} hint="ex: cheese-steak → /menu/cheese-steak" />
              <Field id="phone"   label="Téléphone"         value={data.phone}   onChange={v=>set({phone:v})} />
              <Field id="address" label="Adresse"           value={data.address} onChange={v=>set({address:v})} />
              <Field id="tagline" label="Tagline"           value={data.tagline} onChange={v=>set({tagline:v})} className="md:col-span-2" />
              <div className="md:col-span-2 space-y-1.5">
                <label htmlFor="description" className={labelCls}>Description</label>
                <textarea id="description" value={data.description??""} onChange={e=>set({description:e.target.value})} rows={3}
                  className={`resize-none ${inputCls}`} placeholder="Décrivez votre établissement…" />
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={<Globe className="h-4 w-4"/>} title="Réseaux sociaux & carte" description="Liens affichés sur votre menu public.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field id="instagram"    label="Instagram URL"    value={data.instagram}    onChange={v=>set({instagram:v})}    placeholder="https://instagram.com/…" />
              <Field id="facebook"     label="Facebook URL"     value={data.facebook}     onChange={v=>set({facebook:v})}     placeholder="https://facebook.com/…" />
              <Field id="tiktok"       label="TikTok URL"       value={data.tiktok}       onChange={v=>set({tiktok:v})}       placeholder="https://tiktok.com/@…" />
              <Field id="whatsapp"     label="WhatsApp URL"     value={data.whatsapp}     onChange={v=>set({whatsapp:v})}     placeholder="https://wa.me/…" />
              <Field id="googleMapsUrl" label="Google Maps URL" value={data.googleMapsUrl} onChange={v=>set({googleMapsUrl:v})} className="md:col-span-2" placeholder="https://maps.google.com/?q=…" />
            </div>
          </SectionCard>

          <SectionCard icon={<Palette className="h-4 w-4"/>} title="Couleurs de marque" description="Personnalisez l'apparence de votre menu.">
            <div className="grid gap-4 md:grid-cols-2">
              <ColorField label="Couleur primaire"   value={data.primaryColor??"#B5121B"}  onChange={v=>set({primaryColor:v})} />
              <ColorField label="Couleur secondaire" value={data.secondaryColor??"#1A1A1A"} onChange={v=>set({secondaryColor:v})} />
            </div>
          </SectionCard>

          <div className="sticky bottom-4 z-10 flex justify-end">
            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white shadow-lg hover:shadow-xl active:scale-[0.97] transition-all"
              style={{background:saving?"#d4b896":GOLD}}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>}
              {saving ? "Enregistrement…" : "Enregistrer les réglages"}
            </button>
          </div>
        </form>

        <div className="mt-5">
          <PasswordSection/>
        </div>

      </div>
    </div>
  );
}
