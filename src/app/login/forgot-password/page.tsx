"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const payload = await res.json();
    if (!res.ok) {
      toast.error(payload.error || "Impossible d envoyer la demande.");
    } else {
      toast.success(payload.message || "Demande envoyee.");
    }
    setLoading(false);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <Card className="w-full border-primary/20 bg-card/90">
        <CardHeader>
          <CardTitle>Reinitialisation du mot de passe</CardTitle>
          <CardDescription>
            Cette fonctionnalite est reservee aux comptes crees par le Super Admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <Label htmlFor="email">Email du compte</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-2 size-4 text-muted-foreground" />
              <Input id="email" className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button className="w-full" disabled={loading}>{loading ? "Envoi..." : "Envoyer la demande"}</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
