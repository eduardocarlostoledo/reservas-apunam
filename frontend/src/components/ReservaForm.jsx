import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { crearReserva } from '../services/api';

const INPUT = 'w-full border border-border rounded-xl px-4 py-3 text-sm text-text bg-surface placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors';
const INPUT_READONLY = 'w-full border border-border rounded-xl px-4 py-3 text-sm text-muted bg-subtle cursor-not-allowed';

export default function ReservaForm({ salonId, fecha, salonNombre, usuario, onSuccess, onCancel }) {
  const nombreCompleto = usuario ? `${usuario.apellido} ${usuario.nombre}` : '';

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      nombre_completo: nombreCompleto,
      dni: usuario?.nro_docum || '',
      numero_afiliado: usuario ? String(usuario.nro_legaj) : '',
      telefono: '',
      email: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(data) {
    setLoading(true);
    setError('');
    try {
      const userToken = localStorage.getItem('user_token');
      await crearReserva({ salon_id: salonId, fecha_reserva: fecha, ...data }, userToken);
      onSuccess?.();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0] || 'Error al enviar solicitud';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface rounded-2xl border border-border p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-text">Solicitar reserva</h3>
        <p className="text-sm text-muted mt-1">{salonNombre} — {fecha}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Nombre completo</label>
          <input {...register('nombre_completo')} readOnly className={INPUT_READONLY} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">DNI</label>
            <input {...register('dni')} readOnly className={INPUT_READONLY} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">N° Legajo</label>
            <input {...register('numero_afiliado')} readOnly className={INPUT_READONLY} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Teléfono</label>
            <input {...register('telefono', { required: 'Requerido' })} className={INPUT} />
            {errors.telefono && <span className="text-red-500 text-xs mt-1 block">{errors.telefono.message}</span>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Email</label>
            <input type="email" {...register('email', { required: 'Requerido', pattern: { value: /^\S+@\S+$/, message: 'Email inválido' } })} className={INPUT} />
            {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Observaciones</label>
          <textarea {...register('observaciones')} rows={3} className={INPUT} />
        </div>

        <div className="flex gap-3 pt-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-accent text-white py-3 rounded-xl font-semibold text-sm hover:bg-accent-dark active:scale-[0.98] disabled:opacity-50 transition-all duration-150"
          >
            {loading ? 'Enviando...' : 'Solicitar Reserva'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-xl border border-border text-muted font-medium text-sm hover:bg-subtle transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
