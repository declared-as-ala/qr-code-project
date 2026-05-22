import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">Tableau de bord de votre enseigne</h1>
          <p className="text-muted-foreground mt-1">
            Gérez votre menu digital, vos prix et votre image de marque depuis une interface premium.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">En direct</span>
        </div>
      </div>

      <DashboardStats />

      <Card className="glass-card overflow-hidden">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-white font-display">Fil d'activité recommandé</CardTitle>
          <CardDescription className="text-zinc-400 text-xs">Actions prioritaires pour booster votre expérience client à table.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-950/40">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs py-4 px-6">Priorité</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs py-4">Action</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs py-4">Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-white/5 hover:bg-white/[0.01] transition-colors">
                <TableCell className="py-4 px-6">
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Haute
                  </span>
                </TableCell>
                <TableCell className="text-white py-4 font-medium">Ajouter vos 10 articles les plus vendus</TableCell>
                <TableCell className="text-zinc-400 py-4">Conversion client plus rapide</TableCell>
              </TableRow>
              <TableRow className="border-white/5 hover:bg-white/[0.01] transition-colors">
                <TableCell className="py-4 px-6">
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Moyenne
                  </span>
                </TableCell>
                <TableCell className="text-white py-4 font-medium">Générer et imprimer le QR sur plaque de table</TableCell>
                <TableCell className="text-zinc-400 py-4">Expérience digitale premium</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
