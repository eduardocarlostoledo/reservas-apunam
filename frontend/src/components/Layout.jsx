import { Link, Outlet, useLocation } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/admin', label: 'Admin' },
];

const EXTERNAL_LINKS = [
  { href: 'https://geosapunam.com.ar', label: 'GEOS' },
  { href: 'https://apunam.net.ar/', label: 'Web Institucional' },
];

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-subtle flex flex-col">
      {/* Top bar */}
      <div className="bg-primary-dark text-primary-light text-xs py-1.5">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span>Asociación del Personal Universitario No Docente — Misiones</span>
          <div className="hidden sm:flex items-center gap-4">
            <a href="https://www.instagram.com/apunam_misiones/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href="https://www.facebook.com/apunamNodocentes/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
            <span>Tel: 376 4431065</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">AP</span>
            </div>
            <div className="leading-tight">
              <span className="text-primary text-lg font-bold tracking-tight block">APUNaM</span>
              <span className="text-muted text-[10px] hidden sm:block">Reserva de Salones</span>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.to
                    ? 'bg-primary-light text-primary'
                    : 'text-muted hover:bg-subtle hover:text-text'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {EXTERNAL_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:bg-subtle hover:text-text transition-colors hidden md:inline-block"
              >
                {link.label}
                <svg className="w-3 h-3 inline ml-1 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-light">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-10">
            {/* Col 1: Info */}
            <div>
              <h3 className="text-white font-bold text-lg mb-3">APUNaM</h3>
              <p className="text-sm leading-relaxed opacity-80">
                Asociación del Personal Universitario No Docente de la Universidad Nacional de Misiones.
                Afiliada a FATUN.
              </p>
            </div>

            {/* Col 2: Contacto */}
            <div>
              <h3 className="text-white font-bold text-lg mb-3">Contacto</h3>
              <div className="space-y-2 text-sm opacity-80">
                <p>Cnel. Félix Bogado 1821</p>
                <p>N3301JBN Posadas, Misiones</p>
                <p>Tel: 376 4431065</p>
              </div>
            </div>

            {/* Col 3: Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-3">Enlaces</h3>
              <div className="space-y-2 text-sm">
                <a href="https://geosapunam.com.ar" target="_blank" rel="noopener noreferrer" className="block opacity-80 hover:opacity-100 hover:text-white transition-opacity">
                  Sistema GEOS
                </a>
                <a href="https://apunam.net.ar/" target="_blank" rel="noopener noreferrer" className="block opacity-80 hover:opacity-100 hover:text-white transition-opacity">
                  Web Institucional
                </a>
                <a href="https://www.instagram.com/apunam_misiones/" target="_blank" rel="noopener noreferrer" className="block opacity-80 hover:opacity-100 hover:text-white transition-opacity">
                  Instagram
                </a>
                <a href="https://www.facebook.com/apunamNodocentes/" target="_blank" rel="noopener noreferrer" className="block opacity-80 hover:opacity-100 hover:text-white transition-opacity">
                  Facebook
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs opacity-60">&copy; {new Date().getFullYear()} APUNaM — Todos los derechos reservados</p>
            <p className="text-xs opacity-60">Desarrollado por Toledo Consultora IT</p>
          </div>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
}
