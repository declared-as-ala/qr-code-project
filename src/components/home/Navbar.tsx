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
    const onScroll = () => setScrolled(window.scrollY > 12);
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
        className={`mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border pl-4 pr-1.5 transition-all duration-300 sm:h-16 sm:pl-5 ${
          scrolled
            ? "border-[var(--h-line)] bg-white/90 shadow-[0_10px_30px_-12px_rgba(20,27,45,0.25)] backdrop-blur-xl"
            : "border-transparent bg-white/60 backdrop-blur-md"
        }`}
      >
        <Link href="/" className="group flex items-center gap-2.5" aria-label="ClickMenu — accueil">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--h-navy)] text-white transition-transform group-hover:rotate-[-8deg]">
            <QrCode className="h-4 w-4 stroke-[2.25]" />
          </span>
          <span className="text-[18px] font-extrabold tracking-tight text-[var(--h-ink)]">
            Click<span className="text-[var(--h-terra)]">Menu</span>
          </span>
        </Link>

        <nav className="hidden items-center md:flex" aria-label="Navigation principale">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-[14px] font-semibold text-[var(--h-muted)] transition-colors hover:bg-[var(--h-sand)] hover:text-[var(--h-ink)]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <Link href="/login" className="rounded-full px-4 py-2 text-[14px] font-semibold text-[var(--h-ink)] hover:bg-[var(--h-sand)]">
            Connexion
          </Link>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="group flex h-11 items-center gap-1.5 rounded-full bg-[var(--h-terra)] px-5 text-[14px] font-bold text-white transition-colors hover:bg-[var(--h-terra-2)] active:scale-[0.97]"
          >
            Demander une démo
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--h-sand)] text-[var(--h-ink)] md:hidden"
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
            className="mx-auto mt-2 max-w-5xl origin-top overflow-hidden rounded-3xl border border-[var(--h-line)] bg-white p-3 shadow-2xl md:hidden"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-[16px] font-semibold text-[var(--h-ink)] active:bg-[var(--h-sand)]"
              >
                {l.label}
                <ArrowUpRight className="h-4 w-4 text-[var(--h-muted)]" />
              </a>
            ))}
            <div className="my-2 h-px bg-[var(--h-line)]" />
            <div className="flex gap-2 p-1">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex h-12 flex-1 items-center justify-center rounded-full border border-[var(--h-line)] text-sm font-bold text-[var(--h-ink)]"
              >
                Connexion
              </Link>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 flex-[1.4] items-center justify-center rounded-full bg-[var(--h-terra)] text-sm font-bold text-white"
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
