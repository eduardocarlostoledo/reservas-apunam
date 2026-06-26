require('dotenv').config();
const { sequelize, Salon } = require('../models');

async function cleanup() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    // Remove Montecarlo if exists (case-insensitive)
    const removed = await Salon.destroy({
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('nombre')),
        'like',
        '%montecarlo%'
      )
    });

    if (removed > 0) {
      console.log(`Removed ${removed} Montecarlo record(s)`);
    } else {
      console.log('No Montecarlo records found');
    }

    // Ensure correct salones exist
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

    // Show final state
    const final = await Salon.findAll({ where: { activo: true } });
    console.log(`\nFinal salones (${final.length}):`);
    final.forEach(s => console.log(`  - ${s.nombre} (${s.ubicacion})`));

    process.exit(0);
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }
}

cleanup();
