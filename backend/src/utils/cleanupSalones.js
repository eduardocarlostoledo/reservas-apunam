require('dotenv').config();
const { sequelize, Salon } = require('../models');

async function cleanup() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    // Eliminar Montecarlo si existe
    await Salon.destroy({
      where: { nombre: { [sequelize.Sequelize.Op.iLike]: '%montecarlo%' } }
    });
    console.log('Montecarlo removed (if existed)');

    // Asegurar que existan los 3 salones correctos
    const salonesEsperados = [
      { nombre: 'Salón Posadas', ubicacion: 'Posadas' },
      { nombre: 'Salón Oberá', ubicacion: 'Oberá' },
      { nombre: 'Salón Eldorado', ubicacion: 'Eldorado' },
    ];

    for (const salon of salonesEsperados) {
      const exists = await Salon.findOne({ where: { nombre: salon.nombre } });
      if (!exists) {
        await Salon.create({ ...salon, activo: true });
        console.log(`Created: ${salon.nombre}`);
      }
    }

    // Verificar estado final
    const final = await Salon.findAll({ where: { activo: true } });
    console.log('Final state:');
    final.forEach(s => console.log(`  - ${s.nombre} (${s.ubicacion})`));

    process.exit(0);
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }
}

cleanup();
