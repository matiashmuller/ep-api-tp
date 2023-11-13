'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('alumnos', [
      {
        dni: 37548698,
        nombre: "Ana",
        apellido: "Muñoz",
        fecha_nac: "1994-09-11",
        id_carrera: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dni: 38658912,
        nombre: "Nicolás",
        apellido: "Russo",
        fecha_nac: "1997-10-20",
        id_carrera: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        dni: 41232256,
        nombre: "Andrea",
        apellido: "Torres",
        fecha_nac: "2001-04-25",
        id_carrera: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        dni: 40124458,
        nombre: "Sergio",
        apellido: "Osorio",
        fecha_nac: "2000-01-05",
        id_carrera: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dni: 42897585,
        nombre: "Yamila",
        apellido: "Navarro",
        fecha_nac: "2002-07-23",
        id_carrera: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        dni: 36548698,
        nombre: "Sebastián",
        apellido: "Pastrana",
        fecha_nac: "1992-12-09",
        id_carrera: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('alumnos', null, {});
  }
};
