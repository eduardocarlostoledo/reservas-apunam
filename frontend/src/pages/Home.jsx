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

const IconBuilding = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
  </svg>
);

const IconLeaf = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 21c2-4 5-8 14-14 0 0-1 9-7 13s-7 1-7 1z" />
    <path d="M6 21c1-2 3-4 6-6" />
  </svg>
);

const IconTree = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l-7 9h4l-5 8h16l-5-8h4L12 3zM12 20v2" />
  </svg>
);

const IconPin = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s-7-6-7-11a7 7 0 1 1 14 0c0 5-7 11-7 11z" />
    <circle cx="12" cy="11" r="2.5" />
  </svg>
);

const LOCATION_ICONS = {
  Posadas: <IconBuilding className="w-8 h-8 text-primary" />,
  Oberá: <IconLeaf className="w-8 h-8 text-primary" />,
  Eldorado: <IconTree className="w-8 h-8 text-primary" />,
};

const DEFAULT_LOCATION_ICON = <IconPin className="w-8 h-8 text-primary" />;

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
    <div className="space-y-10 sm:space-y-16">
      {/* Hero */}
      <section className="relative bg-primary rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-primary/70" />
        <div className="relative px-4 sm:px-8 py-10 sm:py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-white/80 mb-4 sm:mb-6">
            <span className="w-2 h-2 bg-accent rounded-full shrink-0" />
            Personal Universitario No Docente — UNaM
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Reservá tu salón<br className="hidden md:block" /> en nuestras sedes
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            Consultá disponibilidad y solicitá la reserva del salón que necesitás en Posadas, Oberá o Eldorado.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => document.getElementById('salones')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              Ver salones disponibles
            </button>
            {/* <a href="https://geosapunam.com.ar" target="_blank" rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold text-sm backdrop-blur transition-colors">
              Acceder a GEOS
            </a> */}
          </div>
        </div>
      </section>

      {/* Aviso reserva */}
      <section className="bg-warm border border-warm-border/30 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-warm-border/20 flex items-center justify-center text-warm-border shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11h2l3-6v14l-3-6H3V11zM10 8v8M14 6v12M18 9v6M22 10v4" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-text text-sm">Reserva de salones</h3>
          <p className="text-muted text-sm mt-0.5">
            Los salones se pueden reservar directamente desde esta web seleccionando uno de los disponibles.
            Iniciá sesión con tu Legajo y DNI respectivamente.
          </p>
        </div>
      </section>

      {/* Formulario afiliación */}
      <section className="bg-surface border border-border rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-text text-sm">Formulario de afiliación</h3>
          <p className="text-muted text-sm mt-0.5">
            Descargá el formulario para afiliarte a APUNaM.
          </p>
          <a
            href="/afiliacion.docx"
            download
            className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Descargar formulario
          </a>
        </div>
      </section>

      {/* Salones */}
      <section id="salones" className="scroll-mt-20">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-6">Nuestros salones</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {salones.map(salon => (
            <Link
              key={salon.id}
              to={`/salon/${salon.id}`}
              className="group bg-surface rounded-2xl border border-border p-4 sm:p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-200"
            >
              <div className="mb-3">{LOCATION_ICONS[salon.ubicacion] || DEFAULT_LOCATION_ICON}</div>
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
      <section className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-surface rounded-2xl border border-border p-5 sm:p-8">
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
        <div className="bg-surface rounded-2xl border border-border p-5 sm:p-8">
          <h2 className="text-lg font-bold text-text mb-3">Servicios para afiliados</h2>
          <ul className="space-y-3">
            {[
              { icon: <IconBuilding className="w-5 h-5 text-primary shrink-0" />, text: 'Reserva de salones en Posadas, Oberá y Eldorado' },
              // { icon: (
              //   <svg className="w-5 h-5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              //     <path d="M12 3v18M16 6H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H8" />
              //   </svg>
              // ), text: 'Ayudas económicas a través del sistema GEOS' },
              // { icon: (
              //   <svg className="w-5 h-5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              //     <path d="M5 8h14l1 12H4L5 8zM8 8V6a4 4 0 0 1 8 0v2" />
              //   </svg>
              // ), text: 'Proveeduría para afiliados' },
              { icon: (
                <svg className="w-5 h-5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19V5a2 2 0 0 1 2-2h12v14H6a2 2 0 0 0 0 4h12" />
                </svg>
              ), text: 'Capacitación y formación continua' },
              { icon: (
                <svg className="w-5 h-5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18M8 21h8M4 7h16M6 7l-2 5c0 2 2 3 4 3s4-1 4-3l-2-5M16 7l-2 5c0 2 2 3 4 3s4-1 4-3l-2-5" />
                </svg>
              ), text: 'Representación gremial y asesoramiento' },
            ].map(s => (
              <li key={s.text} className="flex items-start gap-3 text-sm text-muted">
                {s.icon}
                {s.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Autoridades */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-6">Autoridades</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {AUTORIDADES.map(a => (
            <div key={a.nombre} className="bg-surface rounded-2xl border border-border p-3 sm:p-5 text-center hover:shadow-md transition-shadow duration-200">
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
      <section className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-surface rounded-2xl border border-border p-5 sm:p-8">
          <h2 className="text-lg font-bold text-text mb-4">Sede Central — Posadas</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <IconPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-text">Dirección</p>
                <p className="text-muted">Cnel. Félix Bogado 1821, N3301JBN Posadas, Misiones</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <div>
                <p className="font-medium text-text">Teléfono</p>
                <p className="text-muted">376 4431065</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
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
