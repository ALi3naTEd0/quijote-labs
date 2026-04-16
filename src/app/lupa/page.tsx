"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Data ─────────────────────────────────────────────────────────────────────

const blocks = [
  {
    id: "operacion",
    label: "Tu operación hoy",
    icon: "⚙",
    items: [
      { id: "q1", label: "¿Cómo haces una cotización hoy?", type: "textarea" as const, placeholder: "Ej: la escribo a mano, en WhatsApp, en Excel..." },
      { id: "q2", label: "¿Cuánto tiempo te toma hacer una cotización?", type: "select" as const, options: ["Menos de 30 minutos", "Entre 30 min y 1 hora", "Más de 1 hora", "Varía mucho"] },
      { id: "q3", label: "¿Qué incluyes normalmente en una cotización?", type: "checkbox" as const, options: ["Materiales", "Mano de obra", "Tiempos de entrega", "Solo precio final"] },
      { id: "q4", label: "¿Dónde guardas la información de tus clientes y proyectos?", type: "select" as const, options: ["En mi cabeza / no lo guardo", "En WhatsApp o mensajes", "En Excel o Word", "En una libreta", "Otro"] },
    ],
  },
  {
    id: "proyectos",
    label: "Tus proyectos",
    icon: "📋",
    items: [
      { id: "q5", label: "¿Cuántos proyectos manejas al mismo tiempo normalmente?", type: "select" as const, options: ["1 a 2", "3 a 5", "6 a 10", "Más de 10"] },
      { id: "q6", label: "¿Cómo sabes en qué etapa va cada proyecto?", type: "textarea" as const, placeholder: "Ej: le pregunto al carpintero, lo recuerdo yo, tengo una lista..." },
      { id: "q7", label: "¿Cómo te das cuenta cuando un proyecto va retrasado?", type: "select" as const, options: ["Cuando el cliente me llama a preguntar", "Cuando reviso yo mismo", "Casi siempre lo detecto tarde", "Tengo un control claro"] },
      { id: "q8", label: "¿Registras cuánto tiempo tomó realmente hacer un mueble vs lo que cotizaste?", type: "select" as const, options: ["Nunca", "A veces", "Casi siempre", "Siempre"] },
    ],
  },
  {
    id: "materiales",
    label: "Materiales y costos",
    icon: "🪵",
    items: [
      { id: "q9",  label: "¿Llevas control de materiales en tu taller?", type: "select" as const, options: ["No, compro según necesito", "Tengo un inventario básico", "Sí, llevo control detallado"] },
      { id: "q10", label: "¿Has perdido dinero en proyectos porque costaste mal?", type: "select" as const, options: ["Sí, varias veces", "Sí, alguna vez", "Creo que sí pero no lo sé con certeza", "No"] },
      { id: "q11", label: "¿Quién decide cuándo y qué material comprar?", type: "select" as const, options: ["Yo solo", "Yo con mi equipo", "Mi encargado", "No hay un proceso claro"] },
    ],
  },
  {
    id: "clientes",
    label: "Clientes y cobros",
    icon: "💳",
    items: [
      { id: "q12", label: "¿Cómo llevas el control de anticipos y pagos por proyecto?", type: "textarea" as const, placeholder: "Ej: anoto en libreta, en Excel, confío en mi memoria..." },
      { id: "q13", label: "¿Has tenido proyectos donde el cliente no pagó o quedó a deber?", type: "select" as const, options: ["Sí, seguido", "Sí, alguna vez", "Casi nunca", "Nunca"] },
      { id: "q14", label: "¿Emites facturas o algún comprobante formal?", type: "select" as const, options: ["Sí, siempre", "Solo cuando me lo piden", "Rara vez", "No"] },
    ],
  },
  {
    id: "equipo",
    label: "Tu equipo y contexto",
    icon: "👷",
    items: [
      { id: "q15", label: "¿Cuántas personas trabajan en tu taller?", type: "select" as const, options: ["Solo yo", "2 a 3 personas", "4 a 6 personas", "Más de 6"] },
      { id: "q16", label: "¿Con qué dispositivo accedes más a tu información del negocio?", type: "select" as const, options: ["Celular", "Computadora", "Ambos por igual"] },
      { id: "q17", label: "¿Alguien más además de ti lleva las cuentas o administración?", type: "select" as const, options: ["No, todo lo hago yo", "Tengo apoyo de alguien de confianza", "Tengo un contador o admin", "Lo hace otra persona, no yo"] },
      { id: "q18", label: "¿Cuál es el mayor problema que quisieras resolver primero?", type: "textarea" as const, placeholder: "En tus propias palabras, ¿qué te quita más el sueño del negocio?" },
    ],
  },
];

type Answers = Record<string, string | string[]>;
const totalQ = blocks.reduce((s, b) => s + b.items.length, 0);
const LS_KEY = "ql_lupa_answers_v1";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countAnswered(a: Answers) {
  return Object.keys(a).filter(k => {
    const v = a[k];
    return Array.isArray(v) ? v.length > 0 : v?.toString().trim() !== "";
  }).length;
}

function blockDone(b: typeof blocks[0], a: Answers) {
  return b.items.every(item => {
    const v = a[item.id];
    return Array.isArray(v) ? v.length > 0 : v?.toString().trim();
  });
}

function encodeAnswers(a: Answers) {
  return btoa(encodeURIComponent(JSON.stringify(a)));
}

function decodeAnswers(s: string): Answers | null {
  try { return JSON.parse(decodeURIComponent(atob(s))); } catch { return null; }
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = Math.round((done / total) * 100);
  return (
    <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden">
      <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

// ─── QuestionCard ─────────────────────────────────────────────────────────────

function QuestionCard({ item, idx, answers, onChange }: {
  item: typeof blocks[0]["items"][0];
  idx: number;
  answers: Answers;
  onChange: (id: string, val: string | string[]) => void;
}) {
  const answered = (() => {
    const v = answers[item.id];
    return Array.isArray(v) ? v.length > 0 : !!v?.toString().trim();
  })();

  return (
    <div className={`border rounded-xl p-5 transition-colors duration-200 ${answered ? "border-accent/20 bg-[#0d1a2e]" : "border-white/8 bg-surface"}`}>
      <label className="block mb-4 text-[15px] font-medium leading-relaxed text-foreground">
        <span className="text-accent font-[family-name:var(--font-bebas)] text-xl mr-2 leading-none">{idx + 1}.</span>
        {item.label}
      </label>

      {item.type === "textarea" && (
        <textarea
          rows={3}
          className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-white/25 focus:outline-none focus:border-accent/40 resize-none transition-colors leading-relaxed"
          value={(answers[item.id] as string) || ""}
          placeholder={item.placeholder}
          onChange={e => onChange(item.id, e.target.value)}
        />
      )}

      {item.type === "select" && (
        <div className="flex flex-col gap-2">
          {item.options!.map(opt => {
            const sel = answers[item.id] === opt;
            return (
              <button
                key={opt}
                onClick={() => onChange(item.id, opt)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 ${
                  sel
                    ? "bg-accent/12 border-accent/50 text-white font-medium"
                    : "bg-background/60 border-white/8 text-white/65 hover:border-white/20 hover:text-white hover:bg-white/3"
                }`}
              >
                <span className={`mr-2.5 text-xs font-mono ${sel ? "text-accent" : "text-white/25"}`}>{sel ? "●" : "○"}</span>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {item.type === "checkbox" && (
        <div className="flex flex-col gap-2">
          {item.options!.map(opt => {
            const checked = ((answers[item.id] as string[]) || []).includes(opt);
            return (
              <button
                key={opt}
                onClick={() => {
                  const prev = (answers[item.id] as string[]) || [];
                  onChange(item.id, checked ? prev.filter(o => o !== opt) : [...prev, opt]);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 ${
                  checked
                    ? "bg-accent/12 border-accent/50 text-white font-medium"
                    : "bg-background/60 border-white/8 text-white/65 hover:border-white/20 hover:text-white hover:bg-white/3"
                }`}
              >
                <span className={`mr-2.5 text-xs font-mono ${checked ? "text-accent" : "text-white/25"}`}>{checked ? "■" : "□"}</span>
                {opt}
              </button>
            );
          })}
          <p className="text-[10px] font-mono text-white/25 mt-1">Puedes seleccionar varias opciones</p>
        </div>
      )}
    </div>
  );
}

// ─── Summary (shared between results view and print) ──────────────────────────

function Summary({ answers }: { answers: Answers }) {
  const done = countAnswered(answers);
  return (
    <div id="lupa-summary" className="border border-white/8 bg-surface rounded-xl overflow-hidden">
      {/* Print header — only visible when printing */}
      <div className="hidden print:flex items-center justify-between px-6 py-4 border-b border-white/8 bg-surface-light">
        <div className="flex items-center gap-3">
          <div className="font-[family-name:var(--font-bebas)] text-2xl tracking-widest">QUIJOTE LABS</div>
          <span className="text-xs font-mono text-white/30">·</span>
          <span className="text-xs font-mono text-white/40 uppercase tracking-wider">LUPA · Diagnóstico Taller</span>
        </div>
        <span className="text-xs font-mono text-white/25">{new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}</span>
      </div>

      <div className="px-6 py-4 border-b border-white/5 bg-surface-light flex items-center justify-between print:hidden">
        <span className="text-[10px] font-mono tracking-wider uppercase text-white/30">Resumen de respuestas</span>
        <span className="text-[10px] font-mono text-white/20">{done}/{totalQ} respondidas</span>
      </div>

      <div className="divide-y divide-white/[0.05]">
        {blocks.map(b => (
          <div key={b.id} className="px-6 py-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base">{b.icon}</span>
              <span className="text-xs font-mono tracking-wider uppercase text-white/40 font-semibold">{b.label}</span>
            </div>
            <div className="space-y-4">
              {b.items.map(item => {
                const val = answers[item.id];
                if (!val || (Array.isArray(val) && val.length === 0)) return (
                  <div key={item.id}>
                    <p className="text-[11px] text-white/25 font-mono mb-0.5">{item.label}</p>
                    <p className="text-sm text-white/20 italic">Sin respuesta</p>
                  </div>
                );
                return (
                  <div key={item.id}>
                    <p className="text-[11px] text-white/35 font-mono mb-1 leading-relaxed">{item.label}</p>
                    <p className="text-sm text-white/85 leading-relaxed">
                      {Array.isArray(val) ? val.join(", ") : val}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-3 border-t border-white/5 bg-surface-light">
        <p className="text-[10px] font-mono text-white/15 text-center">
          Quijote Labs · Diagnóstico confidencial · quijotelabs.com · Mérida, Yucatán
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type View = "intro" | "form" | "done";

export default function LupaPage() {
  const [view, setView]       = useState<View>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [toast, setToast]     = useState("");
  const importRef             = useRef<HTMLInputElement>(null);

  // Restore from localStorage + handle ?r= URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("r");
    if (r) {
      const decoded = decodeAnswers(r);
      if (decoded) { setAnswers(decoded); setView("done"); return; }
    }
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) setAnswers(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Auto-save to localStorage on every change
  useEffect(() => {
    if (Object.keys(answers).length > 0)
      localStorage.setItem(LS_KEY, JSON.stringify(answers));
  }, [answers]);

  const done  = countAnswered(answers);
  const block = blocks[current];

  const onChange = (id: string, val: string | string[]) =>
    setAnswers(prev => ({ ...prev, [id]: val }));

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/lupa?r=${encodeAnswers(answers)}`;
    navigator.clipboard.writeText(url).then(() => showToast("Enlace con respuestas copiado"));
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify({ timestamp: new Date().toISOString(), answers }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `lupa-diagnostico-${Date.now()}.json`;
    a.click();
    showToast("JSON descargado");
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        const imported: Answers = parsed.answers ?? parsed;
        setAnswers(imported);
        setView("done");
        showToast("Respuestas cargadas correctamente");
      } catch { showToast("Error al leer el archivo JSON"); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handlePrint = () => window.print();

  const handleReset = () => {
    if (confirm("¿Borrar todas las respuestas y empezar de nuevo?")) {
      setAnswers({});
      localStorage.removeItem(LS_KEY);
      setCurrent(0);
      setView("intro");
    }
  };

  // ── Print CSS ──
  const printCSS = `
    @media print {
      body * { visibility: hidden !important; }
      #lupa-summary, #lupa-summary * { visibility: visible !important; }
      #lupa-summary { position: fixed !important; top: 0; left: 0; width: 100vw !important; }
      @page { margin: 1cm; size: A4 portrait; }
    }
  `;

  // ── Toast ──
  const Toast = toast ? (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-surface-light border border-white/10 rounded-xl text-xs font-mono text-white/70 shadow-xl pointer-events-none">
      {toast}
    </div>
  ) : null;

  // ───────── INTRO ─────────────────────────────────────────────────────────────
  if (view === "intro") {
    return (
      <div className="min-h-screen flex flex-col">
        <style>{printCSS}</style>
        {Toast}
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-xl w-full text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-mono tracking-wider uppercase text-white border border-accent/30 rounded-full bg-accent/10 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
              Diagnóstico · Taller de carpintería
            </div>

            <h1 className="font-[family-name:var(--font-bebas)] text-7xl sm:text-8xl tracking-wide leading-none mb-6">
              LUPA
            </h1>

            <p className="text-white/70 text-base leading-relaxed mb-3 max-w-md mx-auto">
              Un diagnóstico rápido para entender cómo opera tu taller hoy
              y dónde puedes ganar más sin trabajar más.
            </p>
            <p className="text-white/30 text-sm font-mono mb-10">
              {totalQ} preguntas · ~10 minutos · Confidencial
            </p>

            <div className="grid grid-cols-3 gap-4 mb-10 text-left">
              {[
                { num: "5", label: "bloques", desc: "Operación, proyectos, materiales, cobros, equipo" },
                { num: "18", label: "preguntas", desc: "Directas, sin rodeos" },
                { num: "0", label: "perdidas", desc: "Se guarda automáticamente" },
              ].map(s => (
                <div key={s.num} className="border border-white/8 bg-surface rounded-xl p-4">
                  <div className="font-[family-name:var(--font-bebas)] text-4xl text-accent leading-none">{s.num}</div>
                  <div className="text-[10px] font-mono text-white/30 uppercase tracking-wider mt-0.5">{s.label}</div>
                  <div className="text-xs text-white/45 mt-1 leading-snug">{s.desc}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setView("form")}
                className="group relative px-10 py-4 bg-accent hover:bg-accent-light text-white rounded-xl font-medium text-base transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Empezar diagnóstico →</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <div className="relative">
                <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImportJSON} />
                <button
                  onClick={() => importRef.current?.click()}
                  className="px-6 py-4 border border-white/15 text-white/50 rounded-xl text-sm font-mono hover:border-white/25 hover:text-white/70 transition-colors"
                >
                  Importar JSON
                </button>
              </div>
            </div>

            {done > 0 && (
              <p className="text-white/25 text-xs font-mono mt-5">
                Tienes {done} respuestas guardadas ·{" "}
                <button onClick={() => setView("form")} className="text-accent/70 hover:text-accent underline underline-offset-2 transition-colors">
                  Continuar
                </button>
              </p>
            )}

            <p className="text-white/15 text-xs font-mono mt-6">
              Quijote Labs · Mérida, Yucatán
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ───────── RESULTS ───────────────────────────────────────────────────────────
  if (view === "done") {
    return (
      <div className="min-h-screen flex flex-col">
        <style>{printCSS}</style>
        {Toast}
        <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImportJSON} />
        <Navbar />
        <main className="flex-1 py-16 px-6 print:py-0">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10 print:hidden">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-mono tracking-wider uppercase text-[#34d399] border border-[rgba(52,211,153,0.3)] rounded-full bg-[rgba(52,211,153,0.08)] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse shrink-0" />
                Diagnóstico completado
              </div>
              <h1 className="font-[family-name:var(--font-bebas)] text-5xl sm:text-6xl tracking-wide leading-none mb-4">
                Gracias, ya tenemos<br />
                <span className="gradient-text">lo que necesitamos.</span>
              </h1>
              <p className="text-white/55 text-base max-w-md mx-auto">
                Revisaremos tus respuestas y te enviaremos una propuesta personalizada para tu taller.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 justify-center mb-8 print:hidden">
              <button onClick={handleShare} className="px-4 py-2.5 text-sm font-mono bg-accent hover:bg-accent-light text-white rounded-xl transition-colors">
                Copiar enlace
              </button>
              <button onClick={handlePrint} className="px-4 py-2.5 text-sm font-mono border border-white/15 text-white/60 rounded-xl hover:border-white/25 hover:text-white/80 transition-colors">
                Exportar PDF
              </button>
              <button onClick={handleExportJSON} className="px-4 py-2.5 text-sm font-mono border border-white/15 text-white/60 rounded-xl hover:border-white/25 hover:text-white/80 transition-colors">
                Exportar JSON
              </button>
              <button onClick={() => importRef.current?.click()} className="px-4 py-2.5 text-sm font-mono border border-white/15 text-white/60 rounded-xl hover:border-white/25 hover:text-white/80 transition-colors">
                Importar JSON
              </button>
              <button onClick={() => { setView("form"); setCurrent(0); }} className="px-4 py-2.5 text-sm font-mono border border-white/10 text-white/35 rounded-xl hover:border-white/15 hover:text-white/55 transition-colors">
                Editar respuestas
              </button>
              <button onClick={handleReset} className="px-4 py-2.5 text-sm font-mono border border-[rgba(251,113,133,0.2)] text-[#fb7185]/40 rounded-xl hover:border-[rgba(251,113,133,0.35)] hover:text-[#fb7185]/70 transition-colors">
                Reiniciar
              </button>
            </div>

            <Summary answers={answers} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ───────── FORM ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <style>{printCSS}</style>
      {Toast}

      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/8">
        <div className="max-w-xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Image src="/assets/logo-mark.svg" width={22} height={22} alt="Quijote Labs" />
              <div>
                <div className="text-[10px] font-mono tracking-[0.15em] text-accent uppercase font-semibold">Quijote Labs</div>
                <div className="text-[10px] text-white/35 font-mono">LUPA · Taller de carpintería</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-white/30">{done}/{totalQ}</span>
              <button
                onClick={() => { setView("done"); }}
                className="text-[10px] font-mono text-white/25 hover:text-white/50 transition-colors border border-white/8 rounded px-2 py-0.5"
              >
                Ver resumen
              </button>
            </div>
          </div>
          <ProgressBar done={done} total={totalQ} />
        </div>
      </div>

      <main className="flex-1 py-8 px-6">
        <div className="max-w-xl mx-auto">

          {/* Block tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {blocks.map((b, i) => {
              const isDone  = blockDone(b, answers);
              const isActive = i === current;
              return (
                <button
                  key={b.id}
                  onClick={() => setCurrent(i)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-mono border transition-all duration-150 ${
                    isActive
                      ? "bg-accent/12 border-accent/40 text-white"
                      : isDone
                      ? "bg-[rgba(52,211,153,0.07)] border-[rgba(52,211,153,0.25)] text-[#34d399]/70"
                      : "bg-transparent border-white/8 text-white/35 hover:border-white/15 hover:text-white/55"
                  }`}
                >
                  {isActive && <span className="w-1 h-1 rounded-full bg-accent inline-block mr-1.5 align-middle" />}
                  {isDone && !isActive && <span className="text-[#34d399] mr-1">✓</span>}
                  {b.label}
                </button>
              );
            })}
          </div>

          {/* Block header */}
          <div className="mb-6">
            <h2 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wide leading-none mb-1">
              <span className="mr-2">{block.icon}</span>{block.label}
            </h2>
            <p className="text-[11px] font-mono text-white/25">
              Bloque {current + 1} de {blocks.length}
            </p>
          </div>

          {/* Questions */}
          <div className="space-y-4 mb-8">
            {block.items.map((item, idx) => (
              <QuestionCard key={item.id} item={item} idx={idx} answers={answers} onChange={onChange} />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            {current > 0 ? (
              <button onClick={() => setCurrent(c => c - 1)} className="px-5 py-3 border border-white/15 text-white/50 rounded-xl text-sm font-mono hover:border-white/25 hover:text-white/70 transition-colors">
                ← Anterior
              </button>
            ) : (
              <button onClick={() => setView("intro")} className="px-5 py-3 border border-white/8 text-white/25 rounded-xl text-sm font-mono hover:text-white/45 transition-colors">
                ← Intro
              </button>
            )}

            {current < blocks.length - 1 ? (
              <button onClick={() => setCurrent(c => c + 1)} className="px-8 py-3 bg-accent hover:bg-accent-light text-white rounded-xl text-sm font-mono transition-colors">
                Siguiente →
              </button>
            ) : (
              <button
                onClick={() => setView("done")}
                disabled={done < totalQ}
                className={`px-8 py-3 rounded-xl text-sm font-mono transition-colors ${
                  done === totalQ
                    ? "bg-accent hover:bg-accent-light text-white cursor-pointer"
                    : "bg-white/5 text-white/25 cursor-not-allowed"
                }`}
              >
                {done === totalQ ? "Enviar diagnóstico ✓" : `Faltan ${totalQ - done}`}
              </button>
            )}
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-white/5">
            <button onClick={handleExportJSON} className="text-[10px] font-mono text-white/20 hover:text-white/45 transition-colors">
              Exportar JSON ↓
            </button>
            <span className="text-white/10 text-xs">·</span>
            <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImportJSON} />
            <button onClick={() => importRef.current?.click()} className="text-[10px] font-mono text-white/20 hover:text-white/45 transition-colors">
              Importar JSON ↑
            </button>
            <span className="text-white/10 text-xs">·</span>
            <p className="text-[10px] font-mono text-white/15">
              Guardado automáticamente
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
