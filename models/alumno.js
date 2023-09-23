'use strict';
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