/* eslint-disable security/detect-object-injection */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const Joi = require("joi");

const id = "index-transaction";

const argsSchema = Joi.object().keys({
  transaction: Joi.object().required(),
  created: Joi.number().integer().required(),
});

/**
 * Index transaction
 * @param {Object} tools
 * @param {import("../models")} tools.db
 * @param {import("../logger")} tools.logger
 * @param {import("../mq")} tools.mq
 * @param {import("../networks")} tools.networks
 * @param {Object} _args
 */
const run = async (tools, _args) => {
  const args = await argsSchema.validateAsync(_args);
  const { logger } = tools;

  logger.info(`${id} started`);

  // adapter for analyzing each transaction
  logger.info(`analyzing ${args.transaction.transactionHash}...`);

  logger.info(`${id} finished`);
};

module.exports = { id, run };
