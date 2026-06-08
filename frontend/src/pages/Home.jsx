import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSalones } from '../services/api';

const AUTORIDADES = [
  { nombre: 'José R. Vallejos', cargo: 'Secretario General', foto: 'https://apunam.net.ar/wp-content/uploads/2023/07/Jose-Vallejos-150x150.jpeg' },
  { nombre: 'Miriam G. Caballero', cargo: 'Secretaria Adjunta', foto: 'https://apunam.net.ar/wp-content/uploads/2023/07/Miriam-Caballero-150x150.png' },
  { nombre: 'Javier A. Leguisa', cargo: 'Secretario Gremial', foto: 'https://apunam.net.ar/wp-content/uploads/2023/07/Leguisa-1-150x150.jpeg' },
  { nombre: 'Fernando J. Recio', cargo: 'Secretario de Hacienda y Finanzas', foto: 'https://apunam.net.ar/wp-content/uploads/2023/07/WhatsApp-Image-2023-02-13-at-16.26.19-150x150.jpeg' },
  { nombre: 'Paulina A. Nuñez', cargo: 'Secretaria de Acción Social', foto: 'https://apunam.net.ar/wp-content/uploads/2023/07/WhatsApp-Image-2023-02-13-at-16.25.30-1-150x150.jpeg' },
  { nombre: 'Susana Babi', cargo: 'Secretaria de Actas', foto: 'https://apunam.net.ar/wp-content/uploads/2023/07/WhatsApp-Image-2023-02-13-at-16.29.15-1-150x150.jpeg' },
  { nombre: 'Eduardo M. Mercado', cargo: 'Secretario de Cultura y Capacitación', foto: 'https://apunam.net.ar/wp-content/uploads/2023/07/Mercado-1-150x150.jpeg' },
  { nombre: 'María V. Pedraza', cargo: 'Sub-Secretaria de la Mujer y la Familia', foto: 'https://apunam.net.ar/wp-content/uploads/2023/07/Pedraza-150x150.jpeg' },
  { nombre: 'Cecilia N. Cabrera', cargo: 'Sub-Secretaria de Turismo y Deportes', foto: 'https://apunam.net.ar/wp-content/uploads/2023/07/WhatsApp-Image-2023-02-13-at-16.26.11-1-150x150.jpeg' },
];

const LOCATION_ICONS = {
  Posadas: '🏛️',
  Oberá: '🌿',
  Eldorado: '🌳',
};

export default function Home() {
  const [salones, setSalones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSalones()
      .then(setSalones)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center pt-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text">
          Reservá tu salón
        </h1>
        <p className="mt-4 text-lg text-muted max-w-xl mx-auto leading-relaxed">
          Consultá disponibilidad y solicitá la reserva del salón que necesitás en nuestras sedes.
        </p>
      </section>

      {/* Salones */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-6">Nuestros salones</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {salones.map(salon => (
            <Link
              key={salon.id}
              to={`/salon/${salon.id}`}
              className="group bg-surface rounded-2xl border border-border p-6 hover:shadow-lg hover:border-brand/30 transition-all duration-200"
            >
              <div className="text-3xl mb-3">{LOCATION_ICONS[salon.ubicacion] || '📍'}</div>
              <h3 className="text-lg font-semibold text-text group-hover:text-brand transition-colors">{salon.nombre}</h3>
              <p className="text-muted text-sm mt-1">{salon.ubicacion}</p>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand">
                Ver disponibilidad
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Autoridades */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-6">Autoridades</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {AUTORIDADES.map(a => (
            <div key={a.nombre} className="bg-surface rounded-2xl border border-border p-5 text-center hover:shadow-md transition-shadow duration-200">
              <img
                src={a.foto}
                alt={a.nombre}
                className="w-16 h-16 rounded-full mx-auto mb-3 object-cover ring-2 ring-border"
              />
              <h3 className="text-sm font-semibold text-text leading-tight">{a.nombre}</h3>
              <p className="text-xs text-muted mt-1.5 leading-snug">{a.cargo}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sede */}
      <section className="bg-surface rounded-2xl border border-border p-8 flex flex-col sm:flex-row items-start gap-6">
        <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center text-brand text-xl shrink-0">
          📍
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text">Sede Posadas</h2>
          <p className="text-muted text-sm mt-1">Felix Bogado 1833 — Posadas, Misiones</p>
          <p className="text-muted text-sm mt-0.5">Teléfono: <span className="text-text font-medium">376 4431065</span></p>
        </div>
      </section>
    </div>
  );
}
