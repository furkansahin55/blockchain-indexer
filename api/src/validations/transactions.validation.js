const { celebrate, Joi, Segments } = require("celebrate");

module.exports.getTransactionsValidation = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    addresses: Joi.array()
      .items(Joi.string().length(42).lowercase())
      .required(),
    page: Joi.number().integer().min(1).required(),
    limit: Joi.number().integer().min(1).required(),
  }),
});
