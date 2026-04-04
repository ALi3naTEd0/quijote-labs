"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type AgentKey = "claude" | "chatgpt" | "gemini" | "perplexity" | "cursor" | "copilot" | "mistral";
type Category = "general" | "research" | "code" | "business" | "creative" | "consulting" | "systems";
type Tier = "Base" | "Medio" | "Premium";

interface Entry {
  case: string;
  category: Category;
  agent: string;
  agentKey: AgentKey;
  reason: string;
  tier: Tier;
}

const AGENTS: Record<AgentKey, { color: string; bg: string; border: string; dot: string }> = {
  claude:      { color: "#4d7fff", bg: "rgba(26,79,255,0.12)",    border: "rgba(26,79,255,0.35)",    dot: "#1a4fff" },
  chatgpt:     { color: "#34d399", bg: "rgba(52,211,153,0.10)",   border: "rgba(52,211,153,0.30)",   dot: "#10b981" },
  gemini:      { color: "#c084fc", bg: "rgba(192,132,252,0.10)",  border: "rgba(192,132,252,0.30)",  dot: "#a855f7" },
  perplexity:  { color: "#22d3ee", bg: "rgba(34,211,238,0.10)",   border: "rgba(34,211,238,0.30)",   dot: "#06b6d4" },
  cursor:      { color: "#fb7185", bg: "rgba(251,113,133,0.10)",  border: "rgba(251,113,133,0.30)",  dot: "#f43f5e" },
  copilot:     { color: "#60a5fa", bg: "rgba(96,165,250,0.10)",   border: "rgba(96,165,250,0.30)",   dot: "#3b82f6" },
  mistral:     { color: "#fbbf24", bg: "rgba(251,191,36,0.10)",   border: "rgba(251,191,36,0.30)",   dot: "#f59e0b" },
};

const CAT_STYLES: Record<Category, { label: string; color: string; bg: string; border: string }> = {
  general:    { label: "General",       color: "rgba(255,255,255,0.45)", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.10)" },
  research:   { label: "Investigación", color: "#22d3ee",                bg: "rgba(34,211,238,0.08)",  border: "rgba(34,211,238,0.22)" },
  code:       { label: "Código / Dev",  color: "#fb7185",                bg: "rgba(251,113,133,0.08)", border: "rgba(251,113,133,0.22)" },
  business:   { label: "Empresarial",   color: "#4d7fff",                bg: "rgba(26,79,255,0.10)",   border: "rgba(26,79,255,0.25)" },
  creative:   { label: "Creativo",      color: "#c084fc",                bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.22)" },
  consulting: { label: "Consultoría",   color: "#fbbf24",                bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.22)" },
  systems:    { label: "Sistemas",      color: "#60a5fa",                bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.22)" },
};

const TIERS: Record<Tier, string> = {
  Base:    "text-muted",
  Medio:   "text-[#4d7fff]",
  Premium: "text-[#fbbf24]",
};

const ENTRIES: Entry[] = [
  { case: "Pregunta rápida / dato puntual",              category: "research",   agentKey: "perplexity", agent: "Perplexity",           reason: "Cita fuentes en tiempo real; cero alucinaciones en datos concretos",                             tier: "Base" },
  { case: "Conversación general / QA informal",          category: "general",    agentKey: "claude",     agent: "Claude",               reason: "Contexto largo, tono natural, respuestas equilibradas y sin relleno",                             tier: "Base" },
  { case: "Resumen de documento / artículo extenso",     category: "general",    agentKey: "claude",     agent: "Claude",               reason: "200K tokens de contexto; mantiene coherencia en textos largos",                                   tier: "Base" },
  { case: "Búsqueda web actualizada / noticias",         category: "research",   agentKey: "perplexity", agent: "Perplexity",           reason: "Índice web en vivo; citas verificables por defecto",                                             tier: "Base" },
  { case: "Investigación académica / papers",            category: "research",   agentKey: "perplexity", agent: "Perplexity Pro",       reason: "Modo Academic busca en Semantic Scholar, ArXiv y PubMed directamente",                           tier: "Medio" },
  { case: "Benchmark / comparativa de productos",        category: "research",   agentKey: "chatgpt",    agent: "ChatGPT + Search",     reason: "Integra búsqueda + razonamiento o3 para síntesis comparativa profunda",                          tier: "Medio" },
  { case: "Autocompletado en IDE (línea a línea)",       category: "code",       agentKey: "copilot",    agent: "GitHub Copilot",       reason: "Integrado al editor; latencia mínima para completados inline",                                   tier: "Base" },
  { case: "Refactorizar o depurar código existente",     category: "code",       agentKey: "cursor",     agent: "Cursor AI",            reason: "Lee todo el repo; edita en contexto sin copiar/pegar nada",                                      tier: "Medio" },
  { case: "Generar feature desde cero (multi-archivo)",  category: "code",       agentKey: "cursor",     agent: "Cursor AI",            reason: "Agente que escribe, ejecuta y corrige en el mismo entorno",                                      tier: "Medio" },
  { case: "Explicar código complejo / legacy",           category: "code",       agentKey: "claude",     agent: "Claude",               reason: "Explicaciones claras y estructuradas sin simplificar conceptos técnicos",                        tier: "Base" },
  { case: "Algoritmos / lógica matemática avanzada",     category: "code",       agentKey: "chatgpt",    agent: "o3 / o4-mini",         reason: "Razonamiento extendido paso a paso; supera en problemas de lógica pura",                        tier: "Premium" },
  { case: "Revisión de seguridad / auditoría de código", category: "code",       agentKey: "claude",     agent: "Claude",               reason: "Detecta vulnerabilidades con razonamiento causal, no solo patrones",                             tier: "Medio" },
  { case: "Scripting rápido (bash, Python, JS)",         category: "code",       agentKey: "mistral",    agent: "Mistral Codestral",    reason: "Modelo de código ligero, ultra rápido, ideal para scripts utilitarios",                         tier: "Base" },
  { case: "Redacción de correos / comunicados",          category: "business",   agentKey: "claude",     agent: "Claude",               reason: "Tono ajustable, no sobre-formaliza; respeta el estilo del emisor",                               tier: "Base" },
  { case: "Construcción de dashboard / panel de control",category: "business",   agentKey: "claude",     agent: "Claude + Artifacts",   reason: "Genera HTML/React interactivo directamente en chat, sin entorno externo",                        tier: "Medio" },
  { case: "Diagnóstico operativo de negocio",            category: "business",   agentKey: "claude",     agent: "Claude",               reason: "Razonamiento estructurado, identifica cuellos de botella con lógica causal",                     tier: "Medio" },
  { case: "Automatización de procesos (n8n / Make)",     category: "business",   agentKey: "claude",     agent: "Claude",               reason: "Diseña flujos lógicos y escribe JSON/webhooks con precisión documental",                         tier: "Medio" },
  { case: "Análisis de datos en Excel / CSV",            category: "business",   agentKey: "chatgpt",    agent: "ChatGPT + Code Int.",  reason: "Ejecuta Python real; produce gráficas, tablas pivot y análisis estadístico",                     tier: "Medio" },
  { case: "Generación de reportes recurrentes",          category: "business",   agentKey: "gemini",     agent: "Gemini + Workspace",   reason: "Integración nativa con Sheets, Docs y Drive; automatiza sin salir del ecosistema",              tier: "Medio" },
  { case: "Copywriting / textos de marketing",           category: "creative",   agentKey: "claude",     agent: "Claude",               reason: "Voz consistente, evita clichés de IA; adapta registro al público objetivo",                     tier: "Base" },
  { case: "Generación de imágenes / visual",             category: "creative",   agentKey: "chatgpt",    agent: "ChatGPT + DALL·E",     reason: "Imagen desde prompt conversacional sin salir del chat",                                          tier: "Base" },
  { case: "Escritura larga / narrativa / guiones",       category: "creative",   agentKey: "claude",     agent: "Claude",               reason: "Mantiene coherencia de voz y trama en textos de miles de palabras",                             tier: "Medio" },
  { case: "Presentaciones / decks ejecutivos",           category: "creative",   agentKey: "gemini",     agent: "Gemini + Slides",      reason: "Genera slides en Google Presentations directamente con un prompt",                               tier: "Base" },
  { case: "Brainstorming de ideas / divergencia",        category: "creative",   agentKey: "chatgpt",    agent: "ChatGPT",              reason: "Volumen alto de variaciones; bueno para exploración sin filtro",                                 tier: "Base" },
  { case: "Diseño de arquitectura de software",          category: "systems",    agentKey: "claude",     agent: "Claude",               reason: "Razona trade-offs de arquitectura; explica decisiones técnicas con profundidad",                 tier: "Premium" },
  { case: "Configuración de infraestructura / DevOps",   category: "systems",    agentKey: "cursor",     agent: "Cursor AI",            reason: "Edita Dockerfiles, YAMLs y configs en contexto del repo real",                                  tier: "Medio" },
  { case: "Modelado de base de datos / esquemas",        category: "systems",    agentKey: "claude",     agent: "Claude",               reason: "Diseña esquemas relacionales/NoSQL con normalización y justificación",                          tier: "Medio" },
  { case: "Integración de APIs / documentación técnica", category: "systems",    agentKey: "claude",     agent: "Claude",               reason: "Lee y procesa documentación completa de API; genera clients funcionales",                       tier: "Medio" },
  { case: "Desarrollo de agentes IA / prompts técnicos", category: "systems",    agentKey: "claude",     agent: "Claude",               reason: "Entiende arquitecturas multi-agente; mejor en prompt engineering estructurado",                  tier: "Premium" },
  { case: "Estrategia de negocio / decisiones directivas",category: "consulting",agentKey: "claude",     agent: "Claude Opus",          reason: "Razonamiento causal profundo; pondera consecuencias de segundo orden",                         tier: "Premium" },
  { case: "Resolución de problemas complejos / lógica",  category: "consulting", agentKey: "chatgpt",    agent: "o3 / o4",              reason: "Chain-of-thought extendido; ideal cuando el problema tiene muchas variables",                   tier: "Premium" },
  { case: "Análisis de riesgo / escenarios",             category: "consulting", agentKey: "claude",     agent: "Claude Opus",          reason: "Construye árbol de riesgos con probabilidades; no se limita a lo obvio",                       tier: "Premium" },
  { case: "Optimización de procesos operativos",         category: "consulting", agentKey: "claude",     agent: "Claude",               reason: "Mapea flujos, detecta redundancias y propone rediseño con lógica de negocio",                  tier: "Premium" },
  { case: "Asesoría legal / fiscal (orientativa)",       category: "consulting", agentKey: "perplexity", agent: "Perplexity Pro",       reason: "Cita leyes y artículos vigentes con fuente verificable; actualizado",                          tier: "Premium" },
  { case: "Validación de modelo de negocio / MVP",       category: "consulting", agentKey: "claude",     agent: "Claude",               reason: "Detecta supuestos no validados y propone experimentos de validación concretos",                 tier: "Premium" },
  { case: "Due diligence / análisis competitivo",        category: "consulting", agentKey: "chatgpt",    agent: "ChatGPT + Search",     reason: "Combina datos de mercado actuales con síntesis estratégica estructurada",                      tier: "Premium" },
];

const FILTERS: { key: Category | "all"; label: string }[] = [
  { key: "all",        label: "Todos" },
  { key: "general",    label: "General" },
  { key: "research",   label: "Investigación" },
  { key: "code",       label: "Código / Dev" },
  { key: "business",   label: "Empresarial" },
  { key: "creative",   label: "Creativo" },
  { key: "consulting", label: "Consultoría" },
  { key: "systems",    label: "Sistemas" },
];

export default function DirectoriaPage() {
  const [active, setActive] = useState<Category | "all">("all");

  const visible = active === "all" ? ENTRIES : ENTRIES.filter(e => e.category === active);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="glow-orb w-[500px] h-[500px] bg-accent top-[-150px] right-[-150px]" aria-hidden="true" />
        <div className="glow-orb w-[300px] h-[300px] bg-accent bottom-0 left-[-100px]" aria-hidden="true" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-mono tracking-wider uppercase text-white border border-accent/30 rounded-full bg-accent/10 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
            v1.0 · Abril 2026 · Actualizado
          </div>

          <h1 className="font-[family-name:var(--font-bebas)] text-6xl sm:text-7xl lg:text-8xl leading-none tracking-wide mb-4">
            Directorio IA<br />
            <span className="gradient-text">de Emergencia</span>
          </h1>

          <p className="text-lg text-muted max-w-2xl font-mono mt-6">
            <span className="text-muted">// </span>
            Qué agente usar · para qué caso · por qué — sin dudar
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="flex-1 pb-24">
        <div className="max-w-6xl mx-auto px-6">

          {/* Agent legend */}
          <div className="border border-white/5 bg-surface rounded-xl p-4 mb-6 flex flex-wrap gap-x-6 gap-y-3">
            {(Object.entries(AGENTS) as [AgentKey, typeof AGENTS[AgentKey]][]).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2 text-xs font-mono text-muted">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: val.dot }} />
                {key === "chatgpt" ? "ChatGPT / o3" : key === "copilot" ? "GitHub Copilot" : key === "mistral" ? "Mistral / Le Chat" : key.charAt(0).toUpperCase() + key.slice(1)}
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={`px-4 py-1.5 text-xs font-mono tracking-wider uppercase rounded-full border transition-all duration-200 ${
                  active === f.key
                    ? "bg-accent/10 border-accent/30 text-white"
                    : "bg-transparent border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
                }`}
              >
                {f.key === active && <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mr-2 align-middle" />}
                {f.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="border border-white/5 bg-surface rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1.2fr_1.4fr_3fr_0.7fr] gap-0 border-b border-white/5 bg-surface-light px-6 py-3">
              {["Caso de uso", "Categoría", "Agente recomendado", "Motivo clave", "Nivel"].map(h => (
                <span key={h} className="text-[10px] font-mono tracking-[0.15em] uppercase text-white/25">{h}</span>
              ))}
            </div>

            {/* Rows */}
            {visible.map((entry, i) => {
              const a = AGENTS[entry.agentKey];
              const c = CAT_STYLES[entry.category];
              return (
                <div
                  key={i}
                  className="grid grid-cols-[2fr_1.2fr_1.4fr_3fr_0.7fr] gap-0 px-6 py-4 border-b border-white/[0.04] last:border-b-0 hover:bg-surface-light/60 transition-colors duration-150 items-center"
                >
                  {/* Case */}
                  <span className="text-sm font-medium text-foreground pr-4 leading-snug">{entry.case}</span>

                  {/* Category */}
                  <span
                    className="inline-flex items-center self-start mt-0.5 px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase border w-fit"
                    style={{ color: c.color, background: c.bg, borderColor: c.border }}
                  >
                    {c.label}
                  </span>

                  {/* Agent chip */}
                  <div className="flex items-center">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
                      style={{ color: a.color, background: a.bg, borderColor: a.border }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: a.dot }} />
                      {entry.agent}
                    </span>
                  </div>

                  {/* Reason */}
                  <span className="text-sm text-muted leading-relaxed pr-4">{entry.reason}</span>

                  {/* Tier */}
                  <span className={`text-xs font-semibold font-mono tracking-wide ${TIERS[entry.tier]}`}>
                    {entry.tier}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 mt-8 border border-white/5 rounded-xl overflow-hidden">
            {[
              { num: visible.length, label: "Casos visibles" },
              { num: 36,             label: "Casos totales" },
              { num: 7,              label: "Agentes mapeados" },
              { num: 7,              label: "Categorías", accent: true },
            ].map((s, i) => (
              <div key={i} className="px-6 py-6 bg-surface border-r border-white/5 last:border-r-0">
                <p className={`font-[family-name:var(--font-bebas)] text-5xl leading-none mb-1 ${s.accent ? "text-[#fbbf24]" : "text-accent"}`}>
                  {s.num}
                </p>
                <p className="text-[10px] font-mono tracking-[0.12em] uppercase text-white/25">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs font-mono text-white/20">
            <span className="text-white/35">Base</span> = cualquier plan gratuito &nbsp;·&nbsp;
            <span className="text-[#4d7fff]">Medio</span> = plan Pro recomendado &nbsp;·&nbsp;
            <span className="text-[#fbbf24]">Premium</span> = modelo de mayor capacidad disponible
          </p>

        </div>
      </section>

      <Footer />
    </div>
  );
}
