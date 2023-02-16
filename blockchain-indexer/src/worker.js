const Joi = require("joi");
const _ = require("lodash");
const logger = require("./logger");
const Mq = require("./mq");
const db = require("./models");
const tasks = require("./tasks");
const networks = require("./networks");

/**
 * Worker main function
 */
(async () => {
  // connect to the message queue
  const mq = new Mq();
  await mq.connect();

  // set network dict
  const networksDict = _.keyBy(networks, "name");

  // get a task from the queue
  await mq.bindTaskConsumeFunction(async (msg) => {
    let task = { id: "undefined" };
    try {
      task = JSON.parse(msg.content.toString());

      // validate args and task object
      task = await Joi.object()
        .keys({
          id: Joi.string().required(),
          args: Joi.object().required(),
        })
        .validateAsync(task);

      // run the task
      await tasks[task.id].run(
        { db, logger, mq, networks: networksDict },
        task.args
      );

      // acknowledge the task
      mq.channel.ack(msg);
    } catch (err) {
      logger.error(
        err,
        `${task.id} task failed with args: ${JSON.stringify(task.args)}`
      );

      // reject the task
      mq.channel.reject(msg, false);
    }
  });

  logger.info("worker started");
})();

process.on("unhandledRejection", (err) => {
  logger.error(err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.error(err);
  process.exit(1);
});
