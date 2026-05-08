import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Upload, Wand2, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/enseignes/new")({
  component: NewEnseigne,
});

function NewEnseigne() {
  const navigate = useNavigate();
  const [primary, setPrimary] = useState("#1a1a1a");
  const [secondary, setSecondary] = useState("#c9a24b");
  const [password, setPassword] = useState("");

  const generatePwd = () => {
    const p = Math.random().toString(36).slice(-10) + "!A";
    setPassword(p);
    toast.success("Mot de passe généré");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Enseigne créée avec succès");
    navigate({ to: "/admin/enseignes" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link to="/admin/enseignes" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground gap-1">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-2">Créer une enseigne</h1>
          <p className="text-sm text-muted-foreground mt-1">Renseignez les informations du nouvel établissement.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" type="button" asChild>
            <Link to="/admin/enseignes">Annuler</Link>
          </Button>
          <Button type="submit" className="bg-gradient-gold text-noir font-semibold shadow-gold">
            <Save className="h-4 w-4 mr-1" /> Enregistrer
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="owner">Propriétaire</TabsTrigger>
          <TabsTrigger value="social">Réseaux</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card className="p-6 sm:p-8 shadow-soft space-y-5">
            <h3 className="font-display text-lg font-semibold">Informations de base</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom de l'enseigne</Label>
                <Input placeholder="Ex: Café Lumière" required />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select defaultValue="restaurant">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cafe">Café</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Slug du menu</Label>
                <div className="flex items-center">
                  <span className="text-xs text-muted-foreground bg-muted px-3 h-10 flex items-center rounded-l-md border border-r-0 border-input">/menu/</span>
                  <Input className="rounded-l-none" placeholder="cafe-lumiere" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input placeholder="+212 6 00 00 00 00" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Adresse</Label>
                <Textarea placeholder="Adresse complète..." rows={2} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Lien Google Maps</Label>
                <Input placeholder="https://maps.google.com/..." />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card className="p-6 sm:p-8 shadow-soft space-y-6">
            <h3 className="font-display text-lg font-semibold">Identité visuelle</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <Label className="mb-2 block">Logo</Label>
                <div className="aspect-square max-w-[180px] rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-gold transition-colors cursor-pointer bg-muted/30">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">PNG, JPG · max 2 Mo</span>
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Image de couverture</Label>
                <div className="aspect-video rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-gold transition-colors cursor-pointer bg-muted/30">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">JPG · 1600×900 recommandé</span>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Couleur primaire</Label>
                <div className="flex items-center gap-3">
                  <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} className="h-11 w-11 rounded-lg border border-input cursor-pointer" />
                  <Input value={primary} onChange={(e) => setPrimary(e.target.value)} className="font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Couleur secondaire</Label>
                <div className="flex items-center gap-3">
                  <input type="color" value={secondary} onChange={(e) => setSecondary(e.target.value)} className="h-11 w-11 rounded-lg border border-input cursor-pointer" />
                  <Input value={secondary} onChange={(e) => setSecondary(e.target.value)} className="font-mono" />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="owner">
          <Card className="p-6 sm:p-8 shadow-soft space-y-5">
            <h3 className="font-display text-lg font-semibold">Compte propriétaire</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom complet</Label>
                <Input placeholder="Karim Bennani" required />
              </div>
              <div className="space-y-2">
                <Label>Adresse e-mail</Label>
                <Input type="email" placeholder="proprietaire@enseigne.com" required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Mot de passe temporaire</Label>
                <div className="flex gap-2">
                  <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sera transmis au propriétaire" />
                  <Button type="button" variant="outline" onClick={generatePwd}>
                    <Wand2 className="h-4 w-4 mr-1" /> Générer
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Le propriétaire devra le changer à sa première connexion.</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="p-6 sm:p-8 shadow-soft space-y-5">
            <h3 className="font-display text-lg font-semibold">Réseaux sociaux</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Instagram</Label><Input placeholder="@nomenseigne" /></div>
              <div className="space-y-2"><Label>Facebook</Label><Input placeholder="facebook.com/..." /></div>
              <div className="space-y-2"><Label>TikTok</Label><Input placeholder="@nomenseigne" /></div>
              <div className="space-y-2"><Label>WhatsApp</Label><Input placeholder="+212 6 00 00 00 00" /></div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}
