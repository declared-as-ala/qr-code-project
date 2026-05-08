import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Save, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { enseignes } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_resto/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const enseigneId = useAuth((s) => s.enseigneId) ?? "ens_1";
  const e = enseignes.find((x) => x.id === enseigneId)!;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Préférences de votre établissement</p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-1">Paramètres</h1>
      </div>

      <Card className="p-6 sm:p-8 shadow-soft space-y-5">
        <h3 className="font-display text-lg font-semibold">Informations du restaurant</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Nom</Label><Input defaultValue={e.name} /></div>
          <div className="space-y-2"><Label>Téléphone</Label><Input defaultValue={e.phone} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Adresse</Label><Textarea rows={2} defaultValue={e.address} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Lien Google Maps</Label><Input defaultValue={e.mapsLink} /></div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8 shadow-soft space-y-5">
        <h3 className="font-display text-lg font-semibold">Logo & couverture</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <Label className="mb-2 block">Logo actuel</Label>
            <div className="flex items-center gap-4">
              <img src={e.logo} className="h-20 w-20 rounded-2xl bg-noir" alt="logo" />
              <Button variant="outline"><Upload className="h-4 w-4 mr-1" /> Remplacer</Button>
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Image de couverture</Label>
            <div className="aspect-video rounded-xl overflow-hidden bg-muted">
              <img src={e.cover} className="h-full w-full object-cover" alt="cover" />
            </div>
            <Button variant="outline" className="mt-3"><Upload className="h-4 w-4 mr-1" /> Remplacer</Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8 shadow-soft space-y-5">
        <h3 className="font-display text-lg font-semibold">Réseaux sociaux</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Instagram</Label><Input defaultValue={e.socials.instagram} /></div>
          <div className="space-y-2"><Label>Facebook</Label><Input defaultValue={e.socials.facebook} /></div>
          <div className="space-y-2"><Label>TikTok</Label><Input defaultValue={e.socials.tiktok} /></div>
          <div className="space-y-2"><Label>WhatsApp</Label><Input defaultValue={e.socials.whatsapp} /></div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8 shadow-soft space-y-5">
        <div className="flex items-center gap-2"><Lock className="h-4 w-4 text-gold" /><h3 className="font-display text-lg font-semibold">Mot de passe</h3></div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2"><Label>Mot de passe actuel</Label><Input type="password" /></div>
          <div className="space-y-2"><Label>Nouveau mot de passe</Label><Input type="password" /></div>
          <div className="space-y-2"><Label>Confirmer</Label><Input type="password" /></div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => toast.success("Modifications enregistrées")} className="bg-gradient-gold text-noir font-semibold shadow-gold">
          <Save className="h-4 w-4 mr-1" /> Enregistrer
        </Button>
      </div>
    </div>
  );
}
