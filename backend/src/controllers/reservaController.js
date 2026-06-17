const { Reserva, Salon } = require('../models');
const { Op } = require('sequelize');
const { validarAfiliado } = require('../services/afiliadoService');
const { sendSolicitudRecibida } = require('../services/emailService');

async function crearReserva(req, res) {
  try {
    const { salon_id, nombre_completo, dni, numero_afiliado, telefono, email, fecha_reserva, observaciones } = req.body;

    const salon = await Salon.findByPk(salon_id);
    if (!salon || !salon.activo) {
      return res.status(404).json({ error: 'Salón no encontrado o inactivo' });
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (new Date(fecha_reserva) < hoy) {
      return res.status(400).json({ error: 'No se puede reservar fechas pasadas' });
    }

    const existente = await Reserva.findOne({
      where: {
        salon_id,
        fecha_reserva,
        estado: { [Op.in]: ['PENDIENTE', 'APROBADA'] },
      },
    });
    if (existente) {
      return res.status(409).json({ error: 'La fecha seleccionada no está disponible' });
    }

    if (!(await validarAfiliado(dni, numero_afiliado))) {
      return res.status(403).json({ error: 'No figura como afiliado habilitado.' });
    }

    const reserva = await Reserva.create({
      salon_id,
      nombre_completo,
      dni,
      numero_afiliado,
      telefono,
      email,
      fecha_reserva,
      observaciones,
    });

    try {
      await sendSolicitudRecibida({
        email,
        nombre_completo,
        fecha_reserva,
        salon_nombre: salon.nombre,
      });
    } catch (emailErr) {
      console.error('Error sending email:', emailErr);
    }

    res.status(201).json(reserva);
  } catch (error) {
    console.error('Error creating reserva:', error);
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
}

module.exports = { crearReserva };
