"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
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
    <div className="flex h-full flex-col bg-white lg:rounded-[1.75rem] lg:border lg:border-[var(--h-line)] lg:shadow-[0_18px_50px_-28px_rgba(17,17,17,0.35)]">
      {/* Brand — clickable */}
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="flex flex-col gap-1 px-6 pb-4 pt-6"
      >
        <span className="flex items-baseline gap-0.5">
          <span className="text-[22px] font-extrabold tracking-[-0.04em] text-[var(--h-ink)]">click</span>
          <span className="text-[22px] font-extrabold tracking-[-0.04em] text-[var(--h-terra)]">menu</span>
          <span className="ml-0.5 text-[11px] font-bold text-[var(--h-muted)]">.tn</span>
        </span>
        <span className="w-fit rounded-full bg-[var(--h-sun)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--h-ink)]">
          Dashboard
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-3">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const badge = item.href === "/dashboard/after" && pendingOrders > 0 ? pendingOrders : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-150 ${
                active
                  ? "bg-[var(--h-ink)] text-white shadow-[0_10px_24px_-12px_rgba(17,17,17,0.6)]"
                  : "text-[var(--h-muted)] hover:bg-[#f6f3ee] hover:text-[var(--h-ink)]"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {badge > 0 && (
                <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none ${active ? "bg-white/20 text-white" : "bg-[var(--h-terra)] text-white"}`}>
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
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--h-muted)] hover:bg-[#f6f3ee] hover:text-[var(--h-ink)] transition-all"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span className="flex-1">Voir le menu public</span>
          </a>
        )}
      </nav>

      {/* Logout */}
      <div className="border-t border-[var(--h-line)] px-3 pb-4 pt-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--h-muted)] hover:bg-red-50 hover:text-red-500 transition-all"
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
      className="lg:hidden fixed inset-x-3 z-40 flex items-stretch overflow-hidden rounded-2xl border border-[var(--h-line)] bg-white/95 backdrop-blur-xl shadow-[0_18px_40px_-16px_rgba(17,17,17,0.45)]"
      style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const badge = item.href === "/dashboard/after" && (pendingOrders ?? 0) > 0 ? pendingOrders : 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
              active ? "text-[var(--h-ink)]" : "text-stone-400"
            }`}
          >
            <item.icon className={`h-5 w-5 transition-transform ${active ? "scale-110" : ""}`} />
            <span>{item.label}</span>
            {badge ? (
              <span className="absolute top-1.5 right-1/4 translate-x-2 bg-[var(--h-terra)] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
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
    <div className="dash-root home-root home-bg min-h-dvh flex">

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="fixed left-3 top-3 h-[calc(100vh-1.5rem)] w-[15.5rem]">
          <Sidebar slug={slug} pendingOrders={pendingOrders} />
        </div>
      </aside>

      {/* Mobile sidebar sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="dash-root home-root p-0 w-64 bg-white border-r border-[var(--h-line)]">
          <Sidebar onNavigate={() => setOpen(false)} slug={slug} pendingOrders={pendingOrders} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/40 backdrop-blur-md">
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
                <span className="text-sm font-semibold text-[var(--h-muted)]">{restaurantName}</span>
              </div>
            ) : (
              <div className="hidden lg:block" />
            )}

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-[var(--h-line)] bg-white py-1 pl-1 pr-3 shadow-sm transition-colors hover:bg-[#f6f3ee]">
                  <div className="h-8 w-8 rounded-full bg-[var(--h-ink)] text-white flex items-center justify-center text-xs font-bold shrink-0">
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
