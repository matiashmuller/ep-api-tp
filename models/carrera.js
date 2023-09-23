'use strict';
module.exports = (sequelize, DataTypes) => {
  const carrera = sequelize.define('carrera', {
    nombre: DataTypes.STRING
  }, {});
  
  //Asociaciones
  carrera.associate = function(models) {
    //Asociación con materias - muchos a muchos a través de tabla intermedia: carrera_materia
  	carrera.belongsToMany(models.materia, {
      as: 'materiasIncluidas',
      through: models.carrera_materia,
      foreignKey: 'id_carrera',
      otherKey: 'id_materia'
    })
    //Asociación con alumno - uno a muchos
    carrera.hasMany(models.alumno, {
      as: 'alumnosInscriptos',
      foreignKey: 'id_carrera'
    })
  };

  return carrera;
};