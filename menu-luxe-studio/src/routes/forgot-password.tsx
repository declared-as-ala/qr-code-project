import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-cream">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-elegant p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-lg bg-gradient-gold flex items-center justify-center">
            <Coffee className="h-4 w-4 text-noir" />
          </div>
          <span className="font-display text-lg font-semibold">QR Menu</span>
        </div>
        <h1 className="font-display text-2xl font-semibold">Mot de passe oublié</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Saisissez votre e-mail, nous vous enverrons un lien de réinitialisation.
        </p>
        {sent ? (
          <div className="mt-6 rounded-lg border border-gold/40 bg-gold/10 p-4 text-sm">
            Si un compte existe pour cette adresse, un e-mail vient d'être envoyé.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              toast.success("E-mail envoyé");
            }}
            className="mt-6 space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" required placeholder="vous@exemple.com" className="pl-10 h-11" />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 bg-gradient-gold text-noir font-semibold">
              Envoyer le lien
            </Button>
          </form>
        )}
        <Link to="/login" className="mt-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
