import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Tableau de bord de votre enseigne</h1>
          <p className="text-muted-foreground">
            Gerez votre menu digital, vos prix et votre image de marque depuis une interface premium.
          </p>
        </div>
        <Badge className="border border-primary/30 bg-primary/10 text-primary">En direct</Badge>
      </div>
      <DashboardStats />
      <Card className="card-hover-lift border-primary/15">
        <CardHeader>
          <CardTitle>Fil d activite recommande</CardTitle>
          <CardDescription>Actions prioritaires pour booster votre experience client a table.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Priorite</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Haute</TableCell>
                <TableCell>Ajouter vos 10 articles les plus vendus</TableCell>
                <TableCell>Conversion client plus rapide</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Moyenne</TableCell>
                <TableCell>Generer et imprimer le QR sur plaque de table</TableCell>
                <TableCell>Experience digitale premium</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
