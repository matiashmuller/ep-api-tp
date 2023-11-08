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
    //Asociación con carreras - muchos a muchos a través de tabla intermedia: carrera_materia
  	materia.belongsToMany(models.carrera, {
      as: 'carrerasQueLaIncluyen',
      through: models.carrera_materia,
      foreignKey: 'id_materia',
      otherKey: 'id_carrera'
    });
    //Asociación muchos a muchos con docente, simulada de forma uno a muchos con comisión
    materia.hasMany(models.comision, {
      as: 'comisiones',
      foreignKey: 'id_materia'
    });
    //Asociación con alumno - muchos a muchos a través de tabla intermedia: alumno_materia
    materia.belongsToMany(models.alumno, {
      as: 'alumnQueLaCursan',
      through: models.alumno_materia,
      foreignKey: 'id_materia',
      otherKey: 'id_alumno'
    });
  };

  return materia;
};