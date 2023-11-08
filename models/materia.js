'use strict';

/**
 * @openapi
 * components:
 *   schemas:
 *     materia:
 *       type: object
 *       properties:
 *         id: 
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Organización de computadoras"
 *         carga_horaria:
 *           type: integer
 *           example: 8
 *         createdAt:
 *           type: date
 *           example: 2023-11-06 22:25:35
 *         updatedAt: 
 *           type: date
 *           example: 2023-11-06 22:26:35
 */

module.exports = (sequelize, DataTypes) => {
  const materia = sequelize.define('materia', {
    nombre: DataTypes.STRING,
    carga_horaria: DataTypes.INTEGER
  }, {});
  
  //Asociaciones
  materia.associate = function(models) {
    //Asociación muchos a muchos con carrera, simulada de forma uno a muchos con carrera_materia
  	materia.hasMany(models.carrera_materia, {
      as: 'carrerasQueLaIncluyen',
      foreignKey: 'id_materia'
    });
    //Asociación muchos a muchos con docente, simulada de forma uno a muchos con comisión
    materia.hasMany(models.comision, {
      as: 'comisiones',
      foreignKey: 'id_materia'
    });
    //Asociación muchos a muchos con alumno, simulada de forma uno a muchos con alumno_materia
    materia.hasMany(models.alumno_materia, {
      as: 'alumnQueLaCursan',
      foreignKey: 'id_materia'
    });
  };

  return materia;
};