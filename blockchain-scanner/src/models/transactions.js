const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "transactions",
    {
      network: {
        type: DataTypes.STRING(50),
        primaryKey: true,
      },
      transactionHash: {
        type: DataTypes.STRING(66),
      },
      blockNumber: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      transactionIndex: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      from: {
        type: DataTypes.STRING(42),
      },
      to: {
        type: DataTypes.STRING(42),
      },
      gasUsed: {
        type: DataTypes.DECIMAL(78, 0),
      },
      cumulativeGasUsed: {
        type: DataTypes.INTEGER,
      },
      logs: {
        type: DataTypes.JSON,
      },
      blockHash: {
        type: DataTypes.STRING(66),
      },
      status: {
        type: DataTypes.BOOLEAN,
      },
      effectiveGasPrice: {
        type: DataTypes.DECIMAL(78, 0),
      },
      blockTimestamp: {
        type: DataTypes.DATE,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
};
