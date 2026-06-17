import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getSalones() {
  return api.get('/salones').then(r => r.data);
}

export function getDisponibilidad(salonId, mes, anio) {
  return api.get(`/salones/disponibilidad/${salonId}`, { params: { mes, anio } }).then(r => r.data);
}

export function crearReserva(data, userToken) {
  const headers = userToken ? { Authorization: `Bearer ${userToken}` } : {};
  return api.post('/reservas', data, { headers }).then(r => r.data);
}

export function adminLogin(usuario, password) {
  return api.post('/admin/login', { usuario, password }).then(r => r.data);
}

export function getAdminReservas(params) {
  return api.get('/admin/reservas', { params }).then(r => r.data);
}

export function aprobarReserva(id) {
  return api.patch(`/admin/reservas/${id}/aprobar`).then(r => r.data);
}

export function rechazarReserva(id) {
  return api.patch(`/admin/reservas/${id}/rechazar`).then(r => r.data);
}

// --- Usuarios ---

export function loginUsuario(nro_legaj, nro_docum) {
  return api.post('/usuarios/login', { nro_legaj, nro_docum }).then(r => r.data);
}

export function getUsuarios(params) {
  return api.get('/admin/usuarios', { params }).then(r => r.data);
}

export function getUsuario(id) {
  return api.get(`/admin/usuarios/${id}`).then(r => r.data);
}

export function createUsuario(data) {
  return api.post('/admin/usuarios', data).then(r => r.data);
}

export function updateUsuario(id, data) {
  return api.put(`/admin/usuarios/${id}`, data).then(r => r.data);
}

export function toggleUsuario(id) {
  return api.patch(`/admin/usuarios/${id}/toggle`).then(r => r.data);
}

export function uploadUsuariosCSV(file) {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/admin/usuarios/upload-csv', formData).then(r => r.data);
}
