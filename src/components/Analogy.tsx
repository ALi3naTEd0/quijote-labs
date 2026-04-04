"use client";

import AnimatedSection from "./AnimatedSection";

export default function Analogy() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <AnimatedSection>
          <div className="border-gradient p-12 md:p-16 text-center">
            <div className="max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 text-xs font-mono tracking-wider uppercase text-white/40 border border-white/10 rounded-full mb-8">
                La Filosofía
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                Tú eres{" "}
                <span className="gradient-text">Quijote</span>
                <br />
                <span className="text-muted text-2xl sm:text-3xl lg:text-4xl">
                  La locura, la visión, el impulso.
                </span>
              </h2>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                Nosotros somos{" "}
                <span className="gradient-text">Sancho</span>
                <br />
                <span className="text-muted text-2xl sm:text-3xl lg:text-4xl">
                  El que hace que la locura funcione.
                </span>
              </h3>
              <div className="w-16 h-px bg-white/10 mx-auto mb-8" />
              <p className="text-lg text-muted italic">
                &ldquo;Toda empresa empieza con una idea&hellip;
                las que crecen, la vuelven sistema.&rdquo;
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
