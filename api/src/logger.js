const expressPino = require("express-pino-logger");
const { LOG_LEVEL } = require("./config");

module.exports = expressPino({
  level: LOG_LEVEL,
});
