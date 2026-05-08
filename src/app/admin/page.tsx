import { connectDb } from "@/lib/db";
import { Restaurant } from "@/models/Restaurant";
import { User } from "@/models/User";
import { ScanAnalytics } from "@/models/ScanAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPage() {
  await connectDb();
  const [restaurants, users, scans] = await Promise.all([
    Restaurant.countDocuments(),
    User.countDocuments({ role: "restaurant_admin" }),
    ScanAnalytics.countDocuments(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Pilotage plateforme</h1>
        <p className="text-muted-foreground">Supervisez l ensemble des enseignes actives et leurs performances QR.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Enseignes</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{restaurants}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Admins enseigne</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{users}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Scans cumules</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{scans}</CardContent>
        </Card>
      </div>
    </div>
  );
}
