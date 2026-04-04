"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const plans = [
  {
    name: "Diagnóstico SANCHO",
    desc: "Detectamos fugas de dinero, procesos rotos y cuellos de botella.",
    price: "$3,000 – $10,000 MXN",
    note: "Si trabajas con nosotros, se descuenta del proyecto.",
  },
  {
    name: "Implementación",
    desc: "Convertimos el diagnóstico en un sistema real funcionando.",
    price: "Desde $25,000 MXN",
    note: "Cada negocio es distinto. Esto no es plantilla.",
  },
  {
    name: "A la medida",
    desc: "Si tu operación es más compleja, lo diseñamos desde cero.",
    price: "Personalizado",
    note: "Más complejo, más retorno.",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-32 overflow-hidden">
      <div className="glow-orb w-[500px] h-[500px] bg-accent top-[-100px] right-[-200px]" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-6 text-center">
        <AnimatedSection>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-mono tracking-wider uppercase text-white border border-accent/30 rounded-full bg-accent/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
              Inversión
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="gradient-text">Empieza entendiendo tu caos.</span>
            <br />
            <span className="text-foreground text-3xl sm:text-4xl font-medium">
              Luego decides si lo arreglamos juntos.
            </span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {plans.map((plan, i) => (
            <AnimatedSection key={plan.name} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -4 }}
                className="border-gradient p-8 h-full text-left"
              >
                <div className="w-8 h-0.5 bg-accent/50 mb-5 rounded-full" />
                <h3 className="font-bold text-xl mb-4">{plan.name}</h3>
                <p className="text-muted mb-6 leading-relaxed">{plan.desc}</p>
                <p className="text-2xl font-bold mb-4 text-accent-light whitespace-nowrap">{plan.price}</p>
                <p className="text-sm text-muted">{plan.note}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
