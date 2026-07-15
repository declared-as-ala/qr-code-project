"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  ShoppingBag, Clock, CheckCircle, ChefHat, Bell, BellRing,
  Package, XCircle, Trash2, RefreshCw,
} from "lucide-react";

type OrderItem = {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  notes?: string;
};

type Order = {
  _id: string;
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";
  notes?: string;
  createdAt: string;
};

const GOLD = "#c8a46a";

const STATUS_CONFIG = {
  pending:    { label: "En attente",     icon: Clock,        bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200", dot: "bg-amber-400" },
  confirmed:  { label: "Confirmée",      icon: CheckCircle,  bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-200",  dot: "bg-blue-400" },
  preparing:  { label: "En préparation", icon: ChefHat,      bg: "bg-violet-50",  text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-400" },
  ready:      { label: "Prête",          icon: Package,      bg: "bg-emerald-50", text: "text-emerald-700",border: "border-emerald-200",dot: "bg-emerald-400" },
  delivered:  { label: "Livrée",         icon: CheckCircle,  bg: "bg-stone-50",   text: "text-stone-500",  border: "border-stone-200",  dot: "bg-stone-400" },
  cancelled:  { label: "Annulée",        icon: XCircle,      bg: "bg-red-50",     text: "text-red-600",    border: "border-red-200",    dot: "bg-red-400" },
};

const STATUS_ORDER: Order["status"][] = [
  "pending", "confirmed", "preparing", "ready", "delivered", "cancelled",
];

const TABS = [
  { key: "all",       label: "Toutes" },
  { key: "pending",   label: "En attente" },
  { key: "confirmed", label: "Confirmées" },
  { key: "preparing", label: "En prép." },
  { key: "ready",     label: "Prêtes" },
  { key: "delivered", label: "Livrées" },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `il y a ${hrs}h`;
  return new Date(dateStr).toLocaleDateString("fr-TN", { day: "numeric", month: "short" });
}

export default function AfterPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [newAlert, setNewAlert] = useState(false);
  const lastCount = useRef(0);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const r = await fetch("/api/orders");
      if (!r.ok) return;
      const data = await r.json();
      const fresh: Order[] = data.orders || [];
      const pendingCount = fresh.filter(o => o.status === "pending").length;
      if (pendingCount > lastCount.current && lastCount.current >= 0) {
        setNewAlert(true);
        setTimeout(() => setNewAlert(false), 4000);
      }
      lastCount.current = pendingCount;
      setOrders(fresh);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => fetchOrders(true), 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: Order["status"]) => {
    setUpdating(orderId);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    } finally {
      setUpdating(null);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Supprimer cette commande ?")) return;
    await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
    setOrders(prev => prev.filter(o => o._id !== orderId));
  };

  const filtered = tab === "all" ? orders : orders.filter(o => o.status === tab);
  const pendingCount = orders.filter(o => o.status === "pending").length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">After</h1>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                style={{ background: GOLD }}>
                {newAlert ? <BellRing className="h-3 w-3" /> : <Bell className="h-3 w-3" />}
                {pendingCount} nouvelle{pendingCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="text-sm text-stone-400">Commandes digitales · mise à jour automatique toutes les 5s</p>
        </div>
        <button onClick={() => fetchOrders()} className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors">
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "En attente", val: orders.filter(o => o.status === "pending").length, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "En préparation", val: orders.filter(o => o.status === "preparing" || o.status === "confirmed").length, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Prêtes", val: orders.filter(o => o.status === "ready").length, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total aujourd'hui", val: orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length, color: "text-stone-700", bg: "bg-stone-50" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border border-stone-100 ${s.bg} p-4`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-xs text-stone-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {TABS.map(t => {
          const count = t.key === "all" ? orders.length : orders.filter(o => o.status === t.key).length;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`shrink-0 flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${tab === t.key ? "bg-stone-900 text-white" : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"}`}>
              {t.label}
              {count > 0 && (
                <span className={`text-[11px] rounded-full px-1.5 py-0.5 font-bold leading-none ${tab === t.key ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-stone-400">
          <RefreshCw className="h-5 w-5 animate-spin mr-2" />
          Chargement...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <ShoppingBag className="h-10 w-10 mb-3 opacity-30" />
          <p className="font-semibold">Aucune commande</p>
          <p className="text-sm mt-1">Les nouvelles commandes apparaîtront ici</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(order => {
            const cfg = STATUS_CONFIG[order.status];
            const Icon = cfg.icon;
            return (
              <div key={order._id}
                className={`bg-white rounded-2xl border ${cfg.border} p-5 flex flex-col gap-4 ${order.status === "pending" ? "ring-2 ring-amber-300/40" : ""}`}>

                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {order.tableNumber && (
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700">
                          Table {order.tableNumber}
                        </span>
                      )}
                      {order.customerName && (
                        <span className="text-xs text-stone-500">{order.customerName}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400">{timeAgo(order.createdAt)}</p>
                  </div>
                  <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-1.5">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-stone-700">
                        <span className="font-semibold text-stone-900">{item.quantity}×</span>{" "}
                        {item.productName}
                      </span>
                      <span className="font-bold text-stone-900 shrink-0 ml-2">
                        {(item.price * item.quantity).toFixed(2)} DT
                      </span>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {order.notes && (
                  <p className="text-xs text-stone-500 bg-stone-50 rounded-lg px-3 py-2 italic">
                    {order.notes}
                  </p>
                )}

                {/* Total */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-sm font-semibold text-stone-500">Total</span>
                  <span className="text-lg font-black text-stone-900">{order.totalAmount.toFixed(2)} DT</span>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {order.status !== "delivered" && order.status !== "cancelled" && (
                    <div className="flex gap-2">
                      {/* Next status button */}
                      {(() => {
                        const idx = STATUS_ORDER.indexOf(order.status);
                        const next = idx >= 0 && idx < STATUS_ORDER.length - 2 ? STATUS_ORDER[idx + 1] : null;
                        if (!next) return null;
                        const nextCfg = STATUS_CONFIG[next];
                        const NextIcon = nextCfg.icon;
                        return (
                          <button
                            onClick={() => updateStatus(order._id, next)}
                            disabled={updating === order._id}
                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-50"
                            style={{ background: GOLD }}>
                            <NextIcon className="h-4 w-4" />
                            {nextCfg.label}
                          </button>
                        );
                      })()}
                      <button
                        onClick={() => updateStatus(order._id, "cancelled")}
                        disabled={updating === order._id}
                        className="rounded-xl px-3 py-2.5 text-sm font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  {(order.status === "delivered" || order.status === "cancelled") && (
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="flex items-center justify-center gap-2 w-full rounded-xl py-2 text-xs font-semibold text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors border border-stone-100">
                      <Trash2 className="h-3.5 w-3.5" />
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
