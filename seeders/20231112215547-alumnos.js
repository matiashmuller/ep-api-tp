'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('alumnos', [
      {
        dni: 40548698,
        nombre: "Ana",
        apellido: "Muñoz",
        fecha_nac: "1998-09-11",
        id_carrera: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('alumnos', null, {});
  }
};
