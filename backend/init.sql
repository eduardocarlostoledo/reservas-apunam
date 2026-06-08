CREATE DATABASE apunam;

\c apunam;

CREATE TABLE salones (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  ubicacion VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT TRUE
);

CREATE TYPE estado_reserva AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA', 'CANCELADA');

CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  salon_id INTEGER NOT NULL REFERENCES salones(id),
  nombre_completo VARCHAR(200) NOT NULL,
  dni VARCHAR(20) NOT NULL,
  numero_afiliado VARCHAR(50) NOT NULL,
  telefono VARCHAR(30) NOT NULL,
  email VARCHAR(200) NOT NULL,
  fecha_reserva DATE NOT NULL,
  estado estado_reserva DEFAULT 'PENDIENTE',
  observaciones TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(salon_id, fecha_reserva)
);

CREATE INDEX idx_reservas_salon_fecha ON reservas(salon_id, fecha_reserva);
CREATE INDEX idx_reservas_estado ON reservas(estado);

CREATE TABLE administradores (
  id SERIAL PRIMARY KEY,
  usuario VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed salones
INSERT INTO salones (nombre, ubicacion) VALUES
  ('Salón Posadas', 'Posadas'),
  ('Salón Oberá', 'Oberá'),
  ('Salón Eldorado', 'Eldorado');
