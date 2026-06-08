const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Administrador = sequelize.define('Administrador', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  }, {
    tableName: 'administradores',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });

  return Administrador;
};
