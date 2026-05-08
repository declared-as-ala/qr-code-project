import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: { value: string; positive?: boolean };
  icon: React.ComponentType<{ className?: string }>;
  accent?: boolean;
}

export function StatCard({ label, value, delta, icon: Icon, accent }: StatCardProps) {
  return (
    <Card className={cn(
      "p-6 relative overflow-hidden border-border/60 shadow-soft transition-all hover:shadow-elegant hover:-translate-y-0.5",
      accent && "bg-gradient-noir text-cream border-transparent"
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className={cn("text-xs font-medium uppercase tracking-wider", accent ? "text-cream/60" : "text-muted-foreground")}>
            {label}
          </p>
          <p className={cn("mt-3 font-display text-3xl font-semibold", accent && "text-cream")}>
            {value}
          </p>
          {delta && (
            <div className={cn(
              "mt-2 inline-flex items-center gap-1 text-xs font-medium",
              delta.positive ? "text-emerald-600" : "text-destructive",
              accent && (delta.positive ? "text-emerald-300" : "text-red-300")
            )}>
              {delta.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {delta.value}
            </div>
          )}
        </div>
        <div className={cn(
          "h-11 w-11 rounded-xl flex items-center justify-center",
          accent ? "bg-gold/20 text-gold" : "bg-gold/10 text-gold"
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
