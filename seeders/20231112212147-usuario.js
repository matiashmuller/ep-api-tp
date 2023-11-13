'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('usuarios', [{
      nombre: 'matiashm',
      email: 'matias@email.com',
      contraseña: await bcrypt.hash('1234', 10),
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('usuarios', null, {});
  }
};
