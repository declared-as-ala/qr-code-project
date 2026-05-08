"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motionPreset } from "@/lib/motion/presets";

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
      router.push("/dashboard/password");
      return;
    }

    router.push(session?.user?.role === "super_admin" ? "/admin" : "/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <motion.div {...motionPreset} className="w-full">
      <Card className="w-full border-primary/20 bg-card/90 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="text-2xl">Connexion securisee</CardTitle>
          <CardDescription>
            Connectez-vous a votre espace de gestion QR Menu Pro pour piloter votre enseigne.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-2 size-4 text-muted-foreground" />
                <Input id="email" className="pl-9" placeholder="owner@enseigne.tn" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-2 size-4 text-muted-foreground" />
                <Input id="password" className="pl-9" placeholder="********" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            <Button className="h-10 w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
              {loading ? "Connexion en cours..." : "Acceder au tableau de bord"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Mot de passe oublie ?{" "}
              <Link href="/login/forgot-password" className="text-primary underline-offset-4 hover:underline">
                Demander une reinitialisation
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
      </motion.div>
    </main>
  );
}
