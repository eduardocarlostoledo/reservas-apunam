require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, Salon, Administrador } = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    // Remove any old/incorrect salones (e.g., Montecarlo)
    await Salon.destroy({ where: {} });

    await Salon.bulkCreate([
      { nombre: 'Salón Posadas', ubicacion: 'Posadas' },
      { nombre: 'Salón Oberá', ubicacion: 'Oberá' },
      { nombre: 'Salón Eldorado', ubicacion: 'Eldorado' },
    ]);
    console.log('Salones created (Posadas, Oberá, Eldorado)');

    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const hash = await bcrypt.hash(password, 10);
    await Administrador.create({
      usuario: process.env.ADMIN_USER || 'admin',
      password_hash: hash,
    });
    console.log('Admin user created');

    console.log('Seed complete');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
