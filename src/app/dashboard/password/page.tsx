"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Lock, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const payload = await res.json();
    if (!res.ok) toast.error(payload.error || "Echec de mise a jour.");
    else toast.success(payload.message || "Mot de passe mis a jour.");
    setLoading(false);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">Securite du compte</h1>
        <p className="text-muted-foreground">Mettez a jour votre mot de passe pour proteger l acces a votre enseigne.</p>
      </div>
      <Card className="max-w-2xl border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="size-4 text-primary" />Changer le mot de passe</CardTitle>
          <CardDescription>Utilisez un mot de passe fort (8 caracteres minimum).</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-2 size-4 text-muted-foreground" />
                <Input id="newPassword" className="pl-9" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
            </div>
            <Button className="bg-primary text-primary-foreground" disabled={loading}>{loading ? "Mise a jour..." : "Mettre a jour"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
