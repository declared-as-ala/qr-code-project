"use client";

import { memo, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Plus, Trash2, Pencil, ImagePlus, Loader2,
  Check, X, Search, GripVertical,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from "@/components/ui/sheet";
import { uploadImageDirect } from "@/lib/upload-image";

const GOLD = "#c8a46a";

type Category = { _id: string; name: string; sortOrder?: number };
type Product = {
  _id: string; categoryId: string; name: string; description?: string;
  price: number; image?: string; badge?: string; isAvailable: boolean; sortOrder?: number;
};
const BADGES = ["", "Nouveau", "Populaire", "Promo", "Signature", "Royal", "Ambiance"];

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const inputCls = "w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all";
const labelCls = "block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5";

// ── Simple Modal ───────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, width = "max-w-sm" }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; width?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${width} border border-stone-200`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h2 className="text-base font-semibold text-stone-900">{title}</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function MenuManagerPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts]     = useState<Product[]>([]);
  const [activeCat, setActiveCat]   = useState<string | null>(null);
  const [search, setSearch]         = useState("");
  const [loading, setLoading]       = useState(true);

  const [catModal, setCatModal] = useState<{ open:boolean; mode:"add"|"rename"; cat?:Category; value:string; saving:boolean }>
    ({ open:false, mode:"add", value:"", saving:false });
  const [deleteCatModal,     setDeleteCatModal]     = useState<{ open:boolean; cat?:Category }>({ open:false });
  const [deleteProductModal, setDeleteProductModal] = useState<{ open:boolean; product?:Product }>({ open:false });
  const [editSheet,          setEditSheet]          = useState<{ open:boolean; product?:Product }>({ open:false });

  const [coverImage,    setCoverImage]    = useState<string|undefined>();
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverFileRef = useRef<HTMLInputElement|null>(null);

  useEffect(() => {
    fetch("/api/restaurants/me").then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.coverImage) setCoverImage(d.coverImage); }).catch(()=>{});
  }, []);

  async function handleUploadCover(file: File) {
    setUploadingCover(true);
    try {
      const url = await uploadImageDirect(file);
      const p = await fetch("/api/restaurants/me", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ coverImage:url }) });
      if (p.ok) { setCoverImage(url); toast.success("Couverture mise à jour"); }
      else throw new Error();
    } catch { toast.error("Échec de l'upload de la couverture"); }
    finally { setUploadingCover(false); }
  }

  const loadAll = useCallback(async () => {
    const [cRes, pRes] = await Promise.all([fetch("/api/categories"), fetch("/api/products")]);
    if (cRes.ok) {
      const cats: Category[] = await cRes.json();
      setCategories(cats);
      setActiveCat(cur => cur ?? cats[0]?._id ?? null);
    }
    if (pRes.ok) setProducts(await pRes.json());
    setLoading(false);
  }, []);
  useEffect(() => { loadAll(); }, [loadAll]);

  const deferredSearch = useDeferredValue(search);
  const filtered = useMemo(() => {
    const q = normalize(deferredSearch.trim());
    if (q) {
      return products.filter(p =>
        normalize(p.name).includes(q) || normalize(p.description ?? "").includes(q)
      );
    }
    return activeCat ? products.filter(p => p.categoryId === activeCat) : products;
  }, [products, activeCat, deferredSearch]);

  // Category ops
  async function saveCatModal() {
    const name = catModal.value.trim();
    if (!name) return;
    setCatModal(d => ({ ...d, saving:true }));
    if (catModal.mode === "add") {
      const res = await fetch("/api/categories", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ name, sortOrder:categories.length+1 }) });
      if (res.ok) { const c = await res.json(); setCategories(cs => [...cs, c]); setActiveCat(c._id); toast.success("Catégorie ajoutée"); }
      else toast.error("Erreur lors de l'ajout");
    } else if (catModal.cat) {
      const res = await fetch(`/api/categories/${catModal.cat._id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ name }) });
      if (res.ok) { setCategories(cs => cs.map(x => x._id===catModal.cat!._id ? {...x,name} : x)); toast.success("Catégorie renommée"); }
      else toast.error("Erreur lors du renommage");
    }
    setCatModal({ open:false, mode:"add", value:"", saving:false });
  }

  async function confirmDeleteCategory() {
    const c = deleteCatModal.cat; if (!c) return;
    const res = await fetch(`/api/categories/${c._id}`, { method:"DELETE" });
    if (res.ok) {
      const rem = categories.filter(x => x._id !== c._id);
      setCategories(rem);
      setProducts(ps => ps.filter(p => p.categoryId !== c._id));
      if (activeCat === c._id) setActiveCat(rem[0]?._id ?? null);
      toast.success("Catégorie supprimée");
    } else toast.error("Erreur lors de la suppression");
    setDeleteCatModal({ open:false });
  }

  // Drag-and-drop reorder
  const dragIdRef = useRef<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const reorderCategories = useCallback(async (fromId: string, toId: string) => {
    if (fromId === toId) return;
    setCategories(prev => {
      const list = [...prev];
      const fromIdx = list.findIndex(c => c._id === fromId);
      const toIdx = list.findIndex(c => c._id === toId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const [moved] = list.splice(fromIdx, 1);
      list.splice(toIdx, 0, moved);
      fetch("/api/categories/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: list.map(c => c._id) }),
      }).then(res => {
        if (!res.ok) { toast.error("Échec de l'enregistrement de l'ordre"); loadAll(); }
      });
      return list;
    });
  }, [loadAll]);

  // Product ops
  async function addProduct() {
    if (!activeCat) return toast.error("Sélectionne d'abord une catégorie");
    const res = await fetch("/api/products", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ categoryId:activeCat, name:"Nouvel article", price:0, sortOrder:products.filter(p=>p.categoryId===activeCat).length+1 }) });
    if (res.ok) { const p = await res.json(); setProducts(ps => [...ps,p]); setEditSheet({ open:true, product:p }); }
    else toast.error("Erreur lors de la création");
  }

  const patchProduct = useCallback(async (id: string, patch: Partial<Product>) => {
    setProducts(ps => ps.map(p => p._id===id ? {...p,...patch} : p));
    const res = await fetch(`/api/products/${id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify(patch) });
    if (!res.ok) { toast.error("Échec de l'enregistrement"); loadAll(); }
  }, [loadAll]);

  const openEditProduct   = useCallback((p: Product) => setEditSheet({ open:true, product:p }), []);
  const openDeleteProduct = useCallback((p: Product) => setDeleteProductModal({ open:true, product:p }), []);
  const toggleAvailable   = useCallback((id: string, v: boolean) => patchProduct(id, { isAvailable:v }), [patchProduct]);

  async function confirmDeleteProduct() {
    const p = deleteProductModal.product; if (!p) return;
    const res = await fetch(`/api/products/${p._id}`, { method:"DELETE" });
    if (res.ok) { setProducts(ps => ps.filter(x => x._id !== p._id)); toast.success("Article supprimé"); }
    else toast.error("Erreur lors de la suppression");
    setDeleteProductModal({ open:false });
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-stone-400">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm">Chargement du menu…</p>
      </div>
    );
  }

  const activeCatName = categories.find(c => c._id === activeCat)?.name;

  return (
    <div className="-mx-4 sm:-mx-6 -mt-6 min-h-[calc(100dvh-56px)] bg-[#fafaf8] px-4 sm:px-8 pt-6 pb-28 lg:pb-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Mon Menu</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {search.trim() ? `Résultats pour "${search.trim()}"` : activeCatName ?? ""} · {filtered.length} article{filtered.length!==1?"s":""}
          </p>
        </div>
        <button onClick={addProduct}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-md active:scale-[0.97] transition-all"
          style={{background:GOLD}}>
          <Plus className="h-4 w-4"/>
          <span className="hidden sm:inline">Ajouter</span>
          <span className="sm:hidden">+</span>
        </button>
      </div>

      {/* Cover image banner */}
      <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden border border-stone-200 mb-5 group shadow-sm">
        {coverImage ? (
          <Image src={coverImage} alt="Couverture" fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <button type="button" disabled={uploadingCover} onClick={()=>coverFileRef.current?.click()}
          className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold bg-white/90 hover:bg-white text-stone-800 border border-white/50 shadow-md backdrop-blur-sm transition-all active:scale-[0.97]">
          {uploadingCover ? <Loader2 className="h-3.5 w-3.5 animate-spin"/> : <ImagePlus className="h-3.5 w-3.5"/>}
          {uploadingCover ? "Upload…" : "Changer la couverture"}
        </button>
        <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-md flex items-center justify-center" style={{background:GOLD}}>
            <span className="text-white font-extrabold text-[9px] tracking-tight">COVER</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white" style={{textShadow:"0 1px 4px rgba(0,0,0,0.6)"}}>Photo de couverture</h2>
            <p className="text-[11px] text-white/70">Affichée en grand format sur l'écran d'accueil</p>
          </div>
        </div>
        <input ref={coverFileRef} type="file" accept="image/*" className="hidden"
          onChange={e=>{ const f=e.target.files?.[0]; if(f) handleUploadCover(f); e.target.value=""; }} />
      </div>

      {/* Mobile category chips */}
      <div className="lg:hidden mb-4 -mx-4 px-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{scrollbarWidth:"none"}}>
          {categories.map(c => {
            const active = activeCat === c._id;
            const count = products.filter(p => p.categoryId === c._id).length;
            return (
              <div key={c._id} className="shrink-0 flex items-center gap-1">
                <button onClick={()=>setActiveCat(c._id)}
                  className={`flex items-center gap-1.5 h-9 px-4 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${active ? "text-white border-transparent shadow-sm" : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"}`}
                  style={active ? {background:GOLD} : {}}>
                  {c.name}<span className={`text-[10px] tabular-nums ${active?"opacity-75":"text-stone-400"}`}>{count}</span>
                </button>
                {active && (
                  <>
                    <button onClick={()=>setCatModal({open:true,mode:"rename",cat:c,value:c.name,saving:false})}
                      className="h-9 w-9 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-400 hover:text-stone-700">
                      <Pencil className="h-3.5 w-3.5"/>
                    </button>
                    <button onClick={()=>setDeleteCatModal({open:true,cat:c})}
                      className="h-9 w-9 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-400 hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5"/>
                    </button>
                  </>
                )}
              </div>
            );
          })}
          <button onClick={()=>setCatModal({open:true,mode:"add",value:"",saving:false})}
            className="shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-500 hover:text-stone-900">
            <Plus className="h-4 w-4"/>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un article…"
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all"/>
        {search && (
          <button onClick={()=>setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center text-stone-400 hover:text-stone-700">
            <X className="h-3.5 w-3.5"/>
          </button>
        )}
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* Desktop category sidebar */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 self-start sticky top-20">
          <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
              <h2 className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Catégories</h2>
              <button onClick={()=>setCatModal({open:true,mode:"add",value:"",saving:false})}
                className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors">
                <Plus className="h-4 w-4"/>
              </button>
            </div>
            <div className="p-2 space-y-0.5 max-h-[60vh] overflow-y-auto">
              {categories.map(c => {
                const count = products.filter(p => p.categoryId === c._id).length;
                const active = activeCat === c._id;
                const dragOver = dragOverId === c._id;
                return (
                  <div key={c._id}
                    draggable
                    onDragStart={e=>{ dragIdRef.current = c._id; e.dataTransfer.effectAllowed = "move"; }}
                    onDragOver={e=>{ e.preventDefault(); if (dragOverId !== c._id) setDragOverId(c._id); }}
                    onDragLeave={()=>{ if (dragOverId === c._id) setDragOverId(null); }}
                    onDrop={e=>{
                      e.preventDefault();
                      const fromId = dragIdRef.current;
                      dragIdRef.current = null;
                      setDragOverId(null);
                      if (fromId) reorderCategories(fromId, c._id);
                    }}
                    onDragEnd={()=>{ dragIdRef.current = null; setDragOverId(null); }}
                    onClick={()=>setActiveCat(c._id)}
                    className={`group flex items-center gap-1 rounded-xl px-2 py-2.5 text-sm transition-all cursor-pointer border-t-2 ${dragOver ? "border-amber-400" : "border-transparent"} ${active ? "text-white shadow-sm" : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"}`}
                    style={active ? {background:GOLD} : {}}>
                    <span className={`shrink-0 cursor-grab active:cursor-grabbing p-1 -ml-1 ${active?"text-white/60":"text-stone-300"}`}>
                      <GripVertical className="h-3.5 w-3.5"/>
                    </span>
                    <span className="flex-1 truncate font-medium">{c.name}</span>
                    <span className={`text-[10px] tabular-nums mr-1 ${active?"text-white/70":"text-stone-400"}`}>{count}</span>
                    <button onClick={e=>{e.stopPropagation();setCatModal({open:true,mode:"rename",cat:c,value:c.name,saving:false});}}
                      className={`opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-opacity hover:bg-black/10 ${active?"text-white":"text-stone-400"}`}>
                      <Pencil className="h-3 w-3"/>
                    </button>
                    <button onClick={e=>{e.stopPropagation();setDeleteCatModal({open:true,cat:c});}}
                      className={`opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-opacity hover:bg-red-100 ${active?"text-white/80 hover:text-red-300":"text-stone-400 hover:text-red-500"}`}>
                      <Trash2 className="h-3 w-3"/>
                    </button>
                  </div>
                );
              })}
              {categories.length === 0 && (
                <p className="text-xs text-stone-400 px-3 py-4 text-center">Aucune catégorie.<br/>Clique sur + pour commencer.</p>
              )}
              {categories.length > 1 && (
                <p className="px-3 pt-1.5 text-[10px] text-stone-400">Glissez <GripVertical className="inline h-2.5 w-2.5 -mt-0.5"/> pour réordonner</p>
              )}
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <section className="flex-1 min-w-0">
          {categories.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-white p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-6 w-6 text-stone-400"/>
              </div>
              <p className="text-stone-800 font-semibold mb-1">Commencez par créer une catégorie</p>
              <p className="text-stone-400 text-sm mb-4">Organisez votre menu : Boissons, Plats, Desserts…</p>
              <button onClick={()=>setCatModal({open:true,mode:"add",value:"",saving:false})}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{background:GOLD}}>
                <Plus className="h-4 w-4"/> Créer une catégorie
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-white p-10 text-center">
              <p className="text-stone-400 mb-3 text-sm">{search?`Aucun résultat pour "${search}"`:"Aucun article dans cette catégorie."}</p>
              {!search && (
                <button onClick={addProduct}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{background:GOLD}}>
                  <Plus className="h-4 w-4"/> Créer le premier article
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map(p => (
                <ProductCard key={p._id} product={p}
                  onEdit={openEditProduct}
                  onDelete={openDeleteProduct}
                  onToggleAvailable={toggleAvailable} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────── */}

      {/* Add / Rename category */}
      <Modal open={catModal.open} onClose={()=>setCatModal(d=>({...d,open:false}))}
        title={catModal.mode==="add"?"Nouvelle catégorie":"Renommer la catégorie"}>
        <div className="space-y-4">
          <input autoFocus value={catModal.value} onChange={e=>setCatModal(d=>({...d,value:e.target.value}))}
            onKeyDown={e=>e.key==="Enter"&&saveCatModal()}
            placeholder="ex: Boissons, Plats, Desserts…" className={inputCls} />
          <div className="flex gap-3">
            <button onClick={()=>setCatModal(d=>({...d,open:false}))}
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50">Annuler</button>
            <button onClick={saveCatModal} disabled={!catModal.value.trim()||catModal.saving}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
              style={{background:GOLD}}>
              {catModal.saving?<Loader2 className="h-4 w-4 animate-spin"/>:<Check className="h-4 w-4"/>}
              {catModal.mode==="add"?"Ajouter":"Enregistrer"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete category */}
      <Modal open={deleteCatModal.open} onClose={()=>setDeleteCatModal({open:false})} title={`Supprimer "${deleteCatModal.cat?.name}" ?`}>
        <div className="space-y-4">
          <p className="text-sm text-stone-600">
            {(()=>{const count=products.filter(p=>p.categoryId===deleteCatModal.cat?._id).length;return count>0?`Cette catégorie contient ${count} article${count>1?"s":""}. Ils seront tous supprimés.`:"Cette action est irréversible.";})()}
          </p>
          <div className="flex gap-3">
            <button onClick={()=>setDeleteCatModal({open:false})} className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50">Annuler</button>
            <button onClick={confirmDeleteCategory} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600">Supprimer</button>
          </div>
        </div>
      </Modal>

      {/* Delete product */}
      <Modal open={deleteProductModal.open} onClose={()=>setDeleteProductModal({open:false})} title={`Supprimer "${deleteProductModal.product?.name}" ?`}>
        <div className="space-y-4">
          <p className="text-sm text-stone-600">Cette action est irréversible.</p>
          <div className="flex gap-3">
            <button onClick={()=>setDeleteProductModal({open:false})} className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50">Annuler</button>
            <button onClick={confirmDeleteProduct} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600">Supprimer</button>
          </div>
        </div>
      </Modal>

      {/* Product edit sheet */}
      {editSheet.product && (
        <ProductEditSheet key={editSheet.product._id} product={editSheet.product}
          open={editSheet.open} onClose={()=>setEditSheet({open:false})}
          onSave={patch=>{ patchProduct(editSheet.product!._id,patch); setEditSheet({open:false}); toast.success("Article enregistré"); }} />
      )}
    </div>
  );
}

// ── ProductCard ────────────────────────────────────────────────────────────────
const ProductCard = memo(function ProductCard({ product, onEdit: onEditP, onDelete: onDeleteP, onToggleAvailable: onToggleP }: {
  product: Product; onEdit:(p:Product)=>void; onDelete:(p:Product)=>void; onToggleAvailable:(id:string,v:boolean)=>void;
}) {
  const onEdit = () => onEditP(product);
  const onDelete = () => onDeleteP(product);
  const onToggleAvailable = (v: boolean) => onToggleP(product._id, v);
  return (
    <div className="group rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden hover:shadow-md hover:border-stone-300 transition-all">
      <button type="button" onClick={onEdit}
        className="relative block w-full aspect-[4/3] bg-stone-100 overflow-hidden">
        {product.image ? (
          <Image src={product.image} alt={product.name} fill sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-stone-300 gap-2">
            <ImagePlus className="h-7 w-7"/>
            <span className="text-xs text-stone-400">Ajouter une photo</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="px-3 py-1.5 rounded-lg bg-white/95 text-stone-900 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <Pencil className="h-3.5 w-3.5"/> Modifier
          </span>
        </div>
        {product.badge && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm text-white"
            style={{background:GOLD}}>{product.badge}</span>
        )}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-stone-100/80 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-white/90 text-stone-500 text-xs font-semibold uppercase tracking-wider border border-stone-200 shadow-sm">Indisponible</span>
          </div>
        )}
      </button>

      <div className="p-3.5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-stone-900 truncate leading-snug">{product.name}</p>
            {product.description && (
              <p className="text-xs text-stone-400 line-clamp-2 mt-0.5 leading-relaxed">{product.description}</p>
            )}
          </div>
          <p className="text-sm font-bold tabular-nums shrink-0" style={{color:GOLD}}>
            {product.price.toFixed(product.price%1===0?0:2)} DT
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button onClick={()=>onToggleAvailable(!product.isAvailable)} className="flex items-center gap-2 group/toggle">
            <Switch checked={product.isAvailable} onCheckedChange={onToggleAvailable} onClick={e=>e.stopPropagation()} />
            <span className="text-xs text-stone-400 group-hover/toggle:text-stone-700 transition-colors">
              {product.isAvailable?"Disponible":"Indisponible"}
            </span>
          </button>
          <div className="flex items-center gap-1">
            <button onClick={onEdit}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
              <Pencil className="h-4 w-4"/>
            </button>
            <button onClick={onDelete}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors">
              <Trash2 className="h-4 w-4"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// ── ProductEditSheet ───────────────────────────────────────────────────────────
function ProductEditSheet({ product, open, onClose, onSave }: {
  product: Product; open: boolean; onClose: ()=>void; onSave: (patch: Partial<Product>)=>void;
}) {
  const [draft, setDraft] = useState({
    name: product.name, description: product.description??"",
    price: product.price, badge: product.badge??"",
    isAvailable: product.isAvailable, image: product.image??"",
  });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement|null>(null);

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const url = await uploadImageDirect(file);
      setDraft(d => ({...d, image:url}));
      toast.success("Photo mise à jour");
    } catch { toast.error("Échec de l'upload"); }
    finally { setUploading(false); }
  }

  function save() {
    onSave({
      name: draft.name.trim()||product.name,
      description: draft.description.trim(),
      price: Number(draft.price)||0,
      badge: draft.badge,
      isAvailable: draft.isAvailable,
      ...(draft.image!==(product.image??"")&&{ image: draft.image||undefined }),
    });
  }

  return (
    <Sheet open={open} onOpenChange={o=>!o&&onClose()}>
      <SheetContent side="bottom"
        className="bg-white border-t border-stone-200 rounded-t-3xl p-0 flex flex-col"
        style={{maxHeight:"93dvh"}} showCloseButton={false}>
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-stone-200"/>
        </div>

        <SheetHeader className="px-5 pt-1 pb-4 border-b border-stone-100 shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-stone-900 text-base">
              {product.name==="Nouvel article"?"Nouvel article":"Modifier l'article"}
            </SheetTitle>
            <button onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-400 hover:text-stone-700">
              <X className="h-4 w-4"/>
            </button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Photo */}
          <div>
            <label className={labelCls}>Photo</label>
            <button type="button" onClick={()=>fileRef.current?.click()} disabled={uploading}
              className="relative w-full rounded-2xl bg-stone-50 border-2 border-dashed border-stone-200 overflow-hidden hover:border-amber-300 transition-colors group"
              style={{aspectRatio:"16/7"}}>
              {draft.image ? (
                <Image src={draft.image} alt={draft.name} fill className="object-cover" unoptimized sizes="600px"/>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone-300">
                  <ImagePlus className="h-8 w-8"/>
                  <span className="text-sm text-stone-400">Appuyer pour ajouter une photo</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                {uploading ? <Loader2 className="h-6 w-6 animate-spin text-white"/> :
                  <span className="px-3 py-1.5 rounded-xl bg-white/95 text-stone-900 text-sm font-semibold flex items-center gap-1.5 shadow-sm">
                    <ImagePlus className="h-4 w-4"/> {draft.image?"Changer la photo":"Ajouter une photo"}
                  </span>}
              </div>
              {uploading && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-white"/></div>}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e=>{ const f=e.target.files?.[0]; if(f) uploadImage(f); e.target.value=""; }} />
          </div>

          {/* Name */}
          <div>
            <label className={labelCls}>Nom *</label>
            <input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}
              className={`${inputCls} h-12 text-base`} placeholder="Nom de l'article" autoComplete="off"/>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea value={draft.description} onChange={e=>setDraft({...draft,description:e.target.value})}
              rows={3} className={`resize-none ${inputCls}`} placeholder="Description de l'article (optionnel)"/>
          </div>

          {/* Price + Badge */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Prix (DT)</label>
              <input type="number" step="0.5" min="0" value={draft.price}
                onChange={e=>setDraft({...draft,price:Number(e.target.value)})}
                className={`${inputCls} h-12 text-base`} inputMode="decimal"/>
            </div>
            <div>
              <label className={labelCls}>Badge</label>
              <select value={draft.badge} onChange={e=>setDraft({...draft,badge:e.target.value})}
                className={`${inputCls} h-12`}>
                {BADGES.map(b=><option key={b||"none"} value={b}>{b||"Sans badge"}</option>)}
              </select>
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div>
              <p className="text-sm font-semibold text-stone-900">Disponible</p>
              <p className="text-xs text-stone-400 mt-0.5">Visible sur le menu public</p>
            </div>
            <Switch checked={draft.isAvailable} onCheckedChange={v=>setDraft({...draft,isAvailable:v})}/>
          </div>
        </div>

        <SheetFooter className="px-5 py-4 border-t border-stone-100 shrink-0 flex-row gap-3">
          <button onClick={onClose}
            className="flex-1 h-12 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors">
            Annuler
          </button>
          <button onClick={save}
            className="flex-1 h-12 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
            style={{background:GOLD}}>
            <Check className="h-4 w-4"/> Enregistrer
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
