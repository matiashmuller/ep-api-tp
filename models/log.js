'use strict';
module.exports = (sequelize, DataTypes) => {
  const log = sequelize.define('log', {
    nivel: DataTypes.STRING,
    mensaje: DataTypes.STRING,
    metadata: DataTypes.JSON
  }, {});
  
  return log;
};