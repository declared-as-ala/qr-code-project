"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu as MenuIcon, QrCode, X } from "lucide-react";

const LINKS = [
  { href: "#concept", label: "Concept" },
  { href: "#fonctionnement", label: "Fonctionnement" },
  { href: "#services", label: "Services" },
  { href: "/menu", label: "Explorer" },
];

export const WHATSAPP = "https://wa.me/21697991266";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <div
        className={`mx-auto flex h-14 max-w-5xl items-center justify-between rounded-2xl border pl-4 pr-2 transition-all duration-300 sm:h-16 ${
          scrolled
            ? "border-white/10 bg-[#0b0b0e]/80 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl"
            : "border-white/[0.06] bg-white/[0.03] backdrop-blur-md"
        }`}
      >
        <Link href="/" className="group flex items-center gap-2.5" aria-label="ClickMenu — accueil">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#09090b] transition-transform group-hover:rotate-[-6deg] group-hover:scale-105"
            style={{ background: "var(--pm-accent-gradient)" }}
          >
            <QrCode className="h-4 w-4 stroke-[2.5]" />
          </span>
          <span className="text-[17px] font-extrabold tracking-tight text-white">
            Click<span className="text-[var(--pm-accent)]">Menu</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-3.5 py-2 text-[13px] font-semibold text-zinc-300 transition-colors hover:text-white"
          >
            Connexion
          </Link>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="group flex h-10 items-center gap-1.5 rounded-xl px-4 text-[13px] font-bold text-[#09090b] transition-transform active:scale-[0.97]"
            style={{ background: "var(--pm-accent-gradient)" }}
          >
            Demander une démo
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-200 transition-colors hover:bg-white/[0.06] md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-2 max-w-5xl origin-top overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0e]/95 p-3 shadow-2xl backdrop-blur-xl md:hidden"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-semibold text-zinc-200 active:bg-white/[0.06]"
              >
                {l.label}
                <ArrowUpRight className="h-4 w-4 text-zinc-600" />
              </a>
            ))}
            <div className="my-2 h-px bg-white/[0.06]" />
            <div className="flex gap-2 p-1">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex h-12 flex-1 items-center justify-center rounded-xl border border-white/10 text-sm font-semibold text-white"
              >
                Connexion
              </Link>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 flex-[1.4] items-center justify-center rounded-xl text-sm font-bold text-[#09090b]"
                style={{ background: "var(--pm-accent-gradient)" }}
              >
                Demander une démo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
