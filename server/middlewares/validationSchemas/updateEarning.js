const Joi = require("joi");

const otp = Joi.object({
  totalEarning: Joi.number().required(),
  time: Joi.string()
  .messages({
    "any.required": "time is required",
    "string.empty": "time cannot be an empty string",
  })
});

module.exports = otp;