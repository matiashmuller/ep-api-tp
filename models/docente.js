'use strict';
module.exports = (sequelize, DataTypes) => {
  const docente = sequelize.define('docente', {
    dni: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    titulo: DataTypes.STRING,
    fecha_nac: DataTypes.DATEONLY
  }, {});
  docente.associate = function(models) {
    // associations can be defined here
  };
  return docente;
};