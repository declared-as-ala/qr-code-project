export type Supplement = { name: string; price: number };

// Optional extras shown small, under their product (not as standalone items).
export function MenuSupplements({ items, showPrice = true }: { items?: Supplement[]; showPrice?: boolean }) {
  if (!items?.length) return null;
  return (
    <ul className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5" aria-label="Suppléments">
      {items.map((s) => (
        <li key={s.name} className="text-[10px] leading-tight text-[var(--pm-text-muted)]">
          <span className="opacity-70">+ {s.name}</span>
          {showPrice && (
            <span className="ml-1 font-semibold tabular-nums" style={{ color: "#efc360" }}>
              {Number(s.price).toFixed(3)}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
