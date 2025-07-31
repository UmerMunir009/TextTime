const Joi = require("joi");

const pkValidation = Joi.object({
  name: Joi.string()
    .required()
    .min(1) // Ensures at least one character is present
    .messages({
      "string.empty": "Name cannot be an empty string",
      "any.required": "Name is required",
    }),
  
  opponentOne: Joi.string().required().messages({
    "any.required": "opponentOne is required",
  }),

  opponentTwo: Joi.string().required().messages({
    "any.required": "opponentTwo is required",
  }),

  pkDate: Joi.string().required().messages({
    "any.required": "pkDate is required",
  }),

  location: Joi.string()
    .valid("Pakistan", "Global")
    .required()
    .messages({
      "any.required": "Location is required",
      "string.empty": "Location cannot be an empty string",
    }),
});

module.exports = pkValidation;

