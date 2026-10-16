"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BarChart3, Check, Eye, EyeOff, Lock, Mail, QrCode, Zap } from "lucide-react";

const INPUT =
  "h-13 w-full rounded-2xl border border-[var(--h-line)] bg-[#f6f3ee]/60 pl-11 pr-4 text-[15px] font-medium text-[var(--h-ink)] outline-none transition-all placeholder:text-[var(--h-muted)]/60 focus:border-[var(--h-ink)]/50 focus:bg-white focus:ring-4 focus:ring-[var(--h-sun)]/40";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    const session = await sessionRes.json();

    if (session?.user?.mustChangePassword) {
      router.push("/dashboard/settings");
      return;
    }
    router.push(session?.user?.role === "super_admin" ? "/admin" : "/dashboard");
  }

  return (
    <div className="home-root home-bg relative flex min-h-screen overflow-x-clip text-[var(--h-ink)] antialiased [font-family:var(--font-body),system-ui,sans-serif]">
      {/* ── LEFT: brand panel ─────────────────────────────────────────────── */}
      <aside className="relative hidden flex-1 flex-col justify-between p-12 lg:flex xl:p-16">
        <Link href="/" className="flex w-fit items-baseline gap-0.5" aria-label="ClickMenu — accueil">
          <span className="text-[26px] font-extrabold tracking-[-0.04em]">click</span>
          <span className="text-[26px] font-extrabold tracking-[-0.04em] text-[var(--h-terra)]">menu</span>
          <span className="ml-0.5 text-xs font-bold text-[var(--h-muted)]">.tn</span>
        </Link>

        <div className="relative max-w-lg">
          <h1 className="text-5xl font-extrabold leading-[1.12] tracking-tight xl:text-6xl">
            Votre menu,
            <br />
            <span className="relative isolate inline-block px-4">
              <span className="absolute inset-y-[6%] left-0 right-0 -z-10 rounded-[999px] bg-[var(--h-sun)]" />
              entre vos mains
            </span>
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-[var(--h-ink)]/75">
            Modifiez vos prix, vos photos et vos plats en quelques secondes. Vos clients voient le changement tout de suite.
          </p>

          <ul className="mt-9 space-y-3.5">
            {["Mise à jour en temps réel", "Menu 100% mobile, sans application", "QR code et statistiques de scans", "Stock et commandes intégrés"].map((t) => (
              <li key={t} className="flex items-center gap-3 text-[15px] font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--h-ink)] text-white">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </span>
                {t}
              </li>
            ))}
          </ul>

          {/* floating chips */}
          <div className="pointer-events-none absolute -right-10 top-2 hidden rotate-3 items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-[0_18px_40px_-20px_rgba(17,17,17,0.45)] xl:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--h-sun)]">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-bold">Prix mis à jour</p>
              <p className="text-[11px] text-[var(--h-muted)]">il y a 2 secondes</p>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-4 bottom-6 hidden -rotate-2 items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-[0_18px_40px_-20px_rgba(17,17,17,0.45)] xl:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dfe6ff]">
              <BarChart3 className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-bold">Scans du mois</p>
              <p className="text-[11px] text-[var(--h-muted)]">en hausse ↑</p>
            </div>
          </div>
        </div>

        <p className="text-xs font-medium text-[var(--h-muted)]">© {new Date().getFullYear()} ClickMenu · Made in Tunisia</p>
      </aside>

      {/* ── RIGHT: form ───────────────────────────────────────────────────── */}
      <main className="flex w-full items-center justify-center px-5 py-10 sm:px-10 lg:w-[46%] lg:max-w-[640px]">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex w-fit items-baseline gap-0.5 lg:hidden" aria-label="ClickMenu — accueil">
            <span className="text-2xl font-extrabold tracking-[-0.04em]">click</span>
            <span className="text-2xl font-extrabold tracking-[-0.04em] text-[var(--h-terra)]">menu</span>
            <span className="ml-0.5 text-[11px] font-bold text-[var(--h-muted)]">.tn</span>
          </Link>

          <div className="rounded-[2rem] bg-white p-7 shadow-[0_30px_80px_-40px_rgba(17,17,17,0.45)] sm:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--h-sun)]">
              <QrCode className="h-5 w-5" />
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight">Connexion</h2>
            <p className="mt-2 text-sm text-[var(--h-muted)]">Accédez à votre espace de gestion du menu.</p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate={false}>
              <div>
                <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--h-muted)]">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--h-muted)]" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className={INPUT}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[var(--h-muted)]">
                    Mot de passe
                  </label>
                  <Link href="/login/forgot-password" className="text-xs font-bold text-[var(--h-terra-2)] hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--h-muted)]" />
                  <input
                    id="password"
                    type={show ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${INPUT} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[var(--h-muted)] transition-colors hover:bg-[#f1efe9] hover:text-[var(--h-ink)]"
                    aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div aria-live="polite">
                {error && (
                  <div role="alert" className="flex items-start gap-2.5 rounded-2xl border border-red-100 bg-red-50 p-3.5 text-sm font-medium text-red-600">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500 text-[9px] font-black leading-none text-white">!</span>
                    {error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--h-ink)] text-[15px] font-bold text-white transition-transform hover:bg-black active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Connexion en cours…
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-[var(--h-muted)]">
            L’accès est réservé aux comptes créés par notre équipe.
            <br />
            Une question ? Écrivez-nous sur{" "}
            <a href="https://wa.me/21697991266" target="_blank" rel="noreferrer" className="font-bold text-[var(--h-ink)] hover:underline">
              WhatsApp
            </a>
            .
          </p>

          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--h-muted)] transition-colors hover:text-[var(--h-ink)]">
              <ArrowLeft className="h-4 w-4" /> Retour à l’accueil
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
