“use client”;

import { Cotizacion } from “./cotizador-types”;

// ─── Logo SVG inline (lanza azul sobre fondo gris tenue) ──────────────────────

function QLabsLogo({ size = 56 }: { size?: number }) {
return (
<svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
{/* Q circle — azul marino */}
<circle cx="44" cy="50" r="30" stroke="#0f1f45" strokeWidth="10" fill="none" />
{/* Lanza azul eléctrico diagonal */}
<path
d="M62 18 L82 8 L44 72 L24 82 Z"
fill="#2563eb"
/>
</svg>
);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtMXN(n: number, moneda = “MXN”) {
return new Intl.NumberFormat(“es-MX”, {
style: “currency”,
currency: moneda,
maximumFractionDigits: 0,
}).format(n);
}

function totals(c: Cotizacion) {
const total = c.items.reduce(
(s, i) => s + (i.tipo === “descuento” ? -i.monto : i.monto),
0
);
const pagado = c.pagos.reduce((s, p) => s + p.monto, 0);
return { total, pagado, saldo: total - pagado };
}

// ─── Check icon ───────────────────────────────────────────────────────────────

function Check() {
return (
<div style={{
width: 20, height: 20,
background: “#2563eb”,
borderRadius: “50%”,
display: “flex”, alignItems: “center”, justifyContent: “center”,
flexShrink: 0,
}}>
<svg width="10" height="8" viewBox="0 0 10 8" fill="none">
<path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
</svg>
</div>
);
}

// ─── Main component ───────────────────────────────────────────────────────────

export function QuoteTemplatePremium({ c }: { c: Cotizacion }) {
const t = totals(c);
const importeStr = fmtMXN(t.total, c.moneda);
const monedaLabel = c.moneda === “MXN” ? “Pesos Mexicanos” : c.moneda === “USD” ? “Dólares Americanos” : “Euros”;

// Construir lista de bullets desde los items del proyecto
const bullets = c.items
.filter((i) => i.tipo !== “descuento” && i.concepto)
.map((i) => ({ bold: i.concepto, rest: i.nota || “” }));

const hasBullets = bullets.length > 0;

return (
<div
id=“quote-premium-preview”
style={{
width: 794,
minHeight: 1123,
background: “#ffffff”,
fontFamily: “‘Inter’, ‘Helvetica Neue’, Arial, sans-serif”,
color: “#1a2340”,
display: “flex”,
flexDirection: “column”,
boxSizing: “border-box”,
border: “1px solid #e2e8f0”,
borderRadius: 16,
overflow: “hidden”,
position: “relative”,
}}
>
{/* ── HEADER ── */}
<div style={{
display: “flex”,
padding: “32px 40px 24px”,
borderBottom: “1px solid #e2e8f0”,
gap: 24,
alignItems: “flex-start”,
background: “#ffffff”,
}}>
{/* Logo box */}
<div style={{
background: “#f1f5f9”,
borderRadius: 12,
padding: 12,
width: 80, height: 80,
display: “flex”, alignItems: “center”, justifyContent: “center”,
flexShrink: 0,
border: “1px solid #e8edf5”,
}}>
<QLabsLogo size={52} />
</div>

```
    {/* Brand name */}
    <div style={{ flex: 1, paddingTop: 8 }}>
      <div style={{
        fontSize: 26, fontWeight: 800,
        letterSpacing: "0.18em",
        color: "#0f1f45",
        lineHeight: 1,
      }}>QUIJOTE</div>
      <div style={{
        fontSize: 13, fontWeight: 600,
        letterSpacing: "0.55em",
        color: "#0f1f45",
        marginTop: 1,
      }}>LABS</div>
      <div style={{
        fontSize: 10, color: "#64748b",
        marginTop: 7, letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}>
        AUTOMATIZAMOS LO COMPLEJO. POTENCIAMOS LO{" "}
        <span style={{ color: "#2563eb", fontWeight: 700 }}>ESENCIAL.</span>
      </div>
    </div>

    {/* Right: cotización meta */}
    <div style={{ textAlign: "right", minWidth: 190 }}>
      <div style={{
        fontSize: 20, fontWeight: 800,
        color: "#0f1f45", letterSpacing: "0.15em",
      }}>COTIZACIÓN</div>
      <div style={{
        width: 36, height: 3,
        background: "#2563eb",
        marginLeft: "auto",
        marginTop: 5, marginBottom: 16,
        borderRadius: 2,
      }} />

      <MetaField label="📅 FECHA" value={c.fechaEmision || "—"} />
      <MetaField label="👤 PROPUESTA DIRIGIDA A" value={c.cliente || "—"} valueStyle={{ color: "#2563eb", fontWeight: 700, fontSize: 14 }} />
      {c.proyecto && <MetaField label="PROYECTO" value={c.proyecto} />}
      {c.folio && <MetaField label="FOLIO" value={c.folio} valueStyle={{ color: "#94a3b8", fontSize: 11 }} />}
    </div>
  </div>

  {/* ── BODY ── */}
  <div style={{
    display: "flex",
    flex: 1,
    padding: "32px 40px",
    gap: 28,
    alignItems: "flex-start",
  }}>
    {/* ── LEFT COLUMN ── */}
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>

      {/* Service title */}
      <div>
        <div style={{
          fontSize: 22, fontWeight: 800,
          color: "#0f1f45", lineHeight: 1.15,
          textTransform: "uppercase",
          letterSpacing: "0.03em",
        }}>
          {c.proyecto || "Servicio Profesional"}
        </div>
        <div style={{
          fontSize: 13, color: "#64748b",
          marginTop: 8, lineHeight: 1.65,
        }}>
          {c.notaFinal || "Detectamos cuellos de botella, procesos ineficientes y oportunidades de automatización para convertir operación manual en sistema escalable."}
        </div>
      </div>

      <Divider />

      {/* ¿Qué incluye? */}
      {hasBullets && (
        <div>
          <SectionHeader icon="📋" label="¿QUÉ INCLUYE?" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {bullets.map((b, i) => (
              <BulletRow key={i} bold={b.bold} rest={b.rest} />
            ))}
          </div>
        </div>
      )}

      {!hasBullets && (
        <div>
          <SectionHeader icon="📋" label="¿QUÉ INCLUYE?" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <BulletRow bold="Mapeo de procesos" rest="actuales (ventas, operación, entrega)" />
            <BulletRow bold="Identificación de fugas" rest="de tiempo y dinero" />
            <BulletRow bold="Detección de tareas automatizables" rest="(IA + software)" />
            <BulletRow bold="Recomendaciones accionables" rest="(no teoría)" />
            <BulletRow bold="Entrega de diagnóstico estructurado" rest="(prioridades + roadmap)" />
          </div>
        </div>
      )}

      <Divider />

      {/* Resultado esperado */}
      <div>
        <SectionHeader icon="📈" label="RESULTADO ESPERADO" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <BulletRow bold="Menos dependencia" rest="operativa del dueño" />
          <BulletRow bold="Reducción de retrabajo" rest="y errores" />
          <BulletRow bold="Base lista para" rest="automatización y crecimiento" />
        </div>
      </div>

      <Divider />

      {/* Cierre persuasivo */}
      <div style={{
        borderLeft: "4px solid #2563eb",
        paddingLeft: 16,
      }}>
        <div style={{
          fontSize: 28, color: "#2563eb",
          lineHeight: 0.8, marginBottom: 8,
          fontFamily: "Georgia, serif",
        }}>"</div>
        <div style={{
          fontSize: 13, fontWeight: 700,
          color: "#0f1f45", lineHeight: 1.55,
        }}>
          Este diagnóstico no es consultoría genérica.
        </div>
        <div style={{
          fontSize: 13, color: "#475569",
          lineHeight: 1.6, marginTop: 4,
        }}>
          Es un punto de control real para decidir si tu operación puede escalar… o te va a seguir consumiendo.
        </div>
      </div>
    </div>

    {/* ── RIGHT COLUMN ── */}
    <div style={{ width: 220, display: "flex", flexDirection: "column", gap: 18, flexShrink: 0 }}>

      {/* Inversión card */}
      <div style={{
        background: "#0f1f45",
        borderRadius: 16,
        padding: "24px 20px",
        color: "white",
      }}>
        <div style={{
          display: "flex", alignItems: "center",
          gap: 10, marginBottom: 18,
        }}>
          <div style={{
            width: 32, height: 32,
            background: "#2563eb",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>🏷️</div>
          <span style={{
            fontSize: 12, fontWeight: 700,
            letterSpacing: "0.12em",
          }}>INVERSIÓN</span>
        </div>

        <div style={{
          fontSize: 36, fontWeight: 900,
          lineHeight: 1, letterSpacing: "-0.01em",
        }}>{importeStr}</div>
        <div style={{
          fontSize: 13, fontWeight: 600,
          color: "#94a3b8", marginTop: 3,
          letterSpacing: "0.1em",
        }}>{c.moneda} · {monedaLabel}</div>

        {/* Descuentos aplicados */}
        {c.items.filter(i => i.tipo === "descuento").map(d => (
          <div key={d.id} style={{
            marginTop: 12,
            padding: "10px 12px",
            background: "rgba(37,99,235,0.18)",
            borderRadius: 8,
            fontSize: 11,
            color: "#93c5fd",
            lineHeight: 1.5,
          }}>
            <span style={{ fontWeight: 700 }}>Descuento aplicado:</span><br />
            {d.concepto} — {fmtMXN(d.monto, c.moneda)}
          </div>
        ))}

        {t.pagado > 0 && (
          <>
            <div style={{
              height: 1, background: "rgba(255,255,255,0.1)",
              margin: "16px 0",
            }} />
            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>Pagos registrados</div>
            {c.pagos.map(p => (
              <div key={p.id} style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 11, color: "#6ee7b7", marginBottom: 4,
              }}>
                <span>{p.descripcion}</span>
                <span>− {fmtMXN(p.monto, c.moneda)}</span>
              </div>
            ))}
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontSize: 13, fontWeight: 700,
              color: t.saldo <= 0 ? "#34d399" : "#fbbf24",
              marginTop: 8,
              paddingTop: 8,
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}>
              <span>Saldo pendiente</span>
              <span>{fmtMXN(Math.abs(t.saldo), c.moneda)}</span>
            </div>
          </>
        )}
      </div>

      {/* Datos bancarios */}
      <div style={{
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: "20px",
        background: "#fafbfd",
      }}>
        <div style={{
          display: "flex", alignItems: "center",
          gap: 10, marginBottom: 18,
        }}>
          <div style={{
            width: 32, height: 32,
            background: "#0f1f45",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>🏦</div>
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: "#0f1f45", letterSpacing: "0.1em",
            lineHeight: 1.3,
          }}>DATOS PARA<br />TRANSFERENCIA</span>
        </div>

        <BankField label="BENEFICIARIO" value="Carlos Eduardo Magaña Fitzmaurice" large />
        <BankField label="CLABE" value="646990404083681406" mono />
        <BankField label="BANCO" value="STP" sub="(Sistema de Transferencias y Pagos)" />
      </div>
    </div>
  </div>

  {/* ── FOOTER ── */}
  <div style={{
    borderTop: "1px solid #e2e8f0",
    padding: "14px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffffff",
  }}>
    <div style={{
      display: "flex", alignItems: "center",
      gap: 8, color: "#94a3b8", fontSize: 12,
    }}>
      <span>🌐</span>
      <span>quijotelabs.com · Mérida, Yucatán</span>
    </div>
    <div style={{ textAlign: "right", fontSize: 11 }}>
      <span style={{ color: "#0f1f45", fontWeight: 700 }}>TECNOLOGÍA CON PROPÓSITO.</span>{" "}
      <span style={{ color: "#94a3b8" }}>RESULTADOS QUE </span>
      <span style={{ color: "#2563eb", fontWeight: 700 }}>SE NOTAN.</span>
    </div>
  </div>
</div>
```

);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Divider() {
return <div style={{ height: 1, background: “#e8edf5” }} />;
}

function MetaField({
label, value, valueStyle,
}: {
label: string;
value: string;
valueStyle?: React.CSSProperties;
}) {
return (
<div style={{ marginTop: 10 }}>
<div style={{
fontSize: 9, color: “#94a3b8”,
fontWeight: 600, letterSpacing: “0.12em”,
textTransform: “uppercase”,
}}>{label}</div>
<div style={{
fontSize: 13, color: “#1a2340”,
marginTop: 2, fontWeight: 500,
…valueStyle,
}}>{value}</div>
</div>
);
}

function SectionHeader({ icon, label }: { icon: string; label: string }) {
return (
<div style={{
display: “flex”, alignItems: “center”,
gap: 10, marginBottom: 14,
}}>
<div style={{
width: 32, height: 32,
background: “#0f1f45”,
borderRadius: 8,
display: “flex”, alignItems: “center”, justifyContent: “center”,
fontSize: 15,
}}>{icon}</div>
<span style={{
fontSize: 13, fontWeight: 700,
letterSpacing: “0.1em”,
color: “#0f1f45”,
}}>{label}</span>
</div>
);
}

function BulletRow({ bold, rest }: { bold: string; rest: string }) {
return (
<div style={{ display: “flex”, alignItems: “flex-start”, gap: 10 }}>
<Check />
<span style={{ fontSize: 13, lineHeight: 1.55, color: “#334155” }}>
<strong style={{ color: “#0f1f45” }}>{bold}</strong>
{rest ? ` ${rest}` : “”}
</span>
</div>
);
}

function BankField({
label, value, sub, large, mono,
}: {
label: string;
value: string;
sub?: string;
large?: boolean;
mono?: boolean;
}) {
return (
<div style={{ marginBottom: 12 }}>
<div style={{
fontSize: 9, color: “#94a3b8”,
fontWeight: 600, letterSpacing: “0.12em”,
textTransform: “uppercase”,
marginBottom: 2,
}}>{label}</div>
<div style={{
fontSize: large ? 14 : mono ? 11 : 13,
fontWeight: large ? 700 : 600,
color: “#0f1f45”,
lineHeight: 1.4,
fontFamily: mono ? “monospace” : “inherit”,
letterSpacing: mono ? “0.04em” : “inherit”,
}}>{value}</div>
{sub && <div style={{ fontSize: 10, color: “#94a3b8”, marginTop: 1 }}>{sub}</div>}
</div>
);
}