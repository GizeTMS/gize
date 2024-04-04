'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Message', 'senderUserID', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'userModel',
        key: 'id',
      },
    });

    await queryInterface.addColumn('Message', 'receiverUserID', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'userModel',
        key: 'id',
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Message', 'senderUserID');
    await queryInterface.removeColumn('Message', 'receiverUserID');
  },
};