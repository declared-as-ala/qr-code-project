import Link from "next/link";
import { LogOut, Menu as MenuIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "super_admin") redirect("/dashboard");

  return (
    <div className="min-h-screen flex bg-[#09090b] text-zinc-100">
      <aside className="hidden lg:block w-64 shrink-0">
        <AdminSidebar />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-zinc-950/40 backdrop-blur-xl">
          <div className="h-full px-4 sm:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden hover:bg-white/5">
                <MenuIcon className="h-5 w-5 text-zinc-400" />
              </Button>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Espace Super Admin</p>
                <p className="text-sm font-semibold font-display text-zinc-200">Pilotage multi-enseignes</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-full pl-1 pr-3 py-1 hover:bg-white/5 transition-colors border border-white/5 bg-zinc-900/30">
                  <div className="h-8 w-8 rounded-full bg-gradient-gold text-black flex items-center justify-center text-xs font-bold shadow-gold">
                    SA
                  </div>
                  <span className="text-xs font-semibold text-zinc-300 hidden sm:inline-block">Super Admin</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border border-white/10 text-zinc-200">
                <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white">
                  <Link href="/admin">Tableau de bord</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Se deconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-10 max-w-[1400px] w-full mx-auto animate-fade-up">
          {children}
        </main>
      </div>
    </div>
  );
}
