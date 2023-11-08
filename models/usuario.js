'use strict';

/**
 * @openapi
 * components:
 *   schemas:
 *     usuario:
 *       type: object
 *       properties:
 *         id: 
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "eze.nosoy.yo"
 *         email:
 *           type: string
 *           example: "eze@mail.com"
 *         contraseña:
 *           type: string
 *           example: "YouWontGuessIt!*"
 *         createdAt:
 *           type: date
 *           example: 2023-11-06 22:25:35
 *         updatedAt: 
 *           type: date
 *           example: 2023-11-06 22:26:35
 */

module.exports = (sequelize, DataTypes) => {
  const usuario = sequelize.define('usuario', {
    nombre: DataTypes.STRING,
    email: DataTypes.STRING,
    contraseña: DataTypes.STRING
  }, {});

  return usuario;
};