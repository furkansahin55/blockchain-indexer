const db = require("./models");
const Mq = require("./mq");
const LastSyncedBlock = require("./last-synced-block");
const BlockScanner = require("./block-scanner");
const logger = require("./logger");
const networks = require("./networks");

// create an amqp connection and connect to the queue
const mq = new Mq();

// Create LastSyncedBlock instance
const lastSyncedBlock = new LastSyncedBlock(db.networks);

// Create a new BlockScanner instance
const blockScanner = new BlockScanner(networks, lastSyncedBlock, mq, logger);

/**
 * Start the block scanner
 */
(async () => {
  await mq.connect();
  blockScanner.run();
})();

// catch unhandled exceptions
process.on("uncaughtException", (error) => {
  logger.error(error, `Uncaught Exception: ${error}`);
  process.exit(1);
});

// catch unhandled promise rejections
process.on("unhandledRejection", (error) => {
  logger.error(error, `Unhandled Rejection: ${error}`);
  process.exit(1);
});
