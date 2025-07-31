const Joi = require("joi");

const otp = Joi.object({
  code: Joi.string().required(),
});

module.exports = otp;
