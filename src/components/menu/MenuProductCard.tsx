"use client";

import { BadgePill } from "@/components/BadgePill";

type BadgeType = "nouveau" | "populaire" | "promo" | "signature";

const VALID_BADGES = new Set<BadgeType>(["nouveau", "populaire", "promo", "signature"]);

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
      className={`group relative flex cursor-pointer select-none flex-col overflow-hidden rounded-[var(--pm-radius-card)] bg-[var(--pm-bg-card-elevated)] transition-all duration-200 active:scale-[0.97] ${
        !isAvailable ? "opacity-50" : ""
      }`}
      style={{ boxShadow: "var(--pm-shadow-card)" }}
      aria-label={`${name}${!isAvailable ? " — Indisponible" : ""}`}
    >
      {/* Image — square ratio for premium feel */}
      <div className="relative aspect-square overflow-hidden bg-[#F0E8D8]">
        <img
          src={
            image ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=85"
          }
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          loading="lazy"
        />

        {/* Image overlay — gentle vignette at bottom */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(26, 18, 9, 0.12))",
          }}
        />

        {/* Badge */}
        {badgeKey && (
          <div className="absolute left-2 top-2">
            <BadgePill badge={badgeKey} />
          </div>
        )}

        {/* Unavailable overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px] bg-white/45">
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

      {/* Card body */}
      <div className="flex flex-1 flex-col p-3 pb-3.5">
        <h3
          className="line-clamp-2 text-[13.5px] font-semibold leading-snug tracking-tight text-[var(--pm-text-heading)]"
          style={{ fontFamily: "var(--pm-font-serif)" }}
        >
          {name}
        </h3>

        <p className="mt-1 flex-1 text-[11px] leading-[1.55] text-[var(--pm-text-muted)] line-clamp-2">
          {description}
        </p>

        {/* Price + add row */}
        <div className="mt-2.5 flex items-center justify-between gap-1">
          <span
            className="text-[14px] font-bold tabular-nums"
            style={{
              color: "var(--pm-accent)",
              fontFamily: "var(--pm-font-sans)",
            }}
          >
            {price}
          </span>

          {/* Add indicator */}
          <div
            className="flex h-[22px] w-[22px] items-center justify-center rounded-full transition-all duration-150 group-hover:scale-110"
            style={{
              background: "var(--pm-accent-pale)",
              border: "1px solid rgba(201, 136, 26, 0.18)",
            }}
            aria-hidden="true"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 2v6M2 5h6"
                stroke="var(--pm-accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </article>
  );
}
