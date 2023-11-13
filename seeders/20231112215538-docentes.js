'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('docentes', [
      {
        dni: 25996349,
        nombre: "Ariel",
        apellido: "Guillén",
        titulo: "Lic. en Ciencias de la Computación",
        fecha_nac: "1975-05-02",
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        dni: 26360513,
        nombre: "Laura",
        apellido: "Pizarro",
        titulo: "Lic. en Informática",
        fecha_nac: "1977-03-25",
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        dni: 32708619,
        nombre: "José",
        apellido: "Hoyos",
        titulo: "Analista programador",
        fecha_nac: "1983-08-22",
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        dni: 30568159,
        nombre: "Estela",
        apellido: "Bianchi",
        titulo: "Profesora en Informática",
        fecha_nac: "1981-11-01",
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        dni: 29562614,
        nombre: "Gastón",
        apellido: "Sotelo",
        titulo: "Ing. en Sistemas de Información",
        fecha_nac: "1980-10-22",
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        dni: 35887953,
        nombre: "Carolina",
        apellido: "Rubio",
        titulo: "Doctora en Ciencias de la Computación",
        fecha_nac: "1987-06-30",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('docentes', null, {});
  }
};
