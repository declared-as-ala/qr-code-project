"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChefHat, Sparkles } from "lucide-react";
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
      aria-label="Accueil du menu"
    >
      <img
        src={
          coverImage ||
          "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?auto=format&fit=crop&w=1800&q=90"
        }
        alt={`${restaurantName} ambiance`}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "brightness(0.88) saturate(1.12) contrast(1.05)" }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8, 5, 3, 0.62) 0%, rgba(8, 5, 3, 0.18) 38%, rgba(8, 5, 3, 0.96) 100%)",
        }}
      />

      <div
        className="absolute inset-y-0 left-0 z-30 w-[11px]"
        style={{
          background:
            "linear-gradient(to right, rgba(8, 5, 2, 0.76), rgba(24, 14, 7, 0.3), transparent)",
        }}
      />

      <div
        className="absolute inset-y-0 right-0 z-30 w-[5px]"
        style={{
          background:
            "repeating-linear-gradient(to bottom, rgba(238, 227, 203, 0.2) 0px, rgba(238, 227, 203, 0.2) 2px, rgba(210, 196, 168, 0.08) 2px, rgba(210, 196, 168, 0.08) 4px)",
        }}
      />

      <motion.header
        className="relative z-20 flex items-center gap-3 px-5 pt-5"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="relative shrink-0"
          initial={{ scale: 0.72, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.18, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div
            className="absolute inset-[-2px] rounded-[18px]"
            style={{ background: "var(--pm-accent-gradient)" }}
          />
          <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-[#1A1007]">
            {logo ? (
              <img src={logo} alt={restaurantName} className="h-full w-full object-cover" />
            ) : (
              <MenuLogoFallback size={36} />
            )}
          </div>
        </motion.div>

        <div className="min-w-0 flex-1">
          <h1
            className="truncate text-[24px] font-bold leading-tight text-white"
            style={{
              fontFamily: "var(--pm-font-serif)",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
          >
            {restaurantName}
          </h1>
          <p
            className="mt-1 flex items-center gap-1.5 text-[10px] font-bold uppercase"
            style={{
              color: "var(--pm-gold-soft)",
              letterSpacing: "0.14em",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {subtitle}
          </p>
        </div>
      </motion.header>

      <motion.div
        className="relative z-20 mt-auto px-5 pb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
      >
        <span
          className="mb-3 inline-flex min-h-8 items-center gap-2 rounded-full px-3 text-[11px] font-bold uppercase"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 244, 220, 0.16)",
            color: "var(--pm-gold-soft)",
            letterSpacing: "0.1em",
          }}
        >
          <ChefHat className="h-4 w-4" aria-hidden="true" />
          Selection maison
        </span>

        <h2
          className="max-w-[360px] text-[47px] font-bold leading-[0.92] text-white"
          style={{
            fontFamily: "var(--pm-font-serif)",
            textShadow: "0 8px 30px rgba(0, 0, 0, 0.55)",
          }}
        >
          Une carte qui donne envie.
        </h2>

        <p className="mt-3 max-w-[320px] text-[14px] font-medium leading-6 text-white/75">
          Plats frais, douceurs maison et prix clairs pour choisir sans attendre.
        </p>

        <button
          onClick={() => {
            void playPaperRustleSound();
            onViewMenu();
          }}
          className="group relative mt-6 flex h-[54px] w-full items-center justify-center overflow-hidden rounded-2xl text-[15px] font-bold transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2"
          style={{
            background: "var(--pm-accent-gradient)",
            color: "white",
            boxShadow:
              "0 18px 42px rgba(120, 22, 14, 0.34), inset 0 1px 0 rgba(255,255,255,0.22)",
          }}
          aria-label="Voir le menu"
        >
          <span
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.18) 50%, transparent 70%)",
            }}
          />
          <span className="relative flex items-center gap-2.5">
            Voir le menu
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </button>

        <p
          className="mt-4 text-center text-[10px] font-bold uppercase"
          style={{ color: "rgba(255, 244, 220, 0.56)", letterSpacing: "0.12em" }}
        >
          Cuisine maison - service chaleureux
        </p>
      </motion.div>
    </section>
  );
}
