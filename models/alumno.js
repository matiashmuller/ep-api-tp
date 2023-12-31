'use strict';

/**
 * @openapi
 * components:
 *   schemas:
 *     alumno:
 *       type: object
 *       properties:
 *         id: 
 *           type: integer
 *           example: 1
 *         dni: 
 *           type: integer
 *           example: 39666777
 *         nombre:
 *           type: string
 *           example: "Ezequiel"
 *         apellido:
 *           type: string
 *           example: "Agüero"
 *         fecha_nac:
 *           type: dateonly
 *           example: '1995-07-06'
 *         id_carrera:
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
  const alumno = sequelize.define('alumno', {
    dni: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    fecha_nac: DataTypes.DATEONLY,
    id_carrera: DataTypes.INTEGER
  }, {});

  //Asociaciones
  alumno.associate = function (models) {
    //Asociación con carrera - pertenece a una
    alumno.belongsTo(models.carrera, {
      as: 'carreraQueEstudia',
      foreignKey: 'id_carrera'
    });
    ////Asociación muchos a muchos con materia, simulada de forma uno a muchos con alumno_materia
    alumno.hasMany(models.alumno_materia, {
      as: 'materiasQueCursa',
      foreignKey: 'id_alumno'
    });
  };

  return alumno;
};