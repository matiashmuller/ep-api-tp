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
 *           example: 45666777
 *         nombre:
 *           type: string
 *           example: "Ezequiel"
 *         apellido:
 *           type: string
 *           example: "Agüero"
 *         fecha_nac:
 *           type: dateonly
 *           example: 1995-07-06
 *         id_carrera:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: date
 *           example: 4/20/2022 2:21:56
 *         updatedAt: 
 *           type: date
 *           example: 4/20/2022 2:21:56
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
    //Asociación con materia - muchos a muchos a través de tabla intermedia: alumno_materia
    alumno.belongsToMany(models.materia, {
      as: 'materiasQueCursa',
      through: models.alumno_materia,
      foreignKey: 'id_alumno',
      otherKey: 'id_materia'
    });
  };

  return alumno;
};