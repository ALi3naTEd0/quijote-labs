export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-mark.svg" width={28} height={28} alt="Quijote Labs" />
            <span className="font-bold tracking-[0.1em] uppercase text-sm">
              Quijote <span className="text-accent-light">Labs</span>
            </span>
          </div>

          {/* Tagline */}
          <p className="text-sm text-muted text-center">
            Tu desorden no es creatividad.
          </p>

          {/* Copyright */}
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Quijote Labs. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
