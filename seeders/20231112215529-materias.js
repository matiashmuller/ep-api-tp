'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('materia', [
      {
        nombre: 'Probabilidad y estadística', //lic
        carga_horaria: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        nombre: 'Programación con objetos III', //lic
        carga_horaria: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        nombre: 'Taller de Lenguajes de Marcado y Tecnologías Web', //prog
        carga_horaria: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        nombre: 'Programación Estructurada', //prog
        carga_horaria: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        nombre: 'Taller de Intérprestes de comando', //redes
        carga_horaria: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        nombre: 'Sistemas de Comunicación', //redes
        carga_horaria: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        nombre: 'Estrategias de Persistencia', //prog y lic
        carga_horaria: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        nombre: 'Sistemas operativos', //redes y Lic
        carga_horaria: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        nombre: 'Bases de Datos', //en las 3 carreras
        carga_horaria: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('materia', null, {});
  }
};
