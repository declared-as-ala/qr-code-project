"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type BadgeType = "nouveau" | "populaire" | "promo" | "signature";

const LABELS: Record<BadgeType, string> = {
  nouveau: "Nouveau",
  populaire: "Populaire",
  promo: "Promo",
  signature: "Signature",
};

const STYLES: Record<BadgeType, CSSProperties> = {
  signature: {
    background: "linear-gradient(135deg, rgba(245, 215, 138, 0.28), rgba(201, 136, 26, 0.18))",
    color: "#8B5E0A",
    border: "1px solid rgba(201, 136, 26, 0.35)",
  },
  populaire: {
    background: "rgba(14, 116, 210, 0.1)",
    color: "#1459A8",
    border: "1px solid rgba(14, 116, 210, 0.25)",
  },
  nouveau: {
    background: "rgba(22, 163, 74, 0.1)",
    color: "#146236",
    border: "1px solid rgba(22, 163, 74, 0.25)",
  },
  promo: {
    background: "rgba(220, 38, 38, 0.09)",
    color: "#B91C1C",
    border: "1px solid rgba(220, 38, 38, 0.22)",
  },
};

export function BadgePill({ badge, className }: { badge: BadgeType; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-[3px] text-[9px] font-bold uppercase tracking-[0.08em]",
        className
      )}
      style={{
        backdropFilter: "blur(8px)",
        ...STYLES[badge],
      }}
    >
      {LABELS[badge]}
    </span>
  );
}
