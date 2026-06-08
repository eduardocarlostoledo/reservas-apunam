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

export function crearReserva(data) {
  return api.post('/reservas', data).then(r => r.data);
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
