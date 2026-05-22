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
    <div className="flex h-full flex-col bg-zinc-950/60 backdrop-blur-xl border-r border-white/5 text-zinc-100">
      <div className="px-6 py-6 flex items-center gap-3 border-b border-white/5 bg-black/10">
        <div className="h-9 w-9 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
          <Coffee className="h-4 w-4 text-black" />
        </div>
        <div className="flex flex-col">
          <span className="font-display text-base font-semibold tracking-tight text-white">QR Menu</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Premium</span>
        </div>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                active
                  ? "bg-gradient-gold text-black shadow-gold font-semibold"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${active ? "text-black" : "text-zinc-400 group-hover:text-primary"}`} />
              <span className="flex-1">{item.label}</span>
              {active ? <ChevronRight className="h-4 w-4 text-black" /> : null}
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
    <div className="min-h-screen flex bg-[#09090b] text-zinc-100">
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-0 left-0 h-screen w-64"><Sidebar /></div>
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-zinc-950 border-r border-white/5"><Sidebar onNavigate={() => setOpen(false)} /></SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-zinc-950/40 backdrop-blur-xl">
          <div className="h-full px-4 sm:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden hover:bg-white/5 text-zinc-400" onClick={() => setOpen(true)}>
                <MenuIcon className="h-5 w-5" />
              </Button>
              <div className="hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Espace Restaurateur</p>
                <p className="text-sm font-semibold font-display text-zinc-200">Pilotage menu premium</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-full pl-1 pr-3 py-1 hover:bg-white/5 transition-colors border border-white/5 bg-zinc-900/30">
                  <div className="h-8 w-8 rounded-full bg-gradient-gold text-black flex items-center justify-center text-xs font-bold shadow-gold">
                    RA
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold leading-tight text-zinc-200">Restaurant Admin</p>
                    <p className="text-[10px] text-zinc-500 leading-tight">dashboard@qrmenu.tn</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border border-white/10 text-zinc-200">
                <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white">
                  <Link href="/dashboard/settings">Paramètres</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-10 max-w-[1400px] w-full mx-auto animate-fade-up">{children}</main>
      </div>
    </div>
  );
}
