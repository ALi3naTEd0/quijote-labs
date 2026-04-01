"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const questions = [
  "¿Cuántas veces repites la misma tarea cada semana?",
  "¿Qué parte de tu operación depende 100% de ti?",
  "¿Cuántos errores cuestan dinero cada mes?",
  "¿Tienes claridad diaria de ventas y flujo de efectivo?",
  "¿Cuántos clientes se pierden por falta de seguimiento?",
  "¿Tu equipo sabe exactamente qué hacer sin preguntarte?",
  "¿Cuántas herramientas usas para operar tu negocio?",
  "¿Qué pasa si desapareces 7 días?",
  "¿Dónde sientes más caos hoy?",
  "¿Qué tarea odias pero sigues haciendo?",
];

export default function PreDiagnosis() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [diagnosisText, setDiagnosisText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filledCount = Object.values(answers).filter((v) => v.trim().length > 0).length;
  const allFilled = filledCount === questions.length;
  const emptyIndexes = questions
    .map((_, i) => i)
    .filter((i) => !answers[i] || answers[i].trim().length === 0);

  function buildMailtoLink() {
    const qa = questions
      .map((q, i) => `${i + 1}. ${q}\n   → ${answers[i] || "N/A"}`)
      .join("\n\n");

    const diagnosis = diagnosisText.trim() || "(diagnóstico no disponible)";

    const body = encodeURIComponent(
      `Hola equipo de Quijote Labs,\n\nCompleté el pre-diagnóstico y me gustaría profundizar.\n\n──────────────────\nMIS RESPUESTAS\n──────────────────\n\n${qa}\n\n──────────────────\nDIAGNÓSTICO GENERADO\n──────────────────\n\n${diagnosis}\n\n──────────────────\nQuedo al pendiente para agendar la sesión completa.`
    );
    const subject = encodeURIComponent("Pre-diagnóstico completado — Quijote Labs");
    return `mailto:admin@quijotelabs.com?subject=${subject}&body=${body}`;
  }

  async function handleSubmit() {
    if (!allFilled) {
      setAttempted(true);
      const firstEmpty = document.getElementById(`question-${emptyIndexes[0]}`);
      firstEmpty?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitted(true);
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions,
          answers: questions.map((_, i) => answers[i] || "N/A"),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        setError(text);
        setLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setError("Error al leer la respuesta.");
        setLoading(false);
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setDiagnosisText((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const isEmpty = (i: number) =>
    attempted && (!answers[i] || answers[i].trim().length === 0);

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="glow-orb w-[400px] h-[400px] bg-accent bottom-0 left-[-100px]" aria-hidden="true" />

      <div className="max-w-3xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-xs font-mono tracking-wider uppercase text-accent border border-accent/20 rounded-full mb-6">
            Pre-diagnóstico
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Antes de hablar&hellip;{" "}
            <span className="gradient-text">entiende dónde estás parado.</span>
          </h2>
          <p className="text-muted text-lg">
            Responde esto. No te va a gustar todo.
            <br />
            Ese es el punto.
          </p>
        </AnimatedSection>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="space-y-6">
                {questions.map((question, i) => (
                  <div
                    key={i}
                    id={`question-${i}`}
                    className={`border-gradient p-6 transition-all duration-300 ${
                      isEmpty(i) ? "ring-1 ring-red-400/50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-mono text-accent">
                        {String(i + 1).padStart(2, "0")} /
                      </p>
                      <AnimatePresence>
                        {isEmpty(i) && (
                          <motion.span
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-xs text-red-400 font-mono"
                          >
                            Pendiente — si no sabes, pon N/A
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <p className="font-medium mb-4">{question}</p>
                    <textarea
                      rows={2}
                      placeholder="Tu respuesta... (si no sabes, escribe N/A)"
                      value={answers[i] ?? ""}
                      onChange={(e) =>
                        setAnswers((prev) => ({ ...prev, [i]: e.target.value }))
                      }
                      className={`w-full bg-surface-light border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none resize-none transition-colors ${
                        isEmpty(i)
                          ? "border-red-400/40 focus:border-red-400/60"
                          : "border-white/10 focus:border-accent/40"
                      }`}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <AnimatePresence>
                  {attempted && !allFilled && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-red-400 font-mono mb-4"
                    >
                      Faltan {emptyIndexes.length} respuesta{emptyIndexes.length !== 1 ? "s" : ""}.
                      Si no sabes algo, escribe N/A.
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 rounded-2xl font-semibold text-lg bg-accent hover:bg-accent-light text-white transition-all duration-300 cursor-pointer"
                >
                  Ver mi diagnóstico →
                </motion.button>
                <p className="mt-3 text-xs text-muted font-mono">
                  {filledCount}/{questions.length} respondidas
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="border-gradient p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className={`w-2 h-2 rounded-full ${loading ? "bg-accent animate-pulse" : "bg-green-400"}`} />
                  <span className="text-xs font-mono text-muted">
                    {loading ? "Analizando tu operación..." : "Análisis completado"}
                  </span>
                </div>

                {error ? (
                  <div className="space-y-4">
                    <p className="text-red-400 text-sm font-mono">{error}</p>
                    <button
                      onClick={() => { setSubmitted(false); setError(""); setDiagnosisText(""); }}
                      className="text-sm text-accent underline underline-offset-4"
                    >
                      Volver al formulario
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6 mb-10 min-h-[120px]">
                      {loading && !diagnosisText ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start gap-3">
                              <span className="text-accent font-mono mt-0.5">→</span>
                              <div className="flex-1 h-5 bg-white/5 rounded animate-pulse" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-5">
                          {diagnosisText
                            .split("\n")
                            .filter((line) => line.trim().startsWith("→"))
                            .map((line, i) => (
                              <motion.p
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.15 }}
                                className="flex items-start gap-3 text-lg"
                              >
                                <span className="text-accent font-mono mt-0.5 shrink-0">→</span>
                                <span>{line.replace(/^→\s*/, "")}</span>
                              </motion.p>
                            ))}
                          {loading && (
                            <span className="inline-block text-accent animate-pulse font-mono">▊</span>
                          )}
                        </div>
                      )}
                    </div>

                    {!loading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="border-t border-white/10 pt-8"
                      >
                        <p className="text-muted mb-2">Pero esto es solo la superficie.</p>
                        <p className="text-foreground font-medium mb-8">
                          El diagnóstico completo te muestra exactamente dónde estás perdiendo dinero y cómo recuperarlo.
                        </p>
                        <a
                          href={buildMailtoLink()}
                          className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-light text-white rounded-xl font-semibold transition-colors duration-300"
                        >
                          Quiero el diagnóstico completo →
                        </a>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
