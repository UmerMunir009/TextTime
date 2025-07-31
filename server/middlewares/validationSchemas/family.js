const Joi = require("joi");

const familySchema = Joi.object({
  message: Joi.string().allow('').optional(),
  url: Joi.string().allow('').optional(),
  file: Joi.string().allow('').optional(),
  type: Joi.string().valid("voice", "image", "video", "text", "link", 'file','audio').required(),
  senderId: Joi.string().required(),
  familyId: Joi.string().required(),
});

module.exports = familySchema;
