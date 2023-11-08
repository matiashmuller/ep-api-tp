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
        type: Sequelize.STRING,
        allowNull: false
      },
      dias: {
        type: Sequelize.STRING
      },
      turno: {
        type: Sequelize.STRING
      },
      id_materia: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    }, {
      //No debería existir la misma relacion letra-materia ni docente-dias-turno en más de un registro
      uniqueKeys: {
        letra_materia: {
          fields: ['letra', 'id_materia']
        },
        doc_dia_turno: {
          fields: ['id_docente', 'dias', 'turno']
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('comisions');
  }
};