/* eslint-disable security/detect-object-injection */

/**
 * middleware to split query param
 * @param {String} paramName
 * @returns {Function}
 */
function splitQueryParam(paramName) {
  return (req, res, next) => {
    if (req.query[paramName]) {
      req.query[paramName] = req.query[paramName].split(",");
    }
    next();
  };
}

module.exports = {
  splitQueryParam,
};
