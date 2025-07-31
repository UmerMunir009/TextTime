const Joi = require("joi");

const schema = Joi.object({
  specialId: Joi.string()
    .required()
    .min(1)
    .max(8)
    .pattern(/^[a-zA-Z0-9]+$/) // Alphanumeric pattern
    .messages({
      "string.empty": "Special ID cannot be empty",
      "string.pattern.base": "Special ID cannot contain special characters", // Custom message
    }),

  pictureId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": "Picture ID cannot be empty",
      "any.required": "Picture ID is required",
      "string.guid": "Picture ID must be a valid UUID",
    }),

  price: Joi.number()
    .integer() 
    .positive() 
    .required()
    .messages({
      "any.required": "Price is required",
      "number.base": "Price must be a number",
      "number.integer": "Price must be an integer",
      "number.positive": "Price must be a positive number", 
    }),
});

module.exports = schema;