'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Comment', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'userModel',
        key: 'id',
      },
    });

    await queryInterface.addColumn('Comment', 'task_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'taskModel',
        key: 'id',
      },
    });

    await queryInterface.addColumn('Comment', 'project_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'projectModel',
        key: 'id',
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Comment', 'user_id');
    await queryInterface.removeColumn('Comment', 'task_id');
    await queryInterface.removeColumn('Comment', 'project_id');
  },
};