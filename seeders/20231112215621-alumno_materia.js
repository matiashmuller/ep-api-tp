'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('alumno_materia', [
      //Ana - lic
      {
        id_alumno: 1,
        id_materia: 1, // prob y estad
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_alumno: 1,
        id_materia: 2, // obj III
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_alumno: 1,
        id_materia: 9, // bd
        createdAt: new Date(),
        updatedAt: new Date()
      }, 
      //Nicolás - Lic
      {
        id_alumno: 2,
        id_materia: 1, // prob y estad
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_alumno: 2,
        id_materia: 2, // obj III
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_alumno: 2,
        id_materia: 7, // EP
        createdAt: new Date(),
        updatedAt: new Date()
      },
      //Andrea - Prog
      {
        id_alumno: 3,
        id_materia: 3, // taller marcado
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_alumno: 3,
        id_materia: 4, // estructurada
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_alumno: 3,
        id_materia: 9, // BD
        createdAt: new Date(),
        updatedAt: new Date()
      },
      //Sergio - Prog
      {
        id_alumno: 4,
        id_materia: 3, // taller marcado
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_alumno: 4,
        id_materia: 7, // EP
        createdAt: new Date(),
        updatedAt: new Date()
      },
      //Yamila - Redes
      {
        id_alumno: 5,
        id_materia: 5, // taller int comandos
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_alumno: 5,
        id_materia: 6, // sist comun
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_alumno: 5,
        id_materia: 9, // BD
        createdAt: new Date(),
        updatedAt: new Date()
      },
      //Sebastián - Redes
      {
        id_alumno: 6,
        id_materia: 6, // sist com
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_alumno: 6,
        id_materia: 8, // sist operativos
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id_alumno: 6,
        id_materia: 9, // BD
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('alumno_materia', null, {});
  }
};
