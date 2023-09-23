'use strict';
module.exports = (sequelize, DataTypes) => {
  const alumno_materia = sequelize.define('alumno_materia', {
    id_alumno: DataTypes.INTEGER,
    id_materia: DataTypes.INTEGER
  }, {});
  
  //Asociación con alumno y materia como tabla intermedia
  alumno_materia.associate = function(models) {
    alumno_materia.belongsTo(models.alumno, {foreignKey: 'id_alumno'});
  	alumno_materia.belongsTo(models.materia, {foreignKey: 'id_materia'});
  };
  return alumno_materia;
};