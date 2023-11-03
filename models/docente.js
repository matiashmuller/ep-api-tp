'use strict';
module.exports = (sequelize, DataTypes) => {
  const docente = sequelize.define('docente', {
    dni: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    titulo: DataTypes.STRING,
    fecha_nac: DataTypes.DATEONLY
  }, {});
  
  //Asociación con materia - muchos a muchos a través de tabla intermedia: comision
  docente.associate = function(models) {
    docente.hasMany(models.comision, {
      as: 'comisionesAsignadas',
      foreignKey: 'id_docente'
    });
    /**
  	docente.belongsToMany(models.materia, {
      as: 'materiasQueDicta',
      through: models.comision,
      foreignKey: 'id_docente',
      otherKey: 'id_materia'
    });
     */
  };

  return docente;
};