"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Menu as MenuIcon, Settings, LogOut, UtensilsCrossed, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV: NavItem[] = [
  { href: "/dashboard/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/dashboard/settings", label: "Réglages", icon: Settings },
];

function Sidebar({ onNavigate, slug }: { onNavigate?: () => void; slug?: string }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col bg-zinc-950 border-r border-white/5 text-zinc-100">
      {/* Brand */}
      <div className="px-6 py-5 flex items-center gap-3 border-b border-white/5">
        <div className="h-9 w-9 rounded-xl overflow-hidden shrink-0">
          <Image src="/logos/clickmenu-mark.svg" alt="ClickMenu" width={36} height={36} priority />
        </div>
        <div className="flex flex-col">
          <span className="font-display text-base font-semibold tracking-tight text-white">ClickMenu</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Dashboard</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}

        {slug && (
          <a
            href={`/menu/${slug}`}
            target="_blank"
            rel="noreferrer"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span className="flex-1">Voir le menu public</span>
          </a>
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

function MobileBottomNav({ slug }: { slug?: string }) {
  const pathname = usePathname();
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch bg-zinc-950/95 backdrop-blur-xl border-t border-white/5"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
              active ? "text-primary" : "text-zinc-500"
            }`}
          >
            <item.icon className={`h-5 w-5 transition-transform ${active ? "scale-110" : ""}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
      {slug && (
        <a
          href={`/menu/${slug}`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-semibold uppercase tracking-wide text-zinc-500"
        >
          <ExternalLink className="h-5 w-5" />
          <span>Menu Public</span>
        </a>
      )}
    </nav>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const [slug, setSlug] = useState<string | undefined>();
  const [restaurantName, setRestaurantName] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/restaurants/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((r) => {
        if (!cancelled) {
          if (r?.slug) setSlug(r.slug);
          if (r?.name) setRestaurantName(r.name);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const email = session?.user?.email || "";
  const initials = (session?.user?.name || email || "U")
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <div className="min-h-dvh flex bg-[#09090b] text-zinc-100">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 shrink-0">
        <div className="fixed top-0 left-0 h-screen w-60">
          <Sidebar slug={slug} />
        </div>
      </aside>

      {/* Mobile sidebar sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-zinc-950 border-r border-white/5">
          <Sidebar onNavigate={() => setOpen(false)} slug={slug} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 h-14 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Mobile: hamburger + brand */}
            <div className="flex items-center gap-3 lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-white/5 text-zinc-400"
                onClick={() => setOpen(true)}
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
              {restaurantName ? (
                <span className="text-sm font-semibold text-white truncate max-w-[160px]">
                  {restaurantName}
                </span>
              ) : (
                <span className="text-sm font-semibold text-white">ClickMenu</span>
              )}
            </div>

            {/* Desktop: empty space (sidebar has branding) */}
            <div className="hidden lg:block" />

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-white/5 transition-colors border border-white/5">
                  <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                    {initials || "A"}
                  </div>
                  <span className="hidden sm:block text-xs text-zinc-300 max-w-[140px] truncate">
                    {email}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border border-white/10 text-zinc-200">
                {restaurantName && (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-xs font-semibold text-white">{restaurantName}</p>
                      <p className="text-[11px] text-zinc-500">{email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-white/5" />
                  </>
                )}
                <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white">
                  <Link href="/dashboard/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Réglages
                  </Link>
                </DropdownMenuItem>
                {slug && (
                  <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white">
                    <a href={`/menu/${slug}`} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Voir le menu public
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-red-300 focus:bg-red-500/10 focus:text-red-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content — extra bottom padding on mobile for bottom nav */}
        <main className="flex-1 px-4 sm:px-6 py-6 pb-28 lg:pb-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileBottomNav slug={slug} />
    </div>
  );
}
