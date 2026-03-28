export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 bg-accent rounded-md rotate-45" />
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                Q
              </span>
            </div>
            <span className="font-semibold tracking-tight">
              Quijote <span className="text-muted font-normal">Labs</span>
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
