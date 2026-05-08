import Link from "next/link";
import { Building2, ChartColumn, QrCode, Users } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const nav = [
  { label: "Vue globale", href: "/admin", icon: ChartColumn },
  { label: "Enseignes", href: "/admin/enseignes", icon: Building2 },
  { label: "Comptes", href: "/admin/users", icon: Users },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "super_admin") redirect("/dashboard");

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-72 rounded-2xl border border-primary/15 bg-card/85 p-5 backdrop-blur md:block">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">Panneau Super Admin</h2>
            <Badge className="border border-primary/30 bg-primary/10 text-primary">Root</Badge>
          </div>
          <nav className="space-y-1.5">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-sm text-muted-foreground transition hover:border-primary/20 hover:bg-primary/10 hover:text-foreground">
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/dashboard" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary/25 px-3 py-2 text-sm">
            <QrCode className="size-4" />
            Voir interface enseigne
          </Link>
        </aside>
        <main className="w-full rounded-2xl border border-primary/15 bg-card/90 p-5 shadow-xl shadow-black/20">{children}</main>
      </div>
    </div>
  );
}
