require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, Salon, Administrador } = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    // NO force: true - respects existing data (production-safe)
    await sequelize.sync();

<<<<<<< HEAD
    // Only create salones if they don't exist
    const salonesEsperados = [
      { nombre: 'Salón Posadas', ubicacion: 'Posadas' },
      { nombre: 'Salón Oberá', ubicacion: 'Oberá' },
      { nombre: 'Salón Eldorado', ubicacion: 'Eldorado' },
    ];
=======
    // Remove any old/incorrect salones (e.g., Montecarlo)
    await Salon.destroy({ where: {} });

    await Salon.bulkCreate([
      { nombre: 'Salón Posadas', ubicacion: 'Posadas' },
      { nombre: 'Salón Oberá', ubicacion: 'Oberá' },
      { nombre: 'Salón Eldorado', ubicacion: 'Eldorado' },
    ]);
    console.log('Salones created (Posadas, Oberá, Eldorado)');
>>>>>>> bf41035aa596741ef2b6996df9fbf01e827074e3

    for (const salon of salonesEsperados) {
      const exists = await Salon.findOne({ where: { nombre: salon.nombre } });
      if (!exists) {
        await Salon.create({ ...salon, activo: true });
        console.log(`Created: ${salon.nombre}`);
      } else {
        console.log(`Exists: ${salon.nombre}`);
      }
    }

    // Create admin if it doesn't exist
    const adminExists = await Administrador.findOne();
    if (!adminExists) {
      const password = process.env.ADMIN_PASSWORD || 'admin123';
      const hash = await bcrypt.hash(password, 10);
      await Administrador.create({
        usuario: process.env.ADMIN_USER || 'admin',
        password_hash: hash,
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Seed complete (production-safe)');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
