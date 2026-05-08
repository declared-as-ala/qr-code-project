import { createFileRoute } from "@tanstack/react-router";
import { Copy, Download, Eye, QrCode as QrIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "@/lib/auth-store";
import { enseignes } from "@/lib/mock-data";
import { toast } from "sonner";
import { useRef } from "react";

export const Route = createFileRoute("/_resto/dashboard/qr-code")({
  component: QrCodePage,
});

function QrCodePage() {
  const enseigneId = useAuth((s) => s.enseigneId) ?? "ens_1";
  const enseigne = enseignes.find((e) => e.id === enseigneId)!;
  const url = typeof window !== "undefined" ? `${window.location.origin}/menu/${enseigne.slug}` : `/menu/${enseigne.slug}`;
  const ref = useRef<HTMLDivElement>(null);

  const copy = () => { navigator.clipboard.writeText(url); toast.success("Lien copié"); };
  const download = () => {
    const canvas = ref.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qr-${enseigne.slug}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("QR code téléchargé");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Votre menu en un scan</p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-1">QR Code de votre menu</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 sm:p-10 shadow-soft text-center">
          <div ref={ref} className="inline-block p-6 rounded-3xl bg-white border-4 border-gold/30 shadow-gold">
            <QRCodeCanvas value={url} size={260} fgColor="#1a1a1a" includeMargin />
          </div>
          <p className="mt-6 font-mono text-sm text-muted-foreground break-all">{url}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button onClick={copy} variant="outline"><Copy className="h-4 w-4 mr-1" /> Copier le lien du menu</Button>
            <Button onClick={download} className="bg-gradient-gold text-noir font-semibold shadow-gold">
              <Download className="h-4 w-4 mr-1" /> Télécharger le QR code
            </Button>
            <Button asChild variant="outline">
              <a href={`/menu/${enseigne.slug}`} target="_blank" rel="noreferrer">
                <Eye className="h-4 w-4 mr-1" /> Voir le menu public
              </a>
            </Button>
          </div>
        </Card>

        <Card className="p-6 shadow-soft">
          <div className="flex items-center gap-2 text-gold mb-2">
            <QrIcon className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Plaque de table</span>
          </div>
          <h3 className="font-display text-xl font-semibold">Une expérience client moderne</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Imprimez ce QR code sur une plaque premium et placez-le sur vos tables pour offrir à vos clients une expérience digitale moderne.
          </p>

          <div className="mt-6 mx-auto max-w-[260px]">
            <div className="rounded-3xl bg-gradient-noir p-6 shadow-elegant text-cream text-center relative">
              <div className="absolute inset-x-6 top-2 h-8 rounded-full bg-cream/5 blur-xl" />
              <p className="text-[10px] uppercase tracking-widest text-gold">{enseigne.name}</p>
              <p className="mt-1 text-sm font-display">Scannez pour voir le menu</p>
              <div className="mt-4 inline-block p-3 rounded-xl bg-white">
                <QRCodeCanvas value={url} size={140} fgColor="#1a1a1a" />
              </div>
              <p className="mt-3 text-[10px] text-cream/60">Powered by QR Menu</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
