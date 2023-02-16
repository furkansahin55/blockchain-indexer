const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "networks",
    {
      blockNumber: {
        type: DataTypes.INTEGER,
      },
      network: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
};
