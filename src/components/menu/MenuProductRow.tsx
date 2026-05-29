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

function MenuProductRowBase({
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
      className={`group relative flex select-none items-center gap-3 rounded-xl px-2 py-2 transition-colors active:bg-white/[0.04] ${
        !isAvailable ? "opacity-50" : ""
      }`}
      aria-label={`${name}${!isAvailable ? " - Indisponible" : ""}`}
    >
      {/* Thumbnail */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[var(--pm-bg-card)]">
        {image ? (
          <img
            src={thumb(image, 56, 56)}
            alt={name}
            width={56}
            height={56}
            className={`h-full w-full object-cover ${!isAvailable ? "grayscale-[60%]" : ""}`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
        )}
        {badgeKey && (
          <div className="absolute -right-1 -top-1 scale-[0.7] origin-top-right">
            <BadgePill badge={badgeKey} />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <h3
          className="truncate text-[13.5px] font-bold leading-tight text-[var(--pm-text-heading)]"
          style={{ fontFamily: "var(--pm-font-serif)" }}
        >
          {name}
        </h3>
        {hasDescription ? (
          <p className="mt-0.5 truncate text-[11.5px] leading-tight text-[var(--pm-text-muted)]">
            {description}
          </p>
        ) : !isAvailable ? (
          <p className="mt-0.5 text-[10.5px] font-bold uppercase tracking-wider text-zinc-500">
            Indisponible
          </p>
        ) : null}
      </div>

      {/* Price */}
      <div
        className="shrink-0 rounded-md px-2 py-1 text-[12.5px] font-black tabular-nums"
        style={{
          background: "rgba(212, 165, 55, 0.08)",
          color: "#efc360",
          border: "1px solid rgba(212, 165, 55, 0.18)",
        }}
      >
        {price}
      </div>
    </article>
  );
}

export const MenuProductRow = memo(MenuProductRowBase);
