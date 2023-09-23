'use strict';
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
  	comision.belongsTo(models.materia, {foreignKey: 'id_materia'});
    comision.belongsTo(models.docente, {foreignKey: 'id_docente'});
  };

  return comision;
};