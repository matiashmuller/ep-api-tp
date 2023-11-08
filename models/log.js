'use strict';

/**
 * @openapi
 * components:
 *   schemas:
 *     log:
 *       type: object
 *       properties:
 *         id: 
 *           type: integer
 *           example: 1
 *         nivel:
 *           type: string
 *           example: "info"
 *         mensaje:
 *           type: string
 *           example: "Éxito al registrar comision."
 *         metadata:
 *           type: JSON
 *           example: {"ruta": "/com", "codigo": 201, "estado": "Created", "metodo": "POST", "subRuta": "/", "etc": "etc"}
 *         createdAt:
 *           type: date
 *           example: 2023-11-06 22:25:35
 */

module.exports = (sequelize, DataTypes) => {
  const log = sequelize.define('log', {
    nivel: DataTypes.STRING,
    mensaje: DataTypes.STRING,
    metadata: DataTypes.JSON
  }, {});
  
  return log;
};