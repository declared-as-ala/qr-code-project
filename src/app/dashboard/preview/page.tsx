import Link from "next/link";
import { ExternalLink, Smartphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PreviewPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">Preview menu</h1>
        <p className="text-muted-foreground">Visualisez l experience mobile de vos clients.</p>
      </div>
      <Card className="border-primary/15">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="size-4 text-primary" />
            Menu public
          </CardTitle>
          <CardDescription>Utilisez votre slug pour ouvrir la vue client.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert>
            <AlertDescription>Exemple URL: /menu/votre-slug</AlertDescription>
          </Alert>
          <Link href="/menu/demo" className="inline-flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/10 px-4 py-2 text-sm text-primary transition hover:bg-primary/20">
            Ouvrir la preview demo
            <ExternalLink className="size-4" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
