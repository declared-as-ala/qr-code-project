"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  QrCode,
  Smartphone,
  Sparkles,
  CheckCircle2,
  UtensilsCrossed,
  Layers,
  ShoppingBag,
  BarChart3,
  Database,
  FileSpreadsheet,
  Zap,
  Globe,
  Star,
  Users,
  Check,
  MessageSquare,
  Menu as MenuIcon,
  X
} from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import SplineScene from "@/components/ui/splite";

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Floating UI cards mock data to showcase key SaaS product modules
  const floatingCards = [
    {
      icon: <Smartphone className="h-5 w-5 text-amber-400" />,
      title: "Menu Digital",
      badge: "Actif",
      desc: "Scan instantané & commande",
      delay: 0.1,
      yPos: "-top-6 -left-10",
    },
    {
      icon: <QrCode className="h-5 w-5 text-yellow-500" />,
      title: "Cartes QR",
      badge: "Premium",
      desc: "Supports en bois & plexi",
      delay: 0.2,
      yPos: "top-1/4 -right-16",
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-amber-500" />,
      title: "Statistiques",
      badge: "Actif",
      desc: "Scans, visites & clics",
      delay: 0.3,
      yPos: "bottom-1/3 -left-12",
    },
    {
      icon: <ShoppingBag className="h-5 w-5 text-zinc-400" />,
      title: "Caisse / POS",
      badge: "Bientôt",
      desc: "Système de vente direct",
      delay: 0.4,
      yPos: "bottom-6 right-0",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500/20 selection:text-amber-300">
      
      {/* Background spotlights & radial premium grids */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(212, 165, 55, 0.14)" />
      
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
      
      {/* Floating Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-900/60 bg-zinc-950/80 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-600 shadow-lg shadow-amber-500/10 transition-transform group-hover:scale-105">
              <QrCode className="h-5 w-5 text-zinc-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-amber-400">
                Click<span className="text-amber-500 font-medium">Menu</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-amber-500/60 uppercase -mt-1">
                Luxury hospitality
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#concept" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Le Concept</a>
            <a href="#how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Comment ça marche</a>
            <a href="#services" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Services</a>
            <Link href="/menu" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Explorer les menus</Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors">
              Se connecter
            </Link>
            <a
              href="https://wa.me/21697991266"
              target="_blank"
              rel="noreferrer"
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-5 text-sm font-bold text-amber-400 hover:bg-zinc-800/80 transition-all active:scale-[0.98] shadow-lg shadow-black/40"
            >
              Demander une démo
            </a>
          </div>

          {/* Mobile hamburger */}
          <button 
            className="md:hidden text-zinc-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu principal"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 left-0 w-full bg-zinc-950 border-b border-zinc-900 p-6 flex flex-col gap-5 md:hidden z-40 shadow-2xl"
          >
            <a 
              href="#concept" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-semibold text-zinc-300 hover:text-white"
            >
              Le Concept
            </a>
            <a 
              href="#how-it-works" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-semibold text-zinc-300 hover:text-white"
            >
              Comment ça marche
            </a>
            <a 
              href="#services" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-semibold text-zinc-300 hover:text-white"
            >
              Services
            </a>
            <Link 
              href="/menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-semibold text-zinc-300 hover:text-white"
            >
              Explorer les menus
            </Link>
            <div className="h-px bg-zinc-900 my-2" />
            <Link 
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-semibold text-zinc-300 hover:text-white"
            >
              Se connecter
            </Link>
            <a
              href="https://wa.me/21697991266"
              target="_blank"
              rel="noreferrer"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-600 text-sm font-bold text-zinc-950 hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Demander une démo
            </a>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-10 pb-20 md:pb-28 lg:px-8 lg:pt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Left Text content */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Top Micro pill */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3.5 py-1.5 mb-6 text-xs font-semibold tracking-wide text-amber-400 uppercase"
            >
              <Sparkles className="h-4.5 w-4.5 text-amber-500" />
              <span>Menu Digital Premium Tunisie</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.08]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Digitalisez l’expérience de votre restaurant avec <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent">ClickMenu</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg leading-relaxed text-zinc-400 max-w-xl"
            >
              Cartes QR imprimées de luxe, menus en ligne personnalisés hautement interactifs, et solutions digitales complètes pour cafés, restaurants, fast-foods et lounges.
            </motion.p>

            {/* Trust Signals */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 flex flex-wrap items-center gap-4 text-xs text-zinc-500 border-t border-zinc-900/60 pt-6"
            >
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500 stroke-amber-500" />
                ))}
              </div>
              <span className="font-semibold text-zinc-400">Le choix premium des restaurateurs à Tunis, Sousse & Monastir</span>
            </motion.div>

            {/* Call To Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <Link
                href="/menu"
                className="group flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-600 px-7 text-sm font-bold text-zinc-950 shadow-xl shadow-amber-500/10 transition-all hover:opacity-90 hover:shadow-amber-500/20 active:scale-[0.985]"
              >
                Explorer les menus
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="https://wa.me/21697991266"
                target="_blank"
                rel="noreferrer"
                className="flex h-14 items-center justify-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-7 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-zinc-800 hover:border-zinc-700 active:scale-[0.985]"
              >
                <MessageSquare className="h-4 w-4 text-emerald-400 fill-emerald-400/20" />
                Demander une démo (WhatsApp)
              </a>
            </motion.div>
          </div>

          {/* Right 3D Visual container */}
          <div className="lg:col-span-6 relative h-[450px] sm:h-[550px] w-full flex items-center justify-center">
            
            {/* Elegant luxury circular background glow */}
            <div className="absolute inset-0 bg-radial-gradient from-amber-500/15 via-transparent to-transparent blur-3xl opacity-80" />

            {/* Interactive 3D scene (Spline) */}
            <div className="absolute inset-0 h-full w-full rounded-3xl overflow-hidden shadow-2xl border border-zinc-900/50">
              <SplineScene 
                scene="https://prod.spline.design/kZiKo7tf7OhU18QZ/scene.splinecode" 
                className="h-full w-full"
              />
            </div>

            {/* Floating premium UI mockups layered on top to guarantee breathtaking styling immediately */}
            {floatingCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: card.delay + 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`absolute ${card.yPos} z-30 hidden sm:flex w-52 items-center gap-3.5 rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-3.5 backdrop-blur-md shadow-2xl transition-all hover:border-amber-500/30 hover:scale-[1.03] group`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 shadow-inner group-hover:bg-zinc-800">
                  {card.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 justify-between">
                    <h3 className="truncate text-xs font-bold text-white">{card.title}</h3>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                      card.badge === "Actif" ? "bg-amber-500/10 text-amber-400" :
                      card.badge === "Premium" ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/10" :
                      "bg-zinc-800 text-zinc-400"
                    }`}>
                      {card.badge}
                    </span>
                  </div>
                  <p className="truncate text-[10px] text-zinc-400 mt-0.5">{card.desc}</p>
                </div>
              </motion.div>
            ))}

            {/* Core smartphone central overlay mockup (in case spline loading falls back) */}
            <div className="absolute z-20 flex h-[290px] w-[145px] sm:h-[350px] sm:w-[175px] items-center justify-center rounded-[32px] border-[5px] border-zinc-800 bg-zinc-950 p-2 shadow-2xl pointer-events-none transform -rotate-6 translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-16 bg-zinc-800 rounded-b-xl" />
              <div className="h-full w-full rounded-[24px] overflow-hidden bg-zinc-900 relative">
                <img 
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80" 
                  alt="Menu Preview" 
                  className="h-full w-full object-cover opacity-60 filter brightness-90 saturate-[1.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <div className="h-2 w-10 bg-amber-500 rounded mb-1.5" />
                  <h4 className="text-[11px] font-bold text-white leading-tight">Elgrotte Premium</h4>
                  <p className="text-[8px] text-zinc-400">Marhba - Scannez & Dégustez</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is ClickMenu Section */}
      <section id="concept" className="relative border-t border-zinc-900/60 bg-zinc-950 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 
              className="text-xs font-bold uppercase tracking-wider text-amber-500"
              style={{ letterSpacing: "0.15em" }}
            >
              Le concept ClickMenu
            </h2>
            <p 
              className="mt-3 text-3xl font-extrabold text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Pourquoi remplacer ou compléter vos menus papier ?
            </p>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">
              ClickMenu aide les cafés, restaurants, fast-foods et lounges à proposer une carte digitale moderne, interactive et accessible instantanément par QR Code. Une expérience élégante, intuitive et rapide pour vos clients en un clin d’œil.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Concept Feature 1 */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950/50 p-8 shadow-xl transition-all hover:border-zinc-800/80 hover:bg-zinc-900/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-white">Zéro application à installer</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Le client scanne le QR code sur sa table et le menu s’affiche immédiatement dans son navigateur mobile. Pas de téléchargement, pas d’inscription nécessaire.
              </p>
            </div>

            {/* Concept Feature 2 */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950/50 p-8 shadow-xl transition-all hover:border-zinc-800/80 hover:bg-zinc-900/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-white">Mise à jour en temps réel</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Un changement de tarif ? Un plat en rupture de stock ? Modifiez vos articles, images et catégories instantanément depuis votre tableau de bord.
              </p>
            </div>

            {/* Concept Feature 3 */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950/50 p-8 shadow-xl transition-all hover:border-zinc-800/80 hover:bg-zinc-900/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-white">Image de marque premium</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Valorisez votre établissement grâce à une interface sur-mesure aux couleurs harmonieuses et des photographies de plats captivantes qui boostent les ventes.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="relative border-t border-zinc-900/60 bg-zinc-950/30 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-500" style={{ letterSpacing: "0.15em" }}>
              Simplicité absolue
            </h2>
            <p className="mt-3 text-3xl font-extrabold text-white sm:text-4xl" style={{ fontFamily: "var(--font-playfair)" }}>
              Comment ClickMenu fonctionne
            </p>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">
              Nous gérons toute la mise en place technique pour que vous puissiez vous concentrer sur l’essentiel : la satisfaction de vos clients.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Step 1 */}
            <div className="relative flex flex-col rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 shadow-lg">
              <span className="absolute top-4 right-4 text-5xl font-black text-zinc-800/40 select-none">01</span>
              <span className="text-xs font-extrabold text-amber-500 uppercase tracking-widest">Étape 1</span>
              <h3 className="mt-3 text-base font-bold text-white">Création du menu digital</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Nous intégrons l’ensemble de vos plats, descriptions, prix, photos et catégories de façon optimisée pour le format mobile.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 shadow-lg">
              <span className="absolute top-4 right-4 text-5xl font-black text-zinc-800/40 select-none">02</span>
              <span className="text-xs font-extrabold text-amber-500 uppercase tracking-widest">Étape 2</span>
              <h3 className="mt-3 text-base font-bold text-white">Impression des cartes QR</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Nous concevons et imprimons des cartes de table QR premium (autocollants, supports acryliques, bois noble) adaptées à votre décoration.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 shadow-lg">
              <span className="absolute top-4 right-4 text-5xl font-black text-zinc-800/40 select-none">03</span>
              <span className="text-xs font-extrabold text-amber-500 uppercase tracking-widest">Étape 3</span>
              <h3 className="mt-3 text-base font-bold text-white">Scan instantané client</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Assis à table, le client scanne le QR code avec l’appareil photo de son téléphone. Le menu s’ouvre en moins d’une seconde.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 shadow-lg">
              <span className="absolute top-4 right-4 text-5xl font-black text-zinc-800/40 select-none">04</span>
              <span className="text-xs font-extrabold text-amber-500 uppercase tracking-widest">Étape 4</span>
              <h3 className="mt-3 text-base font-bold text-white">Mise à jour libre</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Vous avez la main sur votre menu digital. Changez un tarif, ajoutez une formule ou masquez un plat indisponible à tout moment.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Services / Products Section */}
      <section id="services" className="relative border-t border-zinc-900/60 bg-zinc-950 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-500" style={{ letterSpacing: "0.15em" }}>
              Notre Écosystème
            </h2>
            <p className="mt-3 text-3xl font-extrabold text-white sm:text-4xl" style={{ fontFamily: "var(--font-playfair)" }}>
              Solutions d’aujourd’hui et de demain
            </p>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">
              ClickMenu évolue progressivement vers une solution technologique complète pour la gestion digitale intégrée de votre établissement.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Service 1 - QR Menu */}
            <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-zinc-950 p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-white flex items-center gap-2">
                Menu QR Interactif
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-500 text-zinc-950">Disponible</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Une expérience fluide optimisée pour mobile avec filtres par catégorie, moteur de recherche d’ingrédients, et design somptueux.
              </p>
            </div>

            {/* Service 2 - QR Cards */}
            <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-zinc-950 p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-white flex items-center gap-2">
                Cartes QR Imprimées
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-500 text-zinc-950">Disponible</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Création et fourniture de vos supports physiques de table QR. Matériaux nobles (bois gravé, acrylique luxe, autocollants laminés haute résistance).
              </p>
            </div>

            {/* Service 3 - Custom menu website */}
            <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-zinc-950 p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-white flex items-center gap-2">
                Site Web de Menu
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-500 text-zinc-950">Disponible</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Chaque restaurant obtient sa propre adresse dédiée sous ClickMenu (ex: <code className="text-amber-400/90">/menu/elgrotte</code>) référencée sur Google.
              </p>
            </div>

            {/* Service 4 - Future POS / Caisse */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-8 shadow-xl relative overflow-hidden group opacity-75 hover:opacity-100 transition-opacity">
              <div className="absolute top-3 right-3">
                <span className="text-[8px] tracking-wider px-2 py-0.5 rounded-full font-bold uppercase bg-zinc-800 text-amber-500 border border-amber-500/10">Bientôt</span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-400">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-white">Système POS / Caisse</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Prenez les commandes physiques, gérez l’affichage cuisine (KDS) et centralisez les paiements directement depuis l’interface ClickMenu.
              </p>
            </div>

            {/* Service 5 - Future Stock */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-8 shadow-xl relative overflow-hidden group opacity-75 hover:opacity-100 transition-opacity">
              <div className="absolute top-3 right-3">
                <span className="text-[8px] tracking-wider px-2 py-0.5 rounded-full font-bold uppercase bg-zinc-800 text-amber-500 border border-amber-500/10">Bientôt</span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-400">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-white">Gestion de Stock</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Suivi de vos matières premières en temps réel, déduction automatique lors des ventes et alertes d’approvisionnement de cuisine.
              </p>
            </div>

            {/* Service 6 - Future Billing */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-8 shadow-xl relative overflow-hidden group opacity-75 hover:opacity-100 transition-opacity">
              <div className="absolute top-3 right-3">
                <span className="text-[8px] tracking-wider px-2 py-0.5 rounded-full font-bold uppercase bg-zinc-800 text-amber-500 border border-amber-500/10">Bientôt</span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-400">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-white">Facturation Digitalisée</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Édition de factures conformes, gestion de la comptabilité simplifiée et rapports financiers automatisés téléchargeables.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Explore Partners Section */}
      <section className="relative border-t border-zinc-900/60 bg-gradient-to-b from-zinc-950/30 via-zinc-950 to-zinc-950 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 px-6 py-16 sm:px-12 md:py-20 lg:px-20 relative overflow-hidden">
            
            <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 via-transparent to-transparent blur-3xl" />
            
            <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 
                  className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Découvrez les cafés et restaurants qui utilisent ClickMenu
                </h2>
                <p className="mt-4 text-base text-zinc-400">
                  Découvrez des établissements d’exception (salons de thé branchés, bistrots typiques tunisiens) qui proposent notre carte digitale à leurs clients de façon interactive.
                </p>
                
                {/* Stats in card */}
                <div className="mt-8 flex gap-8">
                  <div>
                    <p className="text-3xl font-black text-white tabular-nums">25+</p>
                    <p className="text-xs text-zinc-500 font-semibold uppercase mt-0.5">Partenaires</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white tabular-nums">15k+</p>
                    <p className="text-xs text-zinc-500 font-semibold uppercase mt-0.5">Scans par mois</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white tabular-nums">4.9/5</p>
                    <p className="text-xs text-zinc-500 font-semibold uppercase mt-0.5">Avis restaurateurs</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                <Link
                  href="/menu"
                  className="group flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-600 px-8 text-sm font-bold text-zinc-950 shadow-xl shadow-amber-500/10 transition-all hover:opacity-90 hover:shadow-amber-500/20 active:scale-[0.985]"
                >
                  Explorer les menus
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="https://wa.me/21697991266"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-14 items-center justify-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-950/60 px-8 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-zinc-800 hover:border-zinc-700 active:scale-[0.985]"
                >
                  Devenir partenaire
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="relative border-t border-zinc-900/60 bg-zinc-950 py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="relative rounded-3xl border border-amber-500/20 bg-gradient-to-b from-amber-500/[0.04] to-transparent px-8 py-16 text-center shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 via-transparent to-transparent blur-2xl" />
            
            <div className="relative flex flex-col items-center max-w-2xl mx-auto">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <QrCode className="h-7 w-7" />
              </div>
              
              <h2 
                className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Vous avez un café ou un restaurant ?
              </h2>
              <p className="mt-4 text-base text-zinc-400">
                Passez au menu digital avec ClickMenu dès aujourd’hui. Augmentez la rotation de vos tables, diminuez vos frais d’impression et offrez un service irréprochable.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <a
                  href="https://wa.me/21697991266"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-600 px-8 text-sm font-bold text-zinc-950 shadow-xl shadow-amber-500/10 transition-all hover:opacity-90 active:scale-[0.985]"
                >
                  Nous contacter via WhatsApp
                </a>
                <Link
                  href="/menu"
                  className="flex h-14 items-center justify-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900 px-8 text-sm font-bold text-white transition-all hover:bg-zinc-800 active:scale-[0.985]"
                >
                  Voir les démos en direct
                </Link>
              </div>

              {/* Tunisian warm message */}
              <p className="mt-6 text-xs text-amber-500/50 font-semibold tracking-wider uppercase">
                Marhba bikom ! On s’occupe de tout le catalogue en 48 heures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 text-zinc-500 text-xs">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-zinc-950">
              <QrCode className="h-4 w-4 stroke-[2.5]" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">ClickMenu</span>
          </div>

          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} ClickMenu. Conçu avec excellence pour les établissements gastronomiques tunisiens.
          </p>

          <div className="flex gap-4">
            <a href="https://wa.me/21697991266" className="hover:text-white transition-colors">WhatsApp</a>
            <span className="text-zinc-800">|</span>
            <Link href="/menu" className="hover:text-white transition-colors">Explorer</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
