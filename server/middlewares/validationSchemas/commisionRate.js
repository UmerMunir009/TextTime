const Joi = require("joi");

const commisionRateSchema = Joi.object({
  start: Joi.number().required(),
  end: Joi.number().required(),
  rateType: Joi.string().valid("percentage", "fixed").required(),
  incomeType: Joi.string().valid("Host", "Agent").required(),
  earningType: Joi.string()
    .valid(
      "timeReward",
      "hostGiftReceivingCommision",
      "hostWorkingCommision",
      "newHostReward",
      "newHostReward",
      "inviteAgentReward"
    )
    .required(),
    rate: Joi.number().required(),
});

module.exports = commisionRateSchema;
