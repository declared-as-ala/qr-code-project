"use client";

import { useState } from "react";
import { ArrowRight, Check, MessageSquare } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/site";

const VENUE_TYPES = [
  "Café / Salon de thé",
  "Restaurant / Pizzeria",
  "Fast-Food / Burger",
  "Lounge / Pâtisserie",
] as const;

const TABLE_COUNTS = [
  "Moins de 15 tables",
  "15 à 30 tables",
  "Plus de 30 tables",
] as const;

const PACK_OPTIONS = [
  "Menu digital + Supports Bois Gravé / Acrylique",
  "Menu digital + Autocollants QR laminés",
  "Menu digital + Commandes à table & Stock",
  "Menu digital seul (j'ai déjà mes supports)",
] as const;

export function QuoteConfigurator() {
  const [venueType, setVenueType] = useState<string>(VENUE_TYPES[0]);
  const [tables, setTables] = useState<string>(TABLE_COUNTS[1]);
  const [pack, setPack] = useState<string>(PACK_OPTIONS[0]);
  const [city, setCity] = useState<string>("");

  const message = `Bonjour ClickMenu, je souhaite un devis et une démo pour mon établissement :
- Type : ${venueType}
- Capacité : ${tables}
- Formule souhaitée : ${pack}${city.trim() ? `\n- Ville : ${city.trim()}` : ""}`;

  const whatsappHref = buildWhatsAppUrl(message);

  return (
    <div className="rounded-[2rem] border border-[var(--h-line)] bg-white p-6 shadow-[0_22px_60px_-30px_rgba(17,17,17,0.38)] sm:p-10">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--h-sun)] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[var(--h-ink)]">
            Simulation & Devis en 30 secondes
          </span>
          <h3 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-[var(--h-ink)] sm:text-3xl">
            Configurez votre menu digital et recevez votre proposition sur WhatsApp
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--h-muted)]">
            Sélectionnez le profil de votre établissement en Tunisie. Notre équipe vous répond avec une démonstration adaptée et un tarif clair en dinars (DT).
          </p>
          <ul className="mt-6 space-y-2.5 text-sm font-medium text-[var(--h-ink)]/85">
            {[
              "Intégration complète de vos plats et photos en 48h",
              "Modifications des prix en DT illimitées et gratuites",
              "QR code dynamique permanent (ne change jamais)",
              "Accompagnement local réactif en Tunisie",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#def3e6] text-[#111]">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5 rounded-3xl bg-[#f6f3ee]/80 p-5 sm:p-7 lg:col-span-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--h-muted)]">
              1. Type d’établissement
            </p>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              {VENUE_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setVenueType(t)}
                  className={`rounded-xl border px-3.5 py-2.5 text-left text-xs font-bold transition-all sm:text-sm ${
                    venueType === t
                      ? "border-[var(--h-ink)] bg-[var(--h-ink)] text-white shadow-sm"
                      : "border-[var(--h-line)] bg-white text-[var(--h-ink)] hover:border-[var(--h-ink)]/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--h-muted)]">
              2. Nombre de tables
            </p>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {TABLE_COUNTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setTables(c)}
                  className={`rounded-xl border px-3 py-2.5 text-center text-xs font-bold transition-all sm:text-sm ${
                    tables === c
                      ? "border-[var(--h-ink)] bg-[var(--h-ink)] text-white shadow-sm"
                      : "border-[var(--h-line)] bg-white text-[var(--h-ink)] hover:border-[var(--h-ink)]/40"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--h-muted)]">
              3. Formule souhaitée
            </p>
            <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
              {PACK_OPTIONS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPack(p)}
                  className={`rounded-xl border px-3.5 py-2.5 text-left text-xs font-bold transition-all ${
                    pack === p
                      ? "border-[var(--h-ink)] bg-[var(--h-ink)] text-white shadow-sm"
                      : "border-[var(--h-line)] bg-white text-[var(--h-ink)] hover:border-[var(--h-ink)]/40"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="quote-city" className="block text-xs font-bold uppercase tracking-wider text-[var(--h-muted)]">
              4. Votre ville ou quartier (optionnel)
            </label>
            <input
              id="quote-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex. : Tunis, La Marsa, Sousse, Sfax, Hammamet…"
              className="mt-2 h-11 w-full rounded-xl border border-[var(--h-line)] bg-white px-4 text-sm font-medium text-[var(--h-ink)] outline-none placeholder:text-[var(--h-muted)]/60 focus:border-[var(--h-ink)]"
            />
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            data-cta-location="quote_configurator"
            className="group flex h-13 w-full items-center justify-center gap-2.5 rounded-xl bg-[var(--h-ink)] px-6 text-[15px] font-bold text-white transition-transform hover:bg-black active:scale-[0.98]"
          >
            <MessageSquare className="h-4 w-4 text-[var(--h-sun)]" />
            Recevoir mon tarif & ma démo sur WhatsApp
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
}

