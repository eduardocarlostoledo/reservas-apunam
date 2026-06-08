const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reserva = sequelize.define('Reserva', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    salon_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'salones', key: 'id' },
    },
    nombre_completo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    dni: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    numero_afiliado: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    fecha_reserva: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA', 'CANCELADA'),
      defaultValue: 'PENDIENTE',
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'reservas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Reserva;
};
