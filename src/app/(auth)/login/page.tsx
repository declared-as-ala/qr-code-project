"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Coffee, Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setLoading(false);
      return setError("Identifiants invalides. Verifiez votre email et mot de passe.");
    }

    const sessionResponse = await fetch("/api/auth/session");
    const session = await sessionResponse.json();

    if (session?.user?.mustChangePassword) {
      router.push("/dashboard/settings");
      return;
    }

    router.push(session?.user?.role === "super_admin" ? "/admin" : "/dashboard");
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
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
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/60 to-black/95" />

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
            <Coffee className="h-5 w-5 text-black" />
          </div>
          <span className="font-display text-xl font-semibold">QR Menu</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="relative z-10 max-w-md">
          <h1 className="font-display text-5xl font-semibold leading-tight">
            Le menu digital qui sublime vos <span className="text-gold">tables</span>.
          </h1>
          <p className="mt-6 text-cream/70 text-lg leading-relaxed">
            Une experience client moderne, elegante et sans contact. Concue pour les cafes et restaurants d exception.
          </p>
        </motion.div>

        <div className="relative z-10 text-xs text-cream/40">Plateforme SaaS premium QR Menu</div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-gold flex items-center justify-center">
              <Coffee className="h-5 w-5 text-black" />
            </div>
            <span className="font-display text-xl font-semibold">QR Menu</span>
          </div>

          <h2 className="font-display text-3xl font-semibold">Connexion</h2>
          <p className="mt-2 text-muted-foreground">Accedez a votre espace de gestion</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" required placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Mot de passe</Label>
                <Link href="/login/forgot-password" className="text-xs text-gold hover:underline">Mot de passe oublie ?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" required placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-11" />
              </div>
            </div>

            {error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : null}

            <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-gold text-black font-semibold hover:opacity-90 shadow-gold">
              {loading ? "Connexion..." : "Se connecter"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-xs text-muted-foreground text-center">L acces est reserve aux comptes crees par le Super Admin.</p>
        </motion.div>
      </div>
    </div>
  );
}
