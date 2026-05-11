"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { playPaperRustleSound } from "@/lib/sounds/play-paper-rustle";
import { MenuLogoFallback } from "@/components/menu/MenuLogoFallback";

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
    <section
      className="relative flex h-full min-h-0 flex-col overflow-hidden"
      aria-label="Page d'accueil"
    >
      {/* ── Full-bleed cover photo ── */}
      <img
        src={
          coverImage ||
          "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?auto=format&fit=crop&w=1800&q=90"
        }
        alt={`${restaurantName} — ambiance`}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "brightness(0.82) saturate(1.08)" }}
      />

      {/* Subtle overall vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.32) 100%)",
        }}
      />

      {/* Book frame — barely visible */}

      {/* Spine — left */}
      <div
        className="absolute inset-y-0 left-0 z-30 w-[10px]"
        style={{
          background:
            "linear-gradient(to right, rgba(8,5,2,0.72) 0%, rgba(20,12,5,0.38) 60%, transparent 100%)",
        }}
      />

      {/* Pages edge — right */}
      <div
        className="absolute inset-y-0 right-0 z-30 w-[5px]"
        style={{
          background:
            "repeating-linear-gradient(to bottom, rgba(238,227,203,0.18) 0px, rgba(238,227,203,0.18) 2px, rgba(210,196,168,0.10) 2px, rgba(210,196,168,0.10) 4px)",
        }}
      />

      {/* ── TOP OVERLAY — frosted cream header ── */}
      <motion.div
        className="absolute inset-x-0 top-0 z-20 pl-[12px] pr-[7px]"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Gradient fade from top so it merges into the photo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(14,9,4,0.68) 0%, rgba(14,9,4,0.38) 65%, transparent 100%)",
          }}
        />

        <div className="relative flex items-center gap-3 px-3 pb-5 pt-4">
          {/* Logo */}
          <motion.div
            className="relative shrink-0"
            initial={{ scale: 0.72, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.18, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div
              className="absolute inset-[-2px] rounded-[13px]"
              style={{
                background:
                  "linear-gradient(145deg, #E8D38C 0%, #C48218 55%, #7A4C0A 100%)",
              }}
            />
            <div
              className="relative flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-[11px]"
              style={{ background: "#1A1007" }}
            >
              {logo ? (
                <img
                  src={logo}
                  alt={restaurantName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <MenuLogoFallback size={28} />
              )}
            </div>
          </motion.div>

          {/* Identity */}
          <div className="min-w-0 flex-1">
            <h1
              className="truncate text-[19px] font-bold leading-tight tracking-tight text-white"
              style={{
                fontFamily: "var(--pm-font-serif)",
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              }}
            >
              {restaurantName}
            </h1>
            <p
              className="mt-[3px] text-[9px] font-semibold uppercase"
              style={{
                color: "rgba(220, 190, 120, 0.85)",
                letterSpacing: "0.18em",
              }}
            >
              {subtitle}
            </p>
          </div>

        </div>
      </motion.div>

      {/* ── BOTTOM OVERLAY — dark gradient with CTA ── */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-20 pl-[12px] pr-[7px]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Dark gradient merging from photo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,6,2,0.92) 0%, rgba(10,6,2,0.70) 55%, transparent 100%)",
          }}
        />

        <div className="relative px-3 pb-5 pt-10">
          {/* CTA button */}
          <button
            onClick={() => {
              void playPaperRustleSound();
              onViewMenu();
            }}
            className="group relative w-full overflow-hidden transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-1"
            style={{
              height: "52px",
              borderRadius: "10px",
              background:
                "linear-gradient(150deg, rgba(44,32,20,0.88) 0%, rgba(26,18,9,0.92) 55%, rgba(37,26,13,0.88) 100%)",
              border: "1px solid rgba(193,155,80,0.32)",
              boxShadow: [
                "inset 0 1px 0 rgba(255,255,255,0.07)",
                "inset 0 -1px 0 rgba(0,0,0,0.4)",
                "0 4px 20px rgba(0,0,0,0.55)",
              ].join(", "),
              backdropFilter: "blur(12px)",
            }}
            aria-label="Voir le menu"
          >
            {/* Hover shimmer */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(105deg, transparent 30%, rgba(193,155,80,0.12) 50%, transparent 70%)",
              }}
            />

            <span className="relative flex items-center justify-center gap-2.5">
              <span
                className="text-[15px] font-semibold"
                style={{
                  color: "#EDE5D4",
                  letterSpacing: "0.03em",
                }}
              >
                Voir le menu
              </span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-[3px]"
                style={{ color: "#C4A05A" }}
                aria-hidden="true"
              />
            </span>
          </button>

          {/* Tagline */}
          <div className="mt-3 flex items-center gap-2">
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(193,155,80,0.30))",
              }}
            />
            <p
              className="text-[10px] font-medium"
              style={{ color: "rgba(160,130,80,0.75)", letterSpacing: "0.10em" }}
            >
              Scannez · Choisissez · Dégustez
            </p>
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(to left, transparent, rgba(193,155,80,0.30))",
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
