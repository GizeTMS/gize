'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Project', 'ProjectID', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'userModel',
        key: 'id',
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Project', 'ProjectID');
  },
};