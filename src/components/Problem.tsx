"use client";

import AnimatedSection from "./AnimatedSection";

const problems = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    ),
    title: "Dependencia de personas",
    desc: "Si se va tu mejor empleado, se va medio negocio con él.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
      </svg>
    ),
    title: "Intuición disfrazada de estrategia",
    desc: "Tomas decisiones con el estómago y le llamas experiencia.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
    title: "Crecer no es escalar",
    desc: "Vendes más. Trabajas más. Ganas igual. Eso no es crecimiento.",
  },
];

export default function Problem() {
  return (
    <section id="problema" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-mono tracking-wider uppercase text-white border border-accent/30 rounded-full bg-accent/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
              El Diagnóstico
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Tu negocio funciona{" "}
            <span className="gradient-text">de milagro</span>
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            No de sistema. Y los milagros no escalan.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, i) => (
            <AnimatedSection key={problem.title} delay={i * 0.15}>
              <div className="border-gradient p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent-light flex items-center justify-center mb-5">
                  {problem.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
                <p className="text-muted leading-relaxed">{problem.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
