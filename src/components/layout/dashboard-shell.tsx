"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Menu as MenuIcon, Settings, LogOut, UtensilsCrossed, Flame, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

const NAV: NavItem[] = [
  { href: "/dashboard/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/dashboard/settings", label: "Réglages", icon: Settings },
];

function Sidebar({ onNavigate, slug }: { onNavigate?: () => void; slug?: string }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col bg-zinc-950 border-r border-white/5 text-zinc-100">
      <div className="px-6 py-6 flex items-center gap-3 border-b border-white/5">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
          <Flame className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-display text-base font-semibold tracking-tight text-white">Menu Manager</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Admin</span>
        </div>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
        {slug ? (
          <a
            href={`/menu/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="flex-1">Voir le menu public</span>
          </a>
        ) : null}
      </nav>
      <div className="px-3 pb-6">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const [slug, setSlug] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/restaurants/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((r) => {
        if (!cancelled && r?.slug) setSlug(r.slug);
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
    <div className="min-h-screen flex bg-[#09090b] text-zinc-100">
      <aside className="hidden lg:block w-60 shrink-0">
        <div className="fixed top-0 left-0 h-screen w-60">
          <Sidebar slug={slug} />
        </div>
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-60 bg-zinc-950 border-r border-white/5">
          <Sidebar onNavigate={() => setOpen(false)} slug={slug} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-14 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-white/5 text-zinc-400" onClick={() => setOpen(true)}>
              <MenuIcon className="h-5 w-5" />
            </Button>
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-white/5 transition-colors border border-white/5">
                    <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {initials || "A"}
                    </div>
                    <span className="hidden sm:block text-xs text-zinc-300">{email}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border border-white/10 text-zinc-200">
                  <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white">
                    <Link href="/dashboard/settings">Réglages</Link>
                  </DropdownMenuItem>
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
          </div>
        </header>
        <main className="flex-1 px-4 sm:px-6 py-6 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
