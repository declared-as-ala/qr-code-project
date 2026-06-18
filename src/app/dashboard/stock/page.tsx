"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Package, AlertTriangle, TrendingUp, Activity,
  Plus, Search, Edit2, Trash2, ArrowUpCircle,
  ArrowDownCircle, RefreshCw, Flame, X, Loader2,
  ChevronDown, BarChart3, ArrowUpDown, Filter,
} from "lucide-react";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────
type StockItem = {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  costPerUnit: number;
  supplier?: string;
  notes?: string;
  createdAt: string;
};

type Movement = {
  _id: string;
  stockItemName: string;
  type: "entree" | "sortie" | "ajustement" | "perte";
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  unit: string;
  note?: string;
  createdAt: string;
};

type Stats = {
  total: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
  monthMovements: number;
};

type ItemForm = {
  name: string;
  category: string;
  quantity: string;
  unit: string;
  minThreshold: string;
  costPerUnit: string;
  supplier: string;
  notes: string;
};

type MovForm = {
  type: "entree" | "sortie" | "ajustement" | "perte";
  quantity: string;
  note: string;
};

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Farines & Céréales",
  "Produits Laitiers",
  "Sucres & Arômes",
  "Œufs & Matières Grasses",
  "Chocolats & Poudres",
  "Fruits & Garnitures",
  "Boissons & Sirops",
  "Emballages",
  "Produits Finis",
  "Autre",
];

const UNITS = ["kg", "g", "L", "cl", "mL", "pièces", "boîtes", "sachets", "bouteilles", "douzaines", "portions", "rouleaux"];

const BLANK_ITEM: ItemForm = { name: "", category: CATEGORIES[0], quantity: "0", unit: "kg", minThreshold: "0", costPerUnit: "0", supplier: "", notes: "" };
const BLANK_MOV:  MovForm  = { type: "entree", quantity: "", note: "" };

const GOLD = "#c8a46a";
const GOLD_DARK = "#a0813e";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60)    return "à l'instant";
  if (diff < 3600)  return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 172800) return "hier";
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function fmtNum(n: number) {
  return n % 1 === 0 ? n.toString() : n.toFixed(2);
}

function getStatus(item: StockItem) {
  if (item.quantity === 0) return "rupture";
  if (item.minThreshold > 0 && item.quantity <= item.minThreshold) return "bas";
  return "ok";
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StatusBadge({ item }: { item: StockItem }) {
  const s = getStatus(item);
  if (s === "rupture") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-100">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500 inline-block" />
      Rupture
    </span>
  );
  if (s === "bas") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
      Stock bas
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
      OK
    </span>
  );
}

function MovBadge({ type }: { type: Movement["type"] }) {
  const map = {
    entree:      { label: "Entrée",      cls: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: <ArrowUpCircle className="h-3 w-3" /> },
    sortie:      { label: "Sortie",      cls: "bg-sky-50 text-sky-700 border-sky-100",             icon: <ArrowDownCircle className="h-3 w-3" /> },
    perte:       { label: "Perte",       cls: "bg-red-50 text-red-600 border-red-100",             icon: <Flame className="h-3 w-3" /> },
    ajustement:  { label: "Ajustement",  cls: "bg-violet-50 text-violet-700 border-violet-100",    icon: <RefreshCw className="h-3 w-3" /> },
  } as const;
  const m = map[type];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${m.cls}`}>
      {m.icon} {m.label}
    </span>
  );
}

// ── Modal wrapper ─────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, width = "max-w-lg" }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; width?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div ref={ref} className={`relative bg-white rounded-2xl shadow-2xl w-full ${width} border border-stone-200/80 animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="text-base font-semibold text-stone-900">{title}</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-600 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Item Form ─────────────────────────────────────────────────────────────────
function ItemFormDialog({
  open, onClose, editing, onSaved,
}: {
  open: boolean; onClose: () => void; editing?: StockItem; onSaved: () => void;
}) {
  const [form, setForm] = useState<ItemForm>(BLANK_ITEM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(editing ? {
        name:         editing.name,
        category:     editing.category,
        quantity:     String(editing.quantity),
        unit:         editing.unit,
        minThreshold: String(editing.minThreshold),
        costPerUnit:  String(editing.costPerUnit),
        supplier:     editing.supplier ?? "",
        notes:        editing.notes ?? "",
      } : BLANK_ITEM);
    }
  }, [open, editing]);

  const set = (k: keyof ItemForm, v: string) => setForm(p => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.category) return toast.error("Nom et catégorie requis");
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      category: form.category,
      quantity: parseFloat(form.quantity) || 0,
      unit: form.unit,
      minThreshold: parseFloat(form.minThreshold) || 0,
      costPerUnit: parseFloat(form.costPerUnit) || 0,
      supplier: form.supplier.trim(),
      notes: form.notes.trim(),
    };
    const res = await fetch(editing ? `/api/stock/items/${editing._id}` : "/api/stock/items", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) return toast.error("Erreur d'enregistrement");
    toast.success(editing ? "Article mis à jour" : "Article ajouté");
    onSaved();
    onClose();
  }

  const F = ({ id, label, type = "text", placeholder = "", required = false, colSpan = "" }: {
    id: keyof ItemForm; label: string; type?: string; placeholder?: string; required?: boolean; colSpan?: string;
  }) => (
    <div className={colSpan}>
      <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <input
        type={type}
        value={form[id]}
        onChange={e => set(id, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
        style={{ "--tw-ring-color": GOLD } as React.CSSProperties}
      />
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Modifier l'article" : "Nouvel article"} width="max-w-2xl">
      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <F id="name" label="Nom de l'article" required colSpan="col-span-2" />
          <div>
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Catégorie<span className="text-red-400 ml-0.5">*</span></label>
            <select value={form.category} onChange={e => set("category", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 transition-all">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Unité<span className="text-red-400 ml-0.5">*</span></label>
            <select value={form.unit} onChange={e => set("unit", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 transition-all">
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          <F id="quantity"     label="Quantité initiale" type="number" placeholder="0" />
          <F id="minThreshold" label="Seuil d'alerte"    type="number" placeholder="0" />
          <F id="costPerUnit"  label="Coût / unité (TND)" type="number" placeholder="0.00" />
          <F id="supplier"     label="Fournisseur" placeholder="Nom du fournisseur" />
          <div className="col-span-2">
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={2} placeholder="Informations complémentaires…"
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 transition-all resize-none" />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors">Annuler</button>
          <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all active:scale-[0.97]"
            style={{ background: saving ? "#d4b896" : GOLD }}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {editing ? "Mettre à jour" : "Ajouter l'article"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Movement Dialog ───────────────────────────────────────────────────────────
function MovementDialog({ open, onClose, item, onSaved }: {
  open: boolean; onClose: () => void; item?: StockItem; onSaved: () => void;
}) {
  const [form, setForm] = useState<MovForm>(BLANK_MOV);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (open) setForm(BLANK_MOV); }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const qty = parseFloat(form.quantity);
    if (!qty || qty <= 0) return toast.error("Quantité invalide");
    if (!item) return;
    setSaving(true);
    const res = await fetch("/api/stock/movements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockItemId: item._id, type: form.type, quantity: qty, note: form.note }),
    });
    setSaving(false);
    if (!res.ok) return toast.error("Erreur d'enregistrement");
    toast.success("Mouvement enregistré");
    onSaved();
    onClose();
  }

  const MOV_TYPES = [
    { value: "entree",     label: "Entrée",     desc: "Réception ou achat",           cls: "border-emerald-300 bg-emerald-50 text-emerald-700" },
    { value: "sortie",     label: "Sortie",     desc: "Utilisation en production",    cls: "border-sky-300 bg-sky-50 text-sky-700" },
    { value: "perte",      label: "Perte",      desc: "Détérioration ou casse",       cls: "border-red-300 bg-red-50 text-red-600" },
    { value: "ajustement", label: "Correction", desc: "Définir la quantité exacte",   cls: "border-violet-300 bg-violet-50 text-violet-700" },
  ] as const;

  return (
    <Modal open={open} onClose={onClose} title={`Mouvement de stock — ${item?.name ?? ""}`}>
      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-2 gap-2">
          {MOV_TYPES.map(t => (
            <button
              key={t.value} type="button"
              onClick={() => setForm(p => ({ ...p, type: t.value }))}
              className={`px-3 py-3 rounded-xl border-2 text-left transition-all ${form.type === t.value ? t.cls : "border-stone-200 bg-stone-50 text-stone-500 hover:bg-stone-100"}`}
            >
              <div className="text-sm font-semibold">{t.label}</div>
              <div className="text-[11px] mt-0.5 opacity-80">{t.desc}</div>
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">
            {form.type === "ajustement" ? "Nouvelle quantité exacte" : "Quantité"} ({item?.unit})
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number" min="0" step="any" value={form.quantity}
              onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))}
              className="flex-1 px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 transition-all"
              placeholder="0"
            />
            <span className="text-sm text-stone-500 font-medium pr-1">{item?.unit}</span>
          </div>
          {item && form.type !== "ajustement" && (
            <p className="text-xs text-stone-400 mt-1">Stock actuel : <span className="font-semibold text-stone-600">{fmtNum(item.quantity)} {item.unit}</span></p>
          )}
          {item && form.type === "ajustement" && (
            <p className="text-xs text-stone-400 mt-1">Stock actuel : <span className="font-semibold text-stone-600">{fmtNum(item.quantity)} {item.unit}</span> → entrez la valeur corrigée</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Note (optionnel)</label>
          <input type="text" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
            placeholder="Raison, fournisseur, numéro de lot…"
            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 transition-all" />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors">Annuler</button>
          <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all active:scale-[0.97]"
            style={{ background: saving ? "#d4b896" : GOLD }}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Enregistrer
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Delete Dialog ─────────────────────────────────────────────────────────────
function DeleteDialog({ open, onClose, item, onDeleted }: {
  open: boolean; onClose: () => void; item?: StockItem; onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);
  async function confirm() {
    if (!item) return;
    setLoading(true);
    await fetch(`/api/stock/items/${item._id}`, { method: "DELETE" });
    setLoading(false);
    toast.success("Article supprimé");
    onDeleted();
    onClose();
  }
  return (
    <Modal open={open} onClose={onClose} title="Supprimer l'article" width="max-w-sm">
      <div className="space-y-4">
        <p className="text-sm text-stone-600">
          Voulez-vous vraiment supprimer <span className="font-semibold text-stone-900">"{item?.name}"</span> ? Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors">Annuler</button>
          <button onClick={confirm} disabled={loading} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 flex items-center gap-2 transition-colors">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Supprimer
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function StockPage() {
  const [tab, setTab]               = useState<"inventaire" | "mouvements">("inventaire");
  const [items, setItems]           = useState<StockItem[]>([]);
  const [movements, setMovements]   = useState<Movement[]>([]);
  const [stats, setStats]           = useState<Stats | null>(null);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [catFilter, setCatFilter]   = useState("");
  const [movFilter, setMovFilter]   = useState("");

  const [itemDialog, setItemDialog] = useState<{ open: boolean; item?: StockItem }>({ open: false });
  const [movDialog,  setMovDialog]  = useState<{ open: boolean; item?: StockItem }>({ open: false });
  const [delDialog,  setDelDialog]  = useState<{ open: boolean; item?: StockItem }>({ open: false });

  const refresh = useCallback(async () => {
    setLoading(true);
    const [ir, mr, sr] = await Promise.all([
      fetch("/api/stock/items"),
      fetch("/api/stock/movements"),
      fetch("/api/stock/stats"),
    ]);
    if (ir.ok) setItems(await ir.json());
    if (mr.ok) setMovements(await mr.json());
    if (sr.ok) setStats(await sr.json());
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // ── Filtered items ──────────────────────────────────────────────────────────
  const filtered = items.filter(i => {
    const s = search.toLowerCase();
    const matchSearch = !s || i.name.toLowerCase().includes(s) || i.supplier?.toLowerCase().includes(s) || i.category.toLowerCase().includes(s);
    const matchCat = !catFilter || i.category === catFilter;
    return matchSearch && matchCat;
  });

  const filteredMov = movements.filter(m => !movFilter || m.type === movFilter);

  // ── Alerts ──────────────────────────────────────────────────────────────────
  const alertItems = items.filter(i => getStatus(i) !== "ok");

  // ── Stat cards ──────────────────────────────────────────────────────────────
  const statCards = [
    {
      label: "Articles en stock",
      value: stats?.total ?? "—",
      icon: <Package className="h-5 w-5" />,
      color: "text-stone-700",
      bg:   "bg-stone-100",
    },
    {
      label: "Alertes actives",
      value: (stats?.lowStock ?? 0) + (stats?.outOfStock ?? 0),
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-amber-700",
      bg:   "bg-amber-50",
      highlight: ((stats?.lowStock ?? 0) + (stats?.outOfStock ?? 0)) > 0,
    },
    {
      label: "Valeur totale",
      value: stats ? `${stats.totalValue.toFixed(0)} TND` : "—",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "text-emerald-700",
      bg:   "bg-emerald-50",
    },
    {
      label: "Mouvements ce mois",
      value: stats?.monthMovements ?? "—",
      icon: <Activity className="h-5 w-5" />,
      color: "text-violet-700",
      bg:   "bg-violet-50",
    },
  ];

  const usedCategories = [...new Set(items.map(i => i.category))].sort();

  return (
    <div className="-mx-4 sm:-mx-6 -mt-6 min-h-[calc(100dvh-56px)] bg-[#fafaf8] px-4 sm:px-8 pt-8 pb-28 lg:pb-10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: GOLD }}>
              <Package className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-stone-900">Gestion du Stock</h1>
          </div>
          <p className="text-sm text-stone-500 ml-10.5">Ingrédients, produits finis et historique des mouvements.</p>
        </div>
        <button
          onClick={() => setItemDialog({ open: true })}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all active:scale-[0.97]"
          style={{ background: GOLD }}
        >
          <Plus className="h-4 w-4" />
          Ajouter un article
        </button>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(c => (
          <div key={c.label}
            className={`bg-white rounded-2xl border p-5 flex items-center gap-4 shadow-sm transition-shadow hover:shadow-md ${c.highlight ? "border-amber-200 ring-1 ring-amber-100" : "border-stone-200"}`}>
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${c.bg} ${c.color}`}>
              {c.icon}
            </div>
            <div className="min-w-0">
              <div className="text-2xl font-bold text-stone-900 leading-tight">{loading ? <span className="text-stone-300">—</span> : c.value}</div>
              <div className="text-[11px] text-stone-500 font-medium uppercase tracking-wide mt-0.5 truncate">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Alert banner ───────────────────────────────────────────────────── */}
      {!loading && alertItems.length > 0 && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-amber-800">
              {alertItems.length} article{alertItems.length > 1 ? "s" : ""} nécessite{alertItems.length === 1 ? "" : "nt"} votre attention
            </p>
            <p className="text-xs text-amber-700 mt-0.5 line-clamp-1">
              {alertItems.map(i => i.name).join(" · ")}
            </p>
          </div>
        </div>
      )}

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-stone-200/60 rounded-xl mb-6 w-fit">
        {(["inventaire", "mouvements"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-[10px] text-sm font-semibold capitalize transition-all ${tab === t ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}>
            {t === "inventaire" ? "Inventaire" : "Historique"}
          </button>
        ))}
      </div>

      {/* ── Inventaire Tab ─────────────────────────────────────────────────── */}
      {tab === "inventaire" && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-stone-100 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un article, fournisseur…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 focus:outline-none focus:ring-2 transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
              <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-700 focus:outline-none focus:ring-2 transition-all appearance-none min-w-[180px]">
                <option value="">Toutes catégories</option>
                {usedCategories.map(c => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center h-48 text-stone-400">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Chargement…
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-stone-400">
              <Package className="h-8 w-8 mb-3 text-stone-300" />
              <p className="text-sm font-medium">{items.length === 0 ? "Aucun article pour l'instant" : "Aucun résultat"}</p>
              {items.length === 0 && (
                <button onClick={() => setItemDialog({ open: true })}
                  className="mt-3 text-xs font-semibold px-4 py-2 rounded-xl text-white transition-all"
                  style={{ background: GOLD }}>
                  + Ajouter votre premier article
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100">
                    {["Article", "Catégorie", "Stock", "Seuil", "Statut", "Coût/u", ""].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filtered.map((item, idx) => (
                    <tr key={item._id} className={`hover:bg-stone-50/80 transition-colors group ${idx % 2 === 1 ? "bg-stone-50/30" : ""}`}>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-stone-900">{item.name}</div>
                        {item.supplier && <div className="text-[11px] text-stone-400 mt-0.5">{item.supplier}</div>}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs px-2 py-1 rounded-lg bg-stone-100 text-stone-600 font-medium">{item.category}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`font-bold text-base ${item.quantity === 0 ? "text-red-500" : item.minThreshold > 0 && item.quantity <= item.minThreshold ? "text-amber-600" : "text-stone-900"}`}>
                          {fmtNum(item.quantity)}
                        </span>
                        <span className="text-stone-400 text-xs ml-1">{item.unit}</span>
                      </td>
                      <td className="px-5 py-3.5 text-stone-500 text-sm">
                        {item.minThreshold > 0 ? <>{fmtNum(item.minThreshold)} <span className="text-xs">{item.unit}</span></> : <span className="text-stone-300">—</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge item={item} />
                      </td>
                      <td className="px-5 py-3.5 text-stone-500 text-sm">
                        {item.costPerUnit > 0 ? <>{item.costPerUnit.toFixed(2)} <span className="text-xs">TND</span></> : <span className="text-stone-300">—</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setMovDialog({ open: true, item })}
                            className="h-8 w-8 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-500 hover:text-amber-700 flex items-center justify-center transition-colors"
                            title="Enregistrer un mouvement">
                            <ArrowUpDown className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => setItemDialog({ open: true, item })}
                            className="h-8 w-8 rounded-lg bg-stone-100 hover:bg-sky-100 text-stone-500 hover:text-sky-700 flex items-center justify-center transition-colors"
                            title="Modifier">
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => setDelDialog({ open: true, item })}
                            className="h-8 w-8 rounded-lg bg-stone-100 hover:bg-red-100 text-stone-500 hover:text-red-600 flex items-center justify-center transition-colors"
                            title="Supprimer">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer count */}
          {!loading && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-400">{filtered.length} article{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}</span>
              <span className="text-xs text-stone-400">{items.filter(i => getStatus(i) === "ok").length} OK · {items.filter(i => getStatus(i) === "bas").length} bas · {items.filter(i => getStatus(i) === "rupture").length} rupture</span>
            </div>
          )}
        </div>
      )}

      {/* ── Mouvements Tab ─────────────────────────────────────────────────── */}
      {tab === "mouvements" && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-3">
            <div className="relative">
              <select value={movFilter} onChange={e => setMovFilter(e.target.value)}
                className="pl-4 pr-8 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-700 focus:outline-none focus:ring-2 transition-all appearance-none min-w-[160px]">
                <option value="">Tous les types</option>
                <option value="entree">Entrées</option>
                <option value="sortie">Sorties</option>
                <option value="perte">Pertes</option>
                <option value="ajustement">Corrections</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
            </div>
            <span className="text-xs text-stone-400 ml-auto">{filteredMov.length} mouvement{filteredMov.length > 1 ? "s" : ""}</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48 text-stone-400">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Chargement…
            </div>
          ) : filteredMov.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-stone-400">
              <Activity className="h-8 w-8 mb-3 text-stone-300" />
              <p className="text-sm font-medium">Aucun mouvement enregistré</p>
              <p className="text-xs text-stone-400 mt-1">Les entrées et sorties de stock apparaîtront ici.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100">
                    {["Article", "Type", "Quantité", "Avant → Après", "Note", "Date"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filteredMov.map((m, idx) => (
                    <tr key={m._id} className={`hover:bg-stone-50/80 transition-colors ${idx % 2 === 1 ? "bg-stone-50/30" : ""}`}>
                      <td className="px-5 py-3.5 font-semibold text-stone-900">{m.stockItemName}</td>
                      <td className="px-5 py-3.5"><MovBadge type={m.type} /></td>
                      <td className="px-5 py-3.5">
                        <span className={`font-bold ${m.type === "entree" ? "text-emerald-600" : m.type === "perte" ? "text-red-500" : m.type === "sortie" ? "text-sky-600" : "text-violet-600"}`}>
                          {m.type === "entree" ? "+" : m.type === "sortie" || m.type === "perte" ? "−" : "→"}{fmtNum(m.quantity)}
                        </span>
                        <span className="text-stone-400 text-xs ml-1">{m.unit}</span>
                      </td>
                      <td className="px-5 py-3.5 text-stone-500 text-xs">
                        <span className="font-mono">{fmtNum(m.previousQuantity)}</span>
                        <span className="mx-1.5 text-stone-300">→</span>
                        <span className="font-mono font-semibold text-stone-700">{fmtNum(m.newQuantity)}</span>
                        <span className="ml-1 text-stone-400">{m.unit}</span>
                      </td>
                      <td className="px-5 py-3.5 text-stone-500 max-w-[180px] truncate">{m.note || <span className="text-stone-300">—</span>}</td>
                      <td className="px-5 py-3.5 text-stone-400 text-xs whitespace-nowrap">{fmtDate(m.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Dialogs ─────────────────────────────────────────────────────────── */}
      <ItemFormDialog
        open={itemDialog.open}
        editing={itemDialog.item}
        onClose={() => setItemDialog({ open: false })}
        onSaved={refresh}
      />
      <MovementDialog
        open={movDialog.open}
        item={movDialog.item}
        onClose={() => setMovDialog({ open: false })}
        onSaved={refresh}
      />
      <DeleteDialog
        open={delDialog.open}
        item={delDialog.item}
        onClose={() => setDelDialog({ open: false })}
        onDeleted={refresh}
      />
    </div>
  );
}
