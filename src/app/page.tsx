import Link from "next/link";
import { ArrowRight, CheckCircle2, QrCode, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const features = [
    "Menus digitaux premium en quelques minutes",
    "Gestion centralisee des enseignes depuis un compte Super Admin",
    "QR codes prets pour impression sur plaques de table",
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-12 md:py-20">
      <section className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-7 animate-fade-up">
          <Badge className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-primary animate-soft-float">
            <Sparkles className="mr-2 size-4" />
            Plateforme QR Menu pour cafes et restaurants
          </Badge>
          <h1 className="text-balance text-4xl font-semibold leading-tight md:text-6xl">
            Transformez chaque table en experience digitale premium.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Une solution SaaS complete pour piloter vos enseignes, sublimer votre image de marque et offrir un menu QR fluide, moderne et professionnel.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 font-medium text-primary-foreground transition hover:bg-primary/90">
              Connexion administrateur
              <ArrowRight className="size-4" />
            </Link>
            <Link href="/menu/demo" className="inline-flex h-11 items-center gap-2 rounded-xl border border-primary/30 bg-black/20 px-4 text-sm font-medium transition hover:bg-primary/10">
              <QrCode className="size-4" />
              Apercu menu public
            </Link>
          </div>
          <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="card-hover-lift flex items-start gap-2 rounded-lg border border-border/70 bg-card/50 p-3">
                <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="card-hover-lift animate-fade-up border border-primary/20 bg-gradient-to-b from-card to-black/30 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle>Modele operationnel</CardTitle>
            <CardDescription>Super Admin -&gt; Creation enseigne -&gt; Admin enseigne -&gt; Menu public QR</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border/70 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">Pilotage multi-enseignes</p>
              <p className="text-3xl font-semibold text-primary">100%</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs text-muted-foreground">Creation compte admin</p>
                <p className="mt-1 text-xl font-semibold">Instantanee</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs text-muted-foreground">URL menu + QR</p>
                <p className="mt-1 text-xl font-semibold">Automatique</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
