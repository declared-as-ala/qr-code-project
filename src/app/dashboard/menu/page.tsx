"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motionPreset } from "@/lib/motion/presets";

export default function DashboardMenuPage() {
  return (
    <motion.div {...motionPreset} className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">Gerer votre menu digital</h1>
        <p className="text-muted-foreground">Pilotez categories et articles du menu depuis un espace unique, pense pour la vitesse operationnelle.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Categories</CardTitle><CardDescription>Structurez votre carte pour une navigation fluide sur mobile.</CardDescription></CardHeader>
          <CardContent><Button asChild className="bg-primary text-primary-foreground"><Link href="/dashboard/categories">Ouvrir les categories</Link></Button></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Articles du menu</CardTitle><CardDescription>Gerez prix, badges, disponibilites et visuels en temps reel.</CardDescription></CardHeader>
          <CardContent><Button asChild className="bg-primary text-primary-foreground"><Link href="/dashboard/products">Ouvrir les articles</Link></Button></CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
