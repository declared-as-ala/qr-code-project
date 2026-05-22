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
    background: "linear-gradient(135deg, rgba(245, 230, 204, 0.2) 0%, rgba(212, 165, 55, 0.25) 50%, rgba(154, 118, 32, 0.25) 100%)",
    color: "#efc360",
    border: "1px solid rgba(212, 165, 55, 0.5)",
    boxShadow: "0 2px 8px rgba(212, 165, 55, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
  },
  populaire: {
    background: "linear-gradient(135deg, rgba(191, 219, 254, 0.15) 0%, rgba(96, 165, 250, 0.2) 50%, rgba(30, 64, 175, 0.2) 100%)",
    color: "#93c5fd",
    border: "1px solid rgba(96, 165, 250, 0.4)",
    boxShadow: "0 2px 8px rgba(96, 165, 250, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
  },
  nouveau: {
    background: "linear-gradient(135deg, rgba(187, 247, 208, 0.15) 0%, rgba(74, 222, 128, 0.2) 50%, rgba(22, 101, 52, 0.2) 100%)",
    color: "#86efac",
    border: "1px solid rgba(74, 222, 128, 0.4)",
    boxShadow: "0 2px 8px rgba(74, 222, 128, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
  },
  promo: {
    background: "linear-gradient(135deg, rgba(254, 202, 202, 0.15) 0%, rgba(248, 113, 113, 0.2) 50%, rgba(153, 27, 27, 0.2) 100%)",
    color: "#fca5a5",
    border: "1px solid rgba(248, 113, 113, 0.4)",
    boxShadow: "0 2px 8px rgba(248, 113, 113, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
  },
};

export function BadgePill({ badge, className }: { badge: BadgeType; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-[3.5px] text-[9.5px] font-black uppercase tracking-[0.1em]",
        className
      )}
      style={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        ...STYLES[badge],
      }}
    >
      {LABELS[badge]}
    </span>
  );
}
