import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-subtle flex flex-col">
      <header className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-brand text-2xl font-bold tracking-tight">APUNAM</span>
            <span className="hidden sm:inline text-muted text-sm font-normal">Reserva de Salones</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                pathname === '/' ? 'bg-brand-light text-brand' : 'text-muted hover:bg-subtle'
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                pathname === '/admin' ? 'bg-brand-light text-brand' : 'text-muted hover:bg-subtle'
              }`}
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-muted text-sm">&copy; {new Date().getFullYear()} APUNAM — Mutual Universitaria</p>
          <p className="text-muted text-xs">Felix Bogado 1833, Posadas — Tel: 376 4431065</p>
        </div>
      </footer>
    </div>
  );
}
