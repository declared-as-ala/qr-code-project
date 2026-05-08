import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Coffee, LayoutDashboard, Store, QrCode, Settings, Menu as MenuIcon, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AppShellProps {
  variant: "admin" | "resto";
  children: React.ReactNode;
}

const ADMIN_NAV: NavItem[] = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/admin/enseignes", label: "Enseignes", icon: Store },
];

const RESTO_NAV: NavItem[] = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/dashboard/menu", label: "Menu", icon: MenuIcon },
  { to: "/dashboard/qr-code", label: "QR Code", icon: QrCode },
  { to: "/dashboard/settings", label: "Paramètres", icon: Settings },
];

function SidebarContent({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-6 py-6 flex items-center gap-2 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-xl bg-gradient-gold flex items-center justify-center">
          <Coffee className="h-4 w-4 text-noir" />
        </div>
        <div className="flex flex-col">
          <span className="font-display text-base font-semibold">QR Menu</span>
          <span className="text-[10px] uppercase tracking-widest text-gold/80">Premium</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const active = pathname === item.to || (item.to !== "/admin" && item.to !== "/dashboard" && pathname.startsWith(item.to));
          const exactActive = pathname === item.to;
          const isActive = exactActive || (item.to !== "/admin" && item.to !== "/dashboard" && active);
          return (
            <Link
              key={item.to} to={item.to} onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-gradient-gold text-noir shadow-gold"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="rounded-xl bg-sidebar-accent/50 p-4 text-xs">
          <p className="font-medium text-sidebar-foreground">Besoin d'aide ?</p>
          <p className="mt-1 text-sidebar-foreground/60">Notre équipe est disponible 7j/7.</p>
          <button className="mt-3 text-gold text-xs font-semibold hover:underline">Contacter le support →</button>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ variant, children }: AppShellProps) {
  const items = variant === "admin" ? ADMIN_NAV : RESTO_NAV;
  const { userName, userEmail, role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const initials = userName ? userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "??";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-0 left-0 h-screen w-64">
          <SidebarContent items={items} />
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-sidebar border-sidebar-border">
          <SidebarContent items={items} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="h-full px-4 sm:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
                <MenuIcon className="h-5 w-5" />
              </Button>
              <div className="hidden sm:block">
                <p className="text-xs text-muted-foreground">
                  {role === "super_admin" ? "Espace Super Admin" : "Espace Restaurateur"}
                </p>
                <p className="text-sm font-medium font-display">Bonjour, {userName.split(" ")[0]} ✦</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 rounded-full pl-1 pr-3 py-1 hover:bg-muted transition-colors">
                    <div className="h-9 w-9 rounded-full bg-gradient-noir text-cream flex items-center justify-center text-xs font-semibold">
                      {initials}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium leading-tight">{userName}</p>
                      <p className="text-xs text-muted-foreground leading-tight">{userEmail}</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate({ to: variant === "admin" ? "/admin" : "/dashboard/settings" })}>
                    <Settings className="h-4 w-4 mr-2" /> Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" /> Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-10 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
