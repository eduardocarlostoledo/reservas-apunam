const { Usuario } = require('../models');
const { Op } = require('sequelize');

async function validarAfiliado(dni, numero_afiliado) {
  const count = await Usuario.count();
  if (count === 0) return true;

  const parsed = parseInt(numero_afiliado, 10);
  const where = {
    activo: true,
    [Op.or]: [
      { nro_docum: String(dni) },
    ],
  };

  if (!isNaN(parsed)) {
    where[Op.or].push({ nro_legaj: parsed });
  }

  const found = await Usuario.findOne({ where });
  return !!found;
}

module.exports = { validarAfiliado };
