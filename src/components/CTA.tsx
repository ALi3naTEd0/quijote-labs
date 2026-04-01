"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

export default function CTA() {
  return (
    <section id="contacto" className="relative py-32 overflow-hidden">
      <div className="glow-orb w-[600px] h-[600px] bg-accent top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />

      <div className="max-w-4xl mx-auto px-6 text-center">
        <AnimatedSection>
          <span className="inline-block px-4 py-1.5 text-xs font-mono tracking-wider uppercase text-accent border border-accent/20 rounded-full mb-8">
            El Momento
          </span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Menos juntas para planear juntas.{" "}
            <span className="gradient-text">Más Quijote Labs.</span>
          </h2>

          <p className="text-xl text-muted max-w-2xl mx-auto mb-12">
            Si llegaste hasta aquí, ya sabes que algo está mal.
            El primer paso es admitirlo.
          </p>

          {/* Key phrases */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              "Tu desorden no es creatividad.",
              "Si no hay sistema, hay suerte.",
              "Tu negocio merece más que improvisación.",
            ].map((phrase) => (
              <motion.span
                key={phrase}
                whileHover={{ scale: 1.05 }}
                className="px-5 py-2.5 text-sm font-mono text-accent-light border border-accent/20 rounded-full bg-accent/5 hover:bg-accent/10 transition-colors cursor-default"
              >
                {phrase}
              </motion.span>
            ))}
          </div>

          <motion.a
            href="mailto:admin@quijotelabs.com"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-10 py-5 bg-accent hover:bg-accent-light text-white rounded-2xl font-semibold text-lg transition-colors duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Diagnosticar mi negocio →</span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>

          <p className="mt-6 text-sm text-muted">
            admin@quijotelabs.com
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
