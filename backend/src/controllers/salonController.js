const { Salon, Reserva } = require('../models');
const { Op } = require('sequelize');

async function getSalones(req, res) {
  try {
    const salones = await Salon.findAll({ where: { activo: true } });
    res.json(salones);
  } catch (error) {
    console.error('Error fetching salones:', error);
    res.status(500).json({ error: 'Error al obtener salones' });
  }
}

async function getDisponibilidad(req, res) {
  try {
    const { salonId } = req.params;
    const { mes, anio } = req.query;

    const salon = await Salon.findByPk(salonId);
    if (!salon) {
      return res.status(404).json({ error: 'Salón no encontrado' });
    }

    const year = parseInt(anio) || new Date().getFullYear();
    const month = parseInt(mes) || new Date().getMonth() + 1;

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0);
    const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

    const reservas = await Reserva.findAll({
      where: {
        salon_id: salonId,
        fecha_reserva: { [Op.between]: [startDate, endDateStr] },
        estado: { [Op.in]: ['PENDIENTE', 'APROBADA'] },
      },
      attributes: ['fecha_reserva', 'estado'],
    });

    res.json({
      salon,
      reservas: reservas.map(r => ({
        fecha: r.fecha_reserva,
        estado: r.estado,
      })),
    });
  } catch (error) {
    console.error('Error fetching disponibilidad:', error);
    res.status(500).json({ error: 'Error al obtener disponibilidad' });
  }
}

module.exports = { getSalones, getDisponibilidad };
