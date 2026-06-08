import { useState, useEffect, useCallback } from 'react';
import { adminLogin, getAdminReservas, aprobarReserva, rechazarReserva, getSalones } from '../services/api';

const INPUT = 'w-full border border-border rounded-xl px-4 py-3 text-sm text-text bg-surface placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-colors';

function LoginForm({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token } = await adminLogin(usuario, password);
      localStorage.setItem('admin_token', token);
      onLogin();
    } catch {
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-light flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text">Panel Administrativo</h2>
          <p className="text-sm text-muted mt-1">Ingresá tus credenciales</p>
        </div>

        {error && <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Usuario</label>
            <input value={usuario} onChange={e => setUsuario(e.target.value)} required className={INPUT} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className={INPUT} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-brand text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-dark active:scale-[0.98] disabled:opacity-50 transition-all duration-150">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

const ESTADO_BADGE = {
  PENDIENTE: 'bg-amber-50 text-amber-700 border-amber-200',
  APROBADA: 'bg-green-50 text-green-700 border-green-200',
  RECHAZADA: 'bg-red-50 text-red-600 border-red-200',
  CANCELADA: 'bg-gray-50 text-gray-500 border-gray-200',
};

export default function Admin() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('admin_token'));
  const [reservas, setReservas] = useState([]);
  const [salones, setSalones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroSalon, setFiltroSalon] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchReservas = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filtroEstado) params.estado = filtroEstado;
      if (filtroSalon) params.salon_id = filtroSalon;
      const data = await getAdminReservas(params);
      setReservas(data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('admin_token');
        setAuthed(false);
      }
    } finally {
      setLoading(false);
    }
  }, [filtroEstado, filtroSalon]);

  useEffect(() => {
    if (authed) {
      fetchReservas();
      getSalones().then(setSalones).catch(() => {});
    }
  }, [authed, fetchReservas]);

  async function handleAprobar(id) {
    setActionLoading(id);
    try { await aprobarReserva(id); fetchReservas(); } catch {}
    setActionLoading(null);
  }

  async function handleRechazar(id) {
    setActionLoading(id);
    try { await rechazarReserva(id); fetchReservas(); } catch {}
    setActionLoading(null);
  }

  function handleLogout() {
    localStorage.removeItem('admin_token');
    setAuthed(false);
  }

  if (!authed) return <LoginForm onLogin={() => setAuthed(true)} />;

  const SELECT = 'border border-border rounded-xl px-4 py-2.5 text-sm bg-surface text-text focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-colors appearance-none cursor-pointer';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">Reservas</h1>
          <p className="text-sm text-muted mt-1">{reservas.length} solicitudes</p>
        </div>
        <button onClick={handleLogout}
          className="px-4 py-2 rounded-xl border border-border text-muted text-sm font-medium hover:bg-subtle hover:text-text transition-colors">
          Cerrar sesión
        </button>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className={SELECT}>
          <option value="">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="APROBADA">Aprobada</option>
          <option value="RECHAZADA">Rechazada</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
        <select value={filtroSalon} onChange={e => setFiltroSalon(e.target.value)} className={SELECT}>
          <option value="">Todos los salones</option>
          {salones.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reservas.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-border border-dashed p-12 text-center">
          <p className="text-muted">No hay reservas con estos filtros.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reservas.map(r => (
            <div key={r.id} className="bg-surface rounded-2xl border border-border p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-semibold text-text">{r.nombre_completo}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${ESTADO_BADGE[r.estado]}`}>
                    {r.estado}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted">
                  <span>{r.salon?.nombre || '-'}</span>
                  <span>{r.fecha_reserva}</span>
                  <span>DNI: {r.dni}</span>
                  <span>Afiliado: {r.numero_afiliado}</span>
                  <span>{r.email}</span>
                </div>
              </div>
              {r.estado === 'PENDIENTE' && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleAprobar(r.id)}
                    disabled={actionLoading === r.id}
                    className="px-4 py-2 rounded-xl bg-green-600 text-white text-xs font-semibold hover:bg-green-700 active:scale-[0.97] disabled:opacity-50 transition-all"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleRechazar(r.id)}
                    disabled={actionLoading === r.id}
                    className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 active:scale-[0.97] disabled:opacity-50 transition-all"
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
