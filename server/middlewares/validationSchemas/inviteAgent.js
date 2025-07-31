const Joi = require("joi");

const inviteAgent = Joi.object({
  agencyId: Joi.string().required(),
  code: Joi.string().required(),
  otp: Joi.string().required(),
});

module.exports = inviteAgent;
