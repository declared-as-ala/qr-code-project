import Link from "next/link";
import { BarChart3, LayoutDashboard, Menu, QrCode, Settings, Store, UtensilsCrossed, Eye, LogOut, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const nav = [
    { label: "Vue d ensemble", href: "/dashboard", icon: LayoutDashboard },
    { label: "Gerer votre menu digital", href: "/dashboard/menu", icon: UtensilsCrossed },
    { label: "Articles du menu", href: "/dashboard/products", icon: Settings },
    { label: "Categories", href: "/dashboard/categories", icon: Store },
    { label: "QR Code de votre menu", href: "/dashboard/qr-code", icon: QrCode },
    { label: "Parametres", href: "/dashboard/settings", icon: KeyRound },
    { label: "Statistiques", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Voir le menu public", href: "/dashboard/preview", icon: Eye },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-72 rounded-2xl border border-primary/15 bg-card/85 p-5 backdrop-blur md:block">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">Espace Enseigne</h2>
            <Badge className="border border-primary/30 bg-primary/10 text-primary">Premium</Badge>
          </div>
          <nav className="space-y-1.5">
            {nav.map((item) => (
              <Link key={`desktop-${item.href}`} href={item.href} className="flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-sm text-muted-foreground transition hover:border-primary/20 hover:bg-primary/10 hover:text-foreground">
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="w-full space-y-4">
          <header className="flex items-center justify-between rounded-2xl border border-primary/15 bg-card/85 p-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon-sm" className="md:hidden">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="border-r border-primary/20 bg-card">
                  <SheetHeader>
                    <SheetTitle>Navigation enseigne</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <nav className="space-y-1.5">
                      {nav.map((item) => (
                        <Link key={`mobile-${item.href}`} href={item.href} className="flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-sm text-muted-foreground transition hover:border-primary/20 hover:bg-primary/10 hover:text-foreground">
                          <item.icon className="size-4" />
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
              <p className="text-sm text-muted-foreground">Pilotage premium de votre menu QR</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 rounded-xl px-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="size-8"><AvatarFallback>EA</AvatarFallback></Avatar>
                    </TooltipTrigger>
                    <TooltipContent>Compte admin enseigne</TooltipContent>
                  </Tooltip>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/dashboard/settings">Parametres</Link></DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="size-4" />
                  Deconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <div className="rounded-2xl border border-primary/15 bg-card/90 p-5 shadow-xl shadow-black/20">{children}</div>
        </main>
      </div>
    </div>
  );
}
