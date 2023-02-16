/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const Joi = require("joi");

const id = "save-block-transactions";

const argsSchema = Joi.object().keys({
  blockNumber: Joi.number().integer().required(),
  created: Joi.number().integer().required(),
  network: Joi.string().required(),
});

/**
 * Save block transactions
 * @param {Object} tools
 * @param {import("../models")} tools.db
 * @param {import("../logger")} tools.logger
 * @param {import("../mq")} tools.mq
 * @param {import("../networks")} tools.networks
 * @param {Object} _args
 */
const run = async (tools, _args) => {
  const args = await argsSchema.validateAsync(_args);
  const { db, networks, logger, mq } = tools;

  logger.info(`${id} started - ${args.network} - ${args.blockNumber}`);

  // check if network exists
  const network = networks[args.network];
  if (!network) {
    throw new Error(`Network provider ${args.network} not found`);
  }

  // get block details
  const block = await network.provider.getBlock(args.blockNumber);

  // get all the transactions of the block
  const { transactions, timestamp } = block;

  // get receipts of each transaction
  const receipts = await Promise.all(
    transactions.map((tx) => network.provider.getTransactionReceipt(tx))
  );

  // extend receipts with additional data
  const txs = receipts.map((receipt) => {
    return {
      ...receipt,
      to: receipt.to ? receipt.to.toLowerCase() : null,
      from: receipt.from.toLowerCase(),
      blockTimestamp: new Date(timestamp * 1000),
      network: args.network,
    };
  });

  // save transactions to database
  await db.transactions.bulkCreate(txs, { ignoreDuplicates: true });

  // create index block transactions task
  await mq.sendTask(
    "index-block-transactions",
    {
      blockNumber: args.blockNumber,
      created: args.created,
      network: args.network,
    },
    10
  );

  logger.info(`${id} finished - ${args.network} - ${args.blockNumber}`);
};

module.exports = { id, run };
