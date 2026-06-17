import { useState, useEffect, useCallback } from 'react';
import { getUsuarios, createUsuario, updateUsuario, toggleUsuario, uploadUsuariosCSV } from '../services/api';

const INPUT = 'w-full border border-border rounded-xl px-4 py-3 text-sm text-text bg-surface placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors';
const BTN_PRIMARY = 'bg-primary text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50 transition-all duration-150';
const BTN_OUTLINE = 'px-4 py-2.5 rounded-xl border border-border text-muted font-medium text-sm hover:bg-subtle hover:text-text transition-colors';
const SELECT = 'border border-border rounded-xl px-4 py-2.5 text-sm bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors appearance-none cursor-pointer';

function UsuarioModal({ usuario, onSave, onClose }) {
  const [form, setForm] = useState({
    nro_legaj: usuario?.nro_legaj || '',
    nro_docum: usuario?.nro_docum || '',
    apellido: usuario?.apellido || '',
    nombre: usuario?.nombre || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = { ...form, nro_legaj: parseInt(form.nro_legaj, 10) };
      if (usuario) {
        await updateUsuario(usuario.id, data);
      } else {
        await createUsuario(data);
      }
      onSave();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0] || 'Error al guardar';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-border w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-text mb-4">
          {usuario ? 'Editar usuario' : 'Nuevo usuario'}
        </h3>

        {error && <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Nro Legajo</label>
              <input name="nro_legaj" type="number" value={form.nro_legaj} onChange={handleChange} required className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">DNI</label>
              <input name="nro_docum" value={form.nro_docum} onChange={handleChange} required className={INPUT} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Apellido</label>
            <input name="apellido" value={form.apellido} onChange={handleChange} required className={INPUT} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} required className={INPUT} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className={`flex-1 ${BTN_PRIMARY}`}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" onClick={onClose} className={BTN_OUTLINE}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvResult, setCsvResult] = useState(null);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (filtroActivo !== '') params.activo = filtroActivo;
      const data = await getUsuarios(params);
      setUsuarios(data.usuarios);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [page, search, filtroActivo]);

  useEffect(() => { fetchUsuarios(); }, [fetchUsuarios]);

  function handleSearch(e) {
    setSearch(e.target.value);
    setPage(1);
  }

  async function handleToggle(id) {
    try {
      await toggleUsuario(id);
      fetchUsuarios();
    } catch {}
  }

  async function handleCSV(e) {
    const file = e.target.files[0];
    if (!file) return;
    setCsvLoading(true);
    setCsvResult(null);
    try {
      const result = await uploadUsuariosCSV(file);
      setCsvResult(result);
      fetchUsuarios();
    } catch (err) {
      setCsvResult({ error: err.response?.data?.error || 'Error al subir CSV' });
    } finally {
      setCsvLoading(false);
      e.target.value = '';
    }
  }

  function handleSave() {
    setModal(null);
    fetchUsuarios();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text">Usuarios</h2>
          <p className="text-sm text-muted mt-1">{total} afiliados registrados</p>
        </div>
        <div className="flex gap-2">
          <label className={`${BTN_OUTLINE} cursor-pointer ${csvLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            {csvLoading ? 'Subiendo...' : 'Subir CSV'}
            <input type="file" accept=".csv" onChange={handleCSV} className="hidden" />
          </label>
          <button onClick={() => setModal('new')} className={BTN_PRIMARY}>Nuevo usuario</button>
        </div>
      </div>

      {csvResult && (
        <div className={`px-4 py-3 rounded-xl mb-4 text-sm border ${csvResult.error ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-700'}`}>
          {csvResult.error || csvResult.message}
          {csvResult.errors && csvResult.errors.length > 0 && (
            <ul className="mt-2 list-disc list-inside text-xs">
              {csvResult.errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}
          <button onClick={() => setCsvResult(null)} className="ml-3 underline text-xs">Cerrar</button>
        </div>
      )}

      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          value={search}
          onChange={handleSearch}
          placeholder="Buscar por nombre, apellido, legajo o DNI..."
          className={`${INPUT} max-w-sm`}
        />
        <select value={filtroActivo} onChange={e => { setFiltroActivo(e.target.value); setPage(1); }} className={SELECT}>
          <option value="">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : usuarios.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-border border-dashed p-12 text-center">
          <p className="text-muted">No hay usuarios registrados. Subí un archivo CSV o creá uno manualmente.</p>
        </div>
      ) : (
        <>
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-subtle">
                    <th className="text-left px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wide">Legajo</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wide">DNI</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wide">Apellido</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wide">Nombre</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wide">Estado</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wide">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.id} className="border-b border-border last:border-0 hover:bg-subtle/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-text">{u.nro_legaj}</td>
                      <td className="px-4 py-3 text-muted">{u.nro_docum}</td>
                      <td className="px-4 py-3 text-text">{u.apellido}</td>
                      <td className="px-4 py-3 text-text">{u.nombre}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${u.activo ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setModal(u)}
                            className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted hover:bg-subtle hover:text-text transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleToggle(u.id)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${u.activo ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-700 hover:bg-green-50'}`}
                          >
                            {u.activo ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`${BTN_OUTLINE} ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Anterior
              </button>
              <span className="text-sm text-muted px-3">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`${BTN_OUTLINE} ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {modal && (
        <UsuarioModal
          usuario={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
