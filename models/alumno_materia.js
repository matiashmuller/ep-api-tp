'use strict';

/**
 * @openapi
 * components:
 *   schemas:
 *     alumno_materia:
 *       type: object
 *       properties:
 *         id: 
 *           type: integer
 *         id_alumno:
 *           type: integer
 *           example: 1
 *         id_materia:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: date
 *           example: 2023-11-06 22:25:35
 *         updatedAt: 
 *           type: date
 *           example: 2023-11-06 22:26:35
 */

module.exports = (sequelize, DataTypes) => {
  const alumno_materia = sequelize.define('alumno_materia', {
    id_alumno: DataTypes.INTEGER,
    id_materia: DataTypes.INTEGER
  }, {});
  
  //Asociación con alumno y materia como tabla intermedia
  alumno_materia.associate = function(models) {
    alumno_materia.belongsTo(models.alumno, {foreignKey: 'id_alumno'});
  	alumno_materia.belongsTo(models.materia, { as: 'materia', foreignKey: 'id_materia'});
  };
  return alumno_materia;
};