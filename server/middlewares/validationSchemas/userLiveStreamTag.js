const Joi = require("joi");

const liveStreamTag = Joi.object({
  tagId: Joi.string().required(),
  userId: Joi.string().required(),
  expiredAt : Joi.date().optional()
});

module.exports = liveStreamTag;
