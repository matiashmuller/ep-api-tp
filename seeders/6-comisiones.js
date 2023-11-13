'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('comisions', [
      {
        letra: "A",
        dias: "Sábado",
        turno: "Mañana",
        id_materia: 1, //Prob y estad (lic)
        id_docente: 1, //Guillén
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        letra: "A",
        dias: "Martes",
        turno: "Noche",
        id_materia: 2, //Obj III (lic)
        id_docente: 2, //Pizarro
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        letra: "A",
        dias: "Martes",
        turno: "Noche",
        id_materia: 3, //taller marcado (prog)
        id_docente: 3, //Hoyos
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        letra: "A",
        dias: "Miércoles",
        turno: "Noche",
        id_materia: 4, //prog estructurada (prog)
        id_docente: 2, //Pizarro
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        letra: "A",
        dias: "Viernes",
        turno: "Noche",
        id_materia: 5, //int comandos (redes)
        id_docente: 4, //Bianchi
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        letra: "A",
        dias: "Jueves",
        turno: "Noche",
        id_materia: 6, //sist comunicacion (redes)
        id_docente: 5, //Sotelo
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        letra: "A",
        dias: "Miércoles",
        turno: "Noche",
        id_materia: 7, //EP (prog y lic)
        id_docente: 6, //Rubio
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        letra: "A",
        dias: "Lunes",
        turno: "Noche",
        id_materia: 8, //sist operativos (redes y lic)
        id_docente: 5, //Sotelo
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        letra: "A",
        dias: "Jueves",
        turno: "Noche",
        id_materia: 9, //bases de datos (redes, prog y lic)
        id_docente: 6, //Rubio
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        letra: "B",
        dias: "Jueves",
        turno: "Tarde",
        id_materia: 9, //bases de datos (redes, prog y lic)
        id_docente: 6, //Rubio
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('comisions', null, {});
  }
};
