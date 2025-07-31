const Joi = require("joi");

const pinnedMessage = Joi.object({
  familyId: Joi.string().required(),
});

module.exports = pinnedMessage;