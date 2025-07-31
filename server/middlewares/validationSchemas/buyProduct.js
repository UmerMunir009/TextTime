const Joi = require("joi");

const schema = Joi.object({
  productId: Joi.string().uuid().required().messages({
    "string.base": "Product ID must be a string.",
    "string.guid": "Product ID must be a valid UUID.",
    "any.required": "Product ID is required.",
  }),
  duration: Joi.number().valid(1, 7, 30).required().messages({
    "number.base": "Duration must be a number.",
    "any.only": "Duration must be either 1, 7, or 30.",
    "any.required": "Duration is required.",
  }),
  isDirectWear: Joi.boolean().optional().messages({
    "boolean.base": "isDirectWear must be a boolean value.",
  }),
});

module.exports = schema;
