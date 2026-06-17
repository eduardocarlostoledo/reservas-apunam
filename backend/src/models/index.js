const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
      }
    );

const Salon = require('./Salon')(sequelize);
const Reserva = require('./Reserva')(sequelize);
const Administrador = require('./Administrador')(sequelize);
const Usuario = require('./Usuario')(sequelize);

Salon.hasMany(Reserva, { foreignKey: 'salon_id', as: 'reservas' });
Reserva.belongsTo(Salon, { foreignKey: 'salon_id', as: 'salon' });

module.exports = { sequelize, Salon, Reserva, Administrador, Usuario };
