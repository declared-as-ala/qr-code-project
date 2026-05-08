import { cn } from "@/lib/utils";
import type { Badge } from "@/lib/mock-data";

const LABELS: Record<Badge, string> = {
  nouveau: "Nouveau",
  populaire: "Populaire",
  promo: "Promo",
  signature: "Signature",
};

const STYLES: Record<Badge, string> = {
  nouveau: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
  populaire: "bg-blue-500/15 text-blue-700 border-blue-500/30 dark:text-blue-400",
  promo: "bg-rose-500/15 text-rose-700 border-rose-500/30 dark:text-rose-400",
  signature: "bg-gold/20 text-gold border-gold/40",
};

export function BadgePill({ badge, className }: { badge: Badge; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border",
      STYLES[badge], className
    )}>
      {LABELS[badge]}
    </span>
  );
}
