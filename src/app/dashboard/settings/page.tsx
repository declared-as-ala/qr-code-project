"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import RestaurantPage from "../restaurant/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motionPreset } from "@/lib/motion/presets";

export default function DashboardSettingsPage() {
  return (
    <motion.div {...motionPreset} className="space-y-5">
      <Card>
        <CardHeader><CardTitle>Securite du compte</CardTitle><CardDescription>Renforcez l acces de votre equipe avec un renouvellement regulier du mot de passe.</CardDescription></CardHeader>
        <CardContent><Button asChild variant="outline"><Link href="/dashboard/password">Changer le mot de passe</Link></Button></CardContent>
      </Card>
      <RestaurantPage />
    </motion.div>
  );
}
