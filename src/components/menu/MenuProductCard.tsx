"use client";


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
      className={`group relative flex h-full select-none flex-col overflow-hidden rounded-[var(--pm-radius-card)] border bg-[var(--pm-bg-card-elevated)] transition-all duration-300 hover:-translate-y-1 active:scale-[0.985] ${
        !isAvailable ? "opacity-40 backdrop-blur-[2px] filter grayscale-[40%] contrast-[90%] brightness-[75%]" : ""
      }`}
      style={{
        borderColor: "rgba(255, 255, 255, 0.05)",
        boxShadow: "0 8px 24px -4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.02)",
      }}
      aria-label={`${name}${!isAvailable ? " - Indisponible" : ""}`}
    >
      <div className="relative aspect-[1.05/1] overflow-hidden bg-[var(--pm-bg-card)]">
        <img
          src={
            image ||
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=85"
          }
          alt={name}
          className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.12] group-hover:rotate-1"
          loading="lazy"
        />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(9, 9, 11, 0.65))",
          }}
        />

        {badgeKey && (
          <div className="absolute left-2 top-2">
            <BadgePill badge={badgeKey} />
          </div>
        )}

        <span
          className="absolute bottom-2 left-2 rounded-full px-3 py-1.5 text-[11.5px] font-black tabular-nums text-white backdrop-blur-md"
          style={{
            background: "rgba(3, 3, 3, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
            color: "#efc360",
          }}
        >
          {price}
        </span>

        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#09090b]/65 backdrop-blur-[4px]">
            <span
              className="rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]"
              style={{
                background: "rgba(17, 17, 21, 0.95)",
                color: "var(--pm-text-muted)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.4)",
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

        <div className="mt-3 flex items-center gap-2">
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
        </div>
      </div>
    </article>
  );
}
