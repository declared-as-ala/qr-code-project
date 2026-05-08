import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Coffee, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const isAdmin = email.includes("admin") || email === "admin@qrmenu.io";
      login(isAdmin ? "super_admin" : "restaurant_admin");
      toast.success(isAdmin ? "Bienvenue Super Admin" : "Bienvenue sur votre tableau de bord");
      navigate({ to: isAdmin ? "/admin" : "/dashboard" });
    }, 600);
  };

  const quickLogin = (role: "super_admin" | "restaurant_admin") => {
    login(role);
    navigate({ to: role === "super_admin" ? "/admin" : "/dashboard" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left visual panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-noir text-cream">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-noir/90 via-noir/60 to-noir/95" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex items-center gap-2"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
            <Coffee className="h-5 w-5 text-noir" />
          </div>
          <span className="font-display text-xl font-semibold">QR Menu</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative z-10 max-w-md"
        >
          <h1 className="font-display text-5xl font-semibold leading-tight">
            Le menu digital qui sublime vos <span className="text-gold">tables</span>.
          </h1>
          <p className="mt-6 text-cream/70 text-lg leading-relaxed">
            Une expérience client moderne, élégante et sans contact. Conçue pour les cafés et restaurants d'exception.
          </p>
          <div className="mt-10 flex items-center gap-3 text-sm text-cream/60">
            <div className="h-px w-12 bg-gold/60" />
            <span>Plateforme SaaS premium</span>
          </div>
        </motion.div>

        <div className="relative z-10 text-xs text-cream/40">
          © {new Date().getFullYear()} QR Menu — Tous droits réservés
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-gold flex items-center justify-center">
              <Coffee className="h-5 w-5 text-noir" />
            </div>
            <span className="font-display text-xl font-semibold">QR Menu</span>
          </div>

          <h2 className="font-display text-3xl font-semibold">Connexion</h2>
          <p className="mt-2 text-muted-foreground">
            Accédez à votre espace de gestion
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email" type="email" required
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Mot de passe</Label>
                <Link to="/forgot-password" className="text-xs text-gold hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password" type="password" required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-gold text-noir font-semibold hover:opacity-90 shadow-gold"
            >
              {loading ? "Connexion..." : "Se connecter"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Démo rapide — choisissez un rôle
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => quickLogin("super_admin")}>
                Super Admin
              </Button>
              <Button variant="outline" size="sm" onClick={() => quickLogin("restaurant_admin")}>
                Resto Admin
              </Button>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            L'accès est réservé aux comptes créés par l'administrateur.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
