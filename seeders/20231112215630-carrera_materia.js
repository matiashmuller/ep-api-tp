'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('carrera_materia', [
      // lic
      {
        id_carrera: 1,
        id_materia: 1, // prob y estad
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_carrera: 1,
        id_materia: 2, // obj III
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_carrera: 1,
        id_materia: 7, // EP
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_carrera: 1,
        id_materia: 8, // sist operat
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_carrera: 1,
        id_materia: 9, // bd
        createdAt: new Date(),
        updatedAt: new Date()
      },
      //tec prog
      {
        id_carrera: 2,
        id_materia: 3, // taller marc
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_carrera: 2,
        id_materia: 4, // estructurada
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_carrera: 2,
        id_materia: 7, // EP
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_carrera: 2,
        id_materia: 9, // BD
        createdAt: new Date(),
        updatedAt: new Date()
      },
      //tec redes
      {
        id_carrera: 3,
        id_materia: 5, // taller int comandos
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_carrera: 3,
        id_materia: 6, // sist com
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_carrera: 3,
        id_materia: 8, // sist op
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_carrera: 3,
        id_materia: 9, // BD
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('carrera_materia', null, {});
  }
};
