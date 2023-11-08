'use strict';

/**
 * @openapi
 * components:
 *   schemas:
 *     docente:
 *       type: object
 *       properties:
 *         id: 
 *           type: integer
 *           example: 1
 *         dni: 
 *           type: integer
 *           example: 28756986
 *         nombre:
 *           type: string
 *           example: "Mónica"
 *         apellido:
 *           type: string
 *           example: "Villalba"
 *         titulo:
 *           type: string
 *           example: "Lic. en informática"
 *         fecha_nac:
 *           type: dateonly
 *           example: '1982-07-06'
 *         createdAt:
 *           type: date
 *           example: 2023-11-06 22:25:35
 *         updatedAt: 
 *           type: date
 *           example: 2023-11-06 22:26:35
 */

module.exports = (sequelize, DataTypes) => {
  const docente = sequelize.define('docente', {
    dni: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    titulo: DataTypes.STRING,
    fecha_nac: DataTypes.DATEONLY
  }, {});
  
  //Asociación muchos a muchos con materia, simulada de forma uno a muchos con comisión
  docente.associate = function(models) {
    docente.hasMany(models.comision, {
      as: 'comisionesAsignadas',
      foreignKey: 'id_docente'
    });
  };

  return docente;
};