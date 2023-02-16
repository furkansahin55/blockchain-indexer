const { fork } = require("child_process");
const logger = require("./logger");
const Mq = require("./mq");

const mq = new Mq();

logger.info("Starting workers...");

function createWorker() {
  fork(`${__dirname}/worker.js`);
}

/**
 * Start the workers
 */
(async () => {
  await mq.connect();

  createWorker();
  createWorker();
  createWorker();
})();
