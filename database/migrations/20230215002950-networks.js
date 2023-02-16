'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('networks', {
      network: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false
      },
      blockNumber: {
        type: Sequelize.INTEGER,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('networks');
  }
};
