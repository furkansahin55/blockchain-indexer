const pino = require("pino");
const { LOG_LEVEL } = require("./config");

const logger = pino({
  level: LOG_LEVEL,
});

module.exports = logger;
