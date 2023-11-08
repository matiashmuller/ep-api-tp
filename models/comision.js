'use strict';

/**
 * @openapi
 * components:
 *   schemas:
 *     comision:
 *       type: object
 *       properties:
 *         id: 
 *           type: integer
 *           example: 1
 *         letra:
 *           type: string
 *           example: "A"
 *         dias:
 *           type: string
 *           example: "Lunes y Miércoles"
 *         turno:
 *           type: string
 *           example: 'Mañana'
 *         id_materia:
 *           type: integer
 *           example: 1
 *         id_docente:
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
  const comision = sequelize.define('comision', {
    letra: DataTypes.STRING,
    dias: DataTypes.STRING,
    turno: DataTypes.STRING,
    id_materia: DataTypes.INTEGER,
    id_docente: DataTypes.INTEGER
  }, {});
  
  //Asociación con docente y materia como tabla intermedia
  comision.associate = function(models) {
  	comision.belongsTo(models.materia, { as: 'materia', foreignKey: 'id_materia'});
    comision.belongsTo(models.docente, { foreignKey: 'id_docente'});
  };

  return comision;
};