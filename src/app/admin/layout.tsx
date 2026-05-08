import Link from "next/link";
import { Building2, ChartColumn, Store, LogOut, ChevronRight, Coffee, Menu as MenuIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const nav = [
  { label: "Tableau de bord", href: "/admin", icon: ChartColumn },
  { label: "Enseignes", href: "/admin/enseignes", icon: Building2 },
  { label: "Comptes", href: "/admin/users", icon: Store },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "super_admin") redirect("/dashboard");

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-0 left-0 h-screen w-64 bg-sidebar text-sidebar-foreground">
          <div className="px-6 py-6 flex items-center gap-2 border-b border-sidebar-border">
            <div className="h-9 w-9 rounded-xl bg-gradient-gold flex items-center justify-center"><Coffee className="h-4 w-4 text-noir" /></div>
            <div className="flex flex-col"><span className="font-display text-base font-semibold">QR Menu</span><span className="text-[10px] uppercase tracking-widest text-gold/80">Admin</span></div>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground">
                <item.icon className="h-4 w-4" /><span className="flex-1">{item.label}</span><ChevronRight className="h-4 w-4" />
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="h-full px-4 sm:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="lg:hidden"><MenuIcon className="h-5 w-5" /></Button><div><p className="text-xs text-muted-foreground">Espace Super Admin</p><p className="text-sm font-medium font-display">Pilotage multi-enseignes</p></div></div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><button className="flex items-center gap-3 rounded-full pl-1 pr-3 py-1 hover:bg-muted transition-colors"><div className="h-9 w-9 rounded-full bg-gradient-noir text-cream flex items-center justify-center text-xs font-semibold">SA</div></button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild><Link href="/admin">Tableau de bord</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive"><LogOut className="h-4 w-4 mr-2" />Se deconnecter</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-10 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
