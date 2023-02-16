'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      network: {
        type: Sequelize.STRING(50),
        primaryKey: true,
      },
      transactionHash: {
        type: Sequelize.STRING(66),
      },
      blockNumber: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      transactionIndex: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      from: {
        type: Sequelize.STRING(42)
      },
      to: {
        type: Sequelize.STRING(42)
      },
      gasUsed: {
        type: Sequelize.DECIMAL(78,0)
      },
      cumulativeGasUsed: {
        type: Sequelize.INTEGER
      },
      logs: {
        type: Sequelize.JSON
      },
      blockHash: {
        type: Sequelize.STRING(66)
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      effectiveGasPrice: {
        type: Sequelize.DECIMAL(78,0)
      },
      blockTimestamp: {
        type: Sequelize.DATE,
      },
    }
  );

  await queryInterface.addIndex('transactions', ['from'], {
    name: 'transactions_from_btree_index',
    using: 'BTREE',
  });

  await queryInterface.addIndex('transactions', ['to'], {
    name: 'transactions_to_btree_index',
    using: 'BTREE',
  });

  await queryInterface.addIndex('transactions', ['blockTimestamp'], {
    name: 'transactions_blockTimestamp_btree_index',
    using: 'BTREE',
  });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
    await queryInterface.removeIndex('transactions', 'transactions_from_btree_index');
    await queryInterface.removeIndex('transactions', 'transactions_to_btree_index');
    await queryInterface.removeIndex('transactions', 'transactions_blockTimestamp_btree_index');
  }
};
