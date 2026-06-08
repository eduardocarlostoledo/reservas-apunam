const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Reserva, Salon, Administrador } = require('../models');
const { Op } = require('sequelize');
const { sendReservaAprobada, sendReservaRechazada } = require('../services/emailService');

async function login(req, res) {
  try {
    const { usuario, password } = req.body;

    const admin = await Administrador.findOne({ where: { usuario } });
    if (!admin) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: admin.id, usuario: admin.usuario },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Error en login' });
  }
}

async function getReservas(req, res) {
  try {
    const { estado, salon_id, fecha } = req.query;
    const where = {};

    if (estado) where.estado = estado;
    if (salon_id) where.salon_id = salon_id;
    if (fecha) where.fecha_reserva = fecha;

    const reservas = await Reserva.findAll({
      where,
      include: [{ model: Salon, as: 'salon', attributes: ['nombre', 'ubicacion'] }],
      order: [['created_at', 'DESC']],
    });

    res.json(reservas);
  } catch (error) {
    console.error('Error fetching reservas:', error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
}

async function aprobarReserva(req, res) {
  try {
    const { id } = req.params;
    const reserva = await Reserva.findByPk(id, {
      include: [{ model: Salon, as: 'salon' }],
    });

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    if (reserva.estado !== 'PENDIENTE') {
      return res.status(400).json({ error: 'Solo se pueden aprobar reservas pendientes' });
    }

    reserva.estado = 'APROBADA';
    await reserva.save();

    try {
      await sendReservaAprobada({
        email: reserva.email,
        nombre_completo: reserva.nombre_completo,
        fecha_reserva: reserva.fecha_reserva,
        salon_nombre: reserva.salon.nombre,
      });
    } catch (emailErr) {
      console.error('Error sending approval email:', emailErr);
    }

    res.json(reserva);
  } catch (error) {
    console.error('Error approving reserva:', error);
    res.status(500).json({ error: 'Error al aprobar reserva' });
  }
}

async function rechazarReserva(req, res) {
  try {
    const { id } = req.params;
    const reserva = await Reserva.findByPk(id, {
      include: [{ model: Salon, as: 'salon' }],
    });

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    if (reserva.estado !== 'PENDIENTE') {
      return res.status(400).json({ error: 'Solo se pueden rechazar reservas pendientes' });
    }

    reserva.estado = 'RECHAZADA';
    await reserva.save();

    try {
      await sendReservaRechazada({
        email: reserva.email,
        nombre_completo: reserva.nombre_completo,
        fecha_reserva: reserva.fecha_reserva,
        salon_nombre: reserva.salon.nombre,
      });
    } catch (emailErr) {
      console.error('Error sending rejection email:', emailErr);
    }

    res.json(reserva);
  } catch (error) {
    console.error('Error rejecting reserva:', error);
    res.status(500).json({ error: 'Error al rechazar reserva' });
  }
}

module.exports = { login, getReservas, aprobarReserva, rechazarReserva };
