"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, QrCode, Smartphone, Sparkles,
  Zap, Globe, Star, MessageSquare, Menu as MenuIcon,
  X, Check, ChevronRight, Scan, Clock, TrendingUp, ShoppingBag,
} from "lucide-react";

const GOLD = "#c8a46a";

function cn(...cls: (string | false | undefined)[]) { return cls.filter(Boolean).join(" "); }

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[200px] sm:w-[240px] lg:w-[270px]">
      <div className="absolute inset-0 scale-110 rounded-[50px] blur-3xl opacity-20" style={{ background: GOLD }} />
      <div className="relative rounded-[38px] border-[7px] border-stone-700 bg-white shadow-[0_32px_80px_-12px_rgba(0,0,0,0.5)] overflow-hidden" style={{ aspectRatio: "9/19" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-stone-800 rounded-b-2xl z-10" />
        <div className="flex flex-col h-full bg-[#0a0a0f]">
          <div className="relative h-[38%] shrink-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-950" />
            <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=400&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <span className="text-white text-[7px] font-bold">CM</span>
              </div>
              <div>
                <div className="h-2 w-16 bg-white/90 rounded-full" />
                <div className="h-1.5 w-10 bg-white/40 rounded-full mt-1" />
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 px-2.5 py-2 overflow-hidden shrink-0">
            {["Cafés", "Desserts", "Boissons", "Salé"].map((c, i) => (
              <div key={c} className={cn("px-2 py-0.5 rounded-full text-[8px] font-semibold shrink-0", i === 0 ? "text-black" : "bg-white/5 text-white/50")}
                style={i === 0 ? { background: GOLD } : {}}>{c}</div>
            ))}
          </div>
          <div className="flex-1 px-2.5 space-y-1.5 overflow-hidden">
            {[{ n: "Espresso", p: "6 DT", pop: false }, { n: "Cappuccino", p: "8 DT", pop: true }, { n: "Latte Saveur", p: "9 DT", pop: false }].map(item => (
              <div key={item.n} className="flex items-center gap-2 bg-white/5 rounded-xl p-2">
                <div className="h-9 w-9 rounded-lg bg-stone-700/60 shrink-0">
                  <div className="h-full w-full rounded-lg bg-gradient-to-br from-amber-900/40 to-stone-800/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-semibold text-white">{item.n}</span>
                    {item.pop && <span className="text-[7px] px-1 py-0.5 rounded-full font-bold" style={{ background: GOLD + "30", color: GOLD }}>✦</span>}
                  </div>
                  <span className="text-[9px] font-bold" style={{ color: GOLD }}>{item.p}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="pb-3" />
        </div>
      </div>
      <div className="absolute -top-3 -right-4 sm:-right-8 flex items-center gap-2 bg-white rounded-2xl px-3 py-2 shadow-xl border border-stone-100">
        <div className="h-7 w-7 rounded-xl flex items-center justify-center" style={{ background: GOLD + "20" }}>
          <Scan className="h-3.5 w-3.5" style={{ color: GOLD }} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-stone-900">Scan instantané</p>
          <p className="text-[9px] text-stone-400">0 téléchargement</p>
        </div>
      </div>
      <div className="absolute -bottom-2 -left-4 sm:-left-10 flex items-center gap-2 bg-white rounded-2xl px-3 py-2 shadow-xl border border-stone-100">
        <div className="h-7 w-7 rounded-xl flex items-center justify-center bg-emerald-50">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-stone-900">15 000+ scans</p>
          <p className="text-[9px] text-stone-400">ce mois</p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const NAV_LINKS = [
    { href: "#concept", label: "Concept" },
    { href: "#comment", label: "Fonctionnement" },
    { href: "#services", label: "Services" },
    { href: "/menu", label: "Explorer" },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900 font-sans antialiased">

      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur-xl border-b border-stone-100 shadow-sm" : "bg-transparent"
      )}>
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10 py-4">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105" style={{ background: GOLD }}>
              <QrCode className="h-4.5 w-4.5 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tight text-stone-900">Click<span style={{ color: GOLD }}>Menu</span></span>
              <span className="text-[9px] font-semibold tracking-[0.12em] uppercase text-stone-400">Luxury Hospitality</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">{l.label}</a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors px-3 py-2">Se connecter</Link>
            <a href="https://wa.me/21697991266" target="_blank" rel="noreferrer"
              className="flex h-10 items-center gap-2 rounded-xl px-5 text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.97]"
              style={{ background: GOLD }}>
              Demander une démo
            </a>
          </div>

          <button onClick={() => setMobileOpen(o => !o)} aria-label="Menu"
            className="md:hidden h-10 w-10 flex items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600">
            {mobileOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-stone-100 shadow-xl px-5 py-6 flex flex-col gap-5 z-40">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="text-base font-semibold text-stone-700 flex items-center justify-between">
                {l.label}<ChevronRight className="h-4 w-4 text-stone-300" />
              </a>
            ))}
            <div className="h-px bg-stone-100" />
            <Link href="/login" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-stone-600">Se connecter</Link>
            <a href="https://wa.me/21697991266" target="_blank" rel="noreferrer"
              className="flex h-13 items-center justify-center gap-2 rounded-2xl text-sm font-bold text-white shadow-md"
              style={{ background: GOLD }}>
              <MessageSquare className="h-4 w-4" />Demander une démo
            </a>
          </div>
        )}
      </header>

      {/* ── HERO (DARK) ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-stone-950">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-8 overflow-hidden select-none">
          <span className="text-[22vw] font-black leading-none opacity-[0.03]"
            style={{ color: GOLD, fontFamily: "system-ui, -apple-system, sans-serif" }}>مرحبا</span>
        </div>
        <div className="pointer-events-none absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[130px] opacity-[0.07]" style={{ background: GOLD }} />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.05]" style={{ background: GOLD }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "radial-gradient(circle, #c8a46a 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 pt-16 pb-32 md:pt-24 md:pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col items-start">
              <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-8 text-xs font-bold tracking-wider"
                style={{ borderColor: GOLD + "40", background: GOLD + "10", color: GOLD }}>
                <Sparkles className="h-3.5 w-3.5" />
                <span style={{ fontFamily: "system-ui, sans-serif" }}>مرحبا بيكم</span>
                <span className="opacity-40">·</span>
                <span className="tracking-widest uppercase text-[10px]">Tunisie</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold leading-[1.05] tracking-tight text-white"
                style={{ fontFamily: "var(--font-playfair)" }}>
                Votre restaurant mérite un{" "}
                <span className="relative inline-block">
                  <span style={{ color: GOLD }}>menu digital</span>
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" preserveAspectRatio="none" height="5">
                    <path d="M0 6 Q50 0 100 5 Q150 10 200 4" stroke={GOLD} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
                  </svg>
                </span>
                {" "}de prestige
              </h1>

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-stone-400 max-w-lg">
                Cartes QR premium, menus interactifs et tableau de bord intelligent — conçu pour les cafés, restaurants et lounges de Tunisie.
              </p>

              <div className="mt-6 flex items-center gap-3 pt-5 border-t border-stone-800">
                <div className="flex gap-0.5">
                  {Array(5).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 stroke-amber-400" />)}
                </div>
                <span className="text-sm font-medium text-stone-400">+ de 25 établissements font confiance à ClickMenu</span>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <Link href="/menu"
                  className="group flex h-13 items-center justify-center gap-2 rounded-2xl px-8 text-sm font-bold text-stone-950 shadow-lg transition-all hover:opacity-90 active:scale-[0.97]"
                  style={{ background: GOLD, boxShadow: `0 8px 24px ${GOLD}50` }}>
                  Explorer les menus
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a href="https://wa.me/21697991266" target="_blank" rel="noreferrer"
                  className="flex h-13 items-center justify-center gap-2.5 rounded-2xl border-2 border-stone-700 bg-stone-900/50 px-8 text-sm font-bold text-white hover:border-stone-600 hover:bg-stone-800 transition-all active:scale-[0.97]">
                  <MessageSquare className="h-4 w-4 text-emerald-400" />
                  WhatsApp démo
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative mt-8 lg:mt-0">
                <div className="absolute inset-0 scale-125 rounded-full blur-3xl opacity-10" style={{ background: `radial-gradient(circle, ${GOLD}, transparent 70%)` }} />
                <PhoneMockup />
                <div className="absolute -bottom-8 -right-4 sm:-right-12 bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl p-3.5 w-48 sm:w-56">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">Ce mois</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-black text-white">15 248</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">Scans QR</p>
                    </div>
                    <div className="text-emerald-400 text-[11px] font-bold">↑ +24%</div>
                  </div>
                  <div className="mt-2.5 flex items-end gap-0.5 h-8">
                    {[60, 75, 55, 88, 70, 95, 80].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 5 ? GOLD : `${GOLD}25` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full" height="48">
            <path d="M0 60 L0 35 Q360 0 720 25 Q1080 50 1440 20 L1440 60 Z" fill="#fafaf8" />
          </svg>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────────── */}
      <div className="bg-[#fafaf8] pt-4 pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] mb-10" style={{ color: GOLD }}>
            بالأرقام · En chiffres
          </p>
          <div className="grid grid-cols-3 gap-4 sm:gap-12 text-center">
            {[
              { val: "25+", label: "Restaurants partenaires", sub: "à travers la Tunisie" },
              { val: "15k+", label: "Scans par mois", sub: "en moyenne" },
              { val: "4.9⁄5", label: "Satisfaction client", sub: "basée sur les avis" },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center">
                <p className="text-3xl sm:text-5xl font-black text-stone-900" style={{ fontFamily: "var(--font-playfair)" }}>{s.val}</p>
                <p className="text-xs sm:text-sm font-semibold text-stone-700 mt-1.5">{s.label}</p>
                <p className="text-xs text-stone-400 mt-0.5 hidden sm:block">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONCEPT ──────────────────────────────────────────────────────────── */}
      <section id="concept" className="py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.18em] mb-4" style={{ color: GOLD }}>Le concept ClickMenu</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}>
              بكل سهولة —{" "}
              <span>Zéro friction, 100% élégance</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-stone-500">
              ClickMenu aide les établissements tunisiens à proposer une carte digitale moderne — instantanée, sans téléchargement, sans compte client.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: <Smartphone className="h-6 w-6" />, title: "Zéro app à installer", ar: "بدون تحميل", desc: "Le client scanne depuis l'appareil photo. Le menu s'ouvre en moins d'une seconde. Pas d'inscription, pas de compte." },
              { icon: <Zap className="h-6 w-6" />, title: "Mise à jour instantanée", ar: "في الوقت الحقيقي", desc: "Prix, disponibilité, nouvelles photos — tout se modifie depuis votre tableau de bord en quelques secondes." },
              { icon: <Globe className="h-6 w-6" />, title: "Image de marque premium", ar: "صورة راقية", desc: "Interface sur-mesure à vos couleurs, photos professionnelles des plats, design qui inspire confiance et envie." },
            ].map((f, i) => (
              <div key={i} className="group bg-white rounded-3xl border border-stone-100 p-8 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-50/60 transition-all duration-300">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: GOLD + "15", color: GOLD }}>
                  {f.icon}
                </div>
                <p className="text-[11px] font-bold mb-2 opacity-70" style={{ color: GOLD, fontFamily: "system-ui, sans-serif" }}>{f.ar}</p>
                <h3 className="text-base font-bold text-stone-900 mb-3">{f.title}</h3>
                <p className="text-sm leading-relaxed text-stone-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section id="comment" className="py-20 md:py-28 bg-stone-50">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.18em] mb-4" style={{ color: GOLD }}>الخطوات · Étapes</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}>
              Comment ClickMenu fonctionne
            </h2>
            <p className="mt-4 text-base leading-relaxed text-stone-500">
              Nous gérons toute la mise en place pour que vous puissiez vous concentrer sur vos clients.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { n: "01", title: "Création du menu", desc: "Nous intégrons vos plats, photos, prix et catégories, optimisés pour mobile.", icon: <QrCode className="h-5 w-5" /> },
              { n: "02", title: "Impression QR", desc: "Cartes de table premium en bois gravé, acrylique ou autocollants laminés.", icon: <Scan className="h-5 w-5" /> },
              { n: "03", title: "Scan instantané", desc: "Le client scanne. Le menu s'ouvre sans téléchargement.", icon: <Smartphone className="h-5 w-5" /> },
              { n: "04", title: "Vous gardez la main", desc: "Modifiez tarifs, disponibilités et photos à tout moment depuis le dashboard.", icon: <TrendingUp className="h-5 w-5" /> },
            ].map((step, i) => (
              <div key={i} className="relative bg-white rounded-3xl border border-stone-100 p-7 overflow-hidden hover:border-amber-200 hover:shadow-md transition-all duration-300">
                <div className="absolute top-3 right-4 text-[64px] font-black leading-none select-none opacity-[0.035]"
                  style={{ color: GOLD, fontFamily: "var(--font-playfair)" }}>{step.n}</div>
                <div className="h-10 w-10 rounded-2xl flex items-center justify-center mb-5" style={{ background: GOLD + "15", color: GOLD }}>
                  {step.icon}
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: GOLD }}>Étape {step.n}</span>
                <h3 className="mt-2 text-base font-bold text-stone-900 leading-snug">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.18em] mb-4" style={{ color: GOLD }}>ياسلام · Ils parlent de nous</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}>
              Ce que disent nos partenaires
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { quote: "Wallah c'est le meilleur investissement pour notre café. Les clients adorent scanner et on a arrêté les cartes imprimées depuis 6 mois.", name: "Sami B.", role: "Propriétaire, Café Bab El Bhar · Tunis", stars: 5 },
              { quote: "ياسلام على الخدمة! L'équipe a tout configuré en 24h. Notre menu est beau, professionnel, et facile à mettre à jour.", name: "Yasmine M.", role: "Gérante, Le Jardin d'Ariana · Ariana", stars: 5 },
              { quote: "On a vu une vraie différence : les tables tournent plus vite et les clients passent facilement leur commande. Chokran ClickMenu!", name: "Nizar K.", role: "Chef & Fondateur, Brik & Co · Sousse", stars: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-stone-50 rounded-3xl border border-stone-100 p-8 flex flex-col gap-5 hover:border-amber-200 hover:shadow-md transition-all duration-300">
                <div className="flex gap-0.5">
                  {Array(t.stars).fill(0).map((_, j) => <Star key={j} className="h-4 w-4 fill-amber-400 stroke-amber-400" />)}
                </div>
                <p className="text-sm leading-relaxed text-stone-700 flex-1">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-bold text-stone-900">{t.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────────── */}
      <section id="services" className="py-20 md:py-28 bg-[#fafaf8]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.18em] mb-4" style={{ color: GOLD }}>Notre écosystème</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}>
              Solutions d'aujourd'hui et de demain
            </h2>
            <p className="mt-4 text-base leading-relaxed text-stone-500">
              ClickMenu évolue vers une solution complète pour la gestion digitale de votre établissement.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Smartphone className="h-5 w-5"/>, title: "Menu QR Interactif", desc: "Expérience mobile fluide avec filtres, recherche et design élégant sur-mesure.", avail: true },
              { icon: <QrCode className="h-5 w-5"/>, title: "Cartes QR Imprimées", desc: "Supports nobles : bois gravé, acrylique luxe, autocollants haute résistance.", avail: true },
              { icon: <Globe className="h-5 w-5"/>, title: "Site Web de Menu", desc: "Votre propre URL sous ClickMenu, référencée sur Google Maps et TripAdvisor.", avail: true },
              { icon: <ShoppingBag className="h-5 w-5"/>, title: "Commandes Digitales", desc: "Vos clients passent commande depuis la table — vous recevez les notifications en temps réel.", avail: true },
              { icon: <Clock className="h-5 w-5"/>, title: "Système POS / Caisse", desc: "Commandes, affichage cuisine (KDS) et paiements centralisés.", avail: false },
              { icon: <TrendingUp className="h-5 w-5"/>, title: "Analytics Avancés", desc: "Rapports détaillés sur les ventes, plats populaires et comportements clients.", avail: false },
            ].map((s, i) => (
              <div key={i} className={cn("relative bg-white rounded-3xl border p-7 transition-all duration-300 overflow-hidden",
                s.avail ? "border-amber-100 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-50" : "border-stone-100 opacity-70 hover:opacity-100")}>
                <div className="absolute top-5 right-5">
                  {s.avail ? (
                    <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase" style={{ background: GOLD + "15", color: GOLD }}>
                      <Check className="h-2.5 w-2.5"/>Disponible
                    </span>
                  ) : (
                    <span className="inline-flex text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-stone-100 text-stone-400">Bientôt</span>
                  )}
                </div>
                <div className="h-11 w-11 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: s.avail ? GOLD + "18" : "#f5f5f4", color: s.avail ? GOLD : "#a8a29e" }}>
                  {s.icon}
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2.5">{s.title}</h3>
                <p className="text-sm leading-relaxed text-stone-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS CTA ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white border-y border-stone-100">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="rounded-3xl overflow-hidden relative p-10 sm:p-14 lg:p-16"
            style={{ background: `linear-gradient(135deg, ${GOLD}12 0%, #fef9f0 50%, #fafaf8 100%)`, border: `1px solid ${GOLD}30` }}>
            <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full blur-3xl opacity-20" style={{ background: GOLD }} />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 leading-tight"
                  style={{ fontFamily: "var(--font-playfair)" }}>
                  Découvrez les établissements qui utilisent ClickMenu
                </h2>
                <p className="mt-4 text-base text-stone-500 max-w-lg">
                  Cafés branchés, bistrots typiques, salons de thé — explorez leurs menus digitaux et rejoignez le réseau.
                </p>
                <div className="mt-8 flex gap-10">
                  {[["25+","Partenaires"],["15k+","Scans/mois"],["4.9","Note moy."]].map(([v,l]) => (
                    <div key={l}>
                      <p className="text-3xl font-black text-stone-900">{v}</p>
                      <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 lg:justify-end">
                <Link href="/menu"
                  className="group flex h-13 items-center justify-center gap-2 rounded-2xl px-8 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.97]"
                  style={{ background: GOLD }}>
                  Explorer les menus<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform"/>
                </Link>
                <a href="https://wa.me/21697991266" target="_blank" rel="noreferrer"
                  className="flex h-13 items-center justify-center gap-2.5 rounded-2xl border-2 border-stone-200 bg-white px-8 text-sm font-bold text-stone-800 hover:border-stone-300 transition-all active:scale-[0.97]">
                  Devenir partenaire
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-stone-900 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(200,164,106,0.08) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(200,164,106,0.05) 0%, transparent 50%)" }} />
        <div className="relative mx-auto max-w-4xl px-5 sm:px-8 text-center">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-8"
            style={{ background: GOLD + "20", border: `1px solid ${GOLD}40` }}>
            <QrCode className="h-7 w-7" style={{ color: GOLD }} />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}>
            Vous avez un café ou un restaurant ?
          </h2>
          <p className="mt-5 text-base sm:text-lg text-stone-400 max-w-2xl mx-auto leading-relaxed">
            Passez au menu digital dès aujourd'hui. Augmentez la rotation de vos tables, diminuez les frais d'impression et offrez un service irréprochable.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
            <a href="https://wa.me/21697991266" target="_blank" rel="noreferrer"
              className="flex h-14 items-center justify-center gap-2 rounded-2xl px-9 text-sm font-bold text-stone-900 transition-all hover:opacity-90 active:scale-[0.97] shadow-lg"
              style={{ background: GOLD, boxShadow: `0 8px 28px ${GOLD}40` }}>
              <MessageSquare className="h-4 w-4" />
              Nous contacter via WhatsApp
            </a>
            <Link href="/menu"
              className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-stone-700 bg-stone-800 px-9 text-sm font-bold text-white hover:bg-stone-700 hover:border-stone-600 transition-all active:scale-[0.97]">
              Voir les démos en direct
            </Link>
          </div>
          <p className="mt-8 text-xs font-semibold tracking-widest uppercase" style={{ color: GOLD + "70" }}>
            صنع في تونس · Marhba bikom · Catalogue intégré en 48h
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="bg-stone-950 py-10 text-stone-500 text-xs border-t border-stone-800">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: GOLD }}>
              <QrCode className="h-4 w-4 text-white stroke-[2.5]" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">ClickMenu</span>
          </div>
          <p className="text-center">© {new Date().getFullYear()} ClickMenu · صنع في تونس · Made in Tunisia</p>
          <div className="flex gap-5">
            <a href="https://wa.me/21697991266" className="hover:text-white transition-colors">WhatsApp</a>
            <Link href="/menu" className="hover:text-white transition-colors">Explorer</Link>
            <Link href="/login" className="hover:text-white transition-colors">Connexion</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
