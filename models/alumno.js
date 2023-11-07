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
 *         dni: 
 *           type: integer
 *         nombre:
 *           type: string
 *         apellido:
 *           type: string
 *         fecha_nac:
 *           type: dateonly
 *         id_carrera:
 *           type: integer
 *         createdAt:
 *           type: date
 *         updatedAt: 
 *           type: date
 *       example: {
 *              'id': 1,
 *              'dni': 39666777,
 *              'nombre': "Ezequiel",
 *              'apellido': 'Agüero',
 *              'fecha_nac': '1995-07-06',
 *              'id_carrera': 1,
 *              'createdAt': 2023-11-06 22:25:35,
 *              'updatedAt': 2023-11-06 22:25:35 
 *       }
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