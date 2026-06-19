"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QrCode, Lock, Mail, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";

const GOLD = "#c8a46a";

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [show,     setShow]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setLoading(false);
      return setError("Identifiants invalides. Vérifiez votre email et mot de passe.");
    }

    const sessionRes = await fetch("/api/auth/session");
    const session    = await sessionRes.json();

    if (session?.user?.mustChangePassword) {
      router.push("/dashboard/settings");
      return;
    }
    router.push(session?.user?.role === "super_admin" ? "/admin" : "/dashboard");
  }

  return (
    <div className="min-h-screen flex bg-[#fafaf8]">

      {/* ── LEFT PANEL ──────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[56%] relative flex-col overflow-hidden"
        style={{ background: "linear-gradient(145deg, #1c1917 0%, #292524 60%, #1c1917 100%)" }}>

        {/* Warm dot grid */}
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle, rgba(200,164,106,0.12) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        {/* Gold glow blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl opacity-15"
          style={{ background: GOLD }} />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full blur-3xl opacity-10"
          style={{ background: GOLD }} />

        {/* Subtle photo overlay */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=60')",
            backgroundSize: "cover", backgroundPosition: "center",
          }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: GOLD }}>
              <QrCode className="h-5 w-5 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tight text-white">
                Click<span style={{ color: GOLD }}>Menu</span>
              </span>
              <span className="text-[9px] font-semibold tracking-[0.12em] uppercase" style={{ color: GOLD + "80" }}>
                Luxury Hospitality
              </span>
            </div>
          </div>

          {/* Main quote */}
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-4 w-4" style={{ color: GOLD }} />
              <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
                Tableau de bord
              </span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.1]"
              style={{ fontFamily: "var(--font-playfair)" }}>
              Le menu digital qui sublime vos{" "}
              <span style={{ color: GOLD }}>tables</span>.
            </h1>
            <p className="mt-5 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              Une expérience client moderne, élégante et sans contact. Conçue pour les cafés et restaurants d'exception en Tunisie.
            </p>

            {/* Feature pills */}
            <div className="mt-8 flex flex-wrap gap-2.5">
              {["Mise à jour temps réel", "Menu 100% mobile", "QR Code premium", "Stock intégré"].map(f => (
                <span key={f}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(200,164,106,0.12)", color: GOLD, border: `1px solid ${GOLD}25` }}>
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <p className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.2)" }}>
            © {new Date().getFullYear()} ClickMenu · Plateforme SaaS Premium
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ──────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: GOLD }}>
              <QrCode className="h-4 w-4 text-white stroke-[2.5]" />
            </div>
            <span className="text-lg font-extrabold text-stone-900">
              Click<span style={{ color: GOLD }}>Menu</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-stone-900 leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}>
              Connexion
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              Accédez à votre espace de gestion du menu.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-8">
            <form onSubmit={onSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
                  <input
                    id="email" type="email" required autoComplete="email"
                    value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Mot de passe
                  </label>
                  <Link href="/login/forgot-password"
                    className="text-xs font-semibold hover:underline transition-colors"
                    style={{ color: GOLD }}>
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
                  <input
                    id="password" type={show ? "text" : "password"} required autoComplete="current-password"
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all"
                  />
                  <button type="button" onClick={() => setShow(s => !s)} tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors"
                    aria-label={show ? "Masquer" : "Afficher"}>
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                  <span className="h-4 w-4 shrink-0 mt-0.5 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-white text-[9px] font-black leading-none">!</span>
                  </span>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit" disabled={loading}
                className="w-full flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 mt-2"
                style={{ background: loading ? "#d4b896" : GOLD, boxShadow: `0 4px 20px ${GOLD}35` }}>
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Connexion en cours…
                  </>
                ) : (
                  <>Se connecter <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>
          </div>

          {/* Note */}
          <p className="mt-6 text-xs text-stone-400 text-center leading-relaxed">
            L'accès est réservé aux comptes créés par le Super Admin.<br />
            Contactez-nous via{" "}
            <a href="https://wa.me/21697991266" target="_blank" rel="noreferrer"
              className="font-semibold hover:underline" style={{ color: GOLD }}>
              WhatsApp
            </a>{" "}pour toute demande.
          </p>

          {/* Back home */}
          <div className="mt-8 text-center">
            <Link href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-400 hover:text-stone-700 transition-colors">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
