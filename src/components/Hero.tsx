"use client";

import { motion } from "framer-motion";

const phrases = [
  "✓ Más clientes sin perseguirlos",
  "✓ Menos errores que te cuestan dinero",
  "✓ Un negocio que funciona aunque no estés",
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg pt-20 sm:pt-24">
      {/* Background orbs */}
      <div
        className="glow-orb w-[600px] h-[600px] bg-accent top-[-200px] left-[-200px]"
        aria-hidden="true"
      />
      <div
        className="glow-orb w-[400px] h-[400px] bg-accent bottom-[-100px] right-[-100px]"
        aria-hidden="true"
      />

      {/* Floating grid lines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.06 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full"
            style={{ top: `${20 + i * 15}%` }}
            animate={{ x: ["-10%", "10%", "-10%"] }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 backdrop-blur-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm text-white font-mono">
            Locura con estructura
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6"
        >
          <span className="gradient-text">Quijote</span>{" "}
          <span className="text-foreground">Labs</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl text-muted max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          <span className="text-muted font-mono">$</span>{" "}
          <span className="text-green-400">
            Si tu negocio depende de ti, no es negocio. Es autoempleo caro.
          </span>{" "}
          <span className="animate-pulse">▊</span>
        </motion.p>

        {/* Rotating phrases */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {phrases.map((phrase, i) => (
            <motion.span
              key={phrase}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 + i * 0.15 }}
              className="px-4 py-2 text-sm font-mono text-white border border-accent/30 rounded-lg bg-accent/10"
            >
              {phrase}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#sancho"
            className="group relative px-8 py-4 bg-accent hover:bg-accent-light text-white rounded-xl font-medium transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Ver SANCHO</span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
          <a
            href="#contacto"
            className="px-8 py-4 border border-white/10 hover:border-accent/30 text-foreground rounded-xl font-medium transition-all duration-300 hover:bg-white/5"
          >
            Diagnosticar mi caos
          </a>
        </motion.div>

      </div>
    </section>
  );
}
