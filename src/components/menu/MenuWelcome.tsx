"use client";

import { Button } from "@/components/ui/button";

export function MenuWelcome({
  restaurantName,
  subtitle,
  coverImage,
  logo,
  onViewMenu,
}: {
  restaurantName: string;
  subtitle: string;
  coverImage?: string;
  logo?: string;
  onViewMenu: () => void;
}) {
  return (
    <section className="relative h-[78svh] min-h-[500px] max-h-[660px] overflow-hidden bg-[#121218]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={
          coverImage ||
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1800&q=90"
        }
        alt={restaurantName}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/15" />

      <div className="absolute inset-x-4 bottom-6 rounded-[28px] border border-white/50 bg-white/95 p-5 text-center shadow-2xl backdrop-blur-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo || "https://api.dicebear.com/9.x/initials/svg?seed=EG"}
          alt={restaurantName}
          className="mx-auto h-14 w-14 rounded-2xl border border-[#d4a537]/45 bg-white object-cover"
        />
        <h1 className="mt-3 font-serif text-3xl font-bold text-[#1d150f]">Bienvenue chez {restaurantName}</h1>
        <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
        <Button
          onClick={onViewMenu}
          className="mt-4 h-12 w-full rounded-full bg-[#101014] text-white hover:bg-[#1d1e26]"
        >
          Voir le menu
        </Button>
        <p className="mt-2 text-xs text-neutral-500">Scannez, choisissez, degustez.</p>
      </div>
    </section>
  );
}
