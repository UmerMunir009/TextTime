const Joi = require("joi");

const guardianValidation = Joi.object({
  packageId: Joi.string().required().messages({
    "string.empty": "packageId cannot be an empty string",
    "any.required": "packageId is required",
  }),

  userId: Joi.string().required().messages({
    "string.empty": "userId cannot be an empty string",
    "any.required": "userId is required",
  }), 
  duration: Joi.string().valid('1 month', '3 months', '6 months', '12 months').required().messages({
    "any.only": "Duration must be one of '1 month', '3 months', '6 months', '12 months'",
    "any.required": "Duration is required"
})
});

module.exports = guardianValidation;
