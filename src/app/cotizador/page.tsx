"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

type Moneda = "MXN" | "USD" | "EUR";
type TipoItem = "normal" | "descuento" | "adicional";
type Estado = "Borrador" | "Emitido" | "Pago pendiente" | "Pagado" | "Cancelado";

interface Item {
  id: string;
  concepto: string;
  nota: string;
  monto: number;
  tipo: TipoItem;
  tag: string;
}

interface Pago {
  id: string;
  descripcion: string;
  fecha: string;
  monto: number;
}

interface Cotizacion {
  id: string;
  folio: string;
  cliente: string;
  moneda: Moneda;
  fechaEmision: string;
  proyecto: string;
  estado: Estado;
  items: Item[];
  pagos: Pago[];
  notaFinal: string;
  createdAt: number;
  updatedAt: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LS_KEY = "ql_cotizaciones_v1";

const ESTADO_STYLE: Record<Estado, string> = {
  Borrador:         "text-white/40 border-white/15 bg-white/5",
  Emitido:          "text-[#4d7fff] border-[rgba(26,79,255,0.35)] bg-[rgba(26,79,255,0.12)]",
  "Pago pendiente": "text-[#fbbf24] border-[rgba(251,191,36,0.35)] bg-[rgba(251,191,36,0.12)]",
  Pagado:           "text-[#34d399] border-[rgba(52,211,153,0.35)] bg-[rgba(52,211,153,0.12)]",
  Cancelado:        "text-[#fb7185] border-[rgba(251,113,133,0.35)] bg-[rgba(251,113,133,0.12)]",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);
}

function fmt(n: number, moneda: Moneda) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency", currency: moneda, minimumFractionDigits: 2,
  }).format(n);
}

function todayStr() {
  return new Date().toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric",
  }).toUpperCase().replace(".", "");
}

function loadAll(): Cotizacion[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}

function saveAll(list: Cotizacion[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

function encodeQ(c: Cotizacion) {
  return btoa(encodeURIComponent(JSON.stringify(c)));
}

function decodeQ(s: string): Cotizacion | null {
  try { return JSON.parse(decodeURIComponent(atob(s))); } catch { return null; }
}

function nextFolio(list: Cotizacion[]) {
  const year = new Date().getFullYear();
  const nums = list.map(c => {
    const m = c.folio.match(/EDC-\d{4}-(\d+)/);
    return m ? parseInt(m[1]) : 0;
  }).filter(Boolean);
  const n = nums.length ? Math.max(...nums) + 1 : 1;
  return `EDC-${year}-${String(n).padStart(3, "0")}`;
}

function makeItem(tipo: TipoItem = "normal"): Item {
  return {
    id: uid(), concepto: "", nota: "", monto: 0, tipo,
    tag: tipo === "descuento" ? "DESC" : tipo === "adicional" ? "ADICIONAL" : "",
  };
}

function makePago(): Pago {
  return { id: uid(), descripcion: "Abono", fecha: todayStr(), monto: 0 };
}

function makeCotizacion(list: Cotizacion[]): Cotizacion {
  const now = Date.now();
  return {
    id: uid(), folio: nextFolio(list),
    cliente: "", moneda: "MXN", fechaEmision: todayStr(),
    proyecto: "", estado: "Borrador",
    items: [makeItem("normal")],
    pagos: [],
    notaFinal: "Favor de liquidar el saldo a la brevedad. Contáctanos directamente.",
    createdAt: now, updatedAt: now,
  };
}

function totals(c: Cotizacion) {
  const firstAdic = c.items.findIndex(i => i.tipo === "adicional");
  const base = firstAdic >= 0 ? c.items.slice(0, firstAdic) : c.items;
  const adic = firstAdic >= 0 ? c.items.slice(firstAdic) : [];
  const subtotal = base.reduce((s, i) => s + (i.tipo === "descuento" ? -i.monto : i.monto), 0);
  const total = c.items.reduce((s, i) => s + (i.tipo === "descuento" ? -i.monto : i.monto), 0);
  const pagado = c.pagos.reduce((s, p) => s + p.monto, 0);
  return { base, adic, subtotal, total, pagado, saldo: total - pagado, hasAdic: adic.length > 0 };
}

// ─── Preview (the actual quotation document) ──────────────────────────────────

function Preview({ c, forPrint = false }: { c: Cotizacion; forPrint?: boolean }) {
  const t = totals(c);
  const hasSubtotal = t.hasAdic;

  return (
    <div
      id="cotizacion-preview"
      className={`bg-[#080d14] text-white font-[family-name:var(--font-barlow)] ${forPrint ? "w-full" : "rounded-xl border border-white/5 overflow-hidden"}`}
      style={{ fontFamily: "var(--font-barlow, sans-serif)" }}
    >
      {/* Header */}
      <div className="bg-[#0d1520] border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/assets/logo-mark.svg" width={32} height={32} alt="Quijote Labs" className="shrink-0" />
          <div>
            <div className="font-[family-name:var(--font-bebas)] text-xl tracking-widest leading-none">QUIJOTE</div>
            <div className="text-[9px] font-mono tracking-[0.25em] text-white/30 uppercase">· LABS ·</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider text-[#fbbf24]">
            {c.folio || "#EDC-0000-000"}
          </div>
          <div className="text-[9px] font-mono tracking-[0.2em] text-white/30 uppercase">Estado</div>
          <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase border ${ESTADO_STYLE[c.estado]}`}>
            {c.estado}
          </span>
        </div>
      </div>

      {/* Meta row */}
      <div className="border-b border-white/5 px-6 py-3 grid grid-cols-4 gap-4 bg-[#0a1219]">
        {[
          { label: "Emitido por", val: "Quijote Labs" },
          { label: "Cliente",     val: c.cliente || "—" },
          { label: "Moneda",      val: c.moneda },
          { label: "Fecha emisión", val: c.fechaEmision || "—" },
        ].map(f => (
          <div key={f.label}>
            <div className="text-[8px] font-mono tracking-[0.15em] text-white/25 uppercase mb-0.5">{f.label}</div>
            <div className="text-sm font-medium truncate">{f.val}</div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="grid grid-cols-[1fr_280px]">
        {/* Left: desglose */}
        <div className="border-r border-white/5 p-6">
          <div className="text-[9px] font-mono tracking-[0.15em] text-white/25 uppercase mb-3">Desglose del Proyecto</div>

          {/* Project title */}
          <div className="border-l-2 border-[#1a4fff] pl-3 mb-5">
            <div className="text-base font-bold">{c.proyecto || "Sin título"}</div>
          </div>

          {/* Items header */}
          <div className="grid grid-cols-[1fr_auto] text-[8px] font-mono tracking-[0.12em] text-white/20 uppercase mb-2 px-0">
            <span>Concepto</span>
            <span>Monto</span>
          </div>

          <div className="space-y-2.5">
            {/* Base items */}
            {t.base.map(item => (
              <div key={item.id} className="grid grid-cols-[1fr_auto] gap-4 items-start">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {item.concepto || "—"}
                    {item.tag && (
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border tracking-wider ${
                        item.tipo === "descuento"
                          ? "text-[#fbbf24] border-[rgba(251,191,36,0.4)] bg-[rgba(251,191,36,0.1)]"
                          : "text-[#4d7fff] border-[rgba(26,79,255,0.4)] bg-[rgba(26,79,255,0.1)]"
                      }`}>
                        {item.tag}
                      </span>
                    )}
                  </div>
                  {item.nota && <div className="text-[11px] text-white/35 mt-0.5">{item.nota}</div>}
                </div>
                <div className={`text-sm font-mono font-medium whitespace-nowrap ${item.tipo === "descuento" ? "text-[#fbbf24]" : ""}`}>
                  {item.tipo === "descuento" ? "- " : ""}{fmt(item.monto, c.moneda)}
                </div>
              </div>
            ))}

            {/* Subtotal line */}
            {hasSubtotal && (
              <div className="grid grid-cols-[1fr_auto] gap-4 items-center border-t border-white/5 pt-2 mt-1">
                <div className="text-xs font-semibold text-white/50 tracking-wider uppercase">Subtotal ajustado</div>
                <div className="text-sm font-mono font-bold text-white/70">{fmt(t.subtotal, c.moneda)}</div>
              </div>
            )}

            {/* Adicional items */}
            {t.adic.map(item => (
              <div key={item.id} className="grid grid-cols-[1fr_auto] gap-4 items-start">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {item.concepto || "—"}
                    {item.tag && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border tracking-wider text-[#60a5fa] border-[rgba(96,165,250,0.4)] bg-[rgba(96,165,250,0.1)]">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  {item.nota && <div className="text-[11px] text-white/35 mt-0.5">{item.nota}</div>}
                </div>
                <div className="text-sm font-mono font-medium whitespace-nowrap">
                  {fmt(item.monto, c.moneda)}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="grid grid-cols-[1fr_auto] gap-4 items-center border-t border-white/10 mt-4 pt-3">
            <div className="text-[9px] font-mono tracking-[0.15em] text-white/30 uppercase">Total del Proyecto</div>
            <div className="text-base font-mono font-bold">{fmt(t.total, c.moneda)}</div>
          </div>
        </div>

        {/* Right: resumen financiero */}
        <div className="p-6 bg-[#0a1219]">
          <div className="text-[9px] font-mono tracking-[0.15em] text-white/25 uppercase mb-3">Resumen Financiero</div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-white/35 uppercase tracking-wider font-mono">Total del proyecto</span>
            <span className="text-sm font-mono font-bold">{fmt(t.total, c.moneda)}</span>
          </div>

          {c.pagos.length > 0 && (
            <>
              <div className="text-[9px] font-mono tracking-[0.12em] text-white/20 uppercase mb-2">Historial de pagos</div>
              <div className="space-y-1.5 mb-3">
                {c.pagos.map(p => (
                  <div key={p.id} className="flex items-center justify-between text-xs">
                    <span className="text-white/50">{p.descripcion}{p.fecha ? ` · ${p.fecha}` : ""}</span>
                    <span className="font-mono text-[#34d399]">- {fmt(p.monto, c.moneda)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-xs border-t border-white/5 pt-1.5 mt-1">
                  <span className="text-white/30 uppercase tracking-wider font-mono text-[9px]">Total pagado</span>
                  <span className="font-mono text-[#34d399] font-medium">- {fmt(t.pagado, c.moneda)}</span>
                </div>
              </div>
            </>
          )}

          {/* Saldo pendiente */}
          <div className={`rounded-lg p-4 mt-2 ${t.saldo <= 0 ? "bg-[rgba(52,211,153,0.08)] border border-[rgba(52,211,153,0.2)]" : "bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.15)]"}`}>
            <div className="text-[9px] font-mono tracking-[0.15em] uppercase mb-1 text-white/30">
              {t.saldo <= 0 ? "Saldo" : "Saldo pendiente"}
            </div>
            <div className={`font-[family-name:var(--font-bebas)] text-3xl tracking-wider ${t.saldo <= 0 ? "text-[#34d399]" : "text-[#fbbf24]"}`}>
              {fmt(Math.abs(t.saldo), c.moneda)}
            </div>
            <div className="text-[9px] font-mono text-white/25 mt-0.5 uppercase tracking-wider">
              {c.moneda} · {c.moneda === "MXN" ? "Pesos Mexicanos" : c.moneda === "USD" ? "Dólares Americanos" : "Euros"}
            </div>
          </div>

          {c.notaFinal && (
            <div className="mt-4 p-3 rounded border border-white/5 bg-white/[0.02]">
              <p className="text-[11px] text-white/35 leading-relaxed">{c.notaFinal}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-6 py-3 flex items-center justify-between bg-[#0a1219]">
        <div className="text-[9px] font-mono text-white/20">
          Ref. {c.folio} · quijotelabs.com · Mérida, Yucatan, México
        </div>
        <div className="text-[9px] font-mono tracking-wider uppercase">
          <span className="text-white/40">CONVERTIMOS CAOS</span>
          <span className="text-[#1a4fff] ml-1">EN SISTEMA.</span>
        </div>
      </div>
    </div>
  );
}

// ─── Editor form ──────────────────────────────────────────────────────────────

function Editor({
  c, onChange, onSave, onBack, onPrint, onShare, saved,
}: {
  c: Cotizacion;
  onChange: (c: Cotizacion) => void;
  onSave: () => void;
  onBack: () => void;
  onPrint: () => void;
  onShare: () => void;
  saved: boolean;
}) {
  const set = (patch: Partial<Cotizacion>) => onChange({ ...c, ...patch, updatedAt: Date.now() });
  const setItem = (id: string, patch: Partial<Item>) =>
    set({ items: c.items.map(i => i.id === id ? { ...i, ...patch } : i) });
  const setPago = (id: string, patch: Partial<Pago>) =>
    set({ pagos: c.pagos.map(p => p.id === id ? { ...p, ...patch } : p) });
  const removeItem = (id: string) => set({ items: c.items.filter(i => i.id !== id) });
  const removePago = (id: string) => set({ pagos: c.pagos.filter(p => p.id !== id) });

  const inputCls = "w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent/40 transition-colors";
  const labelCls = "block text-[10px] font-mono tracking-wider uppercase text-white/30 mb-1";

  return (
    <div className="grid lg:grid-cols-[420px_1fr] gap-6 items-start">
      {/* ── Form panel ── */}
      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-mono text-white/40 hover:text-white/70 transition-colors">
            ← Volver
          </button>
          <div className="flex items-center gap-2">
            <button onClick={onShare} className="px-3 py-1.5 text-xs font-mono border border-white/10 rounded-lg text-white/50 hover:border-white/20 hover:text-white/70 transition-colors">
              Copiar enlace
            </button>
            <button onClick={onPrint} className="px-3 py-1.5 text-xs font-mono border border-white/10 rounded-lg text-white/50 hover:border-white/20 hover:text-white/70 transition-colors">
              Exportar PDF
            </button>
            <button onClick={onSave} className="px-4 py-1.5 text-xs font-mono bg-accent hover:bg-accent-light text-white rounded-lg transition-colors">
              {saved ? "✓ Guardado" : "Guardar"}
            </button>
          </div>
        </div>

        {/* Header fields */}
        <div className="border border-white/5 bg-surface rounded-xl p-4 space-y-3">
          <div className="text-[10px] font-mono tracking-wider uppercase text-white/25 mb-1">Encabezado</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Folio</label>
              <input className={inputCls} value={c.folio} onChange={e => set({ folio: e.target.value })} placeholder="EDC-2026-001" />
            </div>
            <div>
              <label className={labelCls}>Estado</label>
              <select className={inputCls} value={c.estado} onChange={e => set({ estado: e.target.value as Estado })}>
                {(["Borrador","Emitido","Pago pendiente","Pagado","Cancelado"] as Estado[]).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Cliente</label>
            <input className={inputCls} value={c.cliente} onChange={e => set({ cliente: e.target.value })} placeholder="Nombre del cliente" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Moneda</label>
              <select className={inputCls} value={c.moneda} onChange={e => set({ moneda: e.target.value as Moneda })}>
                <option value="MXN">MXN — Pesos</option>
                <option value="USD">USD — Dólares</option>
                <option value="EUR">EUR — Euros</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Fecha emisión</label>
              <input className={inputCls} value={c.fechaEmision} onChange={e => set({ fechaEmision: e.target.value })} placeholder="06 ABR 2026" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Proyecto / Título</label>
            <input className={inputCls} value={c.proyecto} onChange={e => set({ proyecto: e.target.value })} placeholder="Desarrollo Web - Sitio Corporativo" />
          </div>
        </div>

        {/* Line items */}
        <div className="border border-white/5 bg-surface rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono tracking-wider uppercase text-white/25">Conceptos</span>
          </div>
          <div className="space-y-3">
            {c.items.map((item, idx) => (
              <div key={item.id} className="border border-white/5 rounded-lg p-3 bg-surface-light space-y-2">
                <div className="flex items-center gap-2">
                  <select
                    className="bg-surface border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white/50 focus:outline-none"
                    value={item.tipo}
                    onChange={e => {
                      const tipo = e.target.value as TipoItem;
                      const tag = tipo === "descuento" ? "DESC" : tipo === "adicional" ? "ADICIONAL" : "";
                      setItem(item.id, { tipo, tag });
                    }}
                  >
                    <option value="normal">Normal</option>
                    <option value="descuento">Descuento</option>
                    <option value="adicional">Adicional</option>
                  </select>
                  <input
                    className="flex-1 bg-transparent border-b border-white/10 px-1 py-0.5 text-xs font-mono text-white/50 placeholder:text-white/20 focus:outline-none focus:border-accent/40"
                    value={item.tag}
                    onChange={e => setItem(item.id, { tag: e.target.value })}
                    placeholder="Etiqueta (ej: F&F)"
                  />
                  <button onClick={() => removeItem(item.id)} className="text-white/20 hover:text-[#fb7185] transition-colors text-xs">✕</button>
                </div>
                <input
                  className={inputCls}
                  value={item.concepto}
                  onChange={e => setItem(item.id, { concepto: e.target.value })}
                  placeholder="Concepto"
                />
                <div className="grid grid-cols-[1fr_120px] gap-2">
                  <input
                    className={inputCls}
                    value={item.nota}
                    onChange={e => setItem(item.id, { nota: e.target.value })}
                    placeholder="Nota (opcional)"
                  />
                  <input
                    type="number"
                    className={inputCls}
                    value={item.monto || ""}
                    onChange={e => setItem(item.id, { monto: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            {(["normal","descuento","adicional"] as TipoItem[]).map(t => (
              <button
                key={t}
                onClick={() => set({ items: [...c.items, makeItem(t)] })}
                className="flex-1 py-1.5 text-[10px] font-mono border border-white/5 rounded text-white/30 hover:border-accent/30 hover:text-white/60 transition-colors"
              >
                + {t}
              </button>
            ))}
          </div>
        </div>

        {/* Payments */}
        <div className="border border-white/5 bg-surface rounded-xl p-4">
          <div className="text-[10px] font-mono tracking-wider uppercase text-white/25 mb-3">Historial de pagos</div>
          {c.pagos.length === 0 && (
            <p className="text-xs text-white/20 font-mono mb-3">Sin pagos registrados.</p>
          )}
          <div className="space-y-2">
            {c.pagos.map(p => (
              <div key={p.id} className="border border-white/5 rounded-lg p-3 bg-surface-light grid grid-cols-[1fr_1fr_120px_auto] gap-2 items-center">
                <input className={inputCls} value={p.descripcion} onChange={e => setPago(p.id, { descripcion: e.target.value })} placeholder="Descripción" />
                <input className={inputCls} value={p.fecha} onChange={e => setPago(p.id, { fecha: e.target.value })} placeholder="06 ABR 2026" />
                <input type="number" className={inputCls} value={p.monto || ""} onChange={e => setPago(p.id, { monto: parseFloat(e.target.value) || 0 })} placeholder="0.00" />
                <button onClick={() => removePago(p.id)} className="text-white/20 hover:text-[#fb7185] transition-colors text-xs">✕</button>
              </div>
            ))}
          </div>
          <button
            onClick={() => set({ pagos: [...c.pagos, makePago()] })}
            className="mt-2 w-full py-1.5 text-[10px] font-mono border border-white/5 rounded text-white/30 hover:border-accent/30 hover:text-white/60 transition-colors"
          >
            + Agregar pago
          </button>
        </div>

        {/* Nota final */}
        <div className="border border-white/5 bg-surface rounded-xl p-4">
          <label className={labelCls}>Nota final</label>
          <textarea
            rows={2}
            className={inputCls + " resize-none"}
            value={c.notaFinal}
            onChange={e => set({ notaFinal: e.target.value })}
            placeholder="Mensaje al cliente..."
          />
        </div>
      </div>

      {/* ── Preview panel ── */}
      <div className="sticky top-24">
        <div className="text-[10px] font-mono tracking-wider uppercase text-white/20 mb-2">Vista previa</div>
        <Preview c={c} />
      </div>
    </div>
  );
}

// ─── Print overlay ────────────────────────────────────────────────────────────

function PrintView({ c, onClose }: { c: Cotizacion; onClose: () => void }) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
      <div className="no-print flex items-center justify-between px-6 py-3 bg-[#080d14] border-b border-white/5 shrink-0">
        <span className="text-xs font-mono text-white/40">Vista de impresión · ESC para cerrar</span>
        <div className="flex gap-3">
          <button onClick={onClose} className="text-xs font-mono text-white/40 hover:text-white/70 transition-colors">✕ Cerrar</button>
          <button onClick={() => window.print()} className="px-4 py-1.5 text-xs font-mono bg-accent hover:bg-accent-light text-white rounded-lg transition-colors">
            Imprimir / Guardar PDF
          </button>
        </div>
      </div>
      <div className="overflow-auto flex-1 p-8 flex justify-center">
        <div className="w-full max-w-[900px]">
          <Preview c={c} />
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type View = "list" | "editor";

export default function CotizadorPage() {
  const [list, setList] = useState<Cotizacion[]>([]);
  const [view, setView] = useState<View>("list");
  const [current, setCurrent] = useState<Cotizacion | null>(null);
  const [saved, setSaved] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [toast, setToast] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  // Load from localStorage + handle ?q= param
  useEffect(() => {
    const all = loadAll();
    setList(all);
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      const decoded = decodeQ(q);
      if (decoded) {
        setCurrent(decoded);
        setView("editor");
        setSaved(false);
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const openNew = () => {
    const c = makeCotizacion(list);
    setCurrent(c);
    setView("editor");
    setSaved(false);
    window.history.pushState({}, "", "/cotizador");
  };

  const openExisting = (c: Cotizacion) => {
    setCurrent(c);
    setView("editor");
    setSaved(true);
    window.history.pushState({}, "", "/cotizador");
  };

  const handleSave = useCallback(() => {
    if (!current) return;
    const updated = list.some(x => x.id === current.id)
      ? list.map(x => x.id === current.id ? current : x)
      : [...list, current];
    setList(updated);
    saveAll(updated);
    setSaved(true);
    showToast("Cotización guardada");
  }, [current, list]);

  const handleDelete = (id: string) => {
    const updated = list.filter(x => x.id !== id);
    setList(updated);
    saveAll(updated);
  };

  const handleShare = useCallback(() => {
    if (!current) return;
    const url = `${window.location.origin}/cotizador?q=${encodeQ(current)}`;
    navigator.clipboard.writeText(url).then(() => showToast("Enlace copiado al portapapeles"));
  }, [current]);

  const handleExportJSON = () => {
    if (!current) return;
    const blob = new Blob([JSON.stringify(current, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${current.folio}.json`;
    a.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const c = JSON.parse(ev.target?.result as string) as Cotizacion;
        setCurrent(c);
        setView("editor");
        setSaved(false);
        showToast(`Cargado: ${c.folio}`);
      } catch { showToast("Error al leer el archivo"); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleDuplicar = (c: Cotizacion) => {
    const dup = { ...c, id: uid(), folio: nextFolio(list), createdAt: Date.now(), updatedAt: Date.now() };
    setCurrent(dup);
    setView("editor");
    setSaved(false);
  };

  return (
    <>
      {/* Print CSS */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #cotizacion-preview, #cotizacion-preview * { visibility: visible !important; }
          #cotizacion-preview { position: fixed !important; top: 0; left: 0; width: 100vw !important; }
          .no-print { display: none !important; }
          @page { margin: 0; size: A4 landscape; }
        }
      `}</style>

      {/* Print overlay */}
      {printing && current && <PrintView c={current} onClose={() => setPrinting(false)} />}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-surface-light border border-white/10 rounded-xl text-xs font-mono text-white/70 shadow-xl">
          {toast}
        </div>
      )}

      <div className="min-h-screen flex flex-col no-print">
        <Navbar />

        <main className="flex-1 pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">

            {view === "list" && (
              <>
                {/* Header */}
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono tracking-wider uppercase text-white border border-accent/30 rounded-full bg-accent/10 mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
                      Panel interno
                    </div>
                    <h1 className="font-[family-name:var(--font-bebas)] text-5xl sm:text-6xl tracking-wide leading-none">
                      Cotizaciones
                    </h1>
                    <p className="text-muted text-sm mt-2 font-mono">
                      {list.length} cotización{list.length !== 1 ? "es" : ""} guardada{list.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImportJSON} />
                    <button
                      onClick={() => importRef.current?.click()}
                      className="px-4 py-2 text-xs font-mono border border-white/10 rounded-xl text-white/40 hover:border-white/20 hover:text-white/60 transition-colors"
                    >
                      Importar JSON
                    </button>
                    <button
                      onClick={openNew}
                      className="px-6 py-2.5 bg-accent hover:bg-accent-light text-white text-sm font-mono rounded-xl transition-colors"
                    >
                      + Nueva cotización
                    </button>
                  </div>
                </div>

                {/* Empty state */}
                {list.length === 0 && (
                  <div className="border border-white/5 bg-surface rounded-xl p-16 text-center">
                    <div className="text-4xl mb-4 font-[family-name:var(--font-bebas)] tracking-wider text-white/10">SIN COTIZACIONES</div>
                    <p className="text-muted text-sm font-mono mb-6">Crea tu primera cotización o importa un JSON existente.</p>
                    <button onClick={openNew} className="px-6 py-2.5 bg-accent hover:bg-accent-light text-white text-sm font-mono rounded-xl transition-colors">
                      + Nueva cotización
                    </button>
                  </div>
                )}

                {/* List */}
                {list.length > 0 && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...list].sort((a, b) => b.updatedAt - a.updatedAt).map(c => {
                      const t = totals(c);
                      return (
                        <div
                          key={c.id}
                          className="border border-white/5 bg-surface rounded-xl p-5 hover:bg-surface-light/60 transition-colors group cursor-pointer"
                          onClick={() => openExisting(c)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="text-xs font-mono text-[#fbbf24] mb-0.5">{c.folio}</div>
                              <div className="font-semibold text-sm truncate max-w-[180px]">{c.cliente || "Sin cliente"}</div>
                            </div>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${ESTADO_STYLE[c.estado]}`}>
                              {c.estado}
                            </span>
                          </div>
                          <div className="text-xs text-muted truncate mb-3">{c.proyecto || "Sin título"}</div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-[9px] font-mono text-white/20 uppercase tracking-wider">Saldo pendiente</div>
                              <div className={`text-base font-[family-name:var(--font-bebas)] tracking-wider ${t.saldo <= 0 ? "text-[#34d399]" : "text-[#fbbf24]"}`}>
                                {fmt(Math.abs(t.saldo), c.moneda)}
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={e => { e.stopPropagation(); handleDuplicar(c); }}
                                className="px-2 py-1 text-[9px] font-mono border border-white/10 rounded text-white/30 hover:text-white/60 hover:border-white/20 transition-colors"
                              >
                                Duplicar
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); handleDelete(c.id); }}
                                className="px-2 py-1 text-[9px] font-mono border border-[rgba(251,113,133,0.2)] rounded text-[#fb7185]/50 hover:text-[#fb7185] hover:border-[rgba(251,113,133,0.4)] transition-colors"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                          <div className="text-[9px] font-mono text-white/15 mt-2">
                            {new Date(c.updatedAt).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {view === "editor" && current && (
              <>
                {/* Extra toolbar for JSON export */}
                <div className="flex items-center justify-end gap-2 mb-1">
                  <button onClick={handleExportJSON} className="text-[10px] font-mono text-white/20 hover:text-white/40 transition-colors">
                    Exportar JSON ↓
                  </button>
                </div>
                <Editor
                  c={current}
                  onChange={c => { setCurrent(c); setSaved(false); }}
                  onSave={handleSave}
                  onBack={() => { setView("list"); window.history.pushState({}, "", "/cotizador"); }}
                  onPrint={() => setPrinting(true)}
                  onShare={handleShare}
                  saved={saved}
                />
              </>
            )}

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
