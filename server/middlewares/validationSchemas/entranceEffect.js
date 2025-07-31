const Joi = require("joi");

const entranceEffect = Joi.object({
  name: Joi.string()
    .required()
    .min(1) 
    .messages({
      "string.empty": "Name cannot be an empty string",
      "any.required": "Name is required",
    }),
  
    category: Joi.string()
    .valid("Normal", "Low", "Best", "Very Best", "High Class", "Top Class")
    .required()
    .messages({
      "any.required": "Category is required",
      "string.empty": "Category cannot be an empty string",
    }),
    rangeStart: Joi.number(),
    rangeEnd: Joi.number(),
});

module.exports = entranceEffect;

