const Joi = require("joi");

const reactMessage = Joi.object({
  userId: Joi.string().required(),
  messageId: Joi.string().required(),
  emoji: Joi.string().required(),
});

module.exports = reactMessage;