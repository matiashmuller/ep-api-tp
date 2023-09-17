'use strict';
module.exports = (sequelize, DataTypes) => {
  const comision = sequelize.define('comision', {
    letra: DataTypes.STRING,
    dias: DataTypes.STRING,
    turno: DataTypes.STRING,
    id_materia: DataTypes.INTEGER,
    id_docente: DataTypes.INTEGER
  }, {});
  comision.associate = function(models) {
    // associations can be defined here
  };
  return comision;
};