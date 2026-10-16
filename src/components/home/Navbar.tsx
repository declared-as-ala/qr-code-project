"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu as MenuIcon, X } from "lucide-react";

const LINKS = [
  { href: "#concept", label: "Concept" },
  { href: "#fonctionnement", label: "Fonctionnement" },
  { href: "#services", label: "Services" },
  { href: "#faq", label: "FAQ" },
  { href: "/menu", label: "Partenaires" },
];

export const WHATSAPP = "https://wa.me/21697991266";

function Logo() {
  return (
    <Link href="/" className="flex items-baseline gap-0.5" aria-label="ClickMenu — accueil">
      <span className="text-[22px] font-extrabold tracking-[-0.04em] text-[var(--h-ink)]">click</span>
      <span className="text-[22px] font-extrabold tracking-[-0.04em] text-[var(--h-terra)]">menu</span>
      <span className="ml-0.5 text-[11px] font-bold text-[var(--h-muted)]">.tn</span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // On other pages (e.g. /menu) in-page anchors must point back to the home page.
  const href = (h: string) => (h.startsWith("#") && pathname !== "/" ? `/${h}` : h);
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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "border-b border-[var(--h-line)] bg-white/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={href(l.href)}
              className="rounded-full px-3.5 py-2 text-[14px] font-medium text-[var(--h-ink)]/80 transition-colors hover:text-[var(--h-terra)]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" className="px-3 py-2 text-[14px] font-semibold text-[var(--h-ink)] hover:text-[var(--h-terra)]">
            Connexion
          </Link>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex h-10 items-center gap-1.5 rounded-xl bg-[var(--h-ink)] px-5 text-[14px] font-bold text-white transition-transform active:scale-[0.97]"
          >
            Demander une démo
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--h-ink)] md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="border-t border-[var(--h-line)] bg-white px-5 pb-5 pt-2 md:hidden"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={href(l.href)}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-[var(--h-line)] py-4 text-[16px] font-semibold text-[var(--h-ink)]"
              >
                {l.label}
                <ArrowUpRight className="h-4 w-4 text-[var(--h-muted)]" />
              </a>
            ))}
            <div className="mt-4 flex gap-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex h-12 flex-1 items-center justify-center rounded-xl border border-[var(--h-line)] text-sm font-bold text-[var(--h-ink)]"
              >
                Connexion
              </Link>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 flex-[1.4] items-center justify-center rounded-xl bg-[var(--h-ink)] text-sm font-bold text-white"
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
