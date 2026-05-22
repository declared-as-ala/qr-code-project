"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type User = { _id: string; name: string; email: string; role: string };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  useEffect(() => {
    fetch("/api/admin/users").then(async (res) => {
      if (res.ok) setUsers(await res.json());
    });
  }, []);

  async function resetPassword() {
    const res = await fetch(`/api/admin/users/${selectedId}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ temporaryPassword: tempPassword }),
    });
    const payload = await res.json();
    if (!res.ok) return toast.error(payload.error || "Echec reinitialisation");
    toast.success("Mot de passe temporaire reinitialise.");
    setTempPassword("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Comptes utilisateurs</h1>
        <p className="text-muted-foreground">Consultez les comptes propriétaires et gérez leurs accès de sécurité.</p>
      </div>
      <Card className="glass-card overflow-hidden">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-white font-display">Admins d'enseigne</CardTitle>
          <CardDescription className="text-zinc-400 text-xs">Seuls les comptes créés par le Super Admin peuvent accéder au portail restaurateur.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-950/40">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs py-4 px-6">Nom</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs py-4">Email</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs py-4">Rôle</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs py-4 text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id} className="border-white/5 hover:bg-white/[0.01] transition-colors">
                  <TableCell className="font-semibold text-white py-4 px-6">{u.name}</TableCell>
                  <TableCell className="text-zinc-300 py-4 font-mono text-sm">{u.email}</TableCell>
                  <TableCell className="py-4">
                    <span className={`text-xs px-2.5 py-0.5 rounded ${
                      u.role === "super_admin" 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "bg-zinc-800 text-zinc-300"
                    }`}>
                      {u.role === "super_admin" ? "Super Admin" : "Restaurateur"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-right pr-6">
                    {u.role === "restaurant_admin" ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="border-white/5 hover:bg-white/5 text-zinc-300 hover:text-white rounded-lg" onClick={() => setSelectedId(u._id)}>
                            <KeyRound className="size-3.5 mr-1" />Reset mot de passe
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-sm">
                          <DialogHeader>
                            <DialogTitle className="text-lg font-semibold font-display text-white">Réinitialisation du mot de passe</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-2">
                            <p className="text-xs text-zinc-400">Configurez un mot de passe temporaire que le restaurateur devra modifier à sa prochaine connexion.</p>
                            <Input type="password" value={tempPassword} onChange={(e)=>setTempPassword(e.target.value)} className="bg-zinc-900 border-white/10 text-white focus:border-primary/45 rounded-xl h-10" placeholder="Minimum 8 caractères" />
                            <Button onClick={resetPassword} className="w-full bg-gradient-gold text-black font-semibold shadow-gold hover:opacity-90 transition-all rounded-xl h-10">
                              Valider et appliquer
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
