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
        <h1 className="text-3xl font-semibold">Comptes utilisateurs</h1>
        <p className="text-muted-foreground">Consultez les comptes proprietaires et gerez leur acces.</p>
      </div>
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Admins d enseigne</CardTitle>
          <CardDescription>Seuls les comptes crees par le Super Admin peuvent acceder a la plateforme.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Nom</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    {u.role === "restaurant_admin" ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => setSelectedId(u._id)}><KeyRound className="size-4" />Reset mot de passe</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Nouveau mot de passe temporaire</DialogTitle></DialogHeader>
                          <div className="space-y-3">
                            <Input type="password" value={tempPassword} onChange={(e)=>setTempPassword(e.target.value)} placeholder="Minimum 8 caracteres" />
                            <Button onClick={resetPassword}>Valider</Button>
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
