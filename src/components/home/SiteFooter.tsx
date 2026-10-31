import Link from "next/link";
import { COMMERCIAL_PAGES } from "@/lib/commercial-pages";
import { WHATSAPP_BASE, WHATSAPP_DISPLAY } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--h-line)] bg-white/75 pt-16 pb-12 text-xs text-[var(--h-muted)]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand */}
          <div>
            <Link href="/" className="flex items-baseline gap-0.5" aria-label="ClickMenu — accueil">
              <span className="text-xl font-extrabold tracking-[-0.04em] text-[var(--h-ink)]">click</span>
              <span className="text-xl font-extrabold tracking-[-0.04em] text-[var(--h-terra)]">menu</span>
              <span className="ml-0.5 text-[11px] font-bold text-[var(--h-muted)]">.tn</span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-[var(--h-muted)]">
              La plateforme de menu digital et QR code pour les cafés, salons de thé, lounges, pizzerias et restaurants en Tunisie. Mise en ligne en 48h.
            </p>
            <p className="mt-4 font-bold text-[var(--h-ink)]">
              WhatsApp Commercial :{" "}
              <a
                href={WHATSAPP_BASE}
                target="_blank"
                rel="noreferrer"
                data-cta-location="footer_phone"
                className="text-[var(--h-terra)] hover:underline"
              >
                {WHATSAPP_DISPLAY}
              </a>
            </p>
          </div>

          {/* Col 2: Solutions Menu Digital */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--h-ink)]">
              Solutions Menu QR Code
            </p>
            <ul className="mt-3.5 space-y-2.5 text-[13px] font-medium">
              {COMMERCIAL_PAGES.slice(0, 5).map((p) => (
                <li key={p.slug}>
                  <Link href={p.path} className="transition-colors hover:text-[var(--h-ink)]">
                    {p.shortLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Fonctionnalités & Supports */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--h-ink)]">
              Fonctionnalités & Supports
            </p>
            <ul className="mt-3.5 space-y-2.5 text-[13px] font-medium">
              {COMMERCIAL_PAGES.slice(5, 10).map((p) => (
                <li key={p.slug}>
                  <Link href={p.path} className="transition-colors hover:text-[var(--h-ink)]">
                    {p.shortLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Navigation & Ressources */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--h-ink)]">
              Ressources & Espace Client
            </p>
            <ul className="mt-3.5 space-y-2.5 text-[13px] font-medium">
              <li>
                <Link href="/menu" className="transition-colors hover:text-[var(--h-ink)]">
                  Menus des établissements partenaires
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="transition-colors hover:text-[var(--h-ink)]">
                  Toutes nos solutions en Tunisie
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-[var(--h-ink)]">
                  Blog & Guides Restauration Tunisie
                </Link>
              </li>
              <li>
                <Link href="/prix-menu-digital-tunisie" className="transition-colors hover:text-[var(--h-ink)]">
                  Tarifs & Simulation de Devis
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition-colors hover:text-[var(--h-ink)]">
                  Connexion Tableau de Bord
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--h-line)] pt-6 sm:flex-row">
          <p>© {new Date().getFullYear()} ClickMenu.tn · Solution de menu digital conçue en Tunisie</p>
          <div className="flex flex-wrap items-center gap-5 font-semibold">
            <Link href="/" className="hover:text-[var(--h-ink)]">Accueil</Link>
            <Link href="/solutions" className="hover:text-[var(--h-ink)]">Solutions</Link>
            <Link href="/prix-menu-digital-tunisie" className="hover:text-[var(--h-ink)]">Tarifs</Link>
            <Link href="/menu" className="hover:text-[var(--h-ink)]">Partenaires</Link>
            <Link href="/blog" className="hover:text-[var(--h-ink)]">Blog</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

