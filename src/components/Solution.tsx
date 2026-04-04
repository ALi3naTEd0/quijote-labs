"use client";

import AnimatedSection from "./AnimatedSection";

export default function Solution() {
  return (
    <section id="solucion" className="relative py-32 overflow-hidden">
      {/* Background glow */}
      <div className="glow-orb w-[500px] h-[500px] bg-accent top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 text-xs font-mono tracking-wider uppercase text-white/40 border border-white/10 rounded-full mb-6">
              La Intervención
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              No te damos herramientas.{" "}
              <span className="gradient-text">
                Te damos estructura.
              </span>
            </h2>
            <p className="text-lg text-muted mb-8 leading-relaxed">
              Entramos a tu operación, encontramos el caos,
              y lo convertimos en un sistema que no depende de ti.
            </p>
            <div className="flex flex-col gap-4">
              {[
                "Procesos que no dependen de nadie",
                "Tareas que se ejecutan solas",
                "Software que trabaja por ti",
                "Decisiones con datos, no con corazonadas",
              ].map((item, i) => (
                <AnimatedSection key={item} delay={0.1 + i * 0.1}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4 text-white/50"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <span className="text-foreground">{item}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>

          {/* Right: visual */}
          <AnimatedSection delay={0.3}>
            <div className="relative">
              <div className="border-gradient p-8">
                <div className="space-y-4">
                  {/* Terminal-style display */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    <span className="ml-3 text-xs text-muted font-mono">
                      quijote-labs:~
                    </span>
                  </div>

                  <div className="font-mono text-sm space-y-3">
                    <div>
                      <span className="text-muted">$</span>{" "}
                      <span className="text-muted">diagnosticar</span>{" "}
                      <span className="text-foreground">--negocio</span>
                    </div>
                    <div className="text-muted text-xs pl-4 border-l-2 border-white/10">
                      Encontrando lo que nadie quiere ver...
                      <br />
                      Midiendo el caos real...
                      <br />
                      Identificando dónde se fuga el dinero...
                    </div>
                    <div>
                      <span className="text-muted">$</span>{" "}
                      <span className="text-muted">diseñar</span>{" "}
                      <span className="text-foreground">--sistema</span>
                    </div>
                    <div className="text-muted text-xs pl-4 border-l-2 border-green-500/30">
                      <span className="text-green-400">✓</span> Procesos
                      que funcionan sin ti
                      <br />
                      <span className="text-green-400">✓</span> Tareas
                      que nadie tiene que recordar
                      <br />
                      <span className="text-green-400">✓</span> Negocio
                      que opera en serio
                    </div>
                    <div>
                      <span className="text-muted">$</span>{" "}
                      <span className="text-green-400">
                        Caos eliminado. Ahora sí puedes crecer.
                      </span>
                      <span className="animate-pulse">▊</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
