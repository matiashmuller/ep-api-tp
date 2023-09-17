'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('comisions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      letra: {
        type: Sequelize.STRING
      },
      dias: {
        type: Sequelize.STRING
      },
      turno: {
        type: Sequelize.STRING
      },
      id_materia: {
        type: Sequelize.INTEGER
      },
      id_docente: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('comisions');
  }
};