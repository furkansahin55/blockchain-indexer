/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable security/detect-non-literal-require */

const fs = require("fs");
const path = require("path");

const tasksDict = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== path.basename(__filename) &&
      file !== "index.js" &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const task = require(path.join(__dirname, file));
    tasksDict[task.id] = task;
  });

module.exports = tasksDict;
