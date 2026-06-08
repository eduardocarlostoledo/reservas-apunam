# APUNAM — Sistema de Reserva de Salones

Sistema web para reserva de salones de APUNAM (Mutual Universitaria).  
Tres salones: Posadas, Oberá, Eldorado.

## Stack

- **Frontend:** React 19 + Vite + TailwindCSS + React Router + React Hook Form
- **Backend:** Node.js + Express + Sequelize + PostgreSQL
- **Emails:** Resend API
- **Deploy:** Frontend en Netlify, Backend en Railway

## Desarrollo local

### Requisitos

- Node.js 18+
- PostgreSQL

### Backend

```bash
cd backend
cp .env.example .env    # editar con credenciales locales
npm install
npm run seed            # crea tablas, salones y admin
npm run dev
```

Server en `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App en `http://localhost:5173` (proxy a backend configurado en Vite)

## Deploy

### Backend (Railway)

1. Crear proyecto en Railway con PostgreSQL
2. Conectar repo o subir código
3. Variables de entorno en Railway:
   - `DATABASE_URL` (provisto por Railway)
   - `JWT_SECRET`
   - `ADMIN_USER`
   - `ADMIN_PASSWORD`
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
   - `FRONTEND_URL` (URL de Netlify)
   - `NODE_ENV=production`
4. Start command: `npm start`
5. Ejecutar seed: `npm run seed`

### Frontend (Netlify)

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Variables de entorno:
   - `VITE_API_URL` = URL del backend en Railway
4. Agregar `_redirects` para SPA:
   ```
   /*    /index.html   200
   ```

## Variables de entorno

### Backend (.env)

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string PostgreSQL (Railway) |
| `DB_HOST` | Host DB local |
| `DB_PORT` | Puerto DB |
| `DB_NAME` | Nombre DB |
| `DB_USER` | Usuario DB |
| `DB_PASSWORD` | Contraseña DB |
| `PORT` | Puerto del server |
| `JWT_SECRET` | Secret para JWT |
| `ADMIN_USER` | Usuario admin inicial |
| `ADMIN_PASSWORD` | Contraseña admin inicial |
| `RESEND_API_KEY` | API key de Resend |
| `EMAIL_FROM` | Email remitente |
| `FRONTEND_URL` | URL del frontend (CORS) |

### Frontend (.env)

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base del API (vacío en dev) |

## API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/salones` | Lista salones activos |
| GET | `/api/salones/disponibilidad/:id` | Disponibilidad mensual |
| POST | `/api/reservas` | Crear solicitud de reserva |
| POST | `/api/admin/login` | Login admin |
| GET | `/api/admin/reservas` | Listar reservas (filtros) |
| PATCH | `/api/admin/reservas/:id/aprobar` | Aprobar reserva |
| PATCH | `/api/admin/reservas/:id/rechazar` | Rechazar reserva |

## Validación de afiliados

Actualmente usa archivo CSV en `backend/data/afiliados.csv`.
Formato: `dni,numero_afiliado`. Si el CSV está vacío o no existe, permite todas las solicitudes.
Diseñado para migrar a tabla PostgreSQL sin cambiar lógica de controllers.
