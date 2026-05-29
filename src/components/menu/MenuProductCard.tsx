"use client";

import { memo } from "react";
import { BadgePill } from "@/components/BadgePill";
import { thumb } from "@/lib/utils";

type BadgeType = "nouveau" | "populaire" | "promo" | "signature";

const VALID_BADGES = new Set<BadgeType>(["nouveau", "populaire", "promo", "signature"]);

function resolvesBadge(badge?: string): BadgeType | undefined {
  if (!badge) return undefined;
  const key = badge.toLowerCase() as BadgeType;
  return VALID_BADGES.has(key) ? key : undefined;
}

function MenuProductCardBase({
  name,
  description,
  price,
  image,
  badge,
  isAvailable,
}: {
  name: string;
  description?: string;
  price: string;
  image?: string;
  badge?: string;
  isAvailable: boolean;
}) {
  const badgeKey = resolvesBadge(badge);
  const hasDescription = !!description?.trim();

  return (
    <article
      className={`group relative flex h-full select-none flex-col overflow-hidden rounded-2xl border bg-[var(--pm-bg-card-elevated)] transition-all duration-300 active:scale-[0.985] ${
        !isAvailable ? "opacity-40 grayscale-[40%]" : ""
      }`}
      style={{
        borderColor: "rgba(255, 255, 255, 0.05)",
        boxShadow: "0 6px 18px -6px rgba(0,0,0,0.4)",
      }}
      aria-label={`${name}${!isAvailable ? " - Indisponible" : ""}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--pm-bg-card)]">
        {image ? (
          <img
            src={thumb(image, 240, 180)}
            alt={name}
            width={240}
            height={180}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
        )}

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(9, 9, 11, 0.7))",
          }}
        />

        {badgeKey && (
          <div className="absolute left-1.5 top-1.5">
            <BadgePill badge={badgeKey} />
          </div>
        )}

        <span
          className="absolute bottom-1.5 left-1.5 rounded-md px-2 py-0.5 text-[11px] font-black tabular-nums"
          style={{
            background: "rgba(3, 3, 3, 0.78)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            color: "#efc360",
          }}
        >
          {price}
        </span>

        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#09090b]/65 backdrop-blur-[3px]">
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
              style={{
                background: "rgba(17, 17, 21, 0.92)",
                color: "var(--pm-text-muted)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              Indisponible
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-2.5">
        <h3
          className="line-clamp-2 text-[13px] font-bold leading-snug text-[var(--pm-text-heading)]"
          style={{ fontFamily: "var(--pm-font-serif)" }}
        >
          {name}
        </h3>
        {hasDescription && (
          <p className="mt-1 text-[11px] leading-[1.45] text-[var(--pm-text-muted)] line-clamp-1">
            {description}
          </p>
        )}
      </div>
    </article>
  );
}

export const MenuProductCard = memo(MenuProductCardBase);
