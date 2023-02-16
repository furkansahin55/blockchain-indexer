const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "tracked_addresses",
    {
      address: {
        type: DataTypes.STRING(42),
        primaryKey: true,
        allowNull: false,
      }
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
};
