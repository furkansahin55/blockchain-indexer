/* eslint-disable security/detect-object-injection */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const Joi = require("joi");

const id = "index-address-transactions";

const argsSchema = Joi.object().keys({
  address: Joi.string().length(42).lowercase().required(),
  created: Joi.number().integer().required(),
});

/**
 * Index address transactions
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

  logger.info(`${id} started - ${args.address}`);

  // get all the transactions of the address
  const transactions = await db.transactions.findAll({
    where: {
      [db.Sequelize.Op.or]: [{ to: args.address }, { from: args.address }],
    },
  });

  // add address to the list of addresses to track
  await db.tracked_addresses.create({
    address: args.address,
  });

  // create index transaction task for each transaction
  for (const transaction of transactions) {
    await mq.sendTask(
      "index-transaction",
      {
        transaction,
      },
      10
    );
  }

  logger.info(`${id} finished - ${args.address}`);
};

module.exports = { id, run };
