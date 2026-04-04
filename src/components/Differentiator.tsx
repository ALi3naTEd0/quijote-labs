"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const differentials = [
  {
    not: "No somos agencia.",
    desc: "No entregamos cosas. Arreglamos cómo funciona tu negocio.",
  },
  {
    not: "No somos consultoría.",
    desc: "No te dejamos tareas. Las implementamos contigo.",
  },
  {
    not: "No somos desarrolladores.",
    desc: "No hacemos apps. Diseñamos cómo operas.",
  },
];

export default function Differentiator() {
  return (
    <section id="diferencial" className="relative py-32 overflow-hidden">
      <div className="glow-orb w-[500px] h-[500px] bg-accent bottom-[-100px] left-[-200px]" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-xs font-mono tracking-wider uppercase text-white border border-accent/30 rounded-full bg-accent/10 mb-6">
            Lo que no somos
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="gradient-text">No vendemos código.</span>
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Diseñamos sistemas que hacen que tu negocio venda, cobre y opere sin que tú estés encima.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {differentials.map((item, i) => (
            <AnimatedSection key={item.not} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -4 }}
                className="border-gradient p-8 h-full"
              >
                <div className="text-red-400/80 font-mono text-sm mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  {item.not}
                </div>
                <p className="text-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* When we enter */}
        <AnimatedSection>
          <div className="text-center border-gradient p-12 max-w-3xl mx-auto">
            <p className="text-lg text-muted mb-4">
              Entramos cuando el negocio ya vende&hellip;{" "}
              <span className="text-foreground font-medium">
                pero sigue dependiendo de apagar fuegos.
              </span>
            </p>
            <p className="text-2xl font-bold gradient-text">
              Más esfuerzo no lo va a arreglar.<br />
              <span className="text-foreground">Más estructura, sí.</span>
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
