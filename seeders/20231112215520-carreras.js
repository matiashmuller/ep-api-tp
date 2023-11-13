'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('carreras', [
      { nombre: 'Licenciatura en informática', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Tecnicatura universitaria en programación', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Tecnicatura universitaria en redes y operaciones', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('carreras', null, {});
  }
};
