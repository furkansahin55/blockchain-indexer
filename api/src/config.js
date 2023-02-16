const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../.env") });

const envVarsSchema = Joi.object()
  .keys({
    MQ_URL: Joi.string().required(),
    LOG_LEVEL: Joi.string().required(),
    DATABASE_URL: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  MQ_URL: envVars.MQ_URL,
  LOG_LEVEL: envVars.LOG_LEVEL,
  DATABASE_URL: envVars.DATABASE_URL,
};
