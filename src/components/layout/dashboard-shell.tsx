"use client";

import Link from "next/link";
import { LayoutDashboard, Menu as MenuIcon, QrCode, Settings, LogOut, ChevronRight, Coffee, Store, UtensilsCrossed, Eye, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/dashboard/qr-code", label: "QR Code", icon: QrCode },
  { href: "/dashboard/settings", label: "Parametres", icon: Settings },
  { href: "/dashboard/preview", label: "Menu public", icon: Eye },
  { href: "/dashboard/analytics", label: "Statistiques", icon: BarChart3 },
  { href: "/dashboard/restaurant", label: "Enseigne", icon: Store },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-6 py-6 flex items-center gap-2 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-xl bg-gradient-gold flex items-center justify-center"><Coffee className="h-4 w-4 text-noir" /></div>
        <div className="flex flex-col">
          <span className="font-display text-base font-semibold">QR Menu</span>
          <span className="text-[10px] uppercase tracking-widest text-gold/80">Premium</span>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate} className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${active ? "bg-gradient-gold text-noir shadow-gold" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}>
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {active ? <ChevronRight className="h-4 w-4" /> : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-0 left-0 h-screen w-64"><Sidebar /></div>
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-sidebar border-sidebar-border"><Sidebar onNavigate={() => setOpen(false)} /></SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="h-full px-4 sm:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}><MenuIcon className="h-5 w-5" /></Button>
              <div className="hidden sm:block">
                <p className="text-xs text-muted-foreground">Espace Restaurateur</p>
                <p className="text-sm font-medium font-display">Pilotage menu premium</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-full pl-1 pr-3 py-1 hover:bg-muted transition-colors">
                  <div className="h-9 w-9 rounded-full bg-gradient-noir text-cream flex items-center justify-center text-xs font-semibold">RA</div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium leading-tight">Restaurant Admin</p>
                    <p className="text-xs text-muted-foreground leading-tight">dashboard@qrmenu.tn</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild><Link href="/dashboard/settings">Parametres</Link></DropdownMenuItem>
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
