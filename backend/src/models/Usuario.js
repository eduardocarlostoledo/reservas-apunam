const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nro_legaj: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    nro_docum: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Usuario;
};
