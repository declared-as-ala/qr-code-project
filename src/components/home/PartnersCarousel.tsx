import Link from "next/link";

export type Partner = { slug: string; name: string; logo?: string; cover?: string; type?: string };

const TYPE_LABEL: Record<string, string> = { cafe: "Café", restaurant: "Restaurant" };

// Auto-scrolling (CSS-only) strip of partner venues. Pauses on hover/focus.
export function PartnersCarousel({ partners }: { partners: Partner[] }) {
  if (!partners.length) return null;

  // Repeat short lists so the loop always overflows the viewport, then duplicate once for a seamless -50% shift.
  const base = Array.from({ length: Math.max(1, Math.ceil(8 / partners.length)) }, () => partners).flat();
  const track = [...base, ...base];
  const duration = Math.max(30, base.length * 4);

  return (
    <section className="py-10" aria-label="Nos établissements partenaires">
      <p className="mb-6 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--h-muted)]">
        Ils nous font confiance
      </p>
      <div
        className="partners-viewport overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <ul className="partners-track flex w-max gap-4" style={{ animationDuration: `${duration}s` }}>
          {track.map((p, i) => (
            <li key={`${p.slug}-${i}`} aria-hidden={i >= base.length ? true : undefined}>
              <Link
                href={`/menu/${p.slug}`}
                tabIndex={i >= base.length ? -1 : undefined}
                className="group flex w-56 items-center gap-3 rounded-2xl border border-[var(--h-line)] bg-white p-3 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.25)] transition-all hover:-translate-y-0.5 hover:border-[var(--h-ink)]/30 hover:shadow-md"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--h-sand)]">
                  {p.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.logo} alt="" width={48} height={48} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-base font-black text-[var(--h-navy)]">{p.name.charAt(0).toUpperCase()}</span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-[var(--h-ink)]">{p.name}</span>
                  <span className="block whitespace-nowrap text-[11px] font-medium text-[var(--h-muted)] transition-colors group-hover:text-[var(--h-terra)]">
                    {TYPE_LABEL[p.type || ""] || "Menu"} · Voir le menu →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
