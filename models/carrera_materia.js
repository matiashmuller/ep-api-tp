'use strict';
module.exports = (sequelize, DataTypes) => {
  const carrera_materia = sequelize.define('carrera_materia', {
    id_carrera: DataTypes.INTEGER,
    id_materia: DataTypes.INTEGER
  }, {});
  
  //Asociación con carrera y materia como tabla intermedia
  carrera_materia.associate = function(models) {
    carrera_materia.belongsTo(models.carrera, {foreignKey: 'id_carrera'});
  	carrera_materia.belongsTo(models.materia, {foreignKey: 'id_materia'});
  };
  return carrera_materia;
};