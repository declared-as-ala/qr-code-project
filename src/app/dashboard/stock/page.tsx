"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Package, AlertTriangle, TrendingUp, Activity,
  Plus, Search, Edit2, Trash2, ArrowUpCircle,
  ArrowDownCircle, RefreshCw, Flame, X, Loader2,
  ChevronDown, BarChart3, ArrowUpDown, Filter,
  ShoppingCart, CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────
type StockItem = {
  _id: string; name: string; category: string; quantity: number;
  unit: string; minThreshold: number; costPerUnit: number;
  supplier?: string; notes?: string; createdAt: string;
};
type Movement = {
  _id: string; stockItemName: string;
  type: "entree" | "sortie" | "ajustement" | "perte";
  quantity: number; previousQuantity: number; newQuantity: number;
  unit: string; note?: string; createdAt: string;
};
type TicketItem = { stockItemId: string; name: string; quantity: string; unit: string };
type Ticket = {
  _id: string; reference: string;
  items: { stockItemId: string; name: string; quantity: number; unit: string }[];
  note?: string; createdAt: string;
};
type Stats = {
  total: number; lowStock: number; outOfStock: number;
  totalValue: number; monthMovements: number;
};
type ItemForm = {
  name: string; category: string; quantity: string; unit: string;
  minThreshold: string; costPerUnit: string; supplier: string; notes: string;
};
type MovForm = { type: "entree" | "sortie" | "ajustement" | "perte"; quantity: string; note: string };

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Farines & Céréales", "Produits Laitiers", "Sucres & Arômes",
  "Œufs & Matières Grasses", "Chocolats & Poudres", "Fruits & Garnitures",
  "Boissons & Sirops", "Emballages", "Produits Finis", "Autre",
];
const UNITS = ["kg","g","L","cl","mL","pièces","boîtes","sachets","bouteilles","douzaines","portions","rouleaux"];
const BLANK_ITEM: ItemForm = { name:"", category:CATEGORIES[0], quantity:"0", unit:"kg", minThreshold:"0", costPerUnit:"0", supplier:"", notes:"" };
const BLANK_MOV:  MovForm  = { type:"entree", quantity:"", note:"" };
const GOLD = "#c8a46a";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  const d = new Date(iso), now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60)     return "à l'instant";
  if (diff < 3600)   return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400)  return `il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 172800) return "hier";
  return d.toLocaleDateString("fr-FR", { day:"2-digit", month:"short" });
}
function fmtNum(n: number) { return n % 1 === 0 ? n.toString() : n.toFixed(2); }
function getStatus(item: StockItem) {
  if (item.quantity === 0) return "rupture";
  if (item.minThreshold > 0 && item.quantity <= item.minThreshold) return "bas";
  return "ok";
}

// ── Status / type badges ──────────────────────────────────────────────────────
function StatusBadge({ item }: { item: StockItem }) {
  const s = getStatus(item);
  if (s === "rupture") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-100"><span className="h-1.5 w-1.5 rounded-full bg-red-500 inline-block" />Rupture</span>;
  if (s === "bas")     return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100"><span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />Stock bas</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />OK</span>;
}
function MovBadge({ type }: { type: Movement["type"] }) {
  const map = {
    entree:     { label:"Entrée",     cls:"bg-emerald-50 text-emerald-700 border-emerald-100", icon:<ArrowUpCircle className="h-3 w-3" /> },
    sortie:     { label:"Sortie",     cls:"bg-sky-50 text-sky-700 border-sky-100",             icon:<ArrowDownCircle className="h-3 w-3" /> },
    perte:      { label:"Perte",      cls:"bg-red-50 text-red-600 border-red-100",             icon:<Flame className="h-3 w-3" /> },
    ajustement: { label:"Correction", cls:"bg-violet-50 text-violet-700 border-violet-100",    icon:<RefreshCw className="h-3 w-3" /> },
  } as const;
  const m = map[type];
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${m.cls}`}>{m.icon}{m.label}</span>;
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, width="max-w-lg" }: {
  open:boolean; onClose:()=>void; title:string; children:React.ReactNode; width?:string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key==="Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />
      <div ref={ref}
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${width} border border-stone-200/80`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="text-base font-semibold text-stone-900">{title}</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Field helpers ─────────────────────────────────────────────────────────────
const inputCls = "w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all";
const labelCls = "block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5";

// ── Item Form Dialog ──────────────────────────────────────────────────────────
function ItemFormDialog({ open, onClose, editing, onSaved }: {
  open:boolean; onClose:()=>void; editing?:StockItem; onSaved:()=>void;
}) {
  const [form, setForm] = useState<ItemForm>(BLANK_ITEM);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof ItemForm, v: string) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    if (open) setForm(editing ? { name:editing.name, category:editing.category, quantity:String(editing.quantity), unit:editing.unit, minThreshold:String(editing.minThreshold), costPerUnit:String(editing.costPerUnit), supplier:editing.supplier??""  , notes:editing.notes??"" } : BLANK_ITEM);
  }, [open, editing]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Nom requis");
    setSaving(true);
    const res = await fetch(editing ? `/api/stock/items/${editing._id}` : "/api/stock/items", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name:form.name.trim(), category:form.category, quantity:parseFloat(form.quantity)||0, unit:form.unit, minThreshold:parseFloat(form.minThreshold)||0, costPerUnit:parseFloat(form.costPerUnit)||0, supplier:form.supplier.trim(), notes:form.notes.trim() }),
    });
    setSaving(false);
    if (!res.ok) return toast.error("Erreur");
    toast.success(editing ? "Article mis à jour" : "Article ajouté");
    onSaved(); onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Modifier l'article" : "Nouvel article"} width="max-w-2xl">
      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><label className={labelCls}>Nom *</label><input value={form.name} onChange={e=>set("name",e.target.value)} className={inputCls} placeholder="Ex: Farine T45" /></div>
          <div><label className={labelCls}>Catégorie *</label><select value={form.category} onChange={e=>set("category",e.target.value)} className={inputCls}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
          <div><label className={labelCls}>Unité *</label><select value={form.unit} onChange={e=>set("unit",e.target.value)} className={inputCls}>{UNITS.map(u=><option key={u}>{u}</option>)}</select></div>
          <div><label className={labelCls}>Quantité initiale</label><input type="number" value={form.quantity} onChange={e=>set("quantity",e.target.value)} className={inputCls} placeholder="0" /></div>
          <div><label className={labelCls}>Seuil d'alerte</label><input type="number" value={form.minThreshold} onChange={e=>set("minThreshold",e.target.value)} className={inputCls} placeholder="0" /></div>
          <div><label className={labelCls}>Coût / unité (TND)</label><input type="number" value={form.costPerUnit} onChange={e=>set("costPerUnit",e.target.value)} className={inputCls} placeholder="0.00" /></div>
          <div><label className={labelCls}>Fournisseur</label><input value={form.supplier} onChange={e=>set("supplier",e.target.value)} className={inputCls} placeholder="Nom du fournisseur" /></div>
          <div className="col-span-2"><label className={labelCls}>Notes</label><textarea value={form.notes} onChange={e=>set("notes",e.target.value)} rows={2} className={`${inputCls} resize-none`} placeholder="Informations complémentaires…" /></div>
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50">Annuler</button>
          <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 active:scale-[0.97]" style={{background:saving?"#d4b896":GOLD}}>
            {saving&&<Loader2 className="h-4 w-4 animate-spin"/>}{editing?"Mettre à jour":"Ajouter"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Movement Dialog ───────────────────────────────────────────────────────────
function MovementDialog({ open, onClose, item, onSaved }: {
  open:boolean; onClose:()=>void; item?:StockItem; onSaved:()=>void;
}) {
  const [form, setForm] = useState<MovForm>(BLANK_MOV);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (open) setForm(BLANK_MOV); }, [open]);

  const TYPES = [
    { value:"entree",     label:"Entrée",     desc:"Réception / achat",         cls:"border-emerald-300 bg-emerald-50 text-emerald-700" },
    { value:"sortie",     label:"Sortie",     desc:"Utilisation production",     cls:"border-sky-300 bg-sky-50 text-sky-700" },
    { value:"perte",      label:"Perte",      desc:"Détérioration / casse",      cls:"border-red-300 bg-red-50 text-red-600" },
    { value:"ajustement", label:"Correction", desc:"Définir la quantité exacte", cls:"border-violet-300 bg-violet-50 text-violet-700" },
  ] as const;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const qty = parseFloat(form.quantity);
    if (!qty || qty <= 0) return toast.error("Quantité invalide");
    if (!item) return;
    setSaving(true);
    const res = await fetch("/api/stock/movements", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ stockItemId:item._id, type:form.type, quantity:qty, note:form.note }) });
    setSaving(false);
    if (!res.ok) return toast.error("Erreur");
    toast.success("Mouvement enregistré");
    onSaved(); onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={`Mouvement — ${item?.name??""}`}>
      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-2 gap-2">
          {TYPES.map(t=>(
            <button key={t.value} type="button" onClick={()=>setForm(p=>({...p,type:t.value}))}
              className={`px-3 py-3 rounded-xl border-2 text-left transition-all ${form.type===t.value?t.cls:"border-stone-200 bg-stone-50 text-stone-500 hover:bg-stone-100"}`}>
              <div className="text-sm font-semibold">{t.label}</div>
              <div className="text-[11px] mt-0.5 opacity-80">{t.desc}</div>
            </button>
          ))}
        </div>
        <div>
          <label className={labelCls}>{form.type==="ajustement"?"Nouvelle quantité exacte":"Quantité"} ({item?.unit})</label>
          <div className="flex items-center gap-2">
            <input type="number" min="0" step="any" value={form.quantity} onChange={e=>setForm(p=>({...p,quantity:e.target.value}))} className={`flex-1 ${inputCls}`} placeholder="0" />
            <span className="text-sm text-stone-400 pr-1">{item?.unit}</span>
          </div>
          {item&&<p className="text-xs text-stone-400 mt-1">Stock actuel : <span className="font-semibold text-stone-700">{fmtNum(item.quantity)} {item.unit}</span></p>}
        </div>
        <div>
          <label className={labelCls}>Note (optionnel)</label>
          <input type="text" value={form.note} onChange={e=>setForm(p=>({...p,note:e.target.value}))} className={inputCls} placeholder="Raison, fournisseur, lot…" />
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50">Annuler</button>
          <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 active:scale-[0.97]" style={{background:saving?"#d4b896":GOLD}}>
            {saving&&<Loader2 className="h-4 w-4 animate-spin"/>}Enregistrer
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Delete Dialog ─────────────────────────────────────────────────────────────
function DeleteDialog({ open, onClose, item, onDeleted }: {
  open:boolean; onClose:()=>void; item?:StockItem; onDeleted:()=>void;
}) {
  const [loading, setLoading] = useState(false);
  async function confirm() {
    if (!item) return;
    setLoading(true);
    await fetch(`/api/stock/items/${item._id}`, { method:"DELETE" });
    setLoading(false);
    toast.success("Article supprimé");
    onDeleted(); onClose();
  }
  return (
    <Modal open={open} onClose={onClose} title="Supprimer l'article" width="max-w-sm">
      <div className="space-y-4">
        <p className="text-sm text-stone-600">Voulez-vous vraiment supprimer <span className="font-semibold text-stone-900">"{item?.name}"</span> ? Cette action est irréversible.</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50">Annuler</button>
          <button onClick={confirm} disabled={loading} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 flex items-center gap-2">
            {loading&&<Loader2 className="h-4 w-4 animate-spin"/>}Supprimer
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Commande Dialog ───────────────────────────────────────────────────────────
function CommandeDialog({ open, onClose, items, onSaved }: {
  open:boolean; onClose:()=>void; items:StockItem[]; onSaved:()=>void;
}) {
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<TicketItem[]>([]);
  const [note, setNote]         = useState("");
  const [saving, setSaving]     = useState(false);

  useEffect(() => { if (open) { setSelected([]); setNote(""); setSearch(""); } }, [open]);

  const available = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) &&
    !selected.find(s => s.stockItemId === i._id)
  );

  const addItem = (item: StockItem) => {
    setSelected(p => [...p, { stockItemId:item._id, name:item.name, quantity:"", unit:item.unit }]);
    setSearch("");
  };
  const removeItem = (id: string) => setSelected(p => p.filter(s => s.stockItemId !== id));
  const setQty = (id: string, qty: string) => setSelected(p => p.map(s => s.stockItemId===id ? {...s,quantity:qty} : s));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const valid = selected.filter(s => parseFloat(s.quantity) > 0);
    if (valid.length === 0) return toast.error("Ajoutez au moins un article avec une quantité");
    setSaving(true);
    const res = await fetch("/api/stock/tickets", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ items: valid.map(s=>({ stockItemId:s.stockItemId, quantity:parseFloat(s.quantity) })), note }),
    });
    setSaving(false);
    if (!res.ok) return toast.error("Erreur lors de la validation");
    const data = await res.json();
    toast.success(`Commande ${data.reference} validée ✓`);
    onSaved(); onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Passer une commande" width="max-w-2xl">
      <form onSubmit={submit} className="space-y-5">

        {/* Item list with search filter */}
        <div>
          <label className={labelCls}>Articles disponibles — cliquez pour ajouter</label>
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Filtrer les articles…" className={`pl-9 ${inputCls}`} />
            {search && <button type="button" onClick={()=>setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"><X className="h-3.5 w-3.5"/></button>}
          </div>
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white max-h-48 overflow-y-auto">
            {available.length === 0 ? (
              <div className="flex items-center justify-center h-14 text-xs text-stone-400">
                {search ? "Aucun article correspondant" : "Tous les articles sont déjà sélectionnés"}
              </div>
            ) : available.map(item=>(
              <button key={item._id} type="button" onClick={()=>addItem(item)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-amber-50 transition-colors border-b border-stone-50 last:border-0 group">
                <div className="text-left">
                  <span className="font-medium text-stone-800 group-hover:text-amber-800">{item.name}</span>
                  <span className="text-stone-400 text-[11px] ml-2">{item.category}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-semibold ${item.quantity===0?"text-red-400":"text-stone-400"}`}>
                    {fmtNum(item.quantity)} {item.unit}
                  </span>
                  <Plus className="h-3.5 w-3.5 text-stone-300 group-hover:text-amber-600 transition-colors"/>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected items */}
        {selected.length > 0 ? (
          <div>
            <label className={labelCls}>Articles de la commande ({selected.length})</label>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-0.5">
              {selected.map(s => {
                const stockItem = items.find(i => i._id === s.stockItemId);
                const qty = parseFloat(s.quantity) || 0;
                const overStock = stockItem && qty > stockItem.quantity;
                return (
                  <div key={s.stockItemId} className={`flex items-center gap-3 rounded-xl px-4 py-2.5 border transition-colors ${overStock?"bg-red-50 border-red-200":"bg-stone-50 border-stone-200"}`}>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-stone-900 truncate">{s.name}</div>
                      <div className={`text-[11px] ${overStock?"text-red-500 font-medium":"text-stone-400"}`}>
                        {overStock ? `⚠ Stock insuffisant (${fmtNum(stockItem!.quantity)} dispo)` : `Stock actuel: ${stockItem?fmtNum(stockItem.quantity):"?"} ${s.unit}`}
                      </div>
                    </div>
                    <input type="number" min="0" step="any" value={s.quantity} onChange={e=>setQty(s.stockItemId,e.target.value)}
                      placeholder="Qté" className="w-20 px-2 py-1.5 rounded-lg border border-stone-200 bg-white text-sm text-stone-900 text-center focus:outline-none focus:ring-2 focus:ring-amber-300" />
                    <span className="text-xs text-stone-400 w-8 shrink-0 text-center">{s.unit}</span>
                    <button type="button" onClick={()=>removeItem(s.stockItemId)}
                      className="h-7 w-7 rounded-lg hover:bg-red-100 text-stone-300 hover:text-red-400 flex items-center justify-center shrink-0">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 rounded-xl border-2 border-dashed border-stone-200 text-stone-300">
            <ShoppingCart className="h-8 w-8 mb-2" />
            <p className="text-sm">Recherchez et ajoutez des articles ci-dessus</p>
          </div>
        )}

        {/* Note */}
        <div>
          <label className={labelCls}>Note (optionnel)</label>
          <input type="text" value={note} onChange={e=>setNote(e.target.value)}
            className={inputCls} placeholder="Production du jour, service du soir…" />
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-stone-100">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50">Annuler</button>
          <button type="submit" disabled={saving || selected.length === 0}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 active:scale-[0.97] disabled:opacity-50"
            style={{background:GOLD}}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin"/> : <CheckCircle2 className="h-4 w-4"/>}
            Valider la commande
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function StockPage() {
  const [tab, setTab]               = useState<"inventaire"|"mouvements"|"commandes">("inventaire");
  const [items, setItems]           = useState<StockItem[]>([]);
  const [movements, setMovements]   = useState<Movement[]>([]);
  const [tickets, setTickets]       = useState<Ticket[]>([]);
  const [stats, setStats]           = useState<Stats|null>(null);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [catFilter, setCatFilter]   = useState("");
  const [movFilter, setMovFilter]   = useState("");

  const [itemDialog, setItemDialog] = useState<{open:boolean;item?:StockItem}>({open:false});
  const [movDialog,  setMovDialog]  = useState<{open:boolean;item?:StockItem}>({open:false});
  const [delDialog,  setDelDialog]  = useState<{open:boolean;item?:StockItem}>({open:false});
  const [cmdDialog,  setCmdDialog]  = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [ir, mr, sr, tr] = await Promise.all([
      fetch("/api/stock/items"),
      fetch("/api/stock/movements"),
      fetch("/api/stock/stats"),
      fetch("/api/stock/tickets"),
    ]);
    if (ir.ok) setItems(await ir.json());
    if (mr.ok) setMovements(await mr.json());
    if (sr.ok) setStats(await sr.json());
    if (tr.ok) setTickets(await tr.json());
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const filtered    = items.filter(i => {
    const s = search.toLowerCase();
    return (!s || i.name.toLowerCase().includes(s) || i.supplier?.toLowerCase().includes(s) || i.category.toLowerCase().includes(s))
      && (!catFilter || i.category === catFilter);
  });
  const filteredMov = movements.filter(m => !movFilter || m.type === movFilter);
  const alertItems  = items.filter(i => getStatus(i) !== "ok");
  const usedCats    = [...new Set(items.map(i => i.category))].sort();

  const STAT_CARDS = [
    { label:"Articles en stock",    value:stats?.total??"-",                                icon:<Package className="h-5 w-5"/>,    bg:"bg-stone-100",   tc:"text-stone-700" },
    { label:"Alertes actives",      value:(stats?.lowStock??0)+(stats?.outOfStock??0),      icon:<AlertTriangle className="h-5 w-5"/>, bg:"bg-amber-50",  tc:"text-amber-700",  hl:((stats?.lowStock??0)+(stats?.outOfStock??0))>0 },
    { label:"Valeur totale (TND)",  value:stats?`${stats.totalValue.toFixed(0)} TND`:"—",  icon:<BarChart3 className="h-5 w-5"/>,  bg:"bg-emerald-50",  tc:"text-emerald-700" },
    { label:"Mouvements ce mois",   value:stats?.monthMovements??"-",                       icon:<Activity className="h-5 w-5"/>,   bg:"bg-violet-50",   tc:"text-violet-700" },
  ];

  return (
    <div className="-mx-4 sm:-mx-6 -mt-6 min-h-[calc(100dvh-56px)] bg-[#fafaf8] px-4 sm:px-8 pt-8 pb-28 lg:pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{background:GOLD}}>
              <Package className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-stone-900">Gestion du Stock</h1>
          </div>
          <p className="text-sm text-stone-500 pl-10">Ingrédients, produits finis et historique des mouvements.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setCmdDialog(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-all active:scale-[0.97]">
            <ShoppingCart className="h-4 w-4"/>
            Passer une commande
          </button>
          <button onClick={()=>setItemDialog({open:true})}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all active:scale-[0.97]"
            style={{background:GOLD}}>
            <Plus className="h-4 w-4"/>
            Ajouter un article
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STAT_CARDS.map(c=>(
          <div key={c.label} className={`bg-white rounded-2xl border p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow ${c.hl?"border-amber-200 ring-1 ring-amber-100":"border-stone-200"}`}>
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${c.bg} ${c.tc}`}>{c.icon}</div>
            <div className="min-w-0">
              <div className="text-2xl font-bold text-stone-900 leading-tight">{loading?<span className="text-stone-300">—</span>:c.value}</div>
              <div className="text-[11px] text-stone-500 font-medium uppercase tracking-wide mt-0.5 truncate">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert banner */}
      {!loading && alertItems.length > 0 && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5"/>
          <div>
            <p className="text-sm font-semibold text-amber-800">{alertItems.length} article{alertItems.length>1?"s":""} nécessite{alertItems.length===1?"":"nt"} votre attention</p>
            <p className="text-xs text-amber-700 mt-0.5 line-clamp-1">{alertItems.map(i=>i.name).join(" · ")}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-stone-200/50 rounded-xl mb-6 w-fit">
        {(["inventaire","mouvements","commandes"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-5 py-2 rounded-[10px] text-sm font-semibold capitalize transition-all ${tab===t?"bg-white text-stone-900 shadow-sm":"text-stone-500 hover:text-stone-700"}`}>
            {t==="inventaire"?"Inventaire":t==="mouvements"?"Historique":"Commandes"}{t==="commandes"&&tickets.length>0&&<span className="ml-1.5 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">{tickets.length}</span>}
          </button>
        ))}
      </div>

      {/* ── INVENTAIRE ─────────────────────────────────────────────────── */}
      {tab==="inventaire"&&(
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un article…" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all"/>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none"/>
              <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} className="pl-9 pr-8 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all appearance-none min-w-[180px]">
                <option value="">Toutes catégories</option>
                {usedCats.map(c=><option key={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none"/>
            </div>
          </div>

          {loading?(
            <div className="flex items-center justify-center h-48 text-stone-400"><Loader2 className="h-5 w-5 animate-spin mr-2"/>Chargement…</div>
          ):filtered.length===0?(
            <div className="flex flex-col items-center justify-center h-48 text-stone-400">
              <Package className="h-8 w-8 mb-3 text-stone-300"/>
              <p className="text-sm font-medium">{items.length===0?"Aucun article pour l'instant":"Aucun résultat"}</p>
              {items.length===0&&<button onClick={()=>setItemDialog({open:true})} className="mt-3 text-xs font-semibold px-4 py-2 rounded-xl text-white" style={{background:GOLD}}>+ Ajouter votre premier article</button>}
            </div>
          ):(
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100">
                    {["Article","Catégorie","Stock","Seuil","Statut","Coût/u",""].map(h=>(
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filtered.map((item,idx)=>(
                    <tr key={item._id} className={`hover:bg-stone-50/80 transition-colors group ${idx%2===1?"bg-stone-50/30":""}`}>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-stone-900">{item.name}</div>
                        {item.supplier&&<div className="text-[11px] text-stone-400 mt-0.5">{item.supplier}</div>}
                      </td>
                      <td className="px-5 py-3.5"><span className="text-xs px-2 py-1 rounded-lg bg-stone-100 text-stone-600 font-medium">{item.category}</span></td>
                      <td className="px-5 py-3.5">
                        <span className={`font-bold text-base ${item.quantity===0?"text-red-500":item.minThreshold>0&&item.quantity<=item.minThreshold?"text-amber-600":"text-stone-900"}`}>{fmtNum(item.quantity)}</span>
                        <span className="text-stone-400 text-xs ml-1">{item.unit}</span>
                      </td>
                      <td className="px-5 py-3.5 text-stone-500 text-sm">{item.minThreshold>0?<>{fmtNum(item.minThreshold)}<span className="text-xs ml-1">{item.unit}</span></>:<span className="text-stone-300">—</span>}</td>
                      <td className="px-5 py-3.5"><StatusBadge item={item}/></td>
                      <td className="px-5 py-3.5 text-stone-500 text-sm">{item.costPerUnit>0?<>{item.costPerUnit.toFixed(2)}<span className="text-xs ml-1">TND</span></>:<span className="text-stone-300">—</span>}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={()=>setMovDialog({open:true,item})} className="h-8 w-8 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-500 hover:text-amber-700 flex items-center justify-center transition-colors" title="Mouvement"><ArrowUpDown className="h-3.5 w-3.5"/></button>
                          <button onClick={()=>setItemDialog({open:true,item})} className="h-8 w-8 rounded-lg bg-stone-100 hover:bg-sky-100 text-stone-500 hover:text-sky-700 flex items-center justify-center transition-colors" title="Modifier"><Edit2 className="h-3.5 w-3.5"/></button>
                          <button onClick={()=>setDelDialog({open:true,item})} className="h-8 w-8 rounded-lg bg-stone-100 hover:bg-red-100 text-stone-500 hover:text-red-600 flex items-center justify-center transition-colors" title="Supprimer"><Trash2 className="h-3.5 w-3.5"/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading&&filtered.length>0&&(
            <div className="px-5 py-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-400">{filtered.length} article{filtered.length>1?"s":""}</span>
              <span className="text-xs text-stone-400">{items.filter(i=>getStatus(i)==="ok").length} OK · {items.filter(i=>getStatus(i)==="bas").length} bas · {items.filter(i=>getStatus(i)==="rupture").length} rupture</span>
            </div>
          )}
        </div>
      )}

      {/* ── MOUVEMENTS ─────────────────────────────────────────────────── */}
      {tab==="mouvements"&&(
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-3">
            <div className="relative">
              <select value={movFilter} onChange={e=>setMovFilter(e.target.value)} className="pl-4 pr-8 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300 appearance-none min-w-[160px]">
                <option value="">Tous les types</option>
                <option value="entree">Entrées</option>
                <option value="sortie">Sorties</option>
                <option value="perte">Pertes</option>
                <option value="ajustement">Corrections</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none"/>
            </div>
            <span className="text-xs text-stone-400 ml-auto">{filteredMov.length} mouvement{filteredMov.length>1?"s":""}</span>
          </div>
          {loading?(
            <div className="flex items-center justify-center h-48 text-stone-400"><Loader2 className="h-5 w-5 animate-spin mr-2"/>Chargement…</div>
          ):filteredMov.length===0?(
            <div className="flex flex-col items-center justify-center h-48 text-stone-400">
              <Activity className="h-8 w-8 mb-3 text-stone-300"/>
              <p className="text-sm font-medium">Aucun mouvement</p>
            </div>
          ):(
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100">
                    {["Article","Type","Quantité","Avant → Après","Note","Date"].map(h=>(
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filteredMov.map((m,idx)=>(
                    <tr key={m._id} className={`hover:bg-stone-50/80 transition-colors ${idx%2===1?"bg-stone-50/30":""}`}>
                      <td className="px-5 py-3.5 font-semibold text-stone-900">{m.stockItemName}</td>
                      <td className="px-5 py-3.5"><MovBadge type={m.type}/></td>
                      <td className="px-5 py-3.5">
                        <span className={`font-bold ${m.type==="entree"?"text-emerald-600":m.type==="perte"?"text-red-500":m.type==="sortie"?"text-sky-600":"text-violet-600"}`}>
                          {m.type==="entree"?"+":m.type==="sortie"||m.type==="perte"?"−":"→"}{fmtNum(m.quantity)}
                        </span>
                        <span className="text-stone-400 text-xs ml-1">{m.unit}</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-stone-500">
                        <span className="font-mono">{fmtNum(m.previousQuantity)}</span>
                        <span className="mx-1.5 text-stone-300">→</span>
                        <span className="font-mono font-semibold text-stone-700">{fmtNum(m.newQuantity)}</span>
                        <span className="ml-1 text-stone-400">{m.unit}</span>
                      </td>
                      <td className="px-5 py-3.5 text-stone-400 max-w-[160px] truncate">{m.note||<span className="text-stone-200">—</span>}</td>
                      <td className="px-5 py-3.5 text-stone-400 text-xs whitespace-nowrap">{fmtDate(m.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── COMMANDES ──────────────────────────────────────────────────── */}
      {tab==="commandes"&&(
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <span className="text-sm font-medium text-stone-500">{tickets.length} commande{tickets.length!==1?"s":""} passée{tickets.length!==1?"s":""}</span>
            <button onClick={()=>setCmdDialog(true)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all" style={{background:GOLD}}>
              <Plus className="h-3.5 w-3.5"/>Nouvelle commande
            </button>
          </div>
          {loading?(
            <div className="flex items-center justify-center h-48 text-stone-400"><Loader2 className="h-5 w-5 animate-spin mr-2"/>Chargement…</div>
          ):tickets.length===0?(
            <div className="flex flex-col items-center justify-center h-48 text-stone-400">
              <ShoppingCart className="h-8 w-8 mb-3 text-stone-300"/>
              <p className="text-sm font-medium">Aucune commande passée</p>
              <p className="text-xs text-stone-400 mt-1">Vos bons de sortie groupée apparaîtront ici.</p>
            </div>
          ):(
            <div className="divide-y divide-stone-50">
              {tickets.map(ticket=>(
                <div key={ticket._id} className="px-5 py-4 hover:bg-stone-50/80 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-stone-900 font-mono tracking-wide">{ticket.reference}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 font-semibold">
                          {ticket.items.length} article{ticket.items.length>1?"s":""}
                        </span>
                        {ticket.note&&<span className="text-xs text-stone-400 truncate max-w-[200px]">— {ticket.note}</span>}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {ticket.items.map((item,i)=>(
                          <span key={i} className="text-[11px] px-2 py-1 rounded-lg bg-stone-100 text-stone-600 font-medium">
                            {item.name} <span className="text-stone-400">−{fmtNum(item.quantity)} {item.unit}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-stone-400 whitespace-nowrap shrink-0 mt-0.5">{fmtDate(ticket.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dialogs */}
      <ItemFormDialog open={itemDialog.open} editing={itemDialog.item} onClose={()=>setItemDialog({open:false})} onSaved={refresh}/>
      <MovementDialog open={movDialog.open}  item={movDialog.item}    onClose={()=>setMovDialog({open:false})}  onSaved={refresh}/>
      <DeleteDialog   open={delDialog.open}  item={delDialog.item}    onClose={()=>setDelDialog({open:false})}  onDeleted={refresh}/>
      <CommandeDialog open={cmdDialog}        items={items}            onClose={()=>setCmdDialog(false)}         onSaved={refresh}/>
    </div>
  );
}
