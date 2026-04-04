"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
      </svg>
    ),
    title: "Procesos que generan dinero",
    desc: "Cada paso tiene un objetivo: vender más, cobrar mejor o no perder clientes.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
    title: "Automatización útil",
    desc: "Lo repetitivo se va. Lo importante se queda contigo.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    title: "Números incómodos (pero necesarios)",
    desc: "Ves exactamente dónde estás perdiendo dinero.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    title: "Gente que sabe qué hacer",
    desc: "Sin perseguir. Sin repetir. Sin adivinar.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    title: "Menos intuición cara",
    desc: "Más decisiones que sí funcionan.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
    title: "Tu negocio en el bolsillo",
    desc: "Sin llamadas. Sin depender de nadie.",
  },
];

export default function Sancho() {
  return (
    <section id="sancho" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="glow-orb w-[600px] h-[600px] bg-accent top-0 right-[-200px]" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <AnimatedSection className="text-center mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-mono tracking-wider uppercase text-white border border-accent/30 rounded-full bg-accent/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
              El Sistema
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">SANCHO</span>
          </h2>
          <p className="text-xl text-muted max-w-3xl mx-auto mb-4">
            Ventas, operaciones y dinero en un solo sistema que trabaja por ti 24/7.
          </p>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Menos Excel. Menos WhatsApp. Menos &ldquo;se me fue&rdquo;.
            Más control. Más claridad. Más dinero.
          </p>
        </AnimatedSection>

        {/* What SANCHO is */}
        <AnimatedSection delay={0.2} className="mb-20">
          <div className="relative max-w-4xl mx-auto">
            <div className="border-gradient p-8 md:p-12">
              <p className="text-lg text-muted leading-relaxed mb-10 max-w-2xl">
                SANCHO no es un software genérico que instalas y ya. Es el sistema
                integral que diseñamos <span className="text-foreground font-medium">contigo y para tu negocio</span> —
                desde cero, ajustado a tu operación real.
              </p>

              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  {
                    area: "Ventas",
                    desc: "Pipeline claro, seguimiento automático, sin depender de que alguien recuerde llamar.",
                  },
                  {
                    area: "Operaciones",
                    desc: "Procesos documentados y ejecutados sin que tengas que estar tú para que funcionen.",
                  },
                  {
                    area: "Finanzas",
                    desc: "Números en tiempo real. Sabes exactamente qué entra, qué sale y dónde se va.",
                  },
                ].map((item) => (
                  <motion.div
                    key={item.area}
                    whileHover={{ y: -4 }}
                    className="bg-surface-light rounded-xl p-6 border border-white/5"
                  >
                    <div className="w-1 h-8 bg-accent rounded-full mb-4" />
                    <h3 className="font-bold text-lg mb-2">{item.area}</h3>
                    <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <p className="mt-10 text-muted text-sm border-t border-white/5 pt-8">
                El resultado: menos Excel, menos WhatsApp, menos &ldquo;se me olvidó&rdquo;.
                Un sistema que trabaja aunque tú no estés mirando.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <AnimatedSection key={feature.title} delay={i * 0.1}>
              <div className="border-gradient p-6 h-full hover:bg-surface-light/50 transition-colors duration-300">
                <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent-light flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
