"use client";

import { Badge } from "@/components/ui/badge";

function badgeClass(badge?: string) {
  if (!badge) return "";
  switch (badge.toLowerCase()) {
    case "signature":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "populaire":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "nouveau":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "promo":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-neutral-100 text-neutral-700 border-neutral-200";
  }
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
  return (
    <article
      className={`overflow-hidden rounded-[22px] border border-[#eee4d5] bg-white text-[#1c140d] shadow-[0_10px_24px_rgba(31,22,14,0.1)] ${
        !isAvailable ? "opacity-60" : ""
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={
          image ||
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=90"
        }
        alt={name}
        className="h-[120px] w-full object-cover"
      />
      <div className="p-4">
        <h3 className="font-serif text-[17px] font-semibold tracking-tight text-[#24190f] leading-tight break-words">
          {name}
        </h3>
        <p className="mt-1 text-[12px] leading-[1.45] text-neutral-500 break-words">{description}</p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[13px] font-bold text-[#c98b19]">{price}</p>
          {badge ? (
            <Badge
              variant="outline"
              className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${badgeClass(
                badge
              )}`}
            >
              {badge}
            </Badge>
          ) : null}
        </div>
      </div>
    </article>
  );
}
