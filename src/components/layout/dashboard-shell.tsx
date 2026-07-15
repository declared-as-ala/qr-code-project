"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  Menu as MenuIcon, Settings, LogOut,
  UtensilsCrossed, ExternalLink, Package, ShoppingBag,
} from "lucide-react";
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
  { href: "/dashboard/menu",     label: "Menu",     icon: UtensilsCrossed },
  { href: "/dashboard/after",    label: "After",    icon: ShoppingBag },
  { href: "/dashboard/stock",    label: "Stock",    icon: Package },
  { href: "/dashboard/settings", label: "Réglages", icon: Settings },
];

function Sidebar({ onNavigate, slug, pendingOrders = 0 }: { onNavigate?: () => void; slug?: string; pendingOrders?: number }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white border-r border-stone-100">
      {/* Brand — clickable */}
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="px-5 py-4 flex items-center gap-3 border-b border-stone-100 hover:bg-stone-50 transition-colors group"
      >
        <div className="h-9 w-9 rounded-xl overflow-hidden shrink-0 shadow-sm ring-1 ring-stone-200">
          <Image src="/logos/logo.png" alt="ClickMenu" width={36} height={36} priority unoptimized />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-stone-900 tracking-tight group-hover:text-amber-700 transition-colors">
            ClickMenu
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-600">
            Dashboard
          </span>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const badge = item.href === "/dashboard/after" && pendingOrders > 0 ? pendingOrders : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-stone-900 text-white shadow-sm"
                  : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {badge > 0 && (
                <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none ${active ? "bg-white/20 text-white" : "bg-amber-500 text-white"}`}>
                  {badge}
                </span>
              )}
            </Link>
          );
        })}

        {slug && (
          <a
            href={`/menu/${slug}`}
            target="_blank"
            rel="noreferrer"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-all"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span className="flex-1">Voir le menu public</span>
          </a>
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 pt-3 border-t border-stone-100">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-400 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

function MobileBottomNav({ slug, pendingOrders }: { slug?: string; pendingOrders?: number }) {
  const pathname = usePathname();
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch bg-white/95 backdrop-blur-xl border-t border-stone-100 shadow-[0_-1px_12px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const badge = item.href === "/dashboard/after" && (pendingOrders ?? 0) > 0 ? pendingOrders : 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
              active ? "text-stone-900" : "text-stone-400"
            }`}
          >
            <item.icon className={`h-5 w-5 transition-transform ${active ? "scale-110" : ""}`} />
            <span>{item.label}</span>
            {badge ? (
              <span className="absolute top-1.5 right-1/4 translate-x-2 bg-amber-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {badge > 9 ? "9+" : badge}
              </span>
            ) : null}
          </Link>
        );
      })}
      {slug && (
        <a
          href={`/menu/${slug}`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-semibold uppercase tracking-wide text-stone-400"
        >
          <ExternalLink className="h-5 w-5" />
          <span>Menu</span>
        </a>
      )}
    </nav>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen]                   = useState(false);
  const { data: session }                 = useSession();
  const [slug, setSlug]                   = useState<string | undefined>();
  const [restaurantName, setRestaurantName] = useState<string | undefined>();
  const [pendingOrders, setPendingOrders] = useState(0);

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
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const poll = async () => {
      try {
        const r = await fetch("/api/orders?status=pending");
        if (r.ok) {
          const d = await r.json();
          setPendingOrders(d.orders?.length ?? 0);
        }
      } catch {}
    };
    poll();
    const id = setInterval(poll, 8000);
    return () => clearInterval(id);
  }, []);

  const email    = session?.user?.email || "";
  const initials = (session?.user?.name || email || "U")
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <div className="min-h-dvh flex bg-stone-50">

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 shrink-0">
        <div className="fixed top-0 left-0 h-screen w-60">
          <Sidebar slug={slug} pendingOrders={pendingOrders} />
        </div>
      </aside>

      {/* Mobile sidebar sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-white border-r border-stone-100">
          <Sidebar onNavigate={() => setOpen(false)} slug={slug} pendingOrders={pendingOrders} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="sticky top-0 z-30 h-14 border-b border-stone-100 bg-white/95 backdrop-blur-sm shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">

            {/* Mobile: hamburger + name */}
            <div className="flex items-center gap-3 lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                onClick={() => setOpen(true)}
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
              {restaurantName && (
                <span className="text-sm font-semibold text-stone-900 truncate max-w-[160px]">
                  {restaurantName}
                </span>
              )}
            </div>

            {/* Desktop: restaurant name */}
            {restaurantName ? (
              <div className="hidden lg:block">
                <span className="text-sm font-medium text-stone-400">{restaurantName}</span>
              </div>
            ) : (
              <div className="hidden lg:block" />
            )}

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-stone-100 transition-colors border border-stone-200">
                  <div className="h-7 w-7 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {initials || "A"}
                  </div>
                  <span className="hidden sm:block text-xs text-stone-600 max-w-[140px] truncate font-medium">
                    {email}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white border border-stone-200 text-stone-700 shadow-lg rounded-xl"
              >
                {restaurantName && (
                  <>
                    <div className="px-3 py-2.5">
                      <p className="text-xs font-semibold text-stone-900">{restaurantName}</p>
                      <p className="text-[11px] text-stone-400 truncate">{email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-stone-100" />
                  </>
                )}
                <DropdownMenuItem asChild className="focus:bg-stone-50 focus:text-stone-900 cursor-pointer rounded-lg mx-1">
                  <Link href="/dashboard/settings">
                    <Settings className="h-4 w-4 mr-2 text-stone-400" />
                    Réglages
                  </Link>
                </DropdownMenuItem>
                {slug && (
                  <DropdownMenuItem asChild className="focus:bg-stone-50 focus:text-stone-900 cursor-pointer rounded-lg mx-1">
                    <a href={`/menu/${slug}`} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2 text-stone-400" />
                      Voir le menu public
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-stone-100" />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer rounded-lg mx-1 mb-1"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 sm:px-6 py-6 pb-28 lg:pb-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav slug={slug} pendingOrders={pendingOrders} />
    </div>
  );
}
