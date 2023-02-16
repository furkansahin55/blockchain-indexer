const { celebrate, Joi, Segments } = require("celebrate");

module.exports.trackedAddressesAddValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    address: Joi.string().length(42).lowercase().required(),
  }),
});
