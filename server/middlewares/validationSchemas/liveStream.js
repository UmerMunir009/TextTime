const Joi = require("joi");

const liveStreamValidation = Joi.object({
  isLiveHouse: Joi.boolean()
    .required()
    .messages({
      "any.required": "isLiveHouse is required",
      "boolean.base": "isLiveHouse must be a boolean value (true or false)",
    }),

  liveHouseOrder: Joi.number()
    .integer()
    .allow(null)
    .messages({
      "number.base": "liveHouseOrder must be an integer",
      "number.integer": "liveHouseOrder must be an integer value",
    }),
});

module.exports = liveStreamValidation;
