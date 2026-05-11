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
      {/* Full-bleed cover */}
      <img
        src={
          coverImage ||
          "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?auto=format&fit=crop&w=1800&q=90"
        }
        alt={`${restaurantName} — ambiance`}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "brightness(0.9) saturate(1.08)" }}
      />

      {/* Depth gradient — rich, cinematic */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,6,4,0.06) 0%, rgba(8,6,4,0.18) 30%, rgba(8,6,4,0.65) 58%, rgba(8,6,4,0.93) 80%, #08060400 100%), linear-gradient(180deg, transparent 50%, #0D0A07 100%)",
        }}
      />

      {/* Warm ambient glow upper-right */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 70% 18%, rgba(201, 136, 26, 0.22), transparent 65%)",
        }}
      />

      {/* Content — flows from bottom up */}
      <div className="relative z-10 mt-auto">
        {/* Restaurant name above the card */}
        <motion.div
          className="px-6 pb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p
            className="text-[10.5px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "rgba(232, 184, 75, 0.88)" }}
          >
            {subtitle}
          </p>
          <h1
            className="mt-1.5 text-[34px] font-bold leading-[1.0] tracking-[-0.03em]"
            style={{ fontFamily: "var(--pm-font-serif)", color: "#F5F0E8" }}
          >
            {restaurantName}
          </h1>
        </motion.div>

        {/* Floating card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.68, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-3.5 mb-4 overflow-hidden rounded-[26px] p-5"
          style={{
            background: "rgba(255, 253, 248, 0.97)",
            border: "1px solid rgba(193, 160, 98, 0.2)",
            backdropFilter: "blur(24px) saturate(1.6)",
            boxShadow:
              "0 28px 70px rgba(0, 0, 0, 0.32), 0 6px 20px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          {/* Logo + info row */}
          <div className="flex items-center gap-3.5">
            <motion.div
              initial={{ scale: 0.72, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.22, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative shrink-0"
            >
              {/* Ambient glow behind logo */}
              <div
                className="absolute inset-0 rounded-[20px] blur-[10px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(201, 136, 26, 0.45), transparent 70%)",
                  transform: "scale(1.4)",
                }}
              />
              {/* Gold gradient ring */}
              <div
                className="absolute inset-[-2.5px] rounded-[20px]"
                style={{
                  background: "linear-gradient(145deg, #F5D78A 0%, #C9881A 45%, #7A4C0A 100%)",
                }}
              />
              {/* Logo container */}
              <div
                className="relative flex h-[54px] w-[54px] items-center justify-center overflow-hidden rounded-[18px]"
                style={{ background: "#FFF8EE" }}
              >
                {logo ? (
                  <img
                    src={logo}
                    alt={restaurantName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <MenuLogoFallback size={38} />
                )}
              </div>
            </motion.div>

            <div className="min-w-0 flex-1">
              <p
                className="truncate text-[15px] font-semibold leading-tight tracking-tight"
                style={{
                  fontFamily: "var(--pm-font-serif)",
                  color: "var(--pm-text-heading)",
                }}
              >
                {restaurantName}
              </p>
              <p
                className="mt-0.5 text-[11.5px]"
                style={{ color: "var(--pm-text-muted)" }}
              >
                {subtitle}
              </p>
            </div>

            {/* Open status pill */}
            <div
              className="shrink-0 flex items-center gap-1.5 rounded-full px-2.5 py-1.5"
              style={{
                background: "rgba(22, 163, 74, 0.09)",
                border: "1px solid rgba(22, 163, 74, 0.22)",
              }}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span
                className="text-[10px] font-semibold text-emerald-700"
                style={{ letterSpacing: "0.04em" }}
              >
                Ouvert
              </span>
            </div>
          </div>

          {/* Hairline separator */}
          <div
            className="my-4 h-px"
            style={{ background: "var(--pm-border-subtle)" }}
          />

          {/* CTA button */}
          <button
            onClick={() => {
              void playPaperRustleSound();
              onViewMenu();
            }}
            className="group relative w-full overflow-hidden rounded-[13px] transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              height: "50px",
              background: "linear-gradient(145deg, #2D2016 0%, #1A1209 100%)",
              boxShadow:
                "0 8px 24px rgba(26, 18, 9, 0.28), 0 2px 6px rgba(26, 18, 9, 0.14), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
            aria-label="Voir le menu"
          >
            {/* Subtle hover sheen */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.07) 50%, transparent 65%)",
              }}
            />
            <span className="relative flex items-center justify-center gap-2.5">
              <span
                className="text-[14.5px] font-semibold"
                style={{ color: "#F5F0E8", letterSpacing: "0.02em" }}
              >
                Voir le menu
              </span>
              <ArrowRight
                className="h-[15px] w-[15px] transition-transform duration-200 group-hover:translate-x-0.5"
                style={{ color: "var(--pm-accent-light)" }}
                aria-hidden="true"
              />
            </span>
          </button>

          <p
            className="mt-3 text-center text-[11px]"
            style={{ color: "var(--pm-text-muted)", letterSpacing: "0.01em" }}
          >
            Scannez · Choisissez · Dégustez
          </p>
        </motion.div>
      </div>
    </section>
  );
}
