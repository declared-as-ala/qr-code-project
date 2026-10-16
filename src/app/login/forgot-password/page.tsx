"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const payload = await res.json();
    if (!res.ok) {
      toast.error(payload.error || "Impossible d'envoyer la demande.");
    } else {
      toast.success(payload.message || "Demande envoyée.");
    }
    setLoading(false);
  }

  return (
    <div className="home-root home-bg flex min-h-screen items-center justify-center px-5 py-10 text-[var(--h-ink)] antialiased [font-family:var(--font-body),system-ui,sans-serif]">
      <main className="w-full max-w-md">
        <Link href="/" className="mb-8 flex w-fit items-baseline gap-0.5" aria-label="ClickMenu — accueil">
          <span className="text-2xl font-extrabold tracking-[-0.04em]">click</span>
          <span className="text-2xl font-extrabold tracking-[-0.04em] text-[var(--h-terra)]">menu</span>
          <span className="ml-0.5 text-[11px] font-bold text-[var(--h-muted)]">.tn</span>
        </Link>

        <div className="rounded-[2rem] bg-white p-7 shadow-[0_30px_80px_-40px_rgba(17,17,17,0.45)] sm:p-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--h-sun)]">
            <KeyRound className="h-5 w-5" />
          </span>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight">Mot de passe oublié</h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--h-muted)]">
            Cette fonctionnalité est réservée aux comptes créés par notre équipe. Saisissez l’e-mail de votre compte.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--h-muted)]">
                Email du compte
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
                  className="h-13 w-full rounded-2xl border border-[var(--h-line)] bg-[#f6f3ee]/60 pl-11 pr-4 text-[15px] font-medium outline-none transition-all placeholder:text-[var(--h-muted)]/60 focus:border-[var(--h-ink)]/50 focus:bg-white focus:ring-4 focus:ring-[var(--h-sun)]/40"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex h-13 w-full items-center justify-center rounded-2xl bg-[var(--h-ink)] text-[15px] font-bold text-white transition-transform hover:bg-black active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Envoi…" : "Envoyer la demande"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--h-muted)] transition-colors hover:text-[var(--h-ink)]">
            <ArrowLeft className="h-4 w-4" /> Retour à la connexion
          </Link>
        </div>
      </main>
    </div>
  );
}
