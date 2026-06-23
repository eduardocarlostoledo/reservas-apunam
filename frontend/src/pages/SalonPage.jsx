import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDisponibilidad } from '../services/api';
import Calendar from '../components/Calendar';
import ReservaForm from '../components/ReservaForm';
import LoginUsuario from '../components/LoginUsuario';

function ScrollTo({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
  return <div ref={ref} className="scroll-mt-20">{children}</div>;
}

function getUserData() {
  try {
    const token = localStorage.getItem('user_token');
    const data = localStorage.getItem('user_data');
    if (token && data) return JSON.parse(data);
  } catch {}
  return null;
}

export default function SalonPage() {
  const { id } = useParams();
  const [salon, setSalon] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(getUserData);

  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1);
  const [viewYear, setViewYear] = useState(now.getFullYear());

  const fetchData = useCallback(() => {
    setLoading(true);
    getDisponibilidad(id, viewMonth, viewYear)
      .then(data => { setSalon(data.salon); setReservas(data.reservas); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, viewMonth, viewYear]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function handleLogin(userData) {
    setUsuario(userData);
  }

  function handleLogout() {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    setUsuario(null);
    setSelectedDate(null);
  }

  function handleSuccess() {
    setSuccess(true);
    setSelectedDate(null);
    fetchData();
  }

  if (loading && !salon) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="bg-surface rounded-2xl border border-border p-10 max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text mb-2">Solicitud enviada</h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Tu solicitud fue registrada y queda pendiente de aprobación. Recibirás un email de confirmación.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setSuccess(false)}
              className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors"
            >
              Volver al calendario
            </button>
            <Link to="/" className="px-5 py-2.5 rounded-xl border border-border text-muted font-medium text-sm hover:bg-subtle transition-colors">
              Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div>
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-text transition-colors mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Volver a salones
        </Link>

        {salon && (
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-text">{salon.nombre}</h1>
            <p className="text-muted mt-1">{salon.ubicacion}, Misiones</p>
          </div>
        )}

        <ScrollTo>
          <LoginUsuario onLogin={handleLogin} />
        </ScrollTo>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-text transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Volver a salones
      </Link>

      {salon && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-text">{salon.nombre}</h1>
              <p className="text-muted mt-1">{salon.ubicacion}, Misiones</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted">
                {usuario.apellido}, {usuario.nombre}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted hover:bg-subtle hover:text-text transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            06:00 a 00:00 hs — Reserva por día completo
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <Calendar
          reservas={reservas}
          onSelectDate={setSelectedDate}
          selectedDate={selectedDate}
        />

        {selectedDate ? (
          <ReservaForm
            salonId={parseInt(id)}
            fecha={selectedDate}
            salonNombre={salon?.nombre}
            usuario={usuario}
            onSuccess={handleSuccess}
            onCancel={() => setSelectedDate(null)}
          />
        ) : (
          <div className="bg-surface rounded-2xl border border-border border-dashed p-10 text-center">
            <div className="text-3xl mb-3">📅</div>
            <p className="text-muted text-sm leading-relaxed">
              Seleccioná una fecha disponible en el calendario para solicitar tu reserva.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
