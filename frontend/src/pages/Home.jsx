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
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative bg-primary rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-primary/70" />
        <div className="relative px-8 py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm text-white/80 mb-6">
            <span className="w-2 h-2 bg-accent rounded-full" />
            Personal Universitario No Docente — UNaM
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Reservá tu salón<br className="hidden md:block" /> en nuestras sedes
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            Consultá disponibilidad y solicitá la reserva del salón que necesitás en Posadas, Oberá o Eldorado.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a href="#salones" className="bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
              Ver salones disponibles
            </a>
            <a href="https://geosapunam.com.ar" target="_blank" rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold text-sm backdrop-blur transition-colors">
              Acceder a GEOS
            </a>
          </div>
        </div>
      </section>

      {/* Aviso GEOS */}
      <section className="bg-warm border border-warm-border/30 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-warm-border/20 flex items-center justify-center text-warm-border shrink-0 text-lg">
          📢
        </div>
        <div>
          <h3 className="font-semibold text-text text-sm">Recordatorio para afiliados</h3>
          <p className="text-muted text-sm mt-0.5">
            Las Ayudas Económicas y Proveeduría se solicitan por el sistema{' '}
            <a href="https://geosapunam.com.ar" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">GEOS</a>.
          </p>
        </div>
      </section>

      {/* Salones */}
      <section id="salones">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-6">Nuestros salones</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {salones.map(salon => (
            <Link
              key={salon.id}
              to={`/salon/${salon.id}`}
              className="group bg-surface rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-200"
            >
              <div className="text-3xl mb-3">{LOCATION_ICONS[salon.ubicacion] || '📍'}</div>
              <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors">{salon.nombre}</h3>
              <p className="text-muted text-sm mt-1">{salon.ubicacion}, Misiones</p>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
                Ver disponibilidad
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Info institucional */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface rounded-2xl border border-border p-8">
          <h2 className="text-lg font-bold text-text mb-3">¿Quiénes somos?</h2>
          <p className="text-muted text-sm leading-relaxed">
            APUNaM es la Asociación del Personal Universitario No Docente de la Universidad Nacional de Misiones.
            Representamos y defendemos los derechos laborales de los trabajadores no docentes, promoviendo
            capacitación, acción social, cultura y bienestar para nuestros afiliados y sus familias.
          </p>
          <p className="text-muted text-sm leading-relaxed mt-3">
            Estamos afiliados a <strong className="text-text">FATUN</strong> (Federación Argentina del Trabajador de las Universidades Nacionales).
          </p>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-8">
          <h2 className="text-lg font-bold text-text mb-3">Servicios para afiliados</h2>
          <ul className="space-y-3">
            {[
              { icon: '🏠', text: 'Reserva de salones en Posadas, Oberá y Eldorado' },
              { icon: '💰', text: 'Ayudas económicas a través del sistema GEOS' },
              { icon: '🛒', text: 'Proveeduría para afiliados' },
              { icon: '📚', text: 'Capacitación y formación continua' },
              { icon: '⚖️', text: 'Representación gremial y asesoramiento' },
            ].map(s => (
              <li key={s.text} className="flex items-start gap-3 text-sm text-muted">
                <span className="text-base shrink-0">{s.icon}</span>
                {s.text}
              </li>
            ))}
          </ul>
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
                className="w-16 h-16 rounded-full mx-auto mb-3 object-cover ring-2 ring-primary-light"
              />
              <h3 className="text-sm font-semibold text-text leading-tight">{a.nombre}</h3>
              <p className="text-xs text-muted mt-1.5 leading-snug">{a.cargo}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contacto y mapa */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface rounded-2xl border border-border p-8">
          <h2 className="text-lg font-bold text-text mb-4">Sede Central — Posadas</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-base shrink-0">📍</span>
              <div>
                <p className="font-medium text-text">Dirección</p>
                <p className="text-muted">Cnel. Félix Bogado 1821, N3301JBN Posadas, Misiones</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-base shrink-0">📞</span>
              <div>
                <p className="font-medium text-text">Teléfono</p>
                <p className="text-muted">376 4431065</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-base shrink-0">📱</span>
              <div>
                <p className="font-medium text-text">Redes sociales</p>
                <div className="flex gap-3 mt-1">
                  <a href="https://www.instagram.com/apunam_misiones/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-muted hover:text-primary transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    Instagram
                  </a>
                  <a href="https://www.facebook.com/apunamNodocentes/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-muted hover:text-primary transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden border border-border h-72 md:h-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3543.5!2d-55.8967!3d-27.3678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9457b5080b0e3c7d%3A0x0!2sCnel.+F%C3%A9lix+Bogado+1821%2C+Posadas%2C+Misiones!5e0!3m2!1ses!2sar!4v1"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '288px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación APUNaM Posadas"
          />
        </div>
      </section>
    </div>
  );
}
