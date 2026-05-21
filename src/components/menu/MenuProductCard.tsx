"use client";

import { Plus } from "lucide-react";
import { BadgePill } from "@/components/BadgePill";

type BadgeType = "nouveau" | "populaire" | "promo" | "signature";

const VALID_BADGES = new Set<BadgeType>([
  "nouveau",
  "populaire",
  "promo",
  "signature",
]);

function resolvesBadge(badge?: string): BadgeType | undefined {
  if (!badge) return undefined;
  const key = badge.toLowerCase() as BadgeType;
  return VALID_BADGES.has(key) ? key : undefined;
}

export function MenuProductCard({
  name,
  description,
  price,
  image,
  badge,
  isAvailable,
}: {
  name: string;
  description: string;
  price: string;
  image?: string;
  badge?: string;
  isAvailable: boolean;
}) {
  const badgeKey = resolvesBadge(badge);

  return (
    <article
      className={`group relative flex h-full select-none flex-col overflow-hidden rounded-[var(--pm-radius-card)] border bg-[var(--pm-bg-card-elevated)] transition-all duration-200 hover:-translate-y-1 active:scale-[0.985] ${
        !isAvailable ? "opacity-60" : ""
      }`}
      style={{
        borderColor: "var(--pm-border-subtle)",
        boxShadow: "var(--pm-shadow-card)",
      }}
      aria-label={`${name}${!isAvailable ? " - Indisponible" : ""}`}
    >
      <div className="relative aspect-[1.05/1] overflow-hidden bg-[#F0E8D8]">
        <img
          src={
            image ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=85"
          }
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          loading="lazy"
        />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(24, 10, 6, 0.44))",
          }}
        />

        {badgeKey && (
          <div className="absolute left-2 top-2">
            <BadgePill badge={badgeKey} />
          </div>
        )}

        <span
          className="absolute bottom-2 left-2 rounded-full px-2.5 py-1 text-[11px] font-black tabular-nums text-white"
          style={{
            background: "rgba(26, 18, 9, 0.78)",
            boxShadow: "inset 0 0 0 1px rgba(255, 244, 220, 0.16)",
          }}
        >
          {price}
        </span>

        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/45 backdrop-blur-[2px]">
            <span
              className="rounded-full px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.1em]"
              style={{
                background: "rgba(26, 18, 9, 0.78)",
                color: "#F5F0E8",
              }}
            >
              Indisponible
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3
          className="line-clamp-2 text-[14.5px] font-bold leading-snug text-[var(--pm-text-heading)]"
          style={{ fontFamily: "var(--pm-font-serif)" }}
        >
          {name}
        </h3>

        <p className="mt-1.5 flex-1 text-[11.5px] leading-[1.55] text-[var(--pm-text-muted)] line-clamp-2">
          {description}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase"
            style={{
              background: "var(--pm-accent-pale)",
              color: "var(--pm-accent-strong)",
              letterSpacing: "0.07em",
            }}
          >
            Maison
          </span>

          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105"
            style={{
              background: "var(--pm-accent-gradient)",
              color: "white",
              boxShadow: "var(--pm-shadow-action)",
            }}
            aria-hidden="true"
          >
            <Plus className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
