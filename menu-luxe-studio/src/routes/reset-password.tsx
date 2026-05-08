import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-cream">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-elegant p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-lg bg-gradient-gold flex items-center justify-center">
            <Coffee className="h-4 w-4 text-noir" />
          </div>
          <span className="font-display text-lg font-semibold">QR Menu</span>
        </div>
        <h1 className="font-display text-2xl font-semibold">Nouveau mot de passe</h1>
        <p className="mt-2 text-sm text-muted-foreground">Choisissez un mot de passe sécurisé.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Mot de passe mis à jour");
            navigate({ to: "/login" });
          }}
          className="mt-6 space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="p1">Nouveau mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="p1" type="password" required className="pl-10 h-11" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="p2">Confirmer le mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="p2" type="password" required className="pl-10 h-11" />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 bg-gradient-gold text-noir font-semibold">
            Mettre à jour
          </Button>
        </form>
        <Link to="/login" className="mt-6 inline-block text-sm text-muted-foreground hover:text-foreground">
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
