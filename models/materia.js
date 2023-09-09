'use strict';
module.exports = (sequelize, DataTypes) => {
  const materia = sequelize.define('materia', {
    nombre: DataTypes.STRING,
    carga_horaria: DataTypes.INTEGER,
    id_carrera: DataTypes.INTEGER
  }, {});
  materia.associate = function(models) {
    // associations can be defined here
  };
  return materia;
};