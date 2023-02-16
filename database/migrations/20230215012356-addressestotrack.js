'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tracked_addresses', {
      address: {
        type: Sequelize.STRING(42),
        primaryKey: true,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tracked_addresses');
  }
};
