const db = require("../models");

/**
 * Get transactions for addresses on all networks
 */
module.exports.getTransactionsController = async (req, res) => {
  const { addresses, page, limit } = req.query;
  const offset = (page - 1) * limit;

  const transactions = await db.transactions.findAndCountAll({
    where: {
      [db.Sequelize.Op.or]: [
        {
          from: {
            [db.Sequelize.Op.in]: addresses,
          },
        },
        {
          to: {
            [db.Sequelize.Op.in]: addresses,
          },
        },
      ],
    },
    order: [["blockTimestamp", "DESC"]],
    limit,
    offset,
  });

  res.send(transactions);
};
