'use strict';

/**
 * @openapi
 * components:
 *   schemas:
 *     carrera:
 *       type: object
 *       properties:
 *         id: 
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Tecnicatura en programación"
 *         createdAt:
 *           type: date
 *           example: 4/20/2022 2:21:56
 *         updatedAt: 
 *           type: date
 *           example: 4/20/2022 2:22:56
 */

module.exports = (sequelize, DataTypes) => {
  const carrera = sequelize.define('carrera', {
    nombre: DataTypes.STRING
  }, {});
  
  //Asociaciones
  carrera.associate = function(models) {
    //Asociación muchos a muchos con materia, simulada de forma uno a muchos con carrera_materia
  	carrera.hasMany(models.carrera_materia, {
      as: 'materiasIncluidas',
      foreignKey: 'id_carrera'
    })
    //Asociación con alumno - uno a muchos
    carrera.hasMany(models.alumno, {
      as: 'alumnosInscriptos',
      foreignKey: 'id_carrera'
    })
  };

  return carrera;
};