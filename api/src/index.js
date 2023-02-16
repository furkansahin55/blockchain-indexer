const express = require("express");
const { errors } = require("celebrate");
const logger = require("./logger");
const mq = require("./mq");
const { splitQueryParam } = require("./middlewares/utils");
const {
  trackedAddressesAddValidation,
} = require("./validations/tracked-addresses.validation");
const {
  getTransactionsValidation,
} = require("./validations/transactions.validation");
const {
  trackedAddressesAddController,
} = require("./controllers/tracked-addresses");
const { getTransactionsController } = require("./controllers/transactions");

const app = express();
const port = 3000;

app.use(logger);

app.get(
  "/transactions",
  splitQueryParam("addresses"),
  getTransactionsValidation,
  getTransactionsController
);

app.post(
  "/tracked-addresses/add/:address",
  trackedAddressesAddValidation,
  trackedAddressesAddController
);

app.use(errors());

/**
 * Start the API server
 */
(async () => {
  await mq.connect();

  app.listen(port, () => {
    logger.logger.info(`API started on port ${port}`);
  });
})();
