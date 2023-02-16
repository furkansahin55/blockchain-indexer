/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const Joi = require("joi");

const id = "index-block-transactions";

const argsSchema = Joi.object().keys({
  blockNumber: Joi.number().integer().required(),
  created: Joi.number().integer().required(),
  network: Joi.string().required(),
});

/**
 * Index block transactions
 * @param {Object} tools
 * @param {import("../models")} tools.db
 * @param {import("../logger")} tools.logger
 * @param {import("../mq")} tools.mq
 * @param {import("../networks")} tools.networks
 * @param {Object} _args
 */
const run = async (tools, _args) => {
  const args = await argsSchema.validateAsync(_args);
  const { db, logger, mq } = tools;

  logger.info(`${id} started - ${args.network} - ${args.blockNumber}`);

  // get all transactions for the block
  const transactions = await db.transactions.findAll({
    where: {
      blockNumber: args.blockNumber,
      network: args.network,
    },
  });

  // filter out transactions that dont have to or from address which is in tracked_addresses table
  // TODO: this can be done in a single query
  const filteredTransactions = [];
  for (const transaction of transactions) {
    const trackedAddresses = await db.tracked_addresses.findOne({
      where: {
        address: {
          [db.Sequelize.Op.or]: [transaction.to, transaction.from],
        },
      },
    });

    if (trackedAddresses) {
      filteredTransactions.push(transaction);
    }
  }

  // create index transaction task for each transaction
  for (const transaction of filteredTransactions) {
    await mq.sendTask(
      "index-transaction",
      {
        transaction,
      },
      10
    );
  }

  logger.info(`${id} finished - ${args.network} - ${args.blockNumber}`);
};

module.exports = { id, run };
