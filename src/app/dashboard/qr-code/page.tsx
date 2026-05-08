"use client";

import Image from "next/image";
import { useState } from "react";
import { Download, QrCode, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function QrCodePage() {
  const [data, setData] = useState<{ qrImageUrl?: string; targetUrl?: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/qr/generate", { method: "POST" });
    if (res.ok) {
      setData(await res.json());
      toast.success("QR code genere avec succes.");
    } else {
      const payload = await res.json().catch(() => ({}));
      const message = payload?.error || "Echec de generation";
      setError(message);
      toast.error(message);
    }
    setLoading(false);
  }

  async function copyLink() {
    if (!data.targetUrl) return;
    await navigator.clipboard.writeText(data.targetUrl);
    toast.success("Lien du menu copie dans le presse-papiers.");
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">QR Code de votre menu</h1>
        <p className="text-muted-foreground">Generez le QR officiel de votre enseigne et partagez votre menu mobile instantanement.</p>
      </div>

      <Card className="border-primary/15">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><QrCode className="size-4 text-primary" />QR code principal</CardTitle>
          <CardDescription>Imprimez ce QR code sur une plaque et placez-le sur vos tables pour offrir a vos clients une experience digitale moderne.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={generate} className="bg-primary text-primary-foreground" disabled={loading}>{loading ? "Generation en cours..." : "Generer le QR code"}</Button>
          {error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : null}
          {loading ? <Skeleton className="h-64 w-64 rounded-xl" /> : null}
          {data.targetUrl ? <p className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm">URL publique du menu: {data.targetUrl}</p> : null}
          {data.qrImageUrl ? (
            <div className="space-y-3">
              <Image src={data.qrImageUrl} alt="QR code menu" width={256} height={256} className="h-64 w-64 rounded-xl border border-primary/25" unoptimized />
              <div className="flex flex-wrap gap-2">
                <a href={data.qrImageUrl} download="qr-menu-enseigne.png" className="inline-flex h-9 items-center gap-2 rounded-lg border border-primary/25 bg-black/20 px-3 text-sm font-medium transition hover:bg-primary/10"><Download className="size-4" />Telecharger le QR</a>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" className="border-primary/25 bg-black/20" onClick={copyLink}><Share2 className="size-4" />Copier le lien menu</Button>
                  </TooltipTrigger>
                  <TooltipContent>Copier l URL publique de votre menu</TooltipContent>
                </Tooltip>
              </div>
            </div>
          ) : (
            <Alert><AlertDescription>Aucune generation detectee pour le moment. Commencez par cliquer sur Generer le QR code.</AlertDescription></Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
