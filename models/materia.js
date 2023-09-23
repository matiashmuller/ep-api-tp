'use strict';
module.exports = (sequelize, DataTypes) => {
  const materia = sequelize.define('materia', {
    nombre: DataTypes.STRING,
    carga_horaria: DataTypes.INTEGER,
    id_carrera: DataTypes.INTEGER
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
    //Asociación con docente - muchos a muchos a través de tabla intermedia: comision
    materia.belongsToMany(models.docente, {
      as: 'profQueLaDictan',
      through: models.comision,
      foreignKey: 'id_materia',
      otherKey: 'id_docente'
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