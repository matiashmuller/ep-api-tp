'use strict';

/**
 * @openapi
 * components:
 *   schemas:
 *     carrera_materia:
 *       type: object
 *       properties:
 *         id: 
 *           type: integer
 *         id_carrera:
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
  const carrera_materia = sequelize.define('carrera_materia', {
    id_carrera: DataTypes.INTEGER,
    id_materia: DataTypes.INTEGER
  }, {});
  
  //Asociación con carrera y materia como tabla intermedia
  carrera_materia.associate = function(models) {
    carrera_materia.belongsTo(models.carrera, {foreignKey: 'id_carrera'});
  	carrera_materia.belongsTo(models.materia, {as:'materia', foreignKey: 'id_materia'});
  };
  return carrera_materia;
};