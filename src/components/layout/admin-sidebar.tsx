"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, ChartColumn, Store, ChevronRight, Coffee } from "lucide-react";

const nav = [
  { label: "Tableau de bord", href: "/admin", icon: ChartColumn },
  { label: "Enseignes", href: "/admin/enseignes", icon: Building2 },
  { label: "Comptes", href: "/admin/users", icon: Store },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-zinc-950/60 backdrop-blur-xl border-r border-white/5 text-zinc-100 flex flex-col">
      <div className="px-6 py-6 flex items-center gap-3 border-b border-white/5 bg-black/10">
        <div className="h-9 w-9 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
          <Coffee className="h-4 w-4 text-black" />
        </div>
        <div className="flex flex-col">
          <span className="font-display text-base font-semibold tracking-tight text-white">QR Menu</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Super Admin</span>
        </div>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                active
                  ? "bg-gradient-gold text-black shadow-gold font-semibold"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${active ? "text-black" : "text-zinc-400 group-hover:text-primary"}`} />
              <span className="flex-1">{item.label}</span>
              <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${active ? "translate-x-0.5" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
