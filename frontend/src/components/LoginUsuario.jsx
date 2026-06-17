import { useState } from 'react';
import { loginUsuario } from '../services/api';

const INPUT = 'w-full border border-border rounded-xl px-4 py-3 text-sm text-text bg-surface placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors';

export default function LoginUsuario({ onLogin }) {
  const [nroLegaj, setNroLegaj] = useState('');
  const [nroDocum, setNroDocum] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginUsuario(parseInt(nroLegaj, 10), nroDocum);
      localStorage.setItem('user_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.usuario));
      onLogin(data.usuario);
    } catch {
      setError('Credenciales inválidas. Verificá tu número de legajo y DNI.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text">Acceso Afiliados</h2>
          <p className="text-sm text-muted mt-1">Ingresá tus datos para reservar</p>
        </div>

        {error && <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Número de Legajo</label>
            <input
              type="number"
              value={nroLegaj}
              onChange={e => setNroLegaj(e.target.value)}
              required
              placeholder="Ej: 2954"
              className={INPUT}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">DNI</label>
            <input
              value={nroDocum}
              onChange={e => setNroDocum(e.target.value)}
              required
              placeholder="Ej: 23383450"
              className={INPUT}
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-accent text-white py-3 rounded-xl font-semibold text-sm hover:bg-accent-dark active:scale-[0.98] disabled:opacity-50 transition-all duration-150">
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
