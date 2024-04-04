'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Document', 'projectId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'projectModel',
        key: 'id',
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Document', 'projectId');
  },
};
